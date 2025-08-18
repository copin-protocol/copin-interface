import { Trans } from '@lingui/macro'
import { ReactNode } from 'react'
import styled from 'styled-components/macro'
import { v4 as uuid } from 'uuid'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import TraderAddress from 'components/@ui/TraderAddress'
import { TraderData } from 'entities/trader'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { SubscriptionFeatureEnum } from 'utils/config/enums'
import { rankingFieldOptions } from 'utils/config/options'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'

export default function PercentileRankingDetails({
  data,
  comparedTrader,
  activeFields,
}: {
  data: TraderData
  comparedTrader: TraderData | null
  activeFields: (keyof TraderData)[]
}) {
  const { traderRankingFields, requiredPlanToMaxTraderRanking } = useTraderProfilePermission({
    protocol: data.protocol,
  })
  const ranking = data.ranking
  const comparedRanking = comparedTrader?.ranking
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: [3, 3, 3, 3, 24] }}>
      {comparedRanking ? (
        <>
          <Flex sx={{ width: '100%', flexDirection: 'column', gap: 24 }}>
            {rankingFieldOptions.slice(0, 6).map((option, index) => {
              return (
                <RankingComparedItem
                  account={data.account}
                  comparedAccount={comparedTrader.account}
                  key={index}
                  label={option.label}
                  value={ranking[option.value]}
                  comparedValue={comparedRanking[option.value]}
                  isActive={activeFields.includes(option.value)}
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
                    account={data.account}
                    comparedAccount={comparedTrader.account}
                    key={index}
                    label={option.label}
                    value={ranking[option.value]}
                    comparedValue={comparedRanking[option.value]}
                    isActive={activeFields.includes(option.value)}
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
                  value={!value ? '--' : Math.round(value)}
                  statLabel={option.statLabel}
                  statValue={option.statFormat?.(data[option.value])}
                  isActive={activeFields.includes(option.value)}
                />
              )
            })}
          </Flex>
          <Box sx={{ width: '100%', height: '100%', bg: 'neutral4' }} />
          <Flex sx={{ width: '100%', flexDirection: 'column', gap: 24 }}>
            {traderRankingFields.length > 6 ? (
              rankingFieldOptions.slice(6).map((option, index) => {
                const value = ranking[option.value]
                return (
                  <RankingDetailsItem
                    key={index}
                    label={option.label}
                    value={!value ? '--' : Math.round(value)}
                    statLabel={option.statLabel}
                    statValue={option.statFormat?.(data[option.value])}
                    isActive={activeFields.includes(option.value)}
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
        </>
      )}
    </Box>
  )
}

export function RankingComparedItem({
  label,
  value,
  comparedValue,
  account,
  comparedAccount,
  isActive,
}: {
  label: ReactNode
  value: number | undefined
  comparedValue: number | undefined
  account: string
  comparedAccount: string
  isActive: boolean
}) {
  const canCompare = typeof value === 'number' && typeof comparedValue === 'number'
  let _value = 0,
    _comparedValue = 0,
    diff = 0
  if (canCompare) {
    _value = Math.round(value)
    _comparedValue = Math.round(comparedValue)
    diff = _value - _comparedValue
  }
  const tooltipId = uuid()

  return (
    <>
      <Flex sx={{ alignItems: 'center', gap: 2 }}>
        <Type.Caption
          color={isActive ? 'neutral1' : 'neutral2'}
          sx={{
            width: [120, 120, 120, 120, 140],
            flexShrink: 0,
            fontWeight: isActive ? 'bold' : 'normal',
          }}
        >
          {label}
        </Type.Caption>
        <Flex data-tooltip-id={tooltipId} data-tooltip-delay-show={360} sx={{ flex: 1, alignItems: 'center', gap: 20 }}>
          {!canCompare && <Type.CaptionBold sx={{ textAlign: 'right', width: 50, flexShrink: 0 }}>--</Type.CaptionBold>}
          {canCompare && (
            <>
              <Type.CaptionBold color="primary1" sx={{ textAlign: 'right', width: 30, flexShrink: 0 }}>
                {_value}
              </Type.CaptionBold>
              <Flex sx={{ flex: 1, height: 13, bg: 'neutral4', alignItems: 'center' }}>
                <Flex sx={{ flex: 1, justifyContent: 'end', height: '100%' }}>
                  <Box
                    width={diff > 0 ? `${Math.abs(diff)}%` : 0}
                    sx={{ flexShrink: 0, height: '100%', bg: 'primary1' }}
                  />
                </Flex>
                <Box sx={{ bg: 'neutral7', width: '1px', height: '11px', flexShrink: 0 }} />
                <Flex sx={{ flex: 1, justifyContent: 'start', height: '100%' }}>
                  <Box
                    width={diff < 0 ? `${Math.abs(diff)}%` : 0}
                    sx={{ flexShrink: 0, height: '100%', bg: 'orange1' }}
                  />
                </Flex>
              </Flex>
              <Type.CaptionBold color="orange1" sx={{ width: 30, flexShrink: 0 }}>
                {_comparedValue}
              </Type.CaptionBold>
            </>
          )}
        </Flex>
      </Flex>
      {canCompare && (
        <Tooltip id={tooltipId}>
          <TooltipContent
            ranking={_value}
            comparedRanking={_comparedValue}
            account={account}
            comparedAccount={comparedAccount}
          />
        </Tooltip>
      )}
    </>
  )
}

function TooltipContent({
  ranking,
  comparedRanking,
  account,
  comparedAccount,
}: {
  ranking: number
  comparedRanking: number
  account: string
  comparedAccount: string
}) {
  // TODO: update protocol in comparing trader
  return (
    <Flex sx={{ gap: 3, width: 320 }}>
      <Type.Caption sx={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        <Box as="span" sx={{ mr: 2, display: 'inline', borderLeft: '4px solid', borderLeftColor: 'primary1' }} />
        <Box display="inline">
          <TraderAddress address={account} />
        </Box>
        <Box as="span">Better than {`${ranking.toFixed(0)}%`} traders</Box>
      </Type.Caption>
      <Type.Caption sx={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        <Box as="span" sx={{ mr: 2, display: 'inline', borderLeft: '4px solid', borderLeftColor: 'orange1' }} />
        <Box display="inline">
          <TraderAddress address={comparedAccount} />
        </Box>
        <Box as="span">Better than {`${comparedRanking.toFixed(0)}%`} traders</Box>
      </Type.Caption>
    </Flex>
  )
}
function RankingDetailsItem({
  label,
  value,
  statLabel,
  statValue,
  isActive,
}: {
  label: ReactNode
  value: ReactNode
  statLabel: ReactNode
  statValue: ReactNode
  isActive: boolean
}) {
  return (
    <Flex sx={{ width: '100%', gap: [2, 2, 2, 10] }}>
      <Type.Caption sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Box as="span" sx={{ color: isActive ? 'neutral1' : 'neutral2', fontWeight: isActive ? 'bold' : 'normal' }}>
          {label}
        </Box>
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
