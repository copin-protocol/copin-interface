import { Info } from '@phosphor-icons/react'
import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react'
import { animated, easings, useSpring } from 'react-spring'
import { v4 as uuidv4 } from 'uuid'

import ContentLoading from 'components/@ui/ContentLoading'
import Loading from 'theme/Loading'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { MIN_AMOUNT } from 'utils/config/constants'
import { overflowEllipsis } from 'utils/helpers/css'
import { compactNumber, formatNumber } from 'utils/helpers/format'

export function StatsWithTooltip({
  label,
  value,
  valueComponent,
  valuePrefix = '',
  valueSuffix = '',
  valueNum,
  tooltipText,
  tooltipContent,
  clickableTooltip = false,
  disabledAnimation = false,
  showValueTooltip = false,
  strictNum = false,
  labelIcon,
  sx,
  valueSx,
  labelSx,
  valueConversionFactor,
  hasCompact,
  compactNum,
}: {
  label: ReactNode
  value?: number
  valueComponent?: ReactElement
  valueNum?: number
  valuePrefix?: string
  valueSuffix?: string
  tooltipText?: string
  tooltipContent?: ReactNode
  clickableTooltip?: boolean
  disabledAnimation?: boolean
  showValueTooltip?: boolean
  strictNum?: boolean
  labelIcon?: ReactNode
  sx?: any
  valueSx?: any
  labelSx?: any
  valueConversionFactor?: number
  hasCompact?: boolean
  compactNum?: number
}) {
  const uuid = useRef(uuidv4()).current
  const valueTooltipUuid = useRef(uuidv4()).current
  const tooltipId = `tt_${uuid}`
  const valueTooltipId = `tt_${valueTooltipUuid}`
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    if (typeof value === 'number') {
      setIsLoading(false)
      return
    }
    let timeout: NodeJS.Timeout
    if (typeof value === 'undefined') {
      timeout = setTimeout(() => {
        setIsLoading(false)
      }, 30000)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [value])
  const randomWidth = useRef(Math.random() * 50 + 150)
  return (
    <>
      <Flex flexDirection="column" sx={{ gap: 12, ...(sx ?? {}) }}>
        <Flex sx={{ alignItems: 'center', gap: '4px' }}>
          {labelIcon ? labelIcon : null}
          <Type.Body textAlign="center" color="neutral2" sx={labelSx}>
            {label}
          </Type.Body>
          {tooltipText ? (
            <Box
              sx={{ lineHeight: 0 }}
              data-tip="React-tooltip"
              data-tooltip-id={tooltipId}
              color="neutral6"
              // data-tooltip-delay-hide={10000000}
            >
              <Info size={16} weight="fill" />
            </Box>
          ) : null}
        </Flex>
        {valueComponent ? (
          valueComponent
        ) : (
          <Type.LargeBold
            textAlign="center"
            sx={{ width: '100%', color: 'neutral1', ...overflowEllipsis(), ...(valueSx ?? {}) }}
          >
            {isLoading ? (
              <Loading />
            ) : typeof value === 'number' ? (
              <>
                <Box as="span" sx={valueSx}>
                  {value < 0 && '-'}
                  {valuePrefix}
                </Box>
                <Box sx={valueSx} as="span" data-tip="React-tooltip" data-tooltip-id={valueTooltipId}>
                  <StatsValueWithAnimation
                    value={Math.abs(value)}
                    num={valueNum}
                    disabledAnimation={disabledAnimation}
                    strictNum={strictNum}
                  />
                  {showValueTooltip ? (
                    <Tooltip id={valueTooltipId} place="top" type="dark" effect="solid">
                      <Type.Caption color="neutral6" sx={{ maxWidth: 300 }}>
                        {value < 0 && '-'}
                        {valuePrefix}
                        {formatNumber(Math.abs(value), 18)}
                        {valueSuffix}
                      </Type.Caption>
                    </Tooltip>
                  ) : null}
                </Box>
                <Box as="span" color="neutral5">
                  {valueSuffix}
                </Box>
              </>
            ) : (
              '--'
            )}
          </Type.LargeBold>
        )}
      </Flex>

      {typeof valueConversionFactor === 'number' ? (
        isLoading ? (
          <ContentLoading width={randomWidth.current * 0.5} height={18} sx={{ mt: '8px' }} opacity={0.4} />
        ) : typeof value === 'number' ? (
          <Type.Caption mt={2} color={valueConversionFactor < 0 ? 'red2' : 'green1'}>
            {valueConversionFactor >= 0 ? '+' : '-'}
            {valuePrefix}
            <StatsValueWithAnimation
              value={Math.abs(valueConversionFactor)}
              num={valueNum}
              strictNum
              hasCompact={hasCompact}
              compactNum={compactNum}
            />
          </Type.Caption>
        ) : (
          '--'
        )
      ) : null}

      {!!tooltipContent || !!tooltipText ? (
        <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable={clickableTooltip}>
          {!!tooltipContent ? (
            tooltipContent
          ) : (
            <Type.Caption color="neutral6" sx={{ maxWidth: 300 }}>
              {tooltipText}
            </Type.Caption>
          )}
        </Tooltip>
      ) : null}
    </>
  )
}
export function StatsValueWithAnimation({
  value,
  num = 1,
  disabledAnimation,
  strictNum = false,
  hasCompact = false,
  compactNum = 1,
}: {
  value: number | undefined
  num?: number
  disabledAnimation?: boolean
  strictNum?: boolean
  hasCompact?: boolean
  compactNum?: number
}) {
  let _num = num
  const _value = value ?? 0
  if (_value < MIN_AMOUNT && _value > 0 && !strictNum) _num = 6
  const [floatString, setFloatString] = useState(hasCompact ? compactNumber(0, compactNum) : formatNumber(0, _num))
  useSpring<{ result: number }>({
    result: value,
    from: { result: _value > 500 ? _value * 0.7 : 0 },
    config: {
      duration: disabledAnimation ? 0 : 720,
      easing: easings.easeInOutQuart,
    },
    onChange({ value }) {
      setFloatString(hasCompact ? compactNumber(value.result, compactNum) : formatNumber(value.result, _num))
    },
  })
  if (typeof value === 'undefined') return <span>--</span>
  return (
    <>
      <animated.span>{floatString}</animated.span>
    </>
  )
}
