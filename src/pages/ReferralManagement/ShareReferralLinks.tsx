import { SocialLinksToShare } from 'theme/Modal/SocialMediaSharingModal'

import { getReferralLink } from './helpers'

export default function ShareReferralLinks({ referralCode }: { referralCode: string }) {
  return <SocialLinksToShare link={getReferralLink(referralCode)} sx={{ gap: 3 }} iconSize={16} buttonSize={24} />
}
