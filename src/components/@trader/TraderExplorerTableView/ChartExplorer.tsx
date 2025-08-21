import { useInView } from 'react-intersection-observer'

import LineChartTraderPnl from 'components/@charts/LineChartPnL'
import { parsePnLStatsData } from 'components/@charts/LineChartPnL/helpers'
import ContentLoading from 'components/@ui/ContentLoading'
import { TraderData } from 'entities/trader'
import useGetTimeFilterOptions from 'hooks/helpers/useGetTimeFilterOptions'
import { Box, Flex } from 'theme/base'
import { TimeFilterByEnum } from 'utils/config/enums'

export function ChartExplorer({ traderData }: { traderData: TraderData }) {
  const { timeFilterOptions, defaultTimeOption } = useGetTimeFilterOptions()

  const timeOption =
    timeFilterOptions.find(
      (option) =>
        option.id ===
        ([TimeFilterByEnum.S1_DAY, TimeFilterByEnum.LAST_24H].includes(traderData.type as any)
          ? TimeFilterByEnum.S7_DAY
          : traderData.type)
    ) ?? defaultTimeOption

  const chartData = parsePnLStatsData(traderData.pnlStatistics) //mm

  if (!traderData.pnlStatistics) {
    return <Loading />
  }

  return (
    <Box
      sx={{
        height: 30,
        width: 100,
        position: 'relative',
        zIndex: 0,
        tr: { background: 'transparent !important' },
      }}
    >
      <LineChartTraderPnl
        data={chartData}
        isCumulativeData={false}
        dayCount={timeOption.value}
        isSimple
        hasBalanceText={false}
        height={30}
        lineWidth={1}
        address={traderData.account}
        protocol={traderData.protocol}
      />
    </Box>
  )
}

export function LoadingChartExplorer({ traderData }: { traderData: TraderData }) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <Flex ref={ref} style={{ minHeight: 30 }} width="100%" justifyContent={['start', 'end']}>
      {inView ? <ChartExplorer traderData={traderData} /> : <Loading />}
    </Flex>
  )
}

const Loading = () => {
  return (
    <Box
      sx={{
        height: 30,
        width: 100,
        position: 'relative',
        zIndex: 0,
      }}
    >
      <ContentLoading width={100} />
    </Box>
  )
}
