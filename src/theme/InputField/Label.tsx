import React, { ReactNode } from 'react'

import { Box, Flex, Type } from 'theme/base'
import { Colors } from 'theme/types'

const Label = ({
  label,
  error,
  columnGap = 8,
  required,
  annotation,
  labelColor = 'neutral2',
  bold = false,
  wrapperProps = {},
}: {
  label: ReactNode
  columnGap?: number
  error?: any
  required?: boolean
  annotation?: ReactNode
  labelColor?: keyof Colors
  bold?: boolean
  wrapperProps?: any
}) => {
  const Caption = bold ? Type.CaptionBold : Type.Caption
  const Small = bold ? Type.CaptionBold : Type.Caption
  return (
    <Flex justifyContent={annotation ? 'space-between' : 'start'} alignItems="baseline" {...wrapperProps}>
      <Box sx={{ lineHeight: 0 }}>
        <Caption color={error ? 'red1' : labelColor} mb={columnGap} fontWeight={600}>
          {label}
        </Caption>
        {required && (
          <Caption color="red1" ml="2px">
            *
          </Caption>
        )}
      </Box>
      {!!annotation && (
        <Small color="neutral3" mb="8px">
          {annotation}
        </Small>
      )}
    </Flex>
  )
}
export default Label
