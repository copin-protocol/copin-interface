import { Lock } from '@phosphor-icons/react'

import { tableSettings } from 'components/@trader/TraderExplorerTableView/configs'
import { getFieldOptionLabels, getFieldOptions } from 'components/@widgets/ConditionFilterForm/helpers'
import { DataPermissionConfig, ExplorerPermission } from 'entities/permission'
import { TraderData } from 'entities/trader'
import { Flex } from 'theme/base'
import { rankingFieldOptions } from 'utils/config/options'
import { getItemsAndRequiredPlan } from 'utils/helpers/transform'

export const defaultFieldOptions = getFieldOptions<TraderData>(tableSettings)
export const getFilterOptions = ({
  key = 'fieldsAllowed',
  pagePermission,
  userPermission,
}: {
  key?: string
  pagePermission?: ExplorerPermission
  userPermission?: DataPermissionConfig
}) => {
  const fieldsAllowedByPlan = getItemsAndRequiredPlan(key, pagePermission)
  const shortedFields = Object.keys(fieldsAllowedByPlan)
  return getFieldOptions<TraderData>(tableSettings)
    .filter((e) => e.value !== 'indexTokens')
    .sort((a, b) => {
      const aIndex = shortedFields.indexOf(a.value)
      const bIndex = shortedFields.indexOf(b.value)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
    .map((option) => {
      const isDisabled = !userPermission?.fieldsAllowed?.includes(option.value)
      return {
        ...option,
        label: (
          <Flex alignItems="center" sx={{ gap: 1 }}>
            {option.label}
            {isDisabled && <Lock size="12" />}
          </Flex>
        ),
        isDisabled,
      }
    })
}
export const defaultFieldOptionLabels = getFieldOptionLabels(defaultFieldOptions)

export const rankingFieldOptionLabels = getFieldOptionLabels(rankingFieldOptions)

export enum FilterTabEnum {
  DEFAULT = 'default',
  RANKING = 'ranking',
}
