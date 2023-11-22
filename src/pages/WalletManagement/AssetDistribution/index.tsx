import { Trans } from '@lingui/macro'
import { CoinVertical } from '@phosphor-icons/react'
import React, { useEffect } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import SectionTitle from 'components/@ui/SectionTitle'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { Flex } from 'theme/base'
import { themeColors } from 'theme/colors'
import { FONT_FAMILY } from 'utils/config/constants'
import { getColorFromText } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'
import { parseWalletName } from 'utils/helpers/transform'

export default function AssetDistribution() {
  const { copyWallets, loadTotalSmartWallet } = useCopyWalletContext()
  const pieChartData = calculatePercentage(copyWallets)

  useEffect(() => {
    loadTotalSmartWallet()
  }, [])

  return (
    <Flex flexDirection="column" height="100%">
      <SectionTitle
        icon={<CoinVertical size={24} />}
        title={<Trans>Asset Distribution</Trans>}
        sx={{ px: 3, pt: 3, pb: 1 }}
      />
      <ResponsiveContainer minHeight={400}>
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="percentage"
            nameKey="name"
            cx="50%"
            cy="40%"
            innerRadius={70}
            outerRadius={90}
            label={(value) => `${formatNumber(value.percentage, 1)}%`}
          >
            {pieChartData.map((entry, index) => (
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
          <Legend layout="vertical" />
        </PieChart>
      </ResponsiveContainer>
    </Flex>
  )
}

function calculatePercentage(wallets?: CopyWalletData[]) {
  if (!wallets || wallets.length === 0) return []
  const totalBalance = wallets.reduce((acc, wallet) => acc + (wallet?.balance ?? 0), 0)
  return wallets.map((wallet) => {
    return {
      id: wallet.id,
      name: parseWalletName(wallet),
      balance: wallet?.balance ?? 0,
      percentage: totalBalance ? ((wallet?.balance ?? 0) / totalBalance) * 100 : 0,
      color: getColorFromText(wallet.id),
    } as ChartData
  })
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
