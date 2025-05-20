import { Trans } from '@lingui/macro'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import usePerpExplorerPermission from 'hooks/features/subscription/usePerpExplorerPermission'
import { useAuthContext } from 'hooks/web3/useAuth'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { SubscriptionFeatureEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'

export default function PermissionContainer({ children, isDetails }: { children: any; isDetails?: boolean }) {
  const { loading } = useAuthContext()
  const { isPermitted, requiredPlan } = usePerpExplorerPermission()
  if (loading) return <Loading />
  if (isPermitted) return children
  const requiredPlanText = SUBSCRIPTION_PLAN_TRANSLATION[requiredPlan]
  const title = <Trans>Unlock Full Perp Insights</Trans>
  const description = (
    <Trans>
      {' '}
      Upgrade to the {requiredPlanText} plan to explore trade volume, open interest, and advanced stats across all
      perpetual dexes.
    </Trans>
  )
  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', p: 3 }}>
      <Type.H5 color="neutral8" maxWidth="fit-content" sx={{ px: 2, py: 1, bg: 'neutral1' }}>
        <Trans>Perp Explorer</Trans>
      </Type.H5>
      <Flex flex="1 0 0" sx={{ position: 'relative', width: '100%', justifyContent: 'center' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            left: 2,
            right: 2,
            bottom: 2,
            backgroundImage: `url(/images/subscriptions/${
              isDetails ? 'perp-explorer-details-non-permission.png' : 'perp-explorer-non-permission.png'
            })`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            filter: 'blur(10px)',
          }}
        />
        <Box sx={{ maxWidth: 400, pt: [100, 100, 200] }}>
          <PlanUpgradePrompt
            useLockIcon
            requiredPlan={requiredPlan}
            title={title}
            description={description}
            showTitleIcon
            showLearnMoreButton
            learnMoreSection={SubscriptionFeatureEnum.PERP_EXPLORER}
          />
        </Box>
      </Flex>
    </Flex>
  )
}
