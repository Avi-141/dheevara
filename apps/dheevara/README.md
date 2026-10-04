# Dheevara app

Kotlin Multiplatform, one codebase for Android and iOS. The spec is the mockups (`design/mockups/`); the plan is `docs/handoff/app-session.md`.

| Module | Holds |
|---|---|
| `shared/core` | Pure Kotlin: manifest models, timeline, entitlements, deep links (JVM, Android, iOS) |
| `shared/ui` | Compose Multiplatform UI: theme, components, screens; exported to iOS as the `DheevaraKit` framework. Its JVM target exists only for screenshot tests |
| `androidApp` | The Android app shell |

```bash
./gradlew check                       # tests, coverage gate, screenshot comparison, lint
./gradlew :shared:ui:recordRoborazziJvm   # re-record screenshots in shared/ui/screenshots/ after a deliberate change
./gradlew :androidApp:assembleDebug   # debug APK
./gradlew :shared:core:iosSimulatorArm64Test   # macOS only
```

Needs JDK 21 and an Android SDK (`ANDROID_HOME`, or `sdk.dir` in `local.properties`). CI is `.github/workflows/app.yml`.

Icons come from the mockups' sprite: after changing `design/mockups/index.html`, run `python3 scripts/icons.py`. Fonts are bundled under `shared/ui/src/commonMain/composeResources/font/` (OFL; see `files/font-licences.txt`).
