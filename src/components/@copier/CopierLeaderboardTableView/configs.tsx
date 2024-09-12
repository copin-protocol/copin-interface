import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { CopierRankingNumber } from 'components/@ui/LeaderboardRankingNumber'
import SubscriptionIcon from 'components/@ui/SubscriptionIcon'
import { CopierLeaderboardData } from 'entities/copier'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

import { ExternalLeaderboardSource } from './types'

export const leaderboardColumns: ColumnData<CopierLeaderboardData, ExternalLeaderboardSource>[] = [
  {
    title: (
      <Box as="span" pl={3}>
        Rank
      </Box>
    ),
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: 80, textAlign: 'left' },
    render: (item) => (
      <Flex sx={{ alignItems: 'center', justifyContent: 'start', width: 'max-content', height: 42, flexShrink: 0 }}>
        <CopierRankingNumber ranking={item.ranking} />
      </Flex>
    ),
  },
  {
    title: 'Account',
    dataIndex: 'displayName',
    key: 'displayName',
    style: { minWidth: 120 },
    render: (item) => (
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Type.CaptionBold color="neutral1">
          {item.displayName}
          {item.isMe ? (
            <Box as="span" color="primary1">
              {' '}
              (Me)
            </Box>
          ) : (
            ''
          )}
        </Type.CaptionBold>
        {!!item.plan && <SubscriptionIcon plan={item.plan} />}
      </Flex>
    ),
  },
  {
    title: 'Winrate',
    dataIndex: 'winRate',
    key: 'winRate',
    sortBy: 'winRate',
    style: { minWidth: 80, textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        {item.winRate == null ? '--' : `${formatNumber(item.winRate, 2, 2)}%`}
      </Type.Caption>
    ),
  },
  {
    title: 'Win/Lose',
    dataIndex: undefined,
    key: undefined,
    style: { minWidth: 80, textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        {formatNumber(item.totalWin, 0, 0)}/{formatNumber(item.totalLose, 0, 0)}
      </Type.Caption>
    ),
  },
  {
    title: 'Total Volume',
    dataIndex: 'volume',
    key: 'volume',
    sortBy: 'volume',
    style: { minWidth: 120, textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        ${formatNumber(item.volume, 2, 2)}
      </Type.Caption>
    ),
  },
  {
    title: 'ePnL',
    dataIndex: 'estPnl',
    key: 'estPnl',
    sortBy: 'estPnl',
    style: { minWidth: 100, textAlign: 'right' },
    render: (item) => (
      <Type.CaptionBold width="100%" color="neutral1" textAlign="right">
        <SignedText prefix="$" value={item.estPnl} maxDigit={2} minDigit={2} fontInherit />
      </Type.CaptionBold>
    ),
  },
]
