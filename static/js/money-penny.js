/**
 * Ms. Money Penny Chat Client
 * Connects to the GOAT Royalty App /api/money-penny/chat endpoint.
 */

class MoneyPennyChat {
  constructor() {
    this.messages = [];
    this.fallbackMode = false;
  }

  async chat(message) {
    this.messages.push({ role: 'user', content: message });

    try {
      const response = await fetch('/api/money-penny/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: this.messages.slice(-20),
          options: { temperature: 0.7, maxTokens: 2048 }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.fallback) {
          this.fallbackMode = true;
        }
        throw new Error(errorData.error || 'Money Penny chat unavailable');
      }

      const data = await response.json();
      const reply = data.response || data.choices?.[0]?.message?.content || data.content || JSON.stringify(data);
      this.messages.push({ role: 'assistant', content: reply });
      return reply;
    } catch (error) {
      console.error('Money Penny chat error:', error);
      const fallback = this.getFallbackResponse(message);
      this.messages.push({ role: 'assistant', content: fallback });
      return fallback;
    }
  }

  getFallbackResponse(message) {
    const lower = message.toLowerCase();
    if (lower.includes('catalog') || lower.includes('songs')) {
      return 'The GOAT Royalty catalog contains **511 WAKA FLOCKA FLAME works** registered through ASCAP under BRICK SQUAD MONOPOLY PUBLISHING. You can view full stats at /api/catalog/stats. I can also export to CSV on request.';
    }
    if (lower.includes('vault') || lower.includes('status')) {
      return 'Vault status: real data mode is active. The app is loading from local JSON files instead of hardcoded demo data. API keys are now stored in `.env` (not committed). Next step: load a local LLM model so I can run fully offline.';
    }
    if (lower.includes('change protocol') || lower.includes('approval')) {
      return 'Nothing becomes live until approved. Draft changes first, show the owner, wait for clear approval language, then merge into live AGENT-007 or GOAT behavior.';
    }
    if (lower.includes('network') || lower.includes('profiles')) {
      return 'The network has **142 profiles** and **140 connections**. Primary profile: Waka Flocka Flame (Juaquin Malphurs). Our network is our net worth.';
    }
    return 'I'm Ms. Money Penny, home in the GOAT Royalty App. I can help with catalog, royalties, research, genealogy, product architecture, and local operations. What do you need, Boss?';
  }
}

const moneyPenny = new MoneyPennyChat();
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const fallbackBanner = document.getElementById('fallbackBanner');

function addMessage(content, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'money-penny'} animate-in`;

  if (isUser) {
    messageDiv.innerHTML = content;
  } else {
    messageDiv.innerHTML = `<div class="sender">👑 Ms. Money Penny</div><div>${formatResponse(content)}</div>`;
  }

  chatMessages.insertBefore(messageDiv, typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  chatInput.value = '';
  sendBtn.disabled = true;
  typingIndicator.classList.add('active');

  const response = await moneyPenny.chat(message);
  typingIndicator.classList.remove('active');
  addMessage(response);

  if (moneyPenny.fallbackMode) {
    fallbackBanner.classList.add('active');
  }

  sendBtn.disabled = false;
  chatInput.focus();
}

function sendQuick(message) {
  chatInput.value = message;
  sendMessage();
}

function handleKeyPress(e) {
  if (e.key === 'Enter') sendMessage();
}

// Check if local LLM is available
async function checkLLMStatus() {
  try {
    const response = await fetch('/api/llm/status', { method: 'GET' });
    if (!response.ok) throw new Error('LLM status unavailable');
    const data = await response.json();
    if (!data.ready && !data.modelLoaded) {
      fallbackBanner.classList.add('active');
      fallbackBanner.textContent = 'Local LLM is not loaded. Money Penny is running in offline fallback mode. Load a model via /api/llm/load/:modelId.';
    }
  } catch (error) {
    fallbackBanner.classList.add('active');
    fallbackBanner.textContent = 'Local LLM status check failed. Money Penny is running in offline fallback mode.';
  }
}

checkLLMStatus();
