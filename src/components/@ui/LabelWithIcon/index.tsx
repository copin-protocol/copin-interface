import { SystemStyleObject } from '@styled-system/css'
import { ReactNode } from 'react'
import { GridProps } from 'styled-system'

import { Flex, IconBox, Type } from 'theme/base'

const LabelWithIcon = ({
  text,
  icon,
  iconSize = 24,
  iconColor = 'primary1',
  sx = {},
}: {
  text: ReactNode
  icon: ReactNode
  iconSize?: number
  iconColor?: string
  sx?: SystemStyleObject & GridProps
}) => {
  return (
    <Flex alignItems="center" sx={{ gap: 2, ...sx }}>
      <IconBox icon={icon} color={iconColor} size={iconSize} />
      <Type.Body color="neutral1" sx={{}}>
        {text}
      </Type.Body>
    </Flex>
  )
}

export default LabelWithIcon
