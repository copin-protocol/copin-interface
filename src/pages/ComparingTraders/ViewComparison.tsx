import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useCallback, useState } from 'react'

import { TimeFilterProps } from 'components/@ui/TimeFilter'
import { TraderData } from 'entities/trader'
import { useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'
import { HandleSelectTrader, SelectedTrader } from 'pages/TraderDetails/TraderRankingExpanded/FindAndSelectTrader'
import { Button } from 'theme/Buttons'
import Drawer from 'theme/Modal/Drawer'
import { Box, Flex, Type } from 'theme/base'

import ComparisonComponent, { ComparisonComponentProps } from './ComparisonComponent'

export default function ViewComparison({
  isOpen,
  onDismiss,
  traders,
  timeOption,
}: {
  isOpen: boolean
  onDismiss: () => void
  traders: [TraderData, TraderData]
  timeOption: TimeFilterProps
}) {
  const [firstTrader, setFirstTrader] = useState<TraderData>(traders[0])
  const [secondTrader, setSecondTrader] = useState<TraderData>(traders[1])

  const handleChangeFirstTrader: HandleSelectTrader = useCallback((data) => {
    setFirstTrader(data)
  }, [])
  const handleChangeSecondTrader: HandleSelectTrader = useCallback((data) => {
    setSecondTrader(data), []
  }, [])
  const { resetStore } = useSelectBacktestTraders()
  const handleClickReset = () => {
    resetStore()
    onDismiss()
  }

  const FirstComponent = useCallback(
    (props: ComparisonComponentProps) => {
      return (
        <SelectedTrader
          selectedTrader={props.firstTrader}
          timeOption={props.timeOption}
          handleSelectTrader={handleChangeFirstTrader}
        />
      )
    },
    [handleChangeFirstTrader]
  )
  const SecondComponent = useCallback(
    (props: ComparisonComponentProps) => {
      return (
        <SelectedTrader
          selectedTrader={props.secondTrader}
          timeOption={props.timeOption}
          handleSelectTrader={handleChangeSecondTrader}
        />
      )
    },
    [handleChangeSecondTrader]
  )

  const { lg } = useResponsive()

  if (!lg) return <></>

  return (
    <>
      <Drawer isOpen={isOpen} dangerouslyBypassFocusLock mode="bottom" size="calc(100vh - 80px)">
        <Flex bg="neutral7" height="100%" flexDirection="column">
          {/* Header */}
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              p: 3,
            }}
          >
            <Type.Body>
              <Trans>Traders Comparison in {timeOption.text}</Trans>
            </Type.Body>
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <Button variant="outline" onClick={handleClickReset} sx={{ height: 24, py: 0, px: 1 }}>
                Reset
              </Button>
              <Button variant="outline" onClick={onDismiss} sx={{ px: 0, py: 0, width: 24, height: 24 }}>
                <Box sx={{ mx: 'auto', width: '8px', height: '1px', bg: 'neutral3', verticalAlign: 'middle' }} />
              </Button>
            </Flex>
          </Flex>
          {/* Body */}
          <ComparisonComponent
            firstTrader={firstTrader}
            secondTrader={secondTrader}
            timeOption={timeOption}
            firstComponent={FirstComponent}
            secondComponent={SecondComponent}
          />
        </Flex>
      </Drawer>
    </>
  )
}
