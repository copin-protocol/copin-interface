import React, { ComponentType, ReactNode } from 'react'

import { Flex, IconBox, Type } from 'theme/base'

const SectionTitle = ({
  icon: Icon,
  title,
  iconColor = 'neutral1',
  sx,
  suffix,
}: {
  icon: ComponentType<any>
  title: ReactNode
  iconColor?: string
  sx?: any
  suffix?: ReactNode
}) => {
  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
      <Flex alignItems="center" sx={{ gap: 2, mb: 12, ...(sx ?? {}) }}>
        <IconBox color={iconColor} icon={<Icon size={20} weight="fill" />} />
        <Type.Body>{title}</Type.Body>
      </Flex>
      {suffix}
    </Flex>
  )
}

export default SectionTitle
