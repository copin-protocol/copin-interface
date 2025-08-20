import React, { useMemo } from 'react'

import { AccountInfo } from 'components/@ui/AccountInfo'
import { renderOpeningPnL } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import ProgressBar from 'theme/ProgressBar'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { compactNumber, formatPrice } from 'utils/helpers/format'

import { DURATION_DIVIDERS, calculatePositionWidth } from './helpers'

interface OpenInterestItemProps {
  position: PositionData
  currentPrice?: number
  highestSize: number
  onClick?: (position: PositionData) => void
}

export default function OpenInterestItem({ position, highestSize, onClick }: OpenInterestItemProps) {
  const { width } = useMemo(() => calculatePositionWidth(position), [position])

  const handleClick = () => {
    if (onClick) {
      onClick(position)
    }
  }

  return (
    <Box
      sx={{
        width,
        minWidth: DURATION_DIVIDERS[0].width,
        maxWidth: DURATION_DIVIDERS[DURATION_DIVIDERS.length - 1].width,
      }}
    >
      <Flex
        onClick={handleClick}
        sx={{
          flexDirection: 'column',
          border: 'small',
          borderColor: 'transparent',
          px: 1,
          mb: 2,
          width: '100%',
          height: 52,
          borderRadius: 'xs',
          // overflow: 'hidden',
          background: `linear-gradient(${position.isLong ? '270deg' : '90deg'}, ${themeColors.neutral5} 0%, ${
            themeColors.neutral7
          } 100%)`,
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 100,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'xs',
            padding: '1px',
            background: `linear-gradient(${position.isLong ? '270deg' : '90deg'}, ${
              position.isLong ? themeColors.green1 : themeColors.red2
            }50 0%, ${themeColors.neutral7} 100%)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          },
        }}
      >
        <Box
          width="calc(100% - 16px)"
          mx="auto"
          height="2px"
          sx={{ transform: position.isLong ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          {highestSize && (
            <ProgressBar percent={(position.size / highestSize) * 100} bg="neutral5" color="neutral1" height={2} />
          )}
        </Box>
        <Flex
          flex="1"
          alignItems="center"
          px={'6px'}
          justifyContent="flex-end"
          sx={{ flexDirection: position.isLong ? 'row' : 'row-reverse', gap: 12, position: 'relative', zIndex: 100 }}
        >
          <Type.Caption color="neutral3" display="block" flex="1" textAlign={position.isLong ? 'left' : 'right'}>
            Price<Box color="neutral1">{formatPrice(position.averagePrice)}</Box>
          </Type.Caption>
          <AccountInfo address={position.account} protocol={position.protocol} avatarSize={32} />
          <Box textAlign={'right'} width={65}>
            <Type.Body color="neutral1" display="block">
              ${compactNumber(position.size)}
            </Type.Body>
            <Type.Caption display="block">
              {renderOpeningPnL(position, undefined, {
                textAlign: 'right',
              })}
            </Type.Caption>
          </Box>
        </Flex>
      </Flex>
    </Box>
  )
}
