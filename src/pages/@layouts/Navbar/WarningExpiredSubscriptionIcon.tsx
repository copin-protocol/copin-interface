import { Clock } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

import useUserSubscription from 'hooks/features/useUserSubscription'
import useCountdown from 'hooks/helpers/useCountdown'
import Tooltip from 'theme/Tooltip'
import { Box, IconBox, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'

export default function WarningExpiredSubscriptionIcon() {
  const { data } = useUserSubscription()

  if (!data) return null

  const expiredTime = dayjs.utc(data.expiredTime)
  const dayDiff = expiredTime.diff(dayjs(), 'day')
  const minuteDiff = expiredTime.diff(dayjs(), 'minute')

  if (minuteDiff <= 1 || dayDiff > 5) return null

  return (
    <>
      <IconBox
        color="red2"
        icon={<Clock size={16} />}
        data-tooltip-id="tt_warning_subscription_expire"
        data-tooltip-delay-show={360}
      />
      <Tooltip id="tt_warning_subscription_expire" clickable>
        <Type.Caption sx={{ maxWidth: 300 }}>
          Your premium plan will expire in <MinuteCountdown endTime={expiredTime.valueOf()} />. Please{' '}
          <Box as={Link} to={ROUTES.USER_SUBSCRIPTION.path} sx={{ textDecoration: 'underline' }}>
            extend
          </Box>{' '}
          to ensure that your copy trade are not disrupted.
        </Type.Caption>
      </Tooltip>
    </>
  )
}

function MinuteCountdown({ endTime }: { endTime: number | undefined }) {
  const timer = useCountdown(endTime)

  const dayCount = Number(timer?.days) ?? 0
  const minuteCount = Number(timer?.minutes) ?? 0

  if (dayCount > 5) return null

  if (dayCount > 0) {
    return (
      <Box as="a" color="orange1">
        {dayCount > 1 ? `${dayCount} days` : `${dayCount} day`}
      </Box>
    )
  }
  if (minuteCount > 0) {
    return (
      <Box as="span" color="orange1">
        {minuteCount > 1 ? `${minuteCount} minutes` : `${minuteCount} minute`}
      </Box>
    )
  }

  return null
}
