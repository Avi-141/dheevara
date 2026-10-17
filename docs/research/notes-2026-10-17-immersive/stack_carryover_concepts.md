# Immersive carry-over: how Dheevara's stack and content move to glasses, AR, VR and holographic displays (as of 2026-10-17)

Scope note: about 19 search/fetch calls plus repo reading. The primary sources are Apple's RealityKit docs (`GaussianSplatComponent`), Meta's Wearables Device Access Toolkit display docs, Google's Android XR developer blog and Jetpack XR docs and release notes, Meta's Horizon locomotion design guides, the W3C XAUR note, Looking Glass docs and its store page, and Google's Omnitone repo. Spark XR performance, Quest WebXR splat budgets, Apple PHASE, the Meta Audio SDK, and Ray-Ban open-ear binaural rendering come from secondary sources or could not be checked at all; those are flagged or listed under Gaps.

Repo context I read: `design/style-bible.md` (§6 witness vantages, §7 faces, §11 sound), `docs/overview.md` (five beats, three-layer reveal, nine rules, "longer arc" immersive track: in-app depth at month 6, walkable set piece at month 12, temple/museum venue build at month 18), `docs/architecture/temporal-knowledge-graph.md` §2 (story clock, tellings; witness allowlist to become "entities with `can_witness = true`"), `src/contract/rules.mjs` (`REVERED` list of 19, `MANDATORY_FORBIDDEN`, `CLOSER_THAN_MEDIUM_WIDE`), `schema/shot-contract.schema.json` (framing/move/height enums, witness enum). The app (`origin/claude/app-a2-ui`, `apps/dheevara/shared/ui/build.gradle.kts`) uses the Compose Multiplatform plugin with Android, iOS and desktop-JVM targets.

## 1. Technical carry-over: splats, spatial audio, holographic output, Compose UI

### Takeaway
The splat-world, GLB, claim and chant assets carry over almost unchanged. What changes is the runtime budget:
- **Quest standalone WebXR** is the tightest at roughly 100k–400k splats, from community reports.
- **Apple** shipped native Gaussian splats in RealityKit, but in the **27** OS releases (visionOS/iOS/macOS 27), not visionOS 26. RealityKit does not load splat files itself: you parse PLY yourself and it enforces an internal splat cap.
- **Android XR** hosts our Compose UI as `SpatialPanel`s and loads glTF natively, but I found no native splat API.

Spatial audio is solved on every platform: AmbiX ambisonics on Android XR (orders 1–3), and Omnitone/Resonance on the web.

For Looking Glass, render quilts (11×6 views on the Go) straight from Blender. That is a deterministic camera-array render of the same relief scenes the video pipeline already uses.

