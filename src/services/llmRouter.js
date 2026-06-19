/**
 * LLM Router for GOAT Royalty App
 * 
 * Intelligently routes requests between local and external models
 * Implements cost optimization, capability matching, and fallback handling
 * Based on OpenClaw's LLM router architecture
 * 
 * @module LLMRouter
 */

const LocalLLMService = require('./localLLMService');
const NVIDIAService = require('./nvidiaService');

class LLMRouter {
  constructor(config = {}) {
    // Initialize services
    this.localService = new LocalLLMService(config.local);
    this.nvidiaService = new NVIDIAService(config.nvidia);
    
    // Routing configuration
    this.config = {
      preferLocal: config.preferLocal !== false,
      costThreshold: config.costThreshold || 0.50, // $0.50 per 1M tokens
      capabilityThreshold: config.capabilityThreshold || 0.8,
      maxRetries: config.maxRetries || 3,
      enableFallback: config.enableFallback !== false
    };
    
    // Model capabilities mapping
    this.capabilities = {
      // Local models
      'llama3.1:8b': {
        reasoning: 0.7,
        coding: 0.6,
        math: 0.65,
        creative: 0.75,
        multilingual: 0.7,
        speed: 0.9,
        cost: 0.0 // Free
      },
      'llama3.1:70b': {
        reasoning: 0.85,
        coding: 0.75,
        math: 0.8,
        creative: 0.85,
        multilingual: 0.8,
        speed: 0.6,
        cost: 0.0 // Free
      },
      'llama3.1:405b': {
        reasoning: 0.95,
        coding: 0.85,
        math: 0.9,
        creative: 0.9,
        multilingual: 0.85,
        speed: 0.4,
        cost: 0.0 // Free
      },
      'mistral:7b': {
        reasoning: 0.65,
        coding: 0.7,
        math: 0.6,
        creative: 0.7,
        multilingual: 0.65,
        speed: 0.95,
        cost: 0.0 // Free
      },
      'mixtral:8x7b': {
        reasoning: 0.8,
        coding: 0.8,
        math: 0.75,
        creative: 0.8,
        multilingual: 0.75,
        speed: 0.7,
        cost: 0.0 // Free
      },
      'phi3:mini': {
        reasoning: 0.6,
        coding: 0.55,
        math: 0.7,
        creative: 0.5,
        multilingual: 0.5,
        speed: 1.0,
        cost: 0.0 // Free
      },
      'deepseek-coder:33b': {
        reasoning: 0.7,
        coding: 0.95,
        math: 0.65,
        creative: 0.4,
        multilingual: 0.6,
        speed: 0.5,
        cost: 0.0 // Free
      },
      
      // External models (NVIDIA)
      'meta/llama-3.1-405b-instruct': {
        reasoning: 0.95,
        coding: 0.9,
        math: 0.9,
        creative: 0.9,
        multilingual: 0.85,
        speed: 0.5,
        cost: 0.00002 // $0.02 per 1K tokens
      },
      'microsoft/phi-3-medium-128k-instruct': {
        reasoning: 0.75,
        coding: 0.7,
        math: 0.8,
        creative: 0.65,
        multilingual: 0.6,
        speed: 0.9,
        cost: 0.000005 // $0.005 per 1K tokens
      },
      'mistralai/mixtral-8x22b-instruct-v0.1': {
        reasoning: 0.9,
        coding: 0.85,
        math: 0.85,
        creative: 0.85,
        multilingual: 0.8,
        speed: 0.6,
        cost: 0.000015 // $0.015 per 1K tokens
      }
    };
    
    // Task type to capability mapping
    this.taskCapabilities = {
      'reasoning': 'reasoning',
      'coding': 'coding',
      'programming': 'coding',
      'math': 'math',
      'calculation': 'math',
      'creative': 'creative',
      'writing': 'creative',
      'multilingual': 'multilingual',
      'translation': 'multilingual',
      'general': 'creative'
    };
    
    // Request queue
    this.requestQueue = [];
    this.processing = false;
    
    // Metrics
    this.metrics = {
      totalRequests: 0,
      localRequests: 0,
      externalRequests: 0,
      fallbackRequests: 0,
      totalCost: 0.0,
      averageResponseTime: 0
    };
  }
  
