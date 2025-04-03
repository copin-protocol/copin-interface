import { useResponsive } from 'ahooks'
import React from 'react'

import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import FilterPairTag from 'pages/DailyTrades/FilterTags/FilterPairTag'
import FilterTag from 'pages/Explorer/ConditionFilter/FilterTag'
import { FilterTabEnum } from 'pages/Explorer/ConditionFilter/configs'
import { Flex } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'

import FilterProtocolTag from './FilterProtocolTag'
import FilterTimeframeTag from './FilterTimeframeTag'

export default function DisplayFilter({
  type,
  protocols,
  pairs,
  condition,
}: {
  type?: TimeFilterByEnum
  protocols?: string[]
  pairs?: string[]
  condition?: ConditionFormValues<TraderData>
}) {
  const { lg } = useResponsive()
  return (
    <Flex alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
      <FilterProtocolTag
        protocols={!!protocols?.length ? (protocols as ProtocolEnum[]) : undefined}
        tagSx={{ color: 'neutral2' }}
      />
      <FilterPairTag
        pairs={!!pairs?.length ? pairs : undefined}
        tagSx={{ color: 'neutral2' }}
        textColor="primary1"
        hasLabel
      />
      {type && <FilterTimeframeTag type={type} tagSx={{ color: 'neutral2' }} />}
      {condition && (
        <FilterTag
          filters={condition}
          filterTab={FilterTabEnum.DEFAULT}
          limit={lg ? 10 : 5}
          tagSx={{
            color: 'neutral2',
            display: 'inline',
          }}
        />
      )}
    </Flex>
  )
}
