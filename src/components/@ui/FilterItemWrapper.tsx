import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import { Box, Flex, IconBox } from 'theme/base'
import { SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'

export default function FilterItemWrapper({
  children,
  allowedFilter,
  planToFilter,
  permissionIconSx,
}: {
  children: any
  allowedFilter?: boolean
  planToFilter?: SubscriptionPlanEnum
  permissionIconSx?: any
}) {
  return (
    <Flex sx={{ alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        {children}
        {!allowedFilter && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, cursor: 'not-allowed' }} />
        )}
      </Box>
      {!allowedFilter && planToFilter && (
        <>
          <IconBox
            icon={
              <PlanUpgradeIndicator
                requiredPlan={planToFilter}
                useLockIcon
                learnMoreSection={SubscriptionFeatureEnum.OPEN_INTEREST}
              />
            }
            sx={permissionIconSx}
          />
        </>
      )}
    </Flex>
  )
}
