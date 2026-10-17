# Immersive Device and Platform Landscape (as of 2026-10-17) for Dheevara

Scope: smart glasses, headsets, cross-platform authoring, holographic displays, phone AR, and a platform-by-platform fit/recommendation for Dheevara (witness POV, no deity faces, chanted Sanskrit, India + diaspora, three.js/Spark web, KMP Compose app).

Source-quality note: many 2026 results were aggregator, vendor or "roadmap" sites (vr.org, idevice.com, dymesty, extentos, glasskit, kivicube, arloopa). They are flagged where used. Primary sources (Meta developer blog, Engadget Connect roundup, CNBC, TechCrunch, PR Newswire, developer.android.com, Apple newsroom) are preferred.

## 1. Smart glasses: capabilities, developer access, price, countries, sales

### Takeaway
Meta dominates (about 7M AI glasses sold in 2025; ~69% share in Q1 2026), and since May 2026 third parties can draw on the Ray-Ban Display through a native phone SDK (Swift/Kotlin) or plain HTML/CSS/JS web apps. But the Display model is sold only in the US/UK/Canada/EU, not India. In India, Meta sells only the non-display Ray-Ban Meta (Gen 3 from ₹44,300). Android XR display glasses, Snap Specs ($2,195) and Xreal Aura ($1,279) all ship in fall 2026 to Western markets only. Apple glasses are expected in late 2027.

