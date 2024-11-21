import { memo } from 'react'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import TimeDropdown from 'components/@ui/TimeFilter/TimeDropdown'
import { TraderData } from 'entities/trader'
import { useRankingCustomizeStore } from 'hooks/store/useRankingCustomize'
import { Box, Flex, Type } from 'theme/base'
import { rankingFieldOptions } from 'utils/config/options'

import CustomizeRankingColumns from './CustomizeRankingColumns'
import ScoreChart, { ScoreChartData } from './ScoreChart'

const TraderRanking = memo(function TraderRankingMemo({
  data,
  timeOption,
  onChangeTime,
  isDrawer,
}: {
  data: TraderData | undefined
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
  isDrawer?: boolean
}) {
  const { customizedRanking } = useRankingCustomizeStore()

  const avgScore = !data
    ? 0
    : customizedRanking.reduce((result, key) => {
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
        value: data?.ranking[option.value] ?? 0,
        fullMark: 100,
      }
    })
  // .filter((option) => !!option.value)

  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        // paddingTop: [3, 56, 56, 10],
        bg: 'neutral5',
      }}
    >
      {isDrawer ? (
        <Type.Caption sx={{ pb: 12, px: 0, width: '100%', flexShrink: 0 }} color="neutral1" textAlign="center">
          <Flex sx={{ alignItems: 'center', justifyContent: 'flex-start', width: '100%', gap: 12 }}>
            <Flex alignItems="center" sx={{ gap: 1, px: 2 }}>
              <Box as="span">Better than {avgScore.toFixed(0)}% traders in </Box>
              {timeOption.text}
            </Flex>
          </Flex>
        </Type.Caption>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Flex
            sx={{
              flexShrink: 0,
              px: 3,
              width: '100%',
              alignItems: 'center',
              height: 40,
              borderBottom: 'small',
              borderBottomColor: 'neutral4',
            }}
          >
            <TimeDropdown timeOption={timeOption} onChangeTime={onChangeTime} />
          </Flex>
          <Type.CaptionBold mt={12} sx={{ px: 3, width: '100%', flexShrink: 0 }} color="neutral1" textAlign="center">
            <Flex sx={{ alignItems: 'center', justifyContent: 'start', width: '100%', gap: 12 }}>
              <Box as="span">Better than {avgScore.toFixed(0)}% traders</Box>
              <CustomizeRankingColumns />
            </Flex>
          </Type.CaptionBold>
        </Box>
      )}
      <Flex sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <ScoreChart data={ranking} width={400} height={175} />
      </Flex>
      {/* <Box sx={{ display: ['none', 'none', 'block'], width: 'calc(100% - 32px)', height: '1px', bg: 'neutral4' }} /> */}
      {/* <Box
        sx={{
          display: ['none', 'none', 'flex'],
          alignItems: 'center',
          justifyContent: 'center',
          height: 40,
          flexShrink: 0,
          width: '100%',
        }}
      >
        <ExpandTraderRankingButton
          traderData={data}
          traderScore={avgScore}
          timeOption={timeOption}
          onChangeTime={onChangeTime}
        />
      </Box> */}
    </Flex>
  )
})

export default TraderRanking
