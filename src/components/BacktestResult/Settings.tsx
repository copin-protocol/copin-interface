import { ReactElement, ReactNode } from 'react'

import TableLabel from 'components/@ui/Table/TableLabel'
import { RequestBackTestData } from 'entities/backTest.d'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { formatLocalDate, formatNumber } from 'utils/helpers/format'

export default function BacktestSettings({
  data,
  protocol,
}: {
  data: RequestBackTestData | undefined
  protocol: ProtocolEnum
}) {
  if (!data) return <></>
  return (
    <>
      <Flex mb={3} sx={{ alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
        <TableLabel>Backtest Setting:</TableLabel>
        <Type.Body color="neutral2">{`${formatLocalDate(data.fromTime, 'DD MMM YYYY')} - ${formatLocalDate(
          data.toTime,
          'DD MMM YYYY'
        )}`}</Type.Body>
      </Flex>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr'],
          gap: 3,
        }}
      >
        <SettingItem label={'Investment Capital'} value={`$${formatNumber(data.balance, 0)}`} />
        {data.orderVolume ? (
          <SettingItem
            label={'Margin | Leverage'}
            value={`$${formatNumber(data.orderVolume, 0)} | ${formatNumber(data.leverage, 1, 1)}x`}
          />
        ) : null}
        <SettingItem
          label={'Max Margin Per Position'}
          value={data.maxVolMultiplier ? `$${formatNumber(data.maxVolMultiplier * data.orderVolume, 0)}` : '--'}
        />
        <SettingItem
          label={'Volume Protection'}
          value={data.lookBackOrders ? `ON (${formatNumber(data.lookBackOrders, 0, 0)})` : 'OFF'}
          valueProps={{ color: data.lookBackOrders ? 'green1' : 'neutral3' }}
        />
        <SettingItem
          label={'Reverse'}
          value={data.reverseCopy ? 'ON' : 'OFF'}
          valueProps={{ color: data.reverseCopy ? 'green1' : 'neutral3' }}
        />
        <SettingItem
          label={'Stoploss'}
          value={data.enableStopLoss ? `ON (${formatNumber(data.stopLossAmount, 2, 2)}$)` : 'OFF'}
          valueProps={{ color: data.enableStopLoss ? 'green1' : 'neutral3' }}
        />
      </Box>
      <Box mt={3} />
      <SettingItem
        label={'Trading Pair'}
        value={
          !!data.tokenAddresses?.length
            ? data.tokenAddresses.map((address) => TOKEN_TRADE_SUPPORT[protocol][address].name).join(', ')
            : ''
        }
      />
    </>
  )
}

export function SettingItem({
  label,
  value,
  valueProps = {},
  component,
}: {
  label: ReactNode
  value?: ReactNode
  component?: ReactElement
  valueProps?: any
}) {
  return (
    <Box>
      <Type.Caption mb={2} color="neutral2">
        {label}
      </Type.Caption>
      {value ? (
        <Type.BodyBold display="block" {...valueProps}>
          {value}
        </Type.BodyBold>
      ) : null}
      {component ? component : null}
    </Box>
  )
}
