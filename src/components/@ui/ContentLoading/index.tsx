import React, { useEffect, useRef, useState } from 'react'
import ContentLoader from 'react-content-loader'

import { Flex } from 'theme/base'
import { ColorsIndexType, themeColors } from 'theme/colors'
import { BoxProps } from 'theme/types'

type TextContent = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'large' | 'normal' | 'caption' | 'small'

const getHeight = (as?: TextContent) => {
  switch (as) {
    case 'h1':
      return [48, 52]
    case 'h2':
      return [40, 48]
    case 'h3':
      return [32, 40]
    case 'h4':
      return [28, 36]
    case 'h5':
      return [24, 32]
    case 'normal':
      return [16, 24]
    case 'large':
      return [18, 26]
    case 'caption':
      return [14, 22]
    case 'small':
      return [12, 20]
    default:
      return [16, 24]
  }
}

const ContentLoading = ({
  width,
  height,
  foreColor,
  backColor,
  opacity = 1,
  as,
  ...props
}: {
  width: number | string
  height?: number
  as?: TextContent
  foreColor?: ColorsIndexType
  backColor?: ColorsIndexType
  opacity?: number
} & BoxProps) => {
  const [h, lh] = getHeight(as)
  const contentHeight = height ?? h
  const boxHeight = height ?? lh
  const [svgWidth, setSvgWidth] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.getBoundingClientRect().width
      setSvgWidth(width)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <Flex
      // sx={{ borderRadius: 'sm', overflow: 'hidden' }}
      ref={containerRef}
      width={width}
      height={boxHeight}
      py={`${(boxHeight - contentHeight) / 2}px`}
      sx={{ position: 'relative' }}
      alignItems="center"
      {...props}
    >
      <ContentLoader
        // style={{ position: 'absolute' }}
        speed={2}
        width={svgWidth}
        height={contentHeight}
        viewBox={`0 0 ${svgWidth} ${contentHeight}`}
        backgroundColor={foreColor ? themeColors[foreColor] : themeColors.neutral6}
        foregroundColor={backColor ? themeColors[backColor] : themeColors.neutral5}
        opacity={opacity}
      >
        <rect x="0" y="0" rx="4" ry="4" width="100%" height="100%" />
      </ContentLoader>
    </Flex>
  )
}

export default ContentLoading
