// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { ArrowsInSimple, ChartBar, Users } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import NoDataFound from 'components/@ui/NoDataFound'
import SectionTitle from 'components/@ui/SectionTitle'
import SquareIconButton from 'components/@ui/SquareIconButton'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import TimeDropdown from 'components/@ui/TimeFilter/TimeDropdown'
import { TraderData } from 'entities/trader'
import { useRankingCustomizeStore } from 'hooks/store/useRankingCustomize'
import { Box, Flex, Type } from 'theme/base'
import { linearGradient3 } from 'theme/colors'
import { MEDIA_WIDTHS } from 'theme/theme'
import { rankingFieldOptions } from 'utils/config/options'

import CustomizeRankingColumn from '../CustomizeRankingColumns'
import ScoreChart, { ScoreChartData } from '../ScoreChart'
import FindAndSelectTrader from './FindAndSelectTrader'
import PercentileRankingDetails from './PercentileRankingDetails'
import SimilarTraders from './SimilarTraders'
import Stats from './Stats'

const MEDIA_SUPER_LARGE = 1500

export default function TraderRankingExpanded({
  traderData,
  traderScore,
  timeOption,
  onChangeTime,
  handleExpand,
}: {
  traderData: TraderData | undefined
  traderScore: number
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
  handleExpand: (expanded: boolean) => void
}) {
  const [layoutConfigs, setLayoutConfigs] = useState<{
    position: { top: number; left: number; right: number; bottom: number } | null
    windowWidth: number
  }>({ position: null, windowWidth: window.innerWidth })
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth
      if (windowWidth >= MEDIA_WIDTHS.upToLarge) {
        setLayoutConfigs({ position: { top: 172, left: 0, right: 0, bottom: 40 }, windowWidth })
      } else if (windowWidth >= MEDIA_WIDTHS.upToMedium) {
        setLayoutConfigs({ position: { top: 60, left: 0, right: 0, bottom: 40 }, windowWidth })
      } else if (windowWidth >= MEDIA_WIDTHS.upToSmall) {
        setLayoutConfigs({ position: { top: 160, left: 0, right: 0, bottom: 96 }, windowWidth })
      } else {
        setLayoutConfigs({ position: null, windowWidth })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const [selectedTrader, setSelectedTrader] = useState<TraderData | null>(null)
  const handleSelectTrader = (data: TraderData | null) => setSelectedTrader(data)
  const { customizedRanking } = useRankingCustomizeStore()

  const _rankingFieldOptions = rankingFieldOptions.filter((option) => customizedRanking.includes(option.value))
  const chartData: ScoreChartData[] = formatChartData(traderData?.ranking, selectedTrader?.ranking)

  function formatChartData(sourceData: TraderData['ranking'] | undefined, comparedData?: TraderData['ranking']) {
    if (!sourceData) return [] as ScoreChartData[]
    return _rankingFieldOptions.reduce((result, option) => {
      const rankingValue = sourceData[option.value]
      if (!rankingValue) return result
      const rankingData = {
        subject: option.label as string,
        value: rankingValue,
        comparedValue: comparedData?.[option.value],
        fullMark: 100,
      }
      return [...result, rankingData]
    }, [] as ScoreChartData[])
  }
  const activeRankingField = _rankingFieldOptions.map((option) => option.value)

  if (!layoutConfigs.position) return <></>

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'fixed',
        borderTop: 'small',
        borderTopColor: 'neutral4',
        ...layoutConfigs.position,
        bg: 'neutral8',
        zIndex: 10,
      }}
    >
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
        <Flex
          sx={{
            alignItems: 'center',
            gap: 3,
            justifyContent: 'space-between',
            p: 3,
            borderBottom: 'small',
            borderBottomColor: 'neutral4',
          }}
        >
          <Type.Body>
            <Flex
              sx={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                gap: '0.5ch',
                '& *': { fontSize: '1em !important' },
              }}
            >
              <Box as="span">Better than {traderScore?.toFixed(0)}% traders in</Box>
              <TimeDropdown timeOption={timeOption} onChangeTime={onChangeTime} />
            </Flex>
          </Type.Body>
          <SquareIconButton
            icon={<ArrowsInSimple size={18} />}
            onClick={() => handleExpand(false)}
            sx={{ width: 24, height: 24 }}
          />
        </Flex>

        {/* Main */}
        {!traderData && (
          <>
            <NoDataFound message={<Trans>Trader don&apos;t have statistic in {timeOption.text}</Trans>} />
          </>
        )}
        {traderData && (
          <Flex
            sx={{
              flex: '1 0 0',
              overflow: ['auto', 'auto', 'auto', 'hidden'],
              flexDirection: ['column', 'column', 'column', 'row'],
            }}
          >
            {/* Details */}
            <Box
              flex="1"
              sx={{
                overflow: ['visible', 'visible', 'visible', 'hidden auto'],
                borderRight: 'small',
                borderRightColor: 'neutral4',
                borderBottom: ['small', 'small', 'small', 'small'],
                borderBottomColor: ['neutral4', 'neutral4', 'neutral4', 'transparent'],
              }}
            >
              {layoutConfigs.windowWidth > MEDIA_SUPER_LARGE ? (
                <Flex
                  height={300}
                  sx={{
                    borderBottom: 'small',
                    borderBottomColor: 'neutral4',
                  }}
                >
                  <Box
                    sx={{
                      borderRight: 'small',
                      borderRightColor: 'neutral4',
                      width: 245,
                      height: '100%',
                      overflow: 'hidden',
                      backgroundImage:
                        'linear-gradient(180deg, rgba(78, 174, 253, 0.5) 0%, rgba(78, 174, 253, 0) 100%)',
                    }}
                  >
                    <Stats traderData={traderData} indicatorColor="primary1" />
                  </Box>
                  <Flex
                    sx={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundImage: linearGradient3,
                      borderRight: 'small',
                      borderRightColor: 'neutral8',
                      position: 'relative',
                    }}
                  >
                    <ScoreChart
                      data={chartData}
                      width={500}
                      height={300}
                      account={traderData.account}
                      comparedAccount={selectedTrader?.account}
                    />
                    <Box sx={{ position: 'absolute', top: 3, right: 3 }}>
                      <CustomizeRankingColumn />
                    </Box>
                  </Flex>

                  <Box
                    sx={{
                      width: 245,
                      height: '100%',
                      overflow: 'auto',
                      ...(selectedTrader
                        ? {
                            backgroundImage:
                              'linear-gradient(180deg, rgba(255, 194, 75, 0.5) 0%, rgba(255, 194, 75, 0) 100%)',
                          }
                        : { bg: 'neutral5' }),
                    }}
                  >
                    <FindAndSelectTrader
                      selectedTrader={selectedTrader}
                      onSelect={handleSelectTrader}
                      ignoreSelectTraders={[traderData]}
                      timeOption={timeOption}
                      onClear={() => setSelectedTrader(null)}
                    />
                  </Box>
                </Flex>
              ) : (
                <Flex
                  height={600}
                  width="100%"
                  sx={{
                    borderBottom: 'small',
                    borderBottomColor: 'neutral4',
                    overflow: 'hidden',
                    flexDirection: 'column',
                  }}
                >
                  <Flex sx={{ width: '100%', height: 'max-content', maxHeight: 300, flexShrink: 0 }}>
                    <Box
                      sx={{
                        flex: 1,
                        borderRight: 'small',
                        borderRightColor: 'neutral4',
                        height: '100%',
                        overflow: 'hidden',
                        backgroundImage:
                          'linear-gradient(180deg, rgba(78, 174, 253, 0.5) 0%, rgba(78, 174, 253, 0) 100%)',
                      }}
                    >
                      <Stats traderData={traderData} indicatorColor="primary1" />
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        height: '100%',
                        overflow: 'auto',
                        ...(selectedTrader
                          ? {
                              backgroundImage:
                                'linear-gradient(180deg, rgba(255, 194, 75, 0.5) 0%, rgba(255, 194, 75, 0) 100%)',
                            }
                          : { bg: 'neutral5' }),
                      }}
                    >
                      <FindAndSelectTrader
                        selectedTrader={selectedTrader}
                        onSelect={handleSelectTrader}
                        ignoreSelectTraders={[traderData]}
                        timeOption={timeOption}
                        onClear={() => setSelectedTrader(null)}
                      />
                    </Box>
                  </Flex>
                  <Flex
                    sx={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundImage: linearGradient3,
                      borderRight: 'small',
                      borderRightColor: 'neutral8',
                      position: 'relative',
                    }}
                  >
                    <ScoreChart
                      data={chartData}
                      width={500}
                      height={300}
                      account={traderData.account}
                      comparedAccount={selectedTrader?.account}
                    />
                    <Box sx={{ position: 'absolute', top: 3, right: 3 }}>
                      <CustomizeRankingColumn />
                    </Box>
                  </Flex>
                </Flex>
              )}

              <Box sx={{ p: 3 }}>
                <SectionTitle icon={<ChartBar size={24} />} title={<Trans>Percentile Ranking Comparison</Trans>} />
                <Box mb={1} />
                <PercentileRankingDetails
                  data={traderData}
                  comparedTrader={selectedTrader}
                  activeFields={activeRankingField}
                />
              </Box>
            </Box>

            {/* Similar traders */}
            <Box
              sx={{
                width:
                  layoutConfigs.windowWidth > MEDIA_SUPER_LARGE
                    ? 512
                    : layoutConfigs.windowWidth > MEDIA_WIDTHS.upToMedium
                    ? 400
                    : 'auto',
                height: ['auto', 'auto', 'auto', '100%'],
                display: ['block', 'block', 'block', 'flex'],
                overflow: 'hidden',
                flexShrink: 0,
                flexDirection: 'column',
              }}
            >
              <Box mb="6px" p={3} pb={0}>
                <SectionTitle icon={<Users size={24} />} title={<Trans>Similar Traders</Trans>} />
              </Box>
              <Box sx={{ flex: '1 0 0', overflow: 'auto' }}>
                <SimilarTraders
                  traderData={traderData}
                  selectedTrader={selectedTrader}
                  rankingFieldOptions={_rankingFieldOptions}
                  timeOption={timeOption}
                  formatChartData={formatChartData}
                  onClickCompareButton={handleSelectTrader}
                />
              </Box>
            </Box>
          </Flex>
        )}
      </Flex>
    </Box>
  )
}
