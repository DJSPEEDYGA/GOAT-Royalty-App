/**
 * LLM Router Service Routes
 * Exposes intelligent routing between local and external LLMs
 * 
 * Routes:
 * - POST /route - Route request to optimal model
 * - POST /stream - Stream routed request
 * - GET /metrics - Get routing metrics
 * - GET /health - Health check
 * - GET /models - List all available models (local + external)
 * - POST /analyze - Analyze task requirements
 * - GET /config - Get router configuration
 */

const express = require('express');
const router = express.Router();
const llmRouterService = require('../services/llmRouter');
const localLLMService = require('../services/localLLMService');
const nvidiaService = require('../services/nvidiaService');

// Initialize services
const routerService = new llmRouterService.LLMRouter({
  localLLM: new localLLMService.LocalLLMService(),
  nvidiaService: new nvidiaService.NVIDIAService()
});

/**
 * POST /route
 * Route a request to the optimal model based on task analysis
 * Body: { messages, options, forceModel?, priority? }
 */
router.post('/route', async (req, res) => {
  try {
    const { messages, options = {}, forceModel, priority } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required'
      });
    }
    
    const startTime = Date.now();
    
    // Route the request
    const result = await routerService.routeRequest(messages, {
      ...options,
      forceModel,
      priority
    });
    
    const endTime = Date.now();
    
    res.json({
      success: true,
      model: result.model,
      provider: result.provider,
      response: result.response,
      routing: {
        decision: result.routingDecision,
        reasoning: result.routingReasoning,
        cost: result.estimatedCost
      },
      metadata: {
        totalLatency: endTime - startTime,
        generationLatency: result.metadata?.generationTime,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Route request error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /stream
 * Stream a routed request to the optimal model
 * Body: { messages, options, forceModel?, priority? }
 */
router.post('/stream', async (req, res) => {
  try {
    const { messages, options = {}, forceModel, priority } = req.body;
    
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
    let routingDecision = null;
    
    // Get routing decision first
    try {
      const taskAnalysis = routerService.analyzeTask(messages, options);
      routingDecision = routerService.selectModel(taskAnalysis);
      
      res.write(`data: ${JSON.stringify({
        type: 'routing',
        decision: routingDecision,
        timestamp: new Date().toISOString()
      })}\n\n`);
    } catch (routeError) {
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: `Routing error: ${routeError.message}`,
        timestamp: new Date().toISOString()
      })}\n\n`);
      res.end();
      return;
    }
    
    // Execute the routed request
    try {
      if (routingDecision.provider === 'local') {
        await routerService.services.localLLM.generateChatStream(messages, {
          model: routingDecision.model,
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
                provider: 'local',
                model: routingDecision.model,
                timestamp: new Date().toISOString()
              }
            })}\n\n`);
            res.end();
          }
        });
      } else if (routingDecision.provider === 'nvidia') {
        const stream = await routerService.services.nvidia.generateChatStream(messages, {
          model: routingDecision.model,
          ...options
        });
        
        for await (const chunk of stream) {
          if (chunk.choices && chunk.choices[0]?.delta?.content) {
            tokenCount++;
            const content = chunk.choices[0].delta.content;
            fullResponse += content;
            
            res.write(`data: ${JSON.stringify({
              type: 'chunk',
              content: content,
              timestamp: new Date().toISOString()
            })}\n\n`);
          }
          
          if (chunk.choices && chunk.choices[0]?.finish_reason) {
            const endTime = Date.now();
            res.write(`data: ${JSON.stringify({
              type: 'done',
              metadata: {
                generationTime: endTime - startTime,
                tokens: tokenCount,
                provider: 'nvidia',
                model: routingDecision.model,
                timestamp: new Date().toISOString()
              }
            })}\n\n`);
            res.end();
            break;
          }
        }
      }
    } catch (executionError) {
      console.error('Execution error:', executionError);
      
      // Try fallback if available
      if (routingDecision.fallback && routingDecision.fallback !== routingDecision.model) {
        try {
          res.write(`data: ${JSON.stringify({
            type: 'fallback',
            message: `Primary model failed, falling back to ${routingDecision.fallback}`,
            timestamp: new Date().toISOString()
          })}\n\n`);
          
          // Execute fallback
          const fallbackResult = await routerService.executeRequest(messages, {
            model: routingDecision.fallback,
            provider: routingDecision.provider,
            options
          });
          
          res.write(`data: ${JSON.stringify({
            type: 'chunk',
            content: fallbackResult.response,
            done: true,
            timestamp: new Date().toISOString()
          })}\n\n`);
          
          const endTime = Date.now();
          res.write(`data: ${JSON.stringify({
            type: 'done',
            metadata: {
              generationTime: endTime - startTime,
              tokens: fallbackResult.metadata?.tokens || 0,
              provider: routingDecision.provider,
              model: routingDecision.fallback,
              fallbackUsed: true,
              timestamp: new Date().toISOString()
            }
          })}\n\n`);
          res.end();
        } catch (fallbackError) {
          res.write(`data: ${JSON.stringify({
            type: 'error',
            message: `Fallback also failed: ${fallbackError.message}`,
            timestamp: new Date().toISOString()
          })}\n\n`);
          res.end();
        }
      } else {
        res.write(`data: ${JSON.stringify({
          type: 'error',
          message: `Execution failed: ${executionError.message}`,
          timestamp: new Date().toISOString()
        })}\n\n`);
        res.end();
      }
    }
    
  } catch (error) {
    console.error('Stream route error:', error);
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
 * GET /metrics
 * Get routing metrics and statistics
 */
router.get('/metrics', async (req, res) => {
  try {
    const metrics = routerService.getMetrics();
    res.json({
      success: true,
      metrics: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /health
 * Health check for router and all connected services
 */
router.get('/health', async (req, res) => {
  try {
    const healthChecks = {
      router: { status: 'healthy' },
      localLLM: {},
      nvidia: {}
    };
    
    // Check local LLM
    try {
      const localHealthy = await routerService.services.localLLM.checkHealth();
      healthChecks.localLLM = {
        status: localHealthy ? 'healthy' : 'unhealthy',
        available: localHealthy
      };
    } catch (error) {
      healthChecks.localLLM = {
        status: 'error',
        message: error.message
      };
    }
    
    // Check NVIDIA service
    try {
      const nvidiaModels = await routerService.services.nvidia.listModels();
      healthChecks.nvidia = {
        status: 'healthy',
        available: true,
        modelCount: nvidiaModels.length
      };
    } catch (error) {
      healthChecks.nvidia = {
        status: 'error',
        message: error.message
      };
    }
    
    // Overall health
    const overallHealthy = 
      healthChecks.router.status === 'healthy' &&
      (healthChecks.localLLM.status === 'healthy' || healthChecks.nvidia.status === 'healthy');
    
    res.status(overallHealthy ? 200 : 503).json({
      success: overallHealthy,
      status: overallHealthy ? 'healthy' : 'degraded',
      services: healthChecks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /models
 * List all available models from all providers
 */
router.get('/models', async (req, res) => {
  try {
    const models = {
      local: [],
      nvidia: [],
      total: 0
    };
    
    // Get local models
    try {
      const localModels = await routerService.services.localLLM.listModels();
      models.local = localModels.map(m => ({
        name: m.name,
        provider: 'local',
        size: m.size,
        modified_at: m.modified_at
      }));
    } catch (error) {
      console.error('Error fetching local models:', error);
    }
    
    // Get NVIDIA models
    try {
      const nvidiaModels = await routerService.services.nvidia.listModels();
      models.nvidia = nvidiaModels.map(m => ({
        name: m.id || m.name,
        provider: 'nvidia',
        displayName: m.display_name || m.name
      }));
    } catch (error) {
      console.error('Error fetching NVIDIA models:', error);
    }
    
    models.total = models.local.length + models.nvidia.length;
    
    res.json({
      success: true,
      models: models,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get models error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /analyze
 * Analyze a task to determine routing requirements
 * Body: { messages, options }
 */
router.post('/analyze', async (req, res) => {
  try {
    const { messages, options = {} } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: 'Messages array is required'
      });
    }
    
    const analysis = routerService.analyzeTask(messages, options);
    const modelSelection = routerService.selectModel(analysis);
    
    res.json({
      success: true,
      taskAnalysis: analysis,
      recommendedModel: modelSelection,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analyze task error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /config
 * Get current router configuration
 */
router.get('/config', async (req, res) => {
  try {
    const config = {
      mode: routerService.config.mode,
      fallbackEnabled: routerService.config.fallbackEnabled,
      costOptimization: routerService.config.costOptimization,
      capabilityMatching: routerService.config.capabilityMatching,
      providers: {
        local: {
          enabled: routerService.services.localLLM !== null,
          models: []
        },
        nvidia: {
          enabled: routerService.services.nvidiaService !== null,
          models: []
        }
      }
    };
    
    res.json({
      success: true,
      config: config,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /metrics/reset
 * Reset routing metrics
 */
router.post('/metrics/reset', async (req, res) => {
  try {
    routerService.resetMetrics();
    res.json({
      success: true,
      message: 'Metrics reset successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Reset metrics error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;