/**
 * Local LLM Service Routes
 * Exposes Ollama-based local LLM functionality through REST API
 * 
 * Routes:
 * - GET /health - Check Ollama status
 * - GET /models - List available models
 * - POST /models/download - Download a model
 * - DELETE /models/:name - Delete a model
 * - POST /chat - Generate chat completion
 * - POST /stream - Stream chat completion
 * - GET /info/:model - Get model information
 */

const express = require('express');
const router = express.Router();
const localLLMService = require('../services/localLLMService');

// Initialize service
const llmService = new localLLMService.LocalLLMService();

/**
 * GET /health
 * Check if Ollama is running and accessible
 */
router.get('/health', async (req, res) => {
  try {
    const isHealthy = await llmService.checkHealth();
    
    if (isHealthy) {
      const version = await llmService.getVersion();
      res.json({
        status: 'healthy',
        version: version,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'unhealthy',
        message: 'Ollama is not accessible',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /models
 * List all available models
 */
router.get('/models', async (req, res) => {
  try {
    const models = await llmService.listModels();
    res.json({
      success: true,
      count: models.length,
      models: models,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('List models error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /models/download
 * Download a model from Ollama registry
 * Body: { name: string, stream: boolean }
 */
router.post('/models/download', async (req, res) => {
  try {
    const { name, stream = true } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Model name is required'
      });
    }
    
    if (stream) {
      // Stream download progress
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      await llmService.downloadModel(name, (progress) => {
        res.write(`data: ${JSON.stringify(progress)}\n\n`);
      });
      
      res.write('data: {"status":"completed"}\n\n');
      res.end();
    } else {
      // Non-streaming download
      await llmService.downloadModel(name);
      res.json({
        success: true,
        message: `Model ${name} downloaded successfully`,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Download model error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
});

/**
 * DELETE /models/:name
 * Delete a model from local storage
 */
router.delete('/models/:name', async (req, res) => {
  try {
    const { name } = req.params;
    await llmService.deleteModel(name);
    
    res.json({
      success: true,
      message: `Model ${name} deleted successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Delete model error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /info/:model
 * Get detailed information about a specific model
 */
router.get('/info/:model', async (req, res) => {
  try {
    const { model } = req.params;
    const info = await llmService.showModelInfo(model);
    
    res.json({
      success: true,
      model: info,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get model info error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /chat
 * Generate a chat completion
 * Body: { model, messages, options }
 */
router.post('/chat', async (req, res) => {
  try {
    const { model, messages, options = {} } = req.body;
    
    if (!model) {
      return res.status(400).json({
        success: false,
        message: 'Model name is required'
      });
    }
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required'
      });
    }
    
    const startTime = Date.now();
    const response = await llmService.generateChat(messages, {
      model,
      ...options
    });
    const endTime = Date.now();
    
    res.json({
      success: true,
      model: model,
      response: response,
      metadata: {
        generationTime: endTime - startTime,
        tokens: {
          prompt: response.prompt_eval_count || 0,
          completion: response.eval_count || 0,
          total: (response.prompt_eval_count || 0) + (response.eval_count || 0)
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chat generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /stream
 * Stream chat completion in real-time
 * Body: { model, messages, options }
 */
router.post('/stream', async (req, res) => {
  try {
    const { model, messages, options = {} } = req.body;
    
    if (!model) {
      return res.status(400).json({
        success: false,
        message: 'Model name is required'
      });
    }
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required'
      });
    }
    
    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const startTime = Date.now();
    let fullResponse = '';
    let tokenCount = 0;
    
    await llmService.generateChatStream(messages, {
      model,
      ...options
    }, (chunk) => {
      tokenCount++;
      fullResponse += chunk.response;
      
      res.write(`data: ${JSON.stringify({
        type: 'chunk',
        content: chunk.response,
        done: chunk.done,
        timestamp: new Date().toISOString()
      })}\n\n`);
      
      if (chunk.done) {
        const endTime = Date.now();
        res.write(`data: ${JSON.stringify({
          type: 'done',
          metadata: {
            generationTime: endTime - startTime,
            tokens: tokenCount,
            timestamp: new Date().toISOString()
          }
        })}\n\n`);
        res.end();
      }
    });
    
  } catch (error) {
    console.error('Stream chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
});

/**
 * GET /stats
 * Get statistics about the local LLM service
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await llmService.getStats();
    res.json({
      success: true,
      stats: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /cache/clear
 * Clear the response cache
 */
router.post('/cache/clear', async (req, res) => {
  try {
    llmService.clearCache();
    res.json({
      success: true,
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;