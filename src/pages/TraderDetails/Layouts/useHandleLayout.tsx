import { useCallback, useState } from 'react'

import useHyperliquidModeStore from 'hooks/store/useHyperliquidMode'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

export default function useHandleLayout() {
  const [positionFullExpanded, toggleFullExpand] = useState(false)
  const [openingPositionFullExpanded, toggleOpeningFullExpand] = useState(false)
  const { apiMode, toggleApiMode } = useHyperliquidModeStore()
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

  const handleOpeningPositionsExpand = useCallback(() => {
    // if (chartFullExpanded) {
    //   toggleChartFullExpand()
    // }
    toggleOpeningFullExpand((prev) => {
      logEventLayout(
        prev
          ? EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_OPENING_POSITION_FULL
          : EVENT_ACTIONS[EventCategory.LAYOUT].EXPAND_OPENING_POSITION_FULL
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

  const handleApiMode = useCallback(() => {
    toggleApiMode()
  }, [toggleApiMode])

  return {
    openingPositionFullExpanded,
    handleOpeningPositionsExpand,
    positionFullExpanded,
    handlePositionsExpand,
    chartFullExpanded,
    handleChartFullExpand,
    apiMode,
    handleApiMode,
  }
}
