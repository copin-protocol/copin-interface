import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import Highlighter from 'react-highlight-words'
import styled from 'styled-components/macro'

import ActiveDot from 'components/@ui/ActiveDot'
import AddressAvatar from 'components/@ui/AddressAvatar'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { TraderData } from 'entities/trader'
import useIsMobile from 'hooks/helpers/useIsMobile'
import useTraderCopying from 'hooks/store/useTraderCopying'
import { Button } from 'theme/Buttons'
import { Box, Flex, Type } from 'theme/base'
import { addressShorten, compactNumber, shortenText } from 'utils/helpers/format'

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
      px={3}
      py="12px"
      sx={{
        borderTop: hasBorder ? 'small' : 'none',
        borderColor: 'neutral4',
        '&:hover': {
          backgroundColor: '#292d40',
        },
      }}
    >
      <Button
        variant="ghost"
        type="button"
        onClick={() => (handleClick ? handleClick(data) : undefined)}
        sx={{ color: 'inherit', p: 0, mx: 0, display: 'flex', gap: 12 }}
        width="100%"
      >
        <Flex sx={{ flexDirection: 'column', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          <AddressAvatar address={data.account} size={40} />
          <ProtocolLogo protocol={data.protocol} size={24} hasText={false} />
        </Flex>
        <Box flex={1} sx={{ textAlign: 'left' }}>
          <Flex mb={[1, '2px']} sx={{ alignItems: 'center', gap: 12 }}>
            <Type.CaptionBold
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
            </Type.CaptionBold>
            <LastTrade
              hasLabel={false}
              value={data.lastTradeAt}
              sx={{ display: ['flex', 'flex', 'none'], flexShrink: 0 }}
            />
            <FavoriteButton
              address={data.account}
              protocol={data.protocol}
              size={20}
              sx={{ display: ['block', 'block', 'none'], flexShrink: 0 }}
            />
          </Flex>
          <Flex
            mb={[1, '2px']}
            color="neutral3"
            sx={{ width: '100%', gap: 24, justifyContent: ['space-between', 'space-between', 'start'] }}
          >
            <TotalPnL value={data.pnl} />
            <TotalVolume value={data.totalVolume} />
            <LastTrade value={data.lastTradeAt} sx={{ display: ['none', 'none', 'flex'] }} />
          </Flex>
          <Type.Caption color="neutral3" sx={{ lineHeight: '24px' }}>
            {data.smartAccount ? `Smart Wallet: ${addressShorten(data.smartAccount)}` : 'EOA Account'}
          </Type.Caption>
        </Box>
        <FavoriteButton
          address={data.account}
          protocol={data.protocol}
          size={20}
          sx={{ display: ['none', 'none', 'block'], flexShrink: 0 }}
        />
      </Button>
    </Box>
  )
}

function LastTrade({ value, hasLabel = true, sx = {} }: { value: string | undefined; hasLabel?: boolean; sx?: any }) {
  return (
    <Type.Caption sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', lineHeight: '24px', ...sx }}>
      {!!hasLabel && (
        <>
          <Box as="span">Last Trade</Box> <TextSpacer />
        </>
      )}
      <Box as="span" color="neutral1">
        <RelativeTimeText date={value} />
      </Box>
    </Type.Caption>
  )
}

function TotalVolume({ value }: { value: number | undefined }) {
  return (
    <Type.Caption sx={{ lineHeight: '24px' }}>
      Total Volume ($) <TextSpacer />
      <Box as="span" color="neutral1">
        {value ? compactNumber(value, 2) : '--'}
      </Box>
    </Type.Caption>
  )
}

function TotalPnL({ value }: { value: number | undefined }) {
  return (
    <Type.Caption sx={{ lineHeight: '24px' }}>
      Total PnL ($) <TextSpacer />
      <SignedText fontInherit value={value} maxDigit={2} minDigit={2} prefix="$" />
    </Type.Caption>
  )
}

const TextSpacer = styled(Box).attrs({ as: 'span' })`
  display: inline-block;
  width: 8px;
`

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
