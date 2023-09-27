import React from 'react'
import styled from 'styled-components/macro'

import { Box } from 'theme/base'
import { BoxProps } from 'theme/types'

const Bar = styled(Box)`
  position: relative;
  // border-radius: 8px;
  overflow: hidden;
`

const BarBg = styled(Box)`
  position: relative;
  overflow: hidden;
  // border-radius: 8px;
  // border: 1px solid #7e8599;
`

export type ThumbProps = {
  hasAnimation?: boolean
} & BoxProps

const Thumb = styled(Box)<{ hasAnimation?: boolean }>`
  position: absolute;
  z-index: 2;
  // border-radius: 8px;
  top: 0;

  &:before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
    // border-radius: 10px;
    opacity: 0;
    ${({ hasAnimation }) =>
      hasAnimation
        ? `-webkit-animation: ant-progress-active 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
           animation: ant-progress-active 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;`
        : ''}
    content: '';
  }

  @-webkit-keyframes ant-progress-active {
    0% {
      width: 0;
      opacity: 0.1;
    }
    20% {
      width: 0;
      opacity: 0.5;
    }
    to {
      width: 100%;
      opacity: 0;
    }
  }
  @keyframes ant-progress-active {
    0% {
      width: 0;
      opacity: 0.1;
    }
    20% {
      width: 0;
      opacity: 0.5;
    }
    to {
      width: 100%;
      opacity: 0;
    }
  }
`

const ProgressBar = ({
  percent,
  marks,
  height = 4,
  color = 'red2',
  bg = 'neutral1',
  hasAnimation = false,
  ...props
}: {
  percent: number
  marks?: number[]
  height?: number
  color?: string
  bg?: string
  hasAnimation?: boolean
} & BoxProps) => {
  return (
    <Bar {...props}>
      <BarBg width="100%" height={height} bg={bg} />
      {marks &&
        marks?.length > 0 &&
        marks.map((mark) => (
          <Box
            key={mark}
            sx={{ position: 'absolute', top: 0, left: `${mark}%`, width: '1px', height: '100%', bg: '#7e8599' }}
          ></Box>
        ))}
      <Thumb
        width={`${percent}%`}
        height={height}
        hasAnimation={hasAnimation}
        sx={{
          bg: color ?? undefined,
          background: !color ? 'linear-gradient(180deg, #FE5821 -20%, #FE9608 100%)' : undefined,
        }}
      />
    </Bar>
  )
}

export default ProgressBar
