import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'
import { GridProps } from 'styled-system'

import Dropdown from 'theme/Dropdown'
import { Flex, IconBox, Type } from 'theme/base'

type PreferencesPanelProps = {
  textFull?: string
  textShort?: string
  icon?: ReactNode
  menu: ReactNode
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
  menuPosition?: 'top' | 'bottom'
  buttonSx?: SystemStyleObject & GridProps
  menuSx?: any
  textColor?: string
}

export const PreferencesPanel = ({
  textFull = 'Preferences',
  textShort = 'Prefs',
  icon,
  menu,
  placement = 'topLeft',
  menuPosition = 'top',
  buttonSx,
  menuSx,
  textColor = 'neutral3',
}: PreferencesPanelProps) => {
  const { sm } = useResponsive()

  return (
    <Dropdown
      menu={menu}
      hasArrow={false}
      dismissible={false}
      menuDismissible={true}
      menuPosition={menuPosition}
      placement={placement}
      sx={{ display: 'inline-block' }}
      menuSx={{
        position: 'absolute',
        bottom: menuPosition === 'top' ? '100%' : undefined,
        top: menuPosition === 'bottom' ? '100%' : undefined,
        zIndex: 1,
        ...menuSx,
      }}
      buttonSx={{
        border: 'none',
        p: 0,
        ...buttonSx,
      }}
    >
      <Flex alignItems="center">
        {icon && <IconBox icon={icon} />}
        <Type.Caption className="text" color={textColor} ml="4px">
          {sm ? textFull : textShort}
        </Type.Caption>
      </Flex>
    </Dropdown>
  )
}
