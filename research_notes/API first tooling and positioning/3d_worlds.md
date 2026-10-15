# 3D Worlds with LLMs and Generative World Models, for Dheevara (as of 2026-10-15)

Scope note: 15 search/fetch calls. Official primary sources: World Labs API pricing docs, World Labs Spark 2.0 blog, Tencent HY-World 1.5 tech report, Runway research page. A lot of the rest comes from aggregators or vendor-comparison pages, and those are flagged where they appear. Some vendors in the brief were not covered by any source I found (Skybox AI, Luma world features, Dynamics Lab, SpAItial, CSM, Sudo AI, NVIDIA Cosmos, Roblox Cube, Unity AI, Bezi, Rosebud, PlayCanvas/SuperSplat, Babylon splats, Filament/SceneView). They are listed under Gaps, not filled in from memory.

## 1. Generative world models and 3D world generators: what they output, and is there an API or export?

### Takeaway
They split into two kinds:
- **Persistent 3D world generators.** These output Gaussian splats or meshes you can export and keep. World Labs Marble is the only one with a public, priced API. Tencent HunyuanWorld/WorldMirror are open weights.
- **Interactive "world models."** These generate pixels frame by frame and leave no exportable 3D. Examples are Genie 3, Runway GWM-1, HY-World 1.5/WorldPlay, Odyssey and Decart. They cannot be shipped to a cheap Android phone.

For Dheevara, only the first kind gives a reusable, consistent location. Marble is the practical choice, but AMD's pending acquisition of World Labs makes its API continuity a real risk.

