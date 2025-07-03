import { Trans } from '@lingui/macro'
import {
  ClockCounterClockwise,
  CopySimple,
  DotsThreeOutlineVertical,
  Exclude,
  Icon,
  PencilSimpleLine,
  Trash,
  Warning,
} from '@phosphor-icons/react'
import { Fragment, ReactNode } from 'react'

import AvatarGroup from 'components/@ui/Avatar/AvatarGroup'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import Divider from 'components/@ui/Divider'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import MarketGroup, { MarketGroupFull } from 'components/@ui/MarketGroup'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import TextWithEdit from 'components/@ui/TextWithEdit'
import { VerticalDivider } from 'components/@ui/VerticalDivider'
import ActionItem from 'components/@widgets/ActionItem'
import { CopyTradeModalConfigs } from 'hooks/features/useCopyTradeModalConfigs'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import { ColumnData } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { CopyTradePlatformEnum, CopyTradeSideEnum, CopyTradeStatusEnum } from 'utils/config/enums'
import { COPY_SIDE_TRANS } from 'utils/config/translations'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'
import { parseExchangeImage } from 'utils/helpers/transform'

import { ListCopyTradeType } from '../ListCopyTrade/types'
import TraderCopyAddress from '../TraderCopyAddress'
import TraderDisabledWarningIcon from '../TraderDisabledWarningIcon'
import { isCopyTradeRunningFn, validateNumberValue } from '../helpers'
import { CopyTradeModalType, CopyTradeWithCheckingData } from '../types'

type ColumnRenderer = NonNullable<ColumnData<CopyTradeWithCheckingData>['render']> // need to refactor this render to named variable

export const renderCopyTrader = ({
  data,
  options,
}: {
  data: CopyTradeWithCheckingData
  options?: {
    enabledQuickView?: boolean
    protocolNotAllowed?: boolean
    exchangeNotAllowed?: boolean
  }
}) => {
  const isRunning = isCopyTradeRunningFn(data.status)

  const isNotAllowed = options?.protocolNotAllowed || options?.exchangeNotAllowed

  return (
    <Box
      sx={{
        color: isRunning ? 'neutral1' : 'neutral3',
      }}
    >
      {data.multipleCopy ? (
        data.accounts && (
          <>
            <Flex
              sx={{
                alignItems: 'center',
                gap: 2,
                width: 'max-content',
                filter: isRunning ? 'none' : 'grayscale(1)',
              }}
              data-tooltip-id={data.id}
            >
              <div>
                <AvatarGroup addresses={data.accounts} size={24} />
              </div>
              <Type.Caption color="neutral4">|</Type.Caption>
              <ProtocolLogo protocol={data.protocol} size={20} hasText={false} />
              {isNotAllowed && <Type.Caption color="neutral4">|</Type.Caption>}
              {isNotAllowed && (
                <TraderDisabledWarningIcon
                  account={data.accounts?.join(',')}
                  protocol={data.protocol}
                  size={16}
                  hasTooltip={isRunning}
                  label={options?.protocolNotAllowed ? 'protocol' : 'exchange'}
                />
              )}
            </Flex>
            {isRunning && (
              <Tooltip id={data.id} clickable>
                <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                  {data.accounts.map((_a) => {
                    return (
                      <TraderCopyAddress
                        key={_a}
                        address={_a}
                        protocol={data.protocol}
                        options={{
                          hasCopyCountWarningIcon: false, // note
                          hasCopyVolumeWarningIcon: false, // note
                          copyVolume: data.copyVolume,
                          maxCopyVolume: data.maxVolume,
                          isRef: data.isRef,
                          plan: data.plan,
                          running: data.status === CopyTradeStatusEnum.RUNNING,
                          hasCopyTradeVolumeIcon: false, // NOTE
                          hasCopyAddress: true,
                          enabledQuickView: options?.enabledQuickView ?? true,
                        }}
                      />
                    )
                  })}
                </Flex>
              </Tooltip>
            )}
          </>
        )
      ) : (
        <TraderCopyAddress
          address={data.account}
          protocol={data.protocol}
          options={{
            sx: { filter: isRunning ? 'none' : 'grayscale(1)' },
            hasCopyCountWarningIcon: false, // note
            hasCopyVolumeWarningIcon: false, // note
            copyVolume: data.copyVolume,
            maxCopyVolume: data.maxVolume,
            isRef: data.isRef,
            plan: data.plan,
            hasDisabledWarningIcon: isNotAllowed,
            disabledLabel: options?.protocolNotAllowed ? 'protocol' : 'exchange',
            running: data.status === CopyTradeStatusEnum.RUNNING,
            // hasCopyTradeVolumeIcon: isRunning && !UNLIMITED_COPY_SIZE_EXCHANGES.includes(data.exchange),
            hasCopyTradeVolumeIcon: false, // note
            hasCopyAddress: true,
            enabledQuickView: options?.enabledQuickView ?? true,
          }}
        />
      )}
    </Box>
  )
}

