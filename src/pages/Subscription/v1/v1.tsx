import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { GradientText } from 'components/@ui/GradientText'
import NFTCollectionLinks from 'components/@widgets/NFTCollectionLinks'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import { SubscriptionCountData } from 'entities/user'
import useMulticallQuery from 'hooks/web3/useMulticallQuery'
import { Box, Flex, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { OPTIMISM_MAINNET } from 'utils/web3/chains'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from 'utils/web3/contracts'

import Plans, { MobilePlans } from './Plans'
import TermsAndConditions from './TermsAndConditions'
import { SubscriptionColors, SubscriptionGrid } from './styled'

const plans = [SubscriptionPlanEnum.PRO, SubscriptionPlanEnum.ELITE]
const queryCalls: { address: string; name: string; params: any[] }[] = plans.map((plan) => ({
  address: CONTRACT_ADDRESSES[OPTIMISM_MAINNET][CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION],
  name: 'tiers',
  params: [plan],
}))

export default function SubscriptionPage() {
  const { xl } = useResponsive()
  const { data: subscriptionCountData, refetch } = useMulticallQuery(
    CONTRACT_ABIS[CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION],
    queryCalls,
    OPTIMISM_MAINNET,
    {
      refetchInterval: 30_000,
      select(data: BigNumber[][]) {
        const result: SubscriptionCountData[] = plans.map((plan, index) => ({
          plan,
          count: BigNumber.from(data[index][2]).toNumber(),
        }))
        return result
      },
      cacheTime: 0,
      staleTime: 0,
    }
  )
  if (!xl)
    return (
      <SafeComponentWrapper>
        <CustomPageTitle title="Subscription Plans" />
        <Box py={4}>
          <Type.H1 mb={3} textAlign="center">
            <GradientText>
              <Trans>Subscription</Trans>
            </GradientText>
          </Type.H1>
          <Type.BodyBold mb={3} display="block" textAlign="center">
            <Trans>We&apos;ve got a pricing plan that&apos;s perfect for you</Trans>
          </Type.BodyBold>
          <NFTCollectionLinks />
          {/* <Box mt={4} p={3}>
            <SubscriptionCard />
          </Box> */}
          <Box p={3}>
            <MobilePlans subscriptionCountData={subscriptionCountData} onSuccess={refetch} />
          </Box>
          <Box mb={42} />
          <Box p={3}>
            <TermsAndConditions />
          </Box>
        </Box>
      </SafeComponentWrapper>
    )
  return (
    <SafeComponentWrapper>
      <CustomPageTitle title="Subscription Plans" />
      <Box
        sx={{
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
        py={4}
        px={3}
      >
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60vh', overflow: 'hidden' }}>
          <SubscriptionColors />
          <SubscriptionGrid />
          <Box
            sx={{
              backgroundImage: `linear-gradient(180deg, rgba(11,14,24,0) 0%, rgba(11,14,24,1) 100%)`,
              position: 'absolute',
              bottom: 0,
              top: '50%',
              left: 0,
              right: 0,
            }}
          />
        </Box>
        <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', position: 'relative' }}>
          <Type.H1 mb={3} textAlign="center">
            <GradientText>
              <Trans>Subscription</Trans>
            </GradientText>
          </Type.H1>
          <Type.BodyBold mb={3} display="block" textAlign="center">
            <Trans>We&apos;ve got a pricing plan that&apos;s perfect for you</Trans>
          </Type.BodyBold>
          <NFTCollectionLinks />
          <Flex mt={5} width="100%" sx={{ gap: 24, flexDirection: ['column', 'column', 'column', 'column', 'row'] }}>
            {/* <SubscriptionCard /> */}
            <Plans subscriptionCountData={subscriptionCountData} onSuccess={refetch} />
          </Flex>
          <Box mb={42} />
          <TermsAndConditions />
        </Box>
      </Box>
    </SafeComponentWrapper>
  )
}
