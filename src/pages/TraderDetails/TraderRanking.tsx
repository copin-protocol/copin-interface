import { useResponsive } from 'ahooks'
import { memo } from 'react'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import TimeDropdown from 'components/@ui/TimeFilter/TimeDropdown'
import { TraderData } from 'entities/trader'
import { useRankingCustomizeStore } from 'hooks/store/useRankingCustomize'
import { Box, Flex, Type } from 'theme/base'
import { rankingFieldOptions } from 'utils/config/options'

import CustomizeRankingColumns from './CustomizeRankingColumns'
import ExpandTraderRankingButton from './ExpandTraderRankingButton'
import ScoreChart, { ScoreChartData } from './ScoreChart'

export default memo(TraderRanking)
function TraderRanking({
  data,
  timeOption,
  onChangeTime,
}: {
  data: TraderData | undefined
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
}) {
  const { sm } = useResponsive()
  const { customizedRanking } = useRankingCustomizeStore()
  if (!data?.ranking) return <div></div>
  const avgScore =
    customizedRanking.reduce((result, key) => {
      const score = data.ranking[key]
      if (score == null) return result
      result += score
      return result
    }, 0) / customizedRanking.length
  const ranking: ScoreChartData[] = rankingFieldOptions
    .filter((option) => customizedRanking.includes(option.value))
    .map((option) => {
      return {
        subject: option.label as string,
        value: data.ranking[option.value],
        fullMark: 100,
      }
    })
    .filter((option) => !!option.value)

  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: [64, 64, 64, 24],
      }}
    >
      <ScoreChart data={ranking} width={400} height={sm ? 200 : 175} />
      <Type.CaptionBold
        sx={{
          position: 'absolute',
          width: '100%',
          top: [48, 48, 48, 8],
        }}
        color="neutral1"
        textAlign="center"
      >
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', gap: '0.5ch' }}>
          <Box as="span">Better than {avgScore.toFixed(0)}% traders in</Box>
          <TimeDropdown timeOption={timeOption} onChangeTime={onChangeTime} />
        </Flex>
      </Type.CaptionBold>
      <Flex sx={{ position: 'absolute', top: [50, 50, 50, 10], right: 10, alignItems: 'center', gap: 2 }}>
        <CustomizeRankingColumns />
        <ExpandTraderRankingButton
          traderData={data}
          traderScore={avgScore}
          timeOption={timeOption}
          onChangeTime={onChangeTime}
        />
      </Flex>
    </Flex>
  )
}
