import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import { AmountText, PercentText } from 'components/@ui/DecoratedText/ValueText'
import { PositionData, TickPosition } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { Box, Flex, Type } from 'theme/base'
import { OrderTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { calcOpeningPnL, calcOpeningROI } from 'utils/helpers/calculate'

import ChartProfitComponent from './ChartProfitComponent'
import WhatIf from './WhatIf'

export default function PositionDetails({
  data,
  isOpening,
  protocol,
  isShow,
}: {
  data: PositionData | undefined
  isOpening: boolean
  protocol: ProtocolEnum
  isShow?: boolean
}) {
  const useSizeNumber = [ProtocolEnum.KWENTA, ProtocolEnum.POLYNOMIAL].includes(protocol)
  const { prices } = useGetUsdPrices()

  const tickPositions = useMemo(() => {
    const positions: TickPosition[] = []
    if (!data) return []
    const orders = data.orders.sort((x, y) =>
      x.blockNumber < y.blockNumber ? -1 : x.blockNumber > y.blockNumber ? 1 : 0
    )
    if (orders.length) {
      let totalTokenSize = 0
      let totalSize = 0
      let collateral = 0
      for (let i = 0; i < orders.length; i++) {
        const isDecrease =
          orders[i].type === OrderTypeEnum.DECREASE ||
          orders[i].type === OrderTypeEnum.CLOSE ||
          orders[i].type === OrderTypeEnum.LIQUIDATE
        const sign = isDecrease ? -1 : 1
        const sizeDelta = sign * Math.abs(orders[i].sizeDeltaNumber)
        const sizeTokenDelta =
          sign *
          (useSizeNumber
            ? orders[i].sizeNumber ?? orders[i].sizeDeltaNumber / orders[i].priceNumber
            : orders[i].sizeDeltaNumber / orders[i].priceNumber)
        const collateralDelta = sign * orders[i].collateralDeltaNumber
        const pos = {
          size: totalSize + sizeDelta,
          time: dayjs(orders[i].blockTime).utc().valueOf(),
          collateral: collateral + collateralDelta,
          price: (totalSize + sizeDelta) / (totalTokenSize + sizeTokenDelta),
        }
        positions.push(pos)
        totalSize += sizeDelta
        totalTokenSize += sizeTokenDelta
        collateral += collateralDelta
      }
    }
    return positions
  }, [data, useSizeNumber])
  const hasLiquidate = (data?.orders?.filter((e) => e.type === OrderTypeEnum.LIQUIDATE) ?? []).length > 0

  const openBlockTimeUnix = useMemo(() => (data ? dayjs(data.openBlockTime).utc().unix() : 0), [data])
  const closeBlockTimeUnix = useMemo(() => (data ? dayjs(data.closeBlockTime).utc().unix() : 0), [data])
  const to = useMemo(() => (isOpening ? dayjs().utc().unix() : closeBlockTimeUnix), [closeBlockTimeUnix, isOpening])

  const [crossMove, setCrossMove] = useState<{ pnl?: number; time?: number } | undefined>()
  const latestPnL = useMemo(() => {
    if (crossMove?.pnl === 0 || !data) return 0
    if (crossMove?.pnl) return crossMove?.pnl
    if (!isOpening) return data.pnl
    return calcOpeningPnL(data, prices[data.indexToken])
  }, [crossMove?.pnl, data, isOpening])

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
            mt={[20, 4]}
            mb={3}
            width="100%"
            alignItems="center"
            justifyContent="center"
            sx={{ gap: 2, position: 'relative' }}
          >
            <Flex>
              <Type.H5 color={latestPnL > 0 ? 'green1' : latestPnL < 0 ? 'red2' : 'inherit'}>
                <AmountText amount={latestPnL} maxDigit={0} suffix="$" />
              </Type.H5>
            </Flex>
            {!!latestROI && (
              <Flex alignItems="center">
                <Type.H5 color="neutral3">(</Type.H5>
                <Type.H5 color={latestROI > 0 ? 'green1' : latestROI < 0 ? 'red2' : 'inherit'}>
                  <PercentText percent={latestROI} digit={2} />
                </Type.H5>
                <Type.H5 color="neutral3">)</Type.H5>
              </Flex>
            )}
            {!isOpening && !!data.txHashes?.length && (
              <WhatIf
                protocol={protocol}
                txHash={data.txHashes[0]}
                account={data.account}
                logId={data.logId}
                sx={{ position: 'absolute', top: [-3, -24], right: 0 }}
              />
            )}
          </Flex>
          {data && (
            <ChartProfitComponent
              position={data}
              tickPositions={tickPositions}
              hasLiquidate={hasLiquidate}
              isOpening={isOpening}
              openBlockTime={openBlockTimeUnix}
              closeBlockTime={closeBlockTimeUnix}
              setCrossMove={setCrossMove}
              isShow={isShow}
            />
          )}
        </Box>
      )}
    </>
  )
}
