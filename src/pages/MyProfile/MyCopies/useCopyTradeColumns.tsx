import { Trans } from '@lingui/macro'
import {
  ClockCounterClockwise,
  CopySimple,
  DotsThreeOutlineVertical,
  Exclude,
  PencilSimpleLine,
  Trash,
} from '@phosphor-icons/react'
import { MutableRefObject, SetStateAction, useCallback, useMemo } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { updateCopyTradeApi } from 'apis/copyTradeApis'
import TraderCopyAddress from 'components/@copyTrade/TraderCopyAddress'
import { renderSLTPSetting } from 'components/@position/configs/copyPositionRenderProps'
import AvatarGroup from 'components/@ui/Avatar/AvatarGroup'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import Divider from 'components/@ui/Divider'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import MarketGroup, { MarketGroupFull } from 'components/@ui/MarketGroup'
import ReverseTag from 'components/@ui/ReverseTag'
import TextWithEdit, { parseInputValue } from 'components/@ui/TextWithEdit'
import ToastBody from 'components/@ui/ToastBody'
import { CopyTradeData } from 'entities/copyTrade'
import { useCheckCopyTradeAction } from 'hooks/features/useSubscriptionRestrict'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import MarginProtectionIcon from 'theme/Icons/MarginProtectionIcon'
import MaxMarginIcon from 'theme/Icons/MaxMarginIcon'
import SkipLowCollateralIcon from 'theme/Icons/SkipLowCollateralIcon'
import SkipLowLeverageIcon from 'theme/Icons/SkipLowLeverageIcon'
import SkipLowSizeIcon from 'theme/Icons/SkipLowSizeIcon'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { ColumnData } from 'theme/Table/types'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { CopyTradeStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, TOOLTIP_KEYS } from 'utils/config/keys'
import { TOOLTIP_CONTENT } from 'utils/config/options'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'
import { getErrorMessage } from 'utils/helpers/handleError'
import { getProtocolDropdownImage } from 'utils/helpers/transform'

import ActionItem from './ActionItem'
import { CopyTradeWithCheckingData } from './ListCopyTrade'

