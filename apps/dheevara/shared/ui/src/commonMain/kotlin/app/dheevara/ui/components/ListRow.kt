package app.dheevara.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import app.dheevara.ui.theme.DheevaraTheme
import app.dheevara.ui.theme.Dimens

/** Rows on a raised, rounded group, as on the You and Controls screens. */
@Composable
fun DGroup(modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier.background(DheevaraTheme.colors.raise, RoundedCornerShape(Dimens.radiusCard)).padding(horizontal = 16.dp),
        content = content,
    )
}

/** What sits at the end of a row. */
sealed interface RowEnd {
    data object None : RowEnd
    data object Chevron : RowEnd
    data class Value(val text: String, val lang: String = "en", val chevron: Boolean = true) : RowEnd
    data class Toggle(val checked: Boolean, val onChange: (Boolean) -> Unit) : RowEnd
}

/**
 * A 56-high list row. A toggle row toggles from anywhere on the row and reads as a switch;
 * other rows with [onClick] read as buttons.
 */
@Composable
fun DListRow(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    icon: DIcon? = null,
    end: RowEnd = RowEnd.None,
    divider: Boolean = true,
    lang: String = "en",
    onClick: (() -> Unit)? = null,
) {
    val c = DheevaraTheme.colors
    val action = when {
        end is RowEnd.Toggle -> Modifier.toggleable(end.checked, role = Role.Switch, onValueChange = end.onChange)
        onClick != null -> Modifier.pressable(onClick, Role.Button)
        else -> Modifier.semantics(mergeDescendants = true) {}
    }
    Row(
        modifier
            .heightIn(min = 56.dp)
            .then(action)
            .drawBehind {
                if (divider) drawLine(c.hair, Offset(0f, size.height), Offset(size.width, size.height), 1.dp.toPx())
            }
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (icon != null) DIconView(icon, contentDescription = null, tint = c.fg2)
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
            DText(title, DheevaraTheme.type.rowTitle, lang = lang, color = c.fg)
            if (subtitle != null) DText(subtitle, DheevaraTheme.type.label, lang = lang, color = c.fg3)
        }
        when (end) {
            RowEnd.None -> Unit
            RowEnd.Chevron -> DIconView(DIcon.Chev, contentDescription = null, size = 18.dp, tint = c.fg3)
            is RowEnd.Value -> Row(horizontalArrangement = Arrangement.spacedBy(4.dp), verticalAlignment = Alignment.CenterVertically) {
                DText(end.text, DheevaraTheme.type.rowValue, lang = end.lang, color = c.fg2, maxLines = 1)
                if (end.chevron) DIconView(DIcon.Chev, contentDescription = null, size = 18.dp, tint = c.fg3)
            }
            is RowEnd.Toggle -> DToggle(end.checked, onCheckedChange = null)
        }
    }
}
