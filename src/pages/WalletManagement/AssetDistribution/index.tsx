import { Trans } from '@lingui/macro'
import { CoinVertical } from '@phosphor-icons/react'
import { useEffect } from 'react'
import { Cell, Label, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import SectionTitle from 'components/@ui/SectionTitle'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'
import { getColorFromText, overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'
import { parseWalletName } from 'utils/helpers/transform'

export default function AssetDistribution({ hiddenBalance }: { hiddenBalance?: boolean }) {
  const { copyWallets, loadTotalSmartWallet } = useCopyWalletContext()
  const pieChartData = calculatePercentage(copyWallets)
  const totalBalance = pieChartData.totalBalance ?? 0

  useEffect(() => {
    loadTotalSmartWallet()
  }, [])

  return (
    <Flex
      flexDirection="column"
      height="100%"
      sx={{
        width: '100%',
        alignItems: 'center',
        '.recharts-label': {
          fontSize: '18px',
          fontWeight: 600,
        },
      }}
    >
      <SectionTitle
        icon={CoinVertical}
        title={<Trans>API WALLET ASSET DISTRIBUTION</Trans>}
        sx={{ px: 3, pt: 3, pb: 1 }}
      />
      <ResponsiveContainer minHeight={400}>
        <PieChart>
          <Pie
            animationDuration={0}
            data={pieChartData.chartData}
            dataKey="percentage"
            nameKey="name"
            cx="50%"
            cy="40%"
            innerRadius={70}
            outerRadius={90}
            // label={(value) => `${formatNumber(value.percentage, 1)}%`}
          >
            <Label fill={themeColors.neutral1} position="center">
              {hiddenBalance ? '*****' : `$${formatNumber(totalBalance, 0, 0)}`}
            </Label>
            {pieChartData.chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="black" style={{ outline: 'none' }} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.neutral1,
              borderColor: 'transparent',
              fontFamily: FONT_FAMILY,
            }}
            formatter={tooltipFormatter}
          />
          <Legend content={<RenderLegend />} align="left" />
        </PieChart>
      </ResponsiveContainer>
    </Flex>
  )
}

function calculatePercentage(wallets?: CopyWalletData[]) {
  if (!wallets || wallets.length === 0) return { totalBalance: 0, chartData: [] }
  const totalBalance = wallets
    .filter((w) => !w.smartWalletAddress)
    .reduce((acc, wallet) => acc + (wallet?.balance ?? 0), 0)
  return {
    totalBalance,
    chartData: wallets
      .filter((w) => !w.smartWalletAddress)
      .map((wallet) => {
        return {
          id: wallet.id,
          name: parseWalletName(wallet),
          balance: wallet?.balance ?? 0,
          percentage: totalBalance ? ((wallet?.balance ?? 0) / totalBalance) * 100 : 0,
          color: getColorFromText(wallet.id),
        } as ChartData
      }),
  }
}

interface ChartData {
  id: string
  name: string
  percentage: number
  color: string
}

function tooltipFormatter(value: any, index: any, item: any) {
  return `$${formatNumber(item?.payload?.payload?.balance)} (${formatNumber(value, 1)}%)`
}

export const RenderLegend = (props: any) => {
  const { payload } = props
  return (
    <Box
      sx={{
        px: 3,
        display: 'grid',
        gridTemplateColumns: ['1fr', '1fr 1fr', 'repeat(3, 1fr)', 'repeat(3, 1fr)', '1fr 1fr'],
        columnGap: 32,
        maxWidth: 600,
        mx: 'auto',
      }}
    >
      {payload?.map((entry: any, index: any) => (
        <>
          <Flex key={index} sx={{ width: '100%', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flexShrink: 0, width: 10, height: 10, bg: entry.color }} />
            <Type.Caption color={entry.color} sx={{ flex: '1 0 0', ...overflowEllipsis() }}>
              {entry.value}{' '}
            </Type.Caption>
            <Type.Caption color={entry.color}>({formatNumber(entry.payload?.percentage, 1, 1)}%)</Type.Caption>
          </Flex>
        </>
      ))}
    </Box>
  )
}
