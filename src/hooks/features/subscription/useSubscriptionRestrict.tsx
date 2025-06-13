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

export function useIsPro() {
  const myProfile = useMyProfileStore((state) => state.myProfile)
  const isPremiumUser = myProfile?.subscription?.plan
    ? [SubscriptionPlanEnum.PRO, SubscriptionPlanEnum.ELITE, SubscriptionPlanEnum.IF].includes(
        myProfile.subscription.plan
      )
    : null
  return isPremiumUser
}

export function useIsElite() {
  const myProfile = useMyProfileStore((state) => state.myProfile)
  const isEliteUser = myProfile?.subscription?.plan
    ? [SubscriptionPlanEnum.ELITE, SubscriptionPlanEnum.IF].includes(myProfile.subscription.plan)
    : null
  return isEliteUser
}

export function useIsIF() {
  const myProfile = useMyProfileStore((state) => state.myProfile)
  const isIFUser = myProfile?.subscription?.plan
    ? [SubscriptionPlanEnum.IF].includes(myProfile.subscription.plan)
    : null
  return isIFUser
}

export function useIsProAndAction() {
  const isProUser = useIsPro()
  const handleClickLogin = useClickLoginButton()
  const setRestrictState = useSubscriptionRestrictStore((state) => state.setRestrictState)
  const checkIsPro = useCallback(() => {
    if (isProUser == null) {
      handleClickLogin()
      return false
    }
    if (!isProUser) {
      setRestrictState(RestrictState.PREMIUM_FEATURE)
      return false
    }
    return true
  }, [isProUser])
  return {
    isProUser,
    checkIsPro,
  }
}
