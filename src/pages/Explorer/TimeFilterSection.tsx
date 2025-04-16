import dayjs from 'dayjs'
import { useState } from 'react'

import TimeFilter from 'components/@ui/TimeFilter'
import { ALL_TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter/constants'
import useGetTimeFilterOptions from 'hooks/helpers/useGetTimeFilterOptions'
// import { useIsPremium } from 'hooks/features/useSubscriptionRestrict'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex } from 'theme/base'
import { DATE_FORMAT } from 'utils/config/constants'

// import TimeRangePriceChart from './TimeRangePriceChart'
import { TradersContextData } from './useTradersContext'

export interface TimeFilterSectionProps {
  triggerResize?: any
  contextValues: TradersContextData
}

export default function TimeFilterSection({ triggerResize, contextValues }: TimeFilterSectionProps) {
  // TODO date range
  // const { isRangeSelection, from, to, changeTimeRange, timeOption, changeTimeOption } = contextValues
  // const isPremiumUser = useIsPremium()
  const { timeOption, changeTimeOption } = contextValues
  const { timeFilterOptions } = useGetTimeFilterOptions()

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
          sx={{ gap: [1, 1, 1, 2] }}
          mb={[2, 2, 2, 0]}
          // mt={isPremiumUser ? 0 : ['6px', '6px', '6px', 0]}
          mt={['6px', '6px', '6px', 0]}
        >
          <TimeFilter currentFilter={timeOption} handleFilterChange={changeTimeOption} options={timeFilterOptions} />
          {/* TODO date range  <TimeFilter currentFilter={isRangeSelection ? null : timeOption} handleFilterChange={changeTimeOption} />
           {isPremiumUser && <Box height={16} flex="0 0 1px" bg="neutral4"></Box>}
           {!!from && isPremiumUser && (
            <RangeFilter
              isRangeSelection={isRangeSelection}
              from={from}
              to={to}
              changeTimeRange={changeTimeRange}
              anchor={sm ? 'left' : 'right'}
              anchorPos={sm ? 0 : -125}
            />
          )} */}
        </Flex>
      </Box>
      {/* {sm && isPremiumUser ? (
        <Box flex="1 1 0" sx={{ overflow: 'hidden' }}>
          {!!from && (
            <TimeRangePriceChart from={from} to={to} onChange={changeTimeRange} triggerResize={triggerResize} />
          )}
        </Box>
      ) : null} */}
    </Flex>
  )
}

export function TimeFilterDropdown({ contextValues }: TimeFilterSectionProps) {
  const { from, to, timeOption: currentOption, changeTimeOption } = contextValues
  // TODO date range
  // const { isRangeSelection, from, to, changeTimeRange, timeOption, changeTimeOption } = contextValues
  // const { isPremiumUser } = useSubscriptionRestrict()
  // const currentOption = isRangeSelection ? null : timeOption

  const [visible, setVisible] = useState(false)
  return (
    <Dropdown
      buttonVariant="ghost"
      inline
      visible={visible}
      setVisible={setVisible}
      dismissible={false}
      menuDismissible
      menuSx={{ width: 100 }}
      menu={
        <>
          {ALL_TIME_FILTER_OPTIONS.map((option, index: number) => (
            <DropdownItem
              type="button"
              variant="ghost"
              key={index}
              isActive={option.value === currentOption.value}
              onClick={() => {
                changeTimeOption(option)
                setVisible(false)
              }}
              width="fit-content"
              sx={{
                color: currentOption && currentOption.id === option.id ? 'neutral1' : 'neutral3',
                fontWeight: 'normal',
              }}
            >
              {option.text}
            </DropdownItem>
          ))}

          {/* TODO date range {!!from && isPremiumUser && (
            <DropdownItem>
              <RangeFilter
                isRangeSelection={isRangeSelection}
                from={from}
                to={to}
                changeTimeRange={changeTimeRange}
                posDefine={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
                }}
                buttonType="text"
                onSelectingChange={() => setVisible(false)}
              />
            </DropdownItem>
          )} */}
        </>
      }
    >
      {currentOption?.text ?? `${dayjs(from).format(DATE_FORMAT)} - ${dayjs(to).format(DATE_FORMAT)}`}
    </Dropdown>
  )
}
