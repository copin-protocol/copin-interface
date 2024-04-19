import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import crow from 'assets/images/crow-big-blue.png'
import vipLogo from 'assets/images/vip-large-icon.png'
import Divider from 'components/@ui/Divider'
import useUserSubscription from 'hooks/features/useUserSubscription'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Image, Li, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { getSubscriptionPlanConfigs } from 'utils/helpers/transform'

export default function SubscriptionExpiredWarning() {
  const [state, setState] = useState<{
    show: boolean
    day?: number
    minute?: number
    hour?: number
    isExpired: boolean
  } | null>(null)
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
    const hourDiff = expiredTime.diff(dayjs(), 'hour')
    const isExpired = today.valueOf() > expiredTime.valueOf()
    if (minuteDiff <= 1 || dayDiff > 5) return

    const lastCheck = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_LAST_CHECK)
    if (!lastCheck) {
      setState({ show: true, day: dayDiff, minute: minuteDiff, hour: hourDiff, isExpired })
      setStorage()
    } else {
      const lastDay = dayjs(lastCheck)
      const hourDiffCheck = today.diff(lastDay, 'hour')
      if (hourDiffCheck >= 23) {
        setState({ show: true, day: dayDiff, minute: minuteDiff, hour: hourDiff, isExpired })
        setStorage()
      }
    }
  }, [data])

  const onDismiss = () => {
    setState(null)
    setStorage()
  }

  if (!state) return null

  const { label, color } = getSubscriptionPlanConfigs(data?.tierId)
  const imageSrc = data?.tierId === SubscriptionPlanEnum.PREMIUM ? crow : vipLogo

  return (
    <Modal isOpen={state.show} onDismiss={onDismiss} dismissable={false} maxWidth="375px">
      <IconBox
        role="button"
        icon={<XCircle size={16} />}
        color="neutral3"
        sx={{ float: 'right', p: 2, '&:hover': { color: 'neutral2' } }}
        onClick={onDismiss}
      />

      <Box sx={{ p: 3 }}>
        <Flex sx={{ width: '100%', flexDirection: 'column', alignItems: 'center' }}>
          <Image src={imageSrc} width={166} height={190} alt="crow" />
          {state.isExpired && (
            <Type.BodyBold my={2}>
              Your{' '}
              <Box as="span" color="orange1">
                {label}
              </Box>{' '}
              plan is expired
            </Type.BodyBold>
          )}
          {!state.isExpired && (
            <Type.BodyBold my={2}>
              Your{' '}
              <Box as="span" color={color}>
                {label}
              </Box>{' '}
              plan will expire in{' '}
              <Box as="span" color="orange1">
                {(state?.day ?? 0) > 1
                  ? `${state.day} days`
                  : state.day === 1
                  ? `${state.day} day`
                  : (state?.hour ?? 0) > 1
                  ? `${state.hour} hours`
                  : state.hour === 1
                  ? `${state.hour} hour`
                  : (state.minute ?? 0) > 1
                  ? `${state.minute} minutes`
                  : '1 minute'}
              </Box>
            </Type.BodyBold>
          )}
          <Box mt={2} mb={24} color="neutral2">
            <Li>
              <Type.Caption>Your copy trading with hot traders will be disrupted.</Type.Caption>
            </Li>
            <Li mt={2}>
              <Type.Caption>Your copy trading size will be lowered.</Type.Caption>
            </Li>
          </Box>
          {/* <Type.Caption mb={20} color="neutral2" sx={{ textAlign: 'center' }}>
            Please extend to ensure that your copy trade are not disrupted
          </Type.Caption> */}
          {state.isExpired && (
            <Box mb={12}>
              <Divider mb={12} />
              <Type.Caption color="orange1">
                Please disable any copied trades you may have & set the proper restrictions.
              </Type.Caption>
            </Box>
          )}

          {state.isExpired && (
            <Button
              as={Link}
              to={ROUTES.SUBSCRIPTION.path}
              onClick={onDismiss}
              variant="primary"
              block
              sx={{ fontWeight: 600 }}
            >
              <Trans>Mint new NFT</Trans>
            </Button>
          )}
          {!state.isExpired && (
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
          )}
          {state.isExpired && (
            <Button mt={20} size="xs" variant="ghostPrimary" as={Link} to={ROUTES.MY_MANAGEMENT.path} sx={{ p: 0 }}>
              Go to copy management
            </Button>
          )}
        </Flex>
      </Box>
    </Modal>
  )
}
