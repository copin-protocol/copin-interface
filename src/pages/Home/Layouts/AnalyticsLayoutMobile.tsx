import { cloneElement, useReducer } from 'react'

import DirectionButton from 'components/@ui/DirectionButton'
import { Box, Flex } from 'theme/base'

import { ConditionFilterProps } from '../ConditionFilter/types'
import SwitchProtocols from '../SwitchProtocols'
import { TimeFilterSectionProps } from '../TimeFilterSection'
import { RowConfig, RowState, mobileConfigs as configs } from './layoutConfigs'
import { AnalyticsLayoutComponents } from './types'

export default function AnalyticsLayoutMobile({
  timeFilterSection,
  listTradersSection,
  conditionFilter,
}: AnalyticsLayoutComponents) {
  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      <Flex sx={{ alignItems: 'center', borderBottom: 'small', borderBottomColor: 'neutral4' }}>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', flex: 1, px: 3, gap: 2 }}>
          {timeFilterSection}
          {conditionFilter}
        </Flex>
        <SwitchProtocols buttonSx={{ borderBottom: 'none', borderRight: 'none' }} />
      </Flex>
      <Box sx={{ flex: '1 0 0' }}>{listTradersSection}</Box>
    </Flex>
  )
}
