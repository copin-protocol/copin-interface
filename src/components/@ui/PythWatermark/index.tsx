import { useResponsive } from 'ahooks'
import React from 'react'

import PythLogo from 'assets/images/pyth-logo.svg'
import PythWordmark from 'assets/images/pyth-wordmark.svg'
import { Flex, Image, TextProps, Type } from 'theme/base'
import { BoxProps } from 'theme/types'

const PythWatermark = ({ size = 24, textSx, sx, ...props }: { size?: number; textSx?: TextProps } & BoxProps) => {
  const { lg } = useResponsive()
  const scaleSize = lg ? size : size * 0.6
  return (
    <Flex alignItems="center" sx={{ gap: 1, ...(sx || {}) }} {...props}>
      <Image src={PythLogo} width={scaleSize} height={scaleSize} />
      <Flex flexDirection="column" alignItems="center" sx={{ gap: 0 }}>
        <Type.Small fontSize="8px" color="#E6DAFE" {...textSx}>
          {lg ? 'Price Feed powered by' : 'Powered by'}
        </Type.Small>
        <Image src={PythWordmark} height={scaleSize / 2} />
      </Flex>
    </Flex>
  )
}

export default PythWatermark
