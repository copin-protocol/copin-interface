import React, { ComponentType, ReactNode } from 'react'

import { Flex, IconBox, Type } from 'theme/base'

const SectionTitle = ({
  icon: Icon,
  title,
  iconColor = 'neutral1',
  sx,
  wrapperSx,
  suffix,
  suffixPlacement = 'space-between',
}: {
  icon: ComponentType<any>
  title: ReactNode
  iconColor?: string
  sx?: any
  wrapperSx?: any
  suffix?: ReactNode
  suffixPlacement?:
    | 'center'
    | 'end'
    | 'flex-end'
    | 'flex-start'
    | 'start'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
    | 'stretch'
}) => {
  return (
    <Flex
      alignItems="center"
      justifyContent={suffixPlacement}
      flexWrap="wrap"
      sx={{ gap: 2, width: '100%', ...(wrapperSx ?? {}) }}
    >
      <Flex alignItems="center" sx={{ gap: 2, mb: 12, ...(sx ?? {}) }}>
        <IconBox color={iconColor} icon={<Icon size={20} weight="fill" />} />
        <Type.Body>{title}</Type.Body>
      </Flex>
      {suffix}
    </Flex>
  )
}

export default SectionTitle
