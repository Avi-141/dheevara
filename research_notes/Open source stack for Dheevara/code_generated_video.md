# Programmatic / code-generated video for Dheevara (state as of 15 Oct 2026)

Scope: open-source pipelines where a model writes code (scene descriptions, Blender Python, TS/JS animation, shaders), a deterministic renderer turns the code into frames, and the code is stored as the source of truth. The style target is a stone relief lit by an oil lamp, in 9:16, about 13 shots per roughly 2-minute chapter.

Method note: licences were checked against the primary files on 2026-10-15. Code licences came from LICENSE files on raw.githubusercontent.com. Package licences came from the npm and PyPI registry metadata. Model-weight licences came from the Hugging Face API (`cardData.license`). The GitHub REST API was blocked in this session, so stars and activity dates come from secondary pages or were not collected.

---

## 1. Renderers and frameworks: licences and whether they render headless on a Linux GPU server or in CI

### Takeaway
Almost every deterministic renderer we need is under a permissive or copyleft OSI licence. There are three exceptions to watch:
- **Remotion** is source-available, not open source. A for-profit company with more than 3 employees needs a paid Company License.
- **Theatre.js Studio**, the editor, is AGPL-3.0. Only `@theatre/core` is Apache-2.0.
- **DepthFlow/ShaderFlow** are AGPL-3.0.

Blender is GPL, but that does not reach our rendered output. It is the strongest fit for "a relief is a displacement map lit by a moving point light". Cycles renders headless reliably. EEVEE headless on Linux depends on the EGL path added in 2022 and should be tested on our driver stack.

