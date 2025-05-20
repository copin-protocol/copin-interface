import { Trans } from '@lingui/macro'
import { ChartBar } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import SectionTitle from 'components/@ui/SectionTitle'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { TraderData } from 'entities/trader'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { useUserRankingConfig } from 'hooks/store/useUserCustomize'
import CustomizeRankingColumn from 'pages/TraderDetails/CustomizeRankingColumns'
import ScoreChart, { ScoreChartData } from 'pages/TraderDetails/ScoreChart'
import { RankingComparedItem } from 'pages/TraderDetails/TraderRankingExpanded/PercentileRankingDetails'
import { Box, Flex } from 'theme/base'
import { linearGradient3 } from 'theme/colors'
import { SubscriptionFeatureEnum } from 'utils/config/enums'
import { rankingFieldOptions } from 'utils/config/options'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'

export type ComparisonComponentProps = {
  firstTrader: TraderData
  secondTrader: TraderData
  timeOption: TimeFilterProps
}

export default function ComparisonComponent({
  firstTrader,
  secondTrader,
  timeOption,
  firstComponent: FirstComponent,
  secondComponent: SecondComponent,
}: ComparisonComponentProps & {
  firstComponent: (props: ComparisonComponentProps) => JSX.Element
  secondComponent: (props: ComparisonComponentProps) => JSX.Element
}) {
  const { traderRankingFields, requiredPlanToMaxTraderRanking } = useTraderProfilePermission({
    protocol: firstTrader?.protocol,
  })
  const { customizedRanking } = useUserRankingConfig()
  const _rankingFieldOptions = rankingFieldOptions.filter((option) => customizedRanking.includes(option.value))
  const chartData: ScoreChartData[] = formatChartData(firstTrader?.ranking, secondTrader?.ranking)

  function formatChartData(
    sourceData: TraderData['ranking'] | undefined,
    comparedData: TraderData['ranking'] | undefined
  ) {
    return _rankingFieldOptions.reduce((result, option) => {
      const rankingData = {
        subject: option.label as string,
        value: sourceData?.[option.value] ?? 0,
        comparedValue: comparedData?.[option.value] ?? 0,
        fullMark: 100,
      }
      return [...result, rankingData]
    }, [] as ScoreChartData[])
  }
  const activeRankingField = _rankingFieldOptions.map((option) => option.value)

  const { lg } = useResponsive()

  if (!lg) return <></>

  return (
    <>
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
            backgroundImage: 'linear-gradient(180deg, rgba(78, 174, 253, 0.5) 0%, rgba(78, 174, 253, 0) 100%)',
          }}
        >
          <FirstComponent firstTrader={firstTrader} secondTrader={secondTrader} timeOption={timeOption} />
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
            account={firstTrader?.account}
            comparedAccount={secondTrader?.account}
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
            backgroundImage: 'linear-gradient(180deg, rgba(255, 194, 75, 0.5) 0%, rgba(255, 194, 75, 0) 100%)',
            borderLeft: 'small',
            borderLeftColor: 'neutral4',
          }}
        >
          <SecondComponent firstTrader={firstTrader} secondTrader={secondTrader} timeOption={timeOption} />
        </Box>
      </Flex>
      <Box sx={{ p: 3 }}>
        <SectionTitle icon={ChartBar} title={<Trans>PERCENTILE RANKING COMPARISON</Trans>} />
        <Box mb={1} />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: [3, 3, 3, 3, 24] }}>
          <Flex sx={{ width: '100%', flexDirection: 'column', gap: 24 }}>
            {_rankingFieldOptions.slice(0, 6).map((option, index) => {
              return (
                <RankingComparedItem
                  account={firstTrader.account}
                  comparedAccount={secondTrader.account}
                  key={index}
                  label={option.label}
                  value={firstTrader?.ranking?.[option.value]}
                  comparedValue={secondTrader?.ranking?.[option.value]}
                  isActive={activeRankingField.includes(option.value)}
                />
              )
            })}
          </Flex>
          <Box sx={{ width: '100%', height: '100%', bg: 'neutral4' }} />
          <Flex sx={{ width: '100%', flexDirection: 'column', gap: 24 }}>
            {traderRankingFields.length > 6 ? (
              rankingFieldOptions.slice(6).map((option, index) => {
                return (
                  <RankingComparedItem
                    account={firstTrader.account}
                    comparedAccount={secondTrader.account}
                    key={index}
                    label={option.label}
                    value={firstTrader?.ranking?.[option.value]}
                    comparedValue={secondTrader?.ranking?.[option.value]}
                    isActive={activeRankingField.includes(option.value)}
                  />
                )
              })
            ) : (
              <PlanUpgradePrompt
                requiredPlan={requiredPlanToMaxTraderRanking}
                title={
                  <Trans>Available from {SUBSCRIPTION_PLAN_TRANSLATION[requiredPlanToMaxTraderRanking]} plans</Trans>
                }
                description={<Trans>Upgrade to customize your chart and unlock all 12 insights.</Trans>}
                showTitleIcon
                showLearnMoreButton
                useLockIcon
                learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
              />
            )}
          </Flex>
        </Box>
      </Box>
    </>
  )
}
