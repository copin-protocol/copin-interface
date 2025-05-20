import useMyProfileStore from 'hooks/store/useMyProfile'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { SubscriptionPermission, SubscriptionPlanEnum } from 'utils/config/enums'

export default function useGetSubscriptionPermission<P, V>({ section }: { section: SubscriptionPermission }) {
  const permission = useSystemConfigStore((s) => s.permission)
  const myProfile = useMyProfileStore((s) => s.myProfile)
  //@ts-ignore
  const pagePermission = permission?.[section] as P | undefined
  //@ts-ignore
  const userPermission = pagePermission?.[myProfile?.subscription?.plan ?? SubscriptionPlanEnum.NON_LOGIN] as
    | V
    | undefined
  return { pagePermission, userPermission, myProfile }
}
