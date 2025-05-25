import { Trans } from '@lingui/macro'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { Box, Flex } from 'theme/base'
import { ProtocolEnum, SubscriptionFeatureEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'

import nonPermissionImage from '/images/subscriptions/trader-quick-view-protocol-permission.png'

export default function ProtocolPermissionContainer({
  protocol,
  children,
}: {
  protocol?: ProtocolEnum
  children: any
}) {
  // const { loading } = useAuthContext()
  const { isAllowedProtocol, requiredPlanToProtocol } = useTraderProfilePermission({ protocol })
  // if (loading) return <Loading />
  if (isAllowedProtocol) return children
  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', alignItems: 'center' }}>
      <Box
        width="100%"
        sx={{
          position: 'absolute',
          top: 56,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${nonPermissionImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          zIndex: 0,
          filter: 'blur(10px)',
        }}
      />
      <Flex maxWidth={350} height="100%" flexDirection="column" justifyContent="center">
        <PlanUpgradePrompt
          requiredPlan={requiredPlanToProtocol}
          title={
            <Trans>This exchange is available from {SUBSCRIPTION_PLAN_TRANSLATION[requiredPlanToProtocol]} plans</Trans>
          }
          description={
            <Trans>
              Unlock real-time entries, full position history, and detailed trade performance – as it happens
            </Trans>
          }
          showTitleIcon
          showLearnMoreButton
          useLockIcon
          learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
          target="_blank"
        />
      </Flex>
    </Flex>
  )
}
