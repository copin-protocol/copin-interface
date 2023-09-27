// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'
import { useQuery } from 'react-query'

import { getSystemStatsOverviewApi } from 'apis/statisticApi'
import { StatsWithTooltip } from 'components/@ui/StatsItem'
import { Box } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'

export default function Overview() {
  const { data } = useQuery([QUERY_KEYS.GET_SYSTEM_STATS_OVERVIEW], () => getSystemStatsOverviewApi(), {
    retry: 0,
  })

  const totalNetProfitAll = data ? data.totalProfit.allTime + data.totalLoss.allTime : undefined
  const totalNetProfitToday = data ? data.totalProfit.today + data.totalLoss.today : undefined

  return (
    <Box
      mt={3}
      mb={[3, 4]}
      sx={{
        display: 'grid',
        gap: [3, 24],
        gridTemplateColumns: ['1fr', '1fr', '1fr 1fr', '1fr 1fr', 'repeat(4, 1fr)'],
      }}
    >
      <GridItemWrapper>
        <StatsItemWrapper>
          <StatsWithTooltip
            label={<Trans>Total Volume</Trans>}
            value={data?.totalVolume?.allTime}
            valueConversionFactor={data?.totalVolume?.today}
            valuePrefix="$"
            valueNum={0}
            compactNum={1}
            hasCompact
          />
        </StatsItemWrapper>
      </GridItemWrapper>
      <GridItemWrapper>
        <StatsItemWrapper>
          <StatsWithTooltip
            label={<Trans>Total Net Profit</Trans>}
            value={totalNetProfitAll}
            valueConversionFactor={totalNetProfitToday}
            valuePrefix="$"
            valueNum={0}
            compactNum={1}
            hasCompact
            valueSx={{ color: totalNetProfitAll && totalNetProfitAll < 0 ? 'red2' : 'green1' }}
          />
        </StatsItemWrapper>
      </GridItemWrapper>
      <GridItemWrapper>
        <StatsItemWrapper>
          <StatsWithTooltip
            label={<Trans>Total Orders</Trans>}
            value={data?.totalOrder?.allTime}
            valueConversionFactor={data?.totalOrder?.today}
            valuePrefix=""
            valueNum={0}
            compactNum={0}
            hasCompact
          />
        </StatsItemWrapper>
      </GridItemWrapper>
      <GridItemWrapper>
        <StatsItemWrapper>
          <StatsWithTooltip
            label={<Trans>Total Copiers</Trans>}
            value={data?.totalCopier?.allTime}
            valueConversionFactor={
              data?.totalCopier && data.totalCopier.allTime && data.totalCopier.yesterday
                ? data.totalCopier.allTime - data.totalCopier.yesterday
                : 0
            }
            valuePrefix=""
            valueNum={0}
            compactNum={0}
            hasCompact
          />
        </StatsItemWrapper>
      </GridItemWrapper>
    </Box>
  )
}

function GridItemWrapper({ children, sx }: { children: ReactNode; sx?: any }) {
  return <Box sx={{ bg: 'neutral5', ...(sx ?? {}) }}>{children}</Box>
}
function StatsItemWrapper({ children, sx }: { children: ReactNode; sx?: any }) {
  return (
    <Box
      sx={{
        p: [2, 2, 2, 3],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
        ...(sx ?? {}),
      }}
    >
      {children}
    </Box>
  )
}
