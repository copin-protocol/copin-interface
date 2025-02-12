import { useCallback, useMemo } from 'react'

import {
  renderCopyTrader,
  renderCopyWalletLabel,
  renderLeverageFactory,
  renderMarkets,
  renderOptionsFactory,
  renderPnLFactory,
  renderRiskControl,
  renderTitle,
  renderVolumeFactory,
} from 'components/@copyTrade/renderProps/copyTradeColumns'
import { CopyTradeWithCheckingData } from 'components/@copyTrade/types'
import { renderSLTPSetting } from 'components/@position/configs/copyPositionRenderProps'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import ReverseTag from 'components/@ui/ReverseTag'
import useUpdateCopyTrade from 'hooks/features/copyTrade/useUpdateCopyTrade'
import { useIsVIP } from 'hooks/features/subscription/useSubscriptionRestrict'
import useCopyTradeModalConfigs from 'hooks/features/useCopyTradeModalConfigs'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { ColumnData } from 'theme/Table/types'
import { Box, Type } from 'theme/base'
import { CopyTradeStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { TOOLTIP_CONTENT } from 'utils/config/options'
import { parseWalletName } from 'utils/helpers/transform'

import { ExternalResource, ListCopyTradeType } from './types'

type CopyTradeColumn = ColumnData<CopyTradeWithCheckingData, ExternalResource>

export default function useListCopyTradeConfigs({
  type,
  isExpanded,
  excludingColumnKeys,
}: {
  type: ListCopyTradeType
  isExpanded?: boolean
  excludingColumnKeys?: (keyof CopyTradeWithCheckingData)[]
}) {
  const isLite = type === 'lite'
  const isDex = type === 'dex'
  const isDrawer = type === 'drawer'
  const { embeddedWalletInfo } = useCopyWalletContext()
  const balance = embeddedWalletInfo ? Number(embeddedWalletInfo.marginSummary.accountValue) : undefined

  const isVIPUser = useIsVIP()
  const { isMutating, toggleStatus, updateNumberValue } = useUpdateCopyTrade()
  const copyTradeModalConfigs = useCopyTradeModalConfigs({ toggleStatus })
  const { currentCopyTrade, handleOpenModal } = copyTradeModalConfigs

  const toggleStatusCopyTrade = useCallback(
    (item: CopyTradeWithCheckingData) => {
      if (isMutating) return
      if (item.status === CopyTradeStatusEnum.STOPPED) {
        toggleStatus(item)
        return
      }
      if (item.status === CopyTradeStatusEnum.RUNNING) {
        handleOpenModal({ data: item, modalType: 'stop' })
        return
      }
    },
    [handleOpenModal, isMutating, toggleStatus]
  )

  const isRunningFn = useCallback((status: CopyTradeStatusEnum) => status === CopyTradeStatusEnum.RUNNING, [])
  const renderToggleRunning = useCallback(
    (item: CopyTradeWithCheckingData) => (
      <SwitchInput
        checked={isRunningFn(item.status)}
        onChange={() => {
          toggleStatusCopyTrade(item)
        }}
        isLoading={currentCopyTrade?.id === item.id && isMutating}
        disabled={currentCopyTrade?.id === item.id && isMutating}
      />
    ),
    [currentCopyTrade?.id, isMutating, isRunningFn, toggleStatusCopyTrade]
  )

  const renderVolume = useMemo(
    () =>
      renderVolumeFactory({
        isLite,
        balance,
        onSaveEdit: (value, data) => updateNumberValue({ copyTradeId: data.id, oldData: data, value, field: 'volume' }),
      }),
    [balance, isLite, updateNumberValue]
  )
  const renderLeverage = useMemo(
    () =>
      renderLeverageFactory({
        onSaveEdit: (value, data) => updateNumberValue({ copyTradeId: data.id, oldData: data, value, field: 'volume' }),
      }),
    [updateNumberValue]
  )
  const renderSLTP = useCallback(
    (item: CopyTradeWithCheckingData) => (
      <Type.Caption sx={{ gap: '0.5ch', justifyContent: 'end' }}>{renderSLTPSetting(item)}</Type.Caption>
    ),
    []
  )
  const renderCopyWallet = useCallback(
    (item: CopyTradeWithCheckingData, externalResource: ExternalResource | undefined) => {
      let walletName = '--'
      if (item.copyWalletId) {
        const walletFromContext = externalResource?.copyWallets?.find((wallet) => wallet.id === item.copyWalletId)
        if (walletFromContext) {
          walletName = parseWalletName(walletFromContext)
        }
      }
      return renderCopyWalletLabel({ walletName, exchange: item.exchange })
    },
    []
  )
  const render7DPNL = useMemo(() => renderPnLFactory({ key: 'pnl7D' }), [])
  const render30DPNL = useMemo(() => renderPnLFactory({ key: 'pnl30D' }), [])
  const renderTotalPNL = useMemo(() => renderPnLFactory({ key: 'pnl' }), [])

  const renderOptions = useMemo(
    () =>
      renderOptionsFactory({
        handleOpenModal,
        listCopyTradeType: type,
      }),
    [handleOpenModal, type]
  )
  const columns = useMemo(() => {
    const advanceColumns: CopyTradeColumn[] =
      isDex && !isExpanded
        ? []
        : [
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
              style: { minWidth: '90px', textAlign: 'left', pl: 3 },
              render: renderRiskControl,
            },
          ]
    const pnl7DColumn: CopyTradeColumn = {
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
    }
    const pnlColumns: CopyTradeColumn[] =
      isDex && !isExpanded
        ? []
        : [
            ...(isLite ? [] : [pnl7DColumn]),
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
          ]
    const walletColumn: CopyTradeColumn[] = isDrawer
      ? [
          {
            title: 'Copy Wallet',
            dataIndex: 'copyWalletId',
            key: 'copyWalletId',
            sortBy: 'copyWalletId',
            style: { minWidth: 120, width: 120, pr: isDex ? 2 : 3 },
            render: (item, _, externalSource) => renderCopyWallet(item, externalSource),
          },
        ]
      : []
    const result: CopyTradeColumn[] = [
      // common
      {
        title: (
          <Box as="span" pl={isDex && !isExpanded ? 2 : 3}>
            Run
          </Box>
        ),
        dataIndex: 'status',
        key: 'status',
        sortBy: 'status',
        sortType: SortTypeEnum.ASC,
        style: { minWidth: '80px', width: 80 },
        render: (item) => (
          <Box pl={isDex && !isExpanded ? 2 : 3} sx={{ position: 'relative' }}>
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
        style: { minWidth: 100, width: 100, pr: isDex ? 2 : 3 },
        render: (item) => renderTitle(item),
      },
      {
        title: 'Trader',
        dataIndex: 'account',
        key: 'account',
        sortBy: 'account',
        style: { minWidth: 180, width: 180 },
        render: (item) => renderCopyTrader({ data: item, options: { enabledQuickView: isDrawer ? false : true } }),
      },
      ...walletColumn,
      {
        title: 'Margin',
        dataIndex: 'volume',
        key: 'volume',
        sortBy: 'volume',
        style: { minWidth: 80, textAlign: 'right' },
        render: (item) => renderVolume(item),
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        sortBy: 'leverage',
        style: { minWidth: 80, textAlign: 'right' },
        render: renderLeverage,
      },
      //
      ...advanceColumns,
      ...pnlColumns,
      // common
      {
        title: '',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '40px', textAlign: 'right', pr: 2 },
        render: (item) => renderOptions(item),
      },
    ]
    if (!!excludingColumnKeys) {
      return result.filter((v) => (v.key != null ? !excludingColumnKeys.includes(v.key) : true))
    }
    return result
  }, [
    isDex,
    isExpanded,
    renderLeverage,
    renderSLTP,
    isLite,
    render7DPNL,
    renderTotalPNL,
    renderToggleRunning,
    renderVolume,
    renderOptions,
    excludingColumnKeys,
    isDrawer,
    renderCopyWallet,
  ])
  return {
    isMutating,
    toggleStatus,
    isVIPUser,
    columns,
    renderProps: {
      render30DPNL,
      render7DPNL,
      renderLeverage,
      renderMarkets,
      renderOptions,
      renderRiskControl,
      renderToggleRunning,
      renderTotalPNL,
      renderVolume,
      renderSLTP,
      renderTitle,
      renderCopyTrader,
    },
    copyTradeModalConfigs,
  }
}

export type ListCopyTradeRenderProps = ReturnType<typeof useListCopyTradeConfigs>['renderProps']
