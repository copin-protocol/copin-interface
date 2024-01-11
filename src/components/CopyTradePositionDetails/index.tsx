import { Trans } from '@lingui/macro'
import dayjs from 'dayjs'
import { ReactNode, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getMyCopyOrdersApi, getMyCopyPositionDetailApi } from 'apis/copyPositionApis'
import { getCopyTradeDetailsApi } from 'apis/copyTradeApis'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import { AmountText, PercentText } from 'components/@ui/DecoratedText/ValueText'
import NoDataFound from 'components/@ui/NoDataFound'
import { renderCopyEntry } from 'components/@ui/Table/renderProps'
import { useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import { renderTrader } from 'pages/MyProfile/renderProps'
import Loading from 'theme/Loading'
import Tabs, { TabPane } from 'theme/Tab'
import Tag from 'theme/Tag'
import { Box, Flex, Type } from 'theme/base'
import { PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { COPY_POSITION_CLOSE_TYPE_TRANS } from 'utils/config/translations'
import { calcCopyOpeningPnL, calcCopyOpeningROI } from 'utils/helpers/calculate'
import { formatNumber } from 'utils/helpers/format'

import CopyChartProfit from './CopyChartProfit'
import CopyPositionHistories from './CopyPositionHistories'
import ListCopyOrderTable from './ListCopyOrderTable'

export default function CopyTradePositionDetails({ id }: { id: string }) {
  const { prices } = useRealtimeUsdPricesStore()
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITION_DETAIL, id],
    () => getMyCopyPositionDetailApi({ copyId: id }),
    {
      retry: 0,
    }
  )
  const { data: copyTradeDetails, isLoading: loadingInfo } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_SETTING_DETAIL, data?.copyTradeId],
    () => getCopyTradeDetailsApi({ id: data?.copyTradeId ?? '' }),
    {
      enabled: !!data?.copyTradeId,
      retry: 0,
    }
  )
  const { data: dataOrders, isLoading: loadingOrders } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_ORDERS, data?.copyTradeId],
    () => getMyCopyOrdersApi({ copyId: data?.id ?? '' }),
    {
      enabled: !!data?.id,
      retry: 0,
    }
  )
  const copyTradeOrders = useMemo(
    () =>
      copyTradeDetails && dataOrders
        ? dataOrders.map((e) => {
            const sizeUsd = e.size * e.price
            return { ...e, sizeUsd, collateral: sizeUsd / copyTradeDetails.leverage }
          })
        : undefined,
    [copyTradeDetails, dataOrders]
  )
  const isOpening = data && data.status === PositionStatusEnum.OPEN
  const token = data ? TOKEN_TRADE_SUPPORT[data.protocol][data.indexToken] : undefined
  const sizeDelta = useMemo(
    () =>
      isOpening
        ? Number(data?.sizeDelta)
        : copyTradeOrders?.filter((e) => e.isIncrease)?.reduce((sum, current) => sum + current.size, 0) ?? 0,
    [copyTradeOrders, data?.sizeDelta, isOpening]
  )
  const collateral = useMemo(
    () =>
      data && copyTradeOrders
        ? copyTradeOrders
            .filter((e) => e.isIncrease)
            .reduce((sum, current) => sum + (current.size * current.price) / data.leverage, 0)
        : 0,
    [copyTradeOrders, data]
  )
  const pnl = useMemo(
    () => (data ? (isOpening ? calcCopyOpeningPnL(data, prices[data.indexToken]) : data.pnl) : 0),
    [data, isOpening, prices]
  )
  const roi = data ? (pnl / collateral) * 100 : 0

  const openBlockTimeUnix = useMemo(() => (data ? dayjs(data.createdAt).utc().unix() : 0), [data])
  const closeBlockTimeUnix = useMemo(() => (data ? dayjs(data.lastOrderAt).utc().unix() : 0), [data])

  const [crossMovePnL, setCrossMovePnL] = useState<number | undefined>()
  const latestPnL = useMemo(
    () =>
      crossMovePnL === 0 ? 0 : data ? (isOpening || crossMovePnL ? (crossMovePnL ? crossMovePnL : pnl) : data.pnl) : 0,
    [crossMovePnL, data, isOpening, pnl]
  )

  const latestROI = useMemo(
    () => (crossMovePnL === 0 ? 0 : data ? (isOpening || crossMovePnL ? calcCopyOpeningROI(data, latestPnL) : roi) : 0),
    [crossMovePnL, data, isOpening, latestPnL, roi]
  )

  const [currentTab, setCurrentTab] = useState<string>(TabKeyEnum.ORDER)

  return (
    <>
      {(isLoading || loadingInfo) && <Loading />}
      {!isLoading && !loadingInfo && !data && <NoDataFound />}
      {data && (
        <Flex pb={3} sx={{ width: '100%', height: '100%', position: 'relative', flexDirection: 'column' }}>
          {/* TODO: position details */}
          {/* {copyTradeDetails && (
            <Flex flexDirection="column" px={3} py={3} sx={{ gap: 1 }}>
              <Type.BodyBold>
                {PLATFORM_TRANS[CopyTradePlatformEnum.BINGX]} {copyTradeDetails.bingXApiKey?.slice(0, 5)}{' '}
                <Type.Body color="neutral3" px={1}>
                  |
                </Type.Body>{' '}
                {copyTradeDetails.title}
              </Type.BodyBold>
              <Flex alignItems="center" sx={{ gap: 4 }}>
                <Flex alignItems="center" sx={{ gap: 2 }}>
                  <Type.Caption color="neutral3">Balance:</Type.Caption>
                  <Type.CaptionBold>${formatNumber(copyTradeDetails.bingXBalance, 2, 2)}</Type.CaptionBold>
                </Flex>
                <Flex alignItems="center" sx={{ gap: 2 }}>
                  <Type.Caption color="neutral3">Available Margin:</Type.Caption>
                  <Type.CaptionBold>${formatNumber(copyTradeDetails.bingXAvailableMargin, 2, 2)}</Type.CaptionBold>
                </Flex>
              </Flex>
            </Flex>
          )} */}
          <Flex
            alignItems="center"
            sx={{
              gap: [2, 3],
              flexWrap: 'wrap',
              borderTop: 'small',
              borderColor: 'neutral4',
              p: [2, 3],
            }}
          >
            <StatsItemWrapper>
              <Type.Caption color="neutral3">Status:</Type.Caption>
              <Tag width={70} status={data.status} />
            </StatsItemWrapper>
            <StatsItemWrapper>
              <Type.Caption color="neutral3">Copy Address:</Type.Caption>
              <Type.CaptionBold>
                {/* TODO: 2 */}
                {renderTrader(data.copyAccount, data.protocol, { textSx: { fontWeight: '600' } })}
              </Type.CaptionBold>
            </StatsItemWrapper>
            <StatsItemWrapper>
              <Type.Caption color="neutral3">Open Time:</Type.Caption>
              <Type.CaptionBold>
                <LocalTimeText date={data.createdAt} />
              </Type.CaptionBold>
            </StatsItemWrapper>
            {!isOpening ? (
              <StatsItemWrapper>
                <Type.Caption color="neutral3">Closed Time:</Type.Caption>
                <Type.CaptionBold>
                  <LocalTimeText date={data.lastOrderAt} />
                </Type.CaptionBold>
              </StatsItemWrapper>
            ) : (
              <div></div>
            )}
            {!isOpening ? (
              <StatsItemWrapper>
                <Type.Caption color="neutral3">Closed Type:</Type.Caption>
                <Type.CaptionBold>
                  {data.closeType ? COPY_POSITION_CLOSE_TYPE_TRANS[data.closeType] : '--'}
                </Type.CaptionBold>
              </StatsItemWrapper>
            ) : (
              <div></div>
            )}
          </Flex>
          <Flex
            alignItems="center"
            sx={{
              gap: [2, 3],
              px: [2, 3],
              pb: [2, 3],
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
                ${formatNumber(sizeDelta * data.entryPrice, 0)}{' '}
                <Type.Caption color="neutral3" px={1}>
                  |
                </Type.Caption>{' '}
                {formatNumber(data.leverage, 1, 1)}x{' '}
                <Type.Caption color="neutral3" px={1}>
                  |
                </Type.Caption>{' '}
                {formatNumber(sizeDelta, 4, 4)} {TOKEN_TRADE_SUPPORT[data.protocol][data.indexToken].symbol}
              </Type.CaptionBold>
            </StatsItemWrapperB>
            <StatsItemWrapperB>
              <Type.Caption color="neutral3">Collateral:</Type.Caption>
              <Type.CaptionBold>
                ${formatNumber(collateral, 2, 2)}
                {/*<SignedText value={latestPnL} maxDigit={2} prefix="$" sx={{ fontWeight: '600' }} />*/}
                {/*<Type.Caption color="neutral3" px={1}>*/}
                {/*  |*/}
                {/*</Type.Caption>{' '}*/}
                {/*<SignedText*/}
                {/*  value={latestROI}*/}
                {/*  maxDigit={2}*/}
                {/*  minDigit={2}*/}
                {/*  prefix={latestROI > 0 ? '+' : ''}*/}
                {/*  suffix="%"*/}
                {/*  sx={{ fontWeight: '600' }}*/}
                {/*/>*/}
              </Type.CaptionBold>
            </StatsItemWrapperB>
            <StatsItemWrapperB>
              <Type.Caption color="neutral3">Stop Loss Setting:</Type.Caption>
              <Type.CaptionBold>
                {copyTradeDetails?.stopLossAmount ? `$${formatNumber(copyTradeDetails.stopLossAmount, 2)}` : '--'}
              </Type.CaptionBold>
            </StatsItemWrapperB>
            {!isOpening && (
              <StatsItemWrapperB>
                <Type.Caption color="neutral3">Closed Price:</Type.Caption>
                <Type.CaptionBold>${formatNumber(data.closePrice, 2, 2)}</Type.CaptionBold>
              </StatsItemWrapperB>
            )}
          </Flex>
          <Box p={[2, 3]}>
            <Flex mb={[1, 3]} width="100%" alignItems="center" justifyContent="center">
              <Type.H5 color={latestPnL > 0 ? 'green1' : latestPnL < 0 ? 'red2' : 'inherit'}>
                <AmountText amount={latestPnL} maxDigit={2} minDigit={2} suffix="$" />
              </Type.H5>
              <Type.H5 ml={2} color="neutral3">
                (
              </Type.H5>
              <Type.H5 color={latestROI > 0 ? 'green1' : latestROI < 0 ? 'red2' : 'inherit'}>
                <PercentText percent={latestROI} digit={2} />
              </Type.H5>
              <Type.H5 color="neutral3">)</Type.H5>
            </Flex>
            {data && copyTradeOrders && (
              <CopyChartProfit
                position={data}
                copyOrders={copyTradeOrders}
                isOpening={isOpening ?? false}
                openBlockTime={openBlockTimeUnix}
                closeBlockTime={closeBlockTimeUnix}
                setCrossMovePnL={setCrossMovePnL}
              />
            )}
          </Box>
          <Box flex="1 1 0" width="100%" sx={{ overflow: 'hidden' }}>
            <Tabs
              defaultActiveKey={currentTab}
              onChange={(tab) => setCurrentTab(tab)}
              sx={{
                width: '100%',
                height: '100%',
              }}
              headerSx={{
                mb: 1,
                gap: 0,
                px: [0, 0, 3, 3],
                width: '100%',
                borderBottom: 'small',
                borderColor: 'neutral4',
              }}
              tabItemSx={{
                pt: 0,
                width: ['50%', 155],
                borderBottom: 'small',
              }}
              tabPanelSx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'auto',
                pb: 4,
              }}
            >
              <TabPane tab={<Trans>Orders</Trans>} key={TabKeyEnum.ORDER}>
                {currentTab === TabKeyEnum.ORDER && copyTradeOrders && copyTradeOrders.length > 0 && token ? (
                  <ListCopyOrderTable
                    data={copyTradeOrders}
                    isLoading={loadingOrders}
                    isOpening={isOpening}
                    token={token}
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
