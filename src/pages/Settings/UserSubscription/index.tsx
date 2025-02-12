import Container from 'components/@ui/Container'
import { useIsPremium } from 'hooks/features/subscription/useSubscriptionRestrict'
import TermsAndConditions from 'pages/Subscription/TermsAndConditions'
import { Box, Type } from 'theme/base'

import HasSubscription from './HasSubscription'
import NoSubscription from './NoSubscription'

export default function UserSubscription() {
  const isPremium = useIsPremium()
  return (
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
  )
}
