import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ComponentProps, Suspense, lazy, useState } from 'react'

import { TraderData } from 'entities/trader'
import { Button } from 'theme/Buttons'

const TraderRankingExpanded = lazy(() => import('./TraderRankingExpanded'))
type TraderRankingExpandedProps = ComponentProps<typeof TraderRankingExpanded>

export default function ExpandTraderRankingButton(
  props: Omit<TraderRankingExpandedProps, 'handleExpand' | 'traderData'> & {
    traderData: TraderData | undefined
  }
) {
  const [expanded, setExpanded] = useState(false)
  const { md } = useResponsive()
  if (!md) return <></>
  return (
    <>
      <Button
        variant="ghostPrimary"
        onClick={() => setExpanded(true)}
        sx={{ p: 0, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <span>
          <Trans>Compare / Find similar traders</Trans>
        </span>
        <ArrowRight size={16} weight="bold" />
      </Button>
      <Suspense fallback={<></>}>
        {expanded && (
          <TraderRankingExpanded {...(props as TraderRankingExpandedProps)} handleExpand={() => setExpanded(false)} />
        )}
      </Suspense>
    </>
  )
}