export const renderTitle = (data: CopyTradeWithCheckingData) => {
  const isRunning = isCopyTradeRunningFn(data.status)
  return (
    <Flex sx={{ alignItems: 'center', gap: 2 }}>
      <Type.Caption
        maxWidth={104}
        color={isRunning ? 'neutral1' : 'neutral3'}
        sx={{ ...overflowEllipsis(), display: 'block' }}
        data-tooltip-id={`${data.id}_${data.title}`}
      >
        {data.title ? data.title : '--'}
      </Type.Caption>
      {data.title && isRunning && (
        <Tooltip id={`${data.id}_${data.title}`}>
          <Type.Caption sx={{ maxWidth: 350 }}>{data.title}</Type.Caption>
        </Tooltip>
      )}
    </Flex>
  )
}

export const renderVolumeFactory: (props: {
  isLite?: boolean
  balance?: number
  onSaveEdit: (value: string, oldData: CopyTradeWithCheckingData) => void
}) => ColumnRenderer = ({ isLite, balance, onSaveEdit }) =>
  function renderVolumn(data) {
    const tooltipId = 'tt_lite_balance_warning_' + data.id
    const isRunning = isCopyTradeRunningFn(data.status)
    return (
      <Flex
        color={isRunning ? 'neutral1' : 'neutral3'}
        sx={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        {isLite && isRunning && balance != null && balance < data.volume && (
          <>
            <Warning size={16} style={{ color: themeColors.orange1, marginRight: '6px' }} data-tooltip-id={tooltipId} />
            <Tooltip id={tooltipId}>
              <Type.Small sx={{ maxWidth: 250, textAlign: 'left' }}>
                <Trans>Your balance is too low for copy trading. Please Deposit now to continue!</Trans>
              </Type.Small>
            </Tooltip>
          </>
        )}
        <Type.Caption>$</Type.Caption>
        <TextWithEdit
          fullWidth
          key={`volume_${data.id}_${data.volume}`}
          defaultValue={data.volume}
          onSave={(value) => onSaveEdit(value, data)}
          onValidate={(value) => validateNumberValue({ value, field: 'volume' })}
          disabled={!isRunning}
        />
      </Flex>
    )
  }

export const renderLeverageFactory: (props: {
  onSaveEdit: (value: string, oldData: CopyTradeWithCheckingData) => void
}) => ColumnRenderer = ({ onSaveEdit }) =>
  function renderLeverage(data) {
    const isRunning = isCopyTradeRunningFn(data.status)
    return (
      <Flex
        color={isRunning ? 'neutral1' : 'neutral3'}
        sx={{ alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}
      >
        <Type.Caption>x</Type.Caption>
        <TextWithEdit
          key={`leverage_${data.id}_${data.leverage}`}
          defaultValue={data.leverage}
          onSave={(value) => onSaveEdit(value, data)}
          onValidate={(value) => validateNumberValue({ value, field: 'leverage' })}
          disabled={!isRunning}
        />
      </Flex>
    )
  }

export const renderMarkets = (data: CopyTradeWithCheckingData) => {
  const tooltipId = `tt_excluding_pairs_${data.id}`
  const hasExcludingPairs = data.copyAll && data.protocol && !!data.excludingTokenAddresses?.length
  const isRunning = isCopyTradeRunningFn(data.status)
  return (
    <>
      <Type.Caption
        color={isRunning ? 'neutral1' : 'neutral3'}
        data-tooltip-id={hasExcludingPairs ? tooltipId : undefined}
        sx={
          hasExcludingPairs
            ? { borderBottom: '1px dashed', mb: '-1px', borderBottomColor: 'neutral3', textDecoration: 'none' }
            : undefined
        }
      >
        {data.copyAll ? (
          <Flex width="100%" justifyContent="flex-start" alignItems="center" sx={{ gap: 1 }}>
            {hasExcludingPairs && <Exclude color={`${themeColors.red1}80`} />}
            <Trans>Follow Trader</Trans>
          </Flex>
        ) : data?.protocol && data?.tokenAddresses ? (
          <MarketGroup protocol={data.protocol} indexTokens={data.tokenAddresses} />
        ) : (
          '--'
        )}
        {hasExcludingPairs && (
          <Tooltip id={tooltipId} clickable>
            <Box>
              <Type.Caption mb={1} width="100%" color="neutral3" textAlign="left">
                Excluding pairs:
              </Type.Caption>
              <MarketGroupFull
                protocol={data.protocol}
                indexTokens={data.excludingTokenAddresses}
                hasName
                sx={{
                  maxWidth: 400,
                  maxHeight: 350,
                  overflowY: 'auto',
                  justifyContent: 'flex-start',
                }}
              />
            </Box>
          </Tooltip>
        )}
      </Type.Caption>
    </>
  )
}

export const renderRiskControl = (data: CopyTradeWithCheckingData) => {
  let settingsCount = 0
  const hasPositionSide = data.side !== CopyTradeSideEnum.BOTH
  const settings = [
    'maxVolMultiplier',
    'volumeProtection',
    'skipLowLeverage',
    'skipLowCollateral',
    'skipLowSize',
    ...(hasPositionSide ? ['side'] : []),
  ]
  settings.forEach((key) => {
    if (data[key as keyof CopyTradeWithCheckingData]) {
      settingsCount++
    }
  })
  const isRunning = isCopyTradeRunningFn(data.status)

  return (
    <Flex
      sx={{
        width: '100%',
        alignItems: 'center',
        justifyContent: ['end', 'start'],
        gap: 2,
        filter: isRunning ? undefined : 'grayscale(1)',
      }}
    >
      {settingsCount > 0 ? (
        <>
          <LabelWithTooltip
            id={`advanced_settings_${data.id}`}
            tooltip={
              <Box sx={{ '& *': { textAlign: 'left' } }}>
                {!!data.maxVolMultiplier && (
                  <Type.Caption color="neutral1" sx={{ maxWidth: 350 }} display="block">
                    Max Margin Per Position:{' '}
                    <Box as="span" color="primary1">
                      {`$${formatNumber(data.maxVolMultiplier * data.volume)}`}
                    </Box>
                  </Type.Caption>
                )}

                {!!data.volumeProtection && (
                  <>
                    <Type.Caption color="neutral1" display="block">
                      Margin Protection:{' '}
                      <Box as="span" color="primary1">
                        On
                      </Box>
                    </Type.Caption>
                    <Type.Caption color="neutral1" sx={{ maxWidth: 350 }} display="block">
                      Lookback:{' '}
                      <Box as="span" color="primary1">
                        {formatNumber(data.lookBackOrders || 0, 0, 0)} Orders
                      </Box>
                    </Type.Caption>
                  </>
                )}
                {!!data.side && data.side !== CopyTradeSideEnum.BOTH && (
                  <Type.Caption color="neutral1" sx={{ maxWidth: 350 }} display="block">
                    Position Side:{' '}
                    <Box as="span" color="primary1">
                      {COPY_SIDE_TRANS[data.side]}
                    </Box>
                  </Type.Caption>
                )}
                {!!data.skipLowLeverage && !!data.lowLeverage && (
                  <Type.Caption color="neutral1" sx={{ maxWidth: 350 }} display="block">
                    Skip Low Leverage Position:{' '}
                    <Box as="span" color="primary1">
                      On ({data.lowLeverage}x)
                    </Box>
                  </Type.Caption>
                )}
                {!!data.skipLowCollateral && !!data.lowCollateral && (
                  <Type.Caption color="neutral1" sx={{ maxWidth: 350 }} display="block">
                    Skip Low Collateral Position:{' '}
                    <Box as="span" color="primary1">
                      {`$${formatNumber(data.lowCollateral, 0, 0)}`}
                    </Box>
                  </Type.Caption>
                )}
                {!!data.skipLowSize && !!data.lowSize && (
                  <Type.Caption color="neutral1" sx={{ maxWidth: 350 }} display="block">
                    Skip Low Size Position:{' '}
                    <Box as="span" color="primary1">
                      {`$${formatNumber(data.lowSize, 0, 0)}`}
                    </Box>
                  </Type.Caption>
                )}
              </Box>
            }
          >
            <Type.Caption color={isRunning ? 'neutral1' : 'neutral3'} data-tooltip-id={`advanced_settings_${data.id}`}>
              {' '}
              {settingsCount} Settings
            </Type.Caption>
          </LabelWithTooltip>
        </>
      ) : (
        <Type.Caption>--</Type.Caption>
      )}
    </Flex>
  )
}

export const renderPnLFactory: (props: {
  key: keyof Pick<CopyTradeWithCheckingData, 'pnl' | 'pnl30D' | 'pnl7D'>
}) => ColumnRenderer = ({ key }) =>
  function renderVolumn(data) {
    const isRunning = isCopyTradeRunningFn(data.status)

    return (
      <SignedText
        isCompactNumber
        value={data[key]}
        maxDigit={2}
        minDigit={2}
        prefix="$"
        sx={isRunning ? undefined : { color: 'neutral3' }}
      />
    )
  }

export const renderOptionsFactory: (props: {
  handleOpenModal: CopyTradeModalConfigs['handleOpenModal']
  listCopyTradeType: ListCopyTradeType
}) => (data: CopyTradeWithCheckingData, placement?: any) => ReactNode = ({ handleOpenModal, listCopyTradeType }) =>
  function renderLeverage(data, placement) {
    return (
      <Flex justifyContent="end">
        <Dropdown
          buttonVariant="ghost"
          inline
          hasArrow={false}
          menuSx={{
            bg: 'neutral7',
            width: 100,
            transform: ['translateX(-32px)', 'none'],
          }}
          menu={
            <>
              {configs.map((v, index) => {
                const { title, icon: Icon, type } = v
                if (listCopyTradeType === 'lite' && v.type === 'clone') return <Fragment key={index} />
                return (
                  <Fragment key={index}>
                    <ActionItem
                      title={title}
                      icon={<Icon size={18} />}
                      onSelect={() => handleOpenModal({ data, modalType: type })}
                    />
                    {index === 0 && <Divider />}
                  </Fragment>
                )
              })}
            </>
          }
          sx={{}}
          placement={placement || 'topRight'}
        >
          <IconButton
            size={24}
            type="button"
            icon={<DotsThreeOutlineVertical size={16} weight="fill" />}
            variant="ghost"
            sx={{
              color: 'neutral3',
            }}
          />
        </Dropdown>
      </Flex>
    )
  }

export const renderCopyWalletLabel = ({
  walletName,
  exchange,
}: {
  walletName: string
  exchange: CopyTradePlatformEnum | undefined
}) => {
  return (
    <Flex sx={{ alignItems: 'center', gap: 2, '& > *': { flexShrink: 0 } }}>
      <Type.Caption
        color="neutral1"
        sx={{ maxWidth: '84px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {walletName}
      </Type.Caption>
      <VerticalDivider />
      {exchange && <Image src={parseExchangeImage(exchange)} width={20} height={20} />}
    </Flex>
  )
}

const configs: { title: ReactNode; icon: Icon; type: CopyTradeModalType }[] = [
  {
    title: <Trans>History</Trans>,
    icon: ClockCounterClockwise,
    type: 'history',
  },
  {
    title: <Trans>Edit</Trans>,
    icon: PencilSimpleLine,
    type: 'edit',
  },
  {
    title: <Trans>Clone</Trans>,
    icon: CopySimple,
    type: 'clone',
  },
  {
    title: <Trans>Remove</Trans>,
    icon: Trash,
    type: 'delete',
  },
]
