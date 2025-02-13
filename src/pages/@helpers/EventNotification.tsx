import React, { memo } from 'react'

import { TradingEventStatusEnum } from 'entities/event'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import Notification from 'pages/@layouts/EventsNotification'

const EventNotification = memo(function EventNotificationMemo() {
  const { events } = useSystemConfigStore()
  const availableEvents = events?.filter((event) => event.status !== TradingEventStatusEnum.ENDED)
  return availableEvents?.length ? <Notification /> : <></>
})

export default EventNotification
