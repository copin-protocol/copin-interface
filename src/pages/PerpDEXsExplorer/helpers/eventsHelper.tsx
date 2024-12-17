import { Trans } from '@lingui/macro'

import { PerpDEXEventResponse } from 'entities/perpDexsExplorer'

export const sortEvents = (events: PerpDEXEventResponse[]) => {
  return events
    .sort((a, b) => b.featuringScore - a.featuringScore)
    .sort((a, b) => {
      const now = new Date()
      const startA = new Date(a.startTime)
      const endA = new Date(a.endTime)
      const startB = new Date(b.startTime)
      const endB = new Date(b.endTime)

      const isOngoingA = now >= startA && now <= endA
      const isOngoingB = now >= startB && now <= endB
      const isUpcomingA = now < startA
      const isUpcomingB = now < startB
      const isEndedA = now > endA
      const isEndedB = now > endB

      if (isOngoingA && !isOngoingB) return -1
      if (!isOngoingA && isOngoingB) return 1
      if (isUpcomingA && !isUpcomingB) return -1
      if (!isUpcomingA && isUpcomingB) return 1
      if (isEndedA && !isEndedB) return -1
      if (!isEndedA && isEndedB) return 1

      // If both events have the same status, sort by the end time (soonest first)
      if (isOngoingA && isOngoingB) return endA.getTime() - endB.getTime()
      if (isUpcomingA && isUpcomingB) return startA.getTime() - startB.getTime()
      if (isEndedA && isEndedB) return endA.getTime() - endB.getTime()

      return 0
    })
}

export const renderEventTime = (startTime: string, endTime: string) => {
  const now = new Date()
  const daysLeft = calcTimeLeft(startTime, endTime)
  if (now > new Date(endTime)) {
    return <Trans>Ended</Trans>
  } else if (now >= new Date(startTime) && now <= new Date(endTime)) {
    return <Trans>{`${daysLeft} days left`}</Trans>
  } else {
    return <Trans>{`Start in ${daysLeft} days`}</Trans>
  }
}

export const calcTimeLeft = (startTime: string, endTime: string) => {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)
  const dayToMillisecond = 1000 * 60 * 60 * 24

  if (now >= start && now <= end) {
    // Handle ongoing events
    return Math.ceil((end.getTime() - now.getTime()) / dayToMillisecond)
  } else if (now > end) {
    // Handle ended events
    return Math.ceil((now.getTime() - end.getTime()) / dayToMillisecond)
  } else {
    // Handle upcoming events
    return Math.ceil((start.getTime() - now.getTime()) / dayToMillisecond)
  }
}

export const checkNotEndedEvent = (startTime: string, endTime: string) => {
  const now = new Date()
  const end = new Date(endTime)
  const start = new Date(startTime)

  // Check if the event is ongoing or upcoming
  if (now <= start || now <= end) {
    return true
  }
  // Show events that ended within 7 days, after 7 days, hide them
  return calcTimeLeft(startTime, endTime) <= 7
}
