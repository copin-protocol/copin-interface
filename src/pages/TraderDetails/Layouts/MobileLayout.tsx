import { Trans } from '@lingui/macro'
import { BookOpenText, ChartLine, Notebook } from '@phosphor-icons/react'
import React from 'react'

import useTabHandler from 'hooks/router/useTabHandler'
import { BottomWrapperMobile } from 'pages/@layouts/Components'
import { TabHeader } from 'theme/Tab'
import { Box } from 'theme/base'
import { FOOTER_HEIGHT } from 'utils/config/constants'

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

const BODY_HEIGHT = `calc(100% - 56px - 57px)` // - protocolStats height 56px - traderInfo height 57px

const MobileLayout = (props: LayoutProps) => {
  const { tab, handleTab: setTab } = useTabHandler(TabEnum.POSITIONS)
  return (
    <Box sx={{ position: 'relative', pb: FOOTER_HEIGHT, height: '100%' }}>
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
        <Box height={BODY_HEIGHT} sx={{ overflow: 'auto' }}>
          <Box
            sx={{
              height: 350,
              overflow: 'hidden',
              bg: 'neutral5',
            }}
          >
            {props.traderChartPnl}
          </Box>
          <Box sx={{ position: 'relative' }}>
            <Box>{props.traderStats}</Box>
          </Box>
        </Box>
      )}
      {tab === TabEnum.CHARTS && (
        <Box height={BODY_HEIGHT} sx={{ overflow: 'auto' }}>
          <Box
            height={270}
            sx={{
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            {props.traderRanking}
          </Box>
          <Box mt={1} height="max(calc(100% - 270px), 330px)" bg="neutral5">
            {props.traderChartPositions}
          </Box>
        </Box>
      )}
      {tab === TabEnum.POSITIONS && (
        <Box height={BODY_HEIGHT}>
          <PositionMobileView openingPositions={props.openingPositions} historyPositions={props.closedPositions} />
        </Box>
      )}
      <BottomWrapperMobile
        sx={{ position: 'fixed', bottom: FOOTER_HEIGHT, zIndex: 9999, display: ['flex', 'flex', 'flex', 'none'] }}
      >
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
