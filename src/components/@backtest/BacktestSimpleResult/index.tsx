import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { BackTestResultData, RequestBackTestData } from 'entities/backTest'
import { Box, Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export default function BacktestSimpleResult({
  result,
  settings,
}: {
  result: BackTestResultData
  settings: RequestBackTestData
}) {
  return (
    <>
      <ResultItem
        label={<Trans>Balance after simulation</Trans>}
        value={<SignedText value={settings.balance + result.profit} maxDigit={2} minDigit={2} prefix="$" />}
        sx={{ p: 2, alignItems: 'center' }}
      />
      <Box mt={2} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <ResultItem
          label={<Trans>Profit</Trans>}
          value={<SignedText value={result.profit} maxDigit={2} minDigit={2} prefix="$" />}
        />
        <ResultItem
          label={<Trans>ROI</Trans>}
          value={<SignedText value={result.roi} maxDigit={2} minDigit={2} suffix="%" />}
        />
        <ResultItem label={<Trans>Total Trades</Trans>} value={formatNumber(result.totalTrade)} />
        <ResultItem
          label={<Trans>Win Rate</Trans>}
          value={<SignedText value={result.winRate} maxDigit={2} minDigit={2} suffix="%" />}
        />
        <ResultItem label={<Trans>Leverage</Trans>} value={`${formatNumber(settings.leverage)}x`} />
        <ResultItem
          label={<Trans>Max Margin Multiplier</Trans>}
          value={formatNumber(result.maxVolMultiplier ?? undefined)}
        />
        <ResultItem
          label={<Trans>Max Draw Down</Trans>}
          value={<SignedText value={result.maxDrawDown} maxDigit={2} minDigit={2} suffix="%" />}
        />
        <ResultItem label={<Trans>Total Liquidation</Trans>} value={formatNumber(result.totalLiquidate)} />
      </Box>
    </>
  )
}

function ResultItem({ label, value, sx }: { label: ReactNode; value: ReactNode; sx?: any }) {
  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        bg: 'neutral7',
        borderRadius: 'sm',
        border: 'small',
        borderColor: 'neutral4',
        px: 2,
        py: 1,
        '& > *': { lineHeight: '24px' },
        ...(sx || {}),
      }}
    >
      <Type.Caption color="neutral2">{label}</Type.Caption>
      <Type.Caption>{value}</Type.Caption>
    </Flex>
  )
}
