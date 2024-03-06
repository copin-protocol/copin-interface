import React from 'react'

import PythWatermarkImage from 'assets/images/pyth-watermark.svg'
import { Flex, Image, TextProps } from 'theme/base'
import { BoxProps } from 'theme/types'

const PythWatermark = ({ size = 24, textSx, sx, ...props }: { size?: number; textSx?: TextProps } & BoxProps) => {
  return (
    <Flex alignItems="center" sx={{ gap: 1, ...(sx || {}) }} {...props}>
      <Image src={PythWatermarkImage} height={size} />
    </Flex>
  )
}

export default PythWatermark
