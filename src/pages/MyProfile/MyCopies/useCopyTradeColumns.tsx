import { Trans } from '@lingui/macro'
import {
  ClockCounterClockwise,
  CopySimple,
  DotsThreeOutlineVertical,
  PencilSimpleLine,
  Trash,
} from '@phosphor-icons/react'
import { MutableRefObject, SetStateAction, useCallback, useMemo } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import Divider from 'components/@ui/Divider'
import ReverseTag from 'components/@ui/ReverseTag'
import { ColumnData } from 'components/@ui/Table/types'
import { CopyTradeData } from 'entities/copyTrade'
import { useCheckCopyTradeAction } from 'hooks/features/useSubscriptionRestrict'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import MarginProtectionIcon from 'theme/Icons/MarginProtectionIcon'
import MaxMarginIcon from 'theme/Icons/MaxMarginIcon'
import SkipLowLeverageIcon from 'theme/Icons/SkipLowLeverageIcon'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { CopyTradeStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { TOOLTIP_KEYS } from 'utils/config/keys'
import { overflowEllipsis } from 'utils/helpers/css'
import { compactNumber, formatNumber } from 'utils/helpers/format'

import { renderSLTPSetting, renderTrader } from '../renderProps'
import ActionItem from './ActionItem'

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
  onSelect: (data?: CopyTradeData) => void
  isMutating: boolean
  setOpenHistoryDrawer: (value: SetStateAction<boolean>) => void
  setOpenDrawer: (value: SetStateAction<boolean>) => void
  setOpenCloneDrawer: (value: SetStateAction<boolean>) => void
  setOpenDeleteModal: (value: SetStateAction<boolean>) => void
  setOpenConfirmStopModal: (value: SetStateAction<boolean>) => void
  toggleStatus: ({ id, currentStatus }: { id: string; currentStatus: CopyTradeStatusEnum }) => void
  copyTradeData: MutableRefObject<CopyTradeData | undefined>
}) {
  const { checkIsEligible } = useCheckCopyTradeAction()
  const toggleStatusCopyTrade = useCallback(
    (item: CopyTradeData) => {
      if (isMutating) return
      onSelect(item)
      if (item.status === CopyTradeStatusEnum.STOPPED) {
        if (!checkIsEligible()) {
          return
        }
        toggleStatus({ id: item.id, currentStatus: item.status })
        return
      }
      if (item.status === CopyTradeStatusEnum.RUNNING) {
        setOpenConfirmStopModal(true)
        return
      }
    },
    [checkIsEligible, isMutating, onSelect, setOpenConfirmStopModal, toggleStatus]
  )
  const isRunningFn = useCallback((status: CopyTradeStatusEnum) => status === CopyTradeStatusEnum.RUNNING, [])
  const renderToggleRunning = useCallback(
    (item: CopyTradeData) => (
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
    (item: CopyTradeData, sx?: any) => (
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
    (item: CopyTradeData) => {
      const isRunning = isRunningFn(item.status)
      return renderTrader(item.account, item.protocol, {
        textSx: {
          color: isRunning ? 'neutral1' : 'neutral3',
        },
        sx: {
          filter: isRunning ? 'none' : 'grayscale(1)',
        },
        hasCopyCountWarningIcon: isRunning,
        hasCopyVolumeWarningIcon: isRunning,
      })
    },
    [isRunningFn]
  )
  const renderVolume = useCallback(
    (item: CopyTradeData) => (
      <Type.Caption color={isRunningFn(item.status) ? 'neutral1' : 'neutral3'}>
        ${item.volume >= 10000 ? compactNumber(item.volume, 2) : formatNumber(item.volume)}
      </Type.Caption>
    ),
    [isRunningFn]
  )
  const renderLeverage = useCallback(
    (item: CopyTradeData) => (
      <Type.Caption color={isRunningFn(item.status) ? 'neutral1' : 'neutral3'}>
        x{formatNumber(item.leverage)}
      </Type.Caption>
    ),
    [isRunningFn]
  )
  const renderSLTP = useCallback(
    (item: CopyTradeData) => (
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
                    On
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
    (item: CopyTradeData) => (
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
    (item: CopyTradeData) => (
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
    (item: CopyTradeData) => (
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
    (data?: CopyTradeData) => {
      onSelect(data)
      setOpenHistoryDrawer(true)
    },
    [onSelect, setOpenHistoryDrawer]
  )

  const handleOpenDrawer = useCallback(
    (data?: CopyTradeData) => {
      onSelect(data)
      setOpenDrawer(true)
    },
    [onSelect, setOpenDrawer]
  )

  const handleOpenCloneDrawer = useCallback(
    (data?: CopyTradeData) => {
      if (!checkIsEligible()) return
      onSelect(data)
      setOpenCloneDrawer(true)
    },
    [checkIsEligible, onSelect, setOpenCloneDrawer]
  )

  const handleOpenDeleteModal = useCallback(
    (data?: CopyTradeData) => {
      onSelect(data)
      setOpenDeleteModal(true)
    },
    [onSelect, setOpenDeleteModal]
  )
  const renderOptions = useCallback(
    (item: CopyTradeData, option?: { placement: any }) => (
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
    const result: ColumnData<CopyTradeData>[] = [
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
        style: { minWidth: '120px', width: 120, pr: 3 },
        render: renderTitle,
      },
      {
        title: 'Trader',
        dataIndex: 'account',
        key: 'account',
        style: { minWidth: '170px', width: 170 },
        // TODO: 2
        render: renderTraderAccount,
      },
      {
        title: 'Margin',
        dataIndex: 'volume',
        key: 'volume',
        style: { minWidth: '70px', width: 70, textAlign: 'right' },
        render: renderVolume,
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        style: { minWidth: '70px', width: 70, textAlign: 'right' },
        render: renderLeverage,
      },
      {
        title: 'SL/TP',
        dataIndex: undefined,
        key: undefined,
        style: { minWidth: '120px', width: 120, textAlign: 'right' },
        render: renderSLTP,
      },
      {
        title: 'Advance',
        dataIndex: undefined,
        key: undefined,
        style: { minWidth: '110px', width: 110, textAlign: 'left', pl: 3 },
        render: renderRiskControl,
      },
      {
        style: { minWidth: '100px', width: 100, textAlign: 'right' },
        title: <Trans>7D PnL</Trans>,
        key: 'pnl7D',
        dataIndex: 'pnl7D',
        sortBy: 'pnl7D',
        render: render7DPNL,
      },
      {
        style: { minWidth: '100px', width: 100, textAlign: 'right' },
        title: <Trans>Total PnL</Trans>,
        key: 'pnl',
        dataIndex: 'pnl',
        sortBy: 'pnl',
        render: renderTotalPNL,
      },
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '40px', width: 40, textAlign: 'right', pr: 2 },
        render: (item) => renderOptions(item),
      },
    ]
    return result
  }, [
    render30DPNL,
    render7DPNL,
    renderLeverage,
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