  /**
   * Route a request to the optimal model
   */
  async routeRequest(messages, options = {}) {
    const startTime = Date.now();
    this.metrics.totalRequests++;
    
    try {
      // Analyze task requirements
      const taskAnalysis = this.analyzeTask(messages, options);
      
      // Select optimal model
      const modelSelection = this.selectModel(taskAnalysis);
      
      // Route to selected service
      let result;
      if (modelSelection.source === 'local') {
        result = await this.routeToLocal(modelSelection.model, messages, options);
        this.metrics.localRequests++;
      } else {
        result = await this.routeToExternal(modelSelection.model, messages, options);
        this.metrics.externalRequests++;
      }
      
      // Update metrics
      const responseTime = Date.now() - startTime;
      this.updateAverageTime(responseTime);
      
      return {
        ...result,
        routing: {
          source: modelSelection.source,
          model: modelSelection.model,
          reason: modelSelection.reason,
          taskAnalysis
        }
      };
      
    } catch (error) {
      // Fallback handling
      if (this.config.enableFallback) {
        return await this.handleFallback(messages, options, error);
      }
      throw error;
    }
  }
  
  /**
   * Analyze task requirements
   */
  analyzeTask(messages, options) {
    const lastMessage = messages[messages.length - 1]?.content || '';
    const lowerContent = lastMessage.toLowerCase();
    
    // Detect task type
    let taskType = 'general';
    const taskKeywords = {
      'reasoning': ['reason', 'think', 'analyze', 'explain why', 'how does', 'why does'],
      'coding': ['code', 'function', 'program', 'script', 'debug', 'fix', 'implement'],
      'math': ['calculate', 'compute', 'solve', 'mathematical', 'equation', 'formula'],
      'creative': ['write', 'create', 'story', 'poem', 'creative', 'design'],
      'multilingual': ['translate', 'language', 'french', 'spanish', 'german', 'chinese']
    };
    
    for (const [type, keywords] of Object.entries(taskKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        taskType = type;
        break;
      }
    }
    
    // Estimate complexity
    let complexity = 'medium';
    const messageLength = lastMessage.length;
    
    if (options.complexity) {
      complexity = options.complexity;
    } else if (messageLength < 100) {
      complexity = 'low';
    } else if (messageLength > 500) {
      complexity = 'high';
    }
    
    // Estimate token count
    const estimatedTokens = Math.ceil(messageLength / 4);
    
    return {
      taskType,
      complexity,
      estimatedTokens,
      content: lastMessage,
      options
    };
  }
  
  /**
   * Select optimal model based on task analysis
   */
  selectModel(taskAnalysis) {
    const { taskType, complexity, estimatedTokens } = taskAnalysis;
    const requiredCapability = this.taskCapabilities[taskType] || 'creative';
    const threshold = this.config.capabilityThreshold;
    
    // Get available models
    const localModels = Object.keys(this.capabilities).filter(m => 
      this.capabilities[m].cost === 0 && this.capabilities[m][requiredCapability] >= threshold * 0.7
    );
    
    const externalModels = Object.keys(this.capabilities).filter(m => 
      this.capabilities[m].cost > 0 && this.capabilities[m][requiredCapability] >= threshold
    );
    
    // Try local first if preferred
    if (this.config.preferLocal && localModels.length > 0) {
      // Find best local model
      const bestLocal = localModels.reduce((best, current) => {
        const currentScore = this.capabilities[current][requiredCapability];
        const bestScore = this.capabilities[best][requiredCapability];
        return currentScore > bestScore ? current : best;
      });
      
      // Check if local model meets capability threshold
      if (this.capabilities[bestLocal][requiredCapability] >= threshold * 0.8) {
        return {
          source: 'local',
          model: bestLocal,
          reason: `Local model meets requirements (${this.capabilities[bestLocal][requiredCapability]} >= ${threshold * 0.8})`,
          confidence: this.capabilities[bestLocal][requiredCapability]
        };
      }
    }
    
    // Use external model for high capability requirements
    if (externalModels.length > 0) {
      const bestExternal = externalModels.reduce((best, current) => {
        const currentScore = this.capabilities[current][requiredCapability];
        const bestScore = this.capabilities[best][requiredCapability];
        // Consider cost as secondary factor
        const currentCost = this.capabilities[current].cost;
        const bestCost = this.capabilities[best].cost;
        
        if (currentScore === bestScore) {
          return currentCost < bestCost ? current : best;
        }
        return currentScore > bestScore ? current : best;
      });
      
      // Estimate cost
      const costPerToken = this.capabilities[bestExternal].cost;
      const estimatedCost = estimatedTokens * costPerToken;
      
      if (estimatedCost <= this.config.costThreshold || complexity === 'expert') {
        return {
          source: 'external',
          model: bestExternal,
          reason: `External model provides higher capability (${this.capabilities[bestExternal][requiredCapability]} >= ${threshold})`,
          confidence: this.capabilities[bestExternal][requiredCapability],
          estimatedCost
        };
      }
    }
    
    // Fallback to best local model
    const bestLocal = localModels.reduce((best, current) => {
      const currentScore = this.capabilities[current][requiredCapability];
      const bestScore = this.capabilities[best][requiredCapability];
      return currentScore > bestScore ? current : best;
    });
    
    return {
      source: 'local',
      model: bestLocal,
      reason: 'Using best available local model (cost-effective)',
      confidence: this.capabilities[bestLocal][requiredCapability]
    };
  }
  
