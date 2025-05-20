import { Link, useLocation, useParams } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import IconEye from 'assets/icons/ic-eye.svg'
import AddressAvatar from 'components/@ui/AddressAvatar'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useQuickViewTraderStore from 'hooks/store/useQuickViewTraderStore'
import CopyButton from 'theme/Buttons/CopyButton'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { DATA_ATTRIBUTES, ELEMENT_CLASSNAMES } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

import TraderCopyCountWarningIcon from '../TraderCopyCountWarningIcon'
import TraderCopyVolumeWarningIcon, { TraderTotalCopyVolumeIcon } from '../TraderCopyVolumeWarningIcon'
import TraderDisabledWarningIcon from '../TraderDisabledWarningIcon'

export default function TraderCopyAddress({
  address,
  protocol,
  options: {
    sx = {},
    textSx = {},
    isLink = true,
    size = 24,
    dividerColor = 'neutral4',
    hasCopyAddress = false,
    hasAddressTooltip = false,
    hasCopyCountWarningIcon = false,
    hasCopyVolumeWarningIcon = false,
    hasCopyTradeVolumeIcon = false,
    hasDisabledWarningIcon = false,
    disabledLabel,
    copyVolume,
    maxCopyVolume,
    isRef,
    plan,
    running,
    enabledQuickView = true,
  } = {},
}: {
  address: string
  protocol?: ProtocolEnum
  options?: {
    sx?: any
    textSx?: any
    isLink?: boolean
    size?: number
    dividerColor?: string
    hasCopyAddress?: boolean
    hasAddressTooltip?: boolean
    hasCopyCountWarningIcon?: boolean
    hasCopyVolumeWarningIcon?: boolean
    hasCopyTradeVolumeIcon?: boolean
    hasDisabledWarningIcon?: boolean
    copyVolume?: number
    maxCopyVolume?: number
    isRef?: boolean
    running?: boolean
    plan?: SubscriptionPlanEnum
    enabledQuickView?: boolean
    disabledLabel?: string
  }
}) {
  const tooltipId = uuid()
  const { pathname } = useLocation()
  const params = useParams<{ address: string }>()

  const { setTrader } = useQuickViewTraderStore()

  const enabledLink =
    isLink &&
    !(params?.address?.toLowerCase() === address?.toLowerCase() && pathname.includes(ROUTES.TRADER_DETAILS.path_prefix))

  return (
    <Flex sx={{ alignItems: 'center', '& > *': { flexShrink: 0 }, gap: 1 }}>
      <Flex sx={{ gap: 1, flexShrink: 0, '& > *': { flexShrink: 0 }, ...sx }} alignItems="center">
        <Box
          width={size}
          height={size}
          sx={{
            '&:hover': enabledQuickView
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
            if (!enabledQuickView) return
            event.preventDefault()
            event.stopPropagation()
            if (protocol) {
              setTrader({ address, protocol })
            }
          }}
        >
          <AddressAvatar address={address} size={size} sx={{ '&:hover': enabledQuickView ? { opacity: 0.25 } : {} }} />
        </Box>
        <Flex
          //@ts-ignore
          as={enabledLink && protocol ? Link : undefined}
          to={enabledLink && protocol ? generateTraderMultiExchangeRoute({ protocol, address }) : undefined}
          onClick={(e) => enabledLink && e.stopPropagation()}
          alignItems="center"
          sx={{ gap: 1 }}
        >
          <Type.Caption
            minWidth="fit-content"
            className={ELEMENT_CLASSNAMES.TRADER_ADDRESS}
            color="inherit"
            {...{ [DATA_ATTRIBUTES.TRADER_COPY_DELETED]: address }}
            sx={{
              flexShrink: 0,
              color: 'neutral1',
              ':hover': { textDecoration: enabledLink ? 'underline' : undefined },
              minWidth: 74,
              ...textSx,
            }}
            {...(hasAddressTooltip ? { 'data-tooltip-id': tooltipId, 'data-tooltip-delay-show': 360 } : {})}
          >
            {addressShorten(address, 3, 5)}
          </Type.Caption>
          {hasCopyAddress && (
            <CopyButton
              type="button"
              variant="ghost"
              value={address}
              size="sm"
              sx={{ color: 'neutral3', p: 0 }}
              iconSize={14}
            ></CopyButton>
          )}
          {protocol && (
            <>
              <Type.Caption color={dividerColor}>|</Type.Caption>
              <ProtocolLogo protocol={protocol} hasText={false} size={20} />
            </>
          )}
          {hasAddressTooltip && (
            <Tooltip id={tooltipId}>
              <Type.Caption width="max-content">{address}</Type.Caption>
            </Tooltip>
          )}
          {(hasCopyCountWarningIcon || hasCopyVolumeWarningIcon || hasDisabledWarningIcon) && (
            <Type.Caption color={dividerColor}>|</Type.Caption>
          )}
          {hasDisabledWarningIcon && (
            <TraderDisabledWarningIcon
              account={address}
              protocol={protocol}
              size={16}
              hasTooltip={running}
              label={disabledLabel}
            />
          )}
          {hasCopyCountWarningIcon && <TraderCopyCountWarningIcon account={address} protocol={protocol} size={16} />}
          {hasCopyVolumeWarningIcon && (
            <TraderCopyVolumeWarningIcon account={address} protocol={protocol} size={16} copyVolume={copyVolume} />
          )}
          {hasCopyTradeVolumeIcon && copyVolume != null && maxCopyVolume && (
            <TraderTotalCopyVolumeIcon
              account={address}
              protocol={protocol}
              copyVolume={copyVolume}
              maxVolume={maxCopyVolume}
              isRef={isRef}
              plan={plan}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
