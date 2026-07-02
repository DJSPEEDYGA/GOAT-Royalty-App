# NVIDIA Nemotron Speech Models

> Complete catalog of NVIDIA Speech AI models — ASR, TTS, S2S, NMT, and AST for enterprise voice-powered applications.

---

## 🎙️ Automatic Speech Recognition (ASR)

Low latency NVIDIA Nemotron Speech transcription models for agentic AI workflows.

| Model | Description | Languages | Status |
|-------|-------------|-----------|--------|
| [**nemotron-asr-streaming**](https://build.nvidia.com/nvidia/nemotron-asr-streaming) | Real-time streaming speech recognition | English | ✅ Downloadable |
| [**parakeet-1.1b-rnnt-multilingual-asr**](https://build.nvidia.com/nvidia/parakeet-1.1b-rnnt-multilingual-asr) | High accuracy transcription in 25 languages | 25 languages | ✅ Downloadable |
| [**parakeet-ctc-1.1b-asr**](https://build.nvidia.com/nvidia/parakeet-ctc-1.1b-asr) | Record-setting accuracy for English transcription | English | ✅ Downloadable |
| [**parakeet-tdt-0.6b-v2**](https://build.nvidia.com/nvidia/parakeet-tdt-0.6b-v2) | Accurate English transcriptions with punctuation & timestamps | English | ✅ Downloadable |
| [**parakeet-ctc-0.6b-asr**](https://build.nvidia.com/nvidia/parakeet-ctc-0.6b-asr) | State-of-the-art accuracy and speed for English | English | ✅ Downloadable |
| [**parakeet-ctc-0.6b-zh-tw**](https://build.nvidia.com/nvidia/parakeet-ctc-0.6b-zh-tw) | Record-setting Mandarin Taiwanese English transcription | ZH-TW, EN | ✅ Downloadable |
| [**parakeet-ctc-0.6b-zh-cn**](https://build.nvidia.com/nvidia/parakeet-ctc-0.6b-zh-cn) | Record-setting Mandarin English transcriptions | ZH-CN, EN | ✅ Downloadable |
| [**parakeet-ctc-0.6b-es**](https://build.nvidia.com/nvidia/parakeet-ctc-0.6b-es) | Accurate Spanish English transcriptions | ES, EN | ✅ Downloadable |
| [**parakeet-ctc-0.6b-vi**](https://build.nvidia.com/nvidia/parakeet-ctc-0.6b-vi) | Accurate Vietnamese English transcriptions | VI, EN | ✅ Downloadable |
| [**canary-1b-asr**](https://build.nvidia.com/nvidia/canary-1b-asr) | Multi-lingual speech-to-text recognition & translation | Multi | ✅ Downloadable |
| [**whisper-large-v3**](https://build.nvidia.com/openai/whisper-large-v3) | Robust speech recognition via large-scale weak supervision | 99 languages | ✅ Downloadable |

### HuggingFace ASR Models

| Model | Downloads | HuggingFace |
|-------|-----------|-------------|
| nvidia/parakeet-tdt-0.6b-v3 | 209k | [Link](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v3) |
| nvidia/nemotron-speech-streaming-en-0.6b | 37.4k | [Link](https://huggingface.co/nvidia/nemotron-speech-streaming-en-0.6b) |
| openai/whisper-large-v3 | 5.34M | [Link](https://huggingface.co/openai/whisper-large-v3) |
| ibm-granite/granite-4.0-1b-speech | 20.3k | [Link](https://huggingface.co/ibm-granite/granite-4.0-1b-speech) |
| pyannote/speaker-diarization-3.1 | 12.5M | [Link](https://huggingface.co/pyannote/speaker-diarization-3.1) |
| Qwen/Qwen3-ASR-1.7B | 869k | [Link](https://huggingface.co/Qwen/Qwen3-ASR-1.7B) |
| mistralai/Voxtral-Mini-4B-Realtime-2602 | 728k | [Link](https://huggingface.co/mistralai/Voxtral-Mini-4B-Realtime-2602) |

---

## 🗣️ Speech to Speech (S2S)

Ultra-low latency, end-to-end, full duplex models for real-time voice-to-voice interactions.

| Model | Description | Languages | Status |
|-------|-------------|-----------|--------|
| [**nemotron-voicechat**](https://build.nvidia.com/nvidia/nemotron-voicechat) | Nemotron 3 Voicechat — real-time voice conversations | English | 🆓 Free Endpoint |

### HuggingFace S2S / Audio Models

| Model | Downloads | HuggingFace |
|-------|-----------|-------------|
| nvidia/personaplex-7b-v1 | 405k | [Link](https://huggingface.co/nvidia/personaplex-7b-v1) |
| tencent/Covo-Audio-Chat | 77 | [Link](https://huggingface.co/tencent/Covo-Audio-Chat) |

---

## 📢 Text to Speech (TTS)

Convert written text to spoken audio in multiple languages with NVIDIA Nemotron Speech models.

| Model | Description | Languages | Status |
|-------|-------------|-----------|--------|
| [**magpie-tts-multilingual**](https://build.nvidia.com/nvidia/magpie-tts-multilingual) | Natural and expressive voices in multiple languages. For voice agents and brand ambassadors. | Multi | ✅ Downloadable |
| [**magpie-tts-zeroshot**](https://build.nvidia.com/nvidia/magpie-tts-zeroshot) | Expressive TTS generated from a short audio sample | Multi | 🆓 Free Endpoint |
| [**magpie-tts-flow**](https://build.nvidia.com/nvidia/magpie-tts-flow) | Expressive TTS via flow-matching, from a short audio sample | Multi | 🆓 Free Endpoint |

### HuggingFace TTS Models

| Model | Downloads | HuggingFace |
|-------|-----------|-------------|
| fishaudio/s2-pro | 7k | [Link](https://huggingface.co/fishaudio/s2-pro) |
| hexgrad/Kokoro-82M | 8.75M | [Link](https://huggingface.co/hexgrad/Kokoro-82M) |
| HumeAI/tada-1b | 36.7k | [Link](https://huggingface.co/HumeAI/tada-1b) |
| HumeAI/tada-3b-ml | 11.9k | [Link](https://huggingface.co/HumeAI/tada-3b-ml) |
| Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice | 1.14M | [Link](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice) |

---

## 🌐 Neural Machine Translation (NMT) & Audio Speech Translation (AST)

Seamless multilingual global communication across dozens of languages.

| Model | Description | Languages | Status |
|-------|-------------|-----------|--------|
| [**riva-translate-4b-instruct-v1_1**](https://build.nvidia.com/nvidia/riva-translate-4b-instruct-v1_1) | Translation in 12 languages with few-shot prompts | 12 languages | 🆓 Free Endpoint |
| [**riva-translate-1.6b**](https://build.nvidia.com/nvidia/riva-translate-1.6b) | Smooth global interactions in 36 languages | 36 languages | ✅ Downloadable |
| [**canary-1b-asr**](https://build.nvidia.com/nvidia/canary-1b-asr) | Multi-lingual speech-to-text with translation | Multi | ✅ Downloadable |
| [**whisper-large-v3**](https://build.nvidia.com/openai/whisper-large-v3) | Robust multi-lingual recognition and translation | 99 languages | ✅ Downloadable |

---

## 🔧 Integration with NeMo Agent Toolkit

```yaml
# workflow.yml — Voice-enabled agent with Nemotron Speech
functions:
  speech_to_text:
    _type: nvidia_asr
    model: nemotron-asr-streaming
    language: en

  text_to_speech:
    _type: nvidia_tts
    model: magpie-tts-multilingual
    voice: default

  product_search:
    _type: rest_api
    name: product_search
    endpoint: "http://localhost:3942/api/products/search"

llms:
  nemotron_nano:
    _type: nim
    model_name: nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16

workflow:
  _type: react_agent
  tool_names: [speech_to_text, text_to_speech, product_search]
  llm_name: nemotron_nano
  system_prompt: |
    You are Ms Money Penny, a voice-enabled shopping assistant.
    Listen to customer requests, search products, and respond with speech.
```

---

## Quick Start

```bash
# Install NVIDIA NeMo ASR toolkit
pip install nemo_toolkit[asr]

# Run streaming ASR
python -c "
import nemo.collections.asr as nemo_asr
model = nemo_asr.models.ASRModel.from_pretrained('nvidia/parakeet-tdt-0.6b-v2')
transcription = model.transcribe(['audio.wav'])
print(transcription)
"
```

---

## Links

- [NVIDIA Build — Speech Models](https://build.nvidia.com/explore/speech)
- [NVIDIA NeMo ASR](https://docs.nvidia.com/nemo-framework/user-guide/latest/nemotoolkit/asr/)
- [NVIDIA Riva SDK](https://developer.nvidia.com/riva)
- [NeMo Agent Toolkit](https://docs.nvidia.com/nemo/agent-toolkit/)