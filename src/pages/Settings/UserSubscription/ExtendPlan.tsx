import { Trans } from '@lingui/macro'

import useSubscriptionPlanPrice from 'hooks/features/useSubscriptionPlanPrice'
import { Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'

import { EXTEND_MODAL_LABELS, PricingDropdown } from './PricingOptions'

export default function ExtendPlan({ tokenId, plan }: { tokenId: number; plan: SubscriptionPlanEnum }) {
  const pricePlanData = useSubscriptionPlanPrice()
  const planData = pricePlanData[plan]

  if (!planData) return <></>

  return (
    <>
      <Type.LargeBold mb={2} sx={{ display: 'block' }}>
        <Trans>Extend plan</Trans>
      </Type.LargeBold>
      <Type.Caption mb={24}>
        <Trans>You can extend your usage, with a discounted fee compared to the original price</Trans>
      </Type.Caption>
      <PricingDropdown
        tokenId={tokenId}
        plan={plan}
        planPrice={planData.price}
        method="extend"
        buttonLabel={<Trans>Extend</Trans>}
        modalLabels={EXTEND_MODAL_LABELS}
        buttonSx={{ width: ['100%', 200] }}
      />
    </>
  )
}
