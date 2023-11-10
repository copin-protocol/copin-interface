import { Trans } from '@lingui/macro'
import {
  CellSignalX,
  CopySimple,
  DotsThreeOutlineVertical,
  PencilSimpleLine,
  Plugs,
  Radical,
  Trash,
} from '@phosphor-icons/react'
import { MutableRefObject, SetStateAction, useCallback, useMemo } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import ReverseTag from 'components/@ui/ReverseTag'
import { ColumnData } from 'components/@ui/Table/types'
import { CopyTradeData } from 'entities/copyTrade'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { CopyTradeStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { TOOLTIP_KEYS } from 'utils/config/keys'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'

import { renderTrader } from '../renderProps'
import ActionItem from './ActionItem'

export default function useCopyTradeColumns({
  onSelect,
  isMutating,
  setOpenDrawer,
  setOpenCloneDrawer,
  setOpenDeleteModal,
  setOpenConfirmStopModal,
  toggleStatus,
  copyTradeData,
}: {
  onSelect: (data?: CopyTradeData) => void
  isMutating: boolean
  setOpenDrawer: (value: SetStateAction<boolean>) => void
  setOpenCloneDrawer: (value: SetStateAction<boolean>) => void
  setOpenDeleteModal: (value: SetStateAction<boolean>) => void
  setOpenConfirmStopModal: (value: SetStateAction<boolean>) => void
  toggleStatus: ({ id, currentStatus }: { id: string; currentStatus: CopyTradeStatusEnum }) => void
  copyTradeData: MutableRefObject<CopyTradeData | undefined>
}) {
  const toggleStatusCopyTrade = useCallback(
    (item: CopyTradeData) => {
      if (isMutating) return
      onSelect(item)
      if (item.status === CopyTradeStatusEnum.STOPPED) {
        toggleStatus({ id: item.id, currentStatus: item.status })
        return
      }
      if (item.status === CopyTradeStatusEnum.RUNNING) {
        setOpenConfirmStopModal(true)
        return
      }
    },
    [isMutating, onSelect, setOpenConfirmStopModal, toggleStatus]
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
    (item: CopyTradeData) =>
      renderTrader(item.account, item.protocol, {
        textSx: {
          color: isRunningFn(item.status) ? 'neutral1' : 'neutral3',
        },
        sx: {
          filter: isRunningFn(item.status) ? 'none' : 'grayscale(1)',
        },
      }),
    [isRunningFn]
  )
  const renderVolume = useCallback(
    (item: CopyTradeData) => (
      <Type.Caption color={isRunningFn(item.status) ? 'neutral1' : 'neutral3'}>
        ${formatNumber(item.volume)}
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
  const renderRiskControl = useCallback(
    (item: CopyTradeData) => (
      <Flex
        sx={{
          alignItems: 'center',
          gap: 2,
          filter: isRunningFn(item.status) ? undefined : 'grayscale(1)',
        }}
      >
        {item.enableStopLoss && (
          <>
            <IconBox
              icon={<Plugs size={16} />}
              color="#FA5547"
              sx={{ bg: '#FA55474D', p: '2px', borderRadius: 'sm' }}
              data-tooltip-id={`${TOOLTIP_KEYS.MY_COPY_ICON_STOPLOSS}_${item.id}`}
            />
            {isRunningFn(item.status) && (
              <Tooltip id={`${TOOLTIP_KEYS.MY_COPY_ICON_STOPLOSS}_${item.id}`} place="top" type="dark" effect="solid">
                <Type.Caption color="neutral1" sx={{ maxWidth: 350 }}>
                  Stoploss:{' '}
                  <Box as="span" color="red1">
                    ${`${formatNumber(item.stopLossAmount, 2, 2)}`}
                  </Box>
                </Type.Caption>
              </Tooltip>
            )}
          </>
        )}
        {!!item.maxVolMultiplier && (
          <>
            <IconBox
              icon={<Radical size={16} />}
              color="primary1"
              sx={{ bg: '#97CFFD4D', p: '2px', borderRadius: 'sm' }}
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
                  Max Volume Multiplier:{' '}
                  <Box as="span" color="red1">
                    {`${formatNumber(item.maxVolMultiplier, 0, 0)}`} times
                  </Box>
                </Type.Caption>
              </Tooltip>
            )}
          </>
        )}
        {item.skipLowLeverage && (
          <>
            <IconBox
              icon={<CellSignalX mirrored size={16} />}
              color="orange1"
              sx={{ bg: 'neutral4', p: '2px', borderRadius: 'sm' }}
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
                  Skip Low Leverage:{' '}
                  <Box as="span" color="green1">
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

  const handleOpenDrawer = useCallback(
    (data?: CopyTradeData) => {
      onSelect(data)
      setOpenDrawer(true)
    },
    [onSelect, setOpenDrawer]
  )

  const handleOpenCloneDrawer = useCallback(
    (data?: CopyTradeData) => {
      onSelect(data)
      setOpenCloneDrawer(true)
    },
    [onSelect, setOpenCloneDrawer]
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
            Run/Stop
          </Box>
        ),
        dataIndex: 'status',
        key: 'status',
        sortBy: 'status',
        sortType: SortTypeEnum.ASC,
        style: { minWidth: '110px' },
        render: (item) => (
          <Box pl={3} sx={{ position: 'relative' }}>
            {item.reverseCopy && <ReverseTag />}
            {renderToggleRunning(item)}
          </Box>
        ),
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        style: { minWidth: '120px', pr: 3 },
        render: renderTitle,
      },
      {
        title: 'Trader',
        dataIndex: 'account',
        key: 'account',
        style: { minWidth: '150px' },
        // TODO: 2
        render: renderTraderAccount,
      },
      {
        title: 'Vol/Order',
        dataIndex: 'volume',
        key: 'volume',
        style: { minWidth: '80px', textAlign: 'right' },
        render: renderVolume,
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        style: { minWidth: '80px', textAlign: 'right' },
        render: renderLeverage,
      },
      {
        title: 'Risk Control',
        dataIndex: undefined,
        key: undefined,
        style: { minWidth: '90px', textAlign: 'left', pl: 3 },
        render: renderRiskControl,
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: <Trans>7D PnL</Trans>,
        key: 'pnl7D',
        dataIndex: 'pnl7D',
        sortBy: 'pnl7D',
        render: render7DPNL,
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
        title: <Trans>30D PnL</Trans>,
        key: 'pnl30D',
        dataIndex: 'pnl30D',
        sortBy: 'pnl30D',
        render: render30DPNL,
      },
      {
        style: { minWidth: '100px', textAlign: 'right' },
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
    },
  }
}

export type CopyTradeRenderProps = ReturnType<typeof useCopyTradeColumns>['renderProps']
