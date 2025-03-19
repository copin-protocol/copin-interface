import { Trans } from '@lingui/macro'
import { ChartBar, ChartLine, Warning } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { ReactNode, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getMyCopyOrdersApi, getMyCopyPositionDetailApi } from 'apis/copyPositionApis'
import { getCopyTradeDetailsApi } from 'apis/copyTradeApis'
import CopyChartProfit from 'components/@charts/ChartCopyPositionProfit'
import CopyRealtimeChart from 'components/@charts/ChartCopyPositionProfitRealtime'
import PositionStatus from 'components/@position/PositionStatus'
import { renderPnL, renderSLTPSetting } from 'components/@position/configs/copyPositionRenderProps'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { AmountText, PercentText, PriceTokenText } from 'components/@ui/DecoratedText/ValueText'
import NoDataFound from 'components/@ui/NoDataFound'
import TraderAddress from 'components/@ui/TraderAddress'
import { renderCopyEntry } from 'components/@widgets/renderProps'
import { CopyPositionData } from 'entities/copyTrade'
import useAllCopyTrades from 'hooks/features/copyTrade/useAllCopyTrades'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import Tabs, { TabPane } from 'theme/Tab'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { CopyTradePlatformEnum, PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { TOOLTIP_CONTENT } from 'utils/config/options'
import { COPY_POSITION_CLOSE_TYPE_TRANS } from 'utils/config/translations'
import { calcCopyOpeningPnL, calcCopyOpeningROI } from 'utils/helpers/calculate'
import { formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair, normalizeExchangePrice } from 'utils/helpers/transform'

import CloseOnchainPosition from './CloseOnchainPosition'
import ClosePositionSnxV2 from './ClosePositionSnxV2'
import CopyPositionHistories from './CopyPositionHistories'
import ListCopyOrderTable from './ListCopyOrderTable'
import UnlinkPosition from './UnlinkPosition'

export default function CopyPositionDetails({ copyPositionData }: { copyPositionData: CopyPositionData | undefined }) {
  const { id, copyTradeId } = copyPositionData ?? {}
  const [isTradingChart, setIsTradingChart] = useState<boolean | undefined>()
  const refetchQueries = useRefetchQueries()
  const {
    data,
    isLoading,
    refetch: reloadPosition,
  } = useQuery([QUERY_KEYS.GET_MY_COPY_POSITION_DETAIL, id], () => getMyCopyPositionDetailApi({ copyId: id ?? '' }), {
    enabled: !!id,
    retry: 0,
    onSuccess: (res?: CopyPositionData) => {
      setIsTradingChart(res?.status === PositionStatusEnum.OPEN)
    },
  })
  const { data: copyTradeDetails, isLoading: loadingInfo } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_SETTING_DETAIL, data?.copyTradeId],
    () => getCopyTradeDetailsApi({ id: data?.copyTradeId ?? '' }),
    {
      enabled: !!data?.copyTradeId,
      retry: 0,
    }
  )
  const {
    data: dataOrders,
    isLoading: loadingOrders,
    refetch: reloadOrders,
  } = useQuery([QUERY_KEYS.GET_MY_COPY_ORDERS, data?.id], () => getMyCopyOrdersApi({ copyId: data?.id ?? '' }), {
    enabled: !!data?.id,
    retry: 0,
  })
  const copyTradeOrders = useMemo(
    () =>
      data && dataOrders
        ? dataOrders.map((e, i) => {
            const sizeUsd = e.size * e.price
            let collateral =
              e.leverage != null || data.leverage != null
                ? (sizeUsd / (e.leverage || data.leverage || 1)) * (e.isIncrease ? 1 : -1)
                : 0
            if (e.collateral != null) {
              collateral = e.collateral * (e.isIncrease ? 1 : -1)
            } else if (e.totalCollateral != null) {
              collateral = e.totalCollateral
                ? e.totalCollateral - (i !== 0 ? dataOrders[i - 1].totalCollateral : 0)
                : sizeUsd / e.leverage
            }

            return {
              ...e,
              sizeUsd,
              collateral,
              leverage:
                e.totalCollateral && e.totalSize
                  ? (e.totalSize * e.price) / e.totalCollateral
                  : e.leverage || (data.leverage ?? 0),
            }
          })
        : undefined,
    [data, dataOrders]
  )
  const { getSymbolByIndexToken } = useMarketsConfig()
  const symbolByIndexToken = getSymbolByIndexToken?.({ protocol: data?.protocol, indexToken: data?.indexToken })
  const isOpening = data && data.status === PositionStatusEnum.OPEN
  const symbol = data?.pair ? getSymbolFromPair(data.pair) : symbolByIndexToken
  const sizeDelta = useMemo(
    () =>
      isOpening
        ? Number(data?.totalSizeDelta)
        : copyTradeOrders?.filter((e) => e.isIncrease)?.reduce((sum, current) => sum + current.size, 0) ?? 0,
    [copyTradeOrders, data?.totalSizeDelta, isOpening]
  )
  const collateral = useMemo(() => {
    if (!data || !copyTradeOrders) return 0
    return copyTradeOrders.filter((e) => e.isIncrease).reduce((sum, current) => sum + current.collateral, 0)
  }, [copyTradeOrders, data])
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol: data?.protocol })
  const pnl = useMemo(
    () =>
      data && symbol
        ? isOpening
          ? calcCopyOpeningPnL(
              data,
              normalizeExchangePrice({
                protocolSymbol: symbol,
                protocolSymbolPrice: prices[symbol],
                exchange: data.exchange,
              })
            )
          : data.pnl
        : 0,
    [data, isOpening, prices, symbol]
  )
  const roi = data ? ((pnl ?? 0) / collateral) * 100 : 0

  const openBlockTimeUnix = useMemo(() => (data ? dayjs(data.createdAt).utc().unix() : 0), [data])
  const closeBlockTimeUnix = useMemo(() => (data ? dayjs(data.lastOrderAt).utc().unix() : 0), [data])

  const [crossMovePnL, setCrossMovePnL] = useState<number | undefined>()
  const latestPnL = useMemo(
    () =>
      crossMovePnL === 0
        ? 0
        : data
        ? isOpening || crossMovePnL
          ? crossMovePnL
            ? crossMovePnL
            : pnl
          : data.pnl ?? 0
        : 0,
    [crossMovePnL, data, isOpening, pnl]
  )

  const latestROI = useMemo(
    () =>
      crossMovePnL === 0 ? 0 : data ? (isOpening || crossMovePnL ? calcCopyOpeningROI(data, latestPnL ?? 0) : roi) : 0,
    [crossMovePnL, data, isOpening, latestPnL, roi]
  )

  const [currentTab, setCurrentTab] = useState<string>(TabKeyEnum.ORDER)

  const onForceReload = () => {
    reloadPosition()
    reloadOrders()
    refetchQueries([QUERY_KEYS.GET_MY_COPY_POSITIONS, QUERY_KEYS.GET_MY_COPY_POSITION_DETAIL])
  }
  const { embeddedWallets } = useCopyWalletContext()
  const { allCopyTrades } = useAllCopyTrades()
  const disabledUnlinkButton =
    allCopyTrades?.find((v) => v.id === copyTradeId)?.copyWalletId === embeddedWallets?.[0]?.id

  return (
    <>
      {(isLoading || loadingInfo) && <Loading />}
      {!isLoading && !loadingInfo && !data && <NoDataFound />}
      {data && (
        <Flex sx={{ width: '100%', height: '100%', position: 'relative', flexDirection: 'column' }}>
          <Flex p={3} alignItems="center" justifyContent="space-between">
            <Type.H5>
              <Trans>Copy Position Details</Trans>
            </Type.H5>
            {!disabledUnlinkButton &&
              data.status === PositionStatusEnum.OPEN &&
              copyTradeDetails?.exchange !== CopyTradePlatformEnum.SYNTHETIX_V2 &&
              copyTradeDetails?.exchange !== CopyTradePlatformEnum.GNS_V8 && (
                <UnlinkPosition copyPosition={data} onSuccess={onForceReload} mr={40} />
              )}

            {!!copyTradeDetails &&
              copyTradeDetails.exchange === CopyTradePlatformEnum.SYNTHETIX_V2 &&
              data.status === PositionStatusEnum.OPEN && (
                <Box mr={4}>
                  <ClosePositionSnxV2 copyPosition={data} copyWalletId={copyTradeDetails.copyWalletId} />
                </Box>
              )}
            {!!copyTradeDetails &&
              copyTradeDetails.exchange === CopyTradePlatformEnum.GNS_V8 &&
              data.status === PositionStatusEnum.OPEN &&
              data.positionIndex != null && (
                <Box mr={4}>
                  <CloseOnchainPosition
                    position={{
                      copyPositionId: data.id,
                      indexToken: data.indexToken,
                      isLong: data.isLong,
                      averagePrice: data.entryPrice,
                      protocol: data.protocol,
                    }}
                    copyWalletId={copyPositionData?.copyWalletId ?? ''}
                    onSuccess={onForceReload}
                  />
                </Box>
              )}
          </Flex>
          <Box bg="neutral7" mb={3} mx={3} sx={{ borderRadius: '2px', border: 'small', borderColor: 'neutral4' }}>
            <Flex
              alignItems="center"
              sx={{
                columnGap: 3,
                rowGap: 2,
                flexWrap: 'wrap',
                px: 2,
                py: [2, 12],
              }}
            >
              <StatsItemWrapper>
                <Type.Caption color="neutral3">Status:</Type.Caption>
                <PositionStatus status={data.status} />
              </StatsItemWrapper>
              <StatsItemWrapper>
                <Type.Caption color="neutral3">Copy Address:</Type.Caption>
                <Type.CaptionBold>
                  <TraderAddress
                    address={data.copyAccount}
                    protocol={data.protocol}
                    options={{ textSx: { fontWeight: '600' } }}
                  />
                </Type.CaptionBold>
              </StatsItemWrapper>
              <StatsItemWrapper>
                <Type.Caption color="neutral3">Open Time:</Type.Caption>
                <Type.CaptionBold>
                  <LocalTimeText date={data.createdAt} />
                </Type.CaptionBold>
              </StatsItemWrapper>
              <StatsItemWrapper>
                <Type.Caption color="neutral3">Closed Time:</Type.Caption>
                <Type.CaptionBold>{!isOpening ? <LocalTimeText date={data.lastOrderAt} /> : '--'}</Type.CaptionBold>
              </StatsItemWrapper>
              <StatsItemWrapper>
                <Type.Caption color="neutral3">Closed Type:</Type.Caption>
                <Type.CaptionBold>
                  {data.closeType ? COPY_POSITION_CLOSE_TYPE_TRANS[data.closeType] : '--'}
                </Type.CaptionBold>
              </StatsItemWrapper>
            </Flex>
            <Flex
              alignItems="center"
              sx={{
                columnGap: 3,
                rowGap: 2,
                mx: 2,
                py: [2, 12],
                flexWrap: 'wrap',
                borderBottom: 'small',
                borderColor: 'neutral4',
              }}
            >
              <StatsItemWrapperB>
                <Type.Caption color="neutral3">Entry:</Type.Caption>
                {renderCopyEntry(data, { fontWeight: '600' })}
              </StatsItemWrapperB>
              <StatsItemWrapperB>
                <Type.Caption color="neutral3">Position/Value:</Type.Caption>
                <Type.CaptionBold>
                  ${formatNumber(sizeDelta * (data.entryPrice ?? 0), 0)}{' '}
                  <Type.Caption color="neutral3" px={1}>
                    |
                  </Type.Caption>{' '}
                  {formatNumber(data.leverage, 1, 1)}x{' '}
                  <Type.Caption color="neutral3" px={1}>
                    |
                  </Type.Caption>{' '}
                  {formatNumber(sizeDelta, 4, 4)} {symbol}
                </Type.CaptionBold>
              </StatsItemWrapperB>
              <StatsItemWrapperB>
                <Type.Caption color="neutral3">Collateral:</Type.Caption>
                <Type.CaptionBold>${formatNumber(collateral, 2, 2)}</Type.CaptionBold>
              </StatsItemWrapperB>
              <StatsItemWrapperB>
                <Type.Caption color="neutral3">SL/TP Setting:</Type.Caption>
                <Type.CaptionBold>
                  {copyTradeDetails ? renderSLTPSetting(copyTradeDetails, true) : '--/--'}
                </Type.CaptionBold>
              </StatsItemWrapperB>
              <StatsItemWrapperB>
                <Type.Caption color="neutral3">Closed Price:</Type.Caption>
                <Type.CaptionBold>
                  {isOpening ? '--' : <PriceTokenText value={data.closePrice} maxDigit={2} minDigit={2} />}
                </Type.CaptionBold>
              </StatsItemWrapperB>
            </Flex>
            <Box px={2} py={[2, 12]} sx={{ position: 'relative' }}>
              <Flex mb={[1, 3]} width="100%" alignItems="center" justifyContent="center">
                {isOpening || !!crossMovePnL ? (
                  <Type.H5 color={(latestPnL ?? 0) > 0 ? 'green1' : (latestPnL ?? 0) < 0 ? 'red2' : 'inherit'}>
                    <AmountText amount={latestPnL} maxDigit={2} minDigit={2} suffix="$" />
                  </Type.H5>
                ) : (
                  <Flex alignItems="center">
                    {renderPnL(data, undefined, { fontWeight: 'bold', fontSize: '24px' })}
                    <Type.H5 mb="4px" color="neutral3">
                      $
                    </Type.H5>
                  </Flex>
                )}
                <Type.H5 ml={2} color="neutral3">
                  (
                </Type.H5>
                <Type.H5 color={latestROI > 0 ? 'green1' : latestROI < 0 ? 'red2' : 'inherit'}>
                  <PercentText percent={latestROI} digit={2} />
                </Type.H5>
                <Type.H5 color="neutral3">)</Type.H5>
                {(isOpening || data.exchange === CopyTradePlatformEnum.GNS_V8) && (
                  <>
                    <IconBox
                      icon={<Warning size={20} />}
                      color="orange"
                      sx={{ ml: 2 }}
                      data-tooltip-id={TOOLTIP_CONTENT.COPY_PNL.id + 'copy_position'}
                      data-tooltip-delay-show={260}
                    />
                    <Tooltip id={TOOLTIP_CONTENT.COPY_PNL.id + 'copy_position'}>
                      {TOOLTIP_CONTENT.COPY_PNL.content}
                    </Tooltip>
                  </>
                )}
              </Flex>
              <Flex alignItems="center" sx={{ position: 'absolute', top: 2, left: 2 }}>
                <ButtonWithIcon
                  icon={
                    <Box color={isTradingChart ? 'primary1' : 'neutral3'}>
                      <ChartBar size={20} />
                    </Box>
                  }
                  size={28}
                  variant="info"
                  p={1}
                  block
                  onClick={() => {
                    setIsTradingChart(true)
                  }}
                  sx={{ border: 'none', borderRadius: 0 }}
                  data-tip="React-tooltip"
                  data-tooltip-id="trading_chart"
                  data-tooltip-offset={8}
                />
                <ButtonWithIcon
                  sx={{ border: 'none', borderRadius: 0 }}
                  icon={
                    <Box color={!isTradingChart ? 'primary1' : 'neutral3'}>
                      <ChartLine size={20} />
                    </Box>
                  }
                  size={28}
                  variant="info"
                  p={1}
                  block
                  onClick={() => {
                    setIsTradingChart(false)
                  }}
                  data-tip="React-tooltip"
                  data-tooltip-id="profit_chart"
                  data-tooltip-offset={8}
                />
                <Tooltip id="trading_chart">
                  <Type.Caption>Trading Chart</Type.Caption>
                </Tooltip>
                <Tooltip id="profit_chart">
                  <Type.Caption>Profit Chart</Type.Caption>
                </Tooltip>
              </Flex>
              {data &&
                copyTradeOrders &&
                (isTradingChart ? (
                  <CopyRealtimeChart position={data} orders={copyTradeOrders} />
                ) : (
                  <CopyChartProfit
                    exchange={copyTradeDetails?.exchange}
                    position={data}
                    copyOrders={copyTradeOrders}
                    isOpening={isOpening ?? false}
                    openBlockTime={openBlockTimeUnix}
                    closeBlockTime={closeBlockTimeUnix}
                    setCrossMovePnL={setCrossMovePnL}
                  />
                ))}
            </Box>
          </Box>
          <Box flex="1 1 0" width="100%">
            <Tabs
              defaultActiveKey={currentTab}
              onChange={(tab) => setCurrentTab(tab)}
              sx={{
                width: '100%',
                height: '100%',
              }}
              tabItemSx={{
                px: 3,
              }}
            >
              <TabPane tab={<Trans>Orders</Trans>} key={TabKeyEnum.ORDER}>
                {currentTab === TabKeyEnum.ORDER && copyTradeOrders && copyTradeOrders.length > 0 && symbol ? (
                  <ListCopyOrderTable
                    data={copyTradeOrders}
                    isLoading={loadingOrders}
                    isOpening={isOpening}
                    symbol={symbol}
                    platform={data.exchange}
                    protocol={data.protocol}
                  />
                ) : (
                  <></>
                )}
              </TabPane>
              <TabPane tab={<Trans>History</Trans>} key={TabKeyEnum.HISTORY}>
                {currentTab === TabKeyEnum.HISTORY ? <CopyPositionHistories position={data} /> : <></>}
              </TabPane>
            </Tabs>
          </Box>
        </Flex>
      )}
    </>
  )
}

function StatsItemWrapper({ children }: { children: ReactNode }) {
  return (
    <Flex flex={['auto', 1]} flexDirection="column" sx={{ gap: 1 }}>
      {children}
    </Flex>
  )
}
function StatsItemWrapperB({ children }: { children: ReactNode }) {
  return (
    <Flex flex="1" flexDirection="column" sx={{ gap: 1, minWidth: 'max-content' }}>
      {children}
    </Flex>
  )
}

enum TabKeyEnum {
  ORDER = 'order',
  HISTORY = 'history',
}
