import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { GradientText } from 'components/@ui/GradientText'
import NFTCollectionLinks from 'components/@widgets/NFTCollectionLinks'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import { Box, Flex, Type } from 'theme/base'

import Plans, { MobilePlans } from './Plans'
import TermsAndConditions from './TermsAndConditions'
import { SubscriptionColors, SubscriptionGrid } from './styled'

export default function SubscriptionPage() {
  const { xl } = useResponsive()
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
            <MobilePlans />
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
            <Plans />
          </Flex>
          <Box mb={42} />
          <TermsAndConditions />
        </Box>
      </Box>
    </SafeComponentWrapper>
  )
}