### Cited Findings
**Gaussian splats: Apple (visionOS / iOS 27)**
- RealityKit `GaussianSplatComponent` availability is "iOS 27.0.0 –, iPadOS 27, macCatalyst 27, macOS 27, visionOS 27.0.0 –". — [Apple: GaussianSplatComponent](https://developer.apple.com/documentation/realitykit/gaussiansplatcomponent.md)
- The feature was presented at WWDC26 session 279, "Explore advances in RealityKit". — [WWDC26 279](https://developer.apple.com/videos/play/wwdc2026/279)
- I found no source saying visionOS 26 has a native splat API.
- How it renders:
  - Each splat is drawn as an ellipsoid in the transparency pass, blended back to front, with no developer-visible shaders.
  - "Scene lighting doesn't affect a Gaussian splat asset": the colour is baked from capture.
  - It needs the Apple7 GPU family.
  - Source: [Apple: GaussianSplatComponent](https://developer.apple.com/documentation/realitykit/gaussiansplatcomponent.md)
- Loading and limits:
  - "The framework doesn't load files directly, so you parse your source format — PLY, USD, or any other container — and populate the buffers yourself."
  - Initially only `GaussianSplatResource.BufferResource` is supported. Properties are position, scale, rotation, opacity and SH, in float or half.
  - "The framework enforces an internal limit on the total number of splats", and the initializer throws if you exceed it. Apple's advice is to prune splats and cull low-opacity ones.
  - Source: [Apple: GaussianSplatComponent](https://developer.apple.com/documentation/realitykit/gaussiansplatcomponent.md)
- An Apple Developer Forums commenter says the sample uses a non-standard PLY variant and that a budget of roughly 200,000 splats is restrictive. Splats co-exist and sort correctly with meshes. This is a forum observation, not an official limit. — [Apple Developer Forums 831696](https://developer.apple.com/forums/thread/831696)

**Gaussian splats: Quest and WebXR**
- Spark runs "in any web browser (desktop, mobile, and WebXR)" on WebGL2. — [Spark docs](https://sparkjs.dev/docs/overview/); [Spark GitHub](https://github.com/sparkjsdev/spark)
- Spark 2.0 has LoD splat trees and paging with a fixed GPU pool (default 16M splats), and a per-frame budget of 500K–2.5M depending on device. — [World Labs: Spark 2.0](https://www.worldlabs.ai/blog/spark-2.0) (via 3d_worlds.md)
- I found no Spark-on-Quest or Spark-on-Vision-Pro benchmark.
- A competing project's paper measured Spark at about 177 ms/frame on a 6M-Gaussian scene on desktop, which it attributes to a CPU-side bottleneck, against about 2 ms for its own WebGPU renderer. Treat this with caution: it is self-reported by a competitor. — [Visionary, arXiv 2512.08478](https://arxiv.org/pdf/2512.08478)
- Quest 3 budgets reported by the community:
  - A native Unity project reports 72 fps "stable until around 400k Gaussians". It is experimental and unmaintained. — [Unity-VR-Gaussian-Splatting](https://github.com/ninjamode/Unity-VR-Gaussian-Splatting)
  - A Babylon.js WebXR developer reports that above about 100k splats "starts becoming unusable", with 400k at about 10–18 fps. — [Babylon forum](https://forum.babylonjs.com/t/the-future-of-gs-in-bbl/60666?page=2)
  - VRSplat exceeds 72 fps on Quest 3, but only tethered to an RTX 4090. — [arXiv 2505.10144](https://arxiv.org/html/2505.10144v1)
  - An editorial puts the standalone ceiling at "a few hundred thousand". — [vr.org, Jul 2026](https://vr.org/articles/gaussian-splatting-vr-siggraph-2026)

**Android XR (Jetpack XR, SceneCore, Compose for XR)**
- Compose for XR building blocks:
  - `Subspace` creates an independent spatial UI hierarchy.
  - `SpatialPanel` displays app content.
  - `Volume` places SceneCore entities (3D models) relative to the UI.
  - `PlanarEmbeddedSubspace` lets 2D and spatial layouts coexist.
  - Source: [Develop spatial UI with Jetpack Compose for XR](https://developer.android.com/develop/xr/jetpack-xr-sdk/ui-compose)
- glTF support:
  - `SpatialGltfModel` arrived in 1.0.0-alpha13, and you can query animations and nodes.
  - alpha14 (19 May 2026) moved loading into `SpatialGltfModelState` and renamed `AnchorEntity` to `AnchorSpace`.
  - The library is still alpha.
  - Source: [Compose for XR release notes](https://developer.android.com/jetpack/androidx/releases/xr-compose)
- No source mentions a native Gaussian splat component in SceneCore. See Gaps.

**Spatial audio**
- Android XR (SceneCore):
  - `PointSourceParams` attaches a sound to an Entity, whose pose sets the source position.
  - Playback goes through `SpatialSoundPool` (short clips under 1 MB) or `SpatialMediaPlayer.setPointSourceParams`, gated on the `SPATIAL_AUDIO` capability.
  - AmbiX ambisonics is supported at orders 1–3, as Opus (.ogg) or PCM WAV.
  - Source: [Android XR: Add spatial audio](https://developer.android.com/develop/xr/jetpack-xr-sdk/add-spatial-audio)
- Web:
  - Omnitone (Google, Apache-2.0) decodes FOA and HOA (2nd/3rd order) ambisonics to binaural in Web Audio, using virtual speakers with HRTF convolution. Head orientation can rotate the field.
  - It is the foundation of Resonance Audio for the web.
  - Its maintenance status is "unclear" per one directory.
  - Sources: [Omnitone GitHub](https://github.com/GoogleChrome/omnitone); [npm](https://www.npmjs.com/package/omnitone); [Google OSS blog](https://opensource.googleblog.com/2016/07/omnitone-spatial-audio-on-web.html)

**Holographic (Looking Glass)**
- The Looking Glass Go quilt is 11 columns × 6 rows at 4092×4092, recommended for real-time. View 0 (bottom-left) is the leftmost view. — [Looking Glass docs: quilts](https://lfdocs.lookingglassfactory.com/keyconcepts/quilts)
- The Blender add-on previews in the viewport with Eevee and renders full-quality quilts in Eevee or Cycles. It needs Looking Glass Bridge. — [Looking Glass software overview](https://lfdocs.lookingglassfactory.com/software/overview)
- There is a WebXR/three.js path in the docs, but I did not read its content. — [Looking Glass dev tools](https://docs.lookingglassfactory.com/developer-tools/index-2)
- Go hardware:
  - 6", 1440×2560, 58° view cone, up to 100 views, 60 Hz.
  - Wi-Fi and Bluetooth, USB-C power or an optional battery (about 2 h).
  - No speaker, but a 3.5 mm jack.
  - Supports Unity, Unreal, Blender and WebXR.
  - Sources: [mixed-news review](https://mixed-news.com/en/looking-glass-go-review/); [etcentric](https://www.etcentric.org/looking-glass-readies-launch-of-mobile-holographic-display/)
- Price:
  - It launched at $299. [TechCrunch, Aug 2024](https://techcrunch.com/2024/08/08/looking-glass-new-lineup-includes-a-300-phone-sized-holographic-display/)
  - Its checkout page now shows $299 regular, a $99 sale price, and "sold out". [Looking Glass store](https://checkout.lookingglassfactory.com/products/looking-glass-go)
  - Availability and the current price are uncertain.
- A reviewer called it "an expensive gimmick, at least in its current form" and reported app crashes. — [mixed-news](https://mixed-news.com/en/looking-glass-go-review/)

### Inferences
- **One master asset, several decimations.**
  - Keep the Marble PLY master in our bucket (per 3d_worlds.md).
  - Derive per-target files: phone web at about 300–500K SH0 (3d_worlds.md), Quest WebXR at **≤150K** SH0 with Spark LoD and a low budget, visionOS/iOS 27 at **≤200K** pending measurement (the forum figure), as a half-float buffer we pack ourselves.
  - Add a `targets` block to a new `world` manifest, and write a ledger row per conversion, even at $0. Every provider call stays covered by Rule 3.
- **Baked light suits our look.** Apple splats ignore scene lighting, and so do Spark splats unless shaded. Our look is "one oil lamp", so the world should be generated with the lamp light baked in. The lamp flicker (±3%, style bible §3) then has to be a post or tint effect, or applied to the GLB props only.
- **Native splats on iPhone.** iOS 27 also lists the component. The iOS app could later render splats natively without a WebView, which changes the Compose Multiplatform plan (3d_worlds.md assumed a WebView). This is unverified on device.
- **Chant audio.** Vāgdhenu's output is mono or stereo. Spatialise it as one point source at the leaf or lamp, not as a sound field, so the chant "sits alone" (style bible §11). Use an AmbiX first-order bed only for the tanpura and battlefield ambience. The same stems serve the web (Omnitone) and Android XR (`SpatialMediaPlayer`).
- **Hosting our UI.** The Compose Multiplatform design system (Geist, `Colors.kt`, reveal sheet) should port to Android XR `SpatialPanel` with mostly layout changes, because Compose for XR is Jetpack Compose. Glimmer (glasses) is a separate design language, so the glasses UI is a new, tiny surface rather than a port. On visionOS, Compose Multiplatform has no spatial API that I found: native SwiftUI/RealityKit or WebXR in Safari.
- **Looking Glass from relief scenes.** A Blender camera-array render of a relief macro shot from the "hidden detail" beat already exists in the pipeline's world. Render it as a quilt of 66 views. The parallax range sits within the 58° cone, so the viewer can never see a deity's face from an angle the shot contract didn't approve; check each of the 66 cameras against the contract.

### Gaps
- No primary Quest 3 / Quest 3S WebXR splat benchmark, and no Spark-in-XR numbers. Measure them ourselves.
- No visionOS 26 splat API found. Whether visionOS 27 has shipped publicly as of Oct 2026 was not confirmed; the docs list it as available.
- The Apple internal splat cap value is not documented; it is a forum estimate.
- Android XR native splat support: not found. Fallback: a WebXR page in Chrome on Android XR (not verified), or a GLB mesh export (Marble $2.80/world, per 3d_worlds.md).
- Not fetched: Apple PHASE and visionOS ambisonics specifics, the Meta Audio SDK, Resonance Audio's current maintenance, and Looking Glass three.js page content and Bridge web status.
- No source on binaural rendering through Ray-Ban Meta open-ear speakers. Open-ear speakers leak sound and have weak bass; that is my expectation, unverified.

## 2. Witness point of view in 6DoF: locomotion, comfort, precedents, and enforcing "no deity face close"

### Takeaway
The precedents and Meta's own guidance both support **fixed or node-based vantages**. Seated or standing in place, the scene changes around you (Wolves in the Walls). Diorama scale that you lean into (Gloomy Eyes). Teleport between nodes and snap turn by default, with a vignette only for optional slide.

That maps directly to our named witnesses: Sañjaya's elevated far vantage, the charioteer's platform, the vānara's mountain ledge. "Never close to a deity's face" becomes enforceable in code as geometry:
- a per-figure **keep-out volume** (a sphere or capsule around the head) that the head pose can never enter;
- a **minimum angular-size cap** on any `REVERED` figure's face;
- a **silhouette/LOD swap** that removes facial detail at any distance;
- a test that samples every allowed vantage.

### Cited Findings
- Meta's locomotion best practices (updated Dec 2025):
  - Offer customizable locomotion with comfort tiers.
  - Smooth turning is opt-in, and acceleration should be brief and infrequent.
  - Use teleport nodes instead of continuous movement on slopes and stairs.
  - Darken the screen edges during movement, and use spatial audio cues in transitions.
  - Source: [Meta: Locomotion best practices](https://developers.meta.com/horizon/design/locomotion-best-practices/)
- "Teleports and snap turns create camera discontinuities that can disorient players, especially when the facing direction changes after a jump." — [Meta: Locomotion comfort & usability](https://developers.meta.com/horizon/design/locomotion-comfort-usability/)
- Meta's IWSDK (WebXR) defaults:
  - New users start on teleport and snap turn; slide is an option.
  - The vignette `comfortAssist` is commonly 0.4–0.6, and max speed about 4–6 m/s.
  - The vignette shows only while moving.
  - Source: [IWSDK locomotion: slide](https://developers.meta.com/horizon/documentation/iwsdk/concepts/locomotion/slide/)
- The Unity ISDK `LocomotionTunneling` draws the vignette around the user's point of view rather than as a fixed UV radius. — [Meta Unity ISDK comfort](https://developers.meta.com/horizon/documentation/unity/unity-isdk-locomotion-comfort/)
- *Wolves in the Walls* began at Oculus Story Studio and was finished by Fable Studio, not Felix & Paul.
  - The character Lucy "talks to us, looks at us, acknowledges our presence".
  - "You move in the experience, but actually, you stay fixed in space with your real body", which avoids sickness and stumbling.
  - Sources: [Skarredghost review](https://skarredghost.com/2019/04/26/wolves-in-the-walls-review-vr/); [Voices of VR #731](https://voicesofvr.com/?p=5891)
- *Gloomy Eyes* (3dar and Atlas V, with Ryot, ARTE France and HTC Vive; Sundance 2019 New Frontier):
  - It "plays out in diorama-sized scenes you can lean into".
  - It is narrated by Colin Farrell (EN) and in other languages by Tahar Rahim (FR), Max Riemelt (DE), Jorge Drexler (ES) and Jam Hsiao (ZH).
  - Sources: [UploadVR](https://uploadvr.com/colin-farrell-vr-gloomy-eyes/); [Animation Magazine](https://animationmagazine.net/2020/06/arte-vr-animation-gloomy-eyes-out-now-on-oculus-quest)

### Inferences
- **Witness rigs are data.** Extend the shot contract with an optional `vantage` block for immersive targets:
  ```
  { kind: fixed|nodes|diorama,
    nodes: [{id, pos, yawRange, heightM}],
    roomScaleRadiusM: 0.5,
    scale: life|diorama|kite }
  ```
  `kind` follows the witness: `sanjaya` → `diorama` or `kite` (the war as a table-top relief seen from above, which also fits "divine sight"); `charioteer` → `fixed` on the platform with yaw limits ("looking where he looks, never at his face"); `vanara` → `nodes` on the Mahendra ledge, low, sky-wide.
- **Room-scale drift.** Room-scale movement is clamped by a radius (for example 0.5 m). Beyond it the view fades to the oil-lamp black, which is also our comfort vignette colour. That is better than a hard wall.
- **Diorama scale for Sañjaya.** Diorama scale (Gloomy Eyes) is the safest default for the Sañjaya season. Figures are small, so a "face close-up" requires putting your head inside the table, and the keep-out volume catches that. It also suits passthrough AR on a tabletop.
- **Rule 1 in code** (mirrors `src/contract/rules.mjs`):
  - **Keep-out.** Every entity whose canon id is in `REVERED` gets a `keepOut` capsule. Its default radius is set so that, from its boundary, the face subtends less than the angular size of a "medium-wide" framing (needs calibration). The runtime clamps head and camera position outside the capsule and fades to black on entry. CI samples each allowed vantage node, plus the room-scale radius, and asserts that no sample's frustum shows a revered face above the size threshold.
  - **Attribute-only.** Revered figures ship as silhouette or relief LOD with no modelled face geometry at any LOD (the "full figure, at a distance, or through an attribute" rule). The asset bible marks `faceDetail: none` for `REVERED`, and a GLB lint fails any revered asset whose head mesh exceeds N triangles.
  - **No POV inside.** `pov_inside_deity` becomes "no vantage node inside, or attached to, a revered entity's transform". That is a parent-chain check, which matters for the charioteer: the vantage is the chariot platform, never the warrior's head (and Kṛṣṇa is himself a charioteer, so his rig must be a figure, never the vantage).
  - **Gaze.** Revered figures never turn their head to the viewer (no Lucy-style acknowledgement). This is a forbidden animation tag.
- **Comfort.** No smooth locomotion at all by default. Scene changes are cuts to black at beat boundaries, using the motion spec durations (700/900 ms) as fade times. Camera motion inside a shot (the 5–10% push) should not move the viewer's head: move the world slowly or not at all. In VR, the style bible's "push in" becomes stillness.

### Gaps
- No Felix & Paul source was fetched, so their fixed-camera 360 practice is not cited. No primary VR comfort research numbers (e.g. motion-sickness incidence) were gathered.
- No published precedent for "keep-out volumes around sacred figures" in VR; this is our own design.
- The angular threshold for "medium-wide" in a headset needs a calibration study.

## 3. Citations in space, XR accessibility, language switching

### Takeaway
W3C's XAUR (a Working Group Note, not a standard) names captioning/subtitle customization (§4.19) and spatial-audio alternatives (§4.17) as user needs. The W3C Immersive Captions CG report gives the 360/XR caption options: distance, size, background box, occlusion avoidance, and off-screen speaker indication. Our existing caption rules (Geist on an 80% night band, amber verse id, real caption track) map onto a **head-locked-lazy caption band with the verse id**. Citations work best as the **leaf**: anchored to the object the claim concerns (the gold accent), revealed by gaze dwell or pinch, opening the three-layer reveal as a `SpatialPanel` or sheet.

### Cited Findings
- XAUR "lists user needs and requirements for people with disabilities when using virtual reality or immersive environments, augmented or mixed reality". It is explicitly not baseline requirements. Its sections include 4.17 "Spatial audio tracks and alternatives" and 4.19 "Captioning, Subtitling and Text: Support and customization". — [W3C XAUR](https://www.w3.org/TR/xaur/)
- The W3C Immersive Captions Community Group published a final report on captions in 360° video. — [W3C CG report](https://www.w3.org/community/reports/immersive-captions/CG-FINAL-360-captions-20240412/)
- Customizable spatial caption options include distance from the speaker, text size, background boxes, preventing occlusion and handling off-screen speakers. "No magical, one-size-fits-all solution." This is W3C's Michael Cooper, interviewed on Voices of VR. — [Voices of VR #1230](https://voicesofvr.com/?p=11829)
- Ray-Ban Display gives apps Text, Image, Button, Icon, FlexBox and Video. The display is 600×600. — [Meta display overview](https://wearables.developer.meta.com/docs/develop/dat/display-overview/)

### Inferences
- **The leaf in space.** Each `claim:` object in a scene (the wheel, a bow, the gate) carries a small amber leaf glyph anchored to it. Amber still means "source and nothing else".
  - Gaze dwell (about 600 ms) or pinch expands it to the cite line ("Droṇa Parva 7.34.19, critical edition").
  - A second action opens the **reveal sheet as a world-anchored panel** at about 1–1.5 m, leaving the scene visible behind it. That matches the 72% sheet cap from the art review.
  - The scene pauses (the 450 ms dim), as on the phone.
  - Every gaze action has a controller or hand-ray equivalent ("every gesture has a button").
- **Captions.** The default is a head-locked band that lags 10–15° below centre, with the verse id under the line in amber. Settings follow XAUR §4.19: size, distance, background opacity. Narration speaker indication is trivial because the narrator is off-scene; the chant caption is Devanagari plus IAST on the leaf panel, in sync with the chant timing already in `manifest.json`.
- **Language switching.** Keep the app's two separate settings, narration language and caption language, in a wrist or palm menu. Ślokas are always the same chanted Sanskrit asset, so switching language never touches Rule 7 audio.
- **Rule 2 in code.** The world manifest's anchors list `claimId`. The build fails if any visible label, caption or hidden detail lacks a resolving claim: reuse the M6 web build step that "fails on unresolved ids".
- **Accessibility parity.** Offer a seated mode (all vantages reachable without standing), a "no motion" mode (all fades become cuts), and audio description of the blocking from the shot contract's `blocking` text, voiced by Bulbul. That last needs a claim per line, or must be marked as non-claim description; the canon rules need a decision on that.

### Gaps
- The XAUR §4.19 and CG report text were not read in full; only titles and an interview summary.
- No source on Indic-script legibility in headsets (minimum angular size for Devanagari or Tamil conjuncts).

## 4. Smart glasses: what the SDKs permit, and witness-walk concepts

### Takeaway
As of Oct 2026, both ecosystems let **a phone app** reach the glasses' camera, mics and speakers. **Meta Ray-Ban Display** opened a developer-preview display in May 2026: 600×600, simple components, MP4 under 70k pixels, whole-screen replace over Bluetooth. **Android XR** offers Jetpack Projected (sensors, speakers, displays) plus Glimmer UI, but its glasses hardware was "upcoming" in the Dec 2025 post.

Neither runs an on-glass app. Meta excludes "Hey Meta" invocation from the toolkit in 2026. So "witness walk" is a phone app that takes camera frames, recognises the frieze, plays chant and narration through the glasses' speakers, and pushes a glanceable caption plus verse id to the display.

### Cited Findings
- **Meta toolkit preview, Dec 2025.** iOS and Android apps get the glasses' camera, mic array and speakers. Display was out of scope at first, but Ray-Ban Display's camera was reachable. — [Auganix](https://www.auganix.org/?p=17923); [UploadVR](https://uploadvr.com/meta-wearables-device-access-toolkit-announced-smart-glasses-sdk); [Road to VR](https://roadtovr.com/meta-ray-ban-smart-glasses-third-party-app-sdk-device-access-toolkit/)
- **Meta display preview, 19 May 2026.** Native Swift or Kotlin with Text, Image, List, Button and Video components. — [Auganix: Meta opens display access](https://www.auganix.org/?p=18402)
- **Display constraints:**
  - The display is 600×600; larger images give no benefit.
  - Video should be under 400 px per side and 70,000 total pixels; keep it short; it plays from an MP4 URL.
  - Each send replaces the whole display.
  - The glasses store no state: the phone app owns it.
  - The system can interrupt the app for calls and notifications.
  - Input is the touchpad and the Meta Neural Band (EMG).
  - The root (L0) view must allow back.
  - It needs Meta AI app v272+, firmware v125+, and Dev Mode.
  - Source: [Meta display overview](https://wearables.developer.meta.com/docs/develop/dat/display-overview/)
- **Other Meta limits.** "Hey Meta"/Meta AI invocations are not in the toolkit in 2026. Mic and speaker come via iOS/Android Bluetooth profiles. Full access is limited to developers in AI-glasses-supported countries. — [Meta wearables FAQ](https://developers.meta.com/wearables/faq) (via search summary; the FAQ was not fetched in full)
- **Android XR glasses:**
  - "extend your existing mobile app to take advantage of the built-in speakers, camera, and microphone on AI glasses".
  - Jetpack Projected bridges phone to glasses (sensors, speakers, displays).
  - Glimmer is the display-glasses UI language.
  - ARCore for Jetpack XR adds motion tracking and geospatial on glasses.
  - An AI Glasses emulator simulates touchpad and voice.
  - Hardware is described as "upcoming", with no date.
  - Source: [Android Developers Blog, Dec 2025](https://android-developers.googleblog.com/2025/12/build-for-ai-glasses-with-android-xr.html)
- **Android XR headsets.** Camera via Camera2/CameraX with user permission. — [Android Authority](https://androidauthority.com/android-xr-camera-access-3526531); [Road to VR](https://roadtovr.com/google-android-xr-passthrough-camera-access/)
- **Android XR hardware news.** XREAL Project Aura is to go on sale before the end of 2026, and an Android XR Developer Catalyst Program offers early hardware (g.co/dev/catalyst). — [9to5Google](https://9to5google.com/?p=715185)
- The style bible names the Hoysaleśvara temple at Halebidu, whose "friezes include the chakravyūha", as a reference wall for the Mahābhārata look. — `design/style-bible.md` §2 (repo)

### Inferences
- **Witness walk at Halebidu (or a museum gallery).**
  1. The user points their head at a frieze panel.
  2. The phone app gets a camera frame and matches it against a small, on-phone panel index (image retrieval over our own reference photos; no cloud model, so no Rule 5 or territory issue).
  3. Output: a 2 s AI disclosure, then the chanted verse (Vāgdhenu file, cached), then the cited narration in the user's language.
  4. On Display models, a glanceable panel shows two caption lines plus the amber verse id. On non-display Ray-Bans, audio only, which is "screen off still works".
  - The frieze is itself a style reference, not a claim about the epic (style bible §2), so narration must say "this panel shows…" plus a cited claim, never assert the carving is the text.
- **Ask the text by voice.** Without "Hey Meta", it has to be a press-to-talk in our app, captured over the Bluetooth mic profile.
  - Sarvam STT, then retrieval over claims only. Answers are assembled from claim statements with their ids (temporal-graph §6.1 "drafting only from cited facts").
  - An LLM at runtime needs an Anthropic or other key in the product. CLAUDE.md says no Anthropic key in the *pipeline*, so this is a new decision for `docs/decisions.md`.
  - The safe first version is retrieval-only: it plays the nearest pre-recorded claim narration, with no generation.
- **Camera privacy at temples.** Many temples restrict photography, so a continuous camera stream may be unwelcome or banned. Use single-frame capture on tap, with no upload, and a "no camera" mode that uses panel numbers or geospatial anchors (ARCore geospatial on Android XR glasses).
- **Rule 7 holds.** Chant is pre-rendered audio. Glasses never run TTS on Sanskrit, and a guard refuses any Devanagari or IAST verse text sent to the narration voice. `src/voice` already refuses verse lines.

### Gaps
- Android XR glasses' camera permission model and the shipping date of display glasses (Samsung/Gentle Monster/Warby Parker) as of Oct 2026 were not confirmed.
- Whether the Meta toolkit allows apps to be published to the public (beyond Dev Mode) by Oct 2026: not confirmed.
- No source on Halebidu photography or device rules, or on ASI policies for AR in protected monuments.
- Ray-Ban open-ear loudness and intelligibility in a noisy temple: no data.

## 5. Holographic: lamp-lit relief in a box; family-telling display

### Takeaway
Looking Glass Go is a 6" light-field display with a 58° view cone and up to 100 views, at about $299 (recent sale and sold-out status uncertain). It is the natural "relief in a box": our look is shallow relief, raking light and one material, which is exactly the content that reads well with limited depth. Content is a Blender-rendered quilt, so it reuses the pipeline's worlds and props with no generative call at playback.

Business and supply risk is real: the reviewer called it a gimmick, and the store shows it sold out.

### Cited Findings
- Go quilt 11×6 at 4092². — [Looking Glass quilts](https://lfdocs.lookingglassfactory.com/keyconcepts/quilts)
- Blender add-on renders quilts in Eevee or Cycles; needs Bridge. — [Looking Glass software](https://lfdocs.lookingglassfactory.com/software/overview)
- Specs, price, no speaker but a 3.5 mm jack, WebXR support. — [mixed-news](https://mixed-news.com/en/looking-glass-go-review/); [Looking Glass store](https://checkout.lookingglassfactory.com/products/looking-glass-go); [TechCrunch](https://techcrunch.com/2024/08/08/looking-glass-new-lineup-includes-a-300-phone-sized-holographic-display/)

### Inferences
- **Lamp-lit relief in a box.**
  - A loop of 5–8 quilt "plates" per chapter: the hidden-detail macro (a wheel lying still, the bow), each with its verse id etched in amber below the relief.
  - The chant plays through a small external speaker on the 3.5 mm jack.
  - In a temple or Bala Vihar setting, a printed QR card opens the reveal on a phone.
  - Light flicker is baked as a short animated quilt sequence (if supported; not verified) or kept still.
- **Holographic family-telling display.**
  - A family records their telling through the app's "Tell our scholar → Another telling" flow.
  - The display shows the relief plate with *their* telling as layer 1 ("What many heard / what our family tells"), the text layer beside it, and the scholar's "reply" when it exists.
  - The family's voice is played, never synthesised.
  - Rule 9: nothing goes public without sign-off. A private family display is not public, but a temple install is, so the device needs a `public: bool` flag that gates on sign-off records.
- **Deity framing in a light field.** All 66 views must satisfy Rule 1, so the QC gate (M3, not built) needs a "multi-view" mode that samples the extreme left, centre and right views. Splats can be rendered in the quilt too (Spark/WebXR), but baked Blender renders are deterministic and auditable, which fits the ledger.

### Gaps
- Looking Glass company health, current Go availability, and bulk or venue pricing: unknown. Larger units (16"/32") pricing was not checked.
- Whether the Go can loop an animated quilt standalone without a host computer or phone: not confirmed.

## 6. Concepts, ranked

Costs below are my estimates unless they cite a source. Provider costs reuse 3d_worlds.md: Marble draft about $0.12–0.20, full world about $1.28–2.48, PLY export free, GLB $2.80, fal props $0.23–0.38 each. Person-weeks assume one engineer who already knows three.js and Compose, plus art-director and scholar time listed separately.

### Takeaway
Ranking by fit to the bet (audio-first path to the 12 Jan 2027 gate, diaspora families, temples and Bala Vihar as channel #2) and by build risk:
1. **Witness diorama (WebXR + phone)**
2. **Witness walk (audio-first glasses and phone)**
3. **Relief in a box (Looking Glass)**
4. **Chariot-platform vantage (Quest/visionOS native)**
5. **Family-telling hologram**
6. **Ask the text (voice)**, last because it needs a new runtime-LLM decision and claim-only retrieval to be safe.

### Cited Findings
- Diorama-scale lean-in narrative works on Quest (Gloomy Eyes on the Quest store). — [Animation Magazine](https://animationmagazine.net/2020/06/arte-vr-animation-gloomy-eyes-out-now-on-oculus-quest)
- Fixed-body narrative avoids sickness (Wolves in the Walls). — [Skarredghost](https://skarredghost.com/2019/04/26/wolves-in-the-walls-review-vr/)
- Teleport and snap are Meta's default recommendations. — [IWSDK](https://developers.meta.com/horizon/documentation/iwsdk/concepts/locomotion/slide/)
- Ray-Ban Display limits. — [Meta display overview](https://wearables.developer.meta.com/docs/develop/dat/display-overview/)
- Android XR glTF in Compose and spatial audio. — [Compose for XR notes](https://developer.android.com/jetpack/androidx/releases/xr-compose); [Android XR audio](https://developer.android.com/develop/xr/jetpack-xr-sdk/add-spatial-audio)
- Apple native splats in the 27 releases. — [Apple](https://developer.apple.com/documentation/realitykit/gaussiansplatcomponent.md)
- The immersive arc in the plan is in-app depth at month 6, a walkable set piece at month 12, and a venue build at month 18. — `docs/overview.md` (repo)

### Inferences (concepts)

**1. Sañjaya's Table: chakravyūha as a witness diorama** (rank 1)
- **Platform:** one three.js + Spark page (`web/chakravyuha-xr.html`). It runs on the phone (tilt and drag), in Quest Browser WebXR (immersive-ar passthrough tabletop or immersive-vr), in Android XR Chrome (not verified), and in Vision Pro Safari WebXR (not verified).
- **What the user does:**
  - Places the day-13 field as a 60 cm table-top relief on their real table, or a stone plinth in VR, lit by one virtual lamp.
  - Leans in, like Gloomy Eyes. The rings of the formation, the gates and their holders are cited leaves.
  - Scrubs story time (the temporal graph's `tick(13, phase)`): dawn array to sunset.
  - Taps a gate for its cite and the three-layer reveal panel. The chanted 7.34.19 plays from the leaf.
- **Reuses:**
  - `scene.json` layout and claims from the chakravyūha prototype plan.
  - The Marble world decimated to ≤150K SH0, plus fal GLB silhouettes.
  - s1e3 claims and narration WAVs (en/hi).
  - The shared reveal-sheet module (`web/shared`).
  - The chant, once it exists.
- **Rules:**
  - 1: Sañjaya vantage only. A diorama scale floor stops figures being enlarged past "medium-wide" angular size. Revered figures (Kṛṣṇa on Arjuna's chariot) are silhouette-only with keep-out capsules, and a CI frustum test runs over sampled head poses.
  - 2: the build fails on unresolved anchors.
  - 6: draft world first.
  - 7: chant file only.
  - 9: private until sign-off.
  - Plus: AI label always visible as a head-locked badge, the spoken disclosure, captions with verse ids.
- **Effort:** about 4–5 person-weeks (2 on top of the 1-week 3D prototype already planned in 3d_worlds.md; 1 on XR input and leaves; 1 on device tests and comfort; 0.5 on the Rule 1 geometry test). Plus about 1 week of art direction.
- **Cost:** under $30 in generation. A Quest 3 test device is needed (price not sourced).
- **First prototype step:** add a `vantage` and `keepOut` schema plus a failing test in `src/contract`. Then load an existing splat in Spark with `renderer.xr.enabled` on a Quest. Measure fps at 100K, 150K and 250K SH0, and record the results in `docs/decisions.md`.

**2. Witness Walk: the Halebidu frieze, chanted** (rank 2)
- **Platform:** the phone app (Compose Multiplatform), with optional output to Ray-Ban Meta (audio; Display preview for captions) or Android XR glasses via Projected/Glimmer. Phone-only works too ("screen off still works").
- **What the user does:**
  - At the Hoysaleśvara temple or a museum cast gallery, faces a panel and taps (Neural Band, touchpad or phone).
  - Hears the spoken AI disclosure, the chanted verse, and a 60–90 s cited narration in their language.
  - Display glasses show two caption lines plus the amber verse id.
  - "Keep" saves the reveal to the Library.
- **Reuses:**
  - Narration pipeline (Bulbul) and chant files.
  - Claims and the manifest timing model.
  - The audio-only chapter mode.
  - Reference-board photos (licence-recorded, style bible §2) as the recognition index.
- **Rules:**
  - 2: every line has a claim. The carving is described as "this panel shows", never as the text.
  - 7: no TTS of Sanskrit; a guard refuses verse text sent to Bulbul.
  - 5: on-phone recognition only, with no frames uploaded.
  - 9.
  - Plus: an ASI or temple permission check, which is a human step.
- **Effort:** about 5–6 person-weeks. 2 on the phone audio-guide mode with panel ids (no camera), 2 on Meta DAT camera and display integration, 1–2 on recognition and field testing. Scholar time to map panels to verses, which is significant: the frieze-to-verse mapping is itself scholarship.
- **Cost:** voice about ₹10 per language per chapter (overview). Meta Ray-Ban Display hardware (price not sourced). A field trip.
- **First prototype step:** with no glasses at all, build "panel number → cited audio" for 3 panels in the app's audio mode. Then pipe the same audio to Ray-Ban over Bluetooth and test intelligibility outdoors.

**3. Relief in a Box: lamp-lit plates for temples, Bala Vihar and homes** (rank 3)
- **Platform:** Looking Glass Go (and larger units for venues), with Blender quilts.
- **What the user does:** watches a slow loop of 5–8 relief plates per chapter (the hidden-detail objects), each with an etched amber cite, while the chant plays through a small speaker. A QR card opens the full chapter or reveal on a phone.
- **Reuses:** the pipeline's Blender scenes and props, hidden-detail shot contracts (camera fields become quilt camera arrays), claims and chant audio.
- **Rules:**
  - 1: QC samples the extreme and centre views of every quilt.
  - 2: an etched cite on every plate.
  - 3: a ledger row for each render, including local compute.
  - 9: venue installs are public, so sign-off is required.
  - AI label printed on the frame.
- **Effort:** about 2–3 person-weeks (Blender quilt export script plus QC multi-view; loop player; kit packaging).
- **Cost:** the device at about $299 list (sale or sold-out status uncertain). Render time is local.
- **First prototype step:** render one 11×6 quilt of the "wheel lying still" macro from an existing or placeholder relief scene with the Looking Glass Blender add-on. View it on a Go (or the web previewer) and judge whether the basalt relief reads.

**4. On the Chariot Platform: a native fixed-vantage chapter** (rank 4)
- **Platform:** visionOS 27 (RealityKit `GaussianSplatComponent` plus SwiftUI panels), and Android XR (Compose for XR `SpatialPanel` plus glTF `Volume`; splats via WebXR fallback). Quest via the same WebXR build as concept 1.
- **What the user does:**
  - Stands on the platform beside a warrior (non-revered, e.g. Abhimanyu's charioteer Sumitra if the canon supports it; scholar to confirm), at life scale.
  - The five beats play with fades between them. The verse beat brings the leaf panel in front of you; the reveal beat opens the three-layer `SpatialPanel`.
  - Room-scale is clamped to 0.5 m, with yaw limits that never face the warrior's face.
- **Reuses:** shot contracts (the `charioteer` witness), the s1e3 beat map and manifest, the splat world, narration and chant, Compose design-system components on Android XR.
- **Rules:**
  - 1: the vantage is never parented to a revered transform. The `charioteer` witness never uses Kṛṣṇa's chariot as a life-scale vantage, or at least needs a scholar note.
  - Comfort: no smooth motion.
  - 2, 7, 9.
- **Effort:** about 8–12 person-weeks per platform (native). Highest risk: Apple's splat cap and the Compose for XR alpha API churn (alpha14 renamed APIs).
- **Cost:** device costs, plus Marble at about $2–5.
- **First prototype step:** a visionOS 27 test app that parses our PLY into `BufferResource`. Binary-search the internal splat limit and record it, since it is undocumented.

**5. The Family Telling: a holographic household display** (rank 5)
- **Platform:** Looking Glass Go at home, with the phone app as controller.
- **What the user does:** a grandparent records the family's telling of an episode. The display shows the relief plate with the family's recording as layer 1, the critical-edition layer with its cite, and later the scholar's reply.
- **Reuses:** the trust loop (screens 27–28), the reveal layers, relief quilts from concept 3.
- **Rules:**
  - 9: private by default; sharing gates on sign-off.
  - Popular and family tellings are never "wrong".
  - The family's voice is never cloned.
  - Rule 5: family recordings never go to a training-permitted API.
- **Effort:** about 3–4 person-weeks on top of concept 3.
- **Cost:** the device. STT if the recording is transcribed (Sarvam, treated as possibly training on inputs, so it needs opt-out or consent).
- **First prototype step:** a paper and phone test with 3 diaspora families: play a quilt plate and a recorded telling, then interview.

**6. Ask the Text: a voice question on glasses** (rank 6)
- **Platform:** the phone app with Ray-Ban or Android XR glasses mic and speakers.
- **What the user does:** press-to-talk, "Who taught Abhimanyu the way in?". They hear the cited answer (the text layer, plus the star-passage nuance), and the display shows the verse id.
- **Reuses:** claims, the reveal records, pre-recorded narration.
- **Rules:**
  - 2: answers only from claim statements.
  - 5: unreleased passages never in prompts.
  - 7.
  - A new decision is needed for any runtime LLM key (CLAUDE.md bars an Anthropic key in the pipeline only).
- **Effort:** about 3 person-weeks for retrieval-only (no generation). Generative answers carry more risk.
- **Cost:** STT per query (Sarvam). Runtime LLM cost, if adopted, is not estimated.
- **First prototype step:** an offline eval of 50 family questions against the 43-claim canon, measuring how many have a claim-only answer.

### Gaps
- Device prices (Quest 3/3S, Vision Pro, Ray-Ban Meta Display, Android XR glasses) were not sourced.
- Person-week and venue-cost figures are estimates, not benchmarks.
- No user research on diaspora households' headset or glasses ownership.
- Whether a life-scale charioteer vantage beside an epic warrior is acceptable devotionally is a scholar and community question, not a technical one.
