import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import useTraderProfilePermission from 'hooks/features/subscription/useTraderProfilePermission'
import useGetTimeFilterOptions from 'hooks/helpers/useGetTimeFilterOptions'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { Flex } from 'theme/base'
import { SubscriptionFeatureEnum, SubscriptionPlanEnum, TimeFilterByEnum } from 'utils/config/enums'

import { TimeFilterProps } from './type'

export default function TimeDropdown({
  timeOption,
  onChangeTime,
  ignoreAllTime,
  menuSx = {},
}: {
  timeOption: TimeFilterProps
  onChangeTime: (option: TimeFilterProps) => void
  ignoreAllTime?: boolean
  menuSx?: any
}) {
  const { timeFilterOptions } = useGetTimeFilterOptions()
  const { timeFramesAllowed, pagePermission } = useTraderProfilePermission({})
  return (
    <Dropdown
      buttonVariant="ghost"
      inline
      menuSx={{
        width: '100px',
        minWidth: 'auto',
        ...menuSx,
      }}
      placement="bottom"
      menu={
        <>
          {timeFilterOptions
            .filter((option) => (ignoreAllTime ? option.id !== TimeFilterByEnum.ALL_TIME : true))
            .map((option) => {
              const hasPermission = timeFramesAllowed.includes(option.id)
              let requiredPlan = null
              if (pagePermission) {
                requiredPlan = Object.keys(pagePermission).find((plan) =>
                  pagePermission[plan as SubscriptionPlanEnum].timeFramesAllowed.includes(option.id)
                )
              }
              return (
                <Flex key={option.id} alignItems="center" sx={{ gap: 1 }}>
                  <CheckableDropdownItem
                    selected={option.id === timeOption.id}
                    text={
                      <Flex alignItems="center" sx={{ gap: 1 }}>
                        {option.text}
                        {!hasPermission && !!requiredPlan && (
                          <PlanUpgradeIndicator
                            requiredPlan={requiredPlan as SubscriptionPlanEnum}
                            learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
                          />
                        )}
                      </Flex>
                    }
                    onClick={() => onChangeTime(option)}
                    disabled={!hasPermission}
                    textSx={{ px: 0 }}
                  />
                </Flex>
              )
            })}
        </>
      }
    >
      {timeOption.text}
    </Dropdown>
  )
}
