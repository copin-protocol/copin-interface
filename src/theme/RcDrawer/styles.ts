import { DrawerStyles } from 'rc-drawer/lib/inter'

import { themeColors } from 'theme/colors'

export function levelOneStyles(): DrawerStyles {
  return {
    mask: { background: 'rgba(0, 0, 0, 0.85)' },
    wrapper: { background: themeColors.neutral5 },
    content: { background: 'transparent' },
  }
}

export function levelTwoStyles(): DrawerStyles {
  return {
    mask: { background: 'rgba(0, 0, 0, 0.5)' },
    wrapper: { background: themeColors.neutral5 },
    content: { background: 'transparent' },
  }
}
