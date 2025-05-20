import { Trans } from '@lingui/macro'
import { Link } from 'react-router-dom'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import AddressAvatar from 'components/@ui/AddressAvatar'
import Container from 'components/@ui/Container'
import ExplorerLogo from 'components/@ui/ExplorerLogo'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { PositionData } from 'entities/trader'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import CopyButton from 'theme/Buttons/CopyButton'
import Loading from 'theme/Loading'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { ProtocolEnum, SubscriptionFeatureEnum } from 'utils/config/enums'
import { PROTOCOL_PROVIDER } from 'utils/config/protocolProviderConfig'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'
import { addressShorten } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

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
  const { loading } = useAuthContext()
  const { isAllowedProtocol, requiredPlanToProtocol } = useTraderProfilePermission({ protocol })
  if (loading) return <Loading />
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
          <Flex
            p={12}
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            sx={{ gap: 2, borderBottom: 'small', borderColor: 'neutral4' }}
          >
            <Flex alignItems="center" flexWrap="wrap" sx={{ gap: 12 }}>
              <AddressAvatar address={data.account} size={40} />
              <Link to={generateTraderMultiExchangeRoute({ protocol, address: data.account })}>
                <Button type="button" variant="ghost" sx={{ p: 0 }}>
                  <Flex flexDirection="column" textAlign="left">
                    <Flex alignItems="center" flexWrap="wrap" sx={{ gap: 2 }}>
                      <Type.BodyBold>{addressShorten(data.account)}</Type.BodyBold>
                      <ProtocolLogo
                        protocol={data.protocol}
                        size={24}
                        hasText={false}
                        data-tip="React-tooltip"
                        data-tooltip-id={`tt_protocol_${data.protocol}`}
                        data-tooltip-offset={0}
                      />
                      <Tooltip id={`tt_protocol_${data.protocol}`} clickable={false}>
                        <ProtocolLogo protocol={data.protocol} />
                      </Tooltip>

                      <CopyButton
                        type="button"
                        variant="ghost"
                        value={data.account}
                        size="sm"
                        sx={{ color: 'neutral3', p: 0 }}
                      />
                      <ExplorerLogo protocol={data.protocol} explorerUrl={`${explorerUrl}/address/${data.account}`} />
                    </Flex>
                  </Flex>
                </Button>
              </Link>
            </Flex>
            <ProtocolLogo size={24} protocol={data.protocol} textSx={{ fontSize: '14px' }} />
          </Flex>
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
