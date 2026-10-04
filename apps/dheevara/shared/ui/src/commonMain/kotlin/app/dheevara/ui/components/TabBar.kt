package app.dheevara.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import app.dheevara.ui.theme.DheevaraTheme

data class Tab(val label: String, val icon: DIcon)

@Composable
fun DTabBar(tabs: List<Tab>, selected: Int, onSelect: (Int) -> Unit, modifier: Modifier = Modifier, lang: String = "en") {
    val c = DheevaraTheme.colors
    Row(
        modifier
            .fillMaxWidth()
            .background(c.bg.copy(alpha = 0.92f))
            .drawBehind { drawLine(c.hair, Offset.Zero, Offset(size.width, 0f), 1.dp.toPx()) }
            .windowInsetsPadding(WindowInsets.navigationBars)
            .padding(top = 10.dp, bottom = 8.dp)
            .selectableGroup(),
        horizontalArrangement = Arrangement.SpaceAround,
    ) {
        tabs.forEachIndexed { i, tab ->
            val on = i == selected
            Column(
                Modifier.widthIn(min = 84.dp).selectable(selected = on, role = Role.Tab, onClick = { onSelect(i) }).padding(vertical = 2.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(5.dp),
            ) {
                val tint = if (on) c.fg else c.fg3
                DIconView(tab.icon, contentDescription = null, tint = tint)
                DText(tab.label, DheevaraTheme.type.tab, lang = lang, color = tint, maxLines = 1)
            }
        }
    }
}
