import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import crow from 'assets/images/crow-big-blue.png'
import useUserSubscription from 'hooks/features/useUserSubscription'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { STORAGE_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

export default function SubscriptionExpiredWarning() {
  const [state, setState] = useState<{ show: boolean; day: number; minute: number } | null>(null)
  const { data } = useUserSubscription()

  const today = dayjs().set('hour', 0).set('minute', 0).set('second', 0)
  const setStorage = () => localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION_LAST_CHECK, today.toISOString())

  const loaded = useRef(false)
  useEffect(() => {
    if (!data || loaded.current) return
    loaded.current = true
    const expiredTime = dayjs.utc(data.expiredTime)
    const dayDiff = expiredTime.diff(dayjs(), 'day')
    const minuteDiff = expiredTime.diff(dayjs(), 'minute')
    if (minuteDiff <= 1 || dayDiff > 5) return

    const lastCheck = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_LAST_CHECK)
    if (!lastCheck) {
      setState({ show: true, day: dayDiff, minute: minuteDiff })
      setStorage()
    } else {
      const lastDay = dayjs(lastCheck)
      const hourDiff = today.diff(lastDay, 'hour')
      if (hourDiff >= 23) {
        setState({ show: true, day: dayDiff, minute: minuteDiff })
        setStorage()
      }
    }
  }, [data])

  const onDismiss = () => {
    setState(null)
    setStorage()
  }

  if (!state) return null

  return (
    <Modal isOpen={state.show} onDismiss={onDismiss} dismissable={false}>
      <IconBox
        role="button"
        icon={<XCircle size={16} />}
        color="neutral3"
        sx={{ float: 'right', p: 2, '&:hover': { color: 'neutral2' } }}
        onClick={onDismiss}
      />

      <Box sx={{ p: 3 }}>
        <Flex sx={{ width: '100%', flexDirection: 'column', alignItems: 'center' }}>
          <Image src={crow} width={166} height={190} alt="crow" />
          <Type.BodyBold my={2}>
            Your premium plan will expire in{' '}
            <Box as="span" color="orange1">
              {state.day > 1
                ? `${state.day} days`
                : state.day === 1
                ? `${state.day} day`
                : state.minute > 1
                ? `${state.minute} minutes`
                : '1 minute'}
            </Box>
          </Type.BodyBold>
          <Type.Caption mb={20} color="neutral2" sx={{ textAlign: 'center' }}>
            Please extend to ensure that your copy trade are not disrupted
          </Type.Caption>

          <Button
            as={Link}
            to={ROUTES.USER_SUBSCRIPTION.path}
            onClick={onDismiss}
            variant="primary"
            block
            sx={{ fontWeight: 600 }}
          >
            <Trans>Extend Now</Trans>
          </Button>
        </Flex>
      </Box>
    </Modal>
  )
}
