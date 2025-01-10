import { Trans } from '@lingui/macro'
import { BookOpenText, ChartLine, Notebook } from '@phosphor-icons/react'
import React from 'react'

import useTabHandler from 'hooks/router/useTabHandler'
import { BottomWrapperMobile } from 'pages/@layouts/Components'
import { TabHeader } from 'theme/Tab'
import { Box } from 'theme/base'

import PositionMobileView from './PositionMobileView'
import { LayoutProps } from './types'

enum TabEnum {
  STATS = 'stats',
  CHARTS = 'charts',
  POSITIONS = 'positions',
}

const tabConfigs = [
  {
    key: TabEnum.STATS,
    name: <Trans>Stats</Trans>,
    icon: <BookOpenText size={20} />,
    activeIcon: <BookOpenText size={20} weight="fill" />,
  },
  {
    key: TabEnum.CHARTS,
    name: <Trans>Charts</Trans>,
    icon: <ChartLine size={20} />,
    activeIcon: <ChartLine size={20} weight="fill" />,
  },
  {
    key: TabEnum.POSITIONS,
    name: <Trans>Positions</Trans>,
    icon: <Notebook size={20} />,
    activeIcon: <Notebook size={20} weight="fill" />,
  },
]

const MobileLayout = (props: LayoutProps) => {
  const { tab, handleTab: setTab } = useTabHandler(TabEnum.POSITIONS)
  return (
    <Box sx={{ position: 'relative', pb: 56, height: '100%' }}>
      <Box
        width="100%"
        height={56}
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
          position: 'sticky',
          top: 0,
          bg: 'neutral7',
          zIndex: 99,
        }}
      >
        {props.protocolStats}
      </Box>
      <Box
        width="100%"
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
          position: 'sticky',
          top: 56,
          bg: 'neutral7',
          zIndex: 98,
        }}
      >
        {props.traderInfo}
      </Box>
      {tab === TabEnum.STATS && (
        <Box height="100%">
          <Box
            sx={{
              height: 350,
              overflow: 'hidden',
              bg: 'neutral5',
            }}
          >
            {props.traderChartPnl}
          </Box>
          <Box overflow="auto" flex="1 0 0" sx={{ position: 'relative' }}>
            <Box height="100%">{props.traderStats}</Box>
          </Box>
        </Box>
      )}
      {tab === TabEnum.CHARTS && (
        <>
          <Box
            height={270}
            sx={{
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            {props.traderRanking}
          </Box>
          <Box mt={1} height="max(calc(100vh - 486px), 330px)" bg="neutral5">
            {props.traderChartPositions}
          </Box>
        </>
      )}
      {tab === TabEnum.POSITIONS && (
        <Box height={`calc(100% - 58px)`}>
          <PositionMobileView openingPositions={props.openingPositions} historyPositions={props.closedPositions} />
        </Box>
      )}
      <BottomWrapperMobile sx={{ position: 'fixed', bottom: 0, zIndex: 9999 }}>
        <TabHeader
          configs={tabConfigs}
          isActiveFn={(config) => config.key === tab}
          onClickItem={(key) => setTab(key as TabEnum)}
        />
      </BottomWrapperMobile>
    </Box>
  )
}

export default MobileLayout
