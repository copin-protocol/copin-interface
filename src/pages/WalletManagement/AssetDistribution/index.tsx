import { Trans } from '@lingui/macro'
import { CoinVertical } from '@phosphor-icons/react'
import React from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'

import SectionTitle from 'components/@ui/SectionTitle'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { Flex } from 'theme/base'
import { getColorFromText } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'
import { parseWalletName } from 'utils/helpers/transform'

export default function AssetDistribution() {
  const { copyWallets, smartWallet } = useCopyWalletContext()
  const pieChartData = calculatePercentage(copyWallets)

  return (
    <Flex flexDirection="column" height="100%">
      <SectionTitle
        icon={<CoinVertical size={24} />}
        title={<Trans>Asset Distribution</Trans>}
        sx={{ px: 3, pt: 3, pb: 1 }}
      />
      <ResponsiveContainer minHeight={436}>
        <PieChart>
          <Pie
            data={pieChartData}
            dataKey="percentage"
            nameKey="name"
            cx="50%"
            cy="40%"
            innerRadius={70}
            outerRadius={90}
            label={(value) => `${formatNumber(value.percentage, 0)}%`}
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="black" style={{ outline: 'none' }} />
            ))}
          </Pie>
          {/* <Tooltip formatter={(value) => `${formatNumber(value.toString(), 0)}%`} /> */}
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
      percentage: ((wallet?.balance ?? 0) / totalBalance) * 100,
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
