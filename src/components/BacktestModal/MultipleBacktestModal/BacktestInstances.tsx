import { useRef } from 'react'

import { WarningType } from 'components/BacktestModal/WarningModal'
import useBacktestWarningModal from 'hooks/store/useBacktestWarningModal'
import { useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'
import { Button } from 'theme/Buttons'
import RcDrawer from 'theme/RcDrawer'
import { Box, Flex } from 'theme/base'

import HomeSelectedTable from './SelectedTable'
import SettingsAndResult from './SettingsAndResult'
import TabHeader from './TabHeader'

export default function BacktestInstances() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { isFocusBacktest, toggleFocusBacktest, resetStore, getCommonData, currentHomeInstanceId } =
    useSelectBacktestTraders()
  const { openModal, dismissModal } = useBacktestWarningModal()
  const handleClickReset = () => {
    openModal({
      type: WarningType.CLEAR_GROUP,
      confirmFunction: () => {
        resetStore()
        dismissModal()
      },
    })
  }

  const { homeInstance: currentHomeInstance } = getCommonData({ homeId: currentHomeInstanceId })
  if (!currentHomeInstance) return <></>

  const currentBacktestInstanceId = currentHomeInstance.currentBacktestInstanceId
  const currentBacktestInstance = currentHomeInstance.backtestInstancesMapping[currentBacktestInstanceId ?? '']

  return (
    <RcDrawer open={isFocusBacktest} placement="bottom" height="calc(100vh - 80px)">
      <Flex bg="neutral7" height="100%" flexDirection="column">
        {/* Header */}
        <Flex
          className="backtest_drawer_header"
          sx={{
            width: '100%',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: 3,
            p: 2,
            pb: 0,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <TabHeader />
          </Box>
          <Button mb={3} variant="outline" onClick={handleClickReset} sx={{ height: 24, py: 0, px: 1 }}>
            Reset
          </Button>
          <Button
            mb={3}
            variant="outline"
            onClick={() => toggleFocusBacktest()}
            sx={{ px: 0, py: 0, width: 24, height: 24 }}
          >
            <Box sx={{ mx: 'auto', width: '8px', height: '1px', bg: 'neutral3', verticalAlign: 'middle' }} />
          </Button>
        </Flex>
        {/* Body */}
        <Box
          className="backtest_drawer_body"
          flex="1 1 0"
          sx={{ overflow: 'hidden' }}
          bg={currentBacktestInstanceId ? 'neutral5' : 'transparent'}
          ref={scrollRef}
        >
          <Box sx={{ height: '100%' }}>
            {!currentBacktestInstanceId ? (
              <HomeSelectedTable scrollRef={scrollRef} />
            ) : (
              <SettingsAndResult data={currentBacktestInstance} />
            )}
          </Box>
        </Box>
      </Flex>
    </RcDrawer>
  )
}
