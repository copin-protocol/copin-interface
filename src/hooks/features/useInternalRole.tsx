import { useMemo } from 'react'

import useMyProfileStore from 'hooks/store/useMyProfile'
import { UserRoleEnum } from 'utils/config/enums'

const useInternalRole = () => {
  const { myProfile } = useMyProfileStore()
  return useMemo(() => {
    if (!myProfile) return false
    return myProfile.role !== UserRoleEnum.GUEST
  }, [myProfile])
}

export default useInternalRole
