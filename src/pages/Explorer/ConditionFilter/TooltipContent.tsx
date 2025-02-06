import { Trans } from '@lingui/macro'
import { Link } from 'react-router-dom'

import { UserData } from 'entities/user'
import { Box } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

const TooltipContent = ({ myProfile }: { myProfile: UserData | null }) => {
  switch (myProfile?.plan) {
    case SubscriptionPlanEnum.BASIC:
      return (
        <Trans>
          This feature requires a Premium or VIP plan.{' '}
          <Box as={Link} to={ROUTES.SUBSCRIPTION.path} target="_blank">
            <Box sx={{ color: 'neutral1' }}> Upgrade now to export data.</Box>
            Upgrade
          </Box>
        </Trans>
      )
    case SubscriptionPlanEnum.PREMIUM:
      return <Trans>Export up to 1,000 records now. Upgrade to VIP for 10,000 records.</Trans>
      {
        /* <Box as={Link} to={ROUTES.SUBSCRIPTION.path} target="_blank">
                <Box sx={{ color: 'neutral1' }}>Upgrade VIP to export up to 10,000 records.</Box>
                Upgrade
              </Box> */
      }
    case SubscriptionPlanEnum.VIP:
      return <Trans>Export up to 10,000 records</Trans>
    default:
      return null
  }
}

export default TooltipContent
