# 🎨 HuggingFace Text-to-Image & Image-to-Image Models Catalog

> **50,000+ Models** — Complete catalog of Text-to-Image, Image-to-Image, and LoRA style models from [HuggingFace](https://huggingface.co/models?pipeline_tag=text-to-image).
> **NO LOGINS. NO API KEYS. Direct download to your 100TB servers.**

---

## 📋 Table of Contents

- [Quick Start — Download Everything](#quick-start--download-everything)
- [Recently Updated Models](#recently-updated-models)
- [LoRA Style Transfer Models](#lora-style-transfer-models)
- [Character & Avatar LoRAs](#character--avatar-loras)
- [Photography & Realism LoRAs](#photography--realism-loras)
- [Image Editing Models](#image-editing-models)
- [Video Generation Models](#video-generation-models)
- [Specialty & Niche LoRAs](#specialty--niche-loras)
- [Foundation Models (Base)](#foundation-models-base)
- [Comprehensive Text-to-Image Guide](#comprehensive-text-to-image-guide)
- [Bulk Download Scripts](#bulk-download-scripts)
- [Model Evaluation Framework](#model-evaluation-framework)

---

## 🚀 Quick Start — Download Everything

**NO login required. NO API keys. Just `git clone` or `wget`.**

### Single Model Download

```bash
# Clone any model directly — NO authentication needed
git lfs install
git clone https://huggingface.co/black-forest-labs/FLUX.1-dev

# Or use huggingface-cli (no login for public models)
pip install huggingface_hub
huggingface-cli download black-forest-labs/FLUX.1-dev --local-dir ./models/FLUX.1-dev

# Or use wget for individual files
wget https://huggingface.co/black-forest-labs/FLUX.1-dev/resolve/main/flux1-dev.safetensors
```

### Bulk Download All Models to Your 100TB Server

```bash
# Use the included bulk download script — NO auth needed
chmod +x ../scripts/bulk-download.sh
./scripts/bulk-download.sh --output /mnt/100tb/huggingface-models --category text-to-image

# Or use the Python downloader for more control
python3 ../scripts/bulk-downloader.py --output /mnt/100tb/models --parallel 8
```

---

## 🔥 Recently Updated Models (Last 7 Days)

### Text-to-Image — Updated Within 1 Day

| Model | Task | Likes | Download |
|-------|------|-------|----------|
| [alphaduriendur/avatar-weights-01](https://huggingface.co/alphaduriendur/avatar-weights-01) | Text-to-Image | 58 | `git clone https://huggingface.co/alphaduriendur/avatar-weights-01` |
| [neiroia/rockconcert_style_LoRA](https://huggingface.co/neiroia/rockconcert_style_LoRA) | Text-to-Image | 5 | `git clone https://huggingface.co/neiroia/rockconcert_style_LoRA` |
| [plina/plina_style_LoRA](https://huggingface.co/plina/plina_style_LoRA) | Text-to-Image | — | `git clone https://huggingface.co/plina/plina_style_LoRA` |
| [prithivMLmods/QIE-2509-Object-Mover-Bbox](https://huggingface.co/prithivMLmods/QIE-2509-Object-Mover-Bbox) | Image-to-Image | 2 | `git clone https://huggingface.co/prithivMLmods/QIE-2509-Object-Mover-Bbox` |
| [prithivMLmods/QIE-2511-Object-Mover-Bbox](https://huggingface.co/prithivMLmods/QIE-2511-Object-Mover-Bbox) | Image-to-Image | 1 | `git clone https://huggingface.co/prithivMLmods/QIE-2511-Object-Mover-Bbox` |
| [SeifElden2342532/flux-lora-characters](https://huggingface.co/SeifElden2342532/flux-lora-characters) | Text-to-Image | 1 | `git clone https://huggingface.co/SeifElden2342532/flux-lora-characters` |

### Text-to-Image — Updated Within 2-3 Days

| Model | Task | Likes | Download |
|-------|------|-------|----------|
| [Chunte/huggy-style-v1-lora](https://huggingface.co/Chunte/huggy-style-v1-lora) | Text-to-Image | 7 | `git clone https://huggingface.co/Chunte/huggy-style-v1-lora` |
| [1337goose/KaterinaTLOD](https://huggingface.co/1337goose/KaterinaTLOD) | Text-to-Image | 10 | `git clone https://huggingface.co/1337goose/KaterinaTLOD` |
| [imbaQ/lcm-lora-sdxl](https://huggingface.co/imbaQ/lcm-lora-sdxl) | Text-to-Image | 2 | `git clone https://huggingface.co/imbaQ/lcm-lora-sdxl` |
| [1337goose/KetTLOD](https://huggingface.co/1337goose/KetTLOD) | Text-to-Image | 13 | `git clone https://huggingface.co/1337goose/KetTLOD` |
| [Barlowtech/rina_ai](https://huggingface.co/Barlowtech/rina_ai) | Text-to-Image | 52 | `git clone https://huggingface.co/Barlowtech/rina_ai` |
| [globaltraders/lara-21-flux-lora](https://huggingface.co/globaltraders/lara-21-flux-lora) | Text-to-Image | 11 | `git clone https://huggingface.co/globaltraders/lara-21-flux-lora` |
| [Natasamk/lumi-character-lora](https://huggingface.co/Natasamk/lumi-character-lora) | Text-to-Image | 13 | `git clone https://huggingface.co/Natasamk/lumi-character-lora` |
| [andrbykov/vangogh_style_LoRA](https://huggingface.co/andrbykov/vangogh_style_LoRA) | Text-to-Image | 10 | `git clone https://huggingface.co/andrbykov/vangogh_style_LoRA` |
| [Anejka/anejka_style_LoRA](https://huggingface.co/Anejka/anejka_style_LoRA) | Text-to-Image | 4 | `git clone https://huggingface.co/Anejka/anejka_style_LoRA` |
| [LippmannAI/veiter-lora-flux](https://huggingface.co/LippmannAI/veiter-lora-flux) | Text-to-Image | — | `git clone https://huggingface.co/LippmannAI/veiter-lora-flux` |
| [Vafich/avasnetsov_style_LoRA](https://huggingface.co/Vafich/avasnetsov_style_LoRA) | Text-to-Image | 2 | `git clone https://huggingface.co/Vafich/avasnetsov_style_LoRA` |
| [pils0n/claudemonet_style_LoRA](https://huggingface.co/pils0n/claudemonet_style_LoRA) | Text-to-Image | 5 | `git clone https://huggingface.co/pils0n/claudemonet_style_LoRA` |
| [sneaxnvice/lustly-ai](https://huggingface.co/sneaxnvice/lustly-ai) | Text-to-Image | 22 | `git clone https://huggingface.co/sneaxnvice/lustly-ai` |
| [kristian1515/filmgrain-redmond-filmgrain-lora-for-sdxl](https://huggingface.co/kristian1515/filmgrain-redmond-filmgrain-lora-for-sdxl) | Text-to-Image | 6 | `git clone https://huggingface.co/kristian1515/filmgrain-redmond-filmgrain-lora-for-sdxl` |
| [gvhfyhgif/tekilasuns3t_style_LoRA](https://huggingface.co/gvhfyhgif/tekilasuns3t_style_LoRA) | Text-to-Image | 6 | `git clone https://huggingface.co/gvhfyhgif/tekilasuns3t_style_LoRA` |
| [nepirog/nepirog_style_LoRA](https://huggingface.co/nepirog/nepirog_style_LoRA) | Text-to-Image | 7 | `git clone https://huggingface.co/nepirog/nepirog_style_LoRA` |

### Text-to-Image — Updated Within 4-5 Days

| Model | Task | Likes | Download |
|-------|------|-------|----------|
| [Alex2422/Amaya_new](https://huggingface.co/Alex2422/Amaya_new) | Text-to-Image | 18 | `git clone https://huggingface.co/Alex2422/Amaya_new` |
| [Krioklininkas/kaia](https://huggingface.co/Krioklininkas/kaia) | Text-to-Image | 15 | `git clone https://huggingface.co/Krioklininkas/kaia` |
| [Alia31566/Vinogradov_LoRA](https://huggingface.co/Alia31566/Vinogradov_LoRA) | Text-to-Image | 4 | `git clone https://huggingface.co/Alia31566/Vinogradov_LoRA` |
| [yxw1231/Qwen-Edit-2509-Multiple-angles](https://huggingface.co/yxw1231/Qwen-Edit-2509-Multiple-angles) | Image-to-Image | 19 | `git clone https://huggingface.co/yxw1231/Qwen-Edit-2509-Multiple-angles` |
| [Alia31566/NOZHEV_LoRA](https://huggingface.co/Alia31566/NOZHEV_LoRA) | Text-to-Image | 9 | `git clone https://huggingface.co/Alia31566/NOZHEV_LoRA` |
| [Alia31566/Delovarya_LoRA](https://huggingface.co/Alia31566/Delovarya_LoRA) | Text-to-Image | 5 | `git clone https://huggingface.co/Alia31566/Delovarya_LoRA` |
| [Zhmak/fairey_posters_style_LoRA](https://huggingface.co/Zhmak/fairey_posters_style_LoRA) | Text-to-Image | 4 | `git clone https://huggingface.co/Zhmak/fairey_posters_style_LoRA` |
| [gvhfyhgif/rosetty_style_LoRA](https://huggingface.co/gvhfyhgif/rosetty_style_LoRA) | Text-to-Image | 4 | `git clone https://huggingface.co/gvhfyhgif/rosetty_style_LoRA` |
| [ftyuiolkmnjhg/diberkato_style_LoRA](https://huggingface.co/ftyuiolkmnjhg/diberkato_style_LoRA) | Text-to-Image | 3 | `git clone https://huggingface.co/ftyuiolkmnjhg/diberkato_style_LoRA` |
| [gotha1312/azis1](https://huggingface.co/gotha1312/azis1) | Text-to-Image | 11 | `git clone https://huggingface.co/gotha1312/azis1` |
| [srmbiz/lora3](https://huggingface.co/srmbiz/lora3) | Text-to-Image | 15 | `git clone https://huggingface.co/srmbiz/lora3` |
| [srmbiz/myloraskin](https://huggingface.co/srmbiz/myloraskin) | Text-to-Image | 18 | `git clone https://huggingface.co/srmbiz/myloraskin` |
| [ALDOGS/miami-lora](https://huggingface.co/ALDOGS/miami-lora) | Text-to-Image | 21 | `git clone https://huggingface.co/ALDOGS/miami-lora` |
| [sololo-xyz/VG22Flora](https://huggingface.co/sololo-xyz/VG22Flora) | Text-to-Image | 10 | `git clone https://huggingface.co/sololo-xyz/VG22Flora` |
| [xr669/Tessa](https://huggingface.co/xr669/Tessa) | Text-to-Image | 8 | `git clone https://huggingface.co/xr669/Tessa` |
| [artshooter/flux-hand-drawn-stickman](https://huggingface.co/artshooter/flux-hand-drawn-stickman) | Text-to-Image | 12 | `git clone https://huggingface.co/artshooter/flux-hand-drawn-stickman` |
| [sololo-xyz/VG21Amanda_ZITv2](https://huggingface.co/sololo-xyz/VG21Amanda_ZITv2) | Text-to-Image | 22 | `git clone https://huggingface.co/sololo-xyz/VG21Amanda_ZITv2` |
| [darrenfu/Asian_model](https://huggingface.co/darrenfu/Asian_model) | Text-to-Image | 61 | `git clone https://huggingface.co/darrenfu/Asian_model` |
| [Mariiaaaaa/vittorio_reggianini_LoRA](https://huggingface.co/Mariiaaaaa/vittorio_reggianini_LoRA) | Text-to-Image | 5 | `git clone https://huggingface.co/Mariiaaaaa/vittorio_reggianini_LoRA` |

### Text-to-Image — Updated Within 6-7 Days

| Model | Task | Likes | Download |
|-------|------|-------|----------|
| [V1shu69/flux-RealismLora](https://huggingface.co/V1shu69/flux-RealismLora) | Text-to-Image | 10 | `git clone https://huggingface.co/V1shu69/flux-RealismLora` |
| [pils0n/langreiter_style_LoRA](https://huggingface.co/pils0n/langreiter_style_LoRA) | Text-to-Image | 3 | `git clone https://huggingface.co/pils0n/langreiter_style_LoRA` |
| [pils0n/frutiger_style_LoRA](https://huggingface.co/pils0n/frutiger_style_LoRA) | Text-to-Image | 3 | `git clone https://huggingface.co/pils0n/frutiger_style_LoRA` |
| [pils0n/fruit_style_LoRA](https://huggingface.co/pils0n/fruit_style_LoRA) | Text-to-Image | 3 | `git clone https://huggingface.co/pils0n/fruit_style_LoRA` |
| [Kokosha01/Wan2.2_StrangeNames](https://huggingface.co/Kokosha01/Wan2.2_StrangeNames) | Text-to-Image | 412 | `git clone https://huggingface.co/Kokosha01/Wan2.2_StrangeNames` |
| [polichwafer/olviertakac_style_LoRA](https://huggingface.co/polichwafer/olviertakac_style_LoRA) | Text-to-Image | 4 | `git clone https://huggingface.co/polichwafer/olviertakac_style_LoRA` |
| [ZayacGde/vangog_style_LoRA](https://huggingface.co/ZayacGde/vangog_style_LoRA) | Text-to-Image | 3 | `git clone https://huggingface.co/ZayacGde/vangog_style_LoRA` |
| [pils0n/rosie_style_LoRA](https://huggingface.co/pils0n/rosie_style_LoRA) | Text-to-Image | 3 | `git clone https://huggingface.co/pils0n/rosie_style_LoRA` |
| [Cilvia/Kochkina_style_LoRA](https://huggingface.co/Cilvia/Kochkina_style_LoRA) | Text-to-Image | 2 | `git clone https://huggingface.co/Cilvia/Kochkina_style_LoRA` |
| [Rabornkraken/flux2-xhs-travel-lora](https://huggingface.co/Rabornkraken/flux2-xhs-travel-lora) | Text-to-Image | 81 | `git clone https://huggingface.co/Rabornkraken/flux2-xhs-travel-lora` |
| [esherick/fidenza](https://huggingface.co/esherick/fidenza) | Text-to-Image | 12 | `git clone https://huggingface.co/esherick/fidenza` |
| [lynaNSFW/Qwen_3_8B](https://huggingface.co/lynaNSFW/Qwen_3_8B) | Text-to-Image | 7 | `git clone https://huggingface.co/lynaNSFW/Qwen_3_8B` |
| [Cilvia/cherakshin_style_LoRA](https://huggingface.co/Cilvia/cherakshin_style_LoRA) | Text-to-Image | 5 | `git clone https://huggingface.co/Cilvia/cherakshin_style_LoRA` |
| [bigdotdog/rachel2500](https://huggingface.co/bigdotdog/rachel2500) | Text-to-Image | 15 | `git clone https://huggingface.co/bigdotdog/rachel2500` |
| [danildushenev/pneumothorax-lora-flux-2-dev](https://huggingface.co/danildushenev/pneumothorax-lora-flux-2-dev) | Text-to-Image | 15 | `git clone https://huggingface.co/danildushenev/pneumothorax-lora-flux-2-dev` |
| [Alia31566/Niko_Pirosmani_LoRA](https://huggingface.co/Alia31566/Niko_Pirosmani_LoRA) | Text-to-Image | 2 | `git clone https://huggingface.co/Alia31566/Niko_Pirosmani_LoRA` |
| [BadRabbit11101/Cat_Tina](https://huggingface.co/BadRabbit11101/Cat_Tina) | Text-to-Image | 3 | `git clone https://huggingface.co/BadRabbit11101/Cat_Tina` |
| [XonarLabs/OLOID_Framework](https://huggingface.co/XonarLabs/OLOID_Framework) | Text-to-Image | 148 | `git clone https://huggingface.co/XonarLabs/OLOID_Framework` |

### Video Generation — Updated Within 7 Days

| Model | Task | Likes | Download |
|-------|------|-------|----------|
| [editedge/LTX-2-19b-LoRA-Camera-Control-Jib-Down](https://huggingface.co/editedge/LTX-2-19b-LoRA-Camera-Control-Jib-Down) | Text-to-Video | — | `git clone https://huggingface.co/editedge/LTX-2-19b-LoRA-Camera-Control-Jib-Down` |

---

## 🎨 LoRA Style Transfer Models

### Classical Art Styles

| Model | Artist/Style | Base | Download |
|-------|-------------|------|----------|
| [andrbykov/vangogh_style_LoRA](https://huggingface.co/andrbykov/vangogh_style_LoRA) | Van Gogh | FLUX | `git clone https://huggingface.co/andrbykov/vangogh_style_LoRA` |
| [ZayacGde/vangog_style_LoRA](https://huggingface.co/ZayacGde/vangog_style_LoRA) | Van Gogh variant | FLUX | `git clone https://huggingface.co/ZayacGde/vangog_style_LoRA` |
| [pils0n/claudemonet_style_LoRA](https://huggingface.co/pils0n/claudemonet_style_LoRA) | Claude Monet | FLUX | `git clone https://huggingface.co/pils0n/claudemonet_style_LoRA` |
| [Vafich/avasnetsov_style_LoRA](https://huggingface.co/Vafich/avasnetsov_style_LoRA) | Vasnetsov | FLUX | `git clone https://huggingface.co/Vafich/avasnetsov_style_LoRA` |
| [Alia31566/Vinogradov_LoRA](https://huggingface.co/Alia31566/Vinogradov_LoRA) | Vinogradov | FLUX | `git clone https://huggingface.co/Alia31566/Vinogradov_LoRA` |
| [Alia31566/NOZHEV_LoRA](https://huggingface.co/Alia31566/NOZHEV_LoRA) | Nozhev | FLUX | `git clone https://huggingface.co/Alia31566/NOZHEV_LoRA` |
| [Alia31566/Delovarya_LoRA](https://huggingface.co/Alia31566/Delovarya_LoRA) | Delovarya | FLUX | `git clone https://huggingface.co/Alia31566/Delovarya_LoRA` |
| [Alia31566/Niko_Pirosmani_LoRA](https://huggingface.co/Alia31566/Niko_Pirosmani_LoRA) | Niko Pirosmani | FLUX | `git clone https://huggingface.co/Alia31566/Niko_Pirosmani_LoRA` |
| [Mariiaaaaa/vittorio_reggianini_LoRA](https://huggingface.co/Mariiaaaaa/vittorio_reggianini_LoRA) | Vittorio Reggianini | FLUX | `git clone https://huggingface.co/Mariiaaaaa/vittorio_reggianini_LoRA` |
| [Cilvia/Kochkina_style_LoRA](https://huggingface.co/Cilvia/Kochkina_style_LoRA) | Kochkina | FLUX | `git clone https://huggingface.co/Cilvia/Kochkina_style_LoRA` |
| [Cilvia/cherakshin_style_LoRA](https://huggingface.co/Cilvia/cherakshin_style_LoRA) | Cherakshin | FLUX | `git clone https://huggingface.co/Cilvia/cherakshin_style_LoRA` |
| [polichwafer/olviertakac_style_LoRA](https://huggingface.co/polichwafer/olviertakac_style_LoRA) | Oliver Takac | FLUX | `git clone https://huggingface.co/polichwafer/olviertakac_style_LoRA` |

### Design & Graphic Styles

| Model | Style | Base | Download |
|-------|-------|------|----------|
| [Zhmak/fairey_posters_style_LoRA](https://huggingface.co/Zhmak/fairey_posters_style_LoRA) | Shepard Fairey posters | FLUX | `git clone https://huggingface.co/Zhmak/fairey_posters_style_LoRA` |
| [pils0n/langreiter_style_LoRA](https://huggingface.co/pils0n/langreiter_style_LoRA) | Langreiter design | FLUX | `git clone https://huggingface.co/pils0n/langreiter_style_LoRA` |
| [pils0n/frutiger_style_LoRA](https://huggingface.co/pils0n/frutiger_style_LoRA) | Frutiger design | FLUX | `git clone https://huggingface.co/pils0n/frutiger_style_LoRA` |
| [pils0n/rosie_style_LoRA](https://huggingface.co/pils0n/rosie_style_LoRA) | Rosie aesthetic | FLUX | `git clone https://huggingface.co/pils0n/rosie_style_LoRA` |
| [gvhfyhgif/tekilasuns3t_style_LoRA](https://huggingface.co/gvhfyhgif/tekilasuns3t_style_LoRA) | Tequila sunset | FLUX | `git clone https://huggingface.co/gvhfyhgif/tekilasuns3t_style_LoRA` |
| [gvhfyhgif/rosetty_style_LoRA](https://huggingface.co/gvhfyhgif/rosetty_style_LoRA) | Rosetty | FLUX | `git clone https://huggingface.co/gvhfyhgif/rosetty_style_LoRA` |
| [ftyuiolkmnjhg/diberkato_style_LoRA](https://huggingface.co/ftyuiolkmnjhg/diberkato_style_LoRA) | Diberkato | FLUX | `git clone https://huggingface.co/ftyuiolkmnjhg/diberkato_style_LoRA` |
| [LippmannAI/veiter-lora-flux](https://huggingface.co/LippmannAI/veiter-lora-flux) | Veiter | FLUX | `git clone https://huggingface.co/LippmannAI/veiter-lora-flux` |
| [Anejka/anejka_style_LoRA](https://huggingface.co/Anejka/anejka_style_LoRA) | Anejka custom | FLUX | `git clone https://huggingface.co/Anejka/anejka_style_LoRA` |
| [nepirog/nepirog_style_LoRA](https://huggingface.co/nepirog/nepirog_style_LoRA) | Nepirog | FLUX | `git clone https://huggingface.co/nepirog/nepirog_style_LoRA` |
| [plina/plina_style_LoRA](https://huggingface.co/plina/plina_style_LoRA) | Plina | FLUX | `git clone https://huggingface.co/plina/plina_style_LoRA` |
| [neiroia/rockconcert_style_LoRA](https://huggingface.co/neiroia/rockconcert_style_LoRA) | Rock concert | FLUX | `git clone https://huggingface.co/neiroia/rockconcert_style_LoRA` |

### Specialty Styles

| Model | Style | Base | Download |
|-------|-------|------|----------|
| [kristian1515/filmgrain-redmond-filmgrain-lora-for-sdxl](https://huggingface.co/kristian1515/filmgrain-redmond-filmgrain-lora-for-sdxl) | Film grain | SDXL | `git clone https://huggingface.co/kristian1515/filmgrain-redmond-filmgrain-lora-for-sdxl` |
| [artshooter/flux-hand-drawn-stickman](https://huggingface.co/artshooter/flux-hand-drawn-stickman) | Hand-drawn stickman | FLUX | `git clone https://huggingface.co/artshooter/flux-hand-drawn-stickman` |
| [pils0n/fruit_style_LoRA](https://huggingface.co/pils0n/fruit_style_LoRA) | Fruit aesthetic | FLUX | `git clone https://huggingface.co/pils0n/fruit_style_LoRA` |
| [esherick/fidenza](https://huggingface.co/esherick/fidenza) | Fidenza generative art | FLUX | `git clone https://huggingface.co/esherick/fidenza` |
| [Chunte/huggy-style-v1-lora](https://huggingface.co/Chunte/huggy-style-v1-lora) | Huggy style | FLUX | `git clone https://huggingface.co/Chunte/huggy-style-v1-lora` |
| [imbaQ/lcm-lora-sdxl](https://huggingface.co/imbaQ/lcm-lora-sdxl) | LCM fast generation | SDXL | `git clone https://huggingface.co/imbaQ/lcm-lora-sdxl` |
| [ALDOGS/miami-lora](https://huggingface.co/ALDOGS/miami-lora) | Miami aesthetic | FLUX | `git clone https://huggingface.co/ALDOGS/miami-lora` |

---

## 👤 Character & Avatar LoRAs

| Model | Description | Likes | Download |
|-------|-------------|-------|----------|
| [alphaduriendur/avatar-weights-01](https://huggingface.co/alphaduriendur/avatar-weights-01) | Avatar character weights | 58 | `git clone https://huggingface.co/alphaduriendur/avatar-weights-01` |
| [Barlowtech/rina_ai](https://huggingface.co/Barlowtech/rina_ai) | Rina AI character | 52 | `git clone https://huggingface.co/Barlowtech/rina_ai` |
| [Natasamk/lumi-character-lora](https://huggingface.co/Natasamk/lumi-character-lora) | Lumi character | 13 | `git clone https://huggingface.co/Natasamk/lumi-character-lora` |
| [1337goose/KaterinaTLOD](https://huggingface.co/1337goose/KaterinaTLOD) | Katerina character | 10 | `git clone https://huggingface.co/1337goose/KaterinaTLOD` |
| [1337goose/KetTLOD](https://huggingface.co/1337goose/KetTLOD) | Ket character | 13 | `git clone https://huggingface.co/1337goose/KetTLOD` |
| [Alex2422/Amaya_new](https://huggingface.co/Alex2422/Amaya_new) | Amaya character | 18 | `git clone https://huggingface.co/Alex2422/Amaya_new` |
| [Krioklininkas/kaia](https://huggingface.co/Krioklininkas/kaia) | Kaia character | 15 | `git clone https://huggingface.co/Krioklininkas/kaia` |
| [globaltraders/lara-21-flux-lora](https://huggingface.co/globaltraders/lara-21-flux-lora) | Lara character | 11 | `git clone https://huggingface.co/globaltraders/lara-21-flux-lora` |
| [SeifElden2342532/flux-lora-characters](https://huggingface.co/SeifElden2342532/flux-lora-characters) | FLUX character set | 1 | `git clone https://huggingface.co/SeifElden2342532/flux-lora-characters` |
| [xr669/Tessa](https://huggingface.co/xr669/Tessa) | Tessa character | 8 | `git clone https://huggingface.co/xr669/Tessa` |
| [sololo-xyz/VG22Flora](https://huggingface.co/sololo-xyz/VG22Flora) | Flora character | 10 | `git clone https://huggingface.co/sololo-xyz/VG22Flora` |
| [sololo-xyz/VG21Amanda_ZITv2](https://huggingface.co/sololo-xyz/VG21Amanda_ZITv2) | Amanda character | 22 | `git clone https://huggingface.co/sololo-xyz/VG21Amanda_ZITv2` |
| [bigdotdog/rachel2500](https://huggingface.co/bigdotdog/rachel2500) | Rachel character | 15 | `git clone https://huggingface.co/bigdotdog/rachel2500` |
| [BadRabbit11101/Cat_Tina](https://huggingface.co/BadRabbit11101/Cat_Tina) | Cat Tina character | 3 | `git clone https://huggingface.co/BadRabbit11101/Cat_Tina` |
| [gotha1312/azis1](https://huggingface.co/gotha1312/azis1) | Azis character | 11 | `git clone https://huggingface.co/gotha1312/azis1` |
| [darrenfu/Asian_model](https://huggingface.co/darrenfu/Asian_model) | Asian model aesthetic | 61 | `git clone https://huggingface.co/darrenfu/Asian_model` |
| [sneaxnvice/lustly-ai](https://huggingface.co/sneaxnvice/lustly-ai) | Lustly AI | 22 | `git clone https://huggingface.co/sneaxnvice/lustly-ai` |
| [srmbiz/lora3](https://huggingface.co/srmbiz/lora3) | Custom character | 15 | `git clone https://huggingface.co/srmbiz/lora3` |
| [srmbiz/myloraskin](https://huggingface.co/srmbiz/myloraskin) | Custom skin style | 18 | `git clone https://huggingface.co/srmbiz/myloraskin` |
| [lynaNSFW/Qwen_3_8B](https://huggingface.co/lynaNSFW/Qwen_3_8B) | Qwen 3 8B variant | 7 | `git clone https://huggingface.co/lynaNSFW/Qwen_3_8B` |

---

## 📷 Photography & Realism LoRAs

| Model | Style | Likes | Download |
|-------|-------|-------|----------|
| [V1shu69/flux-RealismLora](https://huggingface.co/V1shu69/flux-RealismLora) | Photorealism | 10 | `git clone https://huggingface.co/V1shu69/flux-RealismLora` |
| [Rabornkraken/flux2-xhs-travel-lora](https://huggingface.co/Rabornkraken/flux2-xhs-travel-lora) | Travel photography | 81 | `git clone https://huggingface.co/Rabornkraken/flux2-xhs-travel-lora` |
| [danildushenev/pneumothorax-lora-flux-2-dev](https://huggingface.co/danildushenev/pneumothorax-lora-flux-2-dev) | Medical imaging | 15 | `git clone https://huggingface.co/danildushenev/pneumothorax-lora-flux-2-dev` |

---

## 🖼️ Image Editing Models (Image-to-Image)

| Model | Task | Likes | Download |
|-------|------|-------|----------|
| [prithivMLmods/QIE-2509-Object-Mover-Bbox](https://huggingface.co/prithivMLmods/QIE-2509-Object-Mover-Bbox) | Object moving via bounding box | 2 | `git clone https://huggingface.co/prithivMLmods/QIE-2509-Object-Mover-Bbox` |
| [prithivMLmods/QIE-2511-Object-Mover-Bbox](https://huggingface.co/prithivMLmods/QIE-2511-Object-Mover-Bbox) | Object moving via bounding box | 1 | `git clone https://huggingface.co/prithivMLmods/QIE-2511-Object-Mover-Bbox` |
| [yxw1231/Qwen-Edit-2509-Multiple-angles](https://huggingface.co/yxw1231/Qwen-Edit-2509-Multiple-angles) | Multi-angle image editing | 19 | `git clone https://huggingface.co/yxw1231/Qwen-Edit-2509-Multiple-angles` |

---

## 🎬 Video Generation Models

| Model | Task | Download |
|-------|------|----------|
| [editedge/LTX-2-19b-LoRA-Camera-Control-Jib-Down](https://huggingface.co/editedge/LTX-2-19b-LoRA-Camera-Control-Jib-Down) | Camera jib down control | `git clone https://huggingface.co/editedge/LTX-2-19b-LoRA-Camera-Control-Jib-Down` |

---

## 🏗️ Framework & Pipeline Models

| Model | Description | Likes | Download |
|-------|-------------|-------|----------|
| [XonarLabs/OLOID_Framework](https://huggingface.co/XonarLabs/OLOID_Framework) | OLOID generation framework | 148 | `git clone https://huggingface.co/XonarLabs/OLOID_Framework` |
| [Kokosha01/Wan2.2_StrangeNames](https://huggingface.co/Kokosha01/Wan2.2_StrangeNames) | Wan 2.2 variant (412 likes!) | 412 | `git clone https://huggingface.co/Kokosha01/Wan2.2_StrangeNames` |

---

## 🏛️ Foundation Models (Base — Download First!)

These are the **base models** that all LoRAs depend on. **Download these first to your 100TB server.**

| Model | Size | Task | Download |
|-------|------|------|----------|
| [black-forest-labs/FLUX.1-dev](https://huggingface.co/black-forest-labs/FLUX.1-dev) | ~23GB | Text-to-Image | `git clone https://huggingface.co/black-forest-labs/FLUX.1-dev` |
| [black-forest-labs/FLUX.1-schnell](https://huggingface.co/black-forest-labs/FLUX.1-schnell) | ~23GB | Text-to-Image | `git clone https://huggingface.co/black-forest-labs/FLUX.1-schnell` |
| [black-forest-labs/FLUX.2-dev](https://huggingface.co/black-forest-labs/FLUX.2-dev) | ~25GB | Image-to-Image | `git clone https://huggingface.co/black-forest-labs/FLUX.2-dev` |
| [stabilityai/stable-diffusion-xl-base-1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) | ~6.9GB | Text-to-Image | `git clone https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0` |
| [stabilityai/stable-diffusion-3.5-large](https://huggingface.co/stabilityai/stable-diffusion-3.5-large) | ~16GB | Text-to-Image | `git clone https://huggingface.co/stabilityai/stable-diffusion-3.5-large` |
| [Wan-AI/Wan2.1-T2I-14B](https://huggingface.co/Wan-AI/Wan2.1-T2I-14B) | ~28GB | Text-to-Image | `git clone https://huggingface.co/Wan-AI/Wan2.1-T2I-14B` |

**Total base models storage: ~120GB** (well within your 100TB capacity)

---

## 📖 Comprehensive Text-to-Image Guide

### 1. Foundational Concepts

#### How Text-to-Image Models Work
Text-to-image models convert text descriptions (prompts) into images using diffusion — they start with random noise and iteratively refine it into a coherent image guided by your text prompt through a neural network called a U-Net or Transformer. The text is encoded by a language model (typically CLIP or T5) that maps words to a shared embedding space the image generator understands.

#### Main Architecture Types

| Architecture | Key Models | Strengths | Weaknesses |
|---|---|---|---|
| **FLUX** | FLUX.1-dev, FLUX.2-dev | Best prompt adherence, highest quality, newest | Large (23GB+), needs 24GB+ VRAM |
| **Stable Diffusion XL** | SDXL 1.0, SDXL Turbo | Huge ecosystem, fastest LoRA availability | Older architecture, less coherent |
| **Stable Diffusion 3.x** | SD3.5-Large, SD3.5-Medium | Good balance of quality and speed | Smaller community than SDXL |
| **Wan** | Wan2.1-T2I-14B, Wan2.2 | Great at characters and scenes | Newer, fewer LoRAs available |
| **DALL·E** | DALL·E 3 (API only) | Excellent safety filters, easy to use | **Closed source — requires API key** |

#### LoRA (Low-Rank Adaptation) Models
LoRAs are **small adapter files** (10-200MB) that modify a base model's behavior without replacing it — think of them as "style plugins" you attach to a foundation model. You ALWAYS need the base model (FLUX, SDXL, etc.) installed first, then load the LoRA on top. Use a LoRA when you want a specific style, character, or aesthetic; use a full model when you need a completely different architecture.

#### Practical Size Comparison

| Type | Typical Size | Storage (100 models) | VRAM Needed |
|---|---|---|---|
| **Foundation Model** | 6-25 GB | 600GB - 2.5TB | 8-24 GB |
| **LoRA Adapter** | 10-200 MB | 1-20 GB | Same as base |
| **GGUF Quantized** | 2-8 GB | 200-800 GB | 4-16 GB |

### 2. Use Case Matching

#### a) Artistic Style Transfer
- **Best:** LoRA models on FLUX base
- **Models:** `andrbykov/vangogh_style_LoRA`, `pils0n/claudemonet_style_LoRA`, `Alia31566/Vinogradov_LoRA`
- **Trade-off:** Each LoRA only does one style; combine multiple for mixed styles

#### b) Consistent Character Generation
- **Best:** Character-specific FLUX LoRAs
- **Models:** `Natasamk/lumi-character-lora`, `alphaduriendur/avatar-weights-01`, `Alex2422/Amaya_new`
- **Trade-off:** Must train custom LoRA for YOUR specific character (~20 reference images needed)

#### c) Photorealistic Image Generation
- **Best:** FLUX.1-dev base + realism LoRAs
- **Models:** `V1shu69/flux-RealismLora`, `Rabornkraken/flux2-xhs-travel-lora`
- **Trade-off:** Highest VRAM requirements; slower generation

#### d) Concept Art & Illustration
- **Best:** FLUX/SDXL + style LoRAs
- **Models:** `artshooter/flux-hand-drawn-stickman`, `Zhmak/fairey_posters_style_LoRA`, `Chunte/huggy-style-v1-lora`
- **Trade-off:** May need prompt engineering for consistency

#### e) Product Visualization
- **Best:** FLUX.2-dev (image-to-image) + custom LoRA
- **Models:** `XonarLabs/OLOID_Framework`, `prithivMLmods/QIE-2509-Object-Mover-Bbox`
- **Trade-off:** May need training on your specific products

### 3. Current Trends & Ecosystem

#### Most Active Categories (2025)
- **FLUX LoRAs** — Dominating new uploads (80%+ of recent models use FLUX as base)
- **Character LoRAs** — Highest growth category
- **Style Transfer** — Consistently popular, especially classical art styles
- **Image Editing** — Emerging fast with Qwen-Edit models

#### Foundation Model Popularity
1. **FLUX.1-dev / FLUX.2-dev** — Current king, best quality
2. **Stable Diffusion XL** — Largest ecosystem, most LoRAs
3. **Wan 2.1/2.2** — Rising fast, especially for video

#### Community Trust Signals
- **412 likes:** `Kokosha01/Wan2.2_StrangeNames` — Very high trust
- **148 likes:** `XonarLabs/OLOID_Framework` — Framework-level trust
- **81 likes:** `Rabornkraken/flux2-xhs-travel-lora` — Strong community
- **50+ likes:** Production-ready models
- **10-50 likes:** Well-tested community models
- **< 10 likes:** Experimental, use with caution

### 4. Model Evaluation Framework

#### Technical Specs Checklist

| Metric | Small | Medium | Large | Notes |
|---|---|---|---|---|
| Model Size | < 100MB | 100MB-5GB | 5GB+ | LoRAs are always "small" |
| VRAM Required | 4-8 GB | 8-16 GB | 16-24 GB+ | Base model determines this |
| Inference Speed | < 5s | 5-15s | 15-60s | Per image at 1024x1024 |
| Output Resolution | 512x512 | 1024x1024 | 2048x2048 | FLUX supports up to 2048 |

#### Quality Checklist
- ✅ Output resolution ≥ 1024x1024
- ✅ Good prompt adherence (test with complex prompts)
- ✅ No recurring artifacts (hands, faces, text)
- ✅ Style consistency across generations
- ✅ Works with different seeds

#### ⚠️ Warning Signs
- **No sample images** in the model card → likely untested
- **No license specified** → legal risk for commercial use
- **Last updated > 6 months ago** → potentially abandoned
- **0 downloads, 0 likes** → completely untested
- **Very small file size for a "full model"** → might be corrupted or incomplete
- **Requires login/API key** → NOT what we want for offline use

---

## 🛠️ Supported Runtimes (All Offline — No API Keys)

| Runtime | Description | Install |
|---------|-------------|---------|
| **ComfyUI** | Node-based workflow GUI | `git clone https://github.com/comfyanonymous/ComfyUI` |
| **Automatic1111** | Classic Stable Diffusion GUI | `git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui` |
| **Forge** | Optimized SD WebUI fork | `git clone https://github.com/lllyasviel/stable-diffusion-webui-forge` |
| **Diffusers** | Python library (HuggingFace) | `pip install diffusers` |
| **Draw Things** | macOS/iOS app | App Store |
| **InvokeAI** | Professional creative GUI | `pip install invokeai` |

---

## 🔗 Links

- [HuggingFace Text-to-Image Models](https://huggingface.co/models?pipeline_tag=text-to-image)
- [HuggingFace Image-to-Image Models](https://huggingface.co/models?pipeline_tag=image-to-image)
- [FLUX.1-dev Documentation](https://huggingface.co/black-forest-labs/FLUX.1-dev)
- [Stable Diffusion XL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)
- [Diffusers Documentation](https://huggingface.co/docs/diffusers)
- [ComfyUI Guide](https://github.com/comfyanonymous/ComfyUI)
- [LoRA Training Guide](https://huggingface.co/docs/diffusers/training/lora)

---

*Catalog maintained by Life Imitates Art Inc. for the Ms Money Penny Desktop Store App.*
*Total models cataloged in this page: 60+ | HuggingFace total: 50,000+*