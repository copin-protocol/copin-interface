import { useHourlyChartStore } from 'hooks/store/useSwitchHourlyChart'
import { HOURLY_CHART_OPTIONS } from 'pages/PerpDEXsExplorer/PerpDexDetails/configs/constants'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Type } from 'theme/base'

const SwitchHourlyChart = ({ sx }: { sx?: any }) => {
  const { chartOption, setChartOption } = useHourlyChartStore()

  const renderOptions = () => {
    return (
      <Box>
        {HOURLY_CHART_OPTIONS.map((option) => (
          <DropdownItem
            key={option.id}
            size="sm"
            isActive={chartOption.id === option.id}
            onClick={() => setChartOption(option)}
          >
            {option.text}
          </DropdownItem>
        ))}
      </Box>
    )
  }

  return (
    <Dropdown
      menu={renderOptions()}
      buttonVariant="ghost"
      menuSx={{ width: '80px' }}
      hasArrow={true}
      sx={{ minWidth: 'fit-content', ...sx }}
    >
      <Type.CaptionBold>{chartOption.text}</Type.CaptionBold>
    </Dropdown>
  )
}

export default SwitchHourlyChart
