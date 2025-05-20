import { Trans } from '@lingui/macro'
import { Users } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ComponentProps, Suspense, lazy, useState } from 'react'

import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import { TraderData } from 'entities/trader'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { useUserRankingConfig } from 'hooks/store/useUserCustomize'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex } from 'theme/base'
import { ProtocolEnum, SubscriptionFeatureEnum } from 'utils/config/enums'

const TraderRankingExpanded = lazy(() => import('./TraderRankingExpanded'))
type TraderRankingExpandedProps = ComponentProps<typeof TraderRankingExpanded>

export default function ExpandTraderRankingButton(
  props: Omit<TraderRankingExpandedProps, 'handleExpand' | 'traderData' | 'traderScore'> & {
    traderData: TraderData | undefined
    protocol?: ProtocolEnum
  }
) {
  const { isAllowedProtocol, isEnableCompareTrader, requiredPlanToCompareTrader } = useTraderProfilePermission({
    protocol: props?.protocol,
  })
  const { customizedRanking } = useUserRankingConfig()

  const avgScore = !props.traderData
    ? 0
    : customizedRanking.reduce((result, key) => {
        const score = props.traderData?.ranking[key]
        if (score == null) return result
        result += score
        return result
      }, 0) / customizedRanking.length
  const [expanded, setExpanded] = useState(false)
  const { md } = useResponsive()
  if (!md) return <></>
  return (
    <>
      <Flex alignItems="center" px={3} sx={{ gap: 1 }}>
        <ButtonWithIcon
          variant="ghost"
          onClick={() => setExpanded(true)}
          sx={{
            px: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'neutral2',
            '&:hover:not(:disabled)': { color: 'neutral1' },
          }}
          icon={<Users size={20} />}
          disabled={!isEnableCompareTrader || !isAllowedProtocol}
        >
          <Trans>Compare Trader</Trans>
        </ButtonWithIcon>
        {!isEnableCompareTrader && (
          <PlanUpgradeIndicator
            requiredPlan={requiredPlanToCompareTrader}
            learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
          />
        )}
      </Flex>
      <Suspense fallback={<></>}>
        {expanded && (
          <TraderRankingExpanded
            {...(props as TraderRankingExpandedProps)}
            traderScore={avgScore}
            handleExpand={() => setExpanded(false)}
          />
        )}
      </Suspense>
    </>
  )
}
