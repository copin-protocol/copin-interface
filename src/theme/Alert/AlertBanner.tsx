import { Info, Warning } from '@phosphor-icons/react'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { SxProps } from 'theme/types'

import { Variant } from './types'

type AlertBannerProps = {
  id: string
  type: Variant
  message: ReactNode
  action?: ReactNode
  onClick?: () => void
  link?: string
}

export const getAlertProperty = (type: Variant) => {
  switch (type) {
    case 'success':
      return { color: themeColors.green1, icon: Info }
    case 'danger':
      return { color: themeColors.red1, icon: Warning }
    case 'warning':
      return { color: themeColors.orange1, icon: Warning }
    default:
      return { color: themeColors.primary1, icon: Info }
  }
}

const AlertBanner = ({ id, type, message, action, onClick, link, sx }: AlertBannerProps & SxProps) => {
  const { icon: Icon, color } = getAlertProperty(type)
  return (
    <Flex
      id={id}
      sx={{
        flexShrink: 0,
        position: 'relative',
        width: '100%',
        height: 'max-content',
        overflow: 'hidden',
        bg: `${color}15`,
        p: '8px 16px',
        transition: '0.3s',
        flexDirection: ['column', 'row', 'row', 'row'],
        alignItems: ['start', 'center', 'center', 'center'],
        justifyContent: 'center',
        columnGap: 2,
        color,
        ...(sx || {}),
      }}
    >
      <Type.Caption as={link ? Link : undefined} to={link ? link : undefined} onClick={onClick}>
        <IconBox icon={<Icon size={16} />} mr={2} />
        {message}
      </Type.Caption>
      {action}
    </Flex>
  )
}

export default AlertBanner
