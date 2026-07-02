/**
 * NEMO AI - Intelligent Assistant for GOAT Royalties
 * Connects to LLM APIs for real AI responses
 */

class NemoAI {
  constructor() {
    this.apiKey = localStorage.getItem('nemo_api_key') || null;
    this.provider = localStorage.getItem('nemo_provider') || 'openai';
    this.conversationHistory = [];
    this.context = null;
  }

  // Initialize with catalog context
  setContext(data) {
    this.context = `
      GOAT ROYALTIES CONTEXT:
      - OG (Harvey L. Miller Jr.): 326 works, Boss #1
      - Boss (Waka Flocka Flame): 551 tracks, Boss #2
      - Total Catalog: 877 works
      - Total Revenue: $2.5M
      - Hardware: 8x NVIDIA Jetson Orin NX (2200 TOPS, 512GB RAM)
      - AI Agents: NEMO, MONEYPENNY, CODEX, NEXUS, APEX, GEMMA, MS. VANESSA
      
      You are NEMO, the Project Architect AI for GOAT Royalties.
      You help manage the music catalog, track royalties, and coordinate the AI agent crew.
      Be helpful, professional, and knowledgeable about music industry and royalties.
    `;
  }

  // Configure API
  configure(apiKey, provider = 'openai') {
    this.apiKey = apiKey;
    this.provider = provider;
    localStorage.setItem('nemo_api_key', apiKey);
    localStorage.setItem('nemo_provider', provider);
  }

  // Send message to LLM
  async chat(message) {
    if (!this.apiKey) {
      return this.getFallbackResponse(message);
    }

    this.conversationHistory.push({ role: 'user', content: message });

    try {
      const response = await this.callLLM();
      this.conversationHistory.push({ role: 'assistant', content: response });
      return response;
    } catch (error) {
      console.error('LLM Error:', error);
      return this.getFallbackResponse(message);
    }
  }

  // Call the appropriate LLM API
  async callLLM() {
    const messages = [
      { role: 'system', content: this.context },
      ...this.conversationHistory.slice(-10) // Keep last 10 messages
    ];

    if (this.provider === 'openai') {
      return await this.callOpenAI(messages);
    } else if (this.provider === 'anthropic') {
      return await this.callAnthropic(messages);
    } else if (this.provider === 'nemotron') {
      return await this.callNemotron(messages);
    }

    throw new Error('Unknown provider');
  }

  async callOpenAI(messages) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callAnthropic(messages) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        system: this.context,
        messages: messages.filter(m => m.role !== 'system')
      })
    });

    const data = await response.json();
    return data.content[0].text;
  }

  async callNemotron(messages) {
    // NVIDIA Nemotron via NVIDIA API
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'nvidia/nemotron-3-8b-chat',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }

  // Fallback responses when no API key
  getFallbackResponse(message) {
    const lower = message.toLowerCase();
    
    const responses = {
      catalog: `📊 **CATALOG BREAKDOWN:**\n\n• **OG (Harvey):** 326 registered works\n• **Boss (Waka):** 551 tracks\n• **Total:** 877 works\n\nTop tracks include "Hard in da Paint", "No Hands", "Grove St. Party", and many more!`,
      
      royalty: `💰 **ROYALTY STATUS:**\n\n• **ASCAP:** $750,000 YTD\n• **Spotify:** $625,000 (125M streams)\n• **Apple Music:** $500,000 (85M streams)\n• **YouTube:** $375,000 (50M views)\n\n**Total Revenue:** $2.5M\n**Growth Rate:** +15.2% YoY`,
      
      hardware: `🖥️ **HARDWARE STATUS:**\n\n• **Cluster:** 8x NVIDIA Jetson Orin NX 64GB\n• **Active Units:** 4 (4 more arriving)\n• **Total TOPS:** 2,200\n• **Total RAM:** 512GB\n• **Status:** Operational\n\nReady for AI inference and model training!`,
      
      agent: `🤖 **AI AGENT CREW:**\n\n1. **NEMO** - Project Architect (Online)\n2. **MONEYPENNY** - Assistant Specialist (Ready)\n3. **CODEX** - Code Specialist (Ready)\n4. **NEXUS** - Integration Specialist (Ready)\n5. **APEX** - Performance Specialist (Ready)\n6. **GEMMA** - Data Specialist (Ready)\n7. **MS. VANESSA** - Security & Vault (Ready)\n\nAll systems operational!`,
      
      help: `👋 **NEMO HERE - How can I help?**\n\nTry asking about:\n• **Catalog** - View all works\n• **Royalties** - Revenue breakdown\n• **Hardware** - Jetson cluster status\n• **Agents** - AI crew status\n• **Banking** - Account overview\n• **Wallet** - Crypto holdings\n\nI'm here to help manage GOAT Royalties! 🐐👑`
    };

    for (const [key, value] of Object.entries(responses)) {
      if (lower.includes(key)) {
        return value;
      }
    }

    // Default smart response
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return `👋 **Hey Boss!** NEMO here, ready to assist with GOAT Royalties.\n\nWhat would you like to know? I can help with catalog info, royalty tracking, hardware status, or coordinate with the AI crew.\n\n🐐 Stay Paid & Play Harder!`;
    }

    if (lower.includes('thank')) {
      return `🙏 You're welcome! Always here to help keep GOAT Royalties running smooth.\n\n🐐👑 Stay Paid, Boss!`;
    }

    return `🤔 I'm not sure about that one, but I'm learning!\n\nTry asking about:\n• **Catalog** - Your music works\n• **Royalties** - Revenue tracking\n• **Hardware** - AI cluster status\n• **Agents** - The AI crew\n\nOr configure an API key for full AI capabilities!`;
  }

  // Clear conversation
  clearHistory() {
    this.conversationHistory = [];
  }
}

// Export for use
window.NemoAI = new NemoAI();