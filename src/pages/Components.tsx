import { Trans } from '@lingui/macro'

import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import UpgradeModal from 'components/@subscription/UpgradeModal'
import Container from 'components/@ui/Container'
import { Box, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'

export default function Components() {
  return (
    <Container maxWidth={1280} p={24}>
      <Type.Caption>PlanUpgradeIndicator: </Type.Caption>
      <PlanUpgradeIndicator requiredPlan={SubscriptionPlanEnum.PRO} />
      <Box mb={24} />

      <Type.Caption>PlanUpgradePrompt: </Type.Caption>
      <Box maxWidth={400}>
        <PlanUpgradePrompt
          requiredPlan={SubscriptionPlanEnum.PRO}
          title={<Trans>Title</Trans>}
          description={<Trans>Description</Trans>}
          noLoginDescription={<Trans>Login to upgrade</Trans>}
          showTitleIcon
        />
      </Box>
      <UpgradeModal
        isOpen
        onDismiss={() => console.log(1)}
        title={<Trans>YOU&apos;VE HIT YOUR API WALLET LIMIT</Trans>}
        description={
          <Trans>
            You&apos;re reach the maximum of API wallets for your current plan. Upgrade your plan to unlock access up to{' '}
            <Box as="b" color="neutral1">
              10 wallets
            </Box>
          </Trans>
        }
      />
    </Container>
  )
}
