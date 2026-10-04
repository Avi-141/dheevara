plugins {
    alias(libs.plugins.kotlin.multiplatform)
    alias(libs.plugins.android.kmp.library)
    alias(libs.plugins.compose.multiplatform)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.roborazzi)
}

kotlin {
    jvmToolchain(21)

    // Compose on the desktop JVM, used only to render screenshot tests on any CI host.
    jvm()
    android {
        namespace = "app.dheevara.ui"
        compileSdk = libs.versions.android.compileSdk.get().toInt()
        minSdk = libs.versions.android.minSdk.get().toInt()
        androidResources { enable = true }
    }
    listOf(iosArm64(), iosSimulatorArm64()).forEach { target ->
        target.binaries.framework {
            baseName = "DheevaraKit"
            isStatic = true
            export(projects.shared.core)
        }
    }

    sourceSets {
        commonMain.dependencies {
            api(projects.shared.core)
            implementation(libs.compose.runtime)
            implementation(libs.compose.foundation)
            implementation(libs.compose.ui)
            implementation(libs.compose.components.resources)
        }
        jvmTest.dependencies {
            implementation(kotlin("test"))
            implementation(libs.compose.ui.test)
            implementation(compose.desktop.currentOs)
            implementation(libs.roborazzi.compose.desktop)
        }
    }
}

compose.resources {
    packageOfResClass = "app.dheevara.ui.res"
}

roborazzi {
    outputDir = layout.projectDirectory.dir("screenshots")
}

// `check` compares every screenshot with its committed baseline; re-record with recordRoborazziJvm.
tasks.named("check") {
    dependsOn("verifyRoborazziJvm")
}
