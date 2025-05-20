import { Trans } from '@lingui/macro'
import React from 'react'

import UpgradeModal from 'components/@subscription/UpgradeModal'
import useAlertDashboardContext, { AlertDashboardProvider } from 'hooks/features/alert/useAlertDashboardContext'
import { Flex } from 'theme/base'

import DesktopView from './DesktopView'
import MobileView from './MobileView'

export default function AlertDashboardPage() {
  return (
    <AlertDashboardProvider>
      <AlertDashboardComponent />
    </AlertDashboardProvider>
  )
}

function AlertDashboardComponent() {
  const { isMobile, openLimitModal, setOpenLimitModal } = useAlertDashboardContext()
  return (
    <Flex sx={{ width: '100%', height: 'calc(100% - 1px)', flexDirection: 'column' }}>
      {isMobile ? <MobileView /> : <DesktopView />}
      {openLimitModal && (
        <UpgradeModal
          isOpen={openLimitModal}
          onDismiss={() => setOpenLimitModal(false)}
          title={<Trans>YOU’VE HIT YOUR CUSTOM ALERTS LIMIT</Trans>}
          description={
            <Trans>
              You’re reach the maximum of custom alerts for your current plan. Upgrade your plan to unlock more custom
              alerts.
            </Trans>
          }
        />
      )}
    </Flex>
  )
}
