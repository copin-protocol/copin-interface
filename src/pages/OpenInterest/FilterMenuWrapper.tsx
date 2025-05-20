import NotPermittedFilter from 'components/@subscription/NotPermittedFilter'
import useOIFilterPermission from 'hooks/features/subscription/useOIPermission'
import useUserNextPlan from 'hooks/features/subscription/useUserNextPlan'

export default function FilterMenuWrapper({ children, isFilterPair }: { children: any; isFilterPair?: boolean }) {
  return children
  // const { allowedFilter } = useOIFilterPermission()
  // const { userNextPlan } = useUserNextPlan()
  // if (allowedFilter) return children
  // return <NotPermittedFilter requiredPlan={userNextPlan} isFilterPair={!!isFilterPair} />
}
