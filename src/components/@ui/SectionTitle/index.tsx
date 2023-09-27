import React, { ReactNode } from 'react'

import { Flex, IconBox, Type } from 'theme/base'

const SectionTitle = ({
  icon,
  title,
  iconColor = 'neutral3',
  sx,
}: {
  icon: ReactNode
  title: string
  iconColor?: string
  sx?: any
}) => {
  return (
    <Flex alignItems="center" sx={{ gap: 2, pb: 12, ...(sx ?? {}) }}>
      <IconBox color={iconColor} icon={icon} />
      <Type.BodyBold>{title}</Type.BodyBold>
    </Flex>
  )
}

export default SectionTitle
