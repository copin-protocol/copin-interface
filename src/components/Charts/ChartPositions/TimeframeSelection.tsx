import { Button } from 'theme/Buttons'
import { Flex } from 'theme/base'
import { TimeframeEnum } from 'utils/config/enums'
import { TIMEFRAME_NAMES } from 'utils/config/trades'

import { TIMEFRAME_OPTIONS, TIMEFRAME_OPTIONS_EXPANDED } from './constants'

export default function TimeframeSelection({
  currentOption,
  changeOption,
  isExpanded,
}: {
  currentOption: TimeframeEnum | null
  changeOption: (data: TimeframeEnum) => void
  isExpanded?: boolean
}) {
  return (
    <Flex alignItems="center" sx={{ gap: ['2px', '2px', '2px', 2] }}>
      {(isExpanded ? TIMEFRAME_OPTIONS_EXPANDED : TIMEFRAME_OPTIONS).map((option, index: number) => (
        <Button
          type="button"
          variant="ghost"
          key={index}
          onClick={() => changeOption(option)}
          width="fit-content"
          sx={{
            color: currentOption && currentOption === option ? 'neutral1' : 'neutral3',
            fontWeight: 'normal',
            // borderBottom: currentFilter && currentFilter.id === option.id ? 'small' : 'none',
            // borderColor: 'primary1',
            // backgroundColor: currentFilter && currentFilter.id === option.id ? 'neutral3' : 'transparent',
            padding: 0,
            px: ['1px', 1, 1, 1],
            height: '24px',
            borderRadius: '0',
            flexShrink: 0,
            '&:hover:not(:disabled),&:active:not(:disabled)': {
              color: 'neutral1',
            },
          }}
        >
          {TIMEFRAME_NAMES[option]}
        </Button>
      ))}
    </Flex>
  )
}
