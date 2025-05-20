import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import { TimeFilterProps } from 'components/@ui/TimeFilter'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import useGetTimeFilterOptions from 'hooks/helpers/useGetTimeFilterOptions'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { Flex, Type } from 'theme/base'
import { SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'

import { getDropdownProps } from './configs'

export default function TimeDropdown({
  timeOption,
  onChangeTime,
}: {
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
}) {
  const { timeFilterOptions } = useGetTimeFilterOptions()
  const { userPermission, pagePermission } = useExplorerPermission()

  return (
    <Dropdown
      buttonVariant="ghostPrimary"
      inline
      {...getDropdownProps({ menuSx: { width: 110 } })}
      menu={
        <>
          {timeFilterOptions.slice(0, timeFilterOptions.length - 1).map((option) => {
            let requiredPlan = null
            if (pagePermission) {
              requiredPlan = Object.keys(pagePermission).find(
                (plan) =>
                  !!pagePermission[plan as SubscriptionPlanEnum].timeFramesAllowed?.includes(option.id as string)
              )
            }
            const hasPermission = !!userPermission?.timeFramesAllowed?.includes(option.id as string)
            return (
              <CheckableDropdownItem
                key={option.id}
                selected={option.id === timeOption.id}
                text={
                  <Flex sx={{ gap: 1 }}>
                    <Type.Caption sx={hasPermission ? undefined : { opacity: 0.5, cursor: 'not-allowed' }}>
                      {option.text}
                    </Type.Caption>
                    {!hasPermission && (
                      <PlanUpgradeIndicator
                        buttonSx={{ color: 'neutral2', '&:hover': { color: 'neutral1' } }}
                        learnMoreSection={SubscriptionFeatureEnum.TRADER_EXPLORER}
                        requiredPlan={requiredPlan as SubscriptionPlanEnum}
                      />
                    )}
                  </Flex>
                }
                // disabled={!userPermission?.timeFramesAllowed?.includes(option.id)}
                onClick={(e: any) => {
                  if (!hasPermission) {
                    e.stopPropagation()
                    return
                  }
                  onChangeTime(option)
                }}
              />
            )
          })}
        </>
      }
    >
      {timeOption.text}
    </Dropdown>
  )
}