### Cited Findings
**Meta Ray-Ban Display + Neural Band**
- Display specs: monocular HUD, about 20° FOV, up to 5,000 nits, 600×600 px (42 PPD), up to 90 Hz. Weight 69 g, battery up to 6 h. US launch at $799 on 2025-09-30 — [Tom's Guide](https://www.tomsguide.com/computing/smart-glasses/meta-ray-ban-display-glasses-features-neural-link-price-and-availability); [UploadVR](https://uploadvr.com/meta-ray-ban-display-glasses-officially-announced)
- Meta paused the planned early-2026 international rollout (UK, France, Italy, Canada) because of "unprecedented demand and constrained supply" — [Storyboard18](https://storyboard18.com/brand-marketing/meta-pauses-international-rollout-of-ray-ban-display-glasses-amid-limited-inventory-87124.htm)
- That rollout has since resumed. At Connect (Sept 2026), Display went on sale in the UK (£749) and Canada (CA$1,149), with pre-orders in Germany, France and Italy (€899, available Oct 13). Also announced: web apps via the Meta AI app and Explore, notification mirroring, transit/cycling directions, and holographic avatars in WhatsApp calls (US) — [Engadget, Everything announced at Meta Connect 2026](https://www.engadget.com/2267230/everything-announced-at-meta-connect-2026/). The Engadget roundup does not mention India.
- Developer access, announced 2026-05-14 (developer preview):
  - Native path: the Device Access Toolkit is an iOS (Swift) / Android (Kotlin) SDK that extends an existing phone app to the glasses. Display components are text, images, lists, buttons and video playback, alongside camera, audio and display features.
  - Web path: standalone HTML/CSS/JS apps that can use motion/orientation, phone GPS, Neural Band input and local storage, deployed by URL.
  - Distribution: web apps through password-protected URLs; toolkit builds through release channels of up to 100 testers.
  - Neural Band input is surface EMG finger gestures.
  - [Meta for Developers blog](https://developers.meta.com/blog/build-for-display-glasses/)
- Camera and microphone access is native-only; the web path lacks it — [vr.org](https://vr.org/articles/meta-ray-ban-display-developer-sdk-2026) (aggregator)
- Status conflict: Meta's FAQ reportedly says the toolkit is out of preview, with v1.0 rolling out from 2026-09-30 — [Meta Wearables FAQ](https://developers.meta.com/wearables/faq/) (via search summary, not fetched). A June 2026 third-party guide still calls it preview v0.8.0 — [GlassKit](https://glasskit.app/docs/meta-ray-ban-display-sdk-explained). The submission/review process for public apps is unstated — [gHacks](https://www.ghacks.net/2026/05/18/meta-opens-ray-ban-display-glasses-to-third-party-developers-through-wearables-toolkit/)

**Ray-Ban / Oakley Meta (non-display) and new Connect 2026 line**
- Ray-Ban Meta Gen 3: $449, 12MP camera with 3K video, six mics, 9 h battery. Ray-Ban Meta Audio (no camera): from $349, shipping Oct 13. Meta Adventurer own-brand frames: from $249. Meta VR Glasses: $1,300, about 100 g, 5K display, tethered puck, next spring — [Engadget](https://www.engadget.com/2267230/everything-announced-at-meta-connect-2026/)
- India launch history:
  - Ray-Ban Meta went on sale in India from 2025-05-19 — [TechCrunch](https://techcrunch.com/2025/05/13/meta-to-start-selling-its-ray-ban-smart-glasses-in-india-from-may-19/)
  - Gen 2 launched in India at ₹39,900 with UPI QR payments — [TechBuzz](https://www.techbuzz.ai/articles/meta-launches-ray-ban-gen-2-smart-glasses-in-india-with-upi-pay)
  - Gen 3 is in India from ₹44,300. The start date conflicts: Sept 24 per [TelecomTalk](https://telecomtalk.info/ray-ban-meta-gen-3-launches-india/1012148/) vs Oct 1 per [vr.org](https://vr.org/articles/ray-ban-meta-gen-3-india-44300-rupees-price-ladder-2026)
  - Gen 1 is discounted to ₹16,825 in Amazon's festive sale — [TelecomTalk](https://telecomtalk.info/get-raybanmetagen1-for-rs16825-for-amazonfestivesale/1012482/)
- Sales:
  - EssilorLuxottica sold over 7M AI glasses in 2025, vs about 2M across 2023–24 — [CNBC, 2026-02-11](https://www.cnbc.com/2026/02/11/ray-ban-maker-essilorluxottica-triples-sales-of-meta-ai-glasses.html)
  - Analysts flagged disappointing sequential growth in Q1–Q2 2026 — [Third Bridge](https://www.thirdbridge.com/en-us/about-us/media/perspectives/essilorluxottica-smart-glasses)
  - IDC (cited second-hand) puts Meta at 69.2% smart-glasses share in Q1 2026 — [IDC blog](https://www.idc.com/resource-center/blog/smart-glasses-surge-the-xr-market-is-rewriting-its-own-rules/)
  - IDC: smart-glasses shipments grew 167% YoY in Q1 2026, while XR headsets fell 8% YoY in Q4 2025 — [IDC blog](https://www.idc.com/resource-center/blog/smart-glasses-surge-the-xr-market-is-rewriting-its-own-rules/)

**Google/Samsung Android XR glasses**
- Previewed at I/O 2026, with the first styles (Gentle Monster, Warby Parker) launching in "Fall" 2026. Gemini handles navigation, notifications and translation. Price and display specs were unconfirmed at I/O — [9to5Google, 2026-05-19](https://9to5google.com/2026/05/19/google-samsung-android-xr-glasses-styles-release-date/)
- Leaked, unconfirmed specs: 12MP, Snapdragon AR1, about 41 g, November release — [NokiaMob, 2026-10-13](https://nokiamob.net/2026/10/13/samsung-android-xr-smart-glasses-leaked-specs-designs-and-november-launch/)

**Snap Specs**
- Unveiled 2026-06-16 at $2,195 with a $200 refundable deposit. Ships fall 2026, initially to the US, UK and France — [CNBC](https://www.cnbc.com/2026/06/16/snap-unveils-2195-specs-ar-glasses-spiegel-bets-on-post-smartphone.html); [TechCrunch](https://techcrunch.com/2026/06/16/snap-finally-debuts-its-long-awaited-ar-glasses-specs-and-oof-they-arent-cheap/)

**Xreal Aura (formerly Project Aura, Android XR, wired)**
- $1,279 (12GB/256GB) and $1,499 (16GB/512GB), announced 2026-10-07. Ships "before the holidays" in the US, Canada, Japan and South Korea — [PR Newswire](https://www.prnewswire.com/news-releases/xreal-aura-starts-at-1-279--bringing-wired-xr-glasses-with-android-xr-to-customers-this-year-302900445.html); [9to5Google](https://9to5google.com/2026/10/07/xreal-aura-with-android-xr-start-at-1279/)

**Apple glasses**
- Gurman (Bloomberg) reports that Apple will unveil its first glasses (N50) at WWDC June 2027 and ship them late 2027. Whether they have a camera is disputed — [MacRumors, 2026-05-31](https://www.macrumors.com/2026/05/31/apple-glasses-late-2027-report/); [Road to VR](https://roadtovr.com/apples-smart-glasses-unveil-wwdc-2027-release-date/); [vr.org](https://vr.org/articles/apple-smart-glasses-wwdc-2027-privacy-camera-decision-2026)

### Inferences
- The Ray-Ban Display web-app path (HTML/CSS/JS by URL) is the cheapest entry for Dheevara, since the team already builds web JS. But a 600×600 monocular 20° HUD only suits text and small images: verse text with transliteration, a citation card, chapter-progress glances. It does not suit scenes.
- The non-display Ray-Ban Meta, which is sold in India, makes Dheevara an audio product: chanted ślokas plus narration through open-ear speakers. Developer access to audio is through the native Device Access Toolkit attached to our phone app. This is where India reach exists.
- Glasses POV is first-person by definition. A "witness" rule is naturally satisfied if the glasses show only text/audio overlays rather than rendering deity figures in the wearer's field of view.

### Gaps
- No source found on whether Ray-Ban Display, Android XR glasses or Snap Specs are planned for India. No Indian unit-sales figure for Ray-Ban Meta was found.
- Rokid, Even Realities (G1/G2), Alibaba Quark and Xiaomi AI glasses were not researched within budget: no 2026 specs, SDK or India availability gathered.
- Meta Orion / next-gen true-AR glasses: no 2026 update found in these searches.
- The exact Device Access Toolkit 1.0 GA status and app-review policy need direct confirmation on developers.meta.com.

## 2. Headsets: Vision Pro, Galaxy XR, Quest, Pico, Valve, install base

### Takeaway
None of the major headsets is officially sold in India. Quest is the only one at mass-market scale (about 20M+ sold lifetime, $349.99 for 3S after the April 2026 price rise). Vision Pro (M5, $3,499) and Galaxy XR ($1,799, very low volume) are diaspora-only niches. Splat viewing works on Vision Pro through third-party apps; Apple's own native splat API was only hinted at in a WWDC26 session.

### Cited Findings
- Vision Pro M5, Oct 2025: the Neural Engine makes Spatial Scene generation up to 50% faster, and it ships with visionOS 26 — [Apple Newsroom](https://www.apple.com/newsroom/2025/10/apple-vision-pro-upgraded-with-the-m5-chip-and-dual-knit-band/)
- visionOS 26 Photos turns any 2D image into a "Spatial Scene," a volumetric photo with limited head motion — [UploadVR](https://www.uploadvr.com/apple-sharp-open-source-on-device-gaussian-splatting/)
- Apple's open-source SHARP model generates splats on device; the Splat Studio app does a scene in about 20 s on M5 but runs hot and choppy — [UploadVR](https://www.uploadvr.com/apple-sharp-open-source-on-device-gaussian-splatting/)
- WWDC26 visionOS Group Lab: an Apple engineer said Gaussian splatting "should be supported" on iOS and visionOS. A developer reported docs showing iOS symbols that Xcode does not expose. Splats are culled when the face is close or inside — [Apple Developer, WWDC26 session 8004](https://developer.apple.com/videos/play/wwdc2026/8004/) (summary via search; not a formal feature announcement)
- Third-party splat viewers on visionOS:
  - MetalSplatter, open source, loads PLY/SPZ/.splat — [GitHub](https://github.com/scier/MetalSplatter)
  - Gracia 4DGS volumetric video, needs visionOS 26.4+ — [Radiance Fields](https://radiancefields.com/gracia-brings-its-streamable-4dgs-volumetric-videos-to-apple-vision-pro)
- Prices and India status:
  - Vision Pro: $3,499, not sold in India. Galaxy XR: $1,799, launched 2025-10-21 (US) and 10-22 (Korea), later £1,699 in the UK, no India launch — [Digit](https://www.digit.in/features/wearable-devices/samsung-galaxy-xr-vs-apple-vision-pro-specs-features-and-key-differences-explained.html); [Tom's Guide](https://www.tomsguide.com/computing/vr-ar/samsung-galaxy-xr-launches-for-usd1-700-less-than-apple-vision-pro-release-date-price-specs-and-more); [TelecomTalk](https://telecomtalk.info/samsung-galaxy-xr-preorder-hits-india-launch-next/1008795/) (sources about one year old)
  - Galaxy XR volume is unverified: 40K units in 2025 / 70K lifetime per [Treeview](https://treeview.studio/blog/xr-spatial-computing-smart-glasses-market-statistics-report) (unattributed)
- Quest:
  - Meta raised Quest prices from 2026-04-19 (memory costs): Quest 3S is $349.99 (128GB) / $449.99 (256GB) — [Tech Observer](https://techobserver.in/news/gadget/meta-quest-3-3s-price-increase-april-2026-322345/)
  - Quest is not officially sold in India; grey-market listings run about ₹35,000–45,500 — [Business Today (2024)](https://www.businesstoday.in/technology/news/story/meta-unveils-quest-3s-an-affordable-mixed-reality-headset-competing-with-apples-expensive-vision-pro-447548-2024-09-25); [Amazon.in listing](https://www.amazon.in/Meta-Quest-128GB-All-One/dp/B0F2GYMC8H)
  - More than 20M Quest headsets sold (date unclear) — [UploadVR](https://uploadvr.com/zuckerberg-first-party-quests-will-still-be-most-popular)
  - Third-party Horizon OS headsets (Asus, Lenovo) announced in 2024 had still not shipped per a later report — [Road to VR](https://roadtovr.com/?p=173091)
- Meta's Connect 2026 headset push is the $1,300 "Meta VR Glasses" (spring 2027) plus media (Disney+ 3D, ESPN 180°). The Engadget roundup reported no Horizon OS developer news — [Engadget](https://www.engadget.com/2267230/everything-announced-at-meta-connect-2026/)

### Inferences
- For diaspora households, Quest 3/3S is the only headset with meaningful install base. Vision Pro owners are few but high-income and likely to pay for premium cultural content. Galaxy XR is negligible.
- In VR, the viewer's camera is the player's head, so "witness" must be enforced spatially. Deity figures should sit at a distance, behind a threshold or in relief, never at face range. Relevant to rule 1: the reported culling when the head enters splats means a viewer cannot "become" a figure, but they can still walk up to a face. Content needs proximity limits.

### Gaps
- No 2026 Quest MAU, Vision Pro install base, or IDC 2026 headset shipment figures were found.
- Pico (ByteDance) 2026 status and Valve's headset ("Deckard"/Steam Frame) status were not researched within budget.
- Whether visionOS 27 (WWDC26) shipped a formal RealityKit Gaussian splat component is unconfirmed. This should be checked against Apple's RealityKit docs.

## 3. Cross-platform authoring (WebXR, OpenXR, engines, Android XR SDK, splats)

### Takeaway
The highest-leverage stack for Dheevara is WebXR plus three.js plus Spark, because it already exists in-house. It reaches Quest Browser, Vision Pro Safari and Android XR Chrome, and Meta Display glasses accept plain web apps by URL. Android XR's Kotlin/Compose path (Compose for XR on headsets; Jetpack Projected and Compose Glimmer on glasses) fits the KMP app but is still pre-stable.

### Cited Findings
- WebXR on Android XR:
  - Chrome on Android XR supports WebXR (AR Module, Hit Test, Hand Input, Anchors, Depth Sensing, Light Estimation) with `immersive-ar` sessions; hand input is the default — [Android Developers, WebXR](https://developer.android.com/develop/xr/develop-with-webxr); [Android Developers, web on XR](https://developer.android.com/develop/xr/web)
  - The docs note that all WebXR APIs require the 3D-mapping/camera-tracking permission — [Android Developers](https://developer.android.com/develop/xr/develop-with-webxr)
- Spark (three.js 3DGS renderer, WebGL2):
  - Spark 2.0 adds streamable LoD and virtual memory for 100M+ splat worlds — [ProductCool](https://www.productcool.com/product/spark-2-0-2)
  - A May 2026 demo ran Spark LoD in WebXR mixed reality on Quest — [X / @XRarchitect](https://x.com/XRarchitect/status/2056211832613089323)
  - Its WebXR on Quest 3 / Vision Pro is described variously as "experimental" or "out of the box," with no WebGPU path — [ar-go.co](https://ar-go.co/blog/gaussian-splatting-platforms/); [Swyvl](https://swyvl.io/blog/best-gaussian-splat-viewers/)
  - Marble exports reportedly include a WebXR preset for Quest 3 / Vision Pro — [ar-go.co](https://ar-go.co/blog/gaussian-splatting-platforms/) (vendor-adjacent)
  - Niantic shipped WebXR splat viewing on the Quest 3 browser (Scaniverse) — [UploadVR](https://www.uploadvr.com/niantic-into-the-scaniverse-webxr/)
- Android XR SDK:
  - Jetpack XR SDK covers headsets (Compose for XR, SceneCore, ARCore for Jetpack XR) — [Android Developers](https://developer.android.com/develop/xr/jetpack-xr-sdk)
  - Glasses use separate activities for audio and display glasses — [Android Developers, first activity for glasses](https://developer.android.com/develop/xr/jetpack-xr-sdk/glasses/first-activity)
  - Compose Glimmer is the UI toolkit for transparent displays — [Android Developers, Glimmer](https://developer.android.com/agents/skills/xr/display-glasses-with-jetpack-compose-glimmer/skill)
  - Developer Preview 3 added AI-glasses support — [Android Developers Blog](https://developer.android.com/blog/posts/build-for-ai-glasses-with-the-android-xr-sdk-developer-preview-3-and-unlock-new-features-for-immersive-experiences)
  - A third party reports DP4 in May 2026, with Projected and Glimmer still alpha — [Extentos](https://extentos.com/docs/ecosystem/platforms/android-xr) (aggregator)
- The Meta Device Access Toolkit has a Kotlin Android SDK, so the same Android app module can target Meta glasses — [Meta for Developers](https://developers.meta.com/blog/build-for-display-glasses/)
- Third-party apps exist that already target visionOS and Android XR together for spatial film — [Spatial Film](https://spatial.film/)

### Inferences
- The Kotlin Multiplatform app could plausibly host:
  - an Android-side Meta Device Access Toolkit module for audio and HUD on Ray-Ban glasses;
  - a Jetpack Projected / Glimmer module for Android XR glasses.
  Both are Kotlin, so they sit in the Android source set without a new engine.
- Unity 6 / OpenXR would be needed only for a native, store-distributed Quest or Vision Pro title. That is a second codebase that duplicates the three.js work; defer it.

### Gaps
- Safari on visionOS WebXR status (default-on or not, `immersive-ar` support) in visionOS 26/27 was not confirmed by a primary source.
- No measured performance numbers for Spark on Quest 3/3S standalone (splat count vs fps) were found.
- Unity 6, Unreal, Godot XR, the Meta Spatial SDK and OpenXR specifics were not researched within budget.

## 4. Holographic and volumetric displays

### Takeaway
Holographic displays are a venue play (temples, museums, diaspora cultural centres), not a consumer channel. Looking Glass now sells "Hololuminescent" displays at $2,000 (16"), $4,000 (27") and $20,000 (86"). Proto boxes are already being used at an Indian spiritual site (Isha, Mahashivratri 2026), and hologram-heavy Ramayana museums exist or are planned in Ayodhya.

### Cited Findings
- Looking Glass HLD line: 16" $2,000, 27" $4,000, 86" $20,000 (shipping around Sept–Oct 2026). The two official pages disagree on the 86" ship date — [Looking Glass HLD overview](https://lookingglassfactory.com/hld-overview); [Looking Glass](https://lookingglassfactory.com/)
- An older report gave $1,500 entry and $15,000 for the 86" — [Gadget Review](https://www.gadgetreview.com/looking-glass-debuts-high-res-3d-holographic-displays-no-glasses-needed) (conflicts with current pricing)
- Looking Glass Musubi: a 7" consumer photo frame at $149, now sold out — [Engadget](https://www.engadget.com/ar-vr/looking-glass-musubi-showcases-its-holographic-display-in-a-consumer-friendly-package-130000304.html)
- Proto units were used at the Isha Yoga Center (Tamil Nadu) for Mahashivratri 2026 for AI avatar conversations with Sadhguru — [Sixteen:Nine, 2026-02-25](https://www.sixteen-nine.net/2026/02/25/ancient-ritual-meets-artificial-intelligence-as-mahashivratri-festival-embraces-holograms/)
- Ram Katha Museum, Ayodhya: a hologram-filled attraction developed by Tagbin — [The Art Newspaper, 2025-01-22](https://www.theartnewspaper.com/2025/01/22/museum-india-grand-ram-temple-ayodhya)
- Tagbin also did the hologram projections at the Pradhanmantri Sangrahalaya — [Medium/Tagbin](https://medium.com/@tagbinpromotion/netajis-hologram-statue-a-symbol-of-unity-and-patriotism-cbcc9b272a7f)
- Khajuraho temples use laser projection-mapping shows — [Christie Digital](https://www.christiedigital.com/press-releases/khajuraho-temples/)
- Indian vendors pitch 3D hologram explainers to temples — [Vision3D](https://vision3d.in/blog/3d-hologram-explanation-temple/) (vendor)

### Inferences
- A Looking Glass 16"/27" in a diaspora temple, cultural centre or museum lobby could show a relief-style scene (third-person, lamp-lit) with a citation card. That fits the "temple relief" look and the witness rule, since a light-field box is inherently viewed from outside.
- The Proto/Isha precedent shows Indian religious audiences accept holograms. But Proto is used for life-size human avatars, and a life-size deity hologram would risk rule 1 (deity face, devotional framing). Use it only for narrators or human characters, if at all.

### Gaps
- Proto hardware pricing and India distribution were not found. Hypervsn fan pricing, Pepper's ghost stage costs in India, light-field phones and the Looking Glass SDK (Unity/WebXR plugin status) were not researched within budget.

## 5. Phone-first AR as the bridge

### Takeaway
8th Wall is gone for new work (logins ended 2026-02-28; hosting ends 2027-02-28). WebAR must move to open libraries (MindAR, the 8th Wall MIT release, which lacks SLAM/VPS) or to platform viewers (`<model-viewer>`, AR Quick Look, Scene Viewer) or commercial tools (Zappar/ZapWorks, others). For India's cheap Android phones, plain web 3D and `<model-viewer>` are the reach bridge.

### Cited Findings
- 8th Wall timeline: no logins or edits after 2026-02-28; hosted experiences run until 2027-02-28, then hosting shuts down; key pieces are to be open-sourced — [8th Wall forum](https://forum.8thwall.com/t/important-changes-to-8th-wall-business/8578)
- The open-source successor reportedly lacks SLAM, VPS, Maps and hand tracking — [Kivicube](https://www.kivicube.com/post/augmented-reality-after-8th-wall-shutdown-your-2026-guide-to-the-right-webar-platform/) (competing vendor)
- Alternative families:
  - commercial: ZapWorks, palanAR/STYLY;
  - open source: MindAR and the 8th Wall MIT release;
  - platform viewers: iOS AR Quick Look, Android Scene Viewer, `<model-viewer>`.
  — [Utsubo](https://www.utsubo.com/blog/webar-brand-campaigns-guide); [ARLOOPA](https://www.arloopa.com/blog/8th-wall-is-shutting-down-where-to-move-your-webar-projects/) (vendors)

### Inferences
- On low-end Android, ARCore support is uneven, so WebAR should degrade to a non-AR three.js view. That matches `web/chakravyuha.html` as reference.
- A "relief on your wall" AR placement keeps the viewer outside the scene, which fits the witness rule well.

### Gaps
- Niantic Studio's status after the 8th Wall wind-down was not found.
- India reach for Instagram/Snap AR lenses, ARCore device share in India, and the Zappar/MindAR feature set were not researched within budget.

## 6. Per-platform fit and recommendation

### Takeaway
Build first for (1) WebXR through the existing three.js/Spark web chapters, tested on Quest Browser and Vision Pro Safari. This needs near-zero new code and covers diaspora headset owners plus Android XR Chrome. Second, build (2) an audio-first glasses mode through the Meta Device Access Toolkit in the Android/iOS app. This is the only immersive device with official India sales (Ray-Ban Meta Gen 3, from ₹44,300) and has the strongest sales momentum. Wait on native visionOS/Unity, Android XR glasses (pre-stable SDK, no India), Snap Specs, Xreal Aura, Apple glasses (late 2027) and holographic installs (venue deals only).

### Cited Findings
- India-official devices: Ray-Ban Meta (since May 2025) — [TechCrunch](https://techcrunch.com/2025/05/13/meta-to-start-selling-its-ray-ban-smart-glasses-in-india-from-may-19/). Quest, Vision Pro and Galaxy XR are not officially in India — [Business Today](https://www.businesstoday.in/technology/news/story/meta-unveils-quest-3s-an-affordable-mixed-reality-headset-competing-with-apples-expensive-vision-pro-447548-2024-09-25); [Digit](https://www.digit.in/features/wearable-devices/samsung-galaxy-xr-vs-apple-vision-pro-specs-features-and-key-differences-explained.html)
- Diaspora markets for Ray-Ban Display: US, UK, Canada and the EU from Sept/Oct 2026; UAE was not listed — [Engadget](https://www.engadget.com/2267230/everything-announced-at-meta-connect-2026/)
- Meta Display web apps are HTML/CSS/JS by URL, and the native SDK is Swift/Kotlin — [Meta for Developers](https://developers.meta.com/blog/build-for-display-glasses/)
- Smart glasses are the growth category (+167% YoY in Q1 2026), while headsets are flat or declining — [IDC](https://www.idc.com/resource-center/blog/smart-glasses-surge-the-xr-market-is-rewriting-its-own-rules/)

### Inferences (platform matrix, analyst judgement)

| Platform | Reach (India / diaspora) | Build cost for us | Rule fit / POV risk | Call |
|---|---|---|---|---|
| WebXR (Quest Browser, Vision Pro Safari, Android XR Chrome) | Low in India / moderate diaspora (Quest 20M+ lifetime) | Low: reuses three.js + Spark + Marble | Medium risk. Free head movement lets a viewer approach a deity face, so add proximity limits and keep figures in relief/behind a threshold | **Do first** |
| Ray-Ban/Oakley Meta (no display), via the Device Access Toolkit | Only immersive device sold in India; highest unit sales globally | Low–medium: Kotlin/Swift module in the existing app | Excellent. Audio only, so chant plus narration and no visuals to break rule 1 | **Do second** (audio "walk-with" chapters) |
| Ray-Ban Display (HUD) web apps | Diaspora only (US/UK/CA/EU) | Low: HTML/JS | Excellent. Verse text and citations on a 600×600 HUD | Cheap add-on after #2; caveat that the preview distribution cap is 100 testers / password URLs |
| Vision Pro native (RealityKit, splats) | Tiny, high-income diaspora | High (Swift/RealityKit) | Medium; the same proximity issue | Wait for a formal splat API in visionOS 27 |
| Android XR headsets/glasses (Compose for XR / Glimmer) | Negligible now; no India | Medium. Kotlin fits KMP, but the SDK is alpha/preview | Good for glasses (HUD) | Prototype later; wait for stable SDK and India launch |
| Quest native (Unity/OpenXR/Spatial SDK) | Diaspora | High | Medium | Wait; WebXR covers it first |
| Snap Specs, Xreal Aura, Apple glasses | Very small / not shipped / 2027 | Varies | n/a | Wait |
| Looking Glass / Proto holograms | Venue-based (temples, museums, cultural centres) | Hardware $2k–$20k + content | Good for Looking Glass (viewed from outside). Proto life-size is risky for deity figures | Only as a funded venue partnership |
| WebAR / `<model-viewer>` on phones | Highest in India | Low | Good (relief placed in the room, viewer outside) | Bridge, tied to WebXR work |

- Rule 7 (chant) is easiest to honour on audio glasses, since Vāgdhenu output simply plays. Rule 5 (no training on our texts) needs checking against the Meta AI / Gemini terms if any glasses feature routes text through those assistants. Our own app playing audio does not.

### Gaps
- No India-specific data on smart-glasses buyers, and no diaspora (UAE) availability data for Meta Display.
- No cost benchmarks (developer-weeks or agency rates) were found for any platform. The build costs above are qualitative judgements.
