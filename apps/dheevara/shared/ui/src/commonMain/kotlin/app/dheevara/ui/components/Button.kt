package app.dheevara.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import app.dheevara.ui.theme.DheevaraTheme
import app.dheevara.ui.theme.LocalContentColor

enum class ButtonKind {
    /** Off-white fill: the one thing to do next. */
    Primary,
    Secondary,

    /** Over a scene. */
    Glass,
    Line,
    Bare,

    /** On a leaf surface. */
    Ink,
}

/** A pill button. Grows with large text instead of clipping (accessibility review, finding 9). */
@Composable
fun DButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    kind: ButtonKind = ButtonKind.Secondary,
    small: Boolean = false,
    icon: DIcon? = null,
    filledIcon: Boolean = false,
    enabled: Boolean = true,
    lang: String = "en",
) {
    val c = DheevaraTheme.colors
    val (fill, content) = when (kind) {
        ButtonKind.Primary -> c.fg to c.bg
        ButtonKind.Secondary -> c.raise2 to c.fg
        ButtonKind.Glass -> c.glass to c.fg
        ButtonKind.Line -> Color.Transparent to c.fg
        ButtonKind.Bare -> Color.Transparent to c.fg2
        ButtonKind.Ink -> c.ink to c.leaf
    }
    val shape = RoundedCornerShape(50)
    Row(
        modifier = modifier
            .heightIn(min = if (small) 44.dp else 52.dp)
            .clip(shape)
            .background(fill)
            .then(if (kind == ButtonKind.Line || kind == ButtonKind.Glass) Modifier.border(1.dp, c.hair2, shape) else Modifier)
            .pressable(onClick, Role.Button, enabled)
            .padding(horizontal = if (small) 18.dp else 22.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp, Alignment.CenterHorizontally),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(LocalContentColor provides content) {
            if (icon != null) DIconView(icon, contentDescription = null, size = if (small) 18.dp else 20.dp, filled = filledIcon)
            DText(
                text = text,
                style = if (small) DheevaraTheme.type.buttonSmall else DheevaraTheme.type.button,
                lang = lang,
                align = TextAlign.Center,
            )
        }
    }
}
