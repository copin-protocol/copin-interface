import React from 'react'

import { Flex, Image, TextProps, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { ProtocolEnum } from 'utils/config/enums'

const ProtocolLogo = ({
  protocol,
  size = 18,
  textSx,
  ...props
}: { protocol: ProtocolEnum; size?: number; textSx?: TextProps } & BoxProps) => {
  return (
    <Flex height={size} alignItems="center" sx={{ gap: 2 }} {...props}>
      <Image src={`/images/protocols/${protocol}.png`} width={size} height={size} />
      <Type.Caption
        sx={{ textTransform: protocol === ProtocolEnum.GMX ? 'uppercase' : 'capitalize' }}
        lineHeight={`${size}px`}
        color="neutral2"
        {...textSx}
      >
        {protocol.toLowerCase()}
      </Type.Caption>
    </Flex>
  )
}

export default ProtocolLogo
