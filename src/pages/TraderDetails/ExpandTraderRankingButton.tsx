import { Trans } from '@lingui/macro'
import { Users } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ComponentProps, Suspense, lazy, useState } from 'react'

import { TraderData } from 'entities/trader'
import { useRankingCustomizeStore } from 'hooks/store/useRankingCustomize'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'

const TraderRankingExpanded = lazy(() => import('./TraderRankingExpanded'))
type TraderRankingExpandedProps = ComponentProps<typeof TraderRankingExpanded>

export default function ExpandTraderRankingButton(
  props: Omit<TraderRankingExpandedProps, 'handleExpand' | 'traderData' | 'traderScore'> & {
    traderData: TraderData | undefined
  }
) {
  const { customizedRanking } = useRankingCustomizeStore()

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
      <ButtonWithIcon
        variant="ghost"
        onClick={() => setExpanded(true)}
        sx={{
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'neutral2',
          '&:hover:not(:disabled)': { color: 'neutral1' },
        }}
        icon={<Users size={20} />}
      >
        <Trans>Compare Trader</Trans>
      </ButtonWithIcon>
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
