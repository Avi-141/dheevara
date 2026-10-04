package app.dheevara.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import app.dheevara.ui.theme.DheevaraTheme
import app.dheevara.ui.theme.Dimens
import app.dheevara.ui.theme.LocalContentColor

/** The palm-leaf surface: the only warm surface, where text that is a source lives. Ruled like a leaf. */
@Composable
fun DLeafCard(
    modifier: Modifier = Modifier,
    radius: Dp = Dimens.radiusCardLarge,
    content: @Composable ColumnScope.() -> Unit,
) {
    val c = DheevaraTheme.colors
    val rule = c.ink2.copy(alpha = 0.045f)
    Column(
        modifier
            .clip(RoundedCornerShape(radius))
            .background(c.leaf)
            .drawBehind {
                val step = 5.dp.toPx()
                var y = 0f
                while (y < size.height) {
                    drawLine(rule, Offset(0f, y), Offset(size.width, y), strokeWidth = 1.dp.toPx())
                    y += step
                }
            }
            .padding(horizontal = 18.dp, vertical = 16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        CompositionLocalProvider(LocalContentColor provides c.ink) { content() }
    }
}
