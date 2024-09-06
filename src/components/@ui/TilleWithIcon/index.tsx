import React, { ReactNode } from 'react'

import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex, TextProps, Type } from 'theme/base'
import { SxProps } from 'theme/types'

const TitleWithIcon = ({
  title,
  icon,
  color = 'primary1',
  handleClick,
  sx,
  textSx,
}: {
  title: ReactNode
  icon?: ReactNode
  color?: string
  handleClick?: () => void
  textSx?: any
} & SxProps) => {
  return (
    <Flex pl={2} alignItems="center" sx={{ borderLeft: 'normal', borderColor: color, gap: 2, ...sx }}>
      <Type.BodyBold color="neutral1" display="block" sx={{ ...textSx }}>
        {title}
      </Type.BodyBold>
      {icon && <ButtonWithIcon type="button" variant="ghostPrimary" icon={icon} onClick={handleClick} sx={{ p: 0 }} />}
    </Flex>
  )
}

export default TitleWithIcon
