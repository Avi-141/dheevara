# Open-weight image generation, character/style consistency and visual QC for Dheevara (as of Oct 2026)

Scope: keyframe models, consistency tooling, upscaling, automated QC, provenance/watermarking, and rights-clean style references for a self-hosted 9:16 "temple stone relief lit by an oil lamp" pipeline.

Method note: I ran about 15 search and fetch calls. Licences marked **[verified]** were checked against a primary model card or repo during this session. Items marked **[unverified, prior knowledge]** come from my training data, which runs to mid-2026, and were NOT re-checked. The report writer should treat these as leads only and confirm each one at the URL given before relying on it.

## 1. Open image models: licences, size, fit for stylised keyframes

### Takeaway
Self-hosting is fully commercial-safe on the Apache-2.0 models: **Qwen-Image (2512) / Qwen-Image-Edit (2509/2511)**, **FLUX.2 [klein] 4B**, **Z-Image (Turbo/Base)** and **Chroma1-HD**. The main BFL "dev" weights (**FLUX.1 [dev], FLUX.1 Kontext [dev], FLUX.2 [dev], FLUX.2 [klein] 9B**) are under the **FLUX Non-Commercial Licence**. Running them in production needs a paid BFL self-hosted commercial licence. **HunyuanImage 3.0** has territory and MAU restrictions. **SD3.5** terminates above USD 1M annual revenue.

