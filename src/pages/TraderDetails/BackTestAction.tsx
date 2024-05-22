import { ArrowElbowUpLeft } from '@phosphor-icons/react'

import useMyProfile from 'hooks/store/useMyProfile'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

const BackTestAction = ({ onClick, hadBacktest }: { onClick: () => void; hadBacktest: boolean }) => {
  const { myProfile } = useMyProfile()

  const logEventBacktest = (action: string) => {
    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.BACK_TEST,
      action,
    })
  }
  return (
    <ButtonWithIcon
      width={['100%', '100%', '100%', 'auto']}
      variant={hadBacktest ? 'ghostSuccess' : 'ghost'}
      icon={<ArrowElbowUpLeft size={20} />}
      onClick={() => {
        onClick()
        logEventBacktest(
          hadBacktest
            ? EVENT_ACTIONS[EventCategory.BACK_TEST].VIEW_RESULT
            : EVENT_ACTIONS[EventCategory.BACK_TEST].OPEN_SINGLE
        )
      }}
      sx={{
        px: 3,
        borderRadius: 0,
        height: '100%',
        color: 'neutral2',
        '&:hover:not(:disabled)': { color: 'neutral1' },
      }}
    >
      {hadBacktest ? 'Backtest Result' : 'Backtest'}
    </ButtonWithIcon>
  )
}

export default BackTestAction
