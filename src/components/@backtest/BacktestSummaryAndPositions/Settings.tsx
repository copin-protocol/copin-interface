import { ReactElement, ReactNode } from 'react'

import { RequestBackTestData } from 'entities/backTest.d'
import TableLabel from 'theme/Table/TableLabel'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, SLTPTypeEnum } from 'utils/config/enums'
import { formatLocalDate, formatNumber } from 'utils/helpers/format'
import { getSymbolFromPair } from 'utils/helpers/transform'

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
          label={'Stop Loss/Take Profit'}
          value={
            data.enableStopLoss || data.enableTakeProfit ? (
              <>
                {renderSLTPType({ type: data.stopLossType, value: data.stopLossAmount, color: 'red2' })}
                {' / '}
                {renderSLTPType({ type: data.takeProfitType, value: data.takeProfitAmount, color: 'green1' })}
              </>
            ) : (
              <Box as="span" color="neutral3">
                OFF
              </Box>
            )
          }
        />
      </Box>
      <Box mt={3} />
      <SettingItem
        label={'Trading Pair'}
        value={
          data?.copyAll
            ? 'Followed trader'
            : !!data.pairs?.length
            ? data.pairs?.map((e) => getSymbolFromPair(e))?.join(', ')
            : ''
        }
      />
    </>
  )
}
const renderSLTPType = ({
  type,
  value,
  color,
}: {
  type: SLTPTypeEnum | undefined
  value: number | undefined
  color: string
}) => {
  if (!value) return '--'
  if (type === SLTPTypeEnum.PERCENT) {
    return (
      <Box as="span" color={color}>
        {formatNumber(value, 2, 2) + '% ROI'}
      </Box>
    )
  }
  return (
    <Box as="span" color="green1">
      <Box as="span" color={color}>
        {'$' + formatNumber(value, 2, 2)}
      </Box>
    </Box>
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
