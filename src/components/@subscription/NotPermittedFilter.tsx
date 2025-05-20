import { Trans } from '@lingui/macro'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import { Box, Flex } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'

export default function NotPermittedFilter({
  requiredPlan,
  isFilterPair,
}: {
  requiredPlan: SubscriptionPlanEnum
  isFilterPair?: boolean
}) {
  return (
    <Flex
      sx={{ width: '100%', height: '100%', p: 3, justifyContent: 'center', alignItems: 'center', position: 'relative' }}
    >
      {isFilterPair && (
        <Box
          sx={{
            position: 'absolute',
            top: 2,
            left: 2,
            right: 2,
            bottom: 2,
            backgroundImage: `url(/images/subscriptions/pair-non-permission.png)`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            filter: 'blur(10px)',
          }}
        />
      )}
      <PlanUpgradePrompt
        requiredPlan={requiredPlan}
        title={<Trans>Upgrade To Unlock Filtering</Trans>}
        description={<Trans>Available from {SUBSCRIPTION_PLAN_TRANSLATION[requiredPlan]} plan</Trans>}
        showTitleIcon
      />
    </Flex>
  )
}
