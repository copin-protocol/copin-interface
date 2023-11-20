import Container from 'components/@ui/Container'
import useUserSubscription from 'hooks/features/useUserSubscription'
import useMyProfileStore from 'hooks/store/useMyProfile'
import TermsAndConditions from 'pages/Subscription/TermsAndConditions'
import { Box, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'

import HasSubscription from './HasSubscription'
import NoSubscription from './NoSubscription'

export default function UserSubscription() {
  const { myProfile } = useMyProfileStore()
  const isPremium = myProfile && myProfile.plan === SubscriptionPlanEnum.PREMIUM
  const { data } = useUserSubscription()

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden auto' }}>
      <Container my={4} sx={{ maxWidth: 1000, px: 3 }}>
        <Box>
          {!isPremium && <NoSubscription />}
          {isPremium && data && <HasSubscription data={data} />}
        </Box>
        <Box mt={42} />
        <TermsAndConditions text={Type.Caption} />
      </Container>
    </Box>
  )
}
