package app.dheevara.ui

import androidx.compose.ui.window.ComposeUIViewController
import platform.UIKit.UIViewController

/** Called from the iOS app's SwiftUI host. */
fun MainViewController(): UIViewController = ComposeUIViewController { DheevaraApp() }
