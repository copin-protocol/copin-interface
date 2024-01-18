import { ArrowLeft, XCircle } from '@phosphor-icons/react'
import Drawer, { DrawerProps } from 'rc-drawer'
import 'rc-drawer/assets/index.css'
import { ReactNode } from 'react'
import { createGlobalStyle } from 'styled-components/macro'

import { Flex, IconBox } from 'theme/base'

import motionProps from './motion'
import { levelOneStyles } from './styles'

export default function RcDrawer({ children, styles, ...props }: DrawerProps & { children: ReactNode }) {
  return (
    <>
      <RcDrawerStyle />
      <Drawer
        destroyOnClose={false}
        placement="right"
        styles={{ ...levelOneStyles(), ...styles }}
        {...props}
        {...motionProps}
      >
        {children}
      </Drawer>
    </>
  )
}

export function DrawerTitle({
  title,
  onClose,
  onBack,
}: {
  title: ReactNode
  onClose: () => void
  onBack?: () => void
}) {
  return (
    <Flex sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', gap: 3 }}>
      {!!onBack && (
        <IconBox
          role="button"
          icon={<ArrowLeft size={20} />}
          color="neutral1"
          sx={{ '&:hover': { color: 'neutral2' } }}
          onClick={onBack}
        />
      )}
      {title}
      <IconBox
        role="button"
        icon={<XCircle size={20} />}
        color="neutral3"
        sx={{ '&:hover': { color: 'neutral2' } }}
        onClick={onClose}
      />
    </Flex>
  )
}

export const RcDrawerStyle = createGlobalStyle`
.drawer {
  .ant-menu-inline,
  .ant-menu-vertical {
    border-right: none;
  }
  &-content {
    padding-top: 40px;
  }
  &-left {
    .ant-menu-inline .ant-menu-item:after,
    .ant-menu-vertical .ant-menu-item:after {
      left: 0;
      right: auto;
    }
  }
}

.drawer-wrapper {
  .drawer {
    animation: AlphaTo .3s ease-out .3s;
    animation-fill-mode: forwards;
    opacity: 0;
  }
}

@keyframes AlphaTo {
  to {
    opacity: 1;
    left: 0;
  }
}

.parent-demo {
  position: relative;
  overflow: hidden;
  .drawer {
    position: absolute;
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
}
`
