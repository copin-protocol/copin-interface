import { CaretDown, CaretUp, Minus } from '@phosphor-icons/react'

import { Flex, IconBox, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export default function RankingChangeIndicator({
  lastRanking,
  ranking,
}: {
  lastRanking: number | undefined
  ranking: number
}) {
  const deltaRanking = (lastRanking ?? 1001) - ranking

  return (
    <Flex alignItems="center">
      <IconBox
        icon={
          deltaRanking === 0 ? <Minus /> : deltaRanking > 0 ? <CaretUp weight="fill" /> : <CaretDown weight="fill" />
        }
        color={deltaRanking === 0 ? 'neutral1' : deltaRanking > 0 ? 'green1' : 'red2'}
      />
      <Type.Small color={deltaRanking === 0 ? 'neutral1' : deltaRanking > 0 ? 'green1' : 'red2'}>
        {deltaRanking !== 0 && formatNumber(Math.abs(deltaRanking))}
        {!lastRanking && '+'}
      </Type.Small>
    </Flex>
  )
}
