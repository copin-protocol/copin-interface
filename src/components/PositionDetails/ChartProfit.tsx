import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import { AmountText, PercentText } from 'components/@ui/DecoratedText/ValueText'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { Box, Flex, Type } from 'theme/base'
import { PositionStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { calcOpeningPnL, calcOpeningROI } from 'utils/helpers/calculate'

import ChartProfitComponent from './ChartProfitComponent'
import WhatIf from './WhatIf'

export default function ChartProfit({
  data,
  protocol,
  isShow,
}: {
  data: PositionData | undefined
  protocol: ProtocolEnum
  isShow?: boolean
}) {
  const { prices } = useGetUsdPrices()

  const isOpening = data?.status === PositionStatusEnum.OPEN

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
