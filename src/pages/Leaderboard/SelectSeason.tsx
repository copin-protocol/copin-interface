import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import React from 'react'

import useLeaderboardContext from 'hooks/features/useLeaderboardProvider'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex, Type } from 'theme/base'

const SelectSeason = () => {
  const { formatCurrent, formatPrev, formatNext, ignoreNext, onPrevious, onNext } = useLeaderboardContext()

  return (
    <Flex
      flex="auto"
      alignItems="center"
      justifyContent="space-between"
      px={[0, 0, 2, 2]}
      sx={{
        borderLeft: ['none', 'none', 'small', 'small'],
        borderRight: ['none', 'none', 'small', 'small'],
        borderColor: ['neutral4', 'neutral4', 'neutral4', 'neutral4'],
      }}
    >
      <ButtonWithIcon
        type="button"
        variant="ghostActive"
        icon={<CaretLeft size={20} />}
        iconSx={{ color: 'neutral3' }}
        sx={{ pl: [0, 0, 2, 2], pr: [2, 2, 12, 12], mx: 0 }}
        onClick={onPrevious}
      >
        <Type.Caption color="neutral3"> {formatPrev}</Type.Caption>
      </ButtonWithIcon>
      <Flex flex={1} justifyContent="center">
        <Type.CaptionBold textAlign="center" color="primary1" py={[2, 2, 20, 20]}>
          {formatCurrent}
        </Type.CaptionBold>
      </Flex>
      <ButtonWithIcon
        type="button"
        variant="ghostActive"
        icon={<CaretRight size={20} />}
        iconSx={{ color: 'neutral3' }}
        direction="right"
        sx={{ pr: [0, 0, 2, 2], pl: [2, 2, 12, 12], mx: 0 }}
        onClick={onNext}
        disabled={ignoreNext}
      >
        <Type.Caption color="neutral3"> {formatNext}</Type.Caption>
      </ButtonWithIcon>
    </Flex>
  )
}

export default SelectSeason
