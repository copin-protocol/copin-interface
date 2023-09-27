import { useResponsive } from 'ahooks'

import TimeFilter from 'components/@ui/TimeFilter'
import RangeFilter from 'components/@ui/TimeFilter/RangeFilter'
import useInternalRole from 'hooks/features/useInternalRole'
import { Box, Flex } from 'theme/base'

import TimeRangePriceChart from './TimeRangePriceChart'
import { TradersContextData } from './useTradersContext'

export interface TimeFilterSectionProps {
  triggerResize?: any
  contextValues: TradersContextData
}

export default function TimeFilterSection({ triggerResize, contextValues }: TimeFilterSectionProps) {
  const { isRangeSelection, from, to, changeTimeRange, timeOption, changeTimeOption } = contextValues
  const { sm } = useResponsive()

  const isInternal = useInternalRole()

  return (
    <Flex sx={{ position: 'relative', width: '100%', height: '100%', flexDirection: 'column' }}>
      <Box
        display={['block', 'block', 'block', 'flex']}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          px: [1, 1, 1, 3],
          flexShrink: 0,
          // borderBottom: 'small',
          // borderColor: 'neutral4',
          height: ['auto', 'auto', 'auto', 40],
        }}
      >
        <Flex
          justifyContent="start"
          alignItems="center"
          sx={{ gap: [0, 1, 1, 2] }}
          mb={[2, 2, 2, 0]}
          mt={isInternal ? 0 : ['6px', '6px', '6px', 0]}
        >
          <TimeFilter currentFilter={isRangeSelection ? null : timeOption} handleFilterChange={changeTimeOption} />
          {isInternal && <Box height={16} flex="0 0 1px" bg="neutral4"></Box>}
          {!!from && isInternal && (
            <RangeFilter
              isRangeSelection={isRangeSelection}
              from={from}
              to={to}
              changeTimeRange={changeTimeRange}
              anchor={sm ? 'left' : 'right'}
              anchorPos={sm ? 0 : -32}
            />
          )}
        </Flex>
      </Box>
      {sm && isInternal ? (
        <Box flex="1 1 0" sx={{ overflow: 'hidden' }}>
          {!!from && (
            <TimeRangePriceChart from={from} to={to} onChange={changeTimeRange} triggerResize={triggerResize} />
          )}
        </Box>
      ) : null}
    </Flex>
  )
}
