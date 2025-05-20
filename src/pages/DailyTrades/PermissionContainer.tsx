import { Trans } from '@lingui/macro'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import useLiveTradesPermission from 'hooks/features/subscription/useLiveTradesPermission'
import { useAuthContext } from 'hooks/web3/useAuth'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'

export default function PermissionContainer({ children }: { children: any }) {
  const { loading, isAuthenticated } = useAuthContext()
  const { userPermission } = useLiveTradesPermission()
  if (loading) return <Loading />
  if (!loading && !isAuthenticated && !userPermission?.isEnabled) {
    return (
      <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', alignItems: 'center' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            left: 2,
            right: 2,
            bottom: 2,
            backgroundImage: `url(/images/subscriptions/live-trade-non-login-permission.png)`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
            filter: 'blur(10px)',
          }}
        />
        <Box sx={{ maxWidth: 450, pt: [100, 100, 200] }}>
          <PlanUpgradePrompt
            requiredPlan={SubscriptionPlanEnum.FREE}
            noLoginTitle={<Trans>Login to view Live trader positions</Trans>}
            noLoginDescription={
              <Trans>
                Track what every trader is doing right now across all exchanges. Entries, Size, PnL – all in one place
                and realtime.
              </Trans>
            }
            showNoLoginTitleIcon
            requiredLogin
          />
        </Box>
      </Flex>
    )
  }
  return children
}
