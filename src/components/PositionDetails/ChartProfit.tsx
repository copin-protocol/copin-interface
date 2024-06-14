import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import { AmountText, PercentText } from 'components/@ui/DecoratedText/ValueText'
import ValueOrToken from 'components/ValueOrToken'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { Box, Flex, Type } from 'theme/base'
import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { getOpeningPnl } from 'utils/helpers/calculate'

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
  const { prices } = useGetUsdPrices()

  const isOpening = data?.status === PositionStatusEnum.OPEN

  const openBlockTimeUnix = useMemo(() => (data ? dayjs(data.openBlockTime).utc().unix() : 0), [data])
  const closeBlockTimeUnix = useMemo(() => (data ? dayjs(data.closeBlockTime).utc().unix() : 0), [data])
  const to = useMemo(() => (isOpening ? dayjs().utc().unix() : closeBlockTimeUnix), [closeBlockTimeUnix, isOpening])

  const [crossMove, setCrossMove] = useState<{ pnl?: number; time?: number; pnlInToken?: number } | undefined>()
  const latestPnL = useMemo(() => {
    // if (!crossMove || !data) return undefined
    if (!!crossMove) return crossMove
    if (!isOpening) return { pnl: data?.pnl, pnlInToken: data?.realisedPnlInToken }
    return getOpeningPnl({ data, marketPrice: prices[data.indexToken] })
  }, [crossMove?.pnl, crossMove?.pnlInToken, data, isOpening])

  const latestROI = useMemo(() => {
    return latestPnL.pnl && data?.collateral
      ? (latestPnL.pnl / data.collateral) * 100
      : latestPnL.pnlInToken && data?.collateralInToken
      ? (latestPnL.pnlInToken / data.collateralInToken) * 100
      : data?.roi
    // if ((crossMove?.pnl === 0 && crossMove?.pnlInToken === 0) || !data) return 0
    // if (!crossMove || crossMove?.pnl == null || crossMove?.time == null) {
    //   return isOpening
    //     ? latestPnL.pnl
    //       ? latestPnL.pnl / data.collateral
    //       : latestPnL.pnlInToken
    //       ? latestPnL.pnlInToken / data.collateralInToken
    //       : 0
    //     : data.roi
    // }

    // if ((crossMove.time as number) < to) return undefined
    // if (!isOpening && (crossMove.time as number) === to) return data.roi
    // return latestPnL.pnl
    //   ? latestPnL.pnl / data.collateral
    //   : latestPnL.pnlInToken
    //   ? latestPnL.pnlInToken / data.collateralInToken
    //   : 0
  }, [data, latestPnL])

  const pnl = latestPnL?.pnl ?? latestPnL?.pnlInToken ?? 0

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
              <Type.H5 color={pnl > 0 ? 'green1' : pnl < 0 ? 'red2' : 'inherit'}>
                <ValueOrToken
                  protocol={protocol}
                  indexToken={data.collateralToken}
                  value={latestPnL?.pnl}
                  valueInToken={latestPnL?.pnlInToken}
                />
                {/* <AmountText amount={latestPnL?.pnl} maxDigit={0} suffix="$" /> */}
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
              isOpening={isOpening}
              openBlockTime={openBlockTimeUnix}
              closeBlockTime={closeBlockTimeUnix}
              setCrossMove={setCrossMove}
              chartId={chartId}
            />
          )}
        </Box>
      )}
    </>
  )
}
