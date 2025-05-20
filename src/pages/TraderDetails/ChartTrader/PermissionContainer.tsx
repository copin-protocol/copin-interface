import { Trans } from '@lingui/macro'

import nonPermissionImage from 'assets/images/trader-profile-token-permission.png'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { useAuthContext } from 'hooks/web3/useAuth'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { SubscriptionFeatureEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'

export default function PermissionContainer({ children }: { children: any }) {
  const { loading } = useAuthContext()
  const { isEnableTokenStats, requiredPlanToTokenStats } = useTraderProfilePermission({})
  if (loading) return <Loading />
  if (isEnableTokenStats) return children
  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', alignItems: 'center' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          left: 2,
          right: 2,
          bottom: 2,
          backgroundImage: `url(${nonPermissionImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
          filter: 'blur(10px)',
        }}
      />
      <Flex height="100%" maxWidth={450} px={3} flexDirection="column" justifyContent="center">
        <PlanUpgradePrompt
          requiredPlan={requiredPlanToTokenStats}
          title={<Trans>Available from {SUBSCRIPTION_PLAN_TRANSLATION[requiredPlanToTokenStats]} plans</Trans>}
          description={<Trans>Know exactly which tokens this trader dominates, and which they don’t</Trans>}
          showTitleIcon
          showLearnMoreButton
          useLockIcon
          learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
        />
      </Flex>
    </Flex>
  )
}
