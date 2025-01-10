import { HTMLAttributeAnchorTarget } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import IconEye from 'assets/icons/ic-eye.svg'
import AddressAvatar from 'components/@ui/AddressAvatar'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useQuickViewTraderStore from 'hooks/store/useQuickViewTraderStore'
import { DisabledActionType } from 'pages/TraderDetails/TraderActionButtons'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum, TimeFrameEnum } from 'utils/config/enums'
import { DATA_ATTRIBUTES, ELEMENT_CLASSNAMES } from 'utils/config/keys'
import { overflowEllipsis } from 'utils/helpers/css'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'
import { EventCategory } from 'utils/tracking/types'

export default function TraderAddress({
  address,
  protocol,
  options = {},
  hasHover = true,
  linkTarget,
  quickViewDisabledActions,
  onPreview,
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
    eventCategory?: EventCategory
  }
  hasHover?: boolean
  linkTarget?: HTMLAttributeAnchorTarget
  quickViewDisabledActions?: DisabledActionType[]

  onPreview?: () => void
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

  const { setTrader } = useQuickViewTraderStore()

  if (!address) return <></>
  return (
    <Flex
      // as={isLink && protocol ? Link : undefined}
      // to={isLink && protocol ? generateTraderMultiExchangeRoute({ protocol, address, params: { time: timeType } }) : ''}
      sx={{ gap: 2, ...wrapperSx }}
      alignItems="center"
      // onClick={(e) => e.stopPropagation()}
    >
      <Box
        width={size}
        height={size}
        sx={{
          '&:hover': hasHover ? QUICKVIEW_HOVER_STYLE : {},
        }}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          if (protocol) {
            setTrader(
              { address, protocol, type: timeType as TimeFrameEnum, eventCategory: options?.eventCategory },
              quickViewDisabledActions
            )
            onPreview?.()
          }
        }}
      >
        <AddressAvatar address={address} size={size} sx={{ '&:hover': hasHover ? { opacity: 0.25 } : {} }} />
      </Box>

      <Flex
        as={Link}
        to={generateTraderMultiExchangeRoute({ protocol, address, params: { time: timeType } })}
        onClick={(e: any) => e.stopPropagation()}
        alignItems="center"
        sx={{ gap: 2 }}
        target={linkTarget}
      >
        <Type.Caption
          className={ELEMENT_CLASSNAMES.TRADER_ADDRESS}
          color="inherit"
          {...{ [DATA_ATTRIBUTES.TRADER_COPY_DELETED]: address }}
          width={75}
          sx={{
            ...overflowEllipsis(),
            display: 'flex',
            color: 'neutral1',
            ':hover': { textDecoration: isLink ? 'underline' : undefined },
            ...textSx,
          }}
          {...(hasAddressTooltip ? { 'data-tooltip-id': tooltipId, 'data-tooltip-delay-show': 360 } : {})}
        >
          {addressShorten(address, 3, 5)}
        </Type.Caption>
        {protocol && (
          <>
            {/* <Type.Caption color={dividerColor}>|</Type.Caption> */}
            <ProtocolLogo protocol={protocol} isActive={false} size={24} hasText={false} />
          </>
        )}
      </Flex>
      {hasAddressTooltip && <Tooltip id={tooltipId}>{address}</Tooltip>}
    </Flex>
  )
}

export const QUICKVIEW_HOVER_STYLE = {
  cursor: 'pointer',
  backgroundImage: `url(${IconEye})`,
  backgroundSize: '20px',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
}
