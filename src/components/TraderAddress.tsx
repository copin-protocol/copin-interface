import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import Tooltip from 'theme/Tooltip'
import { Flex, Image, Type } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum, TimeFrameEnum } from 'utils/config/enums'
import { ELEMENT_CLASSNAMES } from 'utils/config/keys'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { parseProtocolImage } from 'utils/helpers/transform'

import AddressAvatar from './@ui/AddressAvatar'

export default function TraderAddress({
  address,
  protocol,
  options = {},
}: {
  address: string | undefined
  protocol?: ProtocolEnum
  options?: {
    wrapperSx?: any
    textSx?: any
    isLink?: boolean
    size?: number
    dividerColor?: string
    hasAddressTooltip?: boolean
    timeType?: TimeFilterByEnum | TimeFrameEnum
  }
}) {
  const {
    wrapperSx = {},
    textSx = {},
    isLink = true,
    size = 24,
    dividerColor = 'neutral4',
    hasAddressTooltip = false,
    timeType,
  } = options
  const tooltipId = uuid()
  if (!address) return <></>
  return (
    <Flex
      as={isLink && protocol ? Link : undefined}
      to={isLink && protocol ? generateTraderDetailsRoute(protocol, address, { type: timeType }) : ''}
      sx={{ gap: 2, ...wrapperSx }}
      alignItems="center"
    >
      <AddressAvatar address={address} size={size} />
      <Type.Caption
        className={ELEMENT_CLASSNAMES.TRADER_ADDRESS}
        color="inherit"
        data-trader-address={address}
        sx={{ color: 'neutral1', ':hover': { textDecoration: isLink ? 'underline' : undefined }, ...textSx }}
        {...(hasAddressTooltip ? { 'data-tooltip-id': tooltipId, 'data-tooltip-delay-show': 360 } : {})}
      >
        {addressShorten(address, 3, 5)}
      </Type.Caption>
      {protocol && (
        <>
          <Type.Caption color={dividerColor}>|</Type.Caption>
          <Image src={parseProtocolImage(protocol)} width={16} height={16} />
        </>
      )}
      {hasAddressTooltip && <Tooltip id={tooltipId}>{address}</Tooltip>}
    </Flex>
  )
}
