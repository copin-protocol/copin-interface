import { ReactElement, ReactNode } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { BackTestResultData, RequestBackTestData } from 'entities/backTest.d'
import { Box, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export default function ResultStats({
  data,
  settings,
  displayType = 'block',
}: {
  data: BackTestResultData
  settings: RequestBackTestData | undefined
  displayType?: 'block' | 'card'
}) {
  const {
    profit = 0,
    totalTrade = 0,
    totalLiquidate = 0,
    maxDrawDown = 0,
    roi = 0,
    winRate = 0,
    maxVolMultiplier,
    totalStopLoss = 0,
    totalTakeProfit = 0,
  } = data
  const { balance = 0 } = settings ?? {}
  const balanceAfterSimulate = balance + profit
  if (balance === 0) return <></>
  const Item = displayType === 'card' ? ResultCardItem : ResultItem

  return (
    <>
      <Item
        label={'Balance After Simulation'}
        value={<SignedText value={balanceAfterSimulate} maxDigit={2} prefix="$" fontInherit />}
      />
      <Item label={'Profit'} value={<SignedText value={profit} maxDigit={2} prefix="$" fontInherit />} />
      <Item label={'ROI (%)'} value={<SignedText value={roi} maxDigit={2} suffix="%" fontInherit />} />
      <Item label={'Total Trade'} component={<Type.BodyBold display="block">{totalTrade}</Type.BodyBold>} />
      <Item label={'Win Rate (%)'} value={<SignedText value={winRate} maxDigit={2} fontInherit suffix="%" />} />
      <Item
        label={'Max Margin Multiplier'}
        value={<Type.BodyBold display="block">{formatNumber(maxVolMultiplier, 1, 1)}x</Type.BodyBold>}
      />

      <Item label={'Total Liquidate'} component={<Type.BodyBold display="block">{totalLiquidate}</Type.BodyBold>} />
      <Item
        label={'Total Stop Loss / Total Take Profit'}
        component={
          <Type.BodyBold display="block">
            {totalStopLoss} / {totalTakeProfit}
          </Type.BodyBold>
        }
      />

      <Item
        label={'Max Draw Down (%)'}
        value={<SignedText value={maxDrawDown} maxDigit={2} fontInherit suffix="%" />}
      />
    </>
  )
}

function ResultItem({ label, value, component }: { label: ReactNode; value?: ReactElement; component?: ReactElement }) {
  return (
    <Box>
      <Type.Caption mb={2} color="neutral3">
        {label}
      </Type.Caption>
      {value ? <Type.BodyBold display="block">{value}</Type.BodyBold> : null}
      {component ? component : null}
    </Box>
  )
}

function ResultCardItem({
  label,
  value,
  component,
}: {
  label: ReactNode
  value?: ReactElement
  component?: ReactElement
}) {
  return (
    <Box>
      <Type.Caption mb={2} color="neutral3">
        {label}
      </Type.Caption>
      {value ? <Type.CaptionBold display="block">{value}</Type.CaptionBold> : null}
      {component ? component : null}
    </Box>
  )
}
