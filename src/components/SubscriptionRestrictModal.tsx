import { Trans } from '@lingui/macro'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import crow from 'assets/images/crow-big-blue.png'
import useMyProfileStore from 'hooks/store/useMyProfile'
import useSubscriptionRestrict, { RestrictState } from 'hooks/store/useSubscriptionRestrictStore'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, Image, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'

import { useClickLoginButton } from './LoginAction'

export default function SubscriptionRestrictModal() {
  const { state, resetRestrictState } = useSubscriptionRestrict()
  const isOpen = !!state
  const content = useMemo(() => {
    switch (state) {
      case RestrictState.EXCEED_QUOTA:
        return (
          <>
            <Flex mb={24} sx={{ flexDirection: 'column', alignItems: 'center' }}>
              <Type.Body mb={12} color="orange1">
                <Trans>You have exceeded your quota for this feature.</Trans>
              </Type.Body>
              <Type.Caption>
                <Trans>Would you like to upgrade your account?</Trans>
              </Type.Caption>
            </Flex>
            <Flex sx={{ alignItems: 'center', gap: 12 }}>
              <Button variant="outline" onClick={resetRestrictState} sx={{ flex: 1 }}>
                <Trans>Maybe Later</Trans>
              </Button>
              <Link to={ROUTES.SUBSCRIPTION.path} style={{ flex: 1 }} onClick={resetRestrictState}>
                <Button variant="primary" sx={{ width: '100%' }}>
                  <Trans>Upgrade Account</Trans>
                </Button>
              </Link>
            </Flex>
          </>
        )
      case RestrictState.PREMIUM_FEATURE:
        return <RestrictPremiumFeature onClickUpgrade={resetRestrictState} />

      default:
        return <></>
    }
  }, [resetRestrictState, state])
  return (
    <Modal isOpen={isOpen} onDismiss={resetRestrictState} hasClose>
      <Box sx={{ p: 24 }}>{content}</Box>
    </Modal>
  )
}

export function RestrictPremiumFeature({ onClickUpgrade }: { onClickUpgrade?: () => void }) {
  const { myProfile } = useMyProfileStore()
  const handleClickLogin = useClickLoginButton()

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
      <Image src={crow} width={166} height={190} alt="crow" />
      <Type.BodyBold my={2}>
        <Trans>Upgrade To Premium Account</Trans>
      </Type.BodyBold>
      <Type.Caption mb={20} color="neutral2">
        <Trans>You need to upgrade to a premium account to use this feature</Trans>
      </Type.Caption>
      {!myProfile ? (
        <Button variant="outlinePrimary" block onClick={handleClickLogin}>
          <Trans>Login</Trans>
        </Button>
      ) : (
        <Link to={ROUTES.SUBSCRIPTION.path} onClick={onClickUpgrade} style={{ width: '100%' }}>
          <Button variant="outlinePrimary" block>
            <Trans>Upgrade Now</Trans>
          </Button>
        </Link>
      )}
    </Flex>
  )
}
