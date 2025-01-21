import { ChartBar, ChartLine, Warning } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'

import { AmountText, PercentText } from 'components/@ui/DecoratedText/ValueText'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { TOOLTIP_CONTENT } from 'utils/config/options'
import { PROTOCOLS_CROSS_MARGIN } from 'utils/config/protocols'
import { calcOpeningPnL, calcOpeningROI } from 'utils/helpers/calculate'
import { formatPrice } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

import RealtimeChart from '../ChartTraderPositionProfitRealtime'
import ChartProfitComponent from './ChartProfitComponent'
import WhatIf from './WhatIf'

export default function ChartProfit({
  data,
  protocol,
  chartId,
}: {
  data: PositionData | undefined
  protocol: ProtocolEnum
  chartId: string
}) {
  const { getPricesData } = useGetUsdPrices()
  const prices = getPricesData({ protocol })

  const isOpening = data?.status === PositionStatusEnum.OPEN

  const openBlockTimeUnix = useMemo(() => (data ? dayjs(data.openBlockTime).utc().unix() : 0), [data])
  const closeBlockTimeUnix = useMemo(() => (data ? dayjs(data.closeBlockTime).utc().unix() : 0), [data])
  const to = useMemo(() => (isOpening ? dayjs().utc().unix() : closeBlockTimeUnix), [closeBlockTimeUnix, isOpening])

  const [isTradingChart, setIsTradingChart] = useState(isOpening)
  const [crossMove, setCrossMove] = useState<{ pnl?: number; time?: number } | undefined>()
  const latestPnL = useMemo(() => {
    if (crossMove?.pnl === 0 || !data) return 0
    if (crossMove?.pnl) return crossMove?.pnl
    if (!isOpening) return data.pnl
    return calcOpeningPnL(data, prices[getSymbolFromPair(data.pair)])
  }, [crossMove?.pnl, data, isOpening, prices])

  const markPrice = useMemo(() => {
    if (!data?.pair || !prices) return null
    return prices[getSymbolFromPair(data.pair)]
  }, [prices, data?.pair])

  const latestROI = useMemo(() => {
    if (crossMove?.pnl === 0 || !data) return 0
    if (!crossMove || crossMove?.pnl == null || crossMove?.time == null) {
      return isOpening ? calcOpeningROI(data, latestPnL) : data.roi
    }

    if ((crossMove.time as number) < to) return undefined
    if (!isOpening && (crossMove.time as number) === to) return data.roi
    return calcOpeningROI(data, latestPnL)
  }, [crossMove, data, isOpening, latestPnL, to])

  return (
    <>
      {data && (
        <Box>
          <Flex
            my={2}
            width="100%"
            alignItems="center"
            justifyContent="center"
            sx={{ gap: 2, position: 'relative', mt: [40, 0] }}
          >
            <Flex>
              <Type.Head color={latestPnL > 0 ? 'green1' : latestPnL < 0 ? 'red2' : 'inherit'}>
                <AmountText amount={latestPnL} maxDigit={0} suffix="$" />
              </Type.Head>
            </Flex>
            {!!latestROI && (
              <Flex alignItems="center">
                <Type.Head color="neutral3">(</Type.Head>
                <Type.Head color={latestROI > 0 ? 'green1' : latestROI < 0 ? 'red2' : 'inherit'}>
                  <PercentText percent={latestROI} digit={2} />
                </Type.Head>
                <Type.Head color="neutral3">)</Type.Head>
              </Flex>
            )}
            {!isOpening && PROTOCOLS_CROSS_MARGIN.includes(data.protocol) && (
              <>
                <IconBox
                  icon={<Warning size={20} />}
                  color="orange"
                  sx={{ ml: 1 }}
                  data-tooltip-id={TOOLTIP_CONTENT.POSITION_CROSS_ROI.id + 'trader_position'}
                  data-tooltip-delay-show={260}
                />
                <Tooltip id={TOOLTIP_CONTENT.POSITION_CROSS_ROI.id + 'trader_position'}>
                  {TOOLTIP_CONTENT.POSITION_CROSS_ROI.content}
                </Tooltip>
              </>
            )}
            {!isOpening && !isTradingChart && (
              <WhatIf
                protocol={protocol}
                txHash={data.txHashes?.[0]}
                account={data.account}
                logId={data.logId}
                isLong={data.isLong}
                id={data.id}
                sx={{ position: 'absolute', right: 0, top: [-4, 0] }}
              />
            )}
            {isOpening && !!markPrice ? (
              <Type.Body sx={{ position: 'absolute', right: 0, top: [-4, 0] }} color="neutral3">
                Mark Price:{' '}
                <Box color="neutral1" as="span">
                  {formatPrice(markPrice)}
                </Box>
              </Type.Body>
            ) : null}
            <Flex alignItems="center" sx={{ position: 'absolute', left: 0, top: [-4, 0] }}>
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
          </Flex>
          {data &&
            (isTradingChart ? (
              <RealtimeChart position={data} orders={data.orders} />
            ) : (
              <ChartProfitComponent
                position={data}
                isOpening={isOpening}
                openBlockTime={openBlockTimeUnix}
                closeBlockTime={closeBlockTimeUnix}
                setCrossMove={setCrossMove}
                chartId={chartId}
              />
            ))}
        </Box>
      )}
    </>
  )
}
