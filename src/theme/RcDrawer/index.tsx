import { ArrowLeft, XCircle } from '@phosphor-icons/react'
import Drawer, { DrawerProps } from 'rc-drawer'
import 'rc-drawer/assets/index.css'
import { ReactNode } from 'react'

import SafeDropdownIndex from 'components/@widgets/SafeDropdownIndex'
import { Flex, IconBox } from 'theme/base'
import { themeColors } from 'theme/colors'

import motionProps from './motion'
import { levelOneStyles } from './styles'

export default function RcDrawer({
  children,
  styles,
  background = '#000000',
  height = '100%',
  maskColor = themeColors.modalBG1,
  placement = 'right',
  ...props
}: DrawerProps & { children: ReactNode; background?: string; height?: string; maskColor?: string }) {
  return (
    <>
      <Drawer
        destroyOnClose={false}
        placement={placement}
        keyboard
        styles={{
          ...levelOneStyles(),
          ...(styles || {}),
          mask: { background: maskColor, ...(styles?.mask || {}) },
          wrapper: { height, ...(styles?.wrapper || {}) },
          content: {
            background,
            height,
            [`border${placement === 'right' ? 'Left' : 'Top'}`]: `1px solid ${themeColors.neutral5}`,
            ...(styles?.content || {}),
          },
        }}
        {...props}
        {...motionProps}
      >
        <SafeDropdownIndex />
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
