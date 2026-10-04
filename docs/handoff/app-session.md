# Handoff: the phone app (Kotlin Multiplatform) session

Written 4 Oct 2026. You build the Dheevara phone app for Android and iOS from one Kotlin codebase. Read this file, then `CLAUDE.md`, `docs/decisions.md` and the mockups, before writing code.

## 1. Why a separate session, and what it needs

The build session that wrote this could not compile Compose. Compose Multiplatform depends on `androidx.*` artifacts, which Google serves only from `dl.google.com` (`maven.google.com` redirects there), and the Android SDK downloads from the same host. Both were blocked. Maven Central, the Gradle plugin portal and Gradle distributions were reachable. JDK 21 and Gradle 8.14.3 are preinstalled.

Before starting this session, Avi adds to the environment's allowed hosts:

| Host | Why |
|---|---|
| `dl.google.com`, `maven.google.com` | Google Maven (AGP, androidx, Compose runtime) and the Android SDK |
| `fonts.googleapis.com`, `fonts.gstatic.com` | Fetching the app's fonts into resources |

Run `bash scripts/session-check.sh` first and paste the output. If `dl.google.com` is still blocked, build and test `shared/core` only (pure Kotlin, JVM tests) and say so.

iOS binaries need macOS and Xcode. Compile iOS klibs on Linux if the Kotlin version allows it, and add a GitHub Actions job on a macOS runner that builds the iOS framework and runs the iOS tests.

## 2. The product you are building

The mockups are the spec: https://claude.ai/artifact/JpYzuuAD5oDfbmzzdcGPY4 (source `design/mockups/index.html`, screenshots in `design/mockups/shots/`, review notes in `design/mockups/reviews/`). Twenty-one screens:

| Act | Screens |
|---|---|
| First open | 01 splash, 02 language, 03 start |
| Arriving from a link | 04 web landing (built by the web team; the app handles its deep link) |
| Browse | 05 home, 06 season |
| The chapter | 07 cold open, 08 the verse, 09 witness scene, 10 hidden detail, 11 the page, 12 people, 13 controls, 14 the question |
| Around the chapter | 15 screen off (system media controls), 16 membership, 17 library, 18 you, 19 share |
| Studio | 20, 21 are web tools, not in the app |

Rules the app enforces (from `CLAUDE.md` and the reviews):

- The AI label is on every scene, and a setting keeps it on every frame.
- Every caption shows its verse id; a reveal shows three tiers in fixed order: what many heard, what the text says, from our collection.
- The scene **pauses** while the reveal or controls are open.
- Autoplay to the next chapter counts down in words, has a Stop button, is off when a screen reader is running, and can be turned off.
- Every scene has a visible exit (top-left). Every gesture has a visible button (Next on the verse, zoom buttons on the page).
- Chapter 1 of every season is free; members get every released chapter; new chapters land at 7 pm in the viewer's timezone. No coins, no per-chapter purchases.
- Works with the screen off: background audio, system Now Playing, skip buttons jump between chapter parts, titles in the narration language.
- Reduce motion follows the OS setting by default.
- Minimum tap target 44 pt; contrast at least 4.5:1 for text; every Indic name carries its language tag.

## 3. Design system (from the mockups' `:root`)

| Token | Value | Use |
|---|---|---|
| bg / raise / raise2 / raise3 | `#0B0B0A` `#151513` `#1D1C19` `#272521` | Surfaces |
| fg / fg2 / fg3 | `#F4F2EE` `#B5B0A7` `#918C82` | Text, primary button fill |
| amber | `#F2B04A` | **Only** sources: citations, verse ids, the leaf icon |
| live (sindoor) | `#F0694A` | **Only** what is live or an opponent |
| leaf / ink / ink2 / leafred | `#EFE6D2` `#1E160C` `#4A3A25` `#7A2410` | Verse and reveal surfaces |

Type: Geist (all interface text; 32/22/17/15/12.5 at 600/600/600/400/500, tight tracking on the large sizes), Tiro Devanagari Sanskrit (verse only), Noto Sans for Devanagari (Hindi, Marathi), Tamil, Telugu, Kannada, Bengali, Gujarati, Gurmukhi, Malayalam and Odia. No letter-spacing or uppercase on Indic text; line height at least 1.45 for Indic scripts. Radii 12 (controls), 18–22 (cards), 28–30 (sheets). Motion table and icon set are in the mockups (`<symbol>` ids `i-*`); the leaf icon is a palm-leaf with two binding holes.

