import { BookOpenText, Icon, Pulse } from '@phosphor-icons/react'
import React, { useState } from 'react'

import { Box, Flex, IconBox, Type } from 'theme/base'
import { FOOTER_HEIGHT } from 'utils/config/constants'

enum TabEnum {
  INFOMATION,
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

const MobileLayout = ({ children }: { children: JSX.Element[] }) => {
  const [tab, setTab] = useState(TabEnum.INFOMATION)
  return (
    <Box sx={{ position: 'relative', pb: 120 }}>
      <Box
        width="100%"
        height={60}
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
      <Box
        px={12}
        pb={12}
        pt={1}
        sx={{
          borderTop: 'small',
          width: '100%',
          borderColor: 'neutral4',
          position: 'fixed',
          bottom: 56 + FOOTER_HEIGHT,
          bg: 'neutral7',
          zIndex: 100,
        }}
      >
        {children[1]}
      </Box>
      {tab === TabEnum.INFOMATION && (
        <>
          {children[2]}
          {children[3]}
        </>
      )}

      {tab === TabEnum.POSITIONS && children[4]}
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
          isActive={tab === TabEnum.INFOMATION}
          onClick={() => setTab(TabEnum.INFOMATION)}
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
