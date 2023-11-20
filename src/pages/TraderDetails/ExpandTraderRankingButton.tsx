import { ArrowsOutSimple } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ComponentProps, Suspense, lazy, useState } from 'react'

import SquareIconButton from 'components/@ui/SquareIconButton'

const TraderRankingExpanded = lazy(() => import('./TraderRankingExpanded'))

export default function ExpandTraderRankingButton(
  props: Omit<ComponentProps<typeof TraderRankingExpanded>, 'handleExpand'>
) {
  const [expanded, setExpanded] = useState(false)
  const { md } = useResponsive()
  if (!md) return <></>
  return (
    <>
      <SquareIconButton
        sx={{ width: 24, height: 24 }}
        icon={<ArrowsOutSimple size={18} />}
        onClick={() => setExpanded(true)}
      />
      <Suspense fallback={<></>}>
        {expanded && <TraderRankingExpanded {...props} handleExpand={setExpanded} />}
      </Suspense>
    </>
  )
}
