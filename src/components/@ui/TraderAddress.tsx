import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import IconEye from 'assets/icons/ic-eye.svg'
import AddressAvatar from 'components/@ui/AddressAvatar'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useQuickViewTraderStore from 'hooks/store/useQuickViewTraderStore'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum, TimeFrameEnum } from 'utils/config/enums'
import { DATA_ATTRIBUTES, ELEMENT_CLASSNAMES } from 'utils/config/keys'
import { overflowEllipsis } from 'utils/helpers/css'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

export default function TraderAddress({
  address,
  protocol,
  options = {},
  hasHover = true,
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
  hasHover?: boolean
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
          '&:hover': hasHover
            ? {
                cursor: 'pointer',
                backgroundImage: `url(${IconEye})`,
                backgroundSize: '20px',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
              }
            : {},
        }}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          if (protocol) {
            setTrader({ address, protocol, type: timeType as TimeFrameEnum })
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
      >
        <Type.Caption
          className={ELEMENT_CLASSNAMES.TRADER_ADDRESS}
          color="inherit"
          {...{ [DATA_ATTRIBUTES.TRADER_COPY_DELETED]: address }}
          width={72}
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
            <Type.Caption color={dividerColor}>|</Type.Caption>
            <ProtocolLogo protocol={protocol} isActive={false} size={24} hasText={false} />
          </>
        )}
      </Flex>
      {hasAddressTooltip && <Tooltip id={tooltipId}>{address}</Tooltip>}
    </Flex>
  )
}