### Cited Findings
**World Labs Marble (persistent 3D, has an API)**
- The World API launched on 21 Jan 2026. The Marble app has plans from free up to $35/mo Pro. — [beri.net](https://www.beri.net/article/amd-world-labs-acquisition-marble-world-api-continuity-world-model-hardware-lock-in)
- API pricing:
  - Credits cost $1.00 per 1,250, with a $5 minimum. API credits never expire. Credits bought in the Marble app cannot be used on the API. — [World Labs API pricing](https://docs.worldlabs.ai/api/pricing)
  - Per world: `marble-1.0-draft` is 150–250 credits (about $0.12–0.20). `marble-1.0`/`1.1` is 1,500–1,600 credits (about $1.20–1.28). `marble-1.1-plus` is 1,500–3,100 credits (observed median $1.28, mean $1.71, max $2.48). — [World Labs API pricing](https://docs.worldlabs.ai/api/pricing)
  - Pano generation from a text or non-pano image costs 80 credits; from multi-image or video input, 100 credits. — [World Labs API pricing](https://docs.worldlabs.ai/api/pricing)
- API exports:
  - PLY Gaussian splat export (`asset_type: splats, format: ply`) is **free**. — [World Labs API pricing](https://docs.worldlabs.ai/api/pricing)
  - GLB mesh export costs 3,500 credits ($2.80) per world. You get both textured and vertex-coloured variants, and re-requests are free. — [World Labs API pricing](https://docs.worldlabs.ai/api/pricing)
  - The pricing page says nothing about licensing, commercial rights or rate limits. — [World Labs API pricing](https://docs.worldlabs.ai/api/pricing)
- Consumer app tiers: splat export and low-res collider meshes are on Standard ($20/mo). High-res textured meshes are on Pro ($35/mo). A secondary source says commercial rights start only at Pro. — [therundown/aggregated search: marble.worldlabs.ai/pricing](https://marble.worldlabs.ai/pricing); [invideo](https://invideo.io/blog/world-labs-marble-3d-worlds/)
- Splats come as .spz (World Labs' compressed format) or .ply. This is from a third-party guide. — [invideo](https://invideo.io/blog/world-labs-marble-3d-worlds/)
- Marble accepts multimodal inputs: text, images, multi-image and video. — [World Labs blog](https://www.worldlabs.ai/blog/marble-world-model); [TechCrunch, Nov 2025](https://techcrunch.com/2025/11/12/fei-fei-lis-world-labs-speeds-up-the-world-model-race-with-marble-its-first-commercial-product/)
- **Risk:** AMD announced a definitive agreement to buy World Labs on 28 Sep 2026, for about $8.2B in stock, closing by the end of 2026.
  - Neither announcement mentions Marble, the World API, pricing or existing customers.
  - World Labs' ToS (updated 21 Jan 2026) lets it assign the agreement without customer consent (§12.7) and terminate "for convenience at any time" (§11.2(a)).
  - Source: [beri.net](https://www.beri.net/article/amd-world-labs-acquisition-marble-world-api-continuity-world-model-hardware-lock-in). This is a single secondary source. Verify the deal against AMD's own release.

**Google DeepMind Genie 3 (interactive, no export, no API)**
- Access is through the "Project Genie" Google Labs site, launched 29 Jan 2026 for Google AI Ultra subscribers. — [9to5Google](https://9to5google.com/2026/01/29/google-project-genie/); [Wikipedia: Project Genie](https://en.wikipedia.org/wiki/Project_Genie_(website))
- Reported limits: 60-second sessions at 720p and 20–24 fps. No public API, and no weights. — [DataCamp guide](https://www.datacamp.com/tutorial/google-genie-3-guide); [fenxi.fr](https://fenxi.fr/en/blog/genie-3-google-deepmind-world-model-2/)
- One Sept 2026 comparison claims worldwide availability for Ultra subscribers with Street View–grounded worlds. No primary source confirms this. — [tech-insider.org](https://tech-insider.org/genie-3-vs-marble-vs-nvidia-cosmos-world-models-2026/)

**Tencent Hunyuan family (open weights, self-host or third-party host)**
- HunyuanWorld-Voyager was open-sourced on 2 Sep 2025.
  - It makes 3D-consistent video from one image plus a user-defined camera trajectory.
  - The licence is custom: research and personal use are allowed, and commercial use only under conditions.
  - Sources: [CGWorld](https://cgworld.jp/flashnews/01-202509-HunyuanWorld-Voyager.html); [ComfyUI wiki](https://comfyui-wiki.com/fr/news/2025-09-05-tencent-hunyuanworld-voyager-3d-video-generation)
- A secondary source puts Voyager at about 80 GB of VRAM for 540p. — [toolnavs](https://toolnavs.com/article/161-new-breakthrough-in-ai-world-model-hunyuanworld-voyager-open-source-reshaping-vr)
- HunyuanWorld-Mirror (WorldMirror, "World 1.1") is a feed-forward 3D reconstruction model (video or multi-view in, 3D out), open-sourced in late 2025. — [CGWorld](https://cgworld.jp/flashnews/01-202511-HunyuanWorld-Mirror.html)
- HY-World 1.5 "WorldPlay" (Dec 2025):
  - It is a streaming video diffusion model for real-time interactive worlds, with keyboard/mouse "dual action" control and a "reconstituted context memory" for long-range consistency.
  - Tencent reports about 24 fps. It is built on HunyuanVideo 1.5, and weights plus training code were released.
  - Sources: [HY-World 1.5 tech report](https://3d-models.hunyuan.tencent.com/world/world1_5/HYWorld_1.5_Tech_Report.pdf); [aifilms](https://studio.aifilms.ai/blog/hunyuan-world); [CGWorld](https://cgworld.jp/flashnews/01-202601-HYWorld15.html)

**Runway GWM-1 (interactive)**
- Announced in Dec 2025, it is autoregressive on top of Gen-4.5 and generates frames in real time. It can be steered by camera pose, robot commands or audio.
- It has three variants: GWM Worlds, GWM Avatars and GWM Robotics.
- Sources: [Runway Research](https://runway.com/research/introducing-runway-gwm-1); [The Decoder](https://the-decoder.com/runway-unveils-first-general-world-model-alongside-major-gen-4-5-upgrades/)
- API status: Runway said it would come to the web product and API. Robotics has a Python SDK. A "GWM Worlds 2" research preview with access on request is reported, possibly from 3 Sep 2026; that date is unverified. — [Runway Research](https://runway.com/research/introducing-runway-gwm-1); [deeka.ai](https://deeka.ai/blog/runway-ml-2026)

**Odyssey and Decart**
- Both make frame-by-frame interactive simulations. Reported 2026 rounds: Odyssey $310M, Decart $300M. I found no public API pricing or docs for either. — [signalsinbox](https://signalsinbox.com/blogs/news/world-models-top-startups)

**WorldGen (text to traversable 3D)**
- "WorldGen: From Text to Traversable and Interactive 3D Worlds" (arXiv 2511.16825) outputs traversable worlds. — [arXiv](https://arxiv.org/pdf/2511.16825)
- A separate open "WorldGen" Python package generates Gaussian splat scenes from text and saves them as .ply.
- Attribution to Meta is unconfirmed: one blog credits Ziyang Xie. — [themenonlab](https://themenonlab.blog/blog/worldgen-text-to-3d-scene-gaussian-splatting); [GitHub](https://github.com/MetaDyn/WorldGen)

### Inferences
- **Exportable, reusable worlds.** For a location that must look the same across chapters (Kurukshetra, Mount Mahendra, Laṅkā's shore), only exportable 3D works: a Marble splat or mesh, or WorldMirror reconstruction. Interactive world models re-imagine the scene every session. They have no export and no fixed canon, so they cannot carry `claim:`-cited hidden details at fixed positions.
- **Marble's cost is low.** A draft costs about $0.12–0.20 and a full world about $1.20–2.50. Splat export is free; mesh export is $2.80. Even 50 locations cost under $250, so cost is not the constraint. Continuity is (see the AMD risk), and so is the rights question: the API pricing page is silent on licence terms.
- **Hedge against Marble.** Store every exported PLY/SPZ and GLB in our own bucket, so that shipped experiences never call World Labs at runtime. Keep a fallback path: image or video to WorldMirror (open weights) via a third-party GPU host.
- **Rule 5 (no training on our texts).** World Labs' training-on-inputs terms were not checked. Send only visual prompts and reference images, never unreleased passages.
- **Rule 4 (territory).** Hunyuan's open licences have historically excluded certain territories. Check before any use. This was not verified here.

### Gaps
- Marble API commercial-licence terms, rate limits, and whether the API offers SPZ directly. The pricing page lists only PLY and GLB.
- Primary confirmation of the AMD–World Labs deal, and any post-deal API commitments.
- Genie 3 developer API: none found.
- Odyssey, Decart (Mirage/Oasis) and Dynamics Lab: no API docs found.
- SpAItial, Skybox AI (Blockade Labs), Luma world features, NVIDIA Cosmos API terms, and Meta's own world-gen products: none came up in my searches.
- The HunyuanWorld 1.0/1.5 licence territory clauses were not read.

## 2. 3D asset generation APIs (chariots, weapons, conch)

### Takeaway
Per-asset API costs are cents to under $1. All the major tools export GLB.
- **Meshy and Tripo** have the strongest rigging and animation stories.
- **Rodin (Hyper3D)** is the most expensive. It is said to have the cleanest topology and the widest format set, including USDZ.
- **Hunyuan3D v3.1 and TRELLIS 2 on fal** are the cheapest pay-per-call options with no subscription.

For props like a ratha, gadā, śaṅkha or bow, any of these is good enough to start. The real work is art direction and a style pass.

### Cited Findings
- Meshy: estimated $0.10–0.30 per model by one guide, and about $0.60 for Meshy 7 by another. It has auto-rig with 600+ animation presets. — [3daistudio](https://www.3daistudio.com/blog/best-3d-model-generation-apis-2026); [framesixty](https://framesixty.com/meshy-ai-3d-review/)
- Tripo:
  - Estimated $0.10–0.30 per model, about $0.21 per HD model on Tripo 3.1. Credits cost $0.01 each, and API access reportedly requires the $35/mo Pro plan.
  - Auto-rig (UniRig) is on paid tiers only.
  - Tripo v2.5 is also hosted on fal.
  - Sources: [3daistudio](https://www.3daistudio.com/3d-generator-ai-comparison-alternatives-guide/best-3d-generation-tools-2026/best-tool-for-generating-3d-models-with-ai-2026); [Meshy blog](https://www.meshy.ai/blog/best-ai-tools-for-3d-game-assets); [fal Tripo](https://fal.ai/models/tripo3d/tripo/v2.5/image-to-3d)
- Rodin (Hyper3D):
  - $0.50+ per model. The API reportedly needs the $120/mo Business plan, with "generate free, pay on download".
  - Exports GLB, FBX, OBJ, STL and USDZ.
  - It has no documented rigging, but that claim comes from Meshy's competitor page.
  - Sources: [Meshy vs Rodin](https://www.meshy.ai/compare/meshy-vs-rodin); [Cinevva](https://app.cinevva.com/guides/ai-3d-model-generators); [3daistudio](https://www.3daistudio.com/blog/best-3d-model-generation-apis-2026)
- Hunyuan3D on fal:
  - Pro text/image-to-3D costs $0.375 per generation. Rapid costs $0.225. PBR materials add $0.15.
  - The current endpoint is `fal-ai/hunyuan-3d/v3.1/rapid/image-to-3d`. Legacy v2 was $0.16 for a white mesh and $0.48 textured.
  - Sources: [fal Hunyuan 3D](https://fal.ai/hunyuan-3d); [fal v3](https://fal.ai/models/fal-ai/hunyuan3d-v3/image-to-3d); [3DStreet PR #2075](https://github.com/3DStreet/3dstreet/pull/2075)
- TRELLIS 2 on fal costs $0.30 at 1024. One developer found fal had silently dropped the `texture_resolution` parameter, so validate request schemas. — [3DStreet PR #2075](https://github.com/3DStreet/3dstreet/pull/2075)
- Most pricing sources are affiliate or comparison sites, and they disagree. — [3daistudio cost guide](https://www.3daistudio.com/3d-generator-ai-comparison-alternatives-guide/how-much-does-ai-3d-model-generation-cost)

### Inferences
- **Prop library cost.** A library of about 30 canonical props (ratha variants, dhvaja banners, conches named per hero, bows, gadā, chakra) would cost under $50 in generation. Make them image-to-3D from approved concept art in the stone-relief style, so all assets share one look.
- **Iconography.** The "relief" look suits vertex colour or a single stone material plus one warm point light. That makes PBR texture quality matter less, and makes the low-poly GLB with Draco compression cheap to ship.
- **Fit to the rules.** Rigging matters little: no deity faces close-up (Rule 1), and the human figures are better as silhouettes or reliefs. Props from canon need a `claim:` (Arjuna's Devadatta, Kṛṣṇa's Pāñcajanya, the Gāṇḍīva). That fits the existing canon schema.

### Gaps
- CSM, Sudo AI, and Hunyuan3D direct (Tencent Cloud) API prices: not found.
- No primary vendor pricing pages were fetched for Meshy, Tripo or Rodin.
- Quality on Indian-iconography objects is untested. Expect Western or fantasy biases in chariot and weapon shapes.
- Training-on-inputs terms for each vendor: not checked (Rule 5).

## 3. LLM-driven scene and world building

### Takeaway
The working pattern is: an LLM (Claude, in session) writes the scene code and layout, while generated assets and worlds are loaded as files. Two variants:
- **Web:** Claude writes three.js + Spark code that loads a Marble splat as the backdrop and GLB props from a manifest.
- **Video:** Claude drives Blender through an MCP add-on that can call Hyper3D, Tencent Hunyuan or fal generators with your own keys.

This matches the repo rule that planning is done by Claude in session and committed. No Anthropic key is needed in the pipeline.

### Cited Findings
- "MCP for Blender" has a free add-on. Users paste their own Tencent Cloud, Hyper3D or fal.ai API keys into Blender and pay those providers directly. Paid plans are $10/mo (Hobby) and $20/mo (Pro), with generations bundled. — [mcp-for-blender.com](https://www.mcp-for-blender.com/premium)
- fal, Replicate and Tencent Cloud expose 3D generation APIs that agents can call, including through hosted MCP servers. — [wireflow](https://www.wireflow.ai/blog/best-hunyuan3d-v3-tools-in-2026)
- Spark is a three.js Gaussian splat renderer, so splat worlds and three.js meshes compose in one scene. Spark 2.x reportedly needs three.js r179 or later. — [Spark GitHub](https://github.com/sparkjsdev/spark); [utsubo guide](https://www.utsubo.com/blog/gaussian-splatting-guide)
- 3DStreet, an open-source three.js/A-Frame editor, integrates Hunyuan3D 3.1, TRELLIS 2 and Meshy 7.1 generation directly into a scene editor. This is a real example of generator-plus-scene-graph wiring. — [3DStreet PR #2075](https://github.com/3DStreet/3dstreet/pull/2075)

### Inferences
- **Proposed architecture for Dheevara.**
  - A `scene.json` layout file gives positions of each akṣauhiṇī block, the chakravyūha rings, gates, and hero placements, each with a `claim:` id.
  - Claude writes it and checks it against the critical-edition text: Droṇa Parva's account of the formation, and the 7 warriors who face Abhimanyu.
  - A deterministic three.js loader renders it.
  - The repo's existing `web/chakravyuha.html` is presumably a 2D/2.5D reference. A 3D version can reuse its data.
- **Layout rule.** Have the LLM produce *data* (scene graph), not free-form code, for anything canon-bearing. Then the claim test (Rule 2) can validate it.

### Gaps
- No sources fetched on BlenderMCP (ahujasid), Unity AI, Roblox Cube/Assistant, Rosebud AI, Bezi, PlayCanvas AI, or text-to-layout research (e.g. LayoutGPT/Holodeck-style).
- No evidence gathered on how good vibe-coded three.js worlds are.

## 4. Delivery on web and phones

### Takeaway
Spark (WebGL2, open source, from World Labs) is the strongest web splat renderer for this use. Its official guidance budgets about 1–2M splats on Android. Spark 2.0 (April 2026) adds LoD streaming with a .RAD format.

Cheap Android phones will need roughly 0.5M or fewer splats, and the files must be heavily compressed:
- PLY is about 230 bytes/splat at full spherical harmonics.
- SPZ is about 10x smaller than PLY.

WebGPU should be avoided as a requirement.

### Cited Findings
- Spark's performance docs give rough budgets of about 1–2M splats on Android, 1–3M on iPhone and 1–5M on desktop. They advise `antialias:false` and lowering `maxStdDev` below √8. — [Spark performance docs](https://sparkjs.dev/docs/performance/)
- The Spark README claims it is fast on low-powered mobile and targets 98%+ WebGL2 support. — [Spark GitHub](https://github.com/sparkjsdev/spark)
- Spark 2.0 (14 Apr 2026):
  - Continuous LoD via a "splat tree", streaming in 64K-splat chunks, with a per-frame budget of 500K–2.5M "depending on device type".
  - New .RAD format: compressed and random-access streamable. SPZ is compressed but not progressively loadable.
  - Size example: 10M splats with SH0–3 is up to 2.3 GB as PLY and 200–250 MB as SPZ.
  - Spark stays on WebGL2 because WebGPU is not available on all devices.
  - Source: [World Labs: Spark 2.0](https://www.worldlabs.ai/blog/spark-2.0); [Spark 2.0 features](https://sparkjs.dev/docs/new-features-2.0/)
- Third parties say SPZ is about 10x smaller than PLY; one claim of 10–50x looks inflated. One guide suggests 15–30 MB maximum for mobile, which is a rule of thumb. SOGS compression is reported at about 14 MB per 1M Gaussians with full SH. — [utsubo](https://www.utsubo.com/blog/gaussian-splatting-guide); [swyvl viewers comparison](https://swyvl.io/blog/best-gaussian-splat-viewers/)
- No Android-specific benchmark was found. — [same search](https://swyvl.io/blog/best-gaussian-splat-viewers/)

### Inferences
- **Mobile file size.** By the official ratio, 1M splats at SH3 in SPZ is about 20–25 MB. Dropping to SH0 (flat colour) cuts that a lot, and the single-oil-lamp look barely needs view-dependent SH; this is my estimate, not measured.
- **Target for cheap Android.** Aim for about 300–500K splats at SH0, which should be about 5–10 MB, plus Spark 2.0 LoD and a low budget. Test on a ₹8–10k phone (Mali/Adreno 6xx class).
- **Fallback for very low-end devices.** Use a pre-rendered 360° pano or a 30-fps rendered video of the same world. Marble gives a pano as a by-product.
- **Native app (Compose Multiplatform).** The simplest option is to host the same three.js/Spark page in a WebView. Native Filament/SceneView handles GLB meshes well, but splat support there was not verified.

### Gaps
- No real benchmarks on low-end Android (e.g. Helio G-series or Unisoc).
- Not covered: gsplat.js, PlayCanvas engine/SuperSplat SOG format, Babylon.js splat support, Niantic/8th Wall Scaniverse SPZ tooling, Filament/SceneView splat support.

## 5. Using worlds to make video (consistent locations across chapters)

### Takeaway
No source describes this exact pipeline end to end, but each half is documented:
1. Render a deterministic camera path through a fixed splat or mesh world. This locks geometry, so locations stay consistent.
2. Restyle the render with video-to-video. Runway Aleph keeps the camera path and motion and changes the look, and can be guided by styled keyframes.

HunyuanWorld-Voyager is an alternative: it generates 3D-consistent video directly from an image plus a camera trajectory. However, it is open-weights, heavy on GPU (about 80 GB VRAM), and its licence is conditional.

### Cited Findings
- Aleph 2.0 does video-to-video on 2–30 s clips at up to 1080p. It takes optional keyframe images to guide edits: "edit one frame and Aleph 2.0 modifies the rest". One tutorial says only about 5 s of the source feeds a single edit, so the limits conflict. — [fuser.studio](https://fuser.studio/articles/runway-aleph-2-guide); [COEY Aug 2026](https://coey.com/resources/blog/2026/08/16/runway-aleph-2-0-makes-ai-video-editing-more-workflow-ready); [pixflow](https://pixflow.net/blog/runway-ml-video-editing-tutorial/)
- Aleph re-renders a shot with a new style while preserving the original motion, timing and camera path. Extreme style changes may cause motion drift. — [modelslab](https://modelslab.com/runway-aleph); [vidofy](https://vidofy.ai/en/models/runway/gen-4-aleph)
- Splat pipelines recover camera paths (via COLMAP) that can be replayed for consistent renders. — [GitHub video-3d-reconstruction-gsplat](https://github.com/Nannigalaxy/video-3d-reconstruction-gsplat)
- Voyager: image plus camera trajectory gives 3D-consistent video. — [CGWorld](https://cgworld.jp/flashnews/01-202509-HunyuanWorld-Voyager.html)

### Inferences
- **Proposed shot pipeline.**
  1. Marble world (draft first, per Rule 6), plus GLB props in Blender or three.js.
  2. Claude writes the camera path as data: eye height of a foot soldier or a vānara on Mahendra, so the viewer is a witness.
  3. Headless render at 480p of a grey/depth/beauty pass.
  4. Aleph (or Luma Modify / Wan VACE) styles it to the "temple relief, single oil lamp" look, using one approved style keyframe.
  5. Edit lock, then 1080p finals.
  - Ledger rows are written before each Marble and Aleph call (Rule 3).
- **Why this beats text-to-video alone.** The same Kurukshetra splat gives identical geography in every chapter. The camera path is auditable against the `forbidden` list (no shot inside a deity's POV), and Rule 1 can be enforced in code by checking camera positions against tagged deity volumes.
- **Cost estimate.** Aleph per-second pricing is not in hand, so the cost per shot is unknown.

### Gaps
- Not fetched: Aleph API per-second price and its training terms; Luma Modify API; Wan VACE hosted API (fal/Replicate) pricing.
- No evidence on Aleph's temporal stability when restyling splat renders, which have floaters and artifacts.

## 6. Recommendation: options and a 1-week chakravyūha prototype

### Takeaway
Three uses, ranked by value per effort:
- **(A)** One canonical Kurukshetra world: generated once in Marble, exported, and used both as a web/app explorable and as a fixed set for video fly-throughs. This has the highest leverage.
- **(B)** A cheap GLB prop library (Hunyuan3D, TRELLIS or Meshy on fal) reused across shots and JS chapters.
- **(C)** "Living relief" panels: a stone frieze mesh whose panels play Aleph-styled clips or animate GLB silhouettes.

Interactive world models (Genie 3, GWM, WorldPlay) should be watched, not adopted. They have no API or export, cannot be cited, and cannot run on cheap phones.

### Cited Findings
- Marble draft and full-world costs and free PLY export. — [World Labs API pricing](https://docs.worldlabs.ai/api/pricing)
- Spark mobile budgets and LoD streaming. — [Spark perf](https://sparkjs.dev/docs/performance/); [Spark 2.0](https://www.worldlabs.ai/blog/spark-2.0)
- fal asset pricing: Hunyuan3D at $0.225–0.375, TRELLIS 2 at $0.30. — [fal](https://fal.ai/hunyuan-3d); [3DStreet PR](https://github.com/3DStreet/3dstreet/pull/2075)
- Vendor risk: the AMD/World Labs deal and the ToS termination-for-convenience clause. — [beri.net](https://www.beri.net/article/amd-world-labs-acquisition-marble-world-api-continuity-world-model-hardware-lock-in)

### Inferences (recommendation, my synthesis)
**Option A: Canonical Kurukshetra splat world (web + video)**
- Effort: about 2–3 weeks to production.
- Cost: under $20 in generation per location, plus hosting.
- Risks:
  - World Labs continuity: mitigate by owning the exports.
  - Splat artifacts up close.
  - Low-end Android performance.
  - The generated look drifting from the relief style: mitigate by generating from approved relief-style reference images rather than text.

**Option B: GLB prop library**
- Effort: about 1 week for about 30 props.
- Cost: under $50.
- Risks: iconographic inaccuracy, so every prop needs a scholar check and a `claim:`; Western bias in shapes.

**Option C: Living temple relief**
- Effort: 2–4 weeks.
- Cost depends on Aleph pricing (unknown).
- Strong brand fit. Risk: "AI-slop" motion on sacred imagery. Restrict it to human or vānara witnesses; deities appear only as distant relief, never animated close-up.

**1-week chakravyūha prototype (explorable)**
- **Day 1: Canon and layout.**
  - Claude drafts `content/chakravyuha/scene.json` from the critical-edition Droṇa Parva: ring structure, gate positions, the warriors at each gate, and Abhimanyu's entry point, each with a `claim:` id.
  - Add a decision entry in `docs/decisions.md`.
- **Day 2: World.**
  - Write ledger rows first.
  - Generate 3–5 `marble-1.0-draft` worlds of a dusty plain at dusk from a relief-style reference image (about $1 total).
  - Pick one, generate the full `marble-1.1` world (about $1.30), and export PLY (free).
  - Convert or compress to SPZ/RAD at SH0 and a target of 500K splats or fewer.
- **Day 3: Props.**
  - Generate 6–8 GLBs on fal (ratha, dhvaja, foot-soldier silhouette, elephant, bow, conch), about $3.
  - Draco-compress them. Instance hundreds of soldiers as low-poly silhouettes, not splats.
- **Day 4: Scene.**
  - Claude writes `web/chakravyuha-3d.html`: three.js r179+ with Spark.
  - Load the splat backdrop and instance the formation rings from `scene.json`.
  - Use one warm point light and a stone-tint shader for the oil-lamp look.
  - Restrict the camera to a witness rig: eye-level walk at the outer ring plus one high "kite" view. No camera inside the ring core, and no deity close-ups. Enforce this with a test against `forbidden` volumes.
- **Day 5: Interaction and citations.**
  - Tap a gate to see who held it, with the citation.
  - Scrub through Abhimanyu's advance through the rings, reusing logic and data from `web/chakravyuha.html`.
  - Add a fallback MP4 or pano for weak devices.
- **Day 6: Device test.**
  - Test on a low-end Android (WebView inside the KMP app, plus Chrome) and on iPhone.
  - Measure load time, fps and memory. Tune the splat budget and `maxStdDev`.
- **Day 7: Video spike and decisions.**
  - Render a 10 s 480p camera path, then send it through Aleph with one styled keyframe.
  - Compare against pure text-to-video for consistency.
  - Write the go/no-go in `docs/decisions.md`.
  - Upload the deliverables to the Drive folder "Dheevara — Build Output".

### Gaps
- No measured low-end Android numbers.
- No Aleph or Luma/Wan per-second pricing.
- No licence or commercial-rights terms for Marble API outputs.
- Training-on-input terms (Rule 5) are unknown for World Labs, fal-hosted models and Runway. All must be checked before sending anything beyond visual references.
