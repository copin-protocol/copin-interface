import { ChartPie, Icon, PlusSquare, Wallet } from '@phosphor-icons/react'
import React, { useState } from 'react'

import { Box, Flex, IconBox, Type } from 'theme/base'
import { FOOTER_HEIGHT } from 'utils/config/constants'

import { LayoutProps } from './types'

enum TabEnum {
  WALLETS,
  ASSETS,
  CREATE,
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
    <Type.BodyBold color={isActive ? 'primary1' : 'neutral3'}>{title}</Type.BodyBold>
  </Flex>
)

const MobileLayout = ({ header, walletList, assetDistribution }: LayoutProps) => {
  const [tab, setTab] = useState(TabEnum.WALLETS)
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
        {header}
      </Box>

      {tab === TabEnum.WALLETS && walletList}

      {tab === TabEnum.ASSETS && (
        <Flex flexDirection="column" height="600px">
          {assetDistribution}
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
          icon={Wallet}
          title="Wallets"
          isActive={tab === TabEnum.WALLETS}
          onClick={() => setTab(TabEnum.WALLETS)}
        />
        <TabButton
          icon={ChartPie}
          title="Assets"
          isActive={tab === TabEnum.ASSETS}
          onClick={() => setTab(TabEnum.ASSETS)}
        />
        {/* <TabButton
          icon={PlusSquare}
          title="Create"
          isActive={tab === TabEnum.CREATE}
          onClick={() => setTab(TabEnum.CREATE)}
        /> */}
      </Flex>
    </Box>
  )
}

export default MobileLayout
