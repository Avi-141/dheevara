package app.dheevara.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import app.dheevara.ui.theme.DheevaraTheme
import app.dheevara.ui.theme.Dimens
import app.dheevara.ui.theme.LocalContentColor

/**
 * A 36-high chip inside a 44-high tap target (accessibility review, finding 16).
 * [selected] non-null makes it one of a single-choice group; [source] tints it amber because it names a source.
 */
@Composable
fun DChip(
    text: String,
    modifier: Modifier = Modifier,
    selected: Boolean? = null,
    source: Boolean = false,
    icon: DIcon? = null,
    lang: String = "en",
    onClick: (() -> Unit)? = null,
) {
    val c = DheevaraTheme.colors
    val (fill, content) = when {
        selected == true -> c.fg to c.bg
        source -> c.amberDim to c.amber
        else -> c.raise2 to c.fg
    }
    val target = when {
        onClick == null -> Modifier
        selected != null -> Modifier.selectable(selected = selected, role = Role.RadioButton, onClick = onClick)
        else -> Modifier.pressable(onClick, Role.Button)
    }
    Box(modifier.heightIn(min = Dimens.minTouch).then(target), contentAlignment = Alignment.Center) {
        Row(
            Modifier.heightIn(min = 36.dp).clip(RoundedCornerShape(50)).background(fill).padding(horizontal = 14.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            CompositionLocalProvider(LocalContentColor provides content) {
                if (icon != null) DIconView(icon, contentDescription = null, size = 16.dp)
                DText(text, DheevaraTheme.type.chip, lang = lang)
            }
        }
    }
}
