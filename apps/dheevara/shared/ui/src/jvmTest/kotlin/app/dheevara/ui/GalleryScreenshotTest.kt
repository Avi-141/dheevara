package app.dheevara.ui

import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.test.ExperimentalTestApi
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.v2.runDesktopComposeUiTest
import androidx.compose.ui.unit.Density
import app.dheevara.ui.theme.DheevaraTheme
import com.github.takahirom.roborazzi.ExperimentalRoborazziApi
import io.github.takahirom.roborazzi.captureRoboImage
import kotlin.test.Test

/**
 * Renders the component gallery at the two phone sizes the mockups were reviewed at, at 2x like
 * the mockup shots in design/mockups/shots/. Baselines live in shared/ui/screenshots/.
 * Record with `./gradlew :shared:ui:recordRoborazziJvm`; CI runs `verifyRoborazziJvm`.
 */
@OptIn(ExperimentalTestApi::class, ExperimentalRoborazziApi::class)
class GalleryScreenshotTest {
    private fun shoot(page: GalleryPage, width: Int, height: Int) = runDesktopComposeUiTest(width = width * SCALE, height = height * SCALE) {
        setContent {
            CompositionLocalProvider(LocalDensity provides Density(SCALE.toFloat())) {
                DheevaraTheme { ComponentGallery(page) }
            }
        }
        onRoot().captureRoboImage("screenshots/${page.name.lowercase()}_${width}x$height.png")
    }

    @Test
    fun scene390x844() = shoot(GalleryPage.Scene, 390, 844)

    @Test
    fun scene360x740() = shoot(GalleryPage.Scene, 360, 740)

    @Test
    fun controls390x844() = shoot(GalleryPage.Controls, 390, 844)

    @Test
    fun controls360x740() = shoot(GalleryPage.Controls, 360, 740)

    private companion object {
        const val SCALE = 2
    }
}
