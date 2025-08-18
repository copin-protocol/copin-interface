import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import { BalanceText } from 'components/@ui/DecoratedText/ValueText'
import { TraderData } from 'entities/trader'
import useGetTokensTraded from 'hooks/features/trader/useGetTokensTraded'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { formatLocalRelativeDate, formatNumber } from 'utils/helpers/format'

export default function Stats({
  traderData,
  indicatorColor,
  isLinkAddress = false,
}: {
  traderData: TraderData
  indicatorColor: string
  isLinkAddress?: boolean
}) {
  const { account, protocol, runTimeDays, lastTradeAt, smartAccount } = traderData
  return (
    <Box sx={{ p: 3, width: '100%', height: '100%', overflow: 'auto' }}>
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Box sx={{ width: '4px', height: 24, bg: indicatorColor }} />
        <AccountInfo address={account} protocol={protocol} hasLink={isLinkAddress} avatarSize={24} />
      </Flex>
      <Flex mt={3} sx={{ width: '100%', flexDirection: 'column', gap: 12 }}>
        <StatsRow
          label={<Trans>Balance</Trans>}
          value={<BalanceText protocol={protocol} account={account} smartAccount={smartAccount} />}
        />
        <StatsRow label={<Trans>Last Trade</Trans>} value={lastTradeAt ? formatLocalRelativeDate(lastTradeAt) : '--'} />
        <StatsRow
          label={<Trans>Runtime</Trans>}
          value={
            <Box as="span">
              {runTimeDays ? (
                <>
                  {formatNumber(runTimeDays, 0, 0)} {runTimeDays > 1 ? <Trans>days</Trans> : <Trans>day</Trans>}
                </>
              ) : (
                '--'
              )}
            </Box>
          }
        />
        <TokenTrades account={account} protocol={protocol} />
      </Flex>
    </Box>
  )
}

function TokenTrades({
  account = '',
  protocol = DEFAULT_PROTOCOL,
}: {
  account: string | undefined
  protocol: ProtocolEnum | undefined
}) {
  const { getSymbolByIndexToken } = useMarketsConfig()
  const { data } = useGetTokensTraded({ account, protocol })
  const tokens = data?.length
    ? data.map((address) => getSymbolByIndexToken?.({ protocol, indexToken: address })).join(', ')
    : '--'
  return <StatsRow label={<Trans>Markets</Trans>} value={tokens} />
}

function StatsRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Flex sx={{ width: '100%', justifyContent: 'space-between', columnGap: 3, rowGap: 0, flexWrap: 'wrap' }}>
      <Type.Caption color="neutral2" sx={{ flexShrink: 0 }}>
        {label}
      </Type.Caption>
      <Type.CaptionBold>{value}</Type.CaptionBold>
    </Flex>
  )
}
