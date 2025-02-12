import React, { memo } from 'react'

import SubscriptionRestrictModal from 'components/@widgets/SubscriptionRestrictModal'
import useSubscriptionRestrictStore from 'hooks/store/useSubscriptionRestrictStore'

const SubscriptionRestrict = memo(function SubscriptionRestrictMemo() {
  const restrictState = useSubscriptionRestrictStore((state) => state.state)
  return restrictState ? <SubscriptionRestrictModal /> : <></>
})
export default SubscriptionRestrict
