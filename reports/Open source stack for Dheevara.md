# Open models can ship Dheevara without fal

An open-source-first stack can power every layer of Dheevara today, without a fal.ai key, and most of it is under Apache-2.0 or MIT. The video core is **Wan 2.2 with the LightX2V 4-step distill (Apache-2.0)** for diffusion shots. Next to it sits a **Blender-from-code relief renderer (GPL software, unencumbered output)** whose shot specs live in git as the source of truth. Keyframes come from **Qwen-Image-2512 and Qwen-Image-Edit-2511 (Apache-2.0)**. The audio chain is **IndicF5 for narration (MIT), Vāgdhenu for chant (Apache-2.0) and IndicConformer for the ASR round trip (MIT)**. **Sarvam-30B/105B and Qwen3.8-27B (Apache-2.0)** handle scripts, translation and the shot DSL. **PostgreSQL 18** is the bitemporal canon, **Temporal or Hatchet (MIT)** orchestrates, and compute is rented from **Indian GPU clouds at ₹49–379/hr**. On my arithmetic from the notes, the video for a 114-second chapter, drafts included, comes to roughly 1.5 H100-hours, or **about ₹105 on E2E spot and ₹570 at E2E's on-demand list**. That is in line with or below the repo's own **$5.92 fal draft estimate**, and far below premium hosted routes at ₹1,500–4,300. The licence traps are real and specific. FLUX [dev], the larger Depth Anything weights, InsightFace, SUPIR, XTTS-v2, F5-TTS base and MusicGen are **non-commercial**. Remotion, LTX-2.x, Stability's models and the Hunyuan family are **source-available or capped**. **MiniMax H3's licence excludes the US, EU, UK and Korea**, so it cannot sit in a diaspora-first shipping path until MiniMax says otherwise in writing. On gulab.ai: **not a replacement for fal and not a fit for production**. It is a credit-metered canvas that routes to fal, ByteDance, MiniMax and others, it publishes no retrievable terms, and so it fails the "no training on our texts" rule by default. The biggest unknowns are whether IndicF5 matches Sarvam Bulbul in blind tests, what Blender render time actually costs, how Wan holds up at 9:16, and whether the chant voice may be used commercially.

## Apache-licensed Wan 2.2 renders a chapter for a few hundred rupees