### Cited Findings
**FLUX family (Black Forest Labs)**
- FLUX.2 [dev] is a 32B rectified-flow transformer. It does text-to-image, single-reference editing and multi-reference editing, with "character, object, and style reference without additional training". It is aimed at RTX 4090/5090-class cards via 4-bit quantisation plus a remote text encoder. — [HF model card](https://huggingface.co/black-forest-labs/FLUX.2-dev)
- **NON-COMMERCIAL:** FLUX.2 [dev] "falls under the FLUX Non-Commercial License". The card says outputs "can be used for personal, scientific, and commercial purposes", and it points commercial open-weight users to "Self-Hosted Commercial License Terms". **[verified]** — [HF model card](https://huggingface.co/black-forest-labs/FLUX.2-dev)
- FLUX.2 [klein] 4B is a 4B rectified-flow transformer under **Apache 2.0** ("available for commercial use"). It needs about 13 GB VRAM, runs on RTX 3090/4070 and above, takes 4 steps at guidance 1.0 for sub-second generation, and supports multi-reference editing. **[verified]** — [HF model card](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)
- Secondary sources say FLUX.2 [klein] 9B (and Base 9B) is under the FLUX Non-Commercial Licence, while the 4B and Base 4B are Apache 2.0. — [PromptZone](https://www.promptzone.com/eamon_nguyen/flux-2-klein-a-new-powerhouse-in-ai-image-generation-49gn); [all-ai.de](https://www.all-ai.de/news/news26top/flux2-klein-release); [invideo, Aug 2026](https://invideo.io/blog/flux-ai-image-generator/)
- FLUX.1 [dev] and FLUX.1 Kontext [dev] are under the FLUX.1 [dev] Non-Commercial Licence. FLUX.1 [schnell] is Apache 2.0. **[unverified, prior knowledge]**. Confirm at https://huggingface.co/black-forest-labs/FLUX.1-dev/blob/main/LICENSE.md and https://huggingface.co/black-forest-labs/FLUX.1-schnell

**Qwen-Image family (Alibaba Qwen)**
- Qwen-Image-Edit-2509 is a 20B BF16 model under **Apache 2.0**. It supports multi-image editing (person+person, person+product, person+scene; 1 to 3 inputs works best). It has native ControlNet-style conditioning (depth, edge maps, keypoint/pose, sketch) and better identity and text consistency. Its tags list English and Chinese text. **[verified]** — [HF model card](https://huggingface.co/Qwen/Qwen-Image-Edit-2509)
- Qwen-Image-Edit-2511 was released 23 Dec 2025 with "notably better consistency". That includes stronger multi-person consistency, and some popular community LoRAs are built into the base model. — [Qwen blog](https://qwen.ai/blog?id=qwen-image-edit-2511); [HF card](https://huggingface.co/Qwen/Qwen-Image-Edit-2511)
- Qwen-Image-2512 was released 31 Dec 2025, with better realism, detail and text rendering. — [RunDiffusion](https://www.rundiffusion.com/qwen-image-2512-edit-2511-layers); [GitHub QwenLM/Qwen-Image](https://github.com/QwenLM/Qwen-Image)

**Z-Image (Alibaba Tongyi-MAI)**
- Z-Image-Turbo is a 6B model, 8-step distilled, that fits in 16 GB VRAM and is under **Apache 2.0**. Release was 26 Nov 2025. The undistilled Z-Image base (Apache 2.0) followed on 27 Jan 2026. (Secondary sources; the repo is Tongyi-MAI/Z-Image-Turbo.) — [comfyui-wiki](https://comfyui-wiki.com/ja/models/z-image/z-image-turbo); [SiliconFlow](https://www.siliconflow.com/models/z-image-turbo); [invideo](https://invideo.io/blog/z-image-ai-image-generator/)

**Others**
- Chroma1-HD (lodestones) is 8.9B, built on the FLUX.1-schnell architecture, and under **Apache 2.0**. It is positioned as a finetuning base. — [comfyui-wiki](https://comfyui-wiki.com/en/models/chroma)
- **HunyuanImage 3.0**: the Tencent Hunyuan Community Licence defines the territory as worldwide *excluding the EU, UK and South Korea*. Products above 100M MAU need a separate licence. It also bars using outputs to improve non-Hunyuan models. (Secondary sources; I did not open the official LICENSE.) — [comfyui-wiki news](https://comfyui-wiki.com/news/2025-09-27-tencent-open-source-hunyuan-image-3-0); [canirun.ai licence summary](https://canirun.ai/license/tencent-hunyuan-community/)
- Tencent's LLM Hy3 reportedly moved to Apache 2.0 in July 2026. I found no evidence that HunyuanImage 3.0's licence changed. — [KuCoin news](https://www.kucoin.com/news/flash/tencent-huanyuan-3-0-open-sourced-under-apache-2-0-license-halves-hallucination-rate)
- **Stability AI Community Licence** (covers SD3.5 and others on the Core Models page): commercial use needs registration. The licence **terminates once you or your affiliates exceed USD 1,000,000 annual revenue**. After that, Stability may grant an enterprise licence "in its sole discretion", or you must delete the models and their derivatives. You own the outputs. **[verified]** — [Stability Community Licence](https://stability.ai/community-license-agreement)
- SDXL 1.0 is under CreativeML OpenRAIL++-M, which is commercial with use restrictions. HiDream-I1/E1 are MIT. Lumina-Image 2.0 is Apache 2.0. OmniGen2 is Apache 2.0. BAGEL is Apache 2.0. Kolors weights carry a Kwai licence that needs a registration form for commercial use. **[unverified, prior knowledge]**. Check the LICENSE files on the respective HF repos (stabilityai/stable-diffusion-xl-base-1.0, HiDream-ai/HiDream-I1-Full, Alpha-VLLM/Lumina-Image-2.0, OmniGen2/OmniGen2, ByteDance-Seed/BAGEL-7B-MoT, Kwai-Kolors/Kolors).

### Inferences
- For a startup that wants a clean licence plus reference-based consistency, **Qwen-Image-2512 (text-to-image) plus Qwen-Image-Edit-2511 (reference editing and pose/depth control)** is the strongest all-Apache pair. Both are 20B, so plan on a 24 GB GPU with FP8/GGUF quantisation, or a 48–80 GB GPU at BF16.
- **FLUX.2 [klein] 4B** is a good fast, cheap, Apache-licensed alternative for drafts and multi-reference edits. **Z-Image-Turbo** is a fast Apache text-to-image option that is also LoRA-friendly.
- Avoid FLUX.1/FLUX.2 [dev], Kontext [dev] and klein 9B in the production pipeline unless you buy BFL's self-hosted commercial licence. The card's claim that outputs are commercially usable does not cover running the weights in a commercial service. Since Dheevara is open source, also note that downstream self-hosters would inherit the restriction.
- HunyuanImage 3.0 is a poor fit if Dheevara ever wants EU or UK distribution or contributors.
- Indic-script text rendering: none of the cards I checked claim Devanagari or other Indic script support. Qwen lists only English and Chinese. The keyframe style (carved stone, no text) should avoid in-image text; add titles and captions in post with real fonts.

### Gaps
- I did not obtain VRAM, speed or quality benchmarks for stylised relief art, and found no head-to-head on "stone relief" aesthetics.
- I found no source testing Indic text rendering on any of these models.
- No new open image model released after roughly Q1 2026 was surfaced (e.g. a Qwen-Image 2.x or a HunyuanImage 3.x update). A targeted check for Jul–Oct 2026 releases is advisable.
- Exact terms and price of BFL's self-hosted commercial licence were not retrieved.

## 2. Consistency tooling (LoRA, adapters, reference editing, ControlNet)

### Takeaway
Because revered figures are never shown with faces, face-ID adapters (InstantID/PuLID) are largely irrelevant, and the InsightFace models they depend on are non-commercial anyway. Consistency should come from (a) a **style LoRA** for the relief look, (b) **per-character LoRAs or reference sheets** that identify characters by silhouette, costume and attributes (Hanuman's mace, Arjuna's Gandiva, Drona's brahmin attire), and (c) **reference-based editing plus pose/depth control** via Qwen-Image-Edit-2511 or FLUX.2 [klein] 4B.

### Cited Findings
- Qwen-Image-Edit-2509 accepts 1 to 3 reference images and natively takes depth, edge and keypoint maps, so composition and pose control come without separate ControlNets. — [HF card](https://huggingface.co/Qwen/Qwen-Image-Edit-2509)
- Edit-2511 improves multi-person consistency and integrates popular community LoRAs into the base. — [HF card](https://huggingface.co/Qwen/Qwen-Image-Edit-2511)
- FLUX.2 [klein] 4B supports multi-reference editing under Apache 2.0. — [HF card](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)
- FLUX.2 [dev] does character, object and style reference "without additional training", but it is non-commercial. — [HF card](https://huggingface.co/black-forest-labs/FLUX.2-dev)
- The InsightFace library code is MIT, but **all pretrained models, including buffalo_l and antelopev2, are "for non-commercial research purposes only"**. Commercial rights are sold separately. InstantID and PuLID depend on these models. — [InsightFace model zoo README](https://github.com/deepinsight/insightface/blob/e68b8b076fb11e9f75c87244d234385f0f318181/model_zoo/README.md); [InsightFace licensing](https://www.insightface.ai/solutions/face-recognition-licensing); [PyPI insightface](https://pypi.org/project/insightface/0.6.2)
- LoRA trainers: ai-toolkit (ostris, MIT), kohya_ss/sd-scripts (Apache 2.0), SimpleTuner (AGPL-3.0, which matters if you modify it and expose it as a network service), diffusion-pipe (tdrussell, MIT). All support FLUX/Qwen-Image/Z-Image-class models to varying degrees. IP-Adapter is Apache 2.0. Regional prompting is available in ComfyUI nodes. **[unverified, prior knowledge]**. Confirm the licences on each GitHub repo.

### Inferences
- Recommended consistency recipe:
  1. Train one **house-style LoRA** on CC0 relief photos (section 5).
  2. Build a **character bible** for each recurring figure: a canonical turnaround sheet of 3/4 and profile views with faces turned away or veiled, plus fixed attributes, all generated once and human-approved.
  3. For each shot, use Qwen-Image-Edit-2511 or klein 4B with the character sheet and a layout/pose/depth map as references.
  4. Optionally train small **per-character LoRAs** on the approved sheets once a character has 15–30 approved images.
- The "no faces of revered figures" rule actually helps consistency: identity is carried by costume, weapon, vahana and posture, which LoRAs and reference editing preserve better than facial likeness.
- Use depth or pose control to enforce back-turned or high-angle compositions and to keep the 9:16 framing consistent across shots.

### Gaps
- I found no published benchmark of multi-shot character consistency for stylised (non-photoreal) characters across Qwen-Edit-2511, klein and OmniGen2.
- Trainer licences and Qwen-Image/Z-Image LoRA support status were not re-verified this session.

## 3. Upscaling and restoration

### Takeaway
**SeedVR2 (Apache 2.0)** is the safe high-quality choice for both images and video. **SUPIR is non-commercial**, so avoid it. Real-ESRGAN (BSD-3) is a fast, permissive fallback. Many community ESRGAN checkpoints such as 4x-UltraSharp carry NC licences, so check each one.

### Cited Findings
- SeedVR and SeedVR2 (3B and 7B, ICLR 2026) are under **Apache 2.0**. The ComfyUI wrapper (numz) is MIT. **[verified]** — [HF SeedVR2-7B](https://huggingface.co/ByteDance-Seed/SeedVR2-7B); [GitHub ByteDance-Seed/SeedVR](https://github.com/ByteDance-Seed/SeedVR); [numz/SeedVR2_comfyUI](https://huggingface.co/numz/SeedVR2_comfyUI)
- SUPIR's repo restricts the software to non-commercial purposes; commercial use needs written permission from the authors. (Reported second-hand.) — [seedvr2.net comparison](https://seedvr2.net/supir-vs-seedvr2)
- Real-ESRGAN is BSD-3-Clause. 4x-UltraSharp is reported as CC BY-NC-SA 4.0. **[unverified, prior knowledge]**. Check https://github.com/xinntao/Real-ESRGAN and the OpenModelDB entry.

### Inferences
- Generate keyframes at native 9:16 (e.g. 768x1344 or 1080x1920 where the model supports it). Upscale and restore with SeedVR2 after image-to-video, which also gives temporal consistency.

### Gaps
- I did not verify SUPIR or 4x-UltraSharp licence text directly.

## 4. Automated QC with open models

### Takeaway
Use a multi-gate QC chain:
1. A **face detector** with commercial-safe weights. Do not use InsightFace models.
2. An **open VLM judge** (Qwen3-VL, Apache 2.0) with a structured checklist covering iconography, anachronism, faces of revered figures and violence level.
3. **Safety classifiers.**
4. **Style-drift scoring** via SigLIP/CLIP embeddings against approved reference frames.
5. **Aesthetic or preference scores**, used for ranking only.

### Cited Findings
- Qwen3-VL (e.g. the 30B-A3B Instruct, around Oct 2025) is listed as Apache-2.0. Qwen3-VL-8B-Instruct is on HF. (Secondary listing; card not opened.) — [Roboflow compare](https://playground.roboflow.com/models/compare/gemma-3-27b-vs-qwen3-vl-30b-a3b-instruct); [DigitalOcean third-party models](https://www.digitalocean.com/legal/third-party-ai-models)
- Licence reports for Gemma 3 conflict between secondary sites. Gemma ships under Google's custom Gemma Terms of Use, not OSI. — [Roboflow](https://playground.roboflow.com/models/compare/gemma-3-4b-vs-qwen3-5-35b-a3b) (conflicting); the custom-terms point is **[unverified]**.
- InsightFace detectors (RetinaFace-10GF inside buffalo_l/antelopev2) are **non-commercial**. OpenCV Zoo **YuNet + SFace** are cited as commercial-safe substitutes. — [InsightFace model zoo](https://github.com/deepinsight/insightface/blob/e68b8b076fb11e9f75c87244d234385f0f318181/model_zoo/README.md); [LocalAI changelog mirror](https://gitea.varghacsongor.hu/GithubMirror/LocalAI/src/commit/bbeacf140dea3044ea1f958b64bb8b7dcd3c694f/docs)
- Prior-knowledge leads, all **[unverified]**: InternVL3/3.5 code is MIT, but the weights inherit the LLM backbone licence (Qwen, Apache). Molmo is Apache 2.0. LLaVA-OneVision inherits Qwen2 terms. YOLO-face variants built on Ultralytics are AGPL-3.0. LAION aesthetic predictor is MIT. HPSv2 is Apache 2.0. ImageReward is Apache 2.0. PickScore is MIT, built on an OpenCLIP backbone. SigLIP/SigLIP2 weights are Apache 2.0. Falconsai NSFW ViT is Apache 2.0. Llama-Guard-style vision safety models carry the Llama licence.

### Inferences
- **Face gate:** stone-relief faces may not trigger photoreal face detectors reliably in either direction. Combine YuNet (or another Apache/MIT detector) with a VLM question such as: "Is the face of [Hanuman/Krishna/Rama] visible or shown in close-up? yes/no plus bounding box". Calibrate on about 200 labelled in-house frames.
- **Iconography gate:** give Qwen3-VL a per-shot JSON spec (characters, weapons, chariot type, dress, forbidden items) and have it return pass/fail per item. Run the same check twice or with two VLMs (e.g. Qwen3-VL plus InternVL) and escalate disagreements to human review.
- **Style drift:** compute the SigLIP cosine similarity to the centroid of the approved style set, and flag anything below a threshold. Also check the colour histogram for near-monochrome warm tones (cheap, deterministic).
- **Aesthetic scores** (HPSv2, PickScore, ImageReward) are trained on photoreal or general preferences. Use them only to rank candidates within a shot, never as a pass/fail gate for this unusual style.
- **Violence:** an NSFW classifier plus a VLM rubric (blood, gore, dismemberment yes/no). Off-the-shelf violence classifiers are weak on stylised art.

### Gaps
- I could not open the primary licence pages for Qwen3-VL, InternVL3.5, Gemma 3 and Molmo this session.
- I found no published evaluation of VLMs on Indian iconography or anachronism detection. Plan an in-house eval set.
- No commercial-safe, maintained violence classifier for illustrated content was identified.

## 5. Provenance / AI labelling, and rights-clean style datasets

### Takeaway
India's IT Rules amendment on synthetically generated information was notified on 10 Feb 2026 and took effect on 20 Feb 2026. It requires a prominent label and persistent provenance metadata. A fully open-licence stack meets this:
- **C2PA manifests** via c2pa-rs/c2patool.
- An **invisible watermark**: TrustMark (MIT, code and models) for images, or Meta Video Seal (MIT) for video.
- A **visible "AI-generated" label** burned into frames or credits.

For style data, use CC0 museum open access (Cleveland, the Met and others) rather than general web scrapes.

### Cited Findings
- MeitY notified the amendments on 10 Feb 2026, effective 20 Feb 2026. They define "synthetically generated information" as audio, visual or audio-visual content "artificially or algorithmically created, generated, modified or altered" so that it appears authentic. Such content must carry a prominent label and permanent provenance metadata that cannot be removed. Takedown windows are now 3 hours for flagged unlawful content. — [Hogan Lovells](https://www.hlc.com/en/publications/india-introduces-mandatory-labelling-for-ai-and-3hour-takedown-for-illegal-content); [iPleaders](https://blog.ipleaders.in/it-rules-2026/); [Business Today](https://www.businesstoday.in/amp/technology/story/govt-tightens-rules-on-ai-generated-content-mandates-labels-and-faster-takedowns-515505-2026-02-10); [Outlook Business](https://www.outlookbusiness.com/news/meity-notifies-it-rules-to-curb-deepfakes-and-ai-generated-content)
- Caveat: the sources are secondary (law-firm notes and news). Check the exact wording against Gazette G.S.R. 120(E), including whether the obligations fall on intermediaries/platforms or on content creators.
- **TrustMark**: "The MIT license covers both the code in this repo and the model files". It carries a 100-bit payload with configurable BCH error correction, and the repo has a `/c2pa` example for declaring the watermark in a C2PA manifest. **[verified]** — [GitHub adobe/trustmark](https://github.com/adobe/trustmark)
- **Meta Video Seal**: "all models, training code, and evaluation tools released under MIT license", for both video and image watermarking. The hosted demo is personal and non-commercial only. **[verified via search snippet]** — [GitHub facebookresearch/videoseal](https://github.com/facebookresearch/videoseal); [demo terms](https://aidemos.meta.com/videoseal/terms/)
- c2pa-rs and c2patool are dual MIT/Apache-2.0. Stable Signature (Meta) is CC BY-NC. **[unverified, prior knowledge]**. Check https://github.com/contentauth/c2pa-rs and https://github.com/facebookresearch/stable_signature.
- **Cleveland Museum of Art** releases about 30,000 public-domain works under CC0, with data on about 60,000 works. Indian examples tagged CC0 include a 13th-century Konarak chlorite head probably from a relief (1966.147) and a Pala-period Bihar schist Buddha (1935.146). — [CMA Open Access](https://www.clevelandart.org/articles/introducing-open-access); [CMA API 1966.147](https://openaccess-api.clevelandart.org/api/collectiononline/metadata/1966.147)
- **The Met** Open Access: public-domain images and data are available "for unrestricted commercial and noncommercial use without permission or fee". Licence status must be checked per object. — [Met collection](https://www.metmuseum.org/art/collection/search/38388)
- The UNC South Asian art guide lists institutions offering free downloads of public-domain South Asian art. — [UNC LibGuide](https://guides.lib.unc.edu/southasianart/images)
- Smithsonian Open Access (CC0), Rijksmuseum (CC0) and Wikimedia Commons (licences vary per file; many CC BY-SA, which requires attribution and may raise share-alike questions for training) are further candidates. ASI photography terms are restrictive or unclear. **[unverified, prior knowledge]**

### Inferences
- Provenance recipe, per frame and per final video:
  1. Embed a TrustMark (images) or Video Seal (video) watermark with a payload ID.
  2. Sign a C2PA manifest with c2pa-rs that declares `trainedAlgorithmicMedia`, lists model and LoRA versions, and records the watermark as a soft binding.
  3. Burn in a visible "AI-generated" label to meet the "prominent label" requirement.
  4. Keep a ledger mapping payload IDs to generation logs.
  Platforms often strip C2PA metadata on upload, so the watermark is what makes provenance persistent.
- For the style LoRA, filter CMA, Met and Smithsonian APIs for CC0 South Asian stone reliefs from Konark, Khajuraho, Hoysala and Pallava sites, about 200 to 500 images. Keep a manifest of object IDs and licence fields for audit. Avoid Wikimedia CC BY-SA and ASI images unless the licence is clear.

### Gaps
- The Gazette text was not read directly. It is unclear whether creator-side obligations (vs. platform obligations) attach to Dheevara as a publisher.
- I did not count actual CC0 South Asian relief objects in the Met, Smithsonian or Rijksmuseum APIs.

---

## Recommended stack (synthesis; all choices commercial-permissive as cited above)
- **Keyframes:** Qwen-Image-2512 (Apache 2.0, 20B) plus a house-style LoRA. Draft and fast tier: FLUX.2 [klein] 4B (Apache 2.0, about 13 GB) or Z-Image-Turbo (Apache 2.0, 6B, 16 GB). **Do not use** FLUX.1/FLUX.2 [dev], Kontext [dev] or klein 9B (non-commercial) without a BFL licence. Avoid SD3.5 (USD 1M revenue termination) and HunyuanImage 3.0 (EU/UK/Korea excluded).
- **Consistency:** a character bible with faceless reference sheets, then Qwen-Image-Edit-2511 multi-reference editing with depth/keypoint control. Add per-character LoRAs (ai-toolkit/diffusion-pipe) once there is enough approved material. Skip InstantID/PuLID: faces are excluded by design and the InsightFace weights are non-commercial.
- **Upscale:** SeedVR2 3B/7B (Apache 2.0). Not SUPIR (non-commercial).
- **QC chain:** a commercial-safe face detector (e.g. YuNet) plus a Qwen3-VL structured iconography, face and violence rubric, double-judged. Then SigLIP style-drift and colour-histogram checks, and HPSv2/PickScore only for ranking. Failures and disagreements go to human review.
- **Provenance:** a TrustMark (images) or Video Seal (video) watermark, a c2pa-rs signed manifest with a soft-binding reference, and a visible AI label, to meet India's SGI rules (in force 20 Feb 2026).
