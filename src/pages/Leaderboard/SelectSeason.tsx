import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import React from 'react'

import useLeaderboardContext from 'hooks/features/useLeaderboardProvider'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Flex, Type } from 'theme/base'
import { PAGE_TITLE_HEIGHT } from 'utils/config/constants'

const SelectSeason = () => {
  const { formatCurrent, formatPrev, formatNext, ignoreNext, onPrevious, onNext } = useLeaderboardContext()

  return (
    <Flex
      flex="auto"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        borderLeft: ['small', 'small', 'small', 'small'],
        borderRight: ['none', 'none', 'small', 'small'],
        borderBottom: ['small', 'small', 'none', 'none'],
        borderColor: ['neutral4', 'neutral4', 'neutral4', 'neutral4'],
      }}
      height={PAGE_TITLE_HEIGHT}
    >
      <ButtonWithIcon
        type="button"
        variant="ghost"
        icon={<CaretLeft size={16} />}
        sx={{ mx: 0, borderRadius: 0 }}
        onClick={onPrevious}
      >
        <Type.Caption> {formatPrev}</Type.Caption>
      </ButtonWithIcon>
      <Flex flex={1} justifyContent="center">
        <Type.CaptionBold textAlign="center" color="primary1" sx={{ textTransform: 'uppercase' }}>
          {formatCurrent}
        </Type.CaptionBold>
      </Flex>
      <ButtonWithIcon
        type="button"
        variant="ghost"
        icon={<CaretRight size={16} />}
        direction="right"
        sx={{ mx: 0, borderRadius: 0 }}
        onClick={onNext}
        disabled={ignoreNext}
      >
        <Type.Caption> {formatNext}</Type.Caption>
      </ButtonWithIcon>
    </Flex>
  )
}

export default SelectSeason