Of the four serious open-weight video models as of October 2026, **Wan 2.2 is the safe default**. It is Apache-2.0 with no territory, revenue or branding clauses, and the Wan-AI organisation shows open weights only up to the 2.2 family (T2V/I2V-A14B, TI2V-5B, S2V, Animate-2) ([HF Wan-AI](https://huggingface.co/Wan-AI)). Wan 2.5 and 2.6 shipped API-only ([howaiworks.ai](https://howaiworks.ai/blog/alibaba-wan-open-weights-stopped-at-2-2)). An aggregator's claim that Wan 2.7 is Apache-licensed open weights ([videogen.io](https://videogen.io/best-ai-video-models)) contradicts this and is unverified. The repo's routing already uses hosted **Wan 3.0 through fal**, and nothing confirms that Wan 3.0 can be self-hosted.

What makes self-hosting cheap is distillation. LightX2V's **LightWan2.2-A14B (Apache-2.0)** cuts a 720p image-to-video clip from **2,685 s to 26.7 s** and a 480p clip from **787 s to 10.7 s** on one RTX 5090 ([HF LightWan2.2](https://huggingface.co/lightx2v/LightWan2.2-A14B)). The video researcher's estimate is 13 shots × 3 takes of 480p drafts in about 0.5 GPU-hour, plus 720p finals and SeedVR2 upscaling in about 1 GPU-hour. At E2E's H100 rate that gives **₹110–180 for drafts and ₹220–360 for finals per chapter**. Undistilled 40-step Wan at 720p would cost about 19 GPU-hours, or ₹4,000+, so **distillation is not optional**.

The other candidates each carry a condition. **LTX-2.5** (Lightricks, 22B) generates audio and video together, takes keyframe images at arbitrary frame indices, runs an 8-step distilled DiT, and has depth and camera IC-LoRAs. Its **LTX-2.x Community License is free only under US$10M annual revenue** ([HF LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5)). Secondary sources also report a clause barring products that substitute for Lightricks' own, plus a 2× fee penalty for breach ([wavespeed.ai](https://wavespeed.ai/blog/pt/posts/blog-ltx-2-license-commercial-use/)). It is usable worldwide, but it is **source-available, not open source**. **Kandinsky 6.0 is MIT** and comes in 29B Pro and 3B Lite versions with its own VSR upscaler. It was released only on 6 Oct 2026 ([ComfyUI wiki](https://comfyui-wiki.com/en/models/kandinsky/kandinsky-6-0)), so it is a model to evaluate, not to adopt yet. **HunyuanVideo 1.5** excludes the EU, UK and South Korea ([GitHub](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)), which rules out the UK diaspora. **MAGI-2** needs 8 Hopper GPUs ([ComfyUI wiki](https://comfyui-wiki.com/en/news/2026-08-05-magi-2-preview)).

### MiniMax H3 is open-weight but not diaspora-safe, and the notes disagree on how unsafe

MiniMax released **H3 open weights on 3 Aug 2026**: a 33B model with first/last-frame and reference-to-audio-video modes, explicit 9:16 support, and 4–15 s clips at 24 fps ([HF MiniMax-H3](https://huggingface.co/MiniMaxAI/MiniMax-H3)). Its Community License defines the Applicable Territory as worldwide **minus the EU, UK, Korea and the United States**. Above US$20M revenue it needs MiniMax's authorisation. It **requires "MiniMax H3" to be displayed in the product UI**, and it bars using outputs to improve other models ([H3 LICENSE](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE)).

The notes conflict on three points:

- **Where H3 can be used.** The video-model notes recommend H3 for finals, provided a lawyer confirms that the clause on using outputs outside the territory does not block publishing to US, EU or UK viewers. The repo is stricter. Decision #20 treats **all H3, hosted through fal included, as India-only under §V.4** until fal or MiniMax answer in writing, and the product plan names diaspora-first as "the reason self-hosted H3 cannot be in the shipping path" (repo: `docs/decisions.md`, `docs/product-plan.md`).
- **Whether H3 is open at all.** The paid-offerings notes list H3 as a closed model and quote fal's H3 Max at $0.05/s and Turbo at $0.025/s with no territory caveat ([fal pricing](https://fal.ai/pricing)).
- **What hosted H3 costs.** The repo registry prices the fal H3 LoRA reference endpoint at $0.0625–0.20/s depending on resolution.

My position is that the repo's reading is the correct engineering default. The beachhead audience is in exactly the excluded territories. Until MiniMax answers in writing, **H3 belongs only in India-only cuts**, and rule 4's `assertTerritory` should keep throwing on worldwide contracts.

### Keyframes and consistency come from Apache image models; avoid every "dev" FLUX checkpoint

Every shot starts from a keyframe, and the strongest all-Apache pair for that is **Qwen-Image-2512 for text-to-image** and **Qwen-Image-Edit-2509/2511 for reference editing**. Edit-2509 is a 20B model that takes 1–3 reference images and native depth, edge and keypoint conditioning ([HF Qwen-Image-Edit-2509](https://huggingface.co/Qwen/Qwen-Image-Edit-2509)); Edit-2511 adds better multi-person consistency ([HF 2511](https://huggingface.co/Qwen/Qwen-Image-Edit-2511)). For fast drafts there are two Apache-2.0 options: **FLUX.2 [klein] 4B**, which needs about 13 GB and runs 4-step multi-reference edits ([HF klein 4B](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)), and **Z-Image-Turbo**, a 6B model ([comfyui-wiki](https://comfyui-wiki.com/ja/models/z-image/z-image-turbo)).

Several popular image models are off-limits:

- **NON-COMMERCIAL:** FLUX.2 [dev] uses the FLUX Non-Commercial License. Its card says outputs are commercially usable, but running the weights in a commercial service needs a paid self-hosting licence from BFL ([HF FLUX.2-dev](https://huggingface.co/black-forest-labs/FLUX.2-dev)). Secondary sources say the same applies to klein 9B, FLUX.1 [dev] and Kontext [dev].
- **SOURCE-AVAILABLE, capped:** SD3.5's Stability Community License **terminates above US$1M revenue** ([Stability](https://stability.ai/community-license-agreement)).
- **TERRITORY-RESTRICTED:** HunyuanImage 3.0 excludes the EU, UK and Korea ([comfyui-wiki](https://comfyui-wiki.com/news/2025-09-27-tencent-open-source-hunyuan-image-3-0)).

The "witness, never the deity" rule makes consistency easier, because identity rides on costume, weapon, vāhana and posture rather than on faces. That makes face-ID adapters unnecessary, and they are unusable anyway: **InsightFace's pretrained models, which InstantID and PuLID depend on, are for non-commercial research only** ([InsightFace model zoo](https://github.com/deepinsight/insightface/blob/e68b8b076fb11e9f75c87244d234385f0f318181/model_zoo/README.md)). The workable recipe has four parts:

1. A house-style LoRA trained with **musubi-tuner (Apache-2.0)**, which supports Wan 2.2, HunyuanVideo 1.5 and Kandinsky 5 ([musubi-tuner](https://github.com/kohya-ss/musubi-tuner)).
2. Training data from CC0 museum open access. Cleveland releases about 30,000 public-domain works, including Konark and Pala-period reliefs ([CMA](https://www.clevelandart.org/articles/introducing-open-access)).
3. Faceless character reference sheets for each recurring figure.
4. Per-shot reference editing with depth or pose maps.

For upscaling, **SeedVR2 is Apache-2.0** ([HF SeedVR2-7B](https://huggingface.co/ByteDance-Seed/SeedVR2-7B)). **SUPIR is non-commercial** and should be avoided.

## Code beats diffusion for "a temple relief lit by one oil lamp"

The style bible describes something that is close to a parametric scene, not a generative prompt (repo: `design/style-bible.md`):

- carved stone in deep shadow
- **one key light at 2,200–2,700 K, raking at 20–40°, flickering ±3% and never pulsing**
- pushes of 5–10% of the frame over a whole shot
- medium-wide as the closest framing on any person
- no deity face ever
- basalt for the Mahābhārata, granite for the Rāmāyaṇa
- a fixed hex palette

All of that maps onto parameters. A relief is a height field on a subdivided plane; the lamp is a point light with a seeded noise curve; the camera move is a spline. The code researcher's conclusion, which I share, is that this look is **close to ideal for a deterministic Blender path**, with diffusion as an optional, cached texture pass rather than the source of truth.

The research literature supports a specific way to build it. Systems that make video or 3D through code all converge on **plan → write code → execute → render → VLM critique → patch**: Code2Video, which writes Manim with a VLM critic and reports a self-reported 40% gain over direct generation ([NeurIPS listing](https://neurips.cc/virtual/2025/131666)); SceneCraft, which writes Blender Python against a scene-graph blueprint ([PMLR](https://proceedings.mlr.press/v235/hu24g.html)); BlenderAlchemy ([arXiv](https://arxiv.org/abs/2404.17672v3)); and LL3M, which uses retrieval over Blender API docs ([arXiv](https://arxiv.org/abs/2508.08228v1)). The dominant failure is **API hallucination**: non-existent functions and invalid parameters were the leading cause of failed renders in TheoremExplainAgent, ahead of LaTeX errors, and layout overlaps persisted even in successful videos ([arXiv 2502.19400](https://arxiv.org/pdf/2502.19400)).

The design implication is that **the LLM should never write raw `bpy`**. It should fill a narrow, schema-validated shot DSL, which a hand-written, tested compiler turns into a Blender scene. Dheevara already has most of that DSL. The repo's **shot-contract schema is strict Ajv JSON**. It already carries `camera.framing`, `camera.move`, `lensMm`, `claims` and a mandatory `forbidden` list containing `deity_face_closeup`, and the compiler is already "deterministic, byte-for-byte" (repo: `schema/shot-contract.schema.json`, `src/compile/`). Extending that contract with relief-asset ids, a light path, a flicker seed and a story-time field makes the code-stored source of truth a natural continuation of M2, not a new system.

### The procedural route wins on the nine rules; diffusion wins on organic motion

The trade-off, judged against the product's own rules:

| Dimension | Procedural (Blender from a shot DSL) | Diffusion (Wan 2.2 / LTX-2.5 image-to-video) |
|---|---|---|
| Reproducibility | Bit-stable with a fixed seed, samples and pinned versions; re-renders 16:9 or 1:1 from the same code | Only practically reproducible; output must be frozen as a hashed asset |
| Rule 1 (no deity face) | Enforced by an object-ID pass: a tagged face region never exceeds N pixels | Needs a face detector plus a VLM judge, calibrated on stone faces |
| Rule 2 (citations) | Per-frame sidecar maps frame ranges to shot and claim ids; OTIO clip metadata | Same sidecar, but the pixels are not traceable to the spec |
| Rule 6 (draft first) | Low-sample proxy renders are cheap, and CI image-diffs catch regressions | 480p distilled drafts at about 11 s per clip |
| Organic motion (bow draw, horse gait, flame, smoke, crowds) | Expensive: needs rigging or 2D deformation | Strong |
| Weathering, soot, texture variety | Needs a material library | Strong |
| Reuse in the JS track and app | The same height maps and camera paths export to glTF and three.js | None |
| Licence exposure | Blender GPL covers the software, not the renders | Model licence per checkpoint |
| Evidence | No public stone-relief procedural pipeline exists, and render cost is unmeasured | Measured timings exist for distilled Wan |

The **hybrid** is where the two meet. Blender renders beauty, depth, normal and object-ID passes deterministically. A depth- or camera-conditioned Apache-2.0 Wan variant then adds micro-detail and organic motion: **Wan2.2-Fun-A14B-Control** (canny, depth, pose, trajectory) or **Control-Camera**, or **VACE** ([VideoX-Fun README](https://raw.githubusercontent.com/aigc-apps/VideoX-Fun/main/README.md); [HF VACE-14B](https://huggingface.co/api/models/Wan-AI/Wan2.1-VACE-14B)). Composition, the face mask and the citations stay governed by code. The diffusion output is stored content-addressed, and the deterministic render remains the audit reference. Nobody has measured how faithfully Wan-Fun preserves a relief's fine height detail rather than inventing new carving, so this needs a test on two or three s1e3 shots. The reveal macros sh10 and sh11 are the obvious candidates, since they are literally "macro on carved detail".

### Renderer and asset licences are clean except for four named traps

Most of the code-video toolchain is OSI-licensed:

- Motion Canvas (MIT), and Revideo (MIT), which ships a headless render API and says its TypeScript scenes are LLM-writable ([Revideo README](https://raw.githubusercontent.com/redotvideo/revideo/main/README.md))
- Manim, three.js and Godot (MIT)
- OpenTimelineIO (Apache-2.0)
- Blender and `bpy` (GPL-3.0)

The traps:

- **SOURCE-AVAILABLE:** **Remotion** requires a paid Company License for any for-profit with more than 3 employees ([Remotion LICENSE](https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md)).
- **AGPL-3.0:** **Theatre.js Studio**. Only `@theatre/core` is Apache ([npm](https://registry.npmjs.org/@theatre/studio/latest)).
- **AGPL-3.0:** **DepthFlow and ShaderFlow** ([PyPI](https://pypi.org/pypi/depthflow/json)).
- **NON-COMMERCIAL weights:** Depth Anything V2-Base/Large and DA3-Large/Giant/Nested are CC-BY-NC-4.0, although DA3MONO-LARGE, DA3METRIC-LARGE and V2-Small are Apache ([HF DA3](https://huggingface.co/api/models/depth-anything/DA3-LARGE)).

The commercially safe routes from image to relief are **MoGe-2 (MIT, with normals)** ([HF](https://huggingface.co/api/models/Ruicheng/moge-2-vitl-normal)), **DA3MONO-LARGE (Apache)** and **Marigold v1.1 (OpenRAIL++)**. For in-the-round props, **TRELLIS.2 and TripoSR are MIT**. Two caveats on the renderer itself. EEVEE's headless EGL path on NVIDIA is unconfirmed for Blender 4.x/5.x, so **Cycles is the safe default** ([Blender EGL commit](https://lists.blender.org/pipermail/bf-blender-cvs/2022-August/176810.html)). And BlenderMCP (MIT) is useful for interactive authoring only, because it has telemetry and calls third-party generators ([README](https://raw.githubusercontent.com/ahujasid/blender-mcp/main/README.md)).

## QC and AI labelling can be deterministic before they are intelligent

The M3 QC gate does not exist yet (repo: `src/qc/` is absent), so its design should put deterministic checks first and VLM judgement last. The order:

1. Schema validation.
2. A low-resolution proxy render.
3. Programmatic checks: the luminance and saturation band, light in frame, the object-ID face mask and the caption safe zone.
4. A **Qwen3-VL (Apache-2.0)** or **Qwen3.8-27B (Apache-2.0, vision-native)** judge that scores the style bible's §10 checklist against each shot's JSON spec ([HF Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B/raw/main/README.md)).
5. Human sign-off.

For diffusion shots, which have no ID pass, two pieces fill the gap. One is a commercially safe face detector: **OpenCV Zoo YuNet** is cited as the substitute for InsightFace's non-commercial RetinaFace ([InsightFace zoo](https://github.com/deepinsight/insightface/blob/e68b8b076fb11e9f75c87244d234385f0f318181/model_zoo/README.md)). The other is a double-judged VLM question about revered faces. Two calibration warnings: photoreal detectors may misfire on carved faces in either direction, and generic aesthetic scorers and VBench's flicker metric will penalise the intended oil-lamp flicker. Calibrate on about 200 in-house frames and use aesthetic scores only to rank takes.

Provenance has a fully open answer to India's synthetic-media rules. Those rules were notified on 10 Feb 2026, have been in force since 20 Feb 2026, and require a prominent label and persistent provenance metadata ([Hogan Lovells](https://www.hlc.com/en/publications/india-introduces-mandatory-labelling-for-ai-and-3hour-takedown-for-illegal-content)). The pieces:

- **TrustMark: MIT for both code and models**, a 100-bit watermark with a C2PA example ([adobe/trustmark](https://github.com/adobe/trustmark))
- **Meta Video Seal: MIT** for the models and training code (the hosted demo alone is non-commercial) ([videoseal](https://github.com/facebookresearch/videoseal))
- a c2pa-rs signed manifest (dual MIT/Apache, not re-verified)
- the burned-in label and spoken disclosure the repo already specifies

Platforms routinely strip C2PA metadata on upload, so the invisible watermark is what makes provenance survive a Reels or WhatsApp re-share.

## Indic voice, chant and ASR are already open; the voices themselves are the constraint

**IndicF5 (AI4Bharat, MIT)** covers 11 languages: Assamese, Bengali, Gujarati, Hindi, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil and Telugu. That is every Bulbul narration language except English. It clones a voice from a reference clip plus its transcript, but it is gated and the card requires "explicit permission" for any cloned voice ([HF IndicF5](https://huggingface.co/ai4bharat/IndicF5)). The only independent evidence is for Hindi: on 50 FLEURS sentences it reached **WER 0.098 and speaker similarity 0.784**, the best of the systems tested ([arXiv 2607.18662](https://arxiv.org/pdf/2607.18662)). No MOS figures exist for the other languages, and there is no head-to-head against Bulbul v3, so parity with Bulbul is **unproven**. English needs a second model: Chatterbox (MIT) or Qwen3-TTS (Apache-2.0) cloning the same narrator ([Yaps roundup](https://www.yaps.ai/blog/best-local-tts-models)). **Indic Parler-TTS (Apache-2.0)** covers 21 languages without cloning and is the fallback ([HF](https://huggingface.co/ai4bharat/indic-parler-tts)).

Several well-known TTS models must be avoided:

- **XTTS-v2 (CPML):** **NON-COMMERCIAL**, and no commercial licence can be bought because Coqui shut down ([Coqui discussion](https://github.com/coqui-ai/TTS/discussions/4304)).
- **F5-TTS base weights (CC-BY-NC):** **NON-COMMERCIAL**.
- **Fish Audio S2:** research licence.
- **IndexTTS-2.5:** bilibili licence.
- **Svara-TTS:** no licence stated at all.

Rule 7, that Sanskrit is chanted and not read, has an almost exact open answer. **Vāgdhenu (IISc)** is a metre-aware śloka-to-chant model, fine-tuned from IndicF5 with a BigVGAN-v2 vocoder ([GitHub](https://github.com/prathoshap/vagdhenu)):

- **Licences:** Apache-2.0 for code and the authors' weights, inheriting IndicF5's MIT and NVIDIA's BigVGAN terms (the BigVGAN text was not read).
- **Production use:** the Śrīmad Bhāgavatam and the Mahābhārata Tātparya Nirṇaya.
- **Evaluation:** a single-listener expert MOS of about 4.6 ([HF card](https://huggingface.co/prathoshap/vagdhenu)).
- **Limits:** no Vedic svaras, and prosody follows the reference clip.

The binding constraint is the voice, not the licence. The model was trained on about 5 hours of **the author's own voice**, and the card says "do not impersonate". The repo already lists "Vāgdhenu permission" as open and has the wrapper written; `chant.mjs` throws until `VAGDHENU_URL` exists. There are two ways forward: get Prof. Prathosh's written consent, or record about 5 hours of a consented reciter and fine-tune with the same recipe. Upstream metre checks are available from `chandas` (MIT) ([GitHub](https://github.com/sanskrit-coders/chandas)) or `vidyut.chandas`. One caution from the edges review stands: the Devī Saptaśatī is mantra and should use a human reciter.

For the ASR round trip, **IndicConformer-600M is MIT** (gated) and covers 22 scheduled languages **including Sanskrit**. It has CTC and RNNT heads and scores Hindi WER 13.2 on Vaani ([HF](https://huggingface.co/ai4bharat/indic-conformer-600m-multilingual)). For chant, CTC forced alignment of the known verse text beats open transcription: IndicWhisper scored **48 WER on Sanskrit** ([arXiv 2305.15386](https://arxiv.org/pdf/2305.15386)). Meta's Omnilingual ASR (Apache-2.0) is a cross-check.

Music needs no model. The style bible asks for a tanpura drone, pakhawaj and silence; a procedural Karplus–Strong tanpura or a self-recorded loop carries no licence risk. **MusicGen weights are CC-BY-NC 4.0 — NON-COMMERCIAL** ([HF](https://huggingface.co/facebook/musicgen-large)). Stable Audio is commercially usable only below US$1M revenue, and sources disagree on whether that means annual revenue or ARR ([Stability](https://stability.ai/explainers/stable-audio-vs-competitors-licensing-export-rights-and-self-hosting-compared)).

### Self-hosted LLMs satisfy rule 5 by construction

Rule 5 bars sending unreleased passages to any API whose terms allow training. The repo already classifies Sarvam's API as "opt-out", meaning it may train, and fal's terms let anonymised or aggregated usage data feed fal's own AI models ([fal terms §6(c)](https://fal.ai/terms)). Self-hosting removes the question. The Indic-strong choice is **Sarvam-30B or Sarvam-105B, both Apache-2.0** since March 2026. The 30B has about 2.4B active parameters, and the 105B about 10B active ([Artificial Analysis](https://artificialanalysis.ai/articles/sarvam-105b-Sarvam-30b-everything-you-need-to-know)). Translation should cross-check **IndicTrans2 (MIT, 22 languages)** ([GitHub](https://github.com/ai4bharat/IndicTrans2)) against **Sarvam-Translate**, which is **GPL-3.0 on a Gemma-3 base**, so Gemma's custom terms are inherited ([HF](https://huggingface.co/sarvamai/sarvam-translate)). For the shot DSL and code, a 24–30B model with schema-constrained decoding is enough: Qwen3.8-27B, Qwen3-Coder-30B-A3B or Devstral-Small-2, all Apache-2.0. GLM-5.2 (MIT) or DeepSeek-V4-Flash (MIT) cover harder planning ([HF GLM-5.2](https://huggingface.co/api/models/zai-org/GLM-5.2); [HF V4-Flash](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V4-Flash)).

The newest flagships have drifted to **custom licences**: Qwen3.8-Flash-Next and 2.4T, GLM-5.3 and Kimi-K3 ([HF GLM-5.3](https://huggingface.co/api/models/zai-org/GLM-5.3)). Kimi K2.x's "modified MIT" adds an attribution duty above 100M MAU or US$20M monthly revenue ([K2.6 LICENSE](https://huggingface.co/moonshotai/Kimi-K2.6/raw/main/LICENSE)). The older Sarvam-2B is non-commercial.

## Postgres 18, not Neo4j, should hold the canon

The product plan names **Neo4j for the canon and Weaviate for search** (repo: `docs/product-plan.md`). The storage research points elsewhere, and I agree with it. **No healthy, OSI-licensed database gives a bitemporal graph out of the box**, and several popular graph stores are not open source:

| Database | Licence |
|---|---|
| Memgraph | BSL-1.1 |
| FalkorDB | SSPL |
| SurrealDB | BSL-1.1 |
| KurrentDB | KLv1 |

Sources: [ArcadeDB comparison](https://arcadedb.com/blog/open-source-knowledge-graph-graphrag-databases-compared/); [SurrealDB LICENSE](https://github.com/surrealdb/surrealdb/blob/main/LICENSE).

Kùzu, the attractive embedded option, was archived in October 2025 ([OneUptime](https://oneuptime.com/blog/post/2026-08-12-kuzu-archived-pin-0-11-3-fork-or-migrate/view)). Graphiti (Apache-2.0) is temporally aware, but it extracts facts with an LLM and depends on Neo4j or FalkorDB ([PyPI](https://pypi.org/project/graphiti-core/0.29.3/)). That makes it the opposite of a human-verified, verse-cited register.

**PostgreSQL 18** adds `WITHOUT OVERLAPS` temporal keys and `PERIOD` temporal foreign keys ([Neon](https://neon.com/postgresql/postgresql-18/temporal-constraints)), and PG 19 adds `FOR PORTION OF` ([Xata](https://xata.io/blog/postgres-as-a-temporal-db)). With append-only history tables, that is enough to model the three time axes the repo lacks:

- **story time** (war day as `int4range`, narrator frames as reified "telling" events)
- **textual time** (BORI CE, apparatus, vulgate and popular as separate expressions)
- **system time** (when a claim was asserted, verified and released)

One instance can hold the claims register, the ledger, approvals and pgvector embeddings. Star-passage safety becomes a database check: `citable=false` on apparatus rows. **XTDB v2 (MPL-2.0)** is the only mature OSI-licensed bitemporal database ([XTDB](https://www.xtdb.com/blog/launching-xtdb-v2)), but it is JVM-based and comes from a small vendor, so keep it as a fallback. For standards, map PROV-O, LRMoo and Web Annotation onto the relational model, expose verses through **DTS 1.0, stable since 13 Feb 2026** ([Balisage](https://balisage.net/Proceedings/vol31/html/Scott01/BalisageVol31-Scott01.html)), and publish statement-level provenance as RDF 1.2 triple terms ([W3C CR](https://www.w3.org/TR/2026/CR-rdf12-concepts-20260407/)). No reusable open KG of the epics exists, and Itihāsa follows Dutt's vulgate and is academic-use only ([AIKosh](https://aikosh.indiaai.gov.in/home/datasets/details/itihasa.html)), so Dheevara builds its own.

For media storage, **do not use MinIO community edition**: it entered maintenance mode in Dec 2025 and was archived in 2026 ([InfoQ](https://infoq.com/news/2025/12/minio-s3-api-alternatives/)). Sources disagree on whether that happened on 12 Feb or 25 Apr. **SeaweedFS (Apache-2.0)** is the self-hosted replacement. Garage is AGPL-3.0. Managed S3 is simpler for 2–5 people.

### Orchestration, serving and Indian GPUs are almost entirely OSI

**Temporal is MIT** ([LICENSE](https://github.com/temporalio/temporal/blob/main/LICENSE)), and its approval pattern blocks on a Signal while freeing the worker ([docs](https://docs.temporal.io/design-patterns/approval)). That maps directly onto three repo rules:

- **Rule 3 (ledger before spend):** a `reserveBudget` Activity writes a ledger row keyed on run, shot and content hash before the paid Activity runs.
- **Rule 6 (draft first):** the human approval file becomes a Signal.
- **Rule 9 (scholar sign-off):** the same approval-Signal pattern carries the record.

**Hatchet (MIT, Postgres-only)** is lighter and offers `waitForEvent` in TypeScript ([docs](https://docs.hatchet.run/v1/durable-event-waits)).

**SOURCE-AVAILABLE, avoid under an OSI policy:** **Restate (BSL; its grant does permit this use case)**, **Inngest (SSPL)** and **n8n (Sustainable Use)** ([Restate LICENSE](https://github.com/restatedev/restate/blob/main/LICENSE); [Inngest](https://github.com/inngest/inngest/blob/main/LICENSE.md); [n8n](https://github.com/n8n-io/n8n/blob/master/LICENSE.md)).

Serving:

- **SGLang (Apache-2.0)** for LLMs and H3-class multi-GPU diffusion, plus vLLM (Apache-2.0, not re-verified this session).
- **ComfyUI (GPL-3.0)** headless for diffusion graphs. That is fine as an internal server, but modified code must be released if distributed ([LICENSE](https://github.com/comfyanonymous/ComfyUI/blob/master/LICENSE)).
- **LitServe or BentoML (Apache-2.0)** for IndicF5, Vāgdhenu and IndicConformer.
- **LiteLLM**, MIT outside its `enterprise/` folder (open core), as the gateway with per-key budgets.
- **SkyPilot (Apache-2.0)** or **dstack (MPL-2.0)** to start and stop GPU nodes.

For observability, Langfuse is MIT outside `ee/` and its copyright now names ClickHouse, Inc. ([LICENSE](https://github.com/langfuse/langfuse/blob/main/LICENSE)). **Arize Phoenix is ELv2, source-available**.

Indian GPU prices now compete with US neoclouds. E2E's pricing page, dated 14 Oct 2026 and quoted ex-GST, lists ([E2E pricing](https://www.e2enetworks.com/pricing.md)):

| GPU | On-demand | Spot |
|---|---|---|
| L4 | ₹49/hr | – |
| L40S | ₹102/hr | – |
| A100 80GB | ₹189/hr | ₹66/hr |
| H100 | ₹379.05/hr | ₹70/hr |

Krutrim lists an H100 at **₹213/hr on-demand and ₹173/hr on a 1-year reservation** ([Krutrim docs](https://docs.cloud.olakrutrim.com/basics/core-infrastructure/compute)). JarvisLabs is about ₹218/hr with per-minute billing. AWS, GCP and Azure Mumbai sell H100s only as 8-GPU instances at about $83–98/hr ([dev.to roundup](https://dev.to/mr_manushukla/gpu-cloud-pricing-in-india-2026-h100-h200-and-b200-rates-compared-bo7)). **IndiaAI Mission** compute is subsidised to roughly ₹65–92/hr, but approval is discretionary and favours "national importance". Treat it as a bonus. Spot preemption is acceptable here, because content-hash caching plus durable retries make preempted shots resumable without paying twice.

The delivery and backend layers are standard open source:

- **Media:** FFmpeg with SVT-AV1 and x264, and CMAF packaging for HLS and DASH. These licences were not re-verified this session; FFmpeg becomes GPL when built with x264.
- **Backend:** Supabase, which is Apache-2.0 ([LICENSE](https://github.com/supabase/supabase/blob/master/LICENSE)).
- **Editorial and scholar review:** Payload CMS (MIT) ([LICENSE](https://github.com/payloadcms/payload/blob/main/LICENSE.md)).
- **Payments:** Hyperswitch (Juspay, Apache-2.0), with Razorpay and Stripe behind it.
- **Analytics and flags:** Umami (MIT) and Flagsmith (BSD).

**Directus has moved to a fair-source licence** ([license](https://github.com/directus/directus/blob/main/license)). Lago, Plausible, Zitadel and Unleash are AGPL-3.0, which is safe when self-hosted unmodified. Push notifications still need FCM and APNs.

## Paid routes cost 1–8× more, and gulab.ai adds a layer, not a capability

The paid-offerings note gives costs for a 114-second, 13-shot chapter with narration in two languages:

| Route | Licence and terms | Finals only | With 3× draft attempts |
|---|---|---|---|
| **Self-hosted Wan 2.2 distilled (Apache)**, about 1.5 H100-hours | No training by construction; India-resident | – | **≈ ₹105 (E2E spot) to ₹570 (E2E list)**, my arithmetic |
| fal MiniMax H3 Max Turbo ($0.025/s) | **India-only under the repo's reading**; fal §6(c) | ≈ ₹300 | ≈ ₹800 |
| fal H3 Max, Runway Gen-4 Turbo or Veo 3.1 Lite ($0.05/s) | Gemini paid tier: "not used to improve products" | ≈ ₹550 | ≈ ₹1,550 |
| Repo's s1e3 fal draft plan (Kling 3.0 + Wan 3.0 480p) | fal "opt-out" | – | **$5.92** (≈ ₹520 at ₹88/$) |
| Veo 3.1 Fast 1080p, Gemini API ($0.12/s) | No training on paid tier | ≈ ₹1,250 | ≈ ₹2,250–3,700 |
| fal Kling v3 Pro ($0.14/s) | fal terms | ≈ ₹1,470 | ≈ ₹4,280 |
| gulab.ai | Underlying fal or BytePlus price plus an unknown credit markup; no terms | Unknown | Unknown |

Sources: [fal pricing](https://fal.ai/pricing); [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing); [Runway](https://docs.dev.runwayml.com/guides/pricing/); repo `src/render/models.mjs`.

Narration is negligible on any route: about ₹12 on Sarvam for two languages, and the repo's actual Sarvam spend was **$0.1658 (≈ ₹16)** including STT checks. Video is about 95% of cost.

The comparison changes if Dheevara rents a dedicated GPU rather than paying hourly. A full-time H100 at Krutrim's reserved rate is about ₹1.26 lakh a month (₹173 × 730 hours, my arithmetic). Against hosted routes, that only pays off at roughly **30+ chapters a month**, by the video researcher's break-even. Until then, **on-demand or spot capacity with batched jobs** beats both a reserved box and fal. The plan's own figure of "$60–120 per usable chapter" (repo: `docs/product-plan.md`) is an order of magnitude above either route. That suggests the plan priced in many more retakes, or premium models throughout, and real draft-to-final ratios are still unknown.

### Gulab.ai verdict: a reseller canvas that fails rule 5 until it signs a DPA

Gulab is a Bengaluru, Upsurge Labs-incubated "node-based AI creative studio" ([gulab.ai](https://gulab.ai/); [upsurge.io](https://upsurge.io/)). It has **no model of its own**. Its public bundle routes to:

- fal endpoints: Kling, Veo 3.1, PixVerse and FLUX
- ByteDance Seedance, with media hosted on BytePlus and Volcano domains
- `minimax/h3` and `alibaba/wan-3.0`
- xAI, Google and OpenAI
- `sarvam/bulbul-v3` for Indic TTS

It bills in credits and exposes a credit-spending MCP server at `mcp.gulab.ai` ([gulab.ai/mcp](https://gulab.ai/mcp)). Its pricing, terms and privacy pages render only client-side, and **no training, retention, residency or output-ownership language could be retrieved**. Its sister product sells 2-minute music videos at $49 or ₹3,999 ([music.gulab.ai](https://music.gulab.ai/)).

Judged against the nine rules, Gulab fails on several counts:

- **No escape from fal's terms.** Gulab gives access to fal-hosted models without the founder holding a fal key. But prompts and reference images then flow Gulab → fal → model owner, so it adds a processor rather than removing one.
- **Fails rule 5 by default.** No fetchable terms means no evidence that inputs are not trained on.
- **Weakens rule 3.** Credits blur per-call cost attribution in the ledger.
- **Does not lift rule 4.** It resells H3, so the territory question remains.
- **Not open source.** It contradicts the founder's preference.

The verdict: **do not adopt it as a production backbone or a fal substitute**. At most it is a human storyboarding canvas for look-dev, and only after it answers in writing: its legal entity, a no-training DPA naming all sub-processors, India storage, a per-model markup or a bring-your-own-key mode, per-job cost in API responses, and its content policy on religious figures. The open equivalent is ComfyUI.

The Indian precedent at scale is **Galleri5 with Collective Artists**, whose AI *Mahabharat* used a crew of about 130–140 people ([Hollywood Reporter India](https://www.hollywoodreporterindia.com/features/interviews/vijay-subramaniam-on-ai-mahabharata-anurag-kashyaps-critique-and-future-of-mid-tier-films-they-will-go-into-oblivion)). It is a production house building a competing slate, not a vendor.

## Recommended open-source-first stack

| Layer | Recommended component | Licence | Fallback / paid comparator | Flag |
|---|---|---|---|---|
| Script drafting, fact-check against claims | Sarvam-30B / 105B on SGLang or vLLM | Apache-2.0 | GLM-5.2, DeepSeek-V4-Flash (MIT) | Avoid Qwen3.8-Flash-Next, GLM-5.3, Kimi-K3 (custom) |
| Translation | IndicTrans2 + Sarvam-Translate cross-check | MIT; **GPL-3.0 + Gemma terms** | Sarvam Translate API (₹20/10K chars) | Gemma terms not OSI |
| Shot-DSL and scene-code authoring | Qwen3.8-27B or Qwen3-Coder-30B-A3B, schema-constrained | Apache-2.0 | Devstral-Small-2 (Apache) | Devstral-2-123B is "other" |
| Shot DSL (source of truth) | Extended `shot-contract.schema.json` + compiler | Own code | – | – |
| Procedural renderer | Blender / `bpy`, Cycles headless | GPL-3.0 (outputs free) | Godot Movie Maker (MIT) | EEVEE headless unverified |
| Overlays, captions, 2D | Revideo / Motion Canvas | MIT | – | **Remotion is source-available** |
| Timeline | OpenTimelineIO | Apache-2.0 | – | – |
| Relief depth and normals | MoGe-2, DA3MONO-LARGE, Marigold v1.1 | MIT; Apache-2.0; OpenRAIL++ | – | **DA-V2-B/L, DA3-L/G non-commercial** |
| Props to 3D | TRELLIS.2, TripoSR | MIT | – | Hunyuan3D territory-restricted |
| Keyframes | Qwen-Image-2512, Qwen-Image-Edit-2511 | Apache-2.0 | FLUX.2 klein 4B, Z-Image-Turbo (Apache) | **FLUX [dev] / klein 9B non-commercial** |
| Style and character LoRA | musubi-tuner | Apache-2.0 | ai-toolkit (MIT, unverified) | SimpleTuner AGPL |
| Video drafts | Wan 2.2 I2V-A14B + LightWan2.2 4-step on LightX2V | Apache-2.0 | Hosted Wan 3.0 ($0.05/s 480p) | – |
| Video finals / hybrid | Wan 2.2 720p distilled; Wan2.2-Fun-Control / VACE on Blender depth | Apache-2.0 | LTX-2.5; Veo 3.1 (no-training tier) | **LTX-2.x capped at $10M**; **H3 India-only**; Kandinsky 6 (MIT) to evaluate |
| Upscale | SeedVR2 3B/7B | Apache-2.0 | Real-ESRGAN (BSD-3, unverified) | **SUPIR non-commercial** |
| QC | Deterministic checks + YuNet + Qwen3-VL / Qwen3.8-27B judge | Apache-2.0 (YuNet per secondary source) | – | **InsightFace models non-commercial** |
| Provenance | TrustMark, Video Seal, c2pa-rs, burned-in label | MIT; MIT; MIT/Apache (unverified) | – | Stable Signature CC BY-NC (unverified) |
| Narration (11 Indic languages) | IndicF5, consented narrator | MIT (gated) | Sarvam Bulbul v3 (₹30/10K chars) | Parity unproven |
| English narration | Chatterbox or Qwen3-TTS | MIT; Apache-2.0 | Indic Parler-TTS (Apache) | **XTTS-v2, F5 base non-commercial** |
| Sanskrit chant | Vāgdhenu + `chandas` | Apache-2.0 + MIT + BigVGAN terms | Human reciter | Voice consent needed |
| ASR round trip | IndicConformer-600M | MIT (gated) | Omnilingual ASR (Apache) | – |
| Music | Procedural or recorded tanpura | Own | Stable Audio Open (<$1M) | **MusicGen non-commercial** |
| Canon / KG | PostgreSQL 18 + btree_gist + pgvector | PostgreSQL licence (unverified) | XTDB v2 (MPL-2.0) | Memgraph, FalkorDB, SurrealDB not OSI |
| Object storage | SeaweedFS or managed S3 | Apache-2.0 | Garage (AGPL) | MinIO CE archived |
| Orchestration | Temporal (TS SDK) or Hatchet | MIT | – | Restate BSL, Inngest SSPL, n8n |
| Serving | SGLang / vLLM; ComfyUI; LitServe / BentoML; LiteLLM | Apache-2.0; **GPL-3.0**; Apache-2.0; MIT core | – | LiteLLM open core |
| GPU launch | SkyPilot or dstack | Apache-2.0; MPL-2.0 | – | – |
| GPU hosting | E2E (L4 / L40S / H100 spot), Krutrim H100, JarvisLabs | Commercial (India-resident) | IndiaAI subsidy; RunPod / Vast for public-domain drafts only | Prices conflict |
| Observability, evals | Langfuse self-hosted, OpenLLMetry, promptfoo | MIT core; Apache-2.0; MIT | Opik (Apache) | **Phoenix ELv2** |
| Media delivery | FFmpeg, SVT-AV1, Shaka Packager, CMAF HLS/DASH, Media3 / hls.js | LGPL/GPL; BSD; Apache (unverified) | Multi-DRM vendor later | Avoid HEVC royalties |
| App backend | Supabase, Payload CMS, Hyperswitch, Umami, Flagsmith | Apache-2.0; MIT; Apache-2.0; MIT; BSD | RevenueCat (planned) | Directus fair-source |

## A four-phase adoption plan

| Phase | Window | Deliverables | Rules it unblocks |
|---|---|---|---|
| **0. Unblock without fal** | Weeks 0–2 | Stand up an E2E GPU box with CUDA 12.1 and point `VAGDHENU_URL` at it, once the chant voice is permitted. Add self-hosted Wan 2.2 + LightX2V, Qwen-Image and IndicConformer as registry entries with licence and territory fields, and ledger GPU-seconds × rate before each job. Pass the mission test (`pnpm chapter s1e3 --quality draft`, under $15) on self-hosted drafts. Spike Blender relief renders on the two reveal macros. | 3, 5, 6, 7 |
| **1. Make it trustworthy** | To the 6 Nov 2026 Ramayana window and the 12 Jan 2027 retention gate | M3 QC gate (deterministic checks + Qwen3-VL judge + YuNet). M4 assembler with TrustMark / Video Seal + C2PA. Temporal or Hatchet with reserve-then-spend. Postgres 18 loader from git, with claim verification timestamps. Blind test IndicF5 vs Bulbul. Self-host Sarvam-30B for drafting. | 1, 2, 3, 9 |
| **2. Code as source of truth** | To the April 2027 paid launch | Extend the shot contract into the full relief DSL and compiler. Train the style LoRA on CC0 museum reliefs. Diffusion hybrid (Wan-Fun / VACE) only for organic motion, frozen as hashed assets. Supabase + Payload scholar workflow feeding approval Signals. CMAF delivery. Langfuse in India. | 1, 2, 6, 9 |
| **3. Scale and reuse** | After launch | Reserved Indian capacity once volume passes about 30 chapters a month. Evaluate Kandinsky 6 and newer Wan. Apply for IndiaAI. Export relief meshes and camera paths to three.js for the JS track and app. DTS / RDF publication of the canon. | 2, 4 |

Phase 0 requires Avi to revisit decision #8 ("hosted for anything that ships; self-hosted only for drafts"). That decision rested on H3's territory clause, which Apache-licensed Wan does not have. Self-hosted endpoints are real providers, not the "local stand-ins" the working rules forbid, so they comply as long as each one fails loudly when unreachable.

## Where the notes disagree

| Question | Position A | Position B | How I resolved it |
|---|---|---|---|
| MiniMax H3 territory and publishing abroad | Video notes: India permitted, and finals are acceptable if a lawyer clears the clause on outputs outside the territory | Repo decision #20: all H3, hosted included, India-only; diaspora-first excludes it | Follow the repo until MiniMax answers in writing |
| Is H3 open? | Video notes: open weights since 3 Aug 2026 ([HF](https://huggingface.co/MiniMaxAI/MiniMax-H3)) | Paid notes list it as closed | Open-weight under a custom, non-OSI licence |
| Hosted H3 price | fal list: $0.025–0.05/s | Repo registry: LoRA reference-to-video at $0.0625–0.20/s | Different endpoints; both may be right |
| E2E H100 on-demand | ₹379.05 (pricing page, 14 Oct) | ₹362 (H100 page), ₹249 (E2E blog), ₹280 (ZenoCloud), "from ₹49" headline | Budget at ₹379 + 18% GST; spot ₹70 |
| IndiaAI subsidised rate | ₹65 (PIB snippet) | ₹67 / ₹92 / ₹115–150 pre-subsidy | Treat as an upside only |
| Wan 2.6 / 2.7 / 3.0 open weights | Aggregators say Apache | Wan-AI org and others say open weights stopped at 2.2 | Assume 2.2 |
| LTX-2.5 release | 11 Aug 2026 | HF repo created 23 Jul 2026 | Immaterial |
| FX rate for costing | ₹88/$ (paid notes) | ₹96.32/$ (repo, ECB 2 Oct) | Costs above use ₹88; add about 9% at the repo rate |
| Canon store | Plan: Neo4j + Weaviate | Research: Postgres 18 + pgvector | Postgres, for licence and operational reasons |
| MinIO archive date | 12 Feb 2026 | 25 Apr 2026 | Either way, do not use it |

## Conclusion

The question was framed as "what replaces fal", but the more useful finding is that Dheevara's chosen look makes generation the least important dependency. The style was picked to hide AI drift and give video models depth. It is also a relief lit by one lamp, which a small, tested compiler can render deterministically, and the shot contracts that would drive that compiler already exist and are already validated. Choosing code first turns rules 1, 2 and 6 from QC problems into compile-time guarantees. It makes every shot reproducible from git. It lets the same relief assets serve the video, the JS chapters and the app. Diffusion then becomes a capability bought per shot, where organic motion justifies it. That puts the moat the plan describes — "the graph with a citation on every claim" — inside the rendering pipeline itself.

What remains are three dependencies the open stack cannot solve with software, and all three are people and permissions: a consented narrator voice and a consented chant voice, a scholar who signs claims, and written answers from BORI on the text and from MiniMax on territory. None of them needs a fal key. Several have been waiting since 4 October.
