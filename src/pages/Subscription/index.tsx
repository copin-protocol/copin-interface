/* eslint-disable react/jsx-key */
import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Link } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { GradientText } from 'components/GradientText'
import NFTCollectionLinks from 'components/NFTCollectionLinks'
import NFTSubscriptionCard from 'components/NFTSubscriptionCard'
import useSubscriptionPlanPrice from 'hooks/features/useSubscriptionPlanPrice'
import useUserSubscription from 'hooks/features/useUserSubscription'
import { Box, Flex, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'

import Plans, { MobilePlans } from './Plans'
import TermsAndConditions from './TermsAndConditions'
import { SubscriptionColors, SubscriptionGrid } from './styled'

export default function Subscription() {
  const { md } = useResponsive()
  const priceData = useSubscriptionPlanPrice()
  if (!md)
    return (
      <>
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
          <Box mt={4} p={3}>
            <SubscriptionCard />
          </Box>
          <Box p={3}>
            <MobilePlans planPrice={priceData?.price} />
          </Box>
          <Box mb={42} />
          <Box p={3}>
            <TermsAndConditions />
          </Box>
        </Box>
      </>
    )
  return (
    <>
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
        <SubscriptionColors />
        <SubscriptionGrid />
        <Box sx={{ width: '100%', maxWidth: 1248, mx: 'auto', position: 'relative' }}>
          <Type.H1 mb={3} textAlign="center">
            <GradientText>
              <Trans>Subscription</Trans>
            </GradientText>
          </Type.H1>
          <Type.BodyBold mb={3} display="block" textAlign="center">
            <Trans>We&apos;ve got a pricing plan that&apos;s perfect for you</Trans>
          </Type.BodyBold>
          <NFTCollectionLinks />
          <Flex mt={4} width="100%" sx={{ gap: 24, flexDirection: ['column', 'column', 'column', 'column', 'row'] }}>
            <SubscriptionCard />
            <Plans planPrice={priceData?.price} />
          </Flex>
          <Box mb={42} />
          <TermsAndConditions />
        </Box>
      </Box>
    </>
  )
}

function SubscriptionCard() {
  const { data } = useUserSubscription()
  return (
    <Box sx={{ width: ['100%', 'max-content'], maxWidth: 'max-content', mx: 'auto', '& > *': { height: '100%' } }}>
      <NFTSubscriptionCard
        data={data}
        action={
          data && (
            <Flex
              sx={{
                alignItems: 'center',
                gap: 1,
                borderBottom: 'small',
                borderBottomColor: 'primary1',
                color: 'primary1',
                width: 'max-content',
                mx: 'auto',
              }}
              as={Link}
              to={ROUTES.USER_SUBSCRIPTION.path}
            >
              <Type.Body>
                <Trans>My Subscription</Trans>
              </Type.Body>
              <ArrowRight size={24} />
            </Flex>
          )
        }
      />
    </Box>
  )
}
