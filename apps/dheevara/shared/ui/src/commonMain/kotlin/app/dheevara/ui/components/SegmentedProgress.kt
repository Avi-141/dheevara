package app.dheevara.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.unit.dp
import app.dheevara.ui.theme.DheevaraTheme

/**
 * One segment per part of the chapter. Reads as a progress bar whose value is [stateDescription],
 * e.g. "Part 2 of 5" (accessibility review, finding 3).
 */
@Composable
fun DSegmentedProgress(
    segments: Int,
    current: Int,
    fraction: Float,
    stateDescription: String,
    modifier: Modifier = Modifier,
) {
    val c = DheevaraTheme.colors
    Row(
        modifier
            .widthIn(max = 210.dp)
            .clearAndSetSemantics {
                progressBarRangeInfo = ProgressBarRangeInfo((current + fraction.coerceIn(0f, 1f)) / segments, 0f..1f)
                this.stateDescription = stateDescription
            },
        horizontalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        repeat(segments) { i ->
            val filled = when {
                i < current -> 1f
                i == current -> fraction.coerceIn(0f, 1f)
                else -> 0f
            }
            Box(Modifier.weight(1f).height(3.dp).clip(RoundedCornerShape(2.dp)).background(c.fg.copy(alpha = 0.25f))) {
                if (filled > 0f) Box(Modifier.fillMaxHeight().fillMaxWidth(filled).background(c.fg))
            }
        }
    }
}
