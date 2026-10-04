package app.dheevara.ui.components

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.snap
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.sizeIn
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import app.dheevara.ui.theme.DheevaraTheme
import app.dheevara.ui.theme.Dimens
import app.dheevara.ui.theme.LocalReduceMotion

/** A 50×30 switch in a 44-high target. Pass [onCheckedChange] null when a list row owns the toggling. */
@Composable
fun DToggle(checked: Boolean, onCheckedChange: ((Boolean) -> Unit)?, modifier: Modifier = Modifier) {
    val c = DheevaraTheme.colors
    val knob by animateDpAsState(
        targetValue = if (checked) 23.dp else 3.dp,
        animationSpec = if (LocalReduceMotion.current) snap() else tween(150),
    )
    Box(
        modifier
            .sizeIn(minWidth = Dimens.minTouch, minHeight = Dimens.minTouch)
            .then(if (onCheckedChange != null) Modifier.toggleable(checked, role = Role.Switch, onValueChange = onCheckedChange) else Modifier),
        contentAlignment = Alignment.Center,
    ) {
        Box(Modifier.size(50.dp, 30.dp).background(if (checked) c.fg else c.raise3, CircleShape)) {
            Box(Modifier.offset(x = knob, y = 3.dp).size(24.dp).background(if (checked) c.bg else c.fg2, CircleShape))
        }
    }
}