  /**
   * Route to local LLM service
   */
  async routeToLocal(model, messages, options) {
    try {
      const result = await this.localService.generateChat(messages, {
        ...options,
        model
      });
      
      return {
        ...result,
        source: 'local',
        cost: 0.0
      };
    } catch (error) {
      throw new Error(`Local LLM error: ${error.message}`);
    }
  }
  
  /**
   * Route to external LLM service
   */
  async routeToExternal(model, messages, options) {
    try {
      const result = await this.nvidiaService.generateChat(messages, {
        ...options,
        model: this.mapNvidiaModel(model)
      });
      
      // Calculate cost
      const costPerToken = this.capabilities[model]?.cost || 0;
      const totalTokens = result.usage.total_tokens || 0;
      const cost = totalTokens * costPerToken;
      
      this.metrics.totalCost += cost;
      
      return {
        ...result,
        source: 'external',
        cost
      };
    } catch (error) {
      throw new Error(`External LLM error: ${error.message}`);
    }
  }
  
  /**
   * Map model name to NVIDIA format
   */
  mapNvidiaModel(model) {
    const modelMap = {
      'meta/llama-3.1-405b-instruct': 'primary',
      'microsoft/phi-3-medium-128k-instruct': 'long',
      'mistralai/mixtral-8x22b-instruct-v0.1': 'reasoning'
    };
    return modelMap[model] || 'primary';
  }
  
  /**
   * Handle fallback scenarios
   */
  async handleFallback(messages, options, error) {
    this.metrics.fallbackRequests++;
    
    // Try opposite service
    try {
      if (error.message.includes('local')) {
        console.log('Falling back to external model...');
        const fallbackModel = 'meta/llama-3.1-405b-instruct';
        const result = await this.routeToExternal(fallbackModel, messages, options);
        return {
          ...result,
          fallback: true,
          fallbackReason: error.message
        };
      } else {
        console.log('Falling back to local model...');
        const fallbackModel = 'llama3.1:8b';
        const result = await this.routeToLocal(fallbackModel, messages, options);
        return {
          ...result,
          fallback: true,
          fallbackReason: error.message
        };
      }
    } catch (fallbackError) {
      throw new Error(`Both primary and fallback models failed: ${error.message}, ${fallbackError.message}`);
    }
  }
  
  /**
   * Generate streaming response
   */
  async routeStreamRequest(messages, options = {}, onChunk) {
    const taskAnalysis = this.analyzeTask(messages, options);
    const modelSelection = this.selectModel(taskAnalysis);
    
    if (modelSelection.source === 'local') {
      return await this.localService.generateChatStream(messages, options, onChunk);
    } else {
      return await this.nvidiaService.generateChatStream(messages, options, onChunk);
    }
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
   * Get routing metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      localPercentage: this.metrics.totalRequests > 0 
        ? (this.metrics.localRequests / this.metrics.totalRequests * 100).toFixed(2)
        : 0,
      externalPercentage: this.metrics.totalRequests > 0 
        ? (this.metrics.externalRequests / this.metrics.totalRequests * 100).toFixed(2)
        : 0,
      averageCostPerRequest: this.metrics.totalRequests > 0 
        ? (this.metrics.totalCost / this.metrics.totalRequests).toFixed(4)
        : 0,
      savedCost: this.metrics.localRequests * 0.02 // Assuming $0.02 avg per request
    };
  }
  
  /**
   * Get model capabilities
   */
  getModelCapabilities() {
    return this.capabilities;
  }
  
  /**
   * Update routing configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
  
  /**
   * Health check
   */
  async healthCheck() {
    const localHealth = await this.localService.healthCheck();
    const nvidiaHealth = this.nvidiaService.healthCheck();
    
    return {
      status: (localHealth.status === 'healthy' || nvidiaHealth.status === 'healthy') 
        ? 'operational' 
        : 'degraded',
      local: localHealth,
      external: nvidiaHealth,
      config: this.config,
      metrics: this.getMetrics()
    };
  }
}

module.exports = LLMRouter;