### Cited Findings
**Licences, verified from the primary file or registry:**
- **Remotion** uses its own "Remotion License", not an OSI licence.
  - The Free License covers "an individual", "a for-profit organization with up to 3 employees", "a non-profit or not-for-profit organization", or someone "evaluating whether Remotion is a good fit".
  - Any other entity "required to obtain a Company License", sold at remotion.pro.
  - It is not allowed "to copy or modify Remotion code for the purpose of selling, renting, licensing… your own derivate of Remotion."
  - The file states "In Remotion 5.0, the license will slightly change" (PR #3750).
  - Sources: [Remotion LICENSE.md](https://raw.githubusercontent.com/remotion-dev/remotion/main/LICENSE.md). npm `remotion` 4.0.535 declares the licence as "SEE LICENSE IN LICENSE.md" ([npm](https://registry.npmjs.org/remotion/latest)).
- **Motion Canvas** is MIT (©2022 motion-canvas); `@motion-canvas/core` 3.17.2 — [LICENSE](https://raw.githubusercontent.com/motion-canvas/motion-canvas/main/LICENSE), [npm](https://registry.npmjs.org/@motion-canvas/core/latest)
- **Revideo** is MIT and is a fork of Motion Canvas; its LICENSE still reads "Copyright (c) 2022 motion-canvas".
  - `@revideo/core` is at 0.11.0.
  - The README now points to github.com/midrender/revideo. It says Revideo "ships a headless render API… and a React player", "borrows concepts from Remotion and Rive, but is, in its core, zero dep", and is "the engine behind Midrender".
  - It also says "A scene is plain TypeScript, so Claude or Codex can produce one from a prompt."
  - Sources: [LICENSE](https://raw.githubusercontent.com/redotvideo/revideo/main/LICENSE), [README](https://raw.githubusercontent.com/redotvideo/revideo/main/README.md), [npm](https://registry.npmjs.org/@revideo/core/latest)
- **Manim Community** is MIT (©2024 Manim Community Developers); PyPI `manim` 0.22.0 — [LICENSE.community](https://raw.githubusercontent.com/ManimCommunity/manim/main/LICENSE.community), [PyPI](https://pypi.org/pypi/manim/json)
- **three.js** is MIT (0.186.1) and **React Three Fiber** is MIT (9.8.2) — [npm three](https://registry.npmjs.org/three/latest), [npm R3F](https://registry.npmjs.org/@react-three/fiber/latest)
- **Theatre.js** is split:
  - `@theatre/core` 0.7.2 is Apache-2.0.
  - `@theatre/studio` 0.7.2 is AGPL-3.0-only.
  - Sources: [npm core](https://registry.npmjs.org/@theatre/core/latest), [npm studio](https://registry.npmjs.org/@theatre/studio/latest), [repo LICENSE (Apache)](https://raw.githubusercontent.com/theatre-js/theatre/main/LICENSE)
- **Babylon.js** `@babylonjs/core` 9.31.0 is Apache-2.0 — [npm](https://registry.npmjs.org/@babylonjs/core/latest)
- **Godot** is MIT ("Copyright (c) 2014-present Godot Engine contributors") — [LICENSE.txt](https://raw.githubusercontent.com/godotengine/godot/master/LICENSE.txt)
- **p5.js** 2.3.4 is LGPL-2.1 — [npm](https://registry.npmjs.org/p5/latest)
- **Lottie**: `lottie-web` 5.13.0 is MIT and `@lottiefiles/dotlottie-web` is MIT — [npm lottie-web](https://registry.npmjs.org/lottie-web/latest), [npm dotlottie](https://registry.npmjs.org/@lottiefiles/dotlottie-web/latest)
- **Rive**: the runtime is MIT (`rive-app/rive-runtime`, ©2020 Rive) and `@rive-app/canvas` 2.44.2 is MIT — [LICENSE](https://raw.githubusercontent.com/rive-app/rive-runtime/main/LICENSE), [npm](https://registry.npmjs.org/@rive-app/canvas/latest). (The Rive editor is a separate hosted product. Its licence terms were not checked; see Gaps.)
- **Editly** 0.14.2 is MIT (©2020 Mikael Finstad) — [LICENSE](https://raw.githubusercontent.com/mifi/editly/master/LICENSE), [npm](https://registry.npmjs.org/editly/latest)
- **MoviePy** 2.2.1 is MIT — [LICENCE.txt](https://raw.githubusercontent.com/Zulko/moviepy/master/LICENCE.txt), [PyPI](https://pypi.org/pypi/moviepy/json)
- **OpenTimelineIO** 0.18.1 is Apache-2.0 — [LICENSE.txt](https://raw.githubusercontent.com/AcademySoftwareFoundation/OpenTimelineIO/main/LICENSE.txt), [PyPI](https://pypi.org/pypi/opentimelineio/json)
- **MLT** framework is LGPL-2.1 and **Shotcut** is GPL-3.0 — [MLT COPYING](https://raw.githubusercontent.com/mltframework/mlt/master/COPYING), [Shotcut COPYING](https://raw.githubusercontent.com/mltframework/shotcut/master/COPYING)
- **Natron** is GPL-2.0 (RB-2.6 branch) — [LICENSE.txt](https://raw.githubusercontent.com/NatronGitHub/Natron/RB-2.6/LICENSE.txt)
- **Blender as a Python module**: PyPI `bpy` 5.2.2 is GPL-3.0 — [PyPI](https://pypi.org/pypi/bpy/json)
- **Canvas back-ends for Node** (useful for custom 2D renderers): `skia-canvas` 4.0.0 is MIT and `@napi-rs/canvas` 1.0.11 is MIT — [npm skia-canvas](https://registry.npmjs.org/skia-canvas/latest), [npm napi-rs](https://registry.npmjs.org/@napi-rs/canvas/latest)

**Headless and CI behaviour:**
- **Blender, headless EGL.** A 2022 commit, "Introduce headless OpenGL rendering on Linux", made "true headless OpenGL rendering" possible on Linux. Blender falls back to it when other backends fail in background mode. It uses `EGL_PLATFORM_SURFACELESS_MESA` and is Linux-only — [bf-blender-cvs commit 3195a381200](https://lists.blender.org/pipermail/bf-blender-cvs/2022-August/176810.html)
- **Blender, older reports.** Threads from the 2.8 era said "We don't currently support headless rendering with Eevee". Users relied on VirtualGL or X with GLX. One reported that software Mesa EEVEE frames that took 2 s locally took 4.5 min on Colab. These threads predate the 2022 change — [devtalk thread](https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-eevee/1436)
- **Blender, Cycles.** Cycles runs headless (`blender -b … -f`), but argument order matters: `-b` must come before `-f` — [devtalk Cycles thread](https://devtalk.blender.org/t/blender-2-8-unable-to-open-a-display-by-the-rendering-on-the-background-cycles/8607/18)
- **Blender, unverified claim.** A vendor page from Oct 2026 says EEVEE-Next needs a Vulkan or OpenGL display context and crashes or renders black frames headless. It is marketing content and was not confirmed in Blender docs — [iRender](https://irendering.net/eevee-next-headless-dilemma-cloud-render-farm-guide/)
- **Remotion and GPUs.** "In headless mode, Chromium disables the GPU, leading to a significant slowdown". The GPU is re-enabled with `--gl`. WebGL content (Three.js, Skia, p5.js), CSS blur/shadow and many canvas operations need the GPU. "AWS Lambda instances have no GPU" — [Remotion GPU docs](https://www.remotion.dev/docs/gpu)
- **Godot Movie Maker mode.** It renders offline with "perfect frame pacing", and output "remains identical" regardless of hardware speed. CLI flags are `--write-movie out.avi|.ogv|.png`, `--fixed-fps N`, `--resolution WxH` and `--quit-after N`. Output can be OGV (Theora/Vorbis), AVI (MJPEG), a PNG sequence with WAV, or a custom MovieWriter (GDExtension). The docs do not say whether it works with `--headless` or without a display — [Godot docs](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html)

### Inferences
- **Remotion.** Dheevara is a for-profit team, and if it has more than 3 employees it needs a paid Remotion Company License. Remotion should be classed as "source-available, commercial". **Motion Canvas or Revideo (MIT)** are the licence-clean alternatives for TS-coded 2D/2.5D motion. Revideo's headless render API suits server rendering better than Motion Canvas's editor-centric workflow.
- **Theatre.js.** Using `@theatre/core` (Apache) to play back keyframe JSON at render time is fine. Shipping `@theatre/studio` (AGPL) inside the public web experiences would carry AGPL obligations. Keep it dev-only.
- **Blender.** The GPL-3.0 licence on Blender and `bpy` covers the software, not the renders. Our generated `.py` scene scripts that import `bpy` would be GPL-derivative only if distributed. Running them in-house is not distribution. (This is a standard reading of the GPL; it is not legal advice.)
- **Determinism.** Fixed-step renderers are most predictable, and these include Blender with a fixed seed and sample count, Godot Movie Maker, Manim, Motion Canvas/Revideo and FFmpeg. Headless-Chrome renderers (Remotion, Revideo, three.js-in-Puppeteer) depend on Chromium and GPU driver versions, so containers should pin both.
- **CI.** CPU-only CI (GitHub Actions without GPU) can run Manim, Motion Canvas/Revideo with software GL, FFmpeg and Blender Cycles on CPU, but slowly. EEVEE and WebGL-heavy scenes need a GPU runner with EGL.

### Gaps
- No official Blender 4.x/5.x release note was found that confirms EEVEE (EEVEE-Next, Vulkan backend) renders headless through EGL on NVIDIA. This needs an empirical test on our driver stack.
- The details of the Remotion 5.0 licence change (PR #3750) were not retrieved.
- The Rive editor's terms of service, and whether exporting or using `.riv` files needs a paid plan, were not checked.
- Natron development status in 2026 was not checked.
- Whether Godot Movie Maker works with `--headless` or needs an X/Wayland/EGL surface is not documented on the page read.
- The FFmpeg licence (LGPL by default, GPL when built with x264 or x265) was not re-verified this session.

---

## 2. Image → relief / 2.5D: depth, normals, image-to-3D, splats, parallax tools, and licences

### Takeaway
Code licences are mostly permissive, but the **weight** licences are a minefield:
- **Depth Anything V2 Base/Large** and the **DA3 Large/Giant/Nested** weights are **CC-BY-NC-4.0** (non-commercial).
- **DA3-MONO-LARGE and DA3-METRIC-LARGE** are **Apache-2.0**.
- **DA-V2-Small** is Apache-2.0.
- **MoGe-2** (MIT, with normals) and **Marigold v1.1** depth and normals (OpenRAIL++) are commercially usable.
- **TRELLIS / TRELLIS.2** are MIT.
- **TripoSR** is MIT.
- **Stable Fast 3D** is free only below USD 1M revenue.
- **Hunyuan3D 2.x** is barred in the EU, UK and South Korea.
- **DepthFlow** is AGPL-3.0.

### Cited Findings
- **Depth Anything V2.**
  - The repo code is Apache-2.0 — [LICENSE](https://raw.githubusercontent.com/DepthAnything/Depth-Anything-V2/main/LICENSE).
  - Weights per HF: V2-Small is `apache-2.0`; V2-Base and V2-Large are `cc-by-nc-4.0` — [HF API Small](https://huggingface.co/api/models/depth-anything/Depth-Anything-V2-Small), [Base](https://huggingface.co/api/models/depth-anything/Depth-Anything-V2-Base), [Large](https://huggingface.co/api/models/depth-anything/Depth-Anything-V2-Large)
- **Depth Anything 3** (ByteDance-Seed).
  - The code is Apache-2.0 — [LICENSE](https://raw.githubusercontent.com/ByteDance-Seed/Depth-Anything-3/main/LICENSE).
  - Weights released 2025-11-13. `DA3-LARGE` (~411M params), `DA3-GIANT` (~1.36B) and `DA3NESTED-GIANT-LARGE` are `cc-by-nc-4.0`. `DA3MONO-LARGE` and `DA3METRIC-LARGE` (~334M) are `apache-2.0`. Version 1.1 checkpoints of LARGE, GIANT and NESTED appeared on 2025-12-11 — [HF DA3-LARGE](https://huggingface.co/api/models/depth-anything/DA3-LARGE), [DA3MONO-LARGE](https://huggingface.co/api/models/depth-anything/DA3MONO-LARGE), [org listing](https://huggingface.co/api/models?author=depth-anything&sort=createdAt&direction=-1)
- **Marigold.** The code is Apache-2.0. The weights `marigold-depth-v1-1` and `marigold-normals-v1-1` are `openrail++` (~866M params; diffusion-based, built from SD) — [LICENSE](https://raw.githubusercontent.com/prs-eth/Marigold/main/LICENSE.txt), [HF depth](https://huggingface.co/api/models/prs-eth/marigold-depth-v1-1), [HF normals](https://huggingface.co/api/models/prs-eth/marigold-normals-v1-1)
- **Depth Pro (Apple).**
  - The README says the sample code and "the model weights are released under the LICENSE terms". That is Apple's custom licence, not OSI. Its patent clause notes Apple grants no patent rights for derivative works.
  - The HF licence tag is `apple-amlr`.
  - Sources: [README](https://raw.githubusercontent.com/apple/ml-depth-pro/main/README.md), [LICENSE](https://raw.githubusercontent.com/apple/ml-depth-pro/main/LICENSE), [HF](https://huggingface.co/api/models/apple/DepthPro)
- **MoGe / MoGe-2** (Microsoft). The code is MIT, and `Ruicheng/moge-2-vitl-normal` (with surface normals) is MIT on HF — [LICENSE](https://raw.githubusercontent.com/microsoft/MoGe/main/LICENSE), [HF](https://huggingface.co/api/models/Ruicheng/moge-2-vitl-normal)
- **TRELLIS** (Microsoft) is MIT for code and weights (`TRELLIS-image-large`). **TRELLIS.2** is MIT for code, and `TRELLIS.2-4B` weights (2025-12-01) are MIT — [TRELLIS LICENSE](https://raw.githubusercontent.com/microsoft/TRELLIS/main/LICENSE), [TRELLIS.2 LICENSE](https://raw.githubusercontent.com/microsoft/TRELLIS.2/main/LICENSE), [HF TRELLIS.2-4B](https://huggingface.co/api/models/microsoft/TRELLIS.2-4B)
- **Hunyuan3D 2.0 / 2.1** use the "Tencent Hunyuan 3D Community License":
  - "DOES NOT APPLY IN THE EUROPEAN UNION, UNITED KINGDOM AND SOUTH KOREA".
  - Output may not be used "outside the Territory".
  - Licensees with more than 1M MAU must request a licence.
  - Sources: [Hunyuan3D-2.1 LICENSE](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2.1/main/LICENSE), [Hunyuan3D-2 LICENSE](https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/main/LICENSE)
- **TripoSR** is MIT for code (©2024 Tripo AI & Stability AI) and for HF weights — [LICENSE](https://raw.githubusercontent.com/VAST-AI-Research/TripoSR/main/LICENSE), [HF](https://huggingface.co/api/models/stabilityai/TripoSR)
- **Stable Fast 3D** uses the Stability AI Community License. It is free for research, non-commercial use and commercial use below USD 1,000,000 annual revenue (commercial users must register). Above that, the licence terminates and an enterprise licence is needed — [LICENSE.md](https://raw.githubusercontent.com/Stability-AI/stable-fast-3d/main/LICENSE.md)
- **Gaussian splatting.**
  - `gsplat` code is Apache-2.0 (PyPI 1.5.3) — [LICENSE](https://raw.githubusercontent.com/nerfstudio-project/gsplat/main/LICENSE).
  - `nerfstudio` is Apache-2.0 (1.1.5) — [PyPI](https://pypi.org/pypi/nerfstudio/json).
  - **Brush** (Rust/WebGPU splat trainer and viewer) is Apache-2.0 — [LICENSE](https://raw.githubusercontent.com/ArthurBrussee/brush/main/LICENSE).
- **DepthFlow / ShaderFlow** (BrokenSource): "image to 2.5D parallax" shader videos.
  - PyPI `depthflow` 1.0.1 is AGPL-3.0, and `shaderflow` 0.11.3 is AGPL-3.0 — [PyPI depthflow](https://pypi.org/pypi/depthflow/json), [PyPI shaderflow](https://pypi.org/pypi/shaderflow/json).
  - It is described as "a heavily customizable steep parallax shader" and an open alternative to ImmersityAI. Its showcase depth maps come from DepthAnything — [PyPI page](https://pypi.org/project/depthflow), [gittrend summary](https://gittrend.io/repo/BrokenSource/DepthFlow).
- **trimesh** (mesh I/O and processing) is MIT — [PyPI](https://pypi.org/pypi/trimesh/json)

### Inferences
- **Relief look.** The cleanest commercially-licensed way to the relief look is:
  1. Use a generated or hand-made 2D carving design: line art, a silhouette, or an image.
  2. Estimate depth with **DA3MONO-LARGE (Apache)**, **MoGe-2 (MIT, also gives normals)** or **Marigold v1.1 (OpenRAIL++)**.
  3. Use the result as a height or displacement map on a subdivided plane in Blender, with a stone PBR material and a flickering point light.
  
  Avoid DA-V2-Large and DA3-Large/Giant weights for commercial output (CC-BY-NC).
- **Hand-sculpt instead.** For the relief style, a depth estimate from an illustration is often worse than authoring the height field procedurally. Options are SDF or 2D shapes extruded with bevels, "pillowing" via distance transforms, or Blender Geometry Nodes. That path is fully deterministic and needs no ML.
- **Image-to-3D (TRELLIS.2 MIT, TripoSR MIT)** helps with in-the-round props: chariots, bows, conch shells, lamps. True reliefs do not need it.
- **Avoid Hunyuan3D** if any team member, render server or audience is in the EU or UK.
- **DepthFlow** is a good reference design for GLSL parallax. Because it is AGPL, reimplement the technique, which is short shader code, rather than embedding it in a networked service.

### Gaps
- The exact meaning and restrictions of Apple's "apple-amlr" licence for Depth Pro were not read in full. Treat it as research-restricted until checked.
- I did not check whether the DA3 Apache variants match the NC variants' quality on stylised or illustrated inputs.
- Video Depth Anything (temporal consistency) licences were not checked.
- Normal-map estimators other than MoGe-2 and Marigold-normals (for example StableNormal, DSINE) were not checked.
- 2026 versions of Hunyuan3D (3.x) or TRELLIS beyond TRELLIS.2 were not found on HF in this session.

---

## 3. AI agents and papers that make video through code: what works and what doesn't

### Takeaway
The research pattern that works is **plan → write code → execute → render → VLM critique → patch**, with retrieval over API docs. Examples are Code2Video, TheoremExplainAgent, SceneCraft, BlenderAlchemy and LL3M.

The main failure modes are:
- **API hallucination**, the leading cause of failed renders.
- **LaTeX/text errors.**
- **Layout overlap**, present even in successful renders.

These map directly onto fixes we can engineer: a constrained DSL, retrieval over docs, linting, and a render-and-check loop.

### Cited Findings
- **Code2Video** (Show Lab, NUS; arXiv 2510.01174).
  - Three agents generate educational videos as **Manim code**: a Planner (storyboard), a Coder (runnable code with "scope-guided auto-fix") and a Critic (a VLM using "visual anchor prompts" to fix layout).
  - It introduces the MMMC benchmark and the TeachQuiz metric, and reports "40% improvement over direct code generation".
  - Accepted at the NeurIPS 2025 DL4C workshop; listed at ICML 2026.
  - The repo is MIT.
  - Sources: [NeurIPS listing](https://neurips.cc/virtual/2025/131666), [ICML 2026 listing](https://icml.cc/virtual/2026/poster/65050), [repo LICENSE](https://raw.githubusercontent.com/showlab/Code2Video/main/LICENSE). (The performance figure is self-reported.)
- **TheoremExplainAgent** (TIGER Lab; arXiv 2502.19400).
  - It generates Manim explainer videos. Most failures came from "Manim code hallucinations" (non-existent functions or invalid parameters), then LaTeX rendering failures, then general bugs.
  - Most completed videos still had "minor problems with how visual elements are laid out".
  - The o3-mini agent reached a 93.8% success rate and an overall score of 0.77 on 240 theorems.
  - The repo is MIT.
  - Sources: [arXiv PDF](https://arxiv.org/pdf/2502.19400), [EmergentMind summary](https://www.emergentmind.com/papers/2502.19400), [LICENSE](https://raw.githubusercontent.com/TIGER-AI-Lab/TheoremExplainAgent/main/LICENSE)
- **SceneCraft** (ICML 2024; arXiv 2403.01248).
  - An LLM agent that turns text into **Blender Python**.
  - It builds a scene graph as a layout blueprint and converts spatial relations into numeric constraints. A VLM reviews renders to refine the scene, and a growing library of reusable script functions is kept without fine-tuning.
  - It handles up to about 100 assets.
  - Sources: [PMLR](https://proceedings.mlr.press/v235/hu24g.html), [alphaxiv](https://alphaxiv.org/abs/2403.01248)
- **BlenderAlchemy** (Stanford, ECCV 2024; arXiv 2404.17672).
  - A VLM (GPT-4V) searches the space of Blender edits, using an edit generator and a state evaluator, plus reference images from image generators for "visual grounding".
  - It edits procedural materials and geometry, and adjusts lighting.
  - Sources: [arXiv](https://arxiv.org/abs/2404.17672v3), [ECCV](https://eccv2024.ecva.net/virtual/2024/poster/190)
- **LL3M** (UChicago; arXiv 2508.08228, Aug 2025).
  - Multiple LLM agents "plan, retrieve, write, debug, and refine Blender scripts", sharing a code context.
  - **BlenderRAG** is a retrieval base built from Blender API docs.
  - The output code is meant to be human-readable and parameter-editable.
  - Sources: [arXiv](https://arxiv.org/abs/2508.08228v1), [Gigazine](https://www.gigazine.net/gsc_news/en/20250818-ll3m)
- **BlenderMCP** (ahujasid) is MIT.
  - It works as a Blender add-on that opens a socket server and an MCP server. Tools include `execute_blender_code` ("Run Python in your live Blender"), asset search and import (Poly Haven, Sketchfab, Poly Pizza) and `generate_3d` (Tripo, Hunyuan3D, Hyper3D Rodin; premium generators preferred).
  - It has telemetry, with a `disable_telemetry` tool.
  - Sources: [LICENSE](https://raw.githubusercontent.com/ahujasid/blender-mcp/main/LICENSE), [README](https://raw.githubusercontent.com/ahujasid/blender-mcp/main/README.md)
- **Revideo** explicitly positions its TS scenes as LLM-writable ("Claude or Codex can produce one from a prompt") — [README](https://raw.githubusercontent.com/redotvideo/revideo/main/README.md)

### Inferences
- **What works.** Short, declarative, constrained code with a small API surface succeeds. Manim and Motion Canvas scenes, or a JSON shot spec compiled by our own code, are examples. Retrieval over API docs (LL3M's BlenderRAG) and a VLM critic on rendered keyframes (Code2Video, SceneCraft, BlenderAlchemy) are consistently what lifts quality.
- **What doesn't work.** Free-form `bpy` against a large, version-specific API leads to hallucinated calls (TheoremExplainAgent's top failure). Open-ended layout without explicit constraints produces overlaps.
- **Implication for Dheevara.** Do not let the LLM write raw `bpy`. Have it write a **typed shot DSL**: JSON or YAML validated by a schema, with fields for camera path, light path, relief asset IDs, timing and citation IDs. A hand-written, tested Blender (or WebGL) compiler turns the DSL into scenes. The LLM's code-writing is reserved for new procedural carving assets (Geometry Nodes or height-field generators), each reviewed once and then reused from a library, as in SceneCraft.
- **BlenderMCP** is useful for interactive authoring in development, but its telemetry and third-party generator calls make it unsuitable as a production render path.

### Gaps
- 3D-GPT (procedural generation via Infinigen) was not found in this session's searches, so its details are unverified.
- There are no published head-to-head numbers on Remotion/Motion Canvas + LLM template systems.
- No 2026 papers specifically on LLM → Blender **animation** (camera and light over time), as opposed to static scenes, were found.
- I did not confirm whether LL3M's code repository is public or what its licence is.

---

## 4. Open LLMs for writing scene code, and how to verify generated code

### Takeaway
As of Oct 2026 the open-weight frontier is large MoE models. Permissive options:
- **DeepSeek-V4 (MIT)**.
- **GLM-5/5.1/5.2 (MIT)**.
- **Qwen3-Coder (Apache)**.
- **gpt-oss (Apache)**.
- **Qwen3.8-27B (Apache, dense, natively multimodal)**.
- **Devstral Small 2 (Apache)**.

Watch the newest flagships. Qwen3.8-Flash-Next, Qwen3.8-2.4T, GLM-5.3 and Kimi-K3 have moved to **custom licences**. The Kimi K2.x "modified MIT" requires attribution above 100M MAU or USD 20M/month revenue.

For verification, a self-hostable VLM critic is available: Qwen3-VL (Apache), Qwen3.8-27B (Apache, vision-native) or GLM-4.5V (MIT).

### Cited Findings (HF API `cardData.license`, total params from safetensors metadata, creation date)
**Coding / general LLMs:**
- **Qwen3-Coder-480B-A35B-Instruct**: apache-2.0, ~480B, 2025-07-22. **Qwen3-Coder-30B-A3B**: apache-2.0, ~30.5B. **Qwen3-Coder-Next**: apache-2.0, ~79.7B, 2026-01-30 — [HF](https://huggingface.co/api/models/Qwen/Qwen3-Coder-480B-A35B-Instruct), [HF 30B](https://huggingface.co/api/models/Qwen/Qwen3-Coder-30B-A3B-Instruct), [HF Next](https://huggingface.co/api/models/Qwen/Qwen3-Coder-Next)
- **Qwen3.8 family** (Aug 2026):
  - `Qwen3.8-27B` is apache-2.0, ~27.8B, pipeline `image-text-to-text`. Its card calls it "a native vision-language model that understands images and videos" with "substantial gains across coding… and long-horizon agentic tasks".
  - `Qwen3.8-Flash-Next` (~180B) uses the custom licence `qwen-community-1.0`.
  - `Qwen3.8-2.4T-A95B` uses the custom licence `qwen3.8-max`.
  - Sources: [HF 27B card](https://huggingface.co/Qwen/Qwen3.8-27B/raw/main/README.md), [HF API Flash-Next](https://huggingface.co/api/models/Qwen/Qwen3.8-Flash-Next), [HF API 2.4T](https://huggingface.co/api/models/Qwen/Qwen3.8-2.4T-A95B)
- **DeepSeek**:
  - V3.1, V3.2-Exp and V3.2 are MIT (~685B).
  - **DeepSeek-V4-Pro** is MIT (~1.6T, 2026-04-22) and **V4-Flash** is MIT (~291B).
  - **V4.1-Flash** is MIT (2026-09-10; HF metadata reports ~763B total, which looks inconsistent with "Flash" naming and should be re-checked).
  - **V4-Flash-Vision-Exp** is MIT (~305B, image-text-to-text).
  - Sources: [HF V4-Pro](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V4-Pro), [V4-Flash](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V4-Flash), [V4.1-Flash](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V4.1-Flash), [V4-Flash-Vision-Exp](https://huggingface.co/api/models/deepseek-ai/DeepSeek-V4-Flash-Vision-Exp)
- **GLM (Z.ai)**:
  - GLM-4.5, 4.6 and 4.7 are MIT (~357B).
  - **GLM-5, 5.1 and 5.2** are MIT (~754B; Feb, Apr and Jun 2026).
  - **GLM-5.3** (2026-08-25) uses the custom licence `glm-5.3`.
  - **GLM-5.3-Flash** is MIT (~321B, image-text-to-text).
  - **GLM-4.5V** is MIT (~108B, vision).
  - Sources: [HF GLM-5](https://huggingface.co/api/models/zai-org/GLM-5), [GLM-5.2](https://huggingface.co/api/models/zai-org/GLM-5.2), [GLM-5.3](https://huggingface.co/api/models/zai-org/GLM-5.3), [GLM-5.3-Flash](https://huggingface.co/api/models/zai-org/GLM-5.3-Flash), [GLM-4.5V](https://huggingface.co/api/models/zai-org/GLM-4.5V)
- **Kimi (Moonshot)**:
  - K2-Instruct-0905, K2-Thinking, K2.5, K2.6 and **K2.7-Code** (2026-06-11) are "modified-mit" (~1.03T).
  - The K2.6 licence adds one condition: products with more than 100M MAU or more than USD 20M monthly revenue must "prominently display 'Kimi K2.6'".
  - **Kimi-K3** (2026-06-13, ~2.78T) uses the custom licence `kimi-k3`.
  - Sources: [K2.6 LICENSE](https://huggingface.co/moonshotai/Kimi-K2.6/raw/main/LICENSE), [HF K2.7-Code](https://huggingface.co/api/models/moonshotai/Kimi-K2.7-Code), [HF K3](https://huggingface.co/api/models/moonshotai/Kimi-K3)
- **gpt-oss-120b** (~117B) and **gpt-oss-20b** (~21B) are apache-2.0, 2025-08-04 — [HF](https://huggingface.co/api/models/openai/gpt-oss-120b)
- **Mistral**:
  - Devstral-Small-2507 (~23.6B) and **Devstral-Small-2-24B-Instruct-2512** are apache-2.0.
  - **Devstral-2-123B-Instruct-2512** is "other" (non-Apache).
  - **Mistral-Small-4-119B-2603** is apache-2.0.
  - Sources: [HF Devstral Small 2](https://huggingface.co/api/models/mistralai/Devstral-Small-2-24B-Instruct-2512), [HF Devstral 2](https://huggingface.co/api/models/mistralai/Devstral-2-123B-Instruct-2512), [HF Mistral Small 4](https://huggingface.co/api/models/mistralai/Mistral-Small-4-119B-2603)
- **MiniMax-M2** is modified-mit (~229B). **Tencent Hy4-preview** is apache-2.0 (~780B, 2026-08-27) — [HF MiniMax-M2](https://huggingface.co/api/models/MiniMaxAI/MiniMax-M2), [HF Hy4](https://huggingface.co/api/models/tencent/Hy4-preview)

**VLM critics (open):**
- **Qwen3-VL-235B-A22B, 30B-A3B and 8B** are all apache-2.0 (Sep–Oct 2025) — [HF 8B](https://huggingface.co/api/models/Qwen/Qwen3-VL-8B-Instruct), [HF 30B](https://huggingface.co/api/models/Qwen/Qwen3-VL-30B-A3B-Instruct)
- **InternVL3.5-241B-A28B** is apache-2.0 — [HF](https://huggingface.co/api/models/OpenGVLab/InternVL3_5-241B-A28B)

**Verification patterns in the literature:**
- A VLM critic on rendered output is used by Code2Video (visual anchor prompts), SceneCraft (render review) and BlenderAlchemy (state evaluator) — see Section 3 sources.
- Retrieval over API docs (LL3M BlenderRAG) addresses the dominant failure, API hallucination (TheoremExplainAgent) — see Section 3 sources.

### Inferences
- **Self-hosting tiers.**
  - Single node (1–2 GPUs): **Qwen3.8-27B** (Apache, dense, coder and VLM critic in one), **Qwen3-Coder-30B-A3B**, **Devstral-Small-2-24B** or **gpt-oss-20b**.
  - One 8-GPU node: **gpt-oss-120b**, **Qwen3-Coder-Next (~80B)**, **GLM-5.3-Flash (MIT, multimodal)** or **DeepSeek-V4-Flash (MIT)**.
  - Multi-node: GLM-5.x and DeepSeek-V4-Pro.
- **Licence ranking for commercial use.** Apache and MIT come first. Kimi's modified MIT is effectively permissive at our scale. Read the new custom licences (Qwen community, GLM-5.3, Kimi-K3) before use.
- **Verification stack** (cheap → expensive):
  1. JSON-schema and type validation of the shot DSL.
  2. Static lint of any Python or TS, plus an API allow-list.
  3. Dry-run render at low resolution.
  4. Programmatic checks on render passes. Examples: the luminance histogram stays in a near-monochrome band; the light position stays in frame; a deity-face mask region never exceeds N px, via an object-ID pass; the safe area for 9:16 captions is clear.
  5. A VLM critic (Qwen3-VL-8B or Qwen3.8-27B) scoring keyframes against a style rubric and the shot's cited content.
  6. Human approval.
  
  Steps 1–4 are deterministic, and that matters more than the VLM.
- **Which model is best.** For our use, the best "coder" is probably less important than how narrow the DSL is. A 24–30B model with schema-constrained decoding likely suffices for DSL authoring.

### Gaps
- No benchmark specific to Blender, Manim or Motion Canvas code generation comparing these 2026 open models was found. "Best at bpy" is unverified.
- The custom licence texts for Qwen3.8-Flash-Next (`qwen-community-1.0`), GLM-5.3, Kimi-K3 and Devstral-2-123B were not read.
- DeepSeek-V4.1-Flash's parameter count from HF metadata looks anomalous and is unverified.
- No studies were found quantifying how reliable a VLM critic is at judging "stone relief / oil lamp" style adherence.

---

## 5. Hybrid: procedural layout, depth or pose pass, then an open video diffusion stylisation

### Takeaway
Mature, **Apache-2.0** depth, pose, canny and camera-conditioned video models exist: Wan2.1-VACE-14B, Wan2.2-Fun-A14B-Control, Wan2.2-Fun-Control-Camera, Wan2.2-VACE-Fun-A14B and Wan2.2-Animate-2. They can stylise a deterministic Blender depth/normal pass.

**LTX-2 / 2.5** have depth-control IC-LoRAs and camera LoRAs, but use a community licence: entities with USD 10M or more annual revenue need a paid commercial licence. The diffusion output itself is not deterministic across hardware or software versions, so it must be cached as an asset, not regenerated.

### Cited Findings
- **Wan2.2** code is Apache-2.0. Wan2.2-T2V-A14B and **Wan2.1-VACE-14B** (~17.3B) weights are apache-2.0 — [Wan2.2 LICENSE](https://raw.githubusercontent.com/Wan-Video/Wan2.2/main/LICENSE.txt), [HF VACE-14B](https://huggingface.co/api/models/Wan-AI/Wan2.1-VACE-14B)
- **Wan2.2-Fun (Alibaba PAI, VideoX-Fun)**:
  - `Wan2.2-Fun-A14B-Control` (apache-2.0) supports "Canny, Depth, Pose, MLSD, etc., and trajectory control", at 512/768/1024, 81 frames, 16 fps.
  - `Wan2.2-Fun-A14B-Control-Camera` (apache-2.0) is camera-lens control.
  - The 5B Control and Control-Camera variants run 121 frames at 24 fps.
  - `Wan2.2-VACE-Fun-A14B` supports Canny, Depth, Pose, MLSD and trajectory, plus subject reference.
  - Sources: [VideoX-Fun README](https://raw.githubusercontent.com/aigc-apps/VideoX-Fun/main/README.md), [HF Control](https://huggingface.co/api/models/alibaba-pai/Wan2.2-Fun-A14B-Control), [HF Control-Camera](https://huggingface.co/api/models/alibaba-pai/Wan2.2-Fun-A14B-Control-Camera)
- **Wan2.2-Animate-2-14B** (2026-07-14) is apache-2.0 — [HF](https://huggingface.co/api/models/Wan-AI/Wan2.2-Animate-2-14B)
- **VACE (ali-vilab)**. VACE-Wan2.1-1.3B-Preview is Apache-2.0. **VACE-LTX-Video-0.9 is RAIL-M** — [VACE README](https://raw.githubusercontent.com/ali-vilab/VACE/main/README.md)
- **LTX**:
  - `LTX-2` (~18.9B, 2026-01-03) uses the "ltx-2-community-license-agreement". "Entities with annual revenues of at least $10,000,000" must obtain a paid commercial licence.
  - `LTX-2.5` (2026-07-23) uses the "ltx-2.x-community-license-agreement".
  - Lightricks published `LTX-2-19b-IC-LoRA-Depth-Control` and camera-control LoRAs (dolly in/out/left/right, jib up/down, static), plus LTX-2.5 IC-LoRAs including "Layout-To-Render".
  - Sources: [LTX-2 LICENSE](https://huggingface.co/Lightricks/LTX-2/raw/main/LICENSE), [HF LTX-2.5](https://huggingface.co/api/models/Lightricks/LTX-2.5), [Lightricks listing](https://huggingface.co/api/models?author=Lightricks&search=Depth)
- **LTX-Video (older)** code is Apache-2.0, but the HF weights licence is "other" — [LICENSE](https://raw.githubusercontent.com/Lightricks/LTX-Video/main/LICENSE), [HF](https://huggingface.co/api/models/Lightricks/LTX-Video)
- **HunyuanVideo-1.5** uses the Tencent Hunyuan community licence (same territorial-exclusion family as Hunyuan3D) — [HF](https://huggingface.co/api/models/tencent/HunyuanVideo-1.5)

### Inferences
- **Hybrid recipe.**
  1. Blender (or WebGL) renders the shot **deterministically**: beauty, depth, normal, object-ID mask and camera JSON.
  2. Wan2.2-Fun-Control or VACE-Fun, conditioned on depth (and the camera trajectory), stylises the shot into richer "weathered stone with lamp flicker" texture.
  3. A fixed seed and a pinned model hash give *practical* but not bit-exact reproducibility, so the output video is stored content-addressed.
  4. The deterministic beauty render remains the fallback and the audit reference.
- **What the hybrid adds.** It mostly adds micro-detail: grain, erosion, soot, organic lamp flicker. Composition, figure scale, camera, "no deity faces" (enforce via the ID mask and post-check) and citations all stay governed by code.
- **Format limits.** Wan's 81-frame, 16 fps native length is about 5 s, and 9:16 at 512–1024 px is achievable. Longer shots need chunking or overlap.

### Gaps
- No evidence was found on how faithfully Wan-Fun depth control preserves a *relief's* fine height detail versus hallucinating new carving.
- I did not verify that the full LTX-2.x licence text has no other restrictions, such as an acceptable-use policy.
- Whether ComfyUI-WanVideoWrapper or ComfyUI headless API workflows are licence-clean was not checked.

---

## 6. How to store it: scene-graph formats, versioning, caching

### Takeaway
Store **intent as small text** (a shot DSL in JSON or YAML, with citation IDs) plus **compiler code**, pinned by version. Use **OpenTimelineIO (Apache-2.0)** for the edit or timeline. Use **glTF** or **OpenUSD** for geometry and camera interchange; OpenUSD is under the Tomorrow Open Source Technology License (TOST-1.0), Apache-derived. Use Blender `.blend` only as a build artefact. Content-addressed caching keyed on hash(DSL + compiler version + asset hashes + renderer version) gives reproducible, diffable re-renders.

### Cited Findings
- **OpenTimelineIO** 0.18.1 is Apache-2.0 — [PyPI](https://pypi.org/pypi/opentimelineio/json), [LICENSE](https://raw.githubusercontent.com/AcademySoftwareFoundation/OpenTimelineIO/main/LICENSE.txt)
- **OpenUSD.** `usd-core` 26.8 on PyPI declares `LicenseRef-TOST-1.0`. The repo LICENSE notes "The Tomorrow Open Source Technology License 1.0 differs from the…" (original Apache 2.0) — [PyPI usd-core](https://pypi.org/pypi/usd-core/json), [OpenUSD LICENSE.txt](https://raw.githubusercontent.com/PixarAnimationStudios/OpenUSD/release/LICENSE.txt)
- **bpy** 5.2.2 on PyPI lets Blender run as an importable Python module (GPL-3.0) — [PyPI](https://pypi.org/pypi/bpy/json)
- **Theatre.js core** (Apache-2.0) stores animation as serialisable state for playback — [npm](https://registry.npmjs.org/@theatre/core/latest)

### Inferences
- **Proposed repo layout** (design suggestion, not sourced):
  - `chapters/<id>/shots/<nn>.shot.yaml` holds the DSL: camera spline, light keyframes, relief asset refs, duration, caption keys and `citations: [MBh-CE x.y.z]`.
  - `assets/reliefs/<hash>/` holds the height-map PNG/EXR, generator script and provenance.
  - `compiler/` holds the DSL → bpy and DSL → three.js compilers.
  - `timeline.otio` holds the edit.
  - Renders go to object storage keyed by `sha256(shot.yaml ‖ compiler@git-sha ‖ asset hashes ‖ blender version ‖ locale ‖ aspect)`.
- **Same DSL for web.** One DSL can target Blender (film) and three.js/R3F (web experiences and the KMP app via WebView), so interactive and video share a source of truth. glTF export from Blender bridges the two.
- **Frame-level audit.** Store a per-frame sidecar (JSON or EXR metadata) mapping frame ranges to shot ID and citation IDs. OTIO clip metadata can carry citation IDs too.
- **Diffing.** Textual diffs of DSL files are meaningful to reviewers. Image diffs (SSIM or perceptual hash) of low-res proxy renders in CI catch unintended visual regressions.

### Gaps
- The full TOST-1.0 terms (how they differ from Apache-2.0) were not read.
- No source was found on an established "content-addressed render cache" tool for Blender. Options would be generic tools (DVC, Bazel, Nix) or a custom solution, and none was evaluated here.

---

## 7. Recommended "code → video" pipeline for the stone-relief style, and where diffusion still wins

### Takeaway
The style is close to ideal for a **deterministic Blender path**. A carved relief is a height field on a plane, lit by one animated, flickering point light, with slow camera moves, near-monochrome grading and no faces. LLMs should author a **narrow, validated shot DSL** rather than raw `bpy`. Diffusion is an optional, cached "texture and life" pass on top of deterministic depth and ID renders, never the source of truth.

### Cited Findings
- The "constrained code + execute + VLM critic" loop is the pattern that works in published systems (Code2Video, SceneCraft, BlenderAlchemy, LL3M), and API hallucination is the dominant failure in free-form code (TheoremExplainAgent) — sources in Section 3.
- Licence-clean components:
  - Blender (GPL; renders unencumbered).
  - MoGe-2 (MIT), DA3MONO-LARGE (Apache) and Marigold v1.1 (OpenRAIL++) for depth and normals.
  - TRELLIS.2 (MIT) and TripoSR (MIT) for props.
  - Wan2.2-Fun-Control and VACE (Apache) for the optional stylisation.
  - Motion Canvas/Revideo (MIT) for typographic or 2D overlays.
  - OTIO (Apache) for the timeline.
  - Qwen3-Coder, Qwen3.8-27B and Qwen3-VL (Apache), plus GLM-5.x and DeepSeek-V4 (MIT), as authoring and critic models.
  - Sources in Sections 1–5.
- Components to avoid or treat with caution for commercial use:
  - Remotion (company licence over 3 employees).
  - DA-V2-Base/Large and DA3-Large/Giant (CC-BY-NC).
  - Hunyuan3D and HunyuanVideo (EU/UK/KR exclusion).
  - Stable Fast 3D (USD 1M revenue cap).
  - LTX-2.x (USD 10M revenue cap).
  - DepthFlow/ShaderFlow and Theatre Studio (AGPL).
  - Depth Pro (Apple custom).
  - Sources in Sections 1, 2 and 5.

### Inferences (recommended architecture)
1. **Script → shot spec (LLM).** From the cited script, an open LLM fills a strict `shot.yaml` schema per shot (~13 per chapter), using schema-constrained decoding. Candidate models are Qwen3.8-27B, Qwen3-Coder-30B or Devstral-Small-2 locally, or GLM-5.2 or DeepSeek-V4-Flash for harder planning.
   - Shot fields: relief panel ID(s), figure placement on a 2D grid, camera move preset plus parameters (dolly or truck along the wall, push-in), lamp path and flicker seed, duration, caption and VO keys, citation IDs, and a `deity_present` flag.
2. **Relief assets (procedural first, ML second).**
   - (a) Hand-designed or LLM-written SVG line art for figures in medium-wide silhouette. It is converted to a height field by distance-transform "pillowing" plus bevels, with chisel-noise Geometry Nodes added. This is deterministic, versioned code.
   - (b) Optionally, a generated or illustrated panel is turned into depth with MoGe-2 or DA3MONO and cleaned, then frozen as an EXR asset with provenance.
   - (c) Props come from TRELLIS.2 or TripoSR, baked into relief by orthographic depth capture.
   - Deity figures are authored with no facial detail (smoothed or occluded head region), and that region is tagged in the object-ID pass.
3. **Compile and render.** A tested Python compiler maps `shot.yaml` to a `bpy` scene:
   - A subdivided plane with displacement and a stone PBR material.
   - One point light with flicker as a seeded noise curve, plus a faint ambient term.
   - Vertical 1080×1920 framing.
   - Render with **Cycles** (headless-safe; seed and samples fixed, denoiser pinned) or EEVEE if EGL headless proves stable on our GPUs.
   - Output beauty, depth, normal and object-ID passes.
   - Because the camera and light are code, the same shot re-renders at 16:9 or 1:1 with a different framing preset. Captions and VO are swapped per language in the compositing layer: FFmpeg, MoviePy or a Motion Canvas/Revideo overlay. The 3D render does not change.
4. **Verification gates.**
   - Schema check.
   - Low-res proxy render.
   - Automated checks: luminance and saturation band, light-in-frame, ID-mask check that no deity face region is visible beyond a threshold, caption safe-zone.
   - A VLM rubric check (Qwen3-VL-8B or Qwen3.8-27B) comparing the frame to the shot description.
   - Human sign-off.
   - Then the final render.
5. **Assemble.** Shots go into an OTIO timeline, then FFmpeg for the encode. A per-frame citation sidecar is written alongside.
6. **Cache and version.** Everything is in git. Renders are keyed by content hash in object storage, so CI re-renders only changed shots.
7. **Reuse for web and app.** Export relief meshes or height maps and camera paths to glTF and JSON. A three.js/R3F viewer reuses them in the interactive experiences (lineage explorer, chakravyūha) and in the KMP app via WebView. The light-flicker model is a small GLSL shader shared across both.

**Where diffusion still beats this path** (inference):
- Organic, non-rigid motion of figures: a drawn bow, fluttering cloth, a horse's gait, flames, smoke, water, crowds. Animating carved figures procedurally means rigging or 2D deformation, which is expensive. A depth- or pose-conditioned Wan2.2-Fun or VACE pass can add plausible motion.
- Rich surface weathering, soot staining and photographic "real temple" texture variety without a large hand-made material library.
- Rapid look-dev for new panels, by generating reference images that are then converted to height fields.
- Live-action or "real" establishing shots: landscapes, rivers, Kurukshetra at dusk, if ever needed.

In each case, keep diffusion output as a **frozen, hashed asset** tied to the deterministic depth and ID pass and the shot's citations, so the audit trail survives.

### Gaps
- No public example of an end-to-end "stone relief + point light" procedural video pipeline was found, so the recommendation is an engineering synthesis, not a proven reference implementation.
- Render-time and GPU-cost estimates for a 13-shot, 2-minute 9:16 chapter in Cycles versus EEVEE were not measured or sourced.
- The quality of open VLMs as automated judges of "no deity face visible" was not evaluated; the ID-mask check is the deterministic backstop.
