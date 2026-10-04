package app.dheevara.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.heightIn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.onClick
import androidx.compose.ui.semantics.role
import androidx.compose.ui.unit.dp
import app.dheevara.ui.theme.DheevaraTheme
import app.dheevara.ui.theme.Dimens

/**
 * A verse id in amber with the leaf: the visible half of rule 2. [description] is what a screen
 * reader says, e.g. "Source: Mahābhārata, Droṇa Parva 7.34.19, open the page".
 */
@Composable
fun DCite(citation: String, description: String, modifier: Modifier = Modifier, onClick: (() -> Unit)? = null) {
    val amber = DheevaraTheme.colors.amber
    Row(
        modifier
            .heightIn(min = Dimens.minTouch)
            .then(if (onClick != null) Modifier.pressable(onClick, Role.Button) else Modifier)
            .clearAndSetSemantics {
                contentDescription = description
                if (onClick != null) {
                    role = Role.Button
                    onClick { onClick(); true }
                }
            },
        horizontalArrangement = Arrangement.spacedBy(6.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        DIconView(DIcon.Leaf, contentDescription = null, size = 18.dp, tint = amber)
        DText(citation, DheevaraTheme.type.cite, color = amber, maxLines = 1)
    }
}
