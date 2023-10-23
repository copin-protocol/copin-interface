import React, { ReactNode } from 'react'

import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex, Type } from 'theme/base'

const TitleWithIcon = ({
  title,
  icon,
  color = 'primary1',
  handleClick,
}: {
  title: ReactNode
  icon?: ReactNode
  color?: string
  handleClick?: () => void
}) => {
  return (
    <Flex pl={2} alignItems="center" sx={{ borderLeft: 'normal', borderColor: color, gap: 2 }}>
      <Type.BodyBold color="neutral1" display="block">
        {title}
      </Type.BodyBold>
      {icon && <ButtonWithIcon type="button" variant="ghostPrimary" icon={icon} onClick={handleClick} sx={{ p: 0 }} />}
    </Flex>
  )
}

export default TitleWithIcon
