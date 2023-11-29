import { BalanceText } from 'components/@ui/DecoratedText/ValueText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import { TraderData } from 'entities/trader'
import { Box, Flex, Type } from 'theme/base'
import { formatRelativeDate } from 'utils/helpers/format'

export default function GeneralStats({ traderData }: { traderData: TraderData | undefined }) {
  if (!traderData) return <></>
  const { account, protocol, lastTradeAt, runTimeDays } = traderData
  return (
    <Flex
      p={12}
      sx={{
        borderBottom: 'small',
        borderColor: 'neutral4',
        justifyContent: 'center',
        height: ['auto', 50],
        gap: 24,
        mt: [0, 40, 40, 0],
      }}
    >
      <Box textAlign="center" color="neutral3" flex={['1', 'none']}>
        <LabelWithTooltip
          id="tt_balance"
          sx={{
            display: ['block', 'inline-block'],
            mr: [0, 2],
          }}
          tooltip="Total value of collateral"
        >
          Balance:
        </LabelWithTooltip>
        <Type.Caption color="neutral1">
          <BalanceText protocol={protocol} account={account} />
        </Type.Caption>
      </Box>
      <Box textAlign="center" flex={['1', 'none']}>
        <Type.Caption mr={[0, 2]} color="neutral3" display={['block', 'inline-block']}>
          Last Trade:
        </Type.Caption>
        <Type.Caption>{formatRelativeDate(lastTradeAt)}</Type.Caption>
      </Box>
      <Box textAlign="center" flex={['1', 'none']}>
        <Type.Caption mr={[0, 2]} color="neutral3" display={['block', 'inline-block']}>
          Runtime:
        </Type.Caption>
        <Type.Caption>{runTimeDays} days</Type.Caption>
      </Box>
    </Flex>
  )
}
