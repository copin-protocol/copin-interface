import { Trans } from '@lingui/macro'
import { Siren } from '@phosphor-icons/react'
import React from 'react'
import { Link } from 'react-router-dom'

import SectionTitle from 'components/@ui/SectionTitle'
import { BotAlertData } from 'entities/alert'
import NoAlertList from 'pages/Settings/AlertList/NoAlertList'
import { Button } from 'theme/Buttons'
import { Flex, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'

export default function SettingCopiedTraders({
  botAlert,
  totalCopiedTraders,
}: {
  botAlert?: BotAlertData
  totalCopiedTraders?: number
}) {
  return (
    <Flex flexDirection="column" width="100%" height="100%" sx={{ overflow: 'hidden' }}>
      <Flex alignItems="center" px={3} py={2} sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
        <SectionTitle icon={Siren} title={botAlert?.name?.toUpperCase() ?? ''} sx={{ mb: 0 }} />
      </Flex>
      {!totalCopiedTraders ? (
        <NoAlertList title={<Trans>You have not copied any trader yet.</Trans>} />
      ) : (
        <Flex flex={1} p={3} flexDirection="column" alignItems="center" sx={{ gap: 2 }}>
          <Type.Caption color="neutral2" textAlign="center">
            You are copying <Type.Caption color="neutral1">{totalCopiedTraders ?? 0} traders.</Type.Caption>
          </Type.Caption>
          <Type.Caption color="neutral2" textAlign="center">
            Alerts will auto notify you of their trades.
          </Type.Caption>
          <Link to={ROUTES.MY_MANAGEMENT.path} target="_blank">
            <Button type="button" variant="ghostPrimary" p={0}>
              <Trans>Go to Copy Management</Trans>
            </Button>
          </Link>
        </Flex>
      )}
    </Flex>
  )
}
