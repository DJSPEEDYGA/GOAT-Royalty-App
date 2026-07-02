# Lightning AI / OpenRouter — 653 Model Catalog

> Access 653+ AI models from major providers through a unified API gateway.
> Single API key, consolidated billing, real-time usage tracking.

---

## 📊 Catalog Overview

| Metric | Value |
|--------|-------|
| **Total Models** | 653+ |
| **Providers** | 20+ (OpenAI, Anthropic, Google, Meta, Mistral, etc.) |
| **Sort Options** | Most Popular, Newest, Pricing, Context, Throughput, Latency |

---

## 🏆 Featured Models by Provider

### Anthropic
| Model | Context | Released | Description |
|-------|---------|----------|-------------|
| Claude v2.0 | 100K | Jul 2023 | Flagship model — superior complex reasoning, supports hundreds of pages |

### Google
| Model | Context | Released | Description |
|-------|---------|----------|-------------|
| PaLM 2 Code Chat | 7K | Jul 2023 | Fine-tuned for code-related Q&A |
| PaLM 2 Chat | 9K | Jul 2023 | Improved multilingual, reasoning, coding |

### Meta (Llama)
| Model | Context | Params | Released | Description |
|-------|---------|--------|----------|-------------|
| Llama 2 70B Chat | 4K | 70B | Jun 2023 | Flagship — SFT + RLHF aligned for helpfulness & safety |
| Llama 2 13B Chat | 4K | 13B | Jun 2023 | Mid-size variant for efficient deployment |

### OpenAI
| Model | Context | Released | Description |
|-------|---------|----------|-------------|
| GPT-3.5 Turbo 16k | 16K | May 2023 | Improved instruction following, JSON mode, parallel function calling |
| GPT-3.5 Turbo (v0301) | 4K | May 2023 | Fastest model — natural language + code generation |

---

## 📋 Full Provider List (653+ Models)

Based on the catalog, models are available from these major providers:

| Provider | Notable Models | Specialty |
|----------|---------------|-----------|
| **OpenAI** | GPT-4o, GPT-4 Turbo, GPT-3.5, o1, o3 | General-purpose, coding, reasoning |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus/Haiku, Claude 2 | Long context, safety, reasoning |
| **Google** | Gemini 2.5/3 Flash, PaLM 2, Gemma | Multimodal, multilingual |
| **Meta** | Llama 3.1/3.2/3.3, Llama 2 | Open-source foundation |
| **Mistral** | Mistral Large, Small-4-119B, Codestral | Efficient, coding |
| **NVIDIA** | Nemotron 3 Super 120B, Nano 4B | Enterprise inference |
| **Qwen** | Qwen3.5 series (0.8B-397B) | Full-spectrum multimodal |
| **DeepSeek** | DeepSeek V3.2 (685B) | Reasoning, coding |
| **Moonshot** | Kimi K2.5 (1.1T) | Largest open model |
| **Zhipu AI** | GLM-5 (754B) | Chinese + multilingual |
| **MiniMax** | MiniMax-M2.5 (229B) | Enterprise text gen |
| **Cohere** | Command R+, Embed | RAG, enterprise search |
| **AI21** | Jamba, Jurassic | Long context |
| **Perplexity** | Sonar models | Search-augmented |
| **Together AI** | Various open models | Collaborative inference |
| **Fireworks** | Various hosted models | Fast serving |
| **Lightning AI** | GPT OSS 20B/120B, hosted models | Unified gateway |

---

## 🔍 Search & Filter Capabilities

The model router supports filtering by:

- **Task**: Text Generation, Image Generation, Code, Chat, Embeddings
- **Provider**: Filter by specific company
- **Context Window**: Sort high to low (100K+ to 4K)
- **Throughput**: Sort by tokens/second
- **Latency**: Sort by response time
- **Pricing**: Sort by input/output cost per million tokens

---

## ⚡ API Access

All 653 models accessible through a single endpoint:

```bash
curl https://api.lightning.ai/v1/chat/completions \
  -H "Authorization: Bearer $LIGHTNING_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-v2",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

Switch models by changing the `model` parameter — no other code changes needed.

---

## 🔗 Integration with Ms Money Penny Store

- **Models Page**: Browse all 653 models at `models.html#lightning`
- **Lightning AI Section**: 14+ featured models with pricing comparison
- **Desktop App**: Full model catalog accessible from Electron app
- **OpenClaw Gateway**: Routes to Lightning AI models via litellm proxy

---

*Catalog maintained by DJSPEEDYGA — Life Imitates Art Inc.*
*Source: Lightning AI Model Router — 653+ models*