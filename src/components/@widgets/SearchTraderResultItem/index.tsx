import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import Highlighter from 'react-highlight-words'
import { Link } from 'react-router-dom'

import ActiveDot from 'components/@ui/ActiveDot'
import AddressAvatar from 'components/@ui/AddressAvatar'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { TraderData } from 'entities/trader'
import useTraderCopying from 'hooks/store/useTraderCopying'
import { Box, Flex, Type } from 'theme/base'
import { addressShorten, compactNumber, shortenText } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

import FavoriteButton from '../FavoriteButton'

export default function SearchTraderResultItems({
  keyword,
  data,
  handleClick,
  hasBorder = true,
}: {
  keyword: string
  data: TraderData
  handleClick?: (data: TraderData) => void
  hasBorder?: boolean
}) {
  const { isCopying } = useTraderCopying(data.account, data.protocol)

  const { md } = useResponsive()
  return (
    <Box
      as={Link}
      to={generateTraderMultiExchangeRoute({ address: data.account, protocol: data.protocol })}
      onClick={() => handleClick?.(data)}
      px={3}
      py="12px"
      sx={{
        color: 'inherit',
        display: 'block',
        borderTop: hasBorder ? 'small' : 'none',
        borderColor: 'neutral4',
        '&:hover': {
          backgroundColor: '#292d40',
        },
      }}
    >
      <Flex sx={{ color: 'inherit', p: 0, mx: 0, gap: 12 }} width="100%">
        <Flex sx={{ flexDirection: 'column', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <AddressAvatar address={data.account} size={40} />
          <ProtocolLogo protocol={data.protocol} size={24} hasText={false} />
        </Flex>
        <Box flex={1} sx={{ textAlign: 'left' }}>
          <Flex mb={1} sx={{ alignItems: 'center', gap: 12 }}>
            <Type.BodyBold
              flex={1}
              lineHeight="24px"
              color={isCopying ? 'orange1' : 'inherit'}
              sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <HighlightKeyword text={md ? data.account : addressShorten(data.account)} keyword={keyword} />
              {data.isOpenPosition && (
                <ActiveDot
                  tooltipId={`tt_opening_${data.account}`}
                  tooltipContent={<Trans>Having open positions</Trans>}
                />
              )}
            </Type.BodyBold>
            <LastTrade value={data.lastTradeAt} sx={{ flexShrink: 0 }} />
            <FavoriteButton
              address={data.account}
              protocol={data.protocol}
              size={20}
              sx={{ display: ['block', 'block', 'none'], flexShrink: 0 }}
            />
          </Flex>
          <Flex mb={[1, '2px']} color="neutral2" sx={{ width: '100%', gap: 1 }}>
            <TotalPnL value={data.pnl} sx={{ flex: ['0 0 130px', '0 0 170px'], flexDirection: ['column', 'row'] }} />
            <TotalVolume
              value={data.totalVolume}
              sx={{ flex: ['0 0 130px', '0 0 180px'], flexDirection: ['column', 'row'] }}
            />
            {/* <LastTrade value={data.lastTradeAt} sx={{ display: ['none', 'none', 'flex'], flex: '0 0 180px' }} /> */}
          </Flex>
          <Type.Caption color="neutral3" sx={{ lineHeight: '24px' }}>
            {data.smartAccount ? `Smart Wallet: ${addressShorten(data.smartAccount)}` : 'EOA ACCOUNT'}
          </Type.Caption>
        </Box>
        <FavoriteButton
          address={data.account}
          protocol={data.protocol}
          size={20}
          sx={{ display: ['none', 'none', 'block'], flexShrink: 0 }}
        />
      </Flex>
    </Box>
  )
}

function LastTrade({ value, sx = {} }: { value: string | undefined; sx?: any }) {
  return (
    <Type.Caption
      sx={{
        display: 'flex',
        gap: [1, 2],
        alignItems: 'center',
        flexWrap: 'nowrap',
        lineHeight: '24px',
        ...sx,
      }}
    >
      <Box as="span" color="neutral3">
        Traded
      </Box>
      <Box as="span" color="neutral3">
        <RelativeTimeText date={value} />
      </Box>
    </Type.Caption>
  )
}

function TotalVolume({ value, sx = {} }: { value: number | undefined; sx?: any }) {
  return (
    <Type.Caption sx={{ display: 'flex', gap: [0, 2], lineHeight: '24px', ...sx }}>
      <Box as="span">Total Volume ($)</Box>
      <Box as="span" color="neutral1">
        {value ? compactNumber(value, 2) : '--'}
      </Box>
    </Type.Caption>
  )
}

function TotalPnL({ value, sx = {} }: { value: number | undefined; sx?: any }) {
  return (
    <Type.Caption sx={{ display: 'flex', gap: [0, 2], lineHeight: '24px', ...sx }}>
      <Box as="span">Total PnL</Box>
      <SignedText isCompactNumber fontInherit value={value} maxDigit={2} minDigit={2} prefix="$" />
    </Type.Caption>
  )
}

export function HighlightKeyword({ text, keyword }: { text: string; keyword?: string }) {
  return keyword ? (
    <Highlighter
      searchWords={[keyword, addressShorten(keyword, 3, 5), shortenText(keyword, 5), keyword.slice(-3, keyword.length)]}
      textToHighlight={text}
      highlightStyle={{
        backgroundColor: 'rgba(78, 174, 253, 0.3)',
        color: 'white',
      }}
    />
  ) : (
    <>{text}</>
  )
}
