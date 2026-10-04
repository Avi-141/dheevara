package app.dheevara.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import app.dheevara.ui.theme.DheevaraTheme

/** The root of the app on both platforms. Navigation and screens arrive in A3. */
@Composable
fun DheevaraApp() {
    DheevaraTheme {
        Box(Modifier.fillMaxSize().background(DheevaraTheme.colors.bg))
    }
}