## 4. Architecture

```
apps/dheevara/
  settings.gradle.kts, gradle/libs.versions.toml
  shared/core/   pure Kotlin (commonMain + jvm, android, iosArm64, iosSimulatorArm64)
                 models for the chapter manifest (kotlinx.serialization), claim resolution,
                 the chapter timeline state machine, entitlements and release schedule
                 (kotlinx-datetime), deep-link parsing, telemetry events, repository interfaces
  shared/ui/     Compose Multiplatform: theme (tokens above), components, all screens,
                 navigation; platform code behind expect/actual
  androidApp/    Activity, Media3 ExoPlayer + MediaSessionService, WebView, Play Billing via RevenueCat
  iosApp/        Xcode project, AVPlayer + AVAudioSession + MPNowPlayingInfoCenter, WKWebView
```

Choices, with reasons:

- **Compose Multiplatform for all UI.** Stable on iOS since 1.8; one UI codebase. Use the latest stable at session start (on 4 Oct 2026 Maven Central showed Kotlin 2.4.20, Compose Multiplatform 1.12.1, kotlinx-serialization 1.11.0, coroutines 1.11.0, datetime 0.8.0, Ktor 3.6.0, Coil 3.6.3, navigation-compose 2.9.2, lifecycle 2.11.0, SQLDelight 2.4.0, multiplatform-settings 1.3.0, RevenueCat purchases-kmp 3.11.0). Check each again; do not use betas.
- **Native media, not a shared player.** Playback, background audio and lock-screen controls are platform code: Media3 on Android, AVFoundation on iOS, behind one `ChapterPlayer` interface in `shared/core`. Skip buttons map to chapter beats.
- **JS experiences run in a WebView** (Android WebView, WKWebView), loading `web/*.html` bundled or from the CDN, with a small bridge for telemetry and for opening a reveal natively.
- **Data:** the app reads `content/<chapter>/manifest.json` (schema in `docs/handoff/pipeline-session.md` section 7, file `schema/chapter-manifest.schema.json` once the pipeline session writes it). Until real media exists, `media.video.status` is `pending` and the player shows the stills and captions with audio when present. Never invent media.
- **Offline:** SQLDelight for progress, kept reveals and downloads; audio-only downloads by default.
- **Subscriptions:** RevenueCat KMP over Play Billing and StoreKit; prices come from the store, localised.
- **Telemetry:** a per-second heartbeat tied to beat and shot ids, batched, matching the event list in the plan (DHE-16). Endpoint is a later decision; write events to a pluggable sink.

## 5. Order of work

| # | Ships | Done when |
|---|---|---|
| A0 | Gradle project under `apps/dheevara/`, version catalog, CI job (Linux: core tests, Android assemble and unit tests; macOS: iOS framework and tests) | `./gradlew check` green locally and in CI |
| A1 | `shared/core` with tests: manifest models and parsing (fixture `content/s1e3/manifest.json`), timeline state machine (beats, pause on reveal, autoplay countdown with stop), entitlements and 7 pm local release, deep links (`dheevara.app/s1e3/who-taught-him?ref=…`) | 90%+ line coverage on core; tests run on JVM and iOS simulator |
| A2 | `shared/ui` theme and components (button, chip, pill, cite, leaf card, toggle, list row, tab bar, segmented progress) | Screenshot tests (Roborazzi on Android, or Compose desktop) match the mockups at 390×844 and 360×740 |
| A3 | Screens 01–03, 05–06, 16–18 with navigation | Screenshot tests; TalkBack and VoiceOver labels present |
| A4 | Chapter flow 07–14 with the player, captions, reveal sheet, page view, people graph and its list alternative, controls sheet | The s1e3 fixture plays end to end on an Android emulator and the iOS simulator |
| A5 | Screen-off audio (15), downloads, deep links, share (19) | Chapter plays with the screen off on a ₹15,000-class Android; skip jumps between beats |
| A6 | RevenueCat, telemetry sink, release builds | Internal test track builds for both stores; Avi approves before any store submission |

## 6. Where autonomy stops

Go ahead: code, tests, CI, dependency choices with a decision entry, screenshot baselines. Stop and ask Avi: store listings or submissions, signing keys, any paid SDK or account, and anything that publishes the app outside internal testing.
