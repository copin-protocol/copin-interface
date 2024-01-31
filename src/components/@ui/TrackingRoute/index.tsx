import React from 'react'

import useMyProfile from 'hooks/store/useMyProfile'
import { Box } from 'theme/base'
import { logEventRoute } from 'utils/tracking/event'

const TrackingRouteWrapper = ({ event, children }: { event: string; children: React.ReactNode }) => {
  const { myProfile } = useMyProfile()
  return <Box onClick={() => logEventRoute({ event, username: myProfile?.username })}>{children}</Box>
}

export default TrackingRouteWrapper