export default function useCopyTradeColumns({
  onSelect,
  isMutating,
  setOpenHistoryDrawer,
  setOpenDrawer,
  setOpenCloneDrawer,
  setOpenDeleteModal,
  setOpenConfirmStopModal,
  toggleStatus,
  copyTradeData,
}: {
  onSelect: (data?: CopyTradeWithCheckingData) => void
  isMutating: boolean
  setOpenHistoryDrawer: (value: SetStateAction<boolean>) => void
  setOpenDrawer: (value: SetStateAction<boolean>) => void
  setOpenCloneDrawer: (value: SetStateAction<boolean>) => void
  setOpenDeleteModal: (value: SetStateAction<boolean>) => void
  setOpenConfirmStopModal: (value: SetStateAction<boolean>) => void
  toggleStatus: ({
    id,
    currentStatus,
    multipleCopy,
  }: {
    id: string
    currentStatus: CopyTradeStatusEnum
    multipleCopy: boolean
  }) => void
  copyTradeData: MutableRefObject<CopyTradeWithCheckingData | undefined>
}) {
  const refetchQueries = useRefetchQueries()
  const { mutate: updateCopyTrade } = useMutation(updateCopyTradeApi, {
    onSuccess: async (data) => {
      toast.success(<ToastBody title="Success" message="Your update has been succeeded" />)
      refetchQueries([QUERY_KEYS.GET_COPY_TRADE_SETTINGS])
    },
    onError: (err) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(err)} />)
    },
  })
  const { checkIsEligible } = useCheckCopyTradeAction()
  const toggleStatusCopyTrade = useCallback(
    (item: CopyTradeWithCheckingData) => {
      if (isMutating) return
      onSelect(item)
      if (item.status === CopyTradeStatusEnum.STOPPED) {
        if (!checkIsEligible()) {
          return
        }
        toggleStatus({ id: item.id, currentStatus: item.status, multipleCopy: item.multipleCopy })
        return
      }
      if (item.status === CopyTradeStatusEnum.RUNNING) {
        setOpenConfirmStopModal(true)
        return
      }
    },
    [checkIsEligible, isMutating, onSelect, setOpenConfirmStopModal, toggleStatus]
  )
  const updateNumberValue = ({
    copyTradeId,
    oldData,
    value,
    field,
  }: {
    copyTradeId: string
    oldData: CopyTradeData
    value: string
    field: keyof CopyTradeData
  }) => {
    if (typeof value !== 'string') return
    const numberValue = parseInputValue(value)
    updateCopyTrade({
      copyTradeId,
      data: {
        account: oldData.account,
        accounts: oldData.accounts,
        multipleCopy: oldData.multipleCopy,
        [field]: numberValue,
      },
    })
  }
  const validateNumberValue = ({
    oldData,
    value,
    field,
  }: {
    oldData: CopyTradeData
    value: string
    field: keyof CopyTradeData
  }) => {
    if (typeof value !== 'string') return
    const numberValue = parseInputValue(value)
    switch (field) {
      case 'volume':
        // if (DCP_EXCHANGES.includes(oldData.exchange) && numberValue < 60) {
        //   toast.error(<ToastBody title="Error" message="DCP Volume must be greater than or equal to $60" />)
        //   return
        // }
        if (numberValue > 100000) {
          toast.error(<ToastBody title="Error" message="Volume must be less than $100,000" />)
          return
        }
        return true
      case 'leverage':
        if (numberValue < 2) {
          toast.error(<ToastBody title="Error" message="Leverage must be greater than or equal to 2" />)
          return
        }
        if (numberValue > 50) {
          toast.error(<ToastBody title="Error" message="Leverage must be less than 50x" />)
          return
        }
        return true
    }
    return numberValue >= 0
  }

  const isRunningFn = useCallback((status: CopyTradeStatusEnum) => status === CopyTradeStatusEnum.RUNNING, [])
  const renderToggleRunning = useCallback(
    (item: CopyTradeWithCheckingData) => (
      <SwitchInput
        checked={isRunningFn(item.status)}
        onChange={() => {
          toggleStatusCopyTrade(item)
        }}
        isLoading={copyTradeData.current?.id === item.id && isMutating}
        disabled={copyTradeData.current?.id === item.id && isMutating}
      />
    ),
    [copyTradeData, isMutating, isRunningFn, toggleStatusCopyTrade]
  )
  const renderTitle = useCallback(
    (item: CopyTradeWithCheckingData, sx?: any) => (
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Type.Caption
          maxWidth={104}
          color={isRunningFn(item.status) ? 'neutral1' : 'neutral3'}
          sx={{ ...overflowEllipsis(), display: 'block', ...(sx || {}) }}
          data-tooltip-id={`${item.id}_${item.title}`}
        >
          {item.title ? item.title : '--'}
        </Type.Caption>
        {item.title && isRunningFn(item.status) && (
          <Tooltip id={`${item.id}_${item.title}`} place="top" type="dark" effect="solid">
            <Type.Caption sx={{ maxWidth: 350 }}>{item.title}</Type.Caption>
          </Tooltip>
        )}
      </Flex>
    ),
    [isRunningFn]
  )
  const renderTraderAccount = useCallback(
    (item: CopyTradeWithCheckingData) => {
      const isRunning = isRunningFn(item.status)
      return renderCopyTrader(item, isRunning)
    },
    [isRunningFn]
  )
  const renderVolume = useCallback(
    (item: CopyTradeWithCheckingData) => (
      <Flex
        color={isRunningFn(item.status) ? 'neutral1' : 'neutral3'}
        sx={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '100%',
        }}
      >
        <Type.Caption>$</Type.Caption>
        <TextWithEdit
          key={`volume_${item.id}_${item.volume}`}
          defaultValue={item.volume}
          onSave={(value) => updateNumberValue({ copyTradeId: item.id, oldData: item, value, field: 'volume' })}
          onValidate={(value) => validateNumberValue({ oldData: item, value, field: 'volume' })}
          disabled={!isRunningFn(item.status)}
        />
        {/*<Type.Caption color={isRunningFn(item.status) ? 'neutral1' : 'neutral3'}>*/}
        {/*  ${item.volume >= 10000 ? compactNumber(item.volume, 2) : formatNumber(item.volume)}*/}
        {/*</Type.Caption>*/}
      </Flex>
    ),
    [isRunningFn]
  )
  const renderLeverage = useCallback(
    (item: CopyTradeWithCheckingData) => (
      <Flex
        color={isRunningFn(item.status) ? 'neutral1' : 'neutral3'}
        sx={{ alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}
      >
        <Type.Caption>x</Type.Caption>
        <TextWithEdit
          key={`leverage_${item.id}_${item.leverage}`}
          defaultValue={item.leverage}
          onSave={(value) => updateNumberValue({ copyTradeId: item.id, oldData: item, value, field: 'leverage' })}
          onValidate={(value) => validateNumberValue({ oldData: item, value, field: 'leverage' })}
          disabled={!isRunningFn(item.status)}
        />
      </Flex>
    ),
    [isRunningFn]
  )
  const renderMarkets = useCallback(
    (item: CopyTradeWithCheckingData) => {
      const tooltipId = `tt_excluding_pairs_${item.id}`
      const hasExcludingPairs = item.copyAll && item.protocol && !!item.excludingTokenAddresses?.length
      return (
        <>
          <Type.Caption
            color={isRunningFn(item.status) ? 'neutral1' : 'neutral3'}
            data-tooltip-id={hasExcludingPairs ? tooltipId : undefined}
            sx={
              hasExcludingPairs
                ? { borderBottom: '1px dashed', mb: '-1px', borderBottomColor: 'neutral3', textDecoration: 'none' }
                : undefined
            }
          >
            {item.copyAll ? (
              <Flex width="100%" justifyContent="flex-start" alignItems="center" sx={{ gap: 1 }}>
                {hasExcludingPairs && <Exclude color={`${themeColors.red1}80`} />}
                <Trans>Follow Trader</Trans>
              </Flex>
            ) : item?.protocol && item?.tokenAddresses ? (
              <MarketGroup protocol={item.protocol} indexTokens={item.tokenAddresses} />
            ) : (
              '--'
            )}
            {hasExcludingPairs && (
              <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable>
                <Box>
                  <Type.Caption mb={1} width="100%" color="neutral3" textAlign="left">
                    Excluding pairs:
                  </Type.Caption>
                  <MarketGroupFull
                    protocol={item.protocol}
                    indexTokens={item.excludingTokenAddresses}
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
    },
    [isRunningFn]
  )
  const renderSLTP = useCallback(
    (item: CopyTradeWithCheckingData) => (
      <Type.Caption sx={{ gap: '0.5ch', justifyContent: 'end' }}>{renderSLTPSetting(item)}</Type.Caption>
    ),
    []
  )
  const renderRiskControl = useCallback(
    (item: CopyTradeData) => (
      <Flex
        sx={{
          width: '100%',
          alignItems: 'center',
          justifyContent: ['end', 'start'],
          gap: 2,
          filter: isRunningFn(item.status) ? undefined : 'grayscale(1)',
        }}
      >
        {!!item.maxVolMultiplier && (
          <>
            <IconBox
              icon={<MaxMarginIcon size={20} />}
              color="primary1"
              sx={{ bg: `${themeColors.primary1}25`, p: '2px', borderRadius: 'sm' }}
              data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_MAX_VOL_MULTIPLIER}_${item.id}`}
            />
            {isRunningFn(item.status) && (
              <Tooltip
                id={`${TOOLTIP_KEYS.MY_COPY_ICON_MAX_VOL_MULTIPLIER}_${item.id}`}
                place="top"
                type="dark"
                effect="solid"
              >
                <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                  Max Margin Per Position:{' '}
                  <Box as="span" color="primary1">
                    {`$${formatNumber(item.maxVolMultiplier * item.volume)}`}
                  </Box>
                </Type.Caption>
              </Tooltip>
            )}
          </>
        )}
        {!!item.volumeProtection && !!item.lookBackOrders && (
          <>
            <IconBox
              icon={<MarginProtectionIcon size={20} />}
              color="primary1"
              sx={{ bg: `${themeColors.primary1}25`, p: '2px', borderRadius: 'sm' }}
              data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_LOOK_BACK_ORDERS}_${item.id}`}
            />
            {isRunningFn(item.status) && (
              <Tooltip
                id={`${TOOLTIP_KEYS.MY_COPY_ICON_LOOK_BACK_ORDERS}_${item.id}`}
                place="top"
                type="dark"
                effect="solid"
              >
                <Type.Caption color="neutral1" display="block">
                  Margin Protection:{' '}
                  <Box as="span" color="primary1">
                    On
                  </Box>
                </Type.Caption>
                <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                  Lookback:{' '}
                  <Box as="span" color="primary1">
                    {formatNumber(item.lookBackOrders, 0, 0)} Orders
                  </Box>
                </Type.Caption>
              </Tooltip>
            )}
          </>
        )}
        {item.skipLowLeverage && (
          <>
            <IconBox
              icon={<SkipLowLeverageIcon size={20} />}
              color={themeColors.primary1}
              sx={{ bg: `${themeColors.primary1}25`, p: '2px', borderRadius: 'sm' }}
              data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_SKIP_LOW_LEVERAGE}_${item.id}`}
            />
            {isRunningFn(item.status) && (
              <Tooltip
                id={`${TOOLTIP_KEYS.MY_COPY_ICON_SKIP_LOW_LEVERAGE}_${item.id}`}
                place="top"
                type="dark"
                effect="solid"
              >
                <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                  Skip Low Leverage Position:{' '}
                  <Box as="span" color="primary1">
                    On ({item.lowLeverage}x)
                  </Box>
                </Type.Caption>
              </Tooltip>
            )}
          </>
        )}
        {item.skipLowCollateral && (
          <>
            <IconBox
              icon={<SkipLowCollateralIcon size={20} />}
              color={themeColors.primary1}
              sx={{ bg: `${themeColors.primary1}25`, p: '2px', borderRadius: 'sm' }}
              data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_SKIP_LOW_COLLATERAL}_${item.id}`}
            />
            {isRunningFn(item.status) && (
              <Tooltip
                id={`${TOOLTIP_KEYS.MY_COPY_ICON_SKIP_LOW_COLLATERAL}_${item.id}`}
                place="top"
                type="dark"
                effect="solid"
              >
                <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                  Skip Low Collateral Position:{' '}
                  <Box as="span" color="primary1">
                    {`$${formatNumber(item.lowCollateral, 0, 0)}`}
                  </Box>
                </Type.Caption>
              </Tooltip>
            )}
          </>
        )}
        {item.skipLowSize && (
          <>
            <IconBox
              icon={<SkipLowSizeIcon size={20} />}
              color={themeColors.primary1}
              sx={{ bg: `${themeColors.primary1}25`, p: '2px', borderRadius: 'sm' }}
              data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_SKIP_LOW_SIZE}_${item.id}`}
            />
            {isRunningFn(item.status) && (
              <Tooltip
                id={`${TOOLTIP_KEYS.MY_COPY_ICON_SKIP_LOW_SIZE}_${item.id}`}
                place="top"
                type="dark"
                effect="solid"
              >
                <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                  Skip Low Size Position:{' '}
                  <Box as="span" color="primary1">
                    {`$${formatNumber(item.lowSize, 0, 0)}`}
                  </Box>
                </Type.Caption>
              </Tooltip>
            )}
          </>
        )}
      </Flex>
    ),
    [isRunningFn]
  )
  const render7DPNL = useCallback(
    (item: CopyTradeWithCheckingData) => (
      <SignedText
        isCompactNumber
        value={item.pnl7D}
        maxDigit={2}
        minDigit={2}
        prefix="$"
        sx={
          isRunningFn(item.status)
            ? undefined
            : {
                color: 'neutral3',
              }
        }
      />
    ),
    [isRunningFn]
  )
  const render30DPNL = useCallback(
    (item: CopyTradeWithCheckingData) => (
      <SignedText
        isCompactNumber
        value={item.pnl30D}
        maxDigit={2}
        minDigit={2}
        prefix="$"
        sx={
          isRunningFn(item.status)
            ? undefined
            : {
                color: 'neutral3',
              }
        }
      />
    ),
    [isRunningFn]
  )
  const renderTotalPNL = useCallback(
    (item: CopyTradeWithCheckingData) => (
      <SignedText
        isCompactNumber
        value={item.pnl}
        maxDigit={2}
        minDigit={2}
        prefix="$"
        sx={
          isRunningFn(item.status)
            ? undefined
            : {
                color: 'neutral3',
              }
        }
      />
    ),
    [isRunningFn]
  )

  const handleOpenHistoryDrawer = useCallback(
    (data?: CopyTradeWithCheckingData) => {
      onSelect(data)
      setOpenHistoryDrawer(true)
    },
    [onSelect, setOpenHistoryDrawer]
  )

  const handleOpenDrawer = useCallback(
    (data?: CopyTradeWithCheckingData) => {
      onSelect(data)
      setOpenDrawer(true)
    },
    [onSelect, setOpenDrawer]
  )

  const handleOpenCloneDrawer = useCallback(
    (data?: CopyTradeWithCheckingData) => {
      if (!checkIsEligible()) return
      onSelect(data)
      setOpenCloneDrawer(true)
    },
    [checkIsEligible, onSelect, setOpenCloneDrawer]
  )

  const handleOpenDeleteModal = useCallback(
    (data?: CopyTradeWithCheckingData) => {
      onSelect(data)
      setOpenDeleteModal(true)
    },
    [onSelect, setOpenDeleteModal]
  )
  const renderOptions = useCallback(
    (item: CopyTradeWithCheckingData, option?: { placement: any }) => (
      <Flex justifyContent="end">
        <Dropdown
          hasArrow={false}
          menuSx={{
            bg: 'neutral7',
            width: 100,
          }}
          menu={
            <>
              <ActionItem
                title={<Trans>History</Trans>}
                icon={<ClockCounterClockwise size={18} />}
                onSelect={() => handleOpenHistoryDrawer(item)}
              />
              <Divider />
              <ActionItem
                title={<Trans>Edit</Trans>}
                icon={<PencilSimpleLine size={18} />}
                onSelect={() => handleOpenDrawer(item)}
              />
              <ActionItem
                title={<Trans>Clone</Trans>}
                icon={<CopySimple size={18} />}
                onSelect={() => handleOpenCloneDrawer(item)}
              />
              <ActionItem
                title={<Trans>Remove</Trans>}
                icon={<Trash size={18} />}
                onSelect={() => handleOpenDeleteModal(item)}
              />
            </>
          }
          sx={{}}
          buttonSx={{
            border: 'none',
            height: '100%',
            p: 0,
          }}
          placement={option?.placement || 'topRight'}
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
    ),
    [handleOpenCloneDrawer, handleOpenDeleteModal, handleOpenDrawer]
  )
  const columns = useMemo(() => {
    const result: ColumnData<CopyTradeWithCheckingData>[] = [
      {
        title: (
          <Box as="span" pl={3}>
            Run
          </Box>
        ),
        dataIndex: 'status',
        key: 'status',
        sortBy: 'status',
        sortType: SortTypeEnum.ASC,
        style: { minWidth: '80px', width: 80 },
        render: (item) => (
          <Box pl={3} sx={{ position: 'relative' }}>
            {item.reverseCopy && <ReverseTag />}
            {renderToggleRunning(item)}
          </Box>
        ),
      },
      {
        title: 'Label',
        dataIndex: 'title',
        key: 'title',
        sortBy: 'title',
        style: { minWidth: '120px', width: 120, pr: 3 },
        render: renderTitle,
      },
      {
        title: 'Trader',
        dataIndex: 'account',
        key: 'account',
        sortBy: 'account',
        style: { minWidth: '210px', width: 210 },
        render: renderTraderAccount,
      },
      {
        title: 'Margin',
        dataIndex: 'volume',
        key: 'volume',
        sortBy: 'volume',
        style: { minWidth: '100px', textAlign: 'right' },
        render: renderVolume,
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        sortBy: 'leverage',
        style: { minWidth: '100px', textAlign: 'right' },
        render: renderLeverage,
      },
      {
        title: 'Trading Pairs',
        dataIndex: 'tokenAddresses',
        key: 'tokenAddresses',
        sortBy: 'tokenAddresses',
        style: { minWidth: '120px', textAlign: 'right' },
        render: renderMarkets,
      },
      {
        title: 'SL/TP',
        dataIndex: undefined,
        key: undefined,
        style: { minWidth: '100px', textAlign: 'right' },
        render: renderSLTP,
      },
      {
        title: 'Advance',
        dataIndex: undefined,
        key: undefined,
        style: { minWidth: '168px', textAlign: 'left', pl: 3 },
        render: renderRiskControl,
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: (
          <LabelWithTooltip id={TOOLTIP_CONTENT.COPY_PNL.id} tooltip={TOOLTIP_CONTENT.COPY_PNL.content}>
            7D ePnL
          </LabelWithTooltip>
        ),
        key: 'pnl7D',
        dataIndex: 'pnl7D',
        sortBy: 'pnl7D',
        render: render7DPNL,
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: (
          <LabelWithTooltip id={TOOLTIP_CONTENT.COPY_PNL.id} tooltip={TOOLTIP_CONTENT.COPY_PNL.content}>
            Total ePnL
          </LabelWithTooltip>
        ),
        key: 'pnl',
        dataIndex: 'pnl',
        sortBy: 'pnl',
        render: renderTotalPNL,
      },
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '40px', textAlign: 'right', pr: 2 },
        render: (item) => renderOptions(item),
      },
    ]
    return result
  }, [
    render30DPNL,
    render7DPNL,
    renderLeverage,
    renderMarkets,
    renderOptions,
    renderRiskControl,
    renderSLTP,
    renderTitle,
    renderToggleRunning,
    renderTotalPNL,
    renderTraderAccount,
    renderVolume,
  ])
  return {
    columns,
    renderProps: {
      render30DPNL,
      render7DPNL,
      renderLeverage,
      renderMarkets,
      renderOptions,
      renderRiskControl,
      renderTitle,
      renderToggleRunning,
      renderTotalPNL,
      renderTraderAccount,
      renderVolume,
      renderSLTP,
    },
  }
}

export type CopyTradeRenderProps = ReturnType<typeof useCopyTradeColumns>['renderProps']

function renderCopyTrader(data: CopyTradeWithCheckingData, isRunning: boolean) {
  return (
    <Box
      sx={{
        color: isRunning ? 'neutral1' : 'neutral3',
        filter: isRunning ? 'none' : 'grayscale(1)',
      }}
    >
      {data.multipleCopy ? (
        data.accounts && (
          <>
            <Flex data-tooltip-id={data.id} sx={{ alignItems: 'center', gap: 2, width: 'max-content' }}>
              <AvatarGroup addresses={data.accounts} size={24} />
              <Type.Caption color="neutral4">|</Type.Caption>
              <Image
                src={getProtocolDropdownImage({ protocol: data.protocol, isActive: true })}
                width={16}
                height={16}
                sx={{ flexShrink: 0 }}
              />
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
                          hasCopyCountWarningIcon: isRunning,
                          hasCopyVolumeWarningIcon: isRunning,
                          copyVolume: data.copyVolume,
                          maxCopyVolume: data.maxVolume,
                          isRef: data.isRef,
                          plan: data.plan,
                          hasCopyTradeVolumeIcon: isRunning,
                          hasCopyAddress: true,
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
            hasCopyCountWarningIcon: isRunning,
            hasCopyVolumeWarningIcon: isRunning,
            copyVolume: data.copyVolume,
            maxCopyVolume: data.maxVolume,
            isRef: data.isRef,
            plan: data.plan,
            hasCopyTradeVolumeIcon: isRunning,
            hasCopyAddress: true,
          }}
        />
      )}
    </Box>
  )
}
