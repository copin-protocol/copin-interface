import { Trans } from '@lingui/macro'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import { AccountInfo } from 'components/@ui/AccountInfo'
import Container from 'components/@ui/Container'
import { PositionData } from 'entities/trader'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { ProtocolEnum, SubscriptionFeatureEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/protocolProviderConfig'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'

import nonPermissionImage from '/images/subscriptions/position-details-protocol-permission.png'

export default function PermissionContainer({
  data,
  protocol,
  children,
}: {
  data?: PositionData
  protocol?: ProtocolEnum
  children: any
}) {
  // const { loading } = useAuthContext()
  const { isAllowedProtocol, requiredPlanToProtocol } = useTraderProfilePermission({ protocol })
  // if (loading) return <Loading />
  if (isAllowedProtocol) return children

  const explorerUrl = data && data.protocol ? PROTOCOL_PROVIDER[data.protocol]?.explorerUrl : LINKS.arbitrumExplorer

  return (
    <Container maxWidth={{ lg: 1000 }} height="100%">
      <Flex
        sx={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          borderLeft: 'small',
          borderRight: 'small',
          borderColor: 'neutral4',
        }}
      >
        {data && (
          <AccountInfo
            address={data.account}
            protocol={data.protocol}
            hasQuickView={false}
            addressFormatter={Type.BodyBold}
            addressWidth="fit-content"
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            top: 56 + 56,
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
            requiredPlan={requiredPlanToProtocol}
            title={
              <Trans>
                This exchange is available from {SUBSCRIPTION_PLAN_TRANSLATION[requiredPlanToProtocol]} plans
              </Trans>
            }
            description={<Trans>See full position history, and detailed trade performance – as it happens</Trans>}
            noLoginTitle={<Trans>Login to view more information</Trans>}
            noLoginDescription={
              <Trans>
                Upgrade to the {SUBSCRIPTION_PLAN_TRANSLATION[requiredPlanToProtocol]} plan to view positions and more
                trader insights.
              </Trans>
            }
            showNoLoginTitleIcon
            requiredLogin
            showTitleIcon
            showLearnMoreButton
            useLockIcon
            learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
          />
        </Flex>
      </Flex>
    </Container>
  )
}
