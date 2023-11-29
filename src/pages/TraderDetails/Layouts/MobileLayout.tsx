import { BookOpenText, ChartLine, Icon, Pulse } from '@phosphor-icons/react'
import React, { useState } from 'react'

import { Box, Flex, IconBox, Type } from 'theme/base'
import { FOOTER_HEIGHT } from 'utils/config/constants'

import { LayoutProps } from './types'

enum TabEnum {
  STATS,
  CHARTS,
  POSITIONS,
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
    <IconBox color={isActive ? 'primary1' : 'neutral3'} icon={<TabIcon size={24} />}></IconBox>
    <Type.BodyBold color={isActive ? 'neutral1' : 'neutral3'}>{title}</Type.BodyBold>
  </Flex>
)

const MobileLayout = ({ children }: LayoutProps) => {
  const [tab, setTab] = useState(TabEnum.STATS)
  return (
    <Box sx={{ position: 'relative', pb: 96 }}>
      <Box
        width="100%"
        height={72}
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
          position: 'sticky',
          top: 0,
          bg: 'neutral7',
          zIndex: 100,
        }}
      >
        {children[0]}
      </Box>
      {/* <Box
        display={tab === TabEnum.POSITIONS ? 'none' : 'block'}
        px={12}
        pb={12}
        pt={1}
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral4',
        }}
      >
        {children[1]}
      </Box> */}
      {tab === TabEnum.STATS && children[1]}
      {tab === TabEnum.CHARTS && (
        <>
          <Box
            height="300px"
            sx={{
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            {children[2]}
          </Box>
          <Box height="max(calc(100vh - 580px), 330px)">{children[3]}</Box>
          {/* <Box
            p={12}
            sx={{
              borderTop: 'small',
              borderColor: 'neutral4',
            }}
          >
            {children[4]}
          </Box> */}
        </>
      )}

      {tab === TabEnum.POSITIONS && (
        <Flex flexDirection="column" height="100%">
          <Box
            minHeight={261}
            sx={{
              borderBottom: 'small',
              borderColor: 'neutral4',
            }}
          >
            {children[5]}
          </Box>
          <Box sx={{ position: 'relative' }} flex="1">
            {children[6]}
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
          icon={Pulse}
          title="Positions"
          isActive={tab === TabEnum.POSITIONS}
          onClick={() => setTab(TabEnum.POSITIONS)}
        />
        <TabButton
          icon={ChartLine}
          title="Charts"
          isActive={tab === TabEnum.CHARTS}
          onClick={() => setTab(TabEnum.CHARTS)}
        />
      </Flex>
    </Box>
  )
}

export default MobileLayout
