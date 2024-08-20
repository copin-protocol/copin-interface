import { Link } from 'react-router-dom'
import { v4 as uuid } from 'uuid'

import AddressAvatar from 'components/@ui/AddressAvatar'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import CopyButton from 'theme/Buttons/CopyButton'
import Tooltip from 'theme/Tooltip'
import { Flex, Type } from 'theme/base'
import { ProtocolEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { DATA_ATTRIBUTES, ELEMENT_CLASSNAMES } from 'utils/config/keys'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

import TraderCopyCountWarningIcon from '../TraderCopyCountWarningIcon'
import TraderCopyVolumeWarningIcon, { TraderTotalCopyVolumeIcon } from '../TraderCopyVolumeWarningIcon'

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
    copyVolume,
    maxCopyVolume,
    isRef,
    plan,
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
    copyVolume?: number
    maxCopyVolume?: number
    isRef?: boolean
    plan?: SubscriptionPlanEnum
  }
}) {
  const tooltipId = uuid()
  return (
    <Flex sx={{ alignItems: 'center', '& > *': { flexShrink: 0 }, gap: 1 }}>
      <Flex
        //@ts-ignore
        as={isLink && protocol ? Link : undefined}
        to={isLink && protocol ? generateTraderMultiExchangeRoute({ protocol, address }) : undefined}
        sx={{ gap: 1, flexShrink: 0, '& > *': { flexShrink: 0 }, ...sx }}
        alignItems="center"
        onClick={(e) => isLink && e.stopPropagation()}
      >
        <AddressAvatar address={address} size={size} />
        <Type.Caption
          minWidth="fit-content"
          className={ELEMENT_CLASSNAMES.TRADER_ADDRESS}
          color="inherit"
          {...{ [DATA_ATTRIBUTES.TRADER_COPY_DELETED]: address }}
          sx={{
            flexShrink: 0,
            color: 'neutral1',
            ':hover': { textDecoration: isLink ? 'underline' : undefined },
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
      </Flex>
      {hasAddressTooltip && <Tooltip id={tooltipId}>{address}</Tooltip>}
      {(hasCopyCountWarningIcon || hasCopyVolumeWarningIcon) && <Type.Caption color={dividerColor}>|</Type.Caption>}
      {hasCopyCountWarningIcon && <TraderCopyCountWarningIcon account={address} protocol={protocol} size={18} />}
      {hasCopyVolumeWarningIcon && (
        <TraderCopyVolumeWarningIcon account={address} protocol={protocol} size={18} copyVolume={copyVolume} />
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
  )
}
