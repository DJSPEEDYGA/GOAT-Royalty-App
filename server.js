const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
require('dotenv').config();
const aiConfig = require('./lib/ai/ai-config');

// Structured logger (winston is already a project dependency)
let logger;
try {
    const winston = require('winston');
    logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`)
        ),
        transports: [new winston.transports.Console()]
    });
} catch {
    // Fallback if winston is unavailable
    logger = {
        info: (...a) => console.log('[INFO]', ...a),
        warn: (...a) => console.warn('[WARN]', ...a),
        error: (...a) => console.error('[ERROR]', ...a)
    };
}

// AI & ML Components
const nvidiaClient = require('./lib/nvidia/nvidia-nim-client');
const ragSystem = require('./lib/rag/rag-system');
const agentManager = require('./lib/agents/autonomous-agent-manager');
const rateLimit = require('express-rate-limit');
const {
    RevenueData,
    NFTPortfolio,
    CollaborationHub,
    MarketAnalysis
} = require('./lib/models/data-models');

// Unified data access layer
const goatData = require('./lib/goat-data');

// New Feature Modules
const cryptoMining = require('./lib/mining/crypto-mining');
const videoEditor = require('./lib/video/video-editor');
const dspDistribution = require('./lib/dsp/dsp-distribution');
const agent007Routes = require('./lib/agent-007/agent-007-routes');
const casinoRoutes = require('./lib/casino/casino-routes');
const gamingRoutes = require('./lib/gaming/gaming-routes');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Rate limiter: max 100 requests per minute per IP for API routes
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// Stricter rate limiter for AI/compute-heavy endpoints
const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many AI requests, please wait before retrying.' }
});

// Initialize data models
const revenueData = new RevenueData();
const nftPortfolio = new NFTPortfolio();
const collaborationHub = new CollaborationHub();
const marketAnalysis = new MarketAnalysis();

// Initialize real data from local data files
initializeRealData();

async function initializeRealData() {
    // Load real catalog and network data
    const catalog = goatData.getMusicCatalog();
    const network = goatData.getNetworkProfiles();
    const catalogStats = goatData.getCatalogStats();
    const networkStats = goatData.getNetworkStats();

    if (catalog && catalog.songs) {
        logger.info(`Loaded ${catalog.songs.length} songs from WAKA FLOCKA FLAME catalog`);
    }

    if (network && network.profiles) {
        logger.info(`Loaded ${network.profiles.length} network profiles with ${network.connections?.length || 0} connections`);
    }

    // Load real revenue data from file
    const revenueFile = goatData.loadDataFile('revenue.json');
    if (revenueFile && revenueFile.platforms) {
        Object.entries(revenueFile.platforms).forEach(([platform, data]) => {
            revenueData.update(platform, data.revenue || 0, {
                streams: data.streams || 0,
                downloads: data.downloads || 0,
                growth: data.growth || 0
            });
        });
        revenueData.growthRate = revenueFile.growthRate || 0;
        logger.info('Loaded real revenue data');
    }

    // Load real NFT portfolio from file
    const nftFile = goatData.loadDataFile('nft-portfolio.json');
    if (nftFile && nftFile.items) {
        nftFile.items.forEach(item => nftPortfolio.addItem(item));
        logger.info(`Loaded ${nftFile.items.length} NFT items`);
    }

    // Load real collaboration data from file
    const collabFile = goatData.loadDataFile('collaboration.json');
    if (collabFile) {
        collabFile.members?.forEach(m => collaborationHub.addMember(m));
        collabFile.projects?.forEach(p => collaborationHub.createProject(p));
        collabFile.files?.forEach(f => collaborationHub.addFile(f));
        logger.info(`Loaded ${collabFile.members?.length || 0} collaborators and ${collabFile.projects?.length || 0} projects`);
    }

    // Load real market analysis data from file
    const marketFile = goatData.loadDataFile('market-trends.json');
    if (marketFile) {
        Object.entries(marketFile.genreTrends || {}).forEach(([genre, data]) => {
            marketAnalysis.updateGenreTrends(genre, data);
        });
        Object.entries(marketFile.platformInsights || {}).forEach(([platform, insights]) => {
            insights.forEach(insight => marketAnalysis.addPlatformInsight(platform, insight));
        });
        marketAnalysis.lastUpdated = marketFile.lastUpdated || new Date();
        logger.info('Loaded real market analysis data');
    }

    // Load real sync opportunities
    const syncOpportunities = goatData.loadDataFile('sync_opportunities.json');
    if (syncOpportunities) {
        logger.info(`Loaded ${syncOpportunities.length || 0} sync opportunities`);
    }

    // Initialize RAG knowledge base with real catalog
    await ragSystem.initializeIndustryKnowledge();

    console.log('Real data initialized successfully');
}

// Middleware
app.use(helmet({
    // Enable Content Security Policy with a policy that allows the app's own
    // assets and the Chart.js CDN used by the dashboard UI.
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",  // required for inline scripts in public/index.html
                'https://cdn.jsdelivr.net'
            ],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'ws:', 'wss:'],
            fontSrc: ["'self'", 'data:'],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
        }
    },
    crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Apply rate limiting to all /api/* routes
app.use('/api/', apiLimiter);
// Tighter limits on compute-heavy AI/RAG/agent endpoints
app.use('/api/ai/', aiLimiter);
app.use('/api/rag/query', aiLimiter);
app.use('/api/nvidia/generate', aiLimiter);
app.use('/api/agents/execute', aiLimiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket for real-time updates
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');
    
    ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to SUPER GOAT ROYALTIES real-time updates'
    }));

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleWebSocketMessage(ws, data);
        } catch (error) {
            console.error('WebSocket message error:', error);
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

function handleWebSocketMessage(ws, data) {
    switch (data.type) {
        case 'subscribe':
            ws.subscriptions = data.channels || [];
            break;
        case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
    }
}

function broadcast(channel, message) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            if (!client.subscriptions || client.subscriptions.includes(channel)) {
                client.send(JSON.stringify({ channel, ...message }));
            }
        }
    });
}

// ==================== API ROUTES ====================

// Health & Status
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        message: 'SUPER GOAT ROYALTIES API is running',
        version: '3.0.0',
        app: 'SUPER GOAT Royalties',
        mode: aiConfig.demoMode ? 'demo' : 'live',
        uptime: process.uptime(),
        features: {
            ai: true,
            nvidia: !aiConfig.demoMode,
            rag: true,
            agents: true,
            websocket: true
        },
        timestamp: new Date().toISOString()
    });
});

// Dashboard
app.get('/api/dashboard', async (req, res) => {
    try {
        const metrics = agentManager.getMetrics() || {};
        const catalogStats = goatData.getCatalogStats();
        const networkStats = goatData.getNetworkStats();
        const catalog = goatData.getMusicCatalog();

        const dashboardData = {
            totalRevenue: revenueData.totalRevenue ?? 0,
            growthRate: revenueData.growthRate ?? 0,
            platforms: revenueData.platforms ?? {},
            contentStats: {
                totalSongs: catalog.songs?.length ?? 0,
                protectedTracks: catalog.songs?.length ?? 0,
                totalShare: catalogStats.total_share ?? 0,
                uniqueLabels: catalogStats.unique_labels ?? 0,
                uniqueAlbums: catalogStats.unique_albums ?? 0,
                networkProfiles: networkStats.total_profiles ?? 0,
                networkConnections: networkStats.total_connections ?? 0
            },
            nftPortfolio: {
                totalValue: nftPortfolio.totalValue ?? 0,
                items: nftPortfolio.items?.length ?? 0,
                chains: Object.keys(nftPortfolio.chains ?? {})
            },
            collaboration: {
                teamMembers: collaborationHub.members?.length ?? 0,
                sharedFiles: collaborationHub.files?.length ?? 0,
                activeProjects: collaborationHub.getActiveProjects?.()?.length ?? 0
            },
            aiFeatures: {
                ragEnabled: true,
                agentsRunning: metrics.activeAgents ?? 0,
                autonomousMode: metrics.autonomousMode ?? false
            },
            casino: casino.state(),
            gamingServer: {
                enabled: gamingServer.enabled,
                name: gamingServer.name,
                type: gamingServer.type,
                status: gamingServer.status
            }
        };

        res.json(dashboardData);
    } catch (error) {
        logger.error(`Dashboard error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// ==================== AI & LLM ENDPOINTS ====================

// AI-powered revenue analysis
app.get('/api/ai/revenue-analysis', async (req, res) => {
    try {
        const analysis = await nvidiaClient.analyzeRoyaltyData({
            totalRevenue: revenueData.totalRevenue ?? 0,
            growthRate: revenueData.growthRate ?? 0,
            platforms: revenueData.platforms ?? {}
        });

        res.json({ analysis });
    } catch (error) {
        logger.error(`AI revenue-analysis failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// AI market predictions
app.get('/api/ai/market-predictions', async (req, res) => {
    try {
        const { genre, platform, timeframe } = req.query;
        const predictions = await nvidiaClient.predictMarketTrends(
            genre || 'Hip-Hop',
            platform || 'Spotify',
            timeframe || '6 months'
        );

        res.json({ predictions });
    } catch (error) {
        logger.error(`AI market-predictions failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// AI content recommendations
app.post('/api/ai/content-recommendations', async (req, res) => {
    try {
        const { artistProfile, currentContent } = req.body;
        const recommendations = await nvidiaClient.generateContentRecommendations(
            artistProfile,
            currentContent
        );

        res.json({ recommendations });
    } catch (error) {
        logger.error(`AI content-recommendations failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// AI contract generation
app.post('/api/ai/generate-contract', async (req, res) => {
    try {
        const { contractType, parties, terms } = req.body;
        const contract = await nvidiaClient.generateContractTerms(
            contractType,
            parties,
            terms
        );

        res.json({ contract });
    } catch (error) {
        logger.error(`AI generate-contract failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// ==================== RAG ENDPOINTS ====================

// RAG query endpoint
app.post('/api/rag/query', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query || typeof query !== 'string' || query.trim() === '') {
            return res.status(400).json({ error: 'query is required and must be a non-empty string' });
        }
        const response = await ragSystem.generateResponse(query);
        
        res.json({ response });
    } catch (error) {
        logger.error(`RAG query failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Add document to knowledge base
app.post('/api/rag/document', async (req, res) => {
    try {
        const { id, content, metadata } = req.body;
        if (!id || !content) {
            return res.status(400).json({ error: 'id and content are required' });
        }
        const result = await ragSystem.addDocument(id, content, metadata);
        
        res.json({ success: true, ...result });
    } catch (error) {
        logger.error(`RAG add-document failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// RAG stats
app.get('/api/rag/stats', (req, res) => {
    res.json(ragSystem.getStats());
});

// ==================== AGENT ENDPOINTS ====================

// Execute agent task
app.post('/api/agents/execute', async (req, res) => {
    try {
        const { agentId, task, context } = req.body;
        const result = await agentManager.executeAgent(agentId, task, context);
        
        res.json({ success: true, result });
    } catch (error) {
        logger.error(`Agent execute failed (agent=${req.body?.agentId}): ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Queue agent task
app.post('/api/agents/queue', (req, res) => {
    const { agentId, task, context } = req.body;
    agentManager.queueTask(agentId, task, context);
    
    res.json({ success: true, message: 'Task queued' });
});

// Agent status
app.get('/api/agents/status', (req, res) => {
    res.json({
        agents: agentManager.getAgentStatus(),
        metrics: agentManager.getMetrics()
    });
});

// Toggle autonomous mode
app.post('/api/agents/autonomous', (req, res) => {
    const { enabled } = req.body;
    agentManager.setAutonomousMode(enabled);
    
    res.json({ success: true, autonomousMode: enabled });
});

// ==================== NVIDIA NIM ENDPOINTS ====================

// Generate text with NVIDIA NIM
app.post('/api/nvidia/generate', async (req, res) => {
    try {
        const { prompt, model, options } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'prompt is required' });
        }
        const result = await nvidiaClient.generateText(prompt, model, options);
        
        res.json({ result });
    } catch (error) {
        logger.error(`NVIDIA generate failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// Get model capabilities
app.get('/api/nvidia/models', (req, res) => {
    res.json(nvidiaClient.getModelCapabilities());
});

// ==================== REVENUE ENDPOINTS ====================

// Revenue predictions
app.get('/api/revenue/predictions', async (req, res) => {
    try {
        // Use AI for enhanced predictions
        const aiAnalysis = await nvidiaClient.analyzeRoyaltyData({
            totalRevenue: revenueData.totalRevenue ?? 0,
            growthRate: revenueData.growthRate ?? 0,
            platforms: revenueData.platforms ?? {}
        });
        const totalRev = revenueData.totalRevenue ?? 0;

        res.json({
            nextMonth: {
                predicted: totalRev * 1.23,
                increase: totalRev * 0.23,
                confidence: 95
            },
            opportunities: [
                { platform: 'TikTok', potential: 25000, priority: 'high' },
                { platform: 'Spotify Playlists', potential: 18000, priority: 'high' },
                { platform: 'YouTube Sync', potential: 15000, priority: 'medium' }
            ],
            aiAnalysis: typeof aiAnalysis === 'string' ? aiAnalysis.substring(0, 500) + '...' : ''
        });
    } catch (error) {
        logger.error(`Revenue predictions failed: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// ==================== NFT ENDPOINTS ====================

app.get('/api/nft/portfolio', (req, res) => {
    res.json({
        totalValue: nftPortfolio.totalValue ?? 0,
        items: nftPortfolio.items ?? [],
        chains: nftPortfolio.chains ?? {},
        recentSales: nftPortfolio.salesHistory?.slice(-5) ?? []
    });
});

// ==================== CRYPTO MINING ENDPOINTS ====================

// Get mining stats
app.get('/api/mining/stats', (req, res) => {
    res.json(cryptoMining.getStats());
});

// Get hardware recommendations
app.get('/api/mining/hardware', (req, res) => {
    res.json(cryptoMining.getHardwareRecommendations());
});

// Create miner
app.post('/api/mining/create', (req, res) => {
    try {
        const { coin, type, threads, walletAddress, poolIndex } = req.body;
        const minerId = cryptoMining.createMiner({
            coin,
            type: type || 'cpu',
            threads: threads || 4,
            walletAddress,
            poolIndex
        });
        res.json({ success: true, minerId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start mining
app.post('/api/mining/start', (req, res) => {
    try {
        const { minerId } = req.body;
        const result = cryptoMining.startMining(minerId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Stop mining
app.post('/api/mining/stop', (req, res) => {
    try {
        const { minerId } = req.body;
        const result = cryptoMining.stopMining(minerId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Calculate earnings
app.get('/api/mining/earnings/:minerId', (req, res) => {
    try {
        const earnings = cryptoMining.calculateEarnings(req.params.minerId);
        res.json(earnings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get wallet configuration status
app.get('/api/mining/wallets', (req, res) => {
    try {
        const walletStatus = cryptoMining.getWalletStatus();
        res.json({ wallets: walletStatus, config: cryptoMining.walletConfig.wallets });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update wallet address
app.post('/api/mining/wallets/:coin', (req, res) => {
    try {
        const { address } = req.body;
        const coin = req.params.coin;
        
        if (!address) {
            return res.status(400).json({ error: 'Wallet address is required' });
        }
        
        const success = cryptoMining.setWalletAddress(coin, address);
        if (success) {
            res.json({ success: true, coin, message: `${coin} wallet address updated` });
        } else {
            res.status(400).json({ error: `Unsupported coin: ${coin}` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== VIDEO EDITOR ENDPOINTS ====================

// Get effects library
app.get('/api/video/effects', (req, res) => {
    res.json(videoEditor.getEffects());
});

// Get transitions
app.get('/api/video/transitions', (req, res) => {
    res.json(videoEditor.getTransitions());
});

// Get templates
app.get('/api/video/templates', (req, res) => {
    res.json(videoEditor.getTemplates());
});

// Create video project
app.post('/api/video/project', (req, res) => {
    try {
        const project = videoEditor.createProject(req.body);
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get project
app.get('/api/video/project/:projectId', (req, res) => {
    const project = videoEditor.getProject(req.params.projectId);
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
});

// Add media to project
app.post('/api/video/project/:projectId/media', (req, res) => {
    try {
        const media = videoEditor.addMedia(req.params.projectId, req.body);
        res.json(media);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Apply effect
app.post('/api/video/effect', (req, res) => {
    try {
        const { projectId, clipId, effectId, params } = req.body;
        const effect = videoEditor.applyEffect(projectId, clipId, effectId, params);
        res.json(effect);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Render project
app.post('/api/video/render', (req, res) => {
    try {
        const { projectId, settings } = req.body;
        const job = videoEditor.renderProject(projectId, settings);
        res.json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get music video presets
app.get('/api/video/presets/music-video', (req, res) => {
    res.json(videoEditor.getMusicVideoPresets());
});

// ==================== DSP DISTRIBUTION ENDPOINTS ====================

// Get all platforms
app.get('/api/dsp/platforms', (req, res) => {
    res.json(dspDistribution.getPlatformStats());
});

// Get all releases
app.get('/api/dsp/releases', (req, res) => {
    res.json(dspDistribution.getReleases());
});

// Get single release
app.get('/api/dsp/releases/:releaseId', (req, res) => {
    const release = dspDistribution.getRelease(req.params.releaseId);
    if (!release) {
        return res.status(404).json({ error: 'Release not found' });
    }
    res.json(release);
});

// Create new release
app.post('/api/dsp/releases', (req, res) => {
    try {
        const release = dspDistribution.createRelease(req.body);
        res.json(release);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Submit to platforms
app.post('/api/dsp/submit/:releaseId', (req, res) => {
    try {
        const { platforms } = req.body;
        const result = dspDistribution.submitToPlatforms(req.params.releaseId, platforms);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Check delivery status
app.get('/api/dsp/status/:releaseId', (req, res) => {
    try {
        const status = dspDistribution.checkDeliveryStatus(req.params.releaseId);
        res.json(status);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get distribution recommendations
app.post('/api/dsp/recommendations', (req, res) => {
    const recommendations = dspDistribution.getDistributionRecommendations(req.body);
    res.json(recommendations);
});

// Configure Google Sheets
app.post('/api/dsp/google-sheets/config', (req, res) => {
    try {
        const result = dspDistribution.configureGoogleSheets(req.body);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Sync from Google Sheets
app.post('/api/dsp/google-sheets/sync', async (req, res) => {
    try {
        const result = await dspDistribution.syncFromGoogleSheets();
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Export to Google Sheets
app.post('/api/dsp/google-sheets/export', async (req, res) => {
    try {
        const result = await dspDistribution.exportToGoogleSheets();
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== COLLABORATION ENDPOINTS ====================

app.get('/api/collaboration/status', (req, res) => {
    // Build recent activity from real collaboration data only
    const recentActivity = collaborationHub.members?.slice(0, 5).map(member => ({
        user: member.name,
        action: 'active',
        time: member.lastActive ? new Date(member.lastActive).toISOString() : null
    })) ?? [];

    res.json({
        activeMembers: collaborationHub.getActiveMembers?.()?.length ?? 0,
        totalMembers: collaborationHub.members?.length ?? 0,
        sharedFiles: collaborationHub.files?.length ?? 0,
        activeProjects: collaborationHub.getActiveProjects?.()?.length ?? 0,
        recentActivity,
        storageUsed: '0GB',
        storageTotal: '1TB'
    });
});

// ==================== LOCAL LLM ENDPOINTS ====================
// 100% Offline, No API, No Login, No Internet Required

const { getLocalLLM } = require('./lib/ai/local-llm');

// Get local LLM instance
let localLLM = null;

function getLLM() {
    if (!localLLM) {
        localLLM = getLocalLLM({
            dataPath: process.env.GOAT_DATA_PATH || null
        });
    }
    return localLLM;
}

// Get LLM status and configuration
app.get('/api/llm/status', (req, res) => {
    try {
        const llm = getLLM();
        res.json({
            mode: aiConfig.aiMode || 'local',
            ...llm.getSystemInfo(),
            dataPathInfo: llm.getDataPath()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Set data path (for external drive)
app.post('/api/llm/data-path', (req, res) => {
    try {
        const llm = getLLM();
        const { path: newPath } = req.body;
        llm.setDataPath(newPath);
        res.json({
            success: true,
            dataPath: llm.getDataPath()
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// List available models
app.get('/api/llm/models', (req, res) => {
    try {
        const llm = getLLM();
        res.json({
            installed: llm.listModels(),
            available: aiConfig.local?.availableModels || {}
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get download instructions for a model
app.get('/api/llm/models/:modelName/download', (req, res) => {
    try {
        const llm = getLLM();
        const info = llm.getDownloadInstructions(req.params.modelName);
        if (info) {
            res.json(info);
        } else {
            res.status(404).json({ error: 'Model not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Load a model
app.post('/api/llm/load/:modelId', async (req, res) => {
    try {
        const llm = getLLM();
        const result = await llm.loadModel(req.params.modelId);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Unload current model
app.post('/api/llm/unload', async (req, res) => {
    try {
        const llm = getLLM();
        await llm.unloadModel();
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Generate text completion
app.post('/api/llm/generate', async (req, res) => {
    try {
        const llm = getLLM();
        const { prompt, options } = req.body;
        const result = await llm.generate(prompt, options);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Chat completion
app.post('/api/llm/chat', async (req, res) => {
    try {
        const llm = getLLM();
        const { messages, options } = req.body;
        const result = await llm.chat(messages, options);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ms. Money Penny chat — injects her system prompt and forwards to local LLM
app.post('/api/money-penny/chat', async (req, res) => {
    try {
        const promptPath = path.join(__dirname, 'lib', 'money-penny', 'money-penny-system-prompt.txt');
        const systemPrompt = fs.readFileSync(promptPath, 'utf8');
        const { messages = [], options = {} } = req.body;

        const fullMessages = [
            { role: 'system', content: systemPrompt },
            ...messages
        ];

        const llm = getLLM();
        const result = await llm.chat(fullMessages, options);
        res.json(result);
    } catch (error) {
        logger.error(`Money Penny chat failed: ${error.message}`);
        res.status(500).json({
            error: 'Money Penny chat is unavailable.',
            details: error.message,
            fallback: true
        });
    }
});

// Get/Set LLM configuration
app.get('/api/llm/config', (req, res) => {
    try {
        const llm = getLLM();
        res.json(llm.getConfig());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/llm/config', (req, res) => {
    try {
        const llm = getLLM();
        llm.setConfig(req.body);
        res.json(llm.getConfig());
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ==================== GOAT DATA ENDPOINTS ====================

// Music Catalog Endpoints
app.get('/api/catalog', (req, res) => {
    try {
        const catalog = goatData.getMusicCatalog();
        res.json(catalog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/catalog/songs', (req, res) => {
    try {
        const songs = goatData.getAllSongs();
        res.json({ total: songs.length, songs });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/catalog/search', (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter q required' });
        }
        const results = goatData.searchSongs(q);
        res.json({ query: q, total: results.length, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/catalog/stats', (req, res) => {
    try {
        const stats = goatData.getCatalogStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/catalog/collaborators', (req, res) => {
    try {
        const collaborators = goatData.getCollaborators();
        res.json({ total: collaborators.length, collaborators });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/catalog/export/csv', (req, res) => {
    try {
        const csv = goatData.exportCatalogCSV();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="waka_catalog.csv"');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const NetworkProfiles = require('./lib/network/network-profiles');

// Get all profiles
app.get('/api/network/profiles', (req, res) => {
    try {
        const { type, search } = req.query;
        let profiles;
        if (search) {
            profiles = NetworkProfiles.searchProfiles(search);
        } else if (type) {
            profiles = NetworkProfiles.getProfilesByType(type);
        } else {
            profiles = NetworkProfiles.getAllProfiles();
        }
        res.json({ profiles, total: profiles.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Network Profiles Endpoints
app.get('/api/network', (req, res) => {
    try {
        const data = goatData.getNetworkProfiles();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/network/profiles', (req, res) => {
    try {
        const data = goatData.getNetworkProfiles();
        res.json({ total: data.profiles.length, profiles: data.profiles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/network/connections', (req, res) => {
    try {
        const data = goatData.getNetworkProfiles();
        res.json({ total: data.connections.length, connections: data.connections });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/network/stats', (req, res) => {
    try {
        const stats = goatData.getNetworkStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Sync Opportunities Endpoints
app.get('/api/sync/opportunities', (req, res) => {
    try {
        const syncData = goatData.loadDataFile('sync_opportunities.json');
        res.json(syncData || { opportunities: [], placements: [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Royalty Calculator Endpoints
app.post('/api/royalty/calculate/streaming', (req, res) => {
    try {
        const { platform, streams, sharePercent } = req.body;
        const rates = {
            spotify: 0.004,
            appleMusic: 0.008,
            youtube: 0.002,
            tidal: 0.012,
            amazon: 0.006,
            pandora: 0.0015,
            deezer: 0.005,
            soundcloud: 0.003
        };
        const rate = rates[platform] || 0.004;
        const gross = streams * rate;
        const share = gross * ((sharePercent || 100) / 100);
        res.json({
            platform,
            streams,
            ratePerStream: rate,
            grossRoyalty: gross.toFixed(2),
            sharePercent: sharePercent || 100,
            netRoyalty: share.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/royalty/calculate/sync', (req, res) => {
    try {
        const { type, songs } = req.body;
        const syncRates = {
            tv_show: 15000,
            film: 25000,
            commercial: 50000,
            videogame: 20000,
            trailer: 35000
        };
        const rate = syncRates[type] || 15000;
        const total = rate * (songs || 1);
        res.json({
            type,
            ratePerSong: rate,
            songs: songs || 1,
            totalSync: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Configuration Endpoint
app.get('/api/config', (req, res) => {
    try {
        const config = goatData.loadDataFile('goat-config.json');
        // Never expose API keys or server metadata over the public API
        const safeConfig = { ...config };
        delete safeConfig.api_keys;
        delete safeConfig.server;
        res.json(safeConfig);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== MARKET ANALYSIS ENDPOINTS ====================

app.get('/api/market/trends', (req, res) => {
    res.json({
        trendingGenres: marketAnalysis.getTrendingGenres?.() ?? [],
        platformInsights: marketAnalysis.platformInsights ?? {},
        lastUpdated: marketAnalysis.lastUpdated ?? null
    });
});

// ==================== AGENT-007 UI ROUTES ====================
app.use(agent007Routes);

// ==================== CASINO & GAMING ROUTES ====================
app.use('/api', casinoRoutes);
app.use('/api', gamingRoutes);
const casino = casinoRoutes.casino;
const gamingServer = gamingRoutes.gamingServer;

// Catch-all route - serve index.html for client-side routing
// Rate limited to prevent file-system abuse
const staticLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please slow down.'
});
app.get('*', staticLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    logger.error(err.stack || err.message);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 SUPER GOAT ROYALTIES Server running on port ${PORT}`);
    logger.info(`📊 Dashboard: http://localhost:${PORT}`);
    logger.info(`🔌 API Status: http://localhost:${PORT}/api/status`);
    logger.info(`🤖 AI Features: Enabled | Mode: ${aiConfig.demoMode ? 'DEMO' : 'LIVE'}`);
    logger.info('📚 RAG System: Active');
    logger.info('🤝 Autonomous Agents: Running');
    logger.info('📡 WebSocket: Connected');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
    });
});

module.exports = { app, server };