/* eslint-disable react/jsx-key */
import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Link } from 'react-router-dom'

import openseaIcon from 'assets/icons/ic-opensea.png'
import optimismIcon from 'assets/icons/ic_op.svg'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NFTSubscriptionCard from 'components/NFTSubscriptionCard'
import useSubscriptionPlanPrice from 'hooks/features/useSubscriptionPlanPrice'
import useUserSubscription from 'hooks/features/useUserSubscription'
import { Box, Flex, Image, Type } from 'theme/base'
import { SUBSCRIPTION_COLLECTION_URL } from 'utils/config/constants'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { CHAINS, OPTIMISM_MAINNET } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

import Plans, { MobilePlans } from './Plans'
import TermsAndConditions from './TermsAndConditions'
import { GradientText, SubscriptionColors, SubscriptionGrid } from './styled'

export default function Subscription() {
  const { sm } = useResponsive()
  const priceData = useSubscriptionPlanPrice()
  if (!sm)
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
          <Box p={3}>
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
          <Type.BodyBold mb={5} display="block" textAlign="center">
            <Trans>We&apos;ve got a pricing plan that&apos;s perfect for you</Trans>
          </Type.BodyBold>
          <Flex width="100%" sx={{ gap: 24, flexDirection: ['column', 'column', 'column', 'column', 'row'] }}>
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
    <Box sx={{ width: ['100%', 'max-content'], mx: 'auto', '& > *': { height: '100%' } }}>
      <NFTSubscriptionCard
        data={data}
        action={
          <>
            {data && (
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
            )}
            <Flex mt={3} sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Type.Body>
                <GradientText>
                  <Trans>NFT Collection</Trans>
                </GradientText>
              </Type.Body>
              <Box as="a" href={SUBSCRIPTION_COLLECTION_URL} target="_blank">
                <Image width={24} height={24} src={openseaIcon} alt="os" />
              </Box>
              <Box
                as="a"
                href={`${CHAINS[OPTIMISM_MAINNET].blockExplorerUrl}/token/${
                  CONTRACT_ADDRESSES[OPTIMISM_MAINNET][CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]
                }`}
                target="_blank"
              >
                <Image width={24} height={24} src={optimismIcon} alt="os" />
              </Box>
            </Flex>
          </>
        }
      />
    </Box>
  )
}
