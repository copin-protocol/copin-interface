import { BookOpenText, ChartLine, Icon, Pulse } from '@phosphor-icons/react'
import React from 'react'

import useTabHandler from 'hooks/router/useTabHandler'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { FOOTER_HEIGHT } from 'utils/config/constants'

import { LayoutProps } from './types'

enum TabEnum {
  STATS = 'stats',
  CHARTS = 'charts',
  POSITIONS = 'positions',
}

const TabButton = ({
  icon: TabIcon,
  title,
  isActive,
  onClick,
}: {
  icon: Icon
  title: string
  isActive: boolean
  onClick: () => void
}) => (
  <Flex role="button" onClick={onClick} width="fit-content" sx={{ gap: 2 }} justifyContent="center" alignItems="center">
    <IconBox color={isActive ? 'primary1' : 'neutral3'} icon={<TabIcon size={24} weight="fill" />}></IconBox>
    <Type.BodyBold color={isActive ? 'neutral1' : 'neutral3'}>{title}</Type.BodyBold>
  </Flex>
)

const MobileLayout = (props: LayoutProps) => {
  const { tab, handleTab: setTab } = useTabHandler(TabEnum.POSITIONS)
  return (
    <Box sx={{ position: 'relative', pb: 56 }}>
      <Box
        width="100%"
        height={56}
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
          position: 'sticky',
          top: 0,
          bg: 'neutral7',
          zIndex: 100,
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
          zIndex: 100,
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
          <Box mt={1} height="max(calc(100vh - 545px), 330px)" bg="neutral5">
            {props.traderChartPositions}
          </Box>
        </>
      )}
      {tab === TabEnum.POSITIONS && (
        <Flex flexDirection="column" height="100%">
          <Box
            minHeight={120}
            sx={{
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            {props.openingPositions}
          </Box>
          <Box sx={{ position: 'relative' }} flex="1">
            {props.closedPositions}
          </Box>
        </Flex>
      )}
      <Flex
        sx={{
          position: 'fixed',
          bottom: FOOTER_HEIGHT,
          width: '100%',
          height: 56,
          bg: 'neutral7',
          zIndex: 10,
          justifyContent: 'space-around',
          borderTop: 'small',
          borderColor: 'neutral4',
        }}
      >
        <TabButton
          icon={BookOpenText}
          title="Stats"
          isActive={tab === TabEnum.STATS}
          onClick={() => setTab(TabEnum.STATS)}
        />
        <TabButton
          icon={ChartLine}
          title="Charts"
          isActive={tab === TabEnum.CHARTS}
          onClick={() => setTab(TabEnum.CHARTS)}
        />
        <TabButton
          icon={Pulse}
          title="Positions"
          isActive={tab === TabEnum.POSITIONS}
          onClick={() => setTab(TabEnum.POSITIONS)}
        />
      </Flex>
    </Box>
  )
}

export default MobileLayout
