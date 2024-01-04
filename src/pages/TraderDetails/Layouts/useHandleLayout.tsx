import { useCallback, useState } from 'react'

import useMyProfileStore from 'hooks/store/useMyProfile'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

export default function useHandleLayout() {
  const [positionFullExpanded, toggleFullExpand] = useState(false)
  const { myProfile } = useMyProfileStore()
  const logEventLayout = useCallback(
    (action: string) => {
      logEvent({
        label: getUserForTracking(myProfile?.username),
        category: EventCategory.LAYOUT,
        action,
      })
    },
    [myProfile?.username]
  )

  const handlePositionsExpand = useCallback(() => {
    // if (chartFullExpanded) {
    //   toggleChartFullExpand()
    // }
    toggleFullExpand((prev) => {
      logEventLayout(
        prev
          ? EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_POSITION_FULL
          : EVENT_ACTIONS[EventCategory.LAYOUT].EXPAND_POSITION_FULL
      )
      return !prev
    })
  }, [])

  const [chartFullExpanded, toggleChartFullExpand] = useState(false)
  const handleChartFullExpand = useCallback(() => {
    // if (positionFullExpanded) {
    //   toggleFullExpand()
    // }
    toggleChartFullExpand((prev) => {
      logEventLayout(
        prev
          ? EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_CHART_POSITION_FULL
          : EVENT_ACTIONS[EventCategory.LAYOUT].EXPAND_CHART_POSITION_FULL
      )
      return !prev
    })
  }, [])

  return {
    positionFullExpanded,
    handlePositionsExpand,
    chartFullExpanded,
    handleChartFullExpand,
  }
}
