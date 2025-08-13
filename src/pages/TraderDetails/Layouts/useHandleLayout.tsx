import { useResponsive } from 'ahooks'
import { useCallback, useEffect, useState } from 'react'

import useHyperliquidModeStore from 'hooks/store/useHyperliquidMode'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { STORAGE_KEYS } from 'utils/config/keys'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

export default function useHandleLayout() {
  const [statExpanded, toggleStatExpand] = useState(
    sessionStorage.getItem(STORAGE_KEYS.PROFILE_STAT_EXPANDED) === 'true'
  )
  const [positionFullExpanded, toggleFullExpand] = useState(false)
  const [openingPositionFullExpanded, toggleOpeningFullExpand] = useState(false)
  const { apiMode, toggleApiMode } = useHyperliquidModeStore()
  const { myProfile } = useMyProfileStore()
  const { xl } = useResponsive()
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

  const handleStatExpand = useCallback(() => {
    toggleStatExpand((prev) => {
      logEventLayout(
        prev ? EVENT_ACTIONS[EventCategory.LAYOUT].HIDE_STAT_FULL : EVENT_ACTIONS[EventCategory.LAYOUT].EXPAND_STAT_FULL
      )
      sessionStorage.setItem(STORAGE_KEYS.PROFILE_STAT_EXPANDED, String(!prev))
      return !prev
    })
  }, [])

  const handleApiMode = useCallback(() => {
    toggleApiMode()
  }, [toggleApiMode])

  useEffect(() => {
    if (!xl) {
      toggleChartFullExpand(false)
    }
  }, [xl])

  return {
    openingPositionFullExpanded,
    handleOpeningPositionsExpand,
    positionFullExpanded,
    handlePositionsExpand,
    chartFullExpanded,
    handleChartFullExpand,
    statExpanded,
    handleStatExpand,
    apiMode,
    handleApiMode,
  }
}
