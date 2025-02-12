import useMyProfileStore from 'hooks/store/useMyProfile'
import { UserRoleEnum } from 'utils/config/enums'

const useCopyTradePermission = (restrictCondition?: boolean) => {
  const { myProfile } = useMyProfileStore()
  if (!myProfile) return false
  if (restrictCondition) {
    return myProfile.role === UserRoleEnum.ADMIN || myProfile.role === UserRoleEnum.NORMAL
  }
  return myProfile.copyTradeQuota > 0
}

export default useCopyTradePermission
