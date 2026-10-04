# Dheevara app

Kotlin Multiplatform, one codebase for Android and iOS. The spec is the mockups (`design/mockups/`); the plan is `docs/handoff/app-session.md`.

| Module | Holds |
|---|---|
| `shared/core` | Pure Kotlin: manifest models, timeline, entitlements, deep links (JVM, Android, iOS) |
| `shared/ui` | Compose Multiplatform UI; exported to iOS as the `DheevaraKit` framework |
| `androidApp` | The Android app shell |

```bash
./gradlew check                       # core tests (JVM, Android host), lint
./gradlew :androidApp:assembleDebug   # debug APK
./gradlew :shared:core:iosSimulatorArm64Test   # macOS only
```

Needs JDK 21 and an Android SDK (`ANDROID_HOME`, or `sdk.dir` in `local.properties`). CI is `.github/workflows/app.yml`.
