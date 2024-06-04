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

const transition = `
  &-enter,
  &-appear,
  &-leave {
    &-start {
      transition: none!important;
    }

    &-active {
      transition: all 0.3s;
    }
  }
`

export const drawerStyles = `
.rc-drawer-bottom {
  .rc-drawer-content-wrapper {
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
  }
}

.mask-motion {
  &-enter,
  &-appear,
  &-leave {
    &-active {
      transition: all 0.3s;
    }
  }

  &-enter,
  &-appear {
    opacity: 0;

    &-active {
      opacity: 1;
    }
  }

  &-leave {
    opacity: 1;

    &-active {
      opacity: 0;
    }
  }
}

.panel-motion {
  &-left {
    ${transition}

    &-enter,
    &-appear {
      transform: translateX(-100%);

      &-active {
        transform: translateX(0);
      }
    }

    &-leave {
      transform: translateX(0);

      &-active {
        transform: translateX(-100%)!important;
      }
    }
  }

  &-right {
    ${transition}

    &-enter,
    &-appear {
      transform: translateX(100%);

      &-active {
        transform: translateX(0);
      }
    }

    &-leave {
      transform: translateX(0);

      &-active {
        transform: translateX(100%)!important;
      }
    }
  }

  &-bottom {
    ${transition}

    &-enter,
    &-appear {
      transform: translateY(100%);

      &-active {
        transform: translateY(0);
      }
    }

    &-leave {
      transform: translateY(0);

      &-active {
        transform: translateY(100%)!important;
      }
    }
  }
}
`
