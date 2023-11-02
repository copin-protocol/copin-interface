import React from 'react'

import useLeaderboardContext from 'hooks/features/useLeaderboardProvider'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Type } from 'theme/base'
import { LEADERBOARD_OPTIONS } from 'utils/config/options'

const SwitchLeaderboardType = () => {
  const { currentOption, changeCurrentOption } = useLeaderboardContext()

  const renderOptions = () => {
    return (
      <Box>
        {LEADERBOARD_OPTIONS.map((option) => (
          <DropdownItem key={option.id} size="sm" onClick={() => changeCurrentOption(option)}>
            <Type.Body color={currentOption.id === option.id ? 'primary1' : 'neutral3'}>{option.text}</Type.Body>
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
        border: 'none',
        p: 0,
      }}
      menuSx={{ width: '80px' }}
      hasArrow={true}
      sx={{ minWidth: 'fit-content', pr: [0, 0, 3, 3] }}
    >
      <Type.CaptionBold color="neutral2">{currentOption.text}</Type.CaptionBold>
    </Dropdown>
  )
}

export default SwitchLeaderboardType
