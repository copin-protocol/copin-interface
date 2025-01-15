import React from 'react'

import { useHourlyChartStore } from 'hooks/store/useSwitchHourlyChart'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Type } from 'theme/base'
import { HOURLY_CHART_OPTIONS } from 'utils/config/constants'

const SwitchHourlyChart = ({ sx }: { sx?: any }) => {
  const { chartOption, setChartOption } = useHourlyChartStore()

  const renderOptions = () => {
    return (
      <Box>
        {HOURLY_CHART_OPTIONS.map((option) => (
          <DropdownItem key={option.id} size="sm" onClick={() => setChartOption(option)}>
            <Type.Body color={chartOption.id === option.id ? 'primary1' : 'neutral3'}>{option.text}</Type.Body>
          </DropdownItem>
        ))}
      </Box>
    )
  }

  return (
    <Dropdown
      menu={renderOptions()}
      buttonVariant="ghost"
      buttonSx={{
        border: '1px solid #E0E0E0',
        px: '5px',
        py: '3px',
      }}
      menuSx={{ width: '80px' }}
      hasArrow={true}
      sx={{ minWidth: 'fit-content', ...sx }}
    >
      <Type.CaptionBold color="neutral2">{chartOption.text}</Type.CaptionBold>
    </Dropdown>
  )
}

export default SwitchHourlyChart
