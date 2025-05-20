import { Trans } from '@lingui/macro'

import nonPermissionImage from 'assets/images/trader-profile-position-permision.png'
import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { useAuthContext } from 'hooks/web3/useAuth'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

export default function PositionPermissionContainer({
  protocol,
  children,
}: {
  protocol?: ProtocolEnum
  children: any
}) {
  const { loading } = useAuthContext()
  const { isEnablePosition, requiredPlanToViewPosition } = useTraderProfilePermission({ protocol })
  if (loading) return <Loading />
  if (isEnablePosition) return children
  return (
    <Flex sx={{ position: 'relative', flexDirection: 'column', width: '100%', height: '100%', alignItems: 'center' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 2,
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
      <Flex maxWidth={350} height="100%" flexDirection="column" justifyContent="center">
        <PlanUpgradePrompt
          requiredPlan={requiredPlanToViewPosition}
          noLoginTitle={<Trans>Login to view more information</Trans>}
          noLoginDescription={<Trans>View positions and more trader insights.</Trans>}
          showTitleIcon
          showNoLoginTitleIcon
          requiredLogin
        />
      </Flex>
    </Flex>
  )
}
