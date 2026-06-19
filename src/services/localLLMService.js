/**
 * Local LLM Service for GOAT Royalty App
 * 
 * Integrates with Ollama for local LLM inference
 * Supports model management, caching, and GPU acceleration
 * 
 * @module LocalLLMService
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config();

class LocalLLMService {
  constructor(config = {}) {
    // Ollama configuration
    this.config = {
      ollamaHost: config.ollamaHost || process.env.OLLAMA_HOST || 'localhost',
      ollamaPort: config.ollamaPort || process.env.OLLAMA_PORT || 11434,
      baseUrl: config.baseUrl || `http://${process.env.OLLAMA_HOST || 'localhost'}:${process.env.OLLAMA_PORT || 11434}`,
      timeout: config.timeout || 120000, // 2 minutes
      maxRetries: config.maxRetries || 3
    };
    
    // Model registry
    this.models = {
      // Small models (< 7B parameters)
      small: {
        primary: 'phi3:mini',
        alternatives: ['gemma:2b', 'qwen2:1.5b'],
        use: 'quick-tasks'
      },
      
      // Medium models (7-13B parameters)
      medium: {
        primary: 'llama3.1:8b',
        alternatives: ['mistral:7b', 'qwen2:7b', 'phi3:medium'],
        use: 'general-tasks'
      },
      
      // Large models (30-70B parameters)
      large: {
        primary: 'llama3.1:70b',
        alternatives: ['mixtral:8x7b', 'qwen2:72b'],
        use: 'complex-tasks'
      },
      
      // Extra large models (400B+ parameters)
      xlarge: {
        primary: 'llama3.1:405b',
        alternatives: ['mixtral:8x22b'],
        use: 'expert-tasks'
      },
      
      // Specialized models
      specialized: {
        code: 'deepseek-coder:33b',
        reasoning: 'llama3.1:70b',
        multilingual: 'qwen2:72b',
        math: 'phi3:medium',
        creative: 'llama3.1:8b'
      }
    };
    
    // Model cache
    this.modelCache = new Map();
    this.responseCache = new Map();
    
    // Download status
    this.downloadQueue = [];
    this.downloading = false;
    
    // Performance metrics
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      modelUsage: {}
    };
    
    // Initialize axios instance
    this.axios = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout
    });
    
    // Add retry interceptor
    this.axios.interceptors.response.use(
      response => response,
      async error => {
        if (this.config.maxRetries > 0 && this.shouldRetry(error)) {
          return this.retryRequest(error.config);
        }
        throw error;
      }
    );
  }
  
  /**
   * Check if Ollama is running
   */
  async isRunning() {
    try {
      const response = await this.axios.get('/');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Start Ollama server
   */
  async startServer() {
    return new Promise((resolve, reject) => {
      const ollama = spawn('ollama', ['serve']);
      
      ollama.stdout.on('data', (data) => {
        console.log(`Ollama: ${data}`);
      });
      
      ollama.stderr.on('data', (data) => {
        console.error(`Ollama Error: ${data}`);
      });
      
      ollama.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Ollama exited with code ${code}`));
        }
      });
      
      // Wait for server to be ready
      setTimeout(async () => {
        const running = await this.isRunning();
        if (running) {
          resolve();
        } else {
          reject(new Error('Ollama failed to start'));
        }
      }, 5000);
    });
  }
  
  /**
   * Get list of available models
   */
  async getModels() {
    try {
      const response = await this.axios.get('/api/tags');
      return response.data.models || [];
    } catch (error) {
      throw new Error(`Failed to get models: ${error.message}`);
    }
  }
  
  /**
   * Download a model
   */
  async downloadModel(modelName, onProgress) {
    try {
      const response = await this.axios.post('/api/pull', {
        name: modelName,
        stream: true
      }, {
        responseType: 'stream'
      });
      
      return new Promise((resolve, reject) => {
        let totalSize = 0;
        let completedSize = 0;
        
        response.data.on('data', (chunk) => {
          try {
            const data = JSON.parse(chunk.toString());
            
            if (data.total) {
              totalSize = data.total;
            }
            
            if (data.completed) {
              completedSize = data.completed;
              
              if (onProgress) {
                onProgress({
                  modelName,
                  completed: completedSize,
                  total: totalSize,
                  percentage: totalSize > 0 ? (completedSize / totalSize * 100).toFixed(2) : 0,
                  status: data.status || 'downloading'
                });
              }
            }
            
            if (data.status === 'success') {
              resolve({
                modelName,
                success: true,
                message: 'Model downloaded successfully'
              });
            }
          } catch (e) {
            // Ignore parse errors for progress updates
          }
        });
        
        response.data.on('end', () => {
          resolve({
            modelName,
            success: true,
            message: 'Model download complete'
          });
        });
        
        response.data.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Failed to download model: ${error.message}`);
    }
  }
  
  /**
   * Delete a model
   */
  async deleteModel(modelName) {
    try {
      await this.axios.delete(`/api/delete`, {
        data: { name: modelName }
      });
      
      return {
        success: true,
        message: `Model ${modelName} deleted successfully`
      };
    } catch (error) {
      throw new Error(`Failed to delete model: ${error.message}`);
    }
  }
  
  /**
   * Generate chat completion
   */
  async generateChat(messages, options = {}) {
    const startTime = Date.now();
    
    try {
      this.metrics.totalRequests++;
      
      const {
        model = 'llama3.1:8b',
        stream = false,
        temperature = 0.7,
        top_p = 0.9,
        max_tokens = 2048,
        useCache = true
      } = options;
      
      // Check cache
      if (useCache) {
        const cacheKey = this.getCacheKey(model, messages, options);
        const cached = this.responseCache.get(cacheKey);
        if (cached) {
          return cached;
        }
      }
      
      // Generate response
      const response = await this.axios.post('/api/chat', {
        model,
        messages,
        stream,
        options: {
          temperature,
          top_p,
          num_predict: max_tokens
        }
      });
      
      const result = {
        content: response.data.message?.content || response.data.response,
        model: response.data.model,
        done: response.data.done,
        usage: {
          prompt_tokens: response.data.prompt_eval_count,
          completion_tokens: response.data.eval_count,
          total_tokens: response.data.prompt_eval_count + response.data.eval_count
        },
        responseTime: Date.now() - startTime
      };
      
      // Update metrics
      this.metrics.successfulRequests++;
      this.updateAverageTime(result.responseTime);
      this.updateModelUsage(model);
      
      // Cache response
      if (useCache) {
        const cacheKey = this.getCacheKey(model, messages, options);
        this.responseCache.set(cacheKey, result);
      }
      
      return result;
      
    } catch (error) {
      this.metrics.failedRequests++;
      throw new Error(`Failed to generate chat: ${error.message}`);
    }
  }
  
  /**
   * Generate streaming chat completion
   */
  async generateChatStream(messages, options = {}, onChunk) {
    try {
      const {
        model = 'llama3.1:8b',
        temperature = 0.7,
        top_p = 0.9,
        max_tokens = 2048
      } = options;
      
      const response = await this.axios.post('/api/chat', {
        model,
        messages,
        stream: true,
        options: {
          temperature,
          top_p,
          num_predict: max_tokens
        }
      }, {
        responseType: 'stream'
      });
      
      return new Promise((resolve, reject) => {
        let fullContent = '';
        
        response.data.on('data', (chunk) => {
          try {
            const data = JSON.parse(chunk.toString());
            
            if (data.message?.content) {
              const content = data.message.content;
              fullContent += content;
              
              if (onChunk) {
                onChunk(content);
              }
            }
            
            if (data.done) {
              resolve({
                content: fullContent,
                model: data.model,
                done: true,
                usage: {
                  prompt_tokens: data.prompt_eval_count,
                  completion_tokens: data.eval_count,
                  total_tokens: data.prompt_eval_count + data.eval_count
                }
              });
            }
          } catch (e) {
            // Ignore parse errors
          }
        });
        
        response.data.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Failed to generate streaming chat: ${error.message}`);
    }
  }
  
  /**
   * Generate embeddings
   */
  async generateEmbeddings(text, model = 'nomic-embed-text') {
    try {
      const response = await this.axios.post('/api/embeddings', {
        model,
        prompt: typeof text === 'string' ? text : text.join(' ')
      });
      
      return response.data.embedding;
    } catch (error) {
      throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
  }
  
  /**
   * Select optimal model based on task
   */
  selectModel(taskType, complexity = 'medium') {
    const taskMap = {
      'quick': this.models.small.primary,
      'general': this.models.medium.primary,
      'complex': this.models.large.primary,
      'expert': this.models.xlarge.primary,
      'code': this.models.specialized.code,
      'reasoning': this.models.specialized.reasoning,
      'multilingual': this.models.specialized.multilingual,
      'math': this.models.specialized.math,
      'creative': this.models.specialized.creative
    };
    
    const complexityMap = {
      'low': this.models.small.primary,
      'medium': this.models.medium.primary,
      'high': this.models.large.primary,
      'expert': this.models.xlarge.primary
    };
    
    return taskMap[taskType] || complexityMap[complexity] || this.models.medium.primary;
  }
  
  /**
   * Get cache key
   */
  getCacheKey(model, messages, options) {
    return `${model}:${JSON.stringify(messages)}:${JSON.stringify(options)}`;
  }
  
  /**
   * Check if request should be retried
   */
  shouldRetry(error) {
    return (
      !error.response ||
      error.response.status === 429 ||
      error.response.status >= 500 ||
      error.code === 'ECONNABORTED'
    );
  }
  
  /**
   * Retry request
   */
  async retryRequest(config, retryCount = 0) {
    const delay = Math.pow(2, retryCount) * 1000;
    await this.sleep(delay);
    
    try {
      return await this.axios(config);
    } catch (error) {
      if (retryCount < this.config.maxRetries) {
        return this.retryRequest(config, retryCount + 1);
      }
      throw error;
    }
  }
  
  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Update average response time
   */
  updateAverageTime(newTime) {
    const currentAvg = this.metrics.averageResponseTime;
    const totalRequests = this.metrics.totalRequests;
    
    this.metrics.averageResponseTime = 
      ((currentAvg * (totalRequests - 1)) + newTime) / totalRequests;
  }
  
  /**
   * Update model usage statistics
   */
  updateModelUsage(model) {
    if (!this.metrics.modelUsage[model]) {
      this.metrics.modelUsage[model] = 0;
    }
    this.metrics.modelUsage[model]++;
  }
  
  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalRequests > 0 
        ? (this.metrics.successfulRequests / this.metrics.totalRequests * 100).toFixed(2)
        : 0,
      cacheSize: this.responseCache.size,
      modelsAvailable: Object.keys(this.models).length
    };
  }
  
  /**
   * Clear cache
   */
  clearCache() {
    this.responseCache.clear();
  }
  
  /**
   * Health check
   */
  async healthCheck() {
    const running = await this.isRunning();
    const models = running ? await this.getModels() : [];
    
    return {
      status: running ? 'healthy' : 'unhealthy',
      ollamaRunning: running,
      modelsAvailable: models.length,
      models: models.map(m => m.name),
      baseUrl: this.config.baseUrl,
      metrics: this.getMetrics()
    };
  }
}

module.exports = LocalLLMService;