# Open-weight video generation models and inference tooling for Dheevara (as of 15 Oct 2026)

Scope note: I hit the 15-tool-call research budget. Primary sources I checked in this session: the Wan-AI HF org page, the MiniMax H3 HF card and LICENSE, the LTX-2.5 HF card, the LightWan2.2 HF card, the HunyuanVideo-1.5 GitHub README, the musubi-tuner README, E2E Networks pricing, and the ComfyUI wiki pages for Kandinsky 6.0 and MAGI-2. Anything marked **[prior knowledge, not re-verified]** comes from training data (cutoff June 2026) and must be checked before use. Many search hits were SEO/aggregator sites that contradict each other, especially on Wan 2.5–3.0. I flag these conflicts where they come up.

## 1. Which open-weight video models are state of the art (Oct 2026), with licence, modes, specs, speed, variants

### Takeaway
There are four serious, current open-weight candidates. **Wan 2.2** (Apache-2.0, the most mature ecosystem, with 4-step distills) is the safe default. **MiniMax H3** (Aug 2026, the strongest open model reported; custom licence that excludes the US/EU/UK/Korea but *permits India*; under $20M revenue) is the best fit for quality since Dheevara already uses Hailuo. **LTX-2.5** (Aug 2026; free under $10M revenue; fast 8-step distill with audio) is the other strong option. **Kandinsky 6.0** (MIT, released 6 Oct 2026) is promising but only 9 days old. Wan 2.5/2.6 were never open-weighted, and reports that Wan 2.7 and 3.0 have open weights could not be verified. HunyuanVideo 1.5 is solid but its licence excludes the EU/UK/Korea. MAGI-2 needs 8 Hopper GPUs, which is impractical for a small team.

### Cited Findings

