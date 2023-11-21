import { useCallback, useMemo } from 'react'

import useSubscriptionRestrictStore, { RestrictState } from 'hooks/store/useSubscriptionRestrictStore'
import { useAuthContext } from 'hooks/web3/useAuth'
import { CopyTradeStatusEnum, MaxCopyTradeQuotaEnum, SubscriptionPlanEnum } from 'utils/config/enums'

import useAllCopyTrades from './useAllCopyTrades'

// Todo: add to my profile
export default function useSubscriptionRestrict() {
  const setRestrictState = useSubscriptionRestrictStore((state) => state.setRestrictState)
  const { account, profile } = useAuthContext()
  const { allCopyTrades } = useAllCopyTrades()
  const isQuotaExceed = useMemo(() => {
    return (
      !!profile &&
      !!account &&
      profile.plan === SubscriptionPlanEnum.BASIC &&
      (allCopyTrades?.filter?.((data) => data.status === CopyTradeStatusEnum.RUNNING)?.length ?? 0) >=
        MaxCopyTradeQuotaEnum.BASIC
    )
  }, [account, allCopyTrades, profile])
  const handleQuotaExceed = useCallback(() => {
    if (!isQuotaExceed) return
    setRestrictState(RestrictState.EXCEED_QUOTA)
  }, [isQuotaExceed, setRestrictState])

  const isPremiumUser = useMemo(() => {
    return profile?.plan === SubscriptionPlanEnum.PREMIUM
  }, [profile?.plan])
  const handleIsBasicUser = () => {
    setRestrictState(RestrictState.PREMIUM_FEATURE)
  }

  const handleAlertQuotaExceed = useCallback(() => {
    setRestrictState(RestrictState.EXCEED_QUOTA)
  }, [setRestrictState])

  return {
    isQuotaExceed,
    handleQuotaExceed,
    isPremiumUser,
    handleIsBasicUser,
    handleAlertQuotaExceed,
  }
}
