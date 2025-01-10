import TimeFilter from 'components/@ui/TimeFilter/TimeFilter'
import { COPIER_LEADERBOARD_TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import useCopierLeaderboardContext from 'hooks/features/useCopierLeaderboardProvider'

export default function TimeFilterSection() {
  const { currentTime, changeCurrentTime } = useCopierLeaderboardContext()
  return (
    <TimeFilter
      currentFilter={currentTime}
      handleFilterChange={changeCurrentTime}
      options={COPIER_LEADERBOARD_TIME_FILTER_OPTIONS}
    />
  )
}
