import { Trans } from '@lingui/macro'
import React from 'react'
import { Link } from 'react-router-dom'

import noCustomAlert from 'assets/images/no-custom-alert.png'
import useAlertDashboardContext from 'hooks/features/alert/useAlertDashboardContext'
import { Button } from 'theme/Buttons'
import { Flex, Image, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'

export default function NoCustomAlert() {
  const { isEliteUser, isLimited, handleCreateCustomAlert } = useAlertDashboardContext()

  return (
    <Flex px={3} py={4} sx={{ width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Image src={noCustomAlert} sx={{ maxWidth: 110, mb: 2 }} alt="no-custom-alert" />
      <Type.Caption color="neutral2" textAlign="center">
        You haven&apos;t created any custom alerts yet,{' '}
        {!isEliteUser && isLimited ? (
          <Link to={ROUTES.SUBSCRIPTION.path}>
            <Button size="xs" variant="textPrimary" p={0}>
              <Trans>Upgrade</Trans>
            </Button>
          </Link>
        ) : (
          <Button variant="textPrimary" onClick={handleCreateCustomAlert}>
            Create new one
          </Button>
        )}
      </Type.Caption>
    </Flex>
  )
}
