package app.dheevara.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color

/** The root of the app on both platforms. Navigation and screens arrive in A3; the theme in A2. */
@Composable
fun DheevaraApp() {
    Box(Modifier.fillMaxSize().background(Color(0xFF0B0B0A)))
}
