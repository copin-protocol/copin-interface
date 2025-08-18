import { AccountInfo } from 'components/@ui/AccountInfo'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { TraderData } from 'entities/trader'
import { ColumnData } from 'theme/Table/types'
import { Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { addressShorten, formatNumber } from 'utils/helpers/format'

export type ExternalSource = {
  keyword?: string
}
export const searchResultsColumn: ColumnData<TraderData, ExternalSource>[] = [
  {
    title: 'Trader',
    dataIndex: 'account',
    key: 'account',
    sortBy: 'account',
    style: { minWidth: ['236px', '236px', '236px', '400px'] },
    render: (item, _, externalSource) => (
      <AccountInfo
        address={item.account}
        protocol={item.protocol}
        hasLink={false}
        shouldShowFullText
        shouldShowProtocol={false}
        textSx={{ color: 'neutral1', width: 'fit-content' }}
        keyword={externalSource?.keyword ?? ''}
        label={item.smartAccount ? `Smart Wallet: ${addressShorten(item.smartAccount)}` : 'EOA Account'}
        labelSx={{ p: 0, bg: 'transparent', color: `${themeColors.neutral3} !important` }}
      />
    ),
  },
  {
    title: 'Protocol',
    dataIndex: 'protocol',
    key: 'protocol',
    sortBy: 'protocol',
    style: { minWidth: '130px' },
    render: (item) => (
      <Flex alignItems="center" justifyContent="start" sx={{ color: 'neutral1', gap: 2, position: 'relative' }}>
        <ProtocolLogo protocol={item.protocol} isActive={true} size={24} />
      </Flex>
    ),
  },
  {
    title: 'Last Trade',
    dataIndex: 'lastTradeAt',
    key: 'lastTradeAt',
    sortBy: 'lastTradeAtTs',
    style: { minWidth: '110px' },
    render: (item) => (
      <Type.Caption color="neutral1">
        {item.lastTradeAt ? <RelativeTimeText date={item.lastTradeAt} /> : '--'}
      </Type.Caption>
    ),
  },
  {
    title: 'Win Rate',
    dataIndex: 'winRate',
    key: 'winRate',
    sortBy: 'winRate',
    style: { minWidth: '75px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        <Type.Caption>{item.winRate ? `${formatNumber(item.winRate, 0, 0)}%` : '--'}</Type.Caption>
      </Type.Caption>
    ),
  },
  {
    title: 'Total Trades',
    dataIndex: 'totalTrade',
    key: 'totalTrade',
    sortBy: 'totalTrade',
    style: { minWidth: '110px', textAlign: 'right' },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        {formatNumber(item.totalTrade, 0, 0)}
      </Type.Caption>
    ),
  },
  {
    title: 'Total Volume',
    dataIndex: 'totalVolume',
    key: 'totalVolume',
    sortBy: 'totalVolume',
    style: { minWidth: '120px', textAlign: 'right', pr: 3 },
    render: (item) => (
      <Type.Caption width="100%" color="neutral1" textAlign="right">
        ${formatNumber(item.totalVolume, 0, 0)}
      </Type.Caption>
    ),
  },
]

// function AccountInfo({ data, keyword }: { data: TraderData; keyword: string }) {
//   const { isCopying } = useTraderCopying(data.account, data.protocol)
//   const { lg } = useResponsive()
//   return (
//     <Flex
//       alignItems="center"
//       justifyContent="start"
//       sx={{ color: 'neutral1', gap: 2, position: 'relative', py: '2px' }}
//     >
//       <AddressAvatar address={data.account} size={40} />
//       <Box>
//         <AddressText shouldShowFullText={lg} address={data.account} sx={{ fontWeight: 'bold', display: 'block' }} />
//         <Type.Caption color="neutral3">
//           {data.smartAccount ? `Smart Wallet: ${addressShorten(data.smartAccount)}` : 'EOA Account'}
//         </Type.Caption>
//       </Box>
//     </Flex>
//   )
// }
