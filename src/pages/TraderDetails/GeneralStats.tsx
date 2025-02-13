import { BalanceText } from 'components/@ui/DecoratedText/ValueText'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import { TraderData } from 'entities/trader'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { formatRelativeDate } from 'utils/helpers/format'

export default function GeneralStats({
  traderData,
  account,
  protocol,
}: {
  traderData: TraderData | undefined
  account: string
  protocol: ProtocolEnum
}) {
  const { lastTradeAt, runTimeDays, smartAccount } = traderData ?? {}
  return (
    <Box
      sx={{
        width: '100%',
        height: [60, 60, 60, 40],
        overflow: 'auto hidden',
        borderBottom: 'small',
        borderColor: 'neutral4',
      }}
    >
      <Flex
        p={[0, 12]}
        sx={{
          height: '100%',
          alignItems: 'center',
          gap: [1, 24],
          '& > *': { flexShrink: 0 },
          width: ['100%', '100%', 'max-content'],
          mr: '0',
          ml: 'auto',
          // mt: [0, 40, 40, 0],
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
            <BalanceText protocol={protocol} account={account} smartAccount={smartAccount} />
          </Type.Caption>
        </Box>
        <Box textAlign="center" flex={['1', 'none']}>
          <Type.Caption mr={[0, 2]} color="neutral3" display={['block', 'inline-block']}>
            Last Trade:
          </Type.Caption>
          <Type.Caption>{lastTradeAt ? formatRelativeDate(lastTradeAt) : '--'}</Type.Caption>
        </Box>
        <Box textAlign="center" flex={['1', 'none']}>
          <Type.Caption mr={[0, 2]} color="neutral3" display={['block', 'inline-block']}>
            Runtime:
          </Type.Caption>
          <Type.Caption>{runTimeDays ? `${runTimeDays} days` : '--'}</Type.Caption>
        </Box>
      </Flex>
    </Box>
  )
}
