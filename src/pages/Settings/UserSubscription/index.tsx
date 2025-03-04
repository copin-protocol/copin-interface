import { Crown } from '@phosphor-icons/react'

import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { useIsPremium } from 'hooks/features/subscription/useSubscriptionRestrict'
import TermsAndConditions from 'pages/Subscription/TermsAndConditions'
import { Box, Flex, Type } from 'theme/base'

import HasSubscription from './HasSubscription'
import NoSubscription from './NoSubscription'

export default function UserSubscriptionPage() {
  const isPremium = useIsPremium()
  return (
    <>
      <CustomPageTitle title="My Subscription" />
      <Flex sx={{ width: '100%', height: 'calc(100% - 1px)', flexDirection: 'column' }}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: 'small', borderBottomColor: 'neutral4' }}
        >
          <Flex height={48} color="neutral1" sx={{ alignItems: 'center', px: 3, gap: 2 }}>
            <Crown size={24} weight="fill" />
            <Type.Body>MY SUBSCRIPTION</Type.Body>
          </Flex>
        </Flex>
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden auto' }}>
          <Container my={4} sx={{ maxWidth: 1280, px: 3 }}>
            <Box>
              <Box display={isPremium ? 'none' : 'block'}>
                <NoSubscription />
              </Box>
              <Box display={isPremium ? 'block' : 'none'}>
                <HasSubscription />
                <Box mt={42} />
                <TermsAndConditions text={Type.Caption} />
              </Box>
            </Box>
          </Container>
        </Box>
      </Flex>
    </>
  )
}
