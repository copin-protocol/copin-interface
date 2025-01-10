import React from 'react'

import useLeaderboardContext from 'hooks/features/useLeaderboardProvider'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Type } from 'theme/base'
import { LEADERBOARD_OPTIONS } from 'utils/config/options'

const SwitchLeaderboardType = ({ sx }: { sx?: any }) => {
  const { currentOption, changeCurrentOption } = useLeaderboardContext()

  const renderOptions = () => {
    return (
      <Box>
        {LEADERBOARD_OPTIONS.map((option) => (
          <DropdownItem
            key={option.id}
            isActive={currentOption.id === option.id}
            onClick={() => changeCurrentOption(option)}
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
      menuSx={{ minWidth: '101px', width: '101px' }}
      buttonSx={{ height: '100%', px: 16, width: '100px' }}
      hasArrow={true}
      sx={{ width: '100%', ...sx }}
    >
      <Type.CaptionBold color="neutral2">{currentOption.text}</Type.CaptionBold>
    </Dropdown>
  )
}

export default SwitchLeaderboardType
