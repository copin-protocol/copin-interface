import React, { useMemo } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import { Box, Flex, Type } from 'theme/base'
import { calcOpeningPnL } from 'utils/helpers/calculate'
import { compactNumber } from 'utils/helpers/format'

interface OpenInterestOverallProps {
  longPositions: PositionData[]
  shortPositions: PositionData[]
  token: string
}

const CIRCLE_SIZE = 56

const OpenInterestOverall = ({ longPositions, shortPositions, token }: OpenInterestOverallProps) => {
  const { prices, hlPrices } = useGetUsdPrices()
  const summary = useMemo(() => {
    const totalLongSize = longPositions.reduce((sum, p) => sum + (p.size || 0), 0)
    const totalShortSize = shortPositions.reduce((sum, p) => sum + (p.size || 0), 0)
    const totalSize = totalLongSize + totalShortSize

    const totalLongPnl = longPositions.reduce(
      (sum, p) => sum + (calcOpeningPnL(p, prices?.[token] ?? hlPrices?.[token]) || 0),
      0
    )
    const totalShortPnl = shortPositions.reduce(
      (sum, p) => sum + (calcOpeningPnL(p, prices?.[token] ?? hlPrices?.[token]) || 0),
      0
    )

    return {
      highestLongSize: longPositions.reduce((max, p) => Math.max(max, p.size || 0), 0),
      highestShortSize: shortPositions.reduce((max, p) => Math.max(max, p.size || 0), 0),
      longSize: totalLongSize,
      shortSize: totalShortSize,
      totalSize,
      longPercentage: totalSize > 0 ? (totalLongSize / totalSize) * 100 : 0,
      shortPercentage: totalSize > 0 ? (totalShortSize / totalSize) * 100 : 0,
      totalLongPnl,
      totalShortPnl,
      longCount: longPositions.length,
      shortCount: shortPositions.length,
    }
  }, [longPositions, shortPositions, token, prices, hlPrices])

  const longOffset = (summary.longPercentage / 100) * CIRCLE_SIZE
  const shortOffset = (summary.shortPercentage / 100) * CIRCLE_SIZE
  return (
    <Box sx={{ position: 'relative', width: '100%', height: CIRCLE_SIZE, mb: 2 }}>
      <Flex width="100%" height="100%" alignItems="center">
        <Box flex="1" pr={CIRCLE_SIZE + 8}>
          <Flex justifyContent="flex-end">
            <Box textAlign="right" display={['none', 'block']}>
              <Type.LargeBold display="block">
                <SignedText
                  prefix="$"
                  fontInherit
                  value={summary.totalLongPnl}
                  isCompactNumber
                  minDigit={2}
                  maxDigit={2}
                />
              </Type.LargeBold>

              <Type.Caption color="neutral3">Unrealized PnL</Type.Caption>
            </Box>
            <Box textAlign="right" width="105px">
              <Type.LargeBold display="block">${compactNumber(summary.longSize)}</Type.LargeBold>
              <Type.Caption color="neutral2">{summary.longPercentage.toFixed(2)}%</Type.Caption>
              <Type.Caption display={['block', 'none']}>
                <Box as="span" color="neutral3" mr={1}>
                  uPnL:
                </Box>
                <SignedText
                  prefix="$"
                  fontInherit
                  value={summary.totalLongPnl}
                  isCompactNumber
                  minDigit={2}
                  maxDigit={2}
                />
              </Type.Caption>
            </Box>
          </Flex>
        </Box>
        <Box flex="1" pl={CIRCLE_SIZE + 8}>
          <Flex justifyContent="flex-start">
            <Box textAlign="left" width="105px">
              <Type.LargeBold display="block">${compactNumber(summary.shortSize)}</Type.LargeBold>
              <Type.Caption color="neutral2">{summary.shortPercentage.toFixed(2)}%</Type.Caption>
              <Type.Caption display={['block', 'none']}>
                <Box as="span" color="neutral3" mr={1}>
                  uPnL:
                </Box>
                <SignedText
                  prefix="$"
                  fontInherit
                  value={summary.totalShortPnl}
                  isCompactNumber
                  minDigit={2}
                  maxDigit={2}
                />
              </Type.Caption>
            </Box>
            <Box textAlign="left" display={['none', 'block']}>
              <Type.LargeBold display="block">
                <SignedText
                  prefix="$"
                  fontInherit
                  value={summary.totalShortPnl}
                  isCompactNumber
                  minDigit={2}
                  maxDigit={2}
                />
              </Type.LargeBold>
              <Type.Caption color="neutral3">Unrealized PnL</Type.Caption>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: `calc(50% - ${longOffset}px)`,
          bg: 'green1',
          zIndex: 1,
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: '100%',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, width: shortOffset, height: CIRCLE_SIZE, right: 0, bg: 'red2' }}></Box>
      </Box>
    </Box>
  )
}

export default OpenInterestOverall
