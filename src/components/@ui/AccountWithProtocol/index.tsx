import { SystemStyleObject } from '@styled-system/css'
import { Link } from 'react-router-dom'
import { GridProps } from 'styled-system'

import AddressAvatar from 'components/@ui/AddressAvatar'
import { VerticalDivider } from 'components/@ui/Table/renderProps'
import { Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

import ProtocolLogo from '../ProtocolLogo'

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
    <Flex
      as={Link}
      to={generateTraderMultiExchangeRoute({ protocol, address })}
      sx={{ alignItems: 'center', gap: 3, ...sx }}
    >
      <AddressAvatar address={address} size={size} />
      <Type.Caption color="neutral1" width="74px" sx={{ ...textSx }}>
        {addressShorten(address)}
      </Type.Caption>
      <VerticalDivider />
      <ProtocolLogo protocol={protocol} isActive={false} hasText={false} size={24} />
    </Flex>
  )
}
