import React from 'react'

import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

// import { URL_PARAM_KEYS } from 'utils/config/keys'

const BackTestAction = ({ onClick, hadBacktest }: { onClick: () => void; hadBacktest: boolean }) => {
  const { myProfile } = useMyProfile()
  const { searchParams } = useSearchParams()
  // const hadBacktest = searchParams?.[URL_PARAM_KEYS.BACKTEST_DATA]

  const logEventBacktest = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.BACK_TEST,
      action,
    })
  }
  return (
    <Button
      width={['100%', '100%', '100%', 150]}
      variant={hadBacktest ? 'ghostSuccess' : 'ghost'}
      onClick={() => {
        onClick()
        logEventBacktest(
          hadBacktest
            ? EVENT_ACTIONS[EventCategory.BACK_TEST].VIEW_RESULT
            : EVENT_ACTIONS[EventCategory.BACK_TEST].OPEN_SINGLE
        )
      }}
      sx={{
        p: hadBacktest ? 0 : undefined,
        borderRadius: 0,
        height: '100%',
        borderLeft: ['none', 'small', 'small', 'small'],
        borderTop: ['small', 'small', 'small', 'none'],
        borderColor: ['neutral4', 'neutral4', 'neutral4', 'neutral4'],
      }}
    >
      {hadBacktest ? 'Backtest Result' : 'Backtest'}
    </Button>
  )
}

export default BackTestAction
