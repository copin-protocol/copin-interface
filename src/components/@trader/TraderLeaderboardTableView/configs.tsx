import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { PnlTitle } from 'components/@widgets/SwitchPnlButton'
import { TopTraderData } from 'entities/trader'
import { usePnlWithFee } from 'hooks/features/usePnlWithFee'
import { ColumnData } from 'theme/Table/types'
import { Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

import LeaderInfo from './LeaderInfo'
import RankingNumber from './RankingNumber'
import { ExternalLeaderboardSource } from './types'

export const leaderboardColumns: ColumnData<TopTraderData, ExternalLeaderboardSource>[] = [
  {
    title: 'Rank',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '60px', textAlign: 'left' },
    render: (item) => <RankingNumber ranking={item.ranking} />,
  },
  {
    title: 'User',
    dataIndex: 'account',
    key: 'account',
    style: { minWidth: '200px' },
    render: (item, _, externalSource) => (
      <Flex alignItems="center" justifyContent="start" sx={{ color: 'neutral1', gap: 2, position: 'relative' }}>
        <LeaderInfo info={item} isCurrentLeaderboard={externalSource?.isCurrentLeaderboard} />
      </Flex>
    ),
  },
  {
    title: 'Total Trade',
    dataIndex: 'totalTrade',
    key: 'totalTrade',
    // sortBy: 'fee',
    style: { minWidth: ['120px', '120px'], textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        {formatNumber(item.totalTrade)}
      </Type.Caption>
    ),
  },
  {
    title: 'Total Wins',
    dataIndex: 'totalWin',
    key: 'totalWin',
    // sortBy: 'fee',
    style: { minWidth: ['120px', '120px'], textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        {formatNumber(item.totalWin)}
      </Type.Caption>
    ),
  },
  {
    title: 'Total Loses',
    dataIndex: 'totalLose',
    key: 'totalLose',
    // sortBy: 'fee',
    style: { minWidth: ['120px', '120px'], textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        {formatNumber(item.totalLose)}
      </Type.Caption>
    ),
  },
  {
    title: 'Total Liquidations',
    dataIndex: 'totalLiquidation',
    key: 'totalLiquidation',
    // sortBy: 'fee',
    style: { minWidth: ['120px', '120px'], textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        {formatNumber(item.totalLiquidation)}
      </Type.Caption>
    ),
  },
  {
    title: 'Total Volume',
    dataIndex: 'totalVolume',
    key: 'totalVolume',
    // sortBy: 'fee',
    style: { minWidth: ['120px', '160px'], textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        ${formatNumber(item.totalVolume, 0)}
      </Type.Caption>
    ),
  },
  {
    title: 'Total Paid Fees',
    dataIndex: 'totalFee',
    key: 'totalFee',
    // sortBy: 'fee',
    style: { minWidth: ['120px', '160px'], textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        ${formatNumber(item.totalFee, 0)}
      </Type.Caption>
    ),
  },
  {
    title: <PnlTitle />,
    dataIndex: 'totalRealisedPnl',
    key: 'totalRealisedPnl',
    style: { minWidth: ['120px', '160px'], textAlign: 'right' },
    render: (item) => (
      <Type.CaptionBold width="100%" color="neutral1" textAlign="right">
        <SignedText prefix="$" value={item.totalRealisedPnl} maxDigit={0} fontInherit />
      </Type.CaptionBold>
    ), //TODO: request BE
  },
]
// const PnlValueDisplay = ({ item }: { item: any }) => {
//   const value = usePnlWithFee(item)

//   return (
//     <Type.CaptionBold width="100%" color="neutral1" textAlign="right">
//       <SignedText prefix="$" value={value} maxDigit={0} fontInherit />
//     </Type.CaptionBold>
//   )
// }
