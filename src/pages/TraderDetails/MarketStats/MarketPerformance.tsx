import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { TraderTokenStatistic } from 'entities/trader'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { getSymbolFromPair } from 'utils/helpers/transform'

const SectionTitle = ({ label }: { label: ReactNode }) => (
  <Type.Caption
    sx={{
      display: 'block',
      width: '100%',
      px: '12px',
      pt: '8px',
      pb: '6px',
      borderBottom: '1px dashed',
      borderBottomColor: 'neutral5',
      flexShrink: 0,
    }}
  >
    {label}
  </Type.Caption>
)

const PerformanceList = ({
  color,
  data,
  pair,
  changePair,
  isExpanded,
}: {
  color: string
  data: TraderTokenStatistic[]
  pair?: string
  changePair: (pair: string) => void
  isExpanded: boolean
}) => {
  const maxPnl = data.reduce((max, item) => Math.max(max, Math.abs(item.realisedPnl)), 0)
  return (
    <Box>
      {data.map((item) => (
        <Flex
          key={item.pair}
          py={1}
          px={12}
          alignItems="center"
          sx={{
            bg: pair === item.pair && isExpanded ? 'neutral5' : 'transparent',
            '&:hover': isExpanded ? { bg: 'neutral5', cursor: 'pointer' } : {},
          }}
          onClick={() => changePair(item.pair)}
        >
          <Box width="70px">
            <Type.Caption>{getSymbolFromPair(item.pair)}</Type.Caption>
          </Box>
          <Box flex="1">
            <Box
              width="100%"
              sx={{ position: 'relative' }}
              // minWidth={Math.abs(item.realisedPnl) > 1000 ? '80px' : 'fit-content'}

              px={1}
              py={2}
            >
              <Box
                width={`${(Math.abs(item.realisedPnl) / maxPnl) * 100}%`}
                bg={`${color}20`}
                sx={{ position: 'absolute', top: 0, left: 0, bottom: 0 }}
              />
              <Type.Caption color={color}>
                <SignedText prefix="$" value={item.realisedPnl} isCompactNumber minDigit={2} maxDigit={2} />
              </Type.Caption>
            </Box>
          </Box>
        </Flex>
      ))}
    </Box>
  )
}

const MarketPerformance = ({
  data,
  isExpanded,
  pair,
  changePair,
}: {
  data: TraderTokenStatistic[]
  isExpanded: boolean
  pair?: string
  changePair: (pair: string) => void
}) => {
  if (!data) return null
  const goodData = data.filter((item) => item.realisedPnl > 0).sort((a, b) => b.realisedPnl - a.realisedPnl)
  const badData = data.filter((item) => item.realisedPnl < 0).sort((a, b) => a.realisedPnl - b.realisedPnl)

  return (
    <Flex flexDirection="column" height="100%" flex="auto">
      <Flex sx={{ flexShrink: 0 }} width="100%">
        <Box flex="1" height="100%" color="neutral3">
          <SectionTitle label={<Trans>GOOD MARKETS</Trans>} />
        </Box>
        <Box flex="1" height="100%" color="neutral3">
          <SectionTitle label={<Trans>BAD MARKETS</Trans>} />
        </Box>
      </Flex>
      <Flex flex="1 0 0" sx={{ overflowY: 'auto' }}>
        <Flex width="100%">
          <Box flex="1" sx={{ borderRight: '1px dashed', borderRightColor: 'neutral5' }}>
            <PerformanceList
              color={themeColors.green1}
              data={goodData}
              pair={pair}
              changePair={changePair}
              isExpanded={isExpanded}
            />
          </Box>
          <Box flex="1">
            <PerformanceList
              color={themeColors.red2}
              data={badData}
              pair={pair}
              changePair={changePair}
              isExpanded={isExpanded}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default MarketPerformance
