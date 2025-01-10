import { useEffect } from 'react'

import TabItem from 'theme/Tab/TabItem'
import { Flex } from 'theme/base'
import { TimeframeEnum } from 'utils/config/enums'
import { TIMEFRAME_NAMES } from 'utils/config/trades'

import { TIMEFRAME_OPTIONS, TIMEFRAME_OPTIONS_EXPANDED } from './configs'

export default function TimeframeSelection({
  currentOption,
  changeOption,
  isExpanded,
}: {
  currentOption: TimeframeEnum | null
  changeOption: (data: TimeframeEnum) => void
  isExpanded?: boolean
}) {
  useEffect(() => {
    if (!isExpanded && currentOption === TimeframeEnum.D1) {
      changeOption(TimeframeEnum.H1)
    }
  }, [isExpanded])

  return (
    <Flex alignItems="center" sx={{ gap: ['2px', '2px', '2px', 2] }}>
      {(isExpanded ? TIMEFRAME_OPTIONS_EXPANDED : TIMEFRAME_OPTIONS).map((option, index: number) => (
        <TabItem key={index} active={currentOption === option} onClick={() => changeOption(option)} sx={{ p: 1 }}>
          {TIMEFRAME_NAMES[option]}
        </TabItem>
      ))}
    </Flex>
  )
}
