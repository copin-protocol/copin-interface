import { useState } from 'react'
import ReactJoyride, { CallBackProps, STATUS, Step, TooltipRenderProps } from 'react-joyride'

import Divider from 'components/@ui/Divider'
import { Button } from 'theme/Buttons'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { STORAGE_KEYS } from 'utils/config/keys'
import { Z_INDEX } from 'utils/config/zIndex'

export default function BacktestGuideTour() {
  const isInstructed = localStorage.getItem(STORAGE_KEYS.BACKTEST_GUIDE) === '1'
  const [{ run, steps }, setTourState] = useState<{ run: boolean; steps: Step[] }>(() => {
    return {
      run: !isInstructed,
      steps: [
        {
          content: tourConfigs.investmentCapital.content,
          target: tourConfigs.investmentCapital.target,
          placement: 'bottom-start',
          disableBeacon: true,
        },
        {
          content: tourConfigs.amountPerOrder.content,
          target: tourConfigs.amountPerOrder.target,
          placement: 'bottom-end',
        },
        {
          content: tourConfigs.tradingPairs.content,
          target: tourConfigs.tradingPairs.target,
          placement: 'top-start',
        },
        {
          content: tourConfigs.leverage.content,
          target: tourConfigs.leverage.target,
          placement: 'top-end',
        },
        {
          content: tourConfigs.timePeriod.content,
          target: tourConfigs.timePeriod.target,
          placement: 'top',
        },
      ],
    }
  })

  // const handleClickStart = (event: React.MouseEvent<HTMLElement>) => {
  //   event.preventDefault()

  //   setTourState((prev) => ({ ...prev, run: true }))
  // }

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED]

    if (finishedStatuses.includes(status)) {
      localStorage.setItem(STORAGE_KEYS.BACKTEST_GUIDE, '1')
      setTourState((prev) => ({ ...prev, run: false }))
    }
  }

  if (isInstructed) return <></>
  return (
    <ReactJoyride
      callback={handleJoyrideCallback}
      continuous
      scrollOffset={250}
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      tooltipComponent={Tooltip}
      styles={{
        options: {
          zIndex: Z_INDEX.TOASTIFY,
          arrowColor: themeColors.neutral4,
        },
        beaconInner: {
          backgroundColor: themeColors.primary1,
        },
        beaconOuter: {
          borderColor: themeColors.primary2,
          backgroundColor: `${themeColors.primary2}20`,
        },
        overlay: {
          backgroundColor: '#101423BF',
        },
      }}
    />
  )
}

export const tourConfigs = {
  investmentCapital: {
    id: 'tour__investment_capital',
    target: '#tour__investment_capital',
    content: <Type.Caption>Enter your real investment in Capital for the best back-testing effect</Type.Caption>,
  },
  amountPerOrder: {
    id: 'tour__amount_per_order',
    target: '#tour__amount_per_order',
    content: <Type.Caption>Set margin amount to 1/20 of your account or your own risk tolerance</Type.Caption>,
  },
  tradingPairs: {
    id: 'tour__trading_pairs',
    target: '#tour__trading_pairs',
    content: (
      <Type.Caption>
        Use multi-scenarios (all chains/ top assets/ altcoins) to identify trader&apos;s trading style and enhance risk
        management
      </Type.Caption>
    ),
  },
  leverage: {
    id: 'tour__leverage',
    target: '#tour__leverage',
    content: (
      <Type.Caption>
        Leverage amplifies potential profits but also increases risk. Price fluctuations can impact your invested
        capital
      </Type.Caption>
    ),
  },
  timePeriod: {
    id: 'tour__time_period',
    target: '#tour__time_period',
    content: (
      <Type.Caption>
        Backtest for 30 days from now, or choose a shorter period if your strategy aims for short-term goals
      </Type.Caption>
    ),
  },
}

function Tooltip(props: TooltipRenderProps) {
  const { backProps, continuous, index, isLastStep, primaryProps, skipProps, step, tooltipProps, size } = props
  return (
    <Box {...tooltipProps} px={1}>
      <Box
        sx={{
          maxWidth: 500,
          bg: 'neutral7',
          p: 2,
          borderRadius: 'sm',
          border: 'small',
          borderColor: 'neutral4',
          boxShadow: 'rgb(78 174 253 / 39%) 0px 0px 20px -4px',
        }}
      >
        <Type.Caption color="primary2">
          {index + 1}/{size}
        </Type.Caption>
        <Box mt={2}>{step.content && <Box>{step.content}</Box>}</Box>
        <Divider mt={3} height="0.5px !important" />
        <Flex mt="2px" justifyContent="space-between">
          {!isLastStep ? (
            <Button {...skipProps} variant="ghost" p={0} sx={{ fontWeight: 400 }}>
              Skip
            </Button>
          ) : (
            <Box />
          )}
          <Box>
            {index > 0 && (
              <Button {...backProps} variant="ghost" p={0} mr={3} sx={{ fontWeight: 400 }}>
                Back
              </Button>
            )}
            <Button {...primaryProps} variant="ghostPrimary" p={0} sx={{ fontWeight: 400 }}>
              {continuous ? (isLastStep ? 'Close' : 'Next') : 'Close'}
            </Button>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
