package app.dheevara.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.unit.dp
import app.dheevara.ui.theme.DheevaraTheme

/**
 * The label over a scene: "AI scene · Seen with Sañjaya". The AI label is on every scene; callers
 * pass it localised. Read as one phrase by screen readers.
 */
@Composable
fun DPill(parts: List<String>, modifier: Modifier = Modifier, lang: String = "en", dot: Boolean = true) {
    val c = DheevaraTheme.colors
    val shape = RoundedCornerShape(50)
    Row(
        modifier
            .heightIn(min = 30.dp)
            .background(c.scrim, shape)
            .border(1.dp, c.hair2, shape)
            .padding(horizontal = 12.dp, vertical = 4.dp)
            .clearAndSetSemantics { contentDescription = parts.joinToString(", ") },
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (dot) Box(Modifier.size(6.dp).background(c.amber, CircleShape))
        parts.forEachIndexed { i, part ->
            if (i > 0) Box(Modifier.width(1.dp).height(12.dp).background(c.hair2))
            DText(part, DheevaraTheme.type.micro, lang = lang, color = c.fg, maxLines = 1)
        }
    }
}
