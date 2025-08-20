import { PositionData } from 'entities/trader'

export const DURATION_DIVIDERS = [
  {
    label: 'Today',
    value: 1,
    width: 330,
  },
  {
    label: 'Yesterday',
    value: 2,
    width: 400,
  },
  {
    label: '7D',
    value: 7,
    width: 450,
  },
  {
    label: '1M',
    value: 30,
    width: 500,
  },
  {
    label: '3M',
    value: 90,
    width: 550,
  },
  {
    label: '1Y',
    value: 365,
    width: 600,
  },
]

export const SIZE_HEIGHT_LEVELS = [
  {
    label: '1B+',
    value: 1000000000,
    height: 136,
  },
  {
    label: '100M+',
    value: 100000000,
    height: 112,
  },
  {
    label: '10M+',
    value: 10000000,
    height: 88,
  },
  {
    label: '1M+',
    value: 1000000,
    height: 64,
  },
  {
    label: 'Small',
    value: 0,
    height: 48,
  },
]

// Calculate position duration and width with flexible scaling
export const calculatePositionWidth = (position: PositionData) => {
  const openTime = new Date(position.openBlockTime).getTime()
  const durationInMs = Date.now() - openTime
  const durationInDays = Math.ceil(durationInMs / (1000 * 60 * 60 * 24))

  // Find the appropriate range for the duration
  for (let i = 0; i < DURATION_DIVIDERS.length; i++) {
    const currentDivider = DURATION_DIVIDERS[i]

    if (durationInDays <= currentDivider.value) {
      // If it's the first divider or exact match, return the exact width
      if (i === 0 || durationInDays === currentDivider.value) {
        return { width: currentDivider.width, period: currentDivider.label }
      }

      // Calculate flexible width within the range
      const prevDivider = DURATION_DIVIDERS[i - 1]
      const rangeStart = prevDivider.value
      const rangeEnd = currentDivider.value
      const widthStart = prevDivider.width
      const widthEnd = currentDivider.width

      // Calculate progress within the range (0 to 1)
      const progress = (durationInDays - rangeStart) / (rangeEnd - rangeStart)

      // Interpolate width based on progress
      const width = Math.round(widthStart + (widthEnd - widthStart) * progress)

      return { width, period: currentDivider.label }
    }
  }

  // If duration exceeds all dividers, return the maximum width
  const lastDivider = DURATION_DIVIDERS[DURATION_DIVIDERS.length - 1]
  return { width: lastDivider.width, period: lastDivider.label }
}

// Calculate height with flexible scaling based on size
export const calculateHeight = (size: number) => {
  if (size >= SIZE_HEIGHT_LEVELS[0].value) {
    return { height: SIZE_HEIGHT_LEVELS[0].height, level: SIZE_HEIGHT_LEVELS[0].label }
  }
  // Find the appropriate range for the size
  for (let i = 1; i < SIZE_HEIGHT_LEVELS.length; i++) {
    const currentLevel = SIZE_HEIGHT_LEVELS[i]

    if (size >= currentLevel.value) {
      // If it's the last level or exact match, return the exact height
      if (i === SIZE_HEIGHT_LEVELS.length - 1 || size === currentLevel.value) {
        return { height: currentLevel.height, level: currentLevel.label }
      }

      // Calculate flexible height within the range
      const prevLevel = SIZE_HEIGHT_LEVELS[i - 1]
      const rangeStart = prevLevel.value
      const rangeEnd = currentLevel.value
      const heightStart = prevLevel.height
      const heightEnd = currentLevel.height

      // Calculate progress within the range (0 to 1)
      const progress = (size - rangeStart) / (rangeEnd - rangeStart)

      // Interpolate height based on progress
      const height = Math.round(heightStart + (heightEnd - heightStart) * progress)

      return { height, level: currentLevel.label }
    }
  }

  // If size is below all levels, return the minimum height
  const firstLevel = SIZE_HEIGHT_LEVELS[SIZE_HEIGHT_LEVELS.length - 1]
  return { height: firstLevel.height, level: firstLevel.label }
}
