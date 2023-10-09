import React, { ReactNode } from 'react'

import { Flex, IconBox, Type } from 'theme/base'

const SectionTitle = ({
  icon,
  title,
  iconColor = 'neutral3',
  sx,
  suffix,
}: {
  icon: ReactNode
  title: ReactNode
  iconColor?: string
  sx?: any
  suffix?: ReactNode
}) => {
  return (
    <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2, pb: 12 }}>
      <Flex alignItems="center" sx={{ gap: 2, ...(sx ?? {}) }}>
        <IconBox color={iconColor} icon={icon} />
        <Type.BodyBold>{title}</Type.BodyBold>
      </Flex>
      {suffix}
    </Flex>
  )
}

export default SectionTitle
