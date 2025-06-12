import { HTMLAttributeAnchorTarget } from 'react'
import { Link } from 'react-router-dom'

import IconEye from 'assets/icons/ic-eye.svg'
import AddressAvatar from 'components/@ui/AddressAvatar'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useQuickViewTraderStore from 'hooks/store/useQuickViewTraderStore'
import { DisabledActionType } from 'pages/TraderDetails/TraderActionButtons'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum, TimeFrameEnum } from 'utils/config/enums'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'
import { EventCategory } from 'utils/tracking/types'

import AddressText from './AddressText'

export default function TraderAddress({
  address,
  protocol,
  options = {},
  hasHover = true,
  linkTarget,
  quickViewDisabledActions,
  quickViewDisabledLinkAccount,
  onPreview,
}: {
  address: string | undefined
  protocol?: ProtocolEnum
  options?: {
    wrapperSx?: any
    textSx?: any
    isLink?: boolean
    size?: number
    timeType?: TimeFilterByEnum | TimeFrameEnum
    eventCategory?: EventCategory
    hiddenAddressTooltip?: boolean
  }
  hasHover?: boolean
  linkTarget?: HTMLAttributeAnchorTarget
  quickViewDisabledActions?: DisabledActionType[]
  quickViewDisabledLinkAccount?: boolean

  onPreview?: () => void
}) {
  const { wrapperSx = {}, textSx = {}, isLink = true, size = 24, timeType } = options

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
          '&:hover': protocol && hasHover ? QUICKVIEW_HOVER_STYLE : {},
        }}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          if (protocol) {
            setTrader(
              { address, protocol, type: timeType as TimeFrameEnum, eventCategory: options?.eventCategory },
              { disabledActions: quickViewDisabledActions, disabledLinkAccount: quickViewDisabledLinkAccount }
            )
            onPreview?.()
          }
        }}
      >
        <AddressAvatar
          address={address}
          size={size}
          sx={{ '&:hover': protocol && hasHover ? { opacity: 0.25 } : {} }}
        />
      </Box>

      <Flex
        as={isLink ? Link : undefined}
        to={isLink ? generateTraderMultiExchangeRoute({ protocol, address, params: { time: timeType } }) : ''}
        onClick={(e: any) => e.stopPropagation()}
        alignItems="center"
        sx={{ gap: 2 }}
        target={linkTarget}
      >
        <AddressText address={address} sx={textSx} shouldShowTooltip={!options?.hiddenAddressTooltip} />
        {protocol && (
          <>
            <ProtocolLogo protocol={protocol} isActive={false} size={24} hasText={false} />
          </>
        )}
      </Flex>
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
