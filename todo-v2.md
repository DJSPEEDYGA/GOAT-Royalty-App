# GOAT Royalties - Hugging Face & Open Source Model Integration

## Phase 1: Hugging Face Inference Providers Client
- [x] Create lib/huggingface/hf-inference-client.js with support for 16+ providers
- [x] Add provider configs: Groq, Cerebras, SambaNova, Together AI, Fireworks, Novita, Replicate, Cohere, Scaleway, Hyperbolic, fal, Featherless, Nscale, HF Inference API, vLLM, Ollama
- [x] Support for text-generation, image-to-text, object-detection, embeddings

## Phase 2: Model Registry - Popular Open Source Models
- [x] Create lib/models/model-registry.js with 40+ curated popular models
- [x] Categories: Text Generation, Code, Vision, Audio, Embedding, Multimodal
- [x] Include Qwen3, Llama 3.1/3.3, Gemma 3, Mistral, DeepSeek, Phi-4, GLM, StarCoder, etc.
- [x] Model metadata: params, license, context length, quantization, provider compatibility

## Phase 3: Update AI Config & Server
- [x] Update ai-config.js with HF providers and model registry
- [x] Add HF API routes to server.js (/api/hf/*)
- [x] Add model registry routes (/api/models/*)
- [x] Add local runner detection endpoints
- [x] Update .env.example with all provider API keys

## Phase 4: Frontend - Expanded Model Hub
- [ ] Update public/index.html with expanded Model Hub
- [ ] Add HF Inference Providers section with provider cards
- [ ] Add model categories/tabs (Text, Code, Vision, Audio, Embedding)
- [ ] Add local runner status panel (Ollama, llama.cpp, vLLM)
- [ ] Update chat to support all providers

## Phase 5: Test & Push
- [ ] Test server startup with all new components
- [ ] Test API endpoints
- [ ] Commit and push to feature branch
- [ ] Update PR #4