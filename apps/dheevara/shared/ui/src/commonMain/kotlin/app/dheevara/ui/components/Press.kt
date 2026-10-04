package app.dheevara.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.semantics.Role

/** Click handling shared by the components: dims while pressed instead of a ripple, which reads the same with reduce motion on. */
@Composable
internal fun Modifier.pressable(onClick: () -> Unit, role: Role, enabled: Boolean = true, label: String? = null): Modifier {
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    return this
        .alpha(if (!enabled) 0.4f else if (pressed) 0.75f else 1f)
        .clickable(interactionSource = interaction, indication = null, enabled = enabled, onClickLabel = label, role = role, onClick = onClick)
}
