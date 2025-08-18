import AddressAvatar from 'components/@ui/AddressAvatar'
import { Flex } from 'theme/base'

import { AvatarSize } from './AccountInfo'
import AddressText from './AddressText'

export default function TraderAddress({
  address,
  wrapperSx,
  textSx,
  avatarSize = 24,
  hasAddressTooltip,
}: {
  address: string | undefined
  wrapperSx?: any
  textSx?: any
  avatarSize?: AvatarSize
  hasAddressTooltip?: boolean
}) {
  if (!address) return <></>
  return (
    <Flex
      // as={isLink && protocol ? Link : undefined}
      // to={isLink && protocol ? generateTraderMultiExchangeRoute({ protocol, address, params: { time: timeType } }) : ''}
      sx={{ gap: 2, ...wrapperSx }}
      alignItems="center"
      // onClick={(e) => e.stopPropagation()}
    >
      <AddressAvatar address={address} size={avatarSize} />
      <AddressText address={address} sx={textSx} shouldShowTooltip={hasAddressTooltip} />
    </Flex>
  )
}
