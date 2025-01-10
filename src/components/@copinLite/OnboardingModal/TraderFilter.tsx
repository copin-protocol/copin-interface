import { Trans } from '@lingui/macro'
import { Fragment, ReactNode, memo, useRef, useState } from 'react'

import { Button } from 'theme/Buttons'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { TraderLabelEnum } from 'utils/config/enums'

import { LIST_FIND_TRADER_CONFIG } from './configs'

const TraderFilter = memo(function TraderFilter({
  onConfirm,
  onSkip,
  isFindingTrader,
  showSkipButton = true,
  skipButtonText = <Trans>Skip</Trans>,
}: {
  onConfirm: (listLabel: TraderLabelEnum[]) => void
  onSkip: () => void
  isFindingTrader: boolean
  showSkipButton?: boolean
  skipButtonText?: ReactNode
}) {
  const [selectedFilterKeys, setKeys] = useState<TraderLabelEnum[]>([])
  const prevKey = useRef([...selectedFilterKeys].sort().join(''))
  const currentKey = [...selectedFilterKeys].sort().join('')
  const handleClickKey = (key: TraderLabelEnum) =>
    setKeys((prev) => {
      if (prev.includes(key)) {
        return prev.filter((v) => v !== key)
      } else {
        return [...prev, key]
      }
    })

  const handleClickFind = () => {
    onConfirm(selectedFilterKeys)
    prevKey.current = [...selectedFilterKeys].sort().join('')
  }
  const handleClickSkip = () => {
    onSkip()
  }
  const disabledFind = !selectedFilterKeys.length || isFindingTrader || currentKey === prevKey.current
  return (
    <>
      <Box mb={24} flex="1">
        <Box id="filter_head">
          <Type.H5 mb={10} color="neutral1">
            <Trans>Discover top trader for your style</Trans>
          </Type.H5>
          <Type.Caption mb={24}>
            <Trans>This will help us find copy trader that fit for you</Trans>
          </Type.Caption>
        </Box>
        <Flex sx={{ flexWrap: 'wrap', gap: 2 }}>
          {LIST_FIND_TRADER_CONFIG.map((config) => {
            const isActive = selectedFilterKeys.includes(config.key)
            const tooltipId = 'tt_onboarding_trader_filter' + config.key
            return (
              <Fragment key={config.key}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleClickKey(config.key)}
                  sx={{
                    // borderRadius: '2px',
                    // height: '28px',
                    // lineHeight: '28px',
                    textTransform: 'capitalize',
                    fontWeight: 400,
                    flexShrink: 0,
                    py: 1,
                    px: 2,
                    bg: isActive ? 'neutral4' : 'transparent',
                    borderColor: 'neutral4',
                    color: 'neutral1',
                    '&:hover:not(:disabled)': {
                      borderColor: 'neutral3',
                    },
                  }}
                  disabled={isFindingTrader}
                  data-tooltip-id={tooltipId}
                  data-tooltip-delay-show={360}
                >
                  {config.label}
                </Button>
                <Tooltip id={tooltipId}>
                  <Type.Small maxWidth={300}>{config.tooltipContent}</Type.Small>
                </Tooltip>
              </Fragment>
            )
          })}
        </Flex>
      </Box>
      <Flex sx={{ gap: 2 }}>
        {showSkipButton && (
          <Button variant="outline" width={108} onClick={handleClickSkip} disabled={isFindingTrader}>
            {skipButtonText}
          </Button>
        )}
        <Button
          variant="primary"
          width={108}
          onClick={handleClickFind}
          disabled={disabledFind}
          isLoading={isFindingTrader}
        >
          <Trans>Find</Trans>
        </Button>
      </Flex>
    </>
  )
})

export default TraderFilter
