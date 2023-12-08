import { Trans } from '@lingui/macro'
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
      <Button variant="ghostWarning" onClick={() => setExpanded(true)} sx={{ p: 0 }}>
        <Trans>Compare / Find similar traders</Trans>
      </Button>
      <Suspense fallback={<></>}>
        {expanded && (
          <TraderRankingExpanded {...(props as TraderRankingExpandedProps)} handleExpand={() => setExpanded(false)} />
        )}
      </Suspense>
    </>
  )
}
