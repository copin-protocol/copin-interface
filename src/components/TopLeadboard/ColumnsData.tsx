import { CaretDown, CaretUp, Minus } from '@phosphor-icons/react'
import React from 'react'
import { Link } from 'react-router-dom'

import IconRanking1 from 'assets/icons/ic-rank-1.png'
import IconRanking2 from 'assets/icons/ic-rank-2.png'
import IconRanking3 from 'assets/icons/ic-rank-3.png'
import AddressAvatar from 'components/@ui/AddressAvatar'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { ColumnData } from 'components/@ui/Table/types'
import { TopTraderData } from 'entities/trader'
import { useProtocolStore } from 'hooks/store/useProtocols'
import useTraderCopying from 'hooks/store/useTraderCopying'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import CopyButton from 'theme/Buttons/CopyButton'
import Tooltip from 'theme/Tooltip'
import { Flex, IconBox, Image, Type } from 'theme/base'
import { addressShorten, formatNumber } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'

export type ExternalSource = {
  prices: UsdPrices
}
export const LeaderboardColumns: ColumnData<TopTraderData, ExternalSource>[] = [
  {
    title: 'Rank',
    dataIndex: 'id',
    key: 'id',
    style: { minWidth: '60px', textAlign: 'left' },
    render: (item) => <RankingInfo ranking={item.ranking} />,
  },
  {
    title: 'User',
    dataIndex: 'account',
    key: 'account',
    style: { minWidth: '200px' },
    render: (item) => (
      <Flex alignItems="center" justifyContent="start" sx={{ color: 'neutral1', gap: 2, position: 'relative' }}>
        <AccountInfo info={item} />
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
  // {
  //   title: 'Total Net PnL',
  //   dataIndex: 'totalNetPnl',
  //   key: 'totalNetPnl',
  //   style: { minWidth: ['120px', '150px'], textAlign: 'right' },
  //   render: (item) => (
  //     <Type.Caption width="100%" color="neutral1" textAlign="right">
  //       <SignedText value={item.totalNetPnl} maxDigit={0} />
  //     </Type.Caption>
  //   ),
  // },
  {
    title: 'Total PnL',
    dataIndex: 'totalPnl',
    key: 'totalPnl',
    style: { minWidth: ['120px', '160px'], textAlign: 'right' },
    render: (item) => (
      <Type.CaptionBold width="100%" color="neutral1" textAlign="right">
        <SignedText prefix="$" value={item.totalPnl} maxDigit={0} fontInherit />
      </Type.CaptionBold>
    ),
  },
]

function RankingInfo({ ranking }: { ranking: number }) {
  switch (ranking) {
    case 1:
      return <Image src={IconRanking1} width={34} height={48} />
    case 2:
      return <Image src={IconRanking2} width={34} height={48} />
    case 3:
      return <Image src={IconRanking3} width={34} height={48} />
    default:
      return <Type.CaptionBold color="neutral1"># {formatNumber(ranking, 0)}</Type.CaptionBold>
  }
}

function AccountInfo({ info, size = 40 }: { info: TopTraderData; size?: number }) {
  const { protocol: defaultProtocol } = useProtocolStore()
  const { isCopying } = useTraderCopying(info.account)
  const protocol = info.protocol ?? defaultProtocol
  const deltaRanking = (info?.lastRanking ?? 1001) - info.ranking

  return (
    <Flex
      as={Link}
      to={generateTraderDetailsRoute(protocol, info.account)}
      // target="_blank"
      alignItems="center"
      sx={{
        gap: [1, 1, 2],
        color: 'inherit',
        font: 'inherit !important',
        py: 1,
      }}
      onClick={(e: any) => e.stopPropagation()}
      minWidth="200px"
    >
      <AddressAvatar address={info.account} size={size} />
      <Flex
        flexDirection="column"
        sx={{
          textAlign: 'left',
        }}
      >
        <Flex alignItems="center" sx={{ gap: 1 }}>
          <Type.CaptionBold
            data-tip="React-tooltip"
            data-tooltip-id={`account-${info.account}-tt`}
            data-tooltip-delay-hide={0}
            data-tooltip-delay-show={360}
            data-tooltip-offset={-8}
            lineHeight="24px"
            color={isCopying ? 'orange1' : 'inherit'}
            width={80}
            sx={{
              ':hover': {
                color: 'primary1',
                textDecoration: 'underline',
              },
            }}
          >
            {addressShorten(info.account, 3, 5)}
          </Type.CaptionBold>
          <Flex alignItems="center">
            <IconBox
              icon={
                deltaRanking === 0 ? (
                  <Minus />
                ) : deltaRanking > 0 ? (
                  <CaretUp weight="fill" />
                ) : (
                  <CaretDown weight="fill" />
                )
              }
              color={deltaRanking === 0 ? 'neutral1' : deltaRanking > 0 ? 'green1' : 'red2'}
            />
            <Type.Small color={deltaRanking === 0 ? 'neutral1' : deltaRanking > 0 ? 'green1' : 'red2'}>
              {deltaRanking !== 0 && formatNumber(Math.abs(deltaRanking))}
              {!info.lastRanking && '+'}
            </Type.Small>
          </Flex>
          <Tooltip
            id={`account-${info.account}-tt`}
            place="top"
            type="dark"
            effect="solid"
            noArrow={true}
            clickable={true}
            style={{
              padding: 0,
            }}
            delayShow={360}
            delayHide={0}
          >
            <div
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              <CopyButton
                variant="ghost"
                size="xs"
                value={info.account}
                iconSize={16}
                sx={{
                  transition: 'none',
                }}
              >
                Copy
              </CopyButton>
            </div>
          </Tooltip>
        </Flex>
      </Flex>
    </Flex>
  )
}