**Wan (Alibaba). Last confirmed open release: Wan 2.2.**
- The Wan-AI Hugging Face org shows only Wan2.2-family repos (T2V-A14B, I2V-A14B, TI2V-5B, S2V-14B, Animate-14B, Animate-2-14B updated Aug 2026), plus Wan-Dancer-14B (Jul 2026). The visible repos include no Wan 2.5/2.6/2.7/3.0 — [HF Wan-AI org](https://huggingface.co/Wan-AI)
- Wan 2.2 shipped 28 Jul 2025 under Apache-2.0. Wan 2.5 (Sep 2025) and 2.6 (Dec 2025) are API-only, and their weights were never published — [howaiworks.ai](https://howaiworks.ai/blog/alibaba-wan-open-weights-stopped-at-2-2); [wan27.org](https://www.wan27.org/blog/wan-2-6-open-source-guide). llm-stats claims Wan 2.6 is Apache-2.0, which conflicts with every other source — [llm-stats](https://llm-stats.com/models/wan-2.6-t2v)
- One ranking site calls Wan 2.7 "Apache 2.0 open weights, native audio, 15 s 1080p, first/last frame" — [videogen.io](https://videogen.io/best-ai-video-models). This conflicts with sources saying open weights stopped at 2.2 — [howaiworks.ai](https://howaiworks.ai/blog/alibaba-wan-open-weights-stopped-at-2-2). Sources also disagree on whether Wan 3.0 is open — [wan27.org Wan 3](https://wan27.org/blog/wan-3-open-source). **Treat Wan 2.7/3.0 open weights as unverified.**
- LightX2V's step+CFG-distilled **LightWan2.2-A14B** is Apache-2.0. On a single RTX 5090 with LightX2V, end-to-end times were: T2V 480p 9.1 s vs 734 s base (40 steps); T2V 720p 22.5 s vs 2668 s; I2V 480p 10.7 s vs 787 s; I2V 720p 26.7 s vs 2685 s. The card lists an NVFP4 variant for Blackwell and a Docker image `lightx2v/lightx2v:26052801-cu130-5090`. It does not state frame counts — [HF lightx2v/LightWan2.2-A14B](https://huggingface.co/lightx2v/LightWan2.2-A14B)
- 4-step 720p I2V high-/low-noise distills were released 2026-04-12 — [HF Wan2.2-distilled-models mirror](https://huggingface.co/stevenlearns/Wan2.2-distilled-models). LightX2V's docs claim it runs about 2x faster than ComfyUI — same source.
- [prior knowledge, not re-verified] Wan 2.2 A14B is a two-expert MoE (high-noise and low-noise 14B experts) that generates 480p/720p at 16 fps with about 81 frames (~5 s). TI2V-5B does 720p at 24 fps and fits on a 24 GB card. Wan supports first/last-frame (FLF2V) workflows in ComfyUI and many community camera/motion LoRAs. Arbitrary aspect ratios, including 9:16 (e.g. 480×832, 720×1280), work by setting width/height.

**MiniMax H3 (Hailuo 3.0). Open weights released 3 Aug 2026.**
- 33B dense "Omni-Transformer". About 13B of those parameters are AdaLN branches that can be skipped for inference-only deployment. Modes: T2AV and first/last-frame-to-audio-video (H3-Base-FL2VA), and reference-to-AV (H3-Base-Ref2VA, which takes up to 9 images, 3 videos and 3 audio clips). Duration 4–15 s, 24 fps, short side 768 px by default. Aspect ratios include **9:16**. Audio is 32 kHz stereo. The released weights are CFG-distilled. Frameworks: SGLang, vLLM, diffusers, ComfyUI. The SGLang example uses 4 GPUs (`--ulysses-degree 4`). The card states no VRAM or timing figures — [HF MiniMaxAI/MiniMax-H3](https://huggingface.co/MiniMaxAI/MiniMax-H3)
- The H3-Regenerate-2K upscaler is not open-sourced, and H3-Context-IR is hosted only — [atoms.dev](https://atoms.dev/blog/minimax-h3-open-weights-multimodal-video-model)
- **Licence (MiniMax H3 Community License, read from the LICENSE file):** "Applicable Territory" is worldwide minus "the European Union, the United Kingdom, the Republic of Korea and the United States of America". **India is permitted.** Annual revenue above US$20M needs prior written authorisation from MiniMax (§IV.1). An AUP is incorporated (no military use, no high-risk automated decisions). §V.3 bars using outputs to improve any *other* AI model. §VI.4 says MiniMax claims no rights over outputs. Commercial products must prominently display "MiniMax H3" in the UI (§IV.2), and redistributions need a NOTICE file — [MiniMax-H3 LICENSE](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE)
- Described as the strongest open-weight video model on the leaderboards — [videogen.io](https://videogen.io/best-ai-video-models) (aggregator; I did not check the Artificial Analysis arena directly).
- musubi-tuner added experimental MiniMax-H3 LoRA training on 16 Sep 2026 — [musubi-tuner](https://github.com/kohya-ss/musubi-tuner)

**LTX-2.5 (Lightricks). Released 11 Aug 2026; supersedes LTX-2.3 (Mar 2026).**
- 22B model that generates audio and video together in one pass — [videogen.io](https://videogen.io/best-ai-video-models)
- HF tags list T2V, I2V, V2V, audio-to-video, T2A and V2A. Image conditioning can be repeated at any frame index (`--image PATH FRAME_IDX STRENGTH`), which allows keyframes. Native multishot is listed. Examples run at 1920×1088 and at 4K via `--spatial-upscalings 2`. Dimensions must be multiples of 32 and frame counts must satisfy `frames % 8 == 1`. The **distilled DiT uses 8 fixed steps with CFG=1**. Quantisation options: ComfyUI int8, NVFP4 (Blackwell), and fp8-cast with CPU offload. The LTX-2 Trainer handles LoRA and IC-LoRA training, and most LTX-2.3 LoRAs work unchanged. The card does not mention vertical output or VRAM figures — [HF Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)
- **Licence: LTX-2.x Community License.** Commercial use is free under US$10M annual revenue, counted across all affiliates. Above that, a paid Commercial Use Agreement is required, and transferring fine-tunes may require a paid licence — [HF LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5); [Lightricks licence PDF](https://static.lightricks.com/legal/ltx-2-open-weights-license-0.X.pdf). Secondary sources report a clause barring use to build offerings that substitute for Lightricks' own products, and a 2x-fee penalty for breach — [wavespeed.ai](https://wavespeed.ai/blog/pt/posts/blog-ltx-2-license-commercial-use/), [towardsai](https://pub.towardsai.net/three-open-video-models-dropped-i-could-only-download-one-3e0660277964)

**Kandinsky 6.0 (Kandinsky Lab). Open weights released 6 Oct 2026; MIT.**
- Pro (29B) and Lite (3B) lines, each with base, 10-step distilled (PiFlow) and pretrained checkpoints. Modes: text-to-audio-video and image-to-audio-video. Output is 5 s clips at 24 fps with 44 kHz audio and lip-sync. A separate VSR model (x2/x2.25/x4, 4 steps per tile; distilled version 2 steps) upscales to Full HD. ComfyUI nodes `kandinsky6` / `kandinsky6-sr` are available. Licence: MIT. The source does not state aspect ratios, VRAM or speed — [ComfyUI wiki K6](https://comfyui-wiki.com/en/models/kandinsky/kandinsky-6-0)
- Available on day one in Diffusers, ComfyUI, vLLM-Omni, SGLang and FastVideo — [comfyui-wiki news](https://comfyui-wiki.com/zh/news/2026-10-06-kandinsky-6-0); [mindstudio](https://www.mindstudio.ai/blog/kandinsky-6-open-source-video-model/)
- Kandinsky 5 is supported for LoRA training in musubi-tuner — [musubi-tuner](https://github.com/kohya-ss/musubi-tuner)

**HunyuanVideo 1.5 (Tencent). Released 20 Nov 2025.**
- 8.3B DiT. Modes: T2V and I2V. Generates at 480p/720p, with an SR stage to 1080p. Default length is 121 frames. Aspect ratio is set with `--aspect_ratio` (default 16:9; the README does not list 9:16). Minimum VRAM is 14 GB with offload. With step distillation a 4090 produces a video "within 75 seconds". There is a 480p I2V step-distilled model (8–12 steps recommended, 4 possible) and CFG-distilled 480/720 models. Also supported: FP8 GEMM, DeepCache/TeaCache/TaylorCache, Diffusers `HunyuanVideo15Pipeline`, ComfyUI, LightX2V, and an official LoRA training script (Dec 2025) — [GitHub HunyuanVideo-1.5](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)
- **Licence: Tencent Hunyuan Community License.** Territory is worldwide minus the EU, UK and South Korea (dated 21 Nov 2025). India is OK — [mirror of LICENSE](https://gitserver.onethingai.com/ai-models/HunyuanVideo-1.5/commit/b4a1193832a4730c6a393a2a9a80541b63680df0); [HF commit history](https://huggingface.co/tencent/HunyuanVideo/commit/a4ed25a99d7eb9cf21e12f5fd8052d266f2105fc). A secondary source reports a 100M MAU threshold and a ban on using outputs to train rival models; I did not verify these — [nemovideo](https://www.nemovideo.com/blog/hunyuan-image-to-video-creator-workflow)

**MAGI-2 Preview (Sand.ai). Released 5 Aug 2026.**
- 114B MoE with about 6B parameters active. Generates 10 s video with audio from text or text+image. Checkpoints total about 307 GB, and the official pipeline needs **8 Hopper GPUs**. SGLang support had not merged as of mid-Aug — [ComfyUI wiki](https://comfyui-wiki.com/en/news/2026-08-05-magi-2-preview); [orcarouter](https://www.orcarouter.ai/blog/magi-2-preview-sglang-serving-leak). Licence reported as Apache-2.0 but not verified against the LICENSE file — [anotherwrapper](https://anotherwrapper.com/tools/llm-pricing/video-models/magi-2-preview)

**Older or superseded models (not re-verified this session):** Mochi 1 (Apache-2.0) — [thundercompute](https://www.thundercompute.com/blog/best-open-source-ai-video-generation-models). [prior knowledge] CogVideoX (2024), Open-Sora 2.0 (Mar 2025), Step-Video-T2V (Feb 2025), SkyReels V2 (Apr 2025, Wan-based infinite-length), MAGI-1 (Apr 2025), LTX-Video 0.9.x, HunyuanVideo v1 (Dec 2024) and Kandinsky 5 (late 2025) are all now superseded by the models above for quality. They are listed only so the comparison is complete.

### Inferences
- **The licences rank roughly as follows for Dheevara** (an India-based startup with revenue far below $10M): Wan 2.2 / Kandinsky 6 (Apache/MIT, unrestricted) > MiniMax H3 (OK in India and under $20M, but requires "MiniMax H3" branding in the product UI and bars using outputs to train other models, so H3 clips can't be used to train a Wan style-LoRA) ≈ LTX-2.5 (under $10M; the non-compete clause is irrelevant to a content studio) > HunyuanVideo 1.5 (fine in India, but **the excluded territories would bite if Dheevara serves EU/UK viewers**; check whether the restriction on "displaying outputs" in those territories applies to distribution, which needs legal review).
- **Territory clauses carry a hidden risk.** H3 and Hunyuan both prohibit use of outputs *outside* the territory. If the chapters are published on YouTube/Instagram to US/EU/UK audiences, the H3 and Hunyuan clauses could be read to restrict that. Get a lawyer to read §V.4 of H3 before relying on it for finals. Wan 2.2, Kandinsky 6 and LTX-2.5 have no such clause.
- No model is published as non-commercial-only among the current leaders. Still, **H3 and Hunyuan are not "open source" in the OSI sense**, and LTX turns paid above $10M.

### Gaps
- I verified no H100/A100/L40S/4090 seconds-per-clip for H3, LTX-2.5 or Kandinsky 6. The Wan 2.2 figures are on an RTX 5090, and the Hunyuan 1.5 figure ("within 75 s") is on a 4090.
- I could not reliably determine whether Wan 2.7/3.0 open weights exist. Check https://github.com/Wan-Video and the HF Wan-AI org's full list of 27 repos (only 10 were visible).
- VRAM needs for H3 (33B, likely 80 GB-class or multi-GPU) and LTX-2.5 22B are not stated on their cards.
- I did not check the Artificial Analysis video arena or VBench leaderboards directly.

## 2. Vertical 9:16, image-to-video from a keyframe, controllable camera

### Takeaway
All four leading candidates do image-to-video. **H3 lists 9:16 explicitly and does first+last-frame.** Wan 2.2 and LTX-2.5 accept arbitrary width/height, though their cards don't name 9:16. LTX-2.5 allows multiple image keyframes at arbitrary frame indices. Camera control is mostly via prompt plus LoRAs (Wan has the richest LoRA ecosystem).

### Cited Findings
- H3: aspect ratios include 9:16, with first/last-frame and reference modes — [HF MiniMax-H3](https://huggingface.co/MiniMaxAI/MiniMax-H3)
- LTX-2.5: repeatable `--image PATH FRAME_IDX STRENGTH` conditioning, dimensions as any multiple of 32, and IC-LoRA support (control LoRAs) — [HF LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)
- HunyuanVideo 1.5: I2V, with aspect ratio set by a flag (the README does not list 9:16) — [GitHub](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)
- Kandinsky 6: image-to-audio-video. No aspect-ratio information found — [ComfyUI wiki](https://comfyui-wiki.com/en/models/kandinsky/kandinsky-6-0)
- LightWan2.2 has I2V 480p/720p distills — [HF](https://huggingface.co/lightx2v/LightWan2.2-A14B)

### Inferences
- Dheevara's style ("temple stone relief, single oil lamp") is best held by a **keyframe-first pipeline**: generate or approve a still with an image model plus a house-style LoRA, then animate it with I2V at low motion strength. This also controls the "no deity faces / medium-wide only" rule at the still stage, where it is cheap to check.
- Slow camera moves (push-in, pan, crane) are the easiest motions for every model to produce. Prompting usually suffices, and first/last-frame (H3 FL2VA, Wan FLF2V, LTX keyframes) gives deterministic framing. One option is a last frame made by cropping or zooming the first frame in an image editor, which produces a guaranteed slow push-in.

### Gaps
- 9:16 quality wasn't verified for Wan 2.2, LTX-2.5 or Kandinsky 6. All were mostly trained landscape-first, so run a 9:16 test batch.
- Official camera-control LoRAs for LTX-2.5 and H3 are not documented on their cards.

## 3. Inference stacks

### Takeaway
Use **ComfyUI** (API mode, workflow JSON) as the orchestration layer, since every candidate has ComfyUI nodes. Use **LightX2V** for the fastest Wan/Hunyuan inference, and **SGLang / vLLM-Omni / diffusers** for H3 and Kandinsky multi-GPU serving. Wan2GP suits low-VRAM experimentation, not production.

### Cited Findings
- LightX2V is the recommended runtime for LightWan2.2 (Docker image, Apache-2.0) and claims about 2x speed over ComfyUI — [HF LightWan2.2](https://huggingface.co/lightx2v/LightWan2.2-A14B); [distill models page](https://huggingface.co/stevenlearns/Wan2.2-distilled-models)
- H3 runs on SGLang (multi-GPU Ulysses sequence parallel), vLLM, diffusers and ComfyUI — [HF MiniMax-H3](https://huggingface.co/MiniMaxAI/MiniMax-H3)
- Kandinsky 6 runs on Diffusers, ComfyUI, vLLM-Omni, SGLang and FastVideo from day one — [mindstudio](https://www.mindstudio.ai/blog/kandinsky-6-open-source-video-model/)
- HunyuanVideo 1.5 runs on Diffusers, ComfyUI, LightX2V, Wan2GP (claims a 6 GB minimum), TeaCache/DeepCache/TaylorCache and MagCache (1.7x at 20 steps) — [GitHub](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)
- LTX-2.5 runs on its own `ltx-pipelines` (Python ≥3.12, CUDA ≥12.7) and ComfyUI (int8/NVFP4) — [HF LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)
- MAGI-2 is not yet servable in SGLang (PR #35014 unmerged as of 16 Aug) — [orcarouter](https://www.orcarouter.ai/blog/magi-2-preview-sglang-serving-leak)
- [prior knowledge, not re-verified] ComfyUI (GPL-3.0) exposes `/prompt` HTTP/WebSocket APIs that accept API-format workflow JSON. xDiT/xfuser (Apache-2.0) provides USP/Ulysses/ring parallelism for Wan and Hunyuan. FastVideo (Hao AI Lab, Apache-2.0) provides sparse/sliding-tile attention and distillation. DiffSynth-Studio (ModelScope, Apache-2.0) does Wan inference and training.

### Inferences
- **ComfyUI is GPL-3.0.** Running it as a backend service is fine, but don't ship modified ComfyUI to customers without understanding the GPL.
- For a queue-driven 13-shot pipeline, wrap the ComfyUI API (or LightX2V's server) behind a small job queue. Stamp every job with its model version, seed and workflow JSON hash for reproducibility.

### Gaps
- I did not verify current maturity, release versions or licences for xDiT, FastVideo, DiffSynth-Studio, Wan2GP, TeaCache or MagCache this session.

## 4. Fine-tuning a house-style LoRA

### Takeaway
**musubi-tuner** (Apache-2.0, active Sep 2026) covers Wan 2.1/2.2, HunyuanVideo 1.5, Kandinsky 5 and MiniMax-H3 (experimental), and needs at least 24 GB VRAM for video LoRAs. LTX-2.5 uses Lightricks' own LTX-2 Trainer.

### Cited Findings
- musubi-tuner supports HunyuanVideo, Wan2.1/2.2, FramePack, HunyuanVideo 1.5, Kandinsky 5 and MiniMax-H3 (experimental, 16 Sep 2026), with single-frame training variants for Wan and H3. The latest update (27 Sep 2026) moved to diffusers 0.40. Recommended: at least 24 GB VRAM for video training and at least 64 GB RAM, with block-swap and fp8 options for 12 GB cards. Multi-GPU uses Accelerate, which is under-documented. Licence is Apache-2.0, except the Hunyuan directories, which follow Tencent's licence. LTX is not listed — [musubi-tuner](https://github.com/kohya-ss/musubi-tuner)
- LTX-2 Trainer trains LoRA and IC-LoRA — [HF LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)
- HunyuanVideo 1.5 ships an official LoRA script (rank 8 / alpha 16 default, Muon optimiser recommended) — [GitHub](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)
- [prior knowledge, not re-verified] diffusion-pipe (tdrussell) and ostris ai-toolkit also train Wan/LTX/Hunyuan LoRAs. Typical community style LoRAs use about 20–100 short clips or images and train in a few GPU-hours on one 24–80 GB GPU.

### Inferences
- A style LoRA trained **on still images only** (single-frame training) of stone reliefs under lamp light is likely enough, because the motion is supposed to be minimal. Pair it with an image-model style LoRA for keyframes. Train on Wan 2.2 first (Apache-2.0, so no restriction on using outputs as training data). H3's §V.3 forbids using H3 outputs to train *other* models, but LoRA-training H3 itself is fine (Model Derivatives are allowed).

### Gaps
- I found no sourced GPU-hour or cost figures for video LoRA training on these specific models.

## 5. Frame interpolation and upscaling

### Takeaway
Render at 480p and low fps, then upscale with **SeedVR2** (Apache-2.0, native in ComfyUI). Each model's own SR (Hunyuan 1.5's 480→720→1080 distilled SR, Kandinsky 6 VSR, the LTX spatial upscaler) is another option. Use RIFE for fps interpolation.

### Cited Findings
- SeedVR2 3B/7B models are Apache-2.0 and natively supported in ComfyUI — [ComfyUI docs](https://docs.comfy.org/tutorials/utility/seedvr2.md). The 3B needs at least ~18 GB VRAM, and a batch of at least 5 for temporal consistency needs more than 24 GB. The 7B FP8 build has quality issues, so use FP16 — [numz SeedVR2 card](https://huggingface.co/numz/SeedVR2_comfyUI/blob/b77d5dd95dba3f25e3a28064b76e6028a5152368/README.md)
- HunyuanVideo 1.5 SR step-distilled models: 480→720 in 6 steps, 720→1080 in 8 steps — [GitHub](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)
- Kandinsky 6 VSR: x2/x2.25/x4, 2–4 steps per tile, MIT — [ComfyUI wiki](https://comfyui-wiki.com/en/models/kandinsky/kandinsky-6-0)
- LTX-2.5: spatial upscaler plus a detailing IC-LoRA, up to 4K — [HF LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)
- [prior knowledge, not re-verified] RIFE (MIT), FILM (Apache-2.0) and Real-ESRGAN (BSD-3) are mature. Wan 2.2's 16 fps output is commonly RIFE-interpolated to 24/32 fps.

### Inferences
- The look is "near-monochrome stone, flicker". Generative upscalers can invent texture, which is good for stone but may "sharpen" the flicker into noise, so test SeedVR2 on the actual style. RIFE can smear oil-lamp flicker; FILM is gentler on large slow motion.

### Gaps
- No verified timings for SeedVR2 on 9:16 720p→1080p.

## 6. Realistic self-hosted cost per 2-minute chapter vs ~$6 on fal

### Takeaway
With 4-step distilled Wan 2.2, a full chapter (13 shots, about 3 takes each, drafts plus finals plus upscaling) is plausibly **under 1 GPU-hour, i.e. roughly ₹200–400 / US$2.5–5 on an Indian on-demand H100**. That is comparable to or below fal's ~$6 draft. Undistilled 40-step Wan or a 33B H3 at 720p costs 10x or more. The real cost driver is idle GPU time, so use on-demand or serverless and batch the work.

### Cited Findings
- E2E Networks H100: ₹362/hr on-demand (~US$3.77), long-term commitment from ₹155.90/hr, excluding GST. The pricing page headline says "H200, H100, A100, L40S from ₹49/hr" — [E2E H100](https://www.e2enetworks.com/gpus/nvidia-h100.md); [E2E pricing](https://www.e2enetworks.com/pricing.md)
- Domestic Indian H100 on-demand runs about ₹217–362/hr, or about ₹67/hr through the IndiaAI subsidy — [dev.to India GPU pricing](https://dev.to/mr_manushukla/gpu-cloud-pricing-in-india-2026-h100-h200-and-b200-rates-compared-bo7); [techplained](https://www.techplained.com/gpu-cloud-india). ZenoCloud lists E2E at ~₹280, which conflicts with E2E's own figure — [zenocloud](https://zenocloud.io/blog/h100-gpu-price-india/). Sources disagree on whether GST is included.
- Speed basis for the estimate: LightWan2.2 I2V 480p 10.7 s and 720p 26.7 s per clip (RTX 5090), vs 787 s / 2685 s for 40-step base — [HF](https://huggingface.co/lightx2v/LightWan2.2-A14B)

### Inferences (my arithmetic, assumptions stated)
- **Drafts (480p, distilled Wan 2.2):** 13 shots × 3 takes × ~2 clips per 8–10 s shot (Wan clips are about 5 s) ≈ 78 clips × ~11 s ≈ 15 min of GPU time. Add 2x for model loading and overhead and it's about 0.5 GPU-hour, or **~₹110–180 (~$1.3–2) per chapter draft**.
- **Finals (720p distilled + SeedVR2 to 1080p):** 26 clips × ~27 s ≈ 12 min, plus upscaling (unknown, guess 20–40 min) ≈ 1 GPU-hour, or **~₹220–360 (~$2.5–4)**.
- **Undistilled Wan 2.2 at 720p:** 26 × 2685 s ≈ 19 GPU-hours (on a 5090; an H100 is somewhat faster), roughly ₹4,000+. Distillation is essential.
- An RTX 5090 or L40S at ₹50–100/hr would cut this further if available. A dedicated monthly H100 only beats fal if you produce about 30+ chapters per month (my rough break-even, assuming ~₹1.1–2.6 lakh/month).

### Gaps
- No verified RunPod, Lambda or Yotta prices this session. I found no L40S INR price, and no H100 timing for any model.

## 7. Auto-QC tools

### Takeaway
I verified no tools this session. From prior knowledge: VBench / VBench-2.0 (Apache-2.0) measures subject/background consistency, motion smoothness, flicker and aesthetic quality. Standard face detectors (RetinaFace, InsightFace, MediaPipe) can enforce "no faces" per frame. A CLIP/SigLIP or VLM classifier can flag deity iconography (blue skin, crowns, Hanuman's form) in close-up.

### Cited Findings
- None verified in this session.

### Inferences
- Note that VBench's "temporal flickering" metric will penalise the intentional oil-lamp flicker, so calibrate thresholds on approved shots. Face-size gating (face bbox height / frame height > X → reject) directly enforces "no closer than medium-wide". InsightFace's pretrained models have **non-commercial** licences; MediaPipe (Apache-2.0) or YOLO-face variants are safer, but check each licence.

### Gaps
- Licences and current versions of VBench, InsightFace and MediaPipe were not checked. The Artificial Analysis arena was not checked.

## Recommendation (synthesis)

- **(a) Cheap drafts:** **Wan 2.2 I2V A14B + LightX2V 4-step distill (LightWan2.2)** at 480×832 (9:16), driven from approved style keyframes. Run on LightX2V Docker, or on ComfyUI with the lightx2v LoRAs. Apache-2.0 end to end, with no territory or revenue clauses. Train the house-style LoRA with musubi-tuner.
- **(b) Finals:** First choice is **MiniMax H3 FL2VA** at 768-short-side 9:16 with first/last frames (this is the open version of the Hailuo model Dheevara already uses). Serve it via SGLang on 2–4 H100s in India, then SeedVR2 to 1080p. Conditions: (i) a lawyer must confirm the "outputs outside Applicable Territory" clause doesn't block publishing to US/EU/UK audiences; (ii) the product UI must say "MiniMax H3"; (iii) H3 outputs must not be used to train other models. **Fallback / licence-clean finals:** Wan 2.2 720p distilled + SeedVR2, or **LTX-2.5** (8-step distilled with keyframes and native audio; free under $10M revenue).
- **Watch:** Kandinsky 6.0 (MIT, 29B Pro/3B Lite, own VSR). It is the most permissively licensed new model, but it only appeared 6 Oct 2026, so evaluate its 9:16 and stone-relief quality before adopting it. Skip MAGI-2 (8×Hopper) and HunyuanVideo 1.5 (no advantage over Wan 2.2, and an EU/UK/Korea exclusion).
