import { SystemStyleObject } from '@styled-system/css'
import React from 'react'
import { Link } from 'react-router-dom'
import { GridProps } from 'styled-system'

import AddressAvatar from 'components/@ui/AddressAvatar'
import { VerticalDivider } from 'components/@ui/Table/renderProps'
import { Flex, Image, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { parseProtocolImage } from 'utils/helpers/transform'

export function AccountWithProtocol({
  address,
  protocol,
  size = 40,
  sx,
  textSx,
}: {
  address: string
  protocol: ProtocolEnum
  size?: number
  sx?: SystemStyleObject & GridProps
  textSx?: SystemStyleObject & GridProps
}) {
  return (
    <Flex as={Link} to={generateTraderDetailsRoute(protocol, address)} sx={{ alignItems: 'center', gap: 3, ...sx }}>
      <AddressAvatar address={address} size={size} />
      <Type.Caption color="neutral1" width="74px" sx={{ ...textSx }}>
        {addressShorten(address)}
      </Type.Caption>
      <VerticalDivider />
      <Image src={parseProtocolImage(protocol)} width={20} height={20} />
    </Flex>
  )
}
