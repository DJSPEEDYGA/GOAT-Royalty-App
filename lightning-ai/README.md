# ⚡ Lightning AI — Model APIs Integration

> **Access any AI model API from one place.** Pay using Lightning credits, track usage, and costs in one unified platform.

Lightning AI provides a unified gateway to the world's best AI models — from open-source powerhouses to frontier commercial APIs — all accessible through a single API key with consolidated billing, usage tracking, and cost management.

**Platform:** [lightning.ai](https://lightning.ai)  
**Docs:** [lightning.ai/docs](https://lightning.ai/docs)  
**Get API Key:** [lightning.ai/model-apis](https://lightning.ai)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Available Models](#available-models)
- [Model Comparison Matrix](#model-comparison-matrix)
- [API Usage](#api-usage)
- [Pricing & Credits](#pricing--credits)
- [Integration with Ms Money Penny Store](#integration-with-ms-money-penny-store)
- [Configuration](#configuration)

---

## Overview

Lightning AI Model APIs offer:

- **Unified Access** — Single API key for all models across multiple providers
- **Lightning Credits** — Pay-as-you-go with consolidated billing
- **Usage Tracking** — Monitor costs and usage per model in real time
- **Low Latency** — Optimized inference endpoints with high throughput
- **Provider Diversity** — Access Lightning AI, OpenAI, Google, and more from one gateway

---

## Quick Start

### 1. Get Your API Key

Sign up at [lightning.ai](https://lightning.ai) and generate your API key from the Model APIs dashboard.

### 2. Install the Client

```bash
pip install litserve lightning-sdk
```

### 3. Make Your First Call

```python
import requests

API_KEY = "your-lightning-api-key"
BASE_URL = "https://api.lightning.ai/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "model": "gpt-oss-20b",
    "messages": [
        {"role": "user", "content": "Hello, what can you do?"}
    ],
    "max_tokens": 512
}

response = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=payload)
print(response.json()["choices"][0]["message"]["content"])
```

### 4. OpenAI-Compatible SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-lightning-api-key",
    base_url="https://api.lightning.ai/v1"
)

response = client.chat.completions.create(
    model="gpt-oss-20b",
    messages=[{"role": "user", "content": "Explain quantum computing in simple terms."}],
    max_tokens=1024
)

print(response.choices[0].message.content)
```

---

## Available Models

### ⚡ Lightning AI Native Models

These models are hosted and optimized directly by Lightning AI, offering the best price-to-performance ratio.

#### GPT OSS 20B
| Property | Value |
|---|---|
| **Provider** | Lightning AI |
| **Input Cost** | ⚡ 0.05 credits/M tokens |
| **Output Cost** | ⚡ 0.20 credits/M tokens |
| **Cache Input** | ⚡ 0.01 credits/M tokens |
| **Cache Output** | ⚡ 0.05 credits/M tokens |
| **Latency** | 3.04s |
| **Throughput** | 6.43 tokens/s |
| **Context Length** | 128K |

Best for: Lightweight tasks, quick completions, cost-efficient batch processing.

#### GPT OSS 120B
| Property | Value |
|---|---|
| **Provider** | Lightning AI |
| **Input Cost** | ⚡ 0.10 credits/M tokens |
| **Output Cost** | ⚡ 0.40 credits/M tokens |
| **Cache Input** | ⚡ 0.02 credits/M tokens |
| **Cache Output** | ⚡ 0.10 credits/M tokens |
| **Latency** | 0.90s |
| **Throughput** | 177.56 tokens/s |
| **Context Length** | 128K |

Best for: Complex reasoning, code generation, high-throughput production workloads.

#### Llama 3.3 70B
| Property | Value |
|---|---|
| **Provider** | Lightning AI |
| **Input Cost** | ⚡ 0.30 credits/M tokens |
| **Output Cost** | ⚡ 0.30 credits/M tokens |
| **Cache Input** | ⚡ 0.07 credits/M tokens |
| **Cache Output** | ⚡ 0.07 credits/M tokens |
| **Latency** | 0.83s |
| **Throughput** | 60.23 tokens/s |
| **Context Length** | 128K |

Best for: Balanced performance, multilingual tasks, open-source flexibility.

#### DeepSeek V3.1
| Property | Value |
|---|---|
| **Provider** | Lightning AI |
| **Input Cost** | ⚡ 0.32 credits/M tokens |
| **Output Cost** | ⚡ 1.10 credits/M tokens |
| **Cache Input** | ⚡ 0.08 credits/M tokens |
| **Cache Output** | ⚡ 0.28 credits/M tokens |
| **Latency** | 0.65s |
| **Throughput** | 90.23 tokens/s |
| **Context Length** | 164K |

Best for: Deep reasoning, mathematical proofs, scientific analysis, code review.

#### NVIDIA Nemotron 3 Super 120B
| Property | Value |
|---|---|
| **Provider** | Lightning AI |
| **Input Cost** | ⚡ 1.40 credits/M tokens |
| **Output Cost** | ⚡ 3.00 credits/M tokens |
| **Cache Input** | ⚡ 0.35 credits/M tokens |
| **Cache Output** | ⚡ 0.75 credits/M tokens |
| **Latency** | 1.06s |
| **Throughput** | 376.15 tokens/s |
| **Context Length** | 256K |

Best for: Enterprise workloads, highest throughput, long-context document processing.

#### MiniMax M2.5
| Property | Value |
|---|---|
| **Provider** | Lightning AI |
| **Input Cost** | ⚡ 1.00 credits/M tokens |
| **Output Cost** | ⚡ 4.80 credits/M tokens |
| **Cache Input** | ⚡ 0.25 credits/M tokens |
| **Cache Output** | ⚡ 1.20 credits/M tokens |
| **Latency** | 0.85s |
| **Throughput** | 108.49 tokens/s |
| **Context Length** | 196K |

Best for: Multi-modal tasks, creative content generation, high-context applications.

#### Kimi K2.5
| Property | Value |
|---|---|
| **Provider** | Lightning AI |
| **Input Cost** | ⚡ 2.32 credits/M tokens |
| **Output Cost** | ⚡ 12.00 credits/M tokens |
| **Cache Input** | ⚡ 0.58 credits/M tokens |
| **Cache Output** | ⚡ 3.00 credits/M tokens |
| **Latency** | 0.63s |
| **Throughput** | 280.46 tokens/s |
| **Context Length** | 256K |

Best for: Ultra-long context, research applications, complex multi-turn dialogues.

#### GLM-5
| Property | Value |
|---|---|
| **Provider** | Lightning AI |
| **Input Cost** | ⚡ 3.60 credits/M tokens |
| **Output Cost** | ⚡ 12.80 credits/M tokens |
| **Cache Input** | ⚡ 0.90 credits/M tokens |
| **Cache Output** | ⚡ 3.20 credits/M tokens |
| **Latency** | 4.86s |
| **Throughput** | 54.95 tokens/s |
| **Context Length** | 200K |

Best for: Advanced reasoning, multilingual excellence, enterprise analytics.

---

### 🔵 OpenAI Models

#### GPT 5 nano
| Property | Value |
|---|---|
| **Provider** | OpenAI |
| **Input Cost** | ⚡ 0.05 credits/M tokens |
| **Output Cost** | ⚡ 0.40 credits/M tokens |
| **Latency** | 2.42s |
| **Throughput** | 107.33 tokens/s |
| **Context Length** | 400K |

Best for: Ultra-lightweight tasks, edge deployment, maximum cost efficiency.

#### GPT 3.5 Turbo
| Property | Value |
|---|---|
| **Provider** | OpenAI |
| **Input Cost** | ⚡ 0.50 credits/M tokens |
| **Output Cost** | ⚡ 1.50 credits/M tokens |
| **Latency** | 1.15s |
| **Throughput** | 88.68 tokens/s |
| **Context Length** | 16K |

Best for: Legacy compatibility, chat applications, simple completions.

#### GPT 5 mini
| Property | Value |
|---|---|
| **Provider** | OpenAI |
| **Input Cost** | ⚡ 0.25 credits/M tokens |
| **Output Cost** | ⚡ 2.00 credits/M tokens |
| **Latency** | 35.39s |
| **Throughput** | 3.23 tokens/s |
| **Context Length** | 400K |

Best for: Deep reasoning tasks, complex analysis, when latency is not critical.

---

### 🟢 Google Models

#### Gemini 2.5 Flash Lite
| Property | Value |
|---|---|
| **Provider** | Google |
| **Input Cost** | ⚡ 0.10 credits/M tokens |
| **Output Cost** | ⚡ 0.40 credits/M tokens |
| **Latency** | 4.80s |
| **Throughput** | 7.61 tokens/s |
| **Context Length** | 1M |

Best for: Massive context windows, document analysis, cost-efficient Google AI.

#### Gemini 3 Flash
| Property | Value |
|---|---|
| **Provider** | Google |
| **Input Cost** | ⚡ 0.50 credits/M tokens |
| **Output Cost** | ⚡ 1.00 credits/M tokens |
| **Latency** | 1.66s |
| **Throughput** | 159.34 tokens/s |
| **Context Length** | 1M |

Best for: High-throughput production, 1M context, multi-modal understanding.

#### Gemini 2.5 Flash
| Property | Value |
|---|---|
| **Provider** | Google |
| **Input Cost** | ⚡ 0.30 credits/M tokens |
| **Output Cost** | ⚡ 2.50 credits/M tokens |
| **Latency** | 5.42s |
| **Throughput** | 20.31 tokens/s |
| **Context Length** | 1M |

Best for: Balanced Google AI, reasoning + speed, large document processing.

---

## Model Comparison Matrix

### By Cost (Input — Lowest to Highest)

| Model | Input ⚡/M | Output ⚡/M | Context | Provider |
|---|---|---|---|---|
| GPT OSS 20B | 0.05 | 0.20 | 128K | Lightning AI |
| GPT 5 nano | 0.05 | 0.40 | 400K | OpenAI |
| GPT OSS 120B | 0.10 | 0.40 | 128K | Lightning AI |
| Gemini 2.5 Flash Lite | 0.10 | 0.40 | 1M | Google |
| GPT 5 mini | 0.25 | 2.00 | 400K | OpenAI |
| Llama 3.3 70B | 0.30 | 0.30 | 128K | Lightning AI |
| Gemini 2.5 Flash | 0.30 | 2.50 | 1M | Google |
| DeepSeek V3.1 | 0.32 | 1.10 | 164K | Lightning AI |
| Gemini 3 Flash | 0.50 | 1.00 | 1M | Google |
| GPT 3.5 Turbo | 0.50 | 1.50 | 16K | OpenAI |
| MiniMax M2.5 | 1.00 | 4.80 | 196K | Lightning AI |
| NVIDIA Nemotron 3 Super 120B | 1.40 | 3.00 | 256K | Lightning AI |
| Kimi K2.5 | 2.32 | 12.00 | 256K | Lightning AI |
| GLM-5 | 3.60 | 12.80 | 200K | Lightning AI |

### By Throughput (Highest First)

| Model | Throughput (tok/s) | Latency (s) | Provider |
|---|---|---|---|
| NVIDIA Nemotron 3 Super 120B | 376.15 | 1.06 | Lightning AI |
| Kimi K2.5 | 280.46 | 0.63 | Lightning AI |
| GPT OSS 120B | 177.56 | 0.90 | Lightning AI |
| Gemini 3 Flash | 159.34 | 1.66 | Google |
| MiniMax M2.5 | 108.49 | 0.85 | Lightning AI |
| GPT 5 nano | 107.33 | 2.42 | OpenAI |
| DeepSeek V3.1 | 90.23 | 0.65 | Lightning AI |
| GPT 3.5 Turbo | 88.68 | 1.15 | OpenAI |
| Llama 3.3 70B | 60.23 | 0.83 | Lightning AI |
| GLM-5 | 54.95 | 4.86 | Lightning AI |
| Gemini 2.5 Flash | 20.31 | 5.42 | Google |
| Gemini 2.5 Flash Lite | 7.61 | 4.80 | Google |
| GPT OSS 20B | 6.43 | 3.04 | Lightning AI |
| GPT 5 mini | 3.23 | 35.39 | OpenAI |

### By Context Length

| Model | Context Length | Provider |
|---|---|---|
| Gemini 2.5 Flash Lite | 1,000,000 | Google |
| Gemini 3 Flash | 1,000,000 | Google |
| Gemini 2.5 Flash | 1,000,000 | Google |
| GPT 5 nano | 400,000 | OpenAI |
| GPT 5 mini | 400,000 | OpenAI |
| NVIDIA Nemotron 3 Super 120B | 256,000 | Lightning AI |
| Kimi K2.5 | 256,000 | Lightning AI |
| GLM-5 | 200,000 | Lightning AI |
| MiniMax M2.5 | 196,000 | Lightning AI |
| DeepSeek V3.1 | 164,000 | Lightning AI |
| GPT OSS 20B | 128,000 | Lightning AI |
| GPT OSS 120B | 128,000 | Lightning AI |
| Llama 3.3 70B | 128,000 | Lightning AI |
| GPT 3.5 Turbo | 16,000 | OpenAI |

---

## API Usage

### Chat Completions (OpenAI-Compatible)

```bash
curl -X POST https://api.lightning.ai/v1/chat/completions \
  -H "Authorization: Bearer $LIGHTNING_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nvidia-nemotron-3-super-120b",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant for the Ms Money Penny Store."},
      {"role": "user", "content": "What products do you recommend?"}
    ],
    "max_tokens": 2048,
    "temperature": 0.7
  }'
```

### Streaming Responses

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-lightning-api-key",
    base_url="https://api.lightning.ai/v1"
)

stream = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "Write a product description for a luxury handbag."}],
    max_tokens=1024,
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### Batch Processing

```python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key="your-lightning-api-key",
    base_url="https://api.lightning.ai/v1"
)

async def process_batch(prompts, model="gpt-oss-20b"):
    """Process multiple prompts concurrently for cost efficiency."""
    tasks = [
        client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=512
        )
        for prompt in prompts
    ]
    return await asyncio.gather(*tasks)

# Example: Generate product descriptions in batch
prompts = [
    "Write a short description for a vintage watch.",
    "Write a short description for designer sunglasses.",
    "Write a short description for a leather wallet.",
]

results = asyncio.run(process_batch(prompts))
for r in results:
    print(r.choices[0].message.content)
    print("---")
```

---

## Pricing & Credits

### How Credits Work

- **Lightning Credits (⚡)** are the unified currency across all models
- Credits are charged per **million tokens** (M tokens)
- **Input tokens** and **Output tokens** are priced separately
- **Cached tokens** receive significant discounts (up to 75% off)
- Monitor usage in real-time on your Lightning AI dashboard

### Cost Optimization Tips

1. **Use caching** — Cached input/output tokens cost 75-80% less
2. **Choose the right model** — GPT OSS 20B at ⚡0.05/M input is ideal for simple tasks
3. **Batch requests** — Process multiple items in a single session to maximize cache hits
4. **Set max_tokens wisely** — Avoid over-generating tokens you don't need
5. **Use Flash models** — Gemini Flash variants offer great price/performance balance

### Monthly Cost Estimates

| Use Case | Model | Tokens/Month | Est. Cost |
|---|---|---|---|
| Light chatbot | GPT OSS 20B | 10M in / 5M out | ⚡ 1.50 |
| Product descriptions | Llama 3.3 70B | 50M in / 25M out | ⚡ 22.50 |
| Document analysis | Gemini 3 Flash | 100M in / 50M out | ⚡ 100.00 |
| Enterprise pipeline | Nemotron 3 Super 120B | 500M in / 200M out | ⚡ 1,300.00 |

---

## Integration with Ms Money Penny Store

### Store AI Assistant

Use Lightning AI models to power the store's AI shopping assistant:

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-lightning-api-key",
    base_url="https://api.lightning.ai/v1"
)

def store_assistant(customer_query: str) -> str:
    """Ms Money Penny Store AI Shopping Assistant."""
    response = client.chat.completions.create(
        model="gpt-oss-120b",  # High throughput for production
        messages=[
            {
                "role": "system",
                "content": (
                    "You are Ms Money Penny, the AI shopping assistant for "
                    "Life Imitates Art Inc. You help customers find products, "
                    "answer questions about orders, and provide personalized "
                    "recommendations. Be friendly, knowledgeable, and helpful."
                )
            },
            {"role": "user", "content": customer_query}
        ],
        max_tokens=1024,
        temperature=0.7
    )
    return response.choices[0].message.content
```

### Product Search with AI

```python
def ai_product_search(query: str, catalog: list) -> list:
    """Use AI to intelligently search and rank products."""
    response = client.chat.completions.create(
        model="deepseek-v3.1",  # Great for reasoning
        messages=[
            {
                "role": "system",
                "content": (
                    "Given a product catalog and search query, return the top 5 "
                    "most relevant products as JSON. Consider synonyms, context, "
                    "and customer intent."
                )
            },
            {
                "role": "user",
                "content": f"Query: {query}\nCatalog: {catalog}"
            }
        ],
        response_format={"type": "json_object"},
        max_tokens=2048
    )
    return response.choices[0].message.content
```

---

## Configuration

### Environment Variables

```bash
# Lightning AI API
export LIGHTNING_API_KEY="your-api-key-here"
export LIGHTNING_API_BASE="https://api.lightning.ai/v1"

# Default model selection
export LIGHTNING_DEFAULT_MODEL="gpt-oss-120b"
export LIGHTNING_FALLBACK_MODEL="gpt-oss-20b"

# Rate limiting
export LIGHTNING_MAX_RETRIES=3
export LIGHTNING_TIMEOUT=60
```

### Integration Config (YAML)

See `configs/lightning-models-workflow.yml` for the full NeMo Agent Toolkit integration configuration.

---

## Resources

- [Lightning AI Platform](https://lightning.ai)
- [Lightning AI Documentation](https://lightning.ai/docs)
- [LitServe — Fast AI Model Serving](https://github.com/Lightning-AI/LitServe)
- [Lightning SDK](https://github.com/Lightning-AI/lightning-sdk)
- [NVIDIA Nemotron Integration](../nvidia-nemotron/README.md)
- [NeMo Agent Toolkit Integration](../nemo-agent-toolkit/README.md)
- [HuggingFace Models Catalog](../huggingface-models/README.md)

---

*Integrated by Life Imitates Art Inc. for the Ms Money Penny Desktop Store App.*