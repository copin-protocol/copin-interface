import { useCallback } from 'react'

import { useClickLoginButton } from 'components/@auth/LoginAction'
import useMyProfileStore from 'hooks/store/useMyProfile'
import useSubscriptionRestrictStore, { RestrictState } from 'hooks/store/useSubscriptionRestrictStore'
import { SubscriptionPlanEnum } from 'utils/config/enums'

// import useAllCopyTrades from './useAllCopyTrades'

export function useCheckCopyTradeAction() {
  // const setRestrictState = useSubscriptionRestrictStore((state) => state.setRestrictState)
  const { myProfile } = useMyProfileStore()
  const isLoggedIn = !!myProfile
  const handleClickLogin = useClickLoginButton()

  // const { allCopyTrades } = useAllCopyTrades()
  // const isQuotaExceed =
  //   isLoggedIn &&
  //   myProfile.plan === SubscriptionPlanEnum.BASIC &&
  //   (allCopyTrades?.filter?.((data) => data.status === CopyTradeStatusEnum.RUNNING)?.length ?? 0) >=
  //     MaxCopyTradeQuotaEnum.BASIC

  const checkIsEligible = useCallback(() => {
    if (!isLoggedIn) {
      handleClickLogin()
      return false
    }
    // if (isQuotaExceed) {
    //   setRestrictState(RestrictState.EXCEED_QUOTA)
    //   return false
    // }
    return true
  }, [handleClickLogin, isLoggedIn])

  return {
    // isEligible: !isQuotaExceed,
    checkIsEligible,
  }
}

export function useIsPremium() {
  const myProfile = useMyProfileStore((state) => state.myProfile)
  const isPremiumUser = myProfile ? myProfile.plan !== SubscriptionPlanEnum.BASIC : null
  return isPremiumUser
}

export function useIsVIP() {
  const myProfile = useMyProfileStore((state) => state.myProfile)
  const isVIPUser = myProfile ? myProfile.plan === SubscriptionPlanEnum.VIP : null
  return isVIPUser
}

export function useIsPremiumAndAction() {
  const isPremiumUser = useIsPremium()
  const handleClickLogin = useClickLoginButton()
  const setRestrictState = useSubscriptionRestrictStore((state) => state.setRestrictState)
  const checkIsPremium = useCallback(() => {
    if (isPremiumUser == null) {
      handleClickLogin()
      return false
    }
    if (!isPremiumUser) {
      setRestrictState(RestrictState.PREMIUM_FEATURE)
      return false
    }
    return true
  }, [isPremiumUser])
  return {
    isPremiumUser,
    checkIsPremium,
  }
}
