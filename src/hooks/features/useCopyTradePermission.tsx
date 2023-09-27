import useMyProfileStore from 'hooks/store/useMyProfile'

const useCopyTradePermission = () => {
  const { myProfile } = useMyProfileStore()
  if (!myProfile) return false
  return myProfile.copyTradeQuota > 0
}

export default useCopyTradePermission
