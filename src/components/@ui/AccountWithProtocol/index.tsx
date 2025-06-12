import { SystemStyleObject } from '@styled-system/css'
import { Link } from 'react-router-dom'
import { GridProps } from 'styled-system'

import AddressAvatar from 'components/@ui/AddressAvatar'
import { Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

import AddressText from '../AddressText'
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
      <AddressText address={address} sx={textSx} />
      <ProtocolLogo protocol={protocol} isActive={false} hasText={false} size={24} />
    </Flex>
  )
}
