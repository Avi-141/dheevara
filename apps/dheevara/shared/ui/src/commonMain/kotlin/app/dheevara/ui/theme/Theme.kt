package app.dheevara.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

private val LocalColors = staticCompositionLocalOf { DheevaraColors() }
private val LocalFonts = staticCompositionLocalOf<DheevaraFonts> { error("Wrap the UI in DheevaraTheme") }
private val LocalType = staticCompositionLocalOf<DheevaraType> { error("Wrap the UI in DheevaraTheme") }

/** Colour of text and icons in the current surface; a leaf card sets it to ink. */
val LocalContentColor = compositionLocalOf { Color(0xFFF4F2EE) }

/** Follows the OS setting by default (accessibility review, finding 11); the platform provides it. */
val LocalReduceMotion = staticCompositionLocalOf { false }

@Composable
fun DheevaraTheme(reduceMotion: Boolean = false, content: @Composable () -> Unit) {
    val colors = remember { DheevaraColors() }
    val fonts = loadFonts()
    val type = remember(fonts) { DheevaraType(fonts) }
    CompositionLocalProvider(
        LocalColors provides colors,
        LocalFonts provides fonts,
        LocalType provides type,
        LocalContentColor provides colors.fg,
        LocalReduceMotion provides reduceMotion,
        content = content,
    )
}

object DheevaraTheme {
    val colors: DheevaraColors
        @Composable @ReadOnlyComposable get() = LocalColors.current
    val fonts: DheevaraFonts
        @Composable @ReadOnlyComposable get() = LocalFonts.current
    val type: DheevaraType
        @Composable @ReadOnlyComposable get() = LocalType.current
}
