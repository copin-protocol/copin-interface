import { useLocation, useParams } from 'react-router-dom'

import { AccountInfo, AvatarSize } from 'components/@ui/AccountInfo'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import CopyButton from 'theme/Buttons/CopyButton'
import { Flex, Type } from 'theme/base'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { ProtocolEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { DATA_ATTRIBUTES, ELEMENT_CLASSNAMES } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

import TraderCopyCountWarningIcon from '../TraderCopyCountWarningIcon'
import TraderCopyVolumeWarningIcon, { TraderTotalCopyVolumeIcon } from '../TraderCopyVolumeWarningIcon'
import TraderDisabledWarningIcon from '../TraderDisabledWarningIcon'

export default function CopiedTraderInfo({
  address,
  protocol,
  options: {
    wrapperSx = {},
    textSx = {},
    hasLink = true,
    avatarSize = 24,
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
    wrapperSx?: any
    textSx?: any
    hasLink?: boolean
    avatarSize?: AvatarSize
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
  const { pathname } = useLocation()
  const params = useParams<{ address: string }>()

  const enabledLink =
    hasLink &&
    !(params?.address?.toLowerCase() === address?.toLowerCase() && pathname.includes(ROUTES.TRADER_DETAILS.path_prefix))

  return (
    <Flex sx={{ alignItems: 'center', '& > *': { flexShrink: 0 }, gap: 1 }}>
      <Flex alignItems="center" sx={{ gap: 1 }}>
        <AccountInfo
          avatarSize={avatarSize}
          wrapperSx={wrapperSx}
          textSx={textSx}
          address={address}
          protocol={protocol || DEFAULT_PROTOCOL}
          shouldShowProtocol={false}
          hasLink={enabledLink}
          hasAddressTooltip={hasAddressTooltip}
          hasQuickView={enabledQuickView}
          addressWidth="fit-content"
          addressProps={{
            className: ELEMENT_CLASSNAMES.TRADER_ADDRESS,
            [DATA_ATTRIBUTES.TRADER_COPY_DELETED]: address,
          }}
        />
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
            <ProtocolLogo
              sx={{
                filter: running ? 'none' : 'grayscale(1)',
              }}
              protocol={protocol}
              hasText={false}
              size={20}
            />
          </>
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
  )
}
