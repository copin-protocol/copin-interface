import { Trans } from '@lingui/macro'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import useCexDepthPermission from 'hooks/features/subscription/useCexDepthPermission'
import { useAuthContext } from 'hooks/web3/useAuth'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { SubscriptionFeatureEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'

import CexDepthTitle from './Title'

export default function PermissionContainer({ children }: { children: any }) {
  const { loading } = useAuthContext()
  const { isPermitted, requiredPlan } = useCexDepthPermission()
  if (loading) return <Loading />
  if (isPermitted) return children
  const requiredPlanText = SUBSCRIPTION_PLAN_TRANSLATION[requiredPlan]
  const description = (
    <Trans>Unlock advanced market depth data to minimize slippage and optimize your copy trading decisions.</Trans>
  )
  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%' }}>
      <CexDepthTitle />
      <Flex flex="1 0 0" sx={{ position: 'relative', width: '100%', justifyContent: 'center' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            left: 2,
            right: 2,
            bottom: 2,
            backgroundImage: `url(/images/subscriptions/cex-depth-non-permission.png)`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            filter: 'blur(10px)',
          }}
        />
        <Box sx={{ maxWidth: 350, pt: [100, 100, 200] }}>
          <PlanUpgradePrompt
            requiredPlan={requiredPlan}
            showTitleIcon
            useLockIcon
            showLearnMoreButton
            title={<Trans>This features is available from {requiredPlanText} plan</Trans>}
            description={description}
            learnMoreSection={SubscriptionFeatureEnum.CEX_DEPTH}
          />
        </Box>
      </Flex>
    </Flex>
  )
}
