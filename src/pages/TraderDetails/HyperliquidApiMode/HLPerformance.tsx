import { ArrowDown, ArrowUp, TrendDown, TrendUp } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React from 'react'

import ActiveDot from 'components/@ui/ActiveDot'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { AmountText } from 'components/@ui/DecoratedText/ValueText'
import { HlAccountData } from 'entities/hyperliquid'
import useHyperliquidAccountSummary from 'hooks/features/trader/useHyperliquidAccountSummary'
import ProgressBar from 'theme/ProgressBar'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { compactNumber, formatNumber } from 'utils/helpers/format'

export default function HLPerformance({ hlAccountData }: { hlAccountData?: HlAccountData }) {
  const {
    accountValue,
    marginUsage,
    directionBias,
    longValue,
    shortValue,
    longPercent,
    shortPercent,
    unrealizedPnl,
    roe,
  } = useHyperliquidAccountSummary({ hlAccountData })
  const { xl } = useResponsive()
  const isEmptyPos = !longValue && !shortValue

  return (
    <Box width="100%" height="100%">
      <Flex
        width="100%"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        sx={{ gap: 24 }}
      >
        {/* Perp Equity & Margin Usage */}
        <Flex flex={xl ? 1 : 2} width="100%" minWidth="fit-content" flexDirection="column">
          <Type.Caption color="neutral3">Perp Equity</Type.Caption>
          <Type.BodyBold color="neutral1" mb={2}>
            <AmountText amount={accountValue} maxDigit={0} prefix="$" />
          </Type.BodyBold>
          <Box alignItems="center">
            <Flex alignItems="center" justifyContent="space-between" sx={{ gap: 2, mb: 1 }}>
              <Type.Caption color="neutral3">Margin Usage</Type.Caption>
              <Type.Caption color="neutral1">{formatNumber(marginUsage, 2, 2)}%</Type.Caption>
            </Flex>
            <ProgressBar percent={marginUsage} color={themeColors.primary1} bg={themeColors.neutral4} />
          </Box>
        </Flex>

        {/* Direction Bias & Position Distribution */}
        <Flex flex={3} width="100%" minWidth="fit-content" flexDirection="column" sx={{ gap: 2 }}>
          <Flex alignItems="center" justifyContent="space-between">
            <Type.Caption color="neutral3">Direction Bias</Type.Caption>
            <Flex alignItems="center" sx={{ gap: 2 }}>
              {isEmptyPos ? (
                <></>
              ) : directionBias === 'LONG' ? (
                <TrendUp size={16} color={themeColors.green1} />
              ) : (
                <TrendDown size={16} color={themeColors.red2} />
              )}
              <Type.Caption color={isEmptyPos ? 'neutral3' : directionBias === 'LONG' ? 'green1' : 'red2'}>
                {isEmptyPos ? 'N/A' : directionBias}
              </Type.Caption>
            </Flex>
          </Flex>
          <Box>
            <Flex alignItems="center" justifyContent="space-between">
              <Type.Caption color="neutral3">Position Distribution</Type.Caption>
              {isEmptyPos ? (
                <Type.Caption color="neutral3">N/A</Type.Caption>
              ) : (
                <Flex alignItems="center" sx={{ gap: 1 }}>
                  <ActiveDot size={4} color={directionBias === 'LONG' ? 'green1' : 'red2'} />
                  <Type.Caption color={directionBias === 'LONG' ? 'green1' : 'red2'}>
                    {formatNumber(directionBias === 'LONG' ? longPercent : shortPercent, 2, 2)}%
                  </Type.Caption>
                </Flex>
              )}
            </Flex>
          </Box>
          <Flex alignItems="center">
            <Flex
              alignItems="center"
              justifyContent="center"
              sx={{
                px: 1,
                bg: `${themeColors.green1}20`,
                color: 'green1',
                width: !longValue && !shortValue ? '50%' : `${longPercent}%`,
                height: 24,
                borderRadius: '4px 0 0 4px',
              }}
            >
              <Type.Caption sx={{ overflow: 'visible', whiteSpace: 'nowrap' }}>
                {longValue ? compactNumber(longValue, 2) : ''}
              </Type.Caption>
            </Flex>
            <Flex
              alignItems="center"
              justifyContent="center"
              sx={{
                px: 1,
                bg: `${themeColors.red2}20`,
                color: 'red2',
                width: !longValue && !shortValue ? '50%' : `${shortPercent}%`,
                height: 24,
                borderRadius: '0 4px 4px 0',
              }}
            >
              <Type.Caption sx={{ overflow: 'visible', whiteSpace: 'nowrap' }}>
                {shortValue ? compactNumber(shortValue, 2) : ''}
              </Type.Caption>
            </Flex>
          </Flex>
        </Flex>

        {/* Unrealized PnL & ROE */}
        <Flex flex={1} width="100%" minWidth="fit-content" flexDirection="column" sx={{ gap: 1 }}>
          <Type.Caption color="neutral3">Unrealized PnL</Type.Caption>
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.BodyBold color={isEmptyPos ? 'neutral3' : unrealizedPnl >= 0 ? 'green1' : 'red2'}>
              {isEmptyPos ? (
                'N/A'
              ) : (
                <SignedText value={unrealizedPnl} fontInherit minDigit={0} maxDigit={0} prefix="$" />
              )}
            </Type.BodyBold>
            {!isEmptyPos && (
              <Flex
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 'fit-content',
                  height: 24,
                  px: 1,
                  bg: roe >= 0 ? `${themeColors.green1}20` : `${themeColors.red2}20`,
                  color: roe >= 0 ? 'green1' : 'red2',
                  borderRadius: '4px',
                  gap: 1,
                }}
              >
                <IconBox icon={roe >= 0 ? <ArrowUp /> : <ArrowDown />} size={16} />
                <Type.Caption>{formatNumber(roe, 2, 2)}% ROE</Type.Caption>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
