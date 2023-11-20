import { ReactNode } from 'react'
import styled from 'styled-components/macro'

import { TraderData } from 'entities/trader'
import { Box, Flex, Type } from 'theme/base'
import { rankingFieldOptions } from 'utils/config/options'
import { formatNumber } from 'utils/helpers/format'

export default function PercentileRankingDetails({
  data,
  comparedTrader,
}: {
  data: TraderData
  comparedTrader: TraderData | null
}) {
  const ranking = data.ranking
  const comparedRanking = comparedTrader?.ranking
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 24 }}>
      {comparedRanking ? (
        <>
          <Flex sx={{ width: '100%', flexDirection: 'column', gap: 24 }}>
            {rankingFieldOptions.slice(0, 6).map((option, index) => {
              return (
                <RankingComparedItem
                  key={index}
                  label={option.label}
                  value={ranking[option.value]}
                  comparedValue={comparedRanking[option.value]}
                />
              )
            })}
          </Flex>
          <Box sx={{ width: '100%', height: '100%', bg: 'neutral4' }} />
          <Flex sx={{ width: '100%', flexDirection: 'column', gap: 24 }}>
            {rankingFieldOptions.slice(6).map((option, index) => {
              return (
                <RankingComparedItem
                  key={index}
                  label={option.label}
                  value={ranking[option.value]}
                  comparedValue={comparedRanking[option.value]}
                />
              )
            })}
          </Flex>
        </>
      ) : (
        <>
          <Flex sx={{ width: '100%', flexDirection: 'column', gap: 24 }}>
            {rankingFieldOptions.slice(0, 6).map((option, index) => {
              const value = ranking[option.value]
              return (
                <RankingDetailsItem
                  key={index}
                  label={option.label}
                  value={!value ? '--' : formatNumber(value, 0, 0)}
                  statLabel={option.statLabel}
                  statValue={option.statFormat?.(data[option.value])}
                />
              )
            })}
          </Flex>
          <Box sx={{ width: '100%', height: '100%', bg: 'neutral4' }} />
          <Flex sx={{ width: '100%', flexDirection: 'column', gap: 24 }}>
            {rankingFieldOptions.slice(6).map((option, index) => {
              const value = ranking[option.value]
              return (
                <RankingDetailsItem
                  key={index}
                  label={option.label}
                  value={!value ? '--' : formatNumber(value, 0, 0)}
                  statLabel={option.statLabel}
                  statValue={option.statFormat?.(data[option.value])}
                />
              )
            })}
          </Flex>
        </>
      )}
    </Box>
  )
}

function RankingComparedItem({
  label,
  value,
  comparedValue,
}: {
  label: ReactNode
  value: number | undefined
  comparedValue: number | undefined
}) {
  const canCompare = typeof value === 'number' && typeof comparedValue === 'number'
  const diff = canCompare ? Number(value) - Number(comparedValue) : null
  return (
    <Flex sx={{ alignItems: 'center', gap: 2 }}>
      <Type.Caption sx={{ width: [120, 120, 120, 140], flexShrink: 0 }}>{label}</Type.Caption>
      <Flex sx={{ flex: 1, alignItems: 'center', gap: 20 }}>
        {!canCompare && <Type.CaptionBold sx={{ textAlign: 'right', width: 50, flexShrink: 0 }}>--</Type.CaptionBold>}
        {canCompare && diff != null && (
          <>
            <Type.CaptionBold color="primary1" sx={{ textAlign: 'right', width: [30, 30, 30, 50], flexShrink: 0 }}>
              {formatNumber(value, 0, 0)}
            </Type.CaptionBold>
            <Flex sx={{ flex: 1, height: 13, bg: 'neutral4', position: 'relative' }}>
              <Flex sx={{ flex: 1, justifyContent: 'end' }}>
                <Box
                  width={diff > 0 ? `${Math.abs(diff)}%` : 0}
                  sx={{ flexShrink: 0, height: '100%', bg: 'primary1' }}
                />
              </Flex>
              <Box sx={{ bg: 'neutral7', width: '1px', height: '11px', flexShrink: 0 }} />
              <Flex sx={{ flex: 1, justifyContent: 'start' }}>
                <Box
                  width={diff < 0 ? `${Math.abs(diff)}%` : 0}
                  sx={{ flexShrink: 0, height: '100%', bg: 'orange1' }}
                />
              </Flex>
            </Flex>
            <Type.CaptionBold color="orange1" sx={{ width: [30, 30, 30, 50], flexShrink: 0 }}>
              {formatNumber(comparedValue, 0, 0)}
            </Type.CaptionBold>
          </>
        )}
      </Flex>
    </Flex>
  )
}
function RankingDetailsItem({
  label,
  value,
  statLabel,
  statValue,
}: {
  label: ReactNode
  value: ReactNode
  statLabel: ReactNode
  statValue: ReactNode
}) {
  return (
    <Flex sx={{ width: '100%', gap: [2, 2, 2, 10] }}>
      <Type.Caption sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Box as="span">{label}</Box>
        <Box as="span">{value}</Box>
      </Type.Caption>
      <DetailsItemTextWrapper>
        (<Box as="span">{statLabel}:</Box>
        <Box as="span" ml="0.5ch">
          {statValue}
        </Box>
        )
      </DetailsItemTextWrapper>
    </Flex>
  )
}
const DetailsItemTextWrapper = styled(Type.Caption)`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.neutral3};
  & * {
    color: ${({ theme }) => theme.colors.neutral3};
  }
`
