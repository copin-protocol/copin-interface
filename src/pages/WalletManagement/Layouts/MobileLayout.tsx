import { Trans } from '@lingui/macro'
import { ChartPie, Wallet } from '@phosphor-icons/react'
import React, { useState } from 'react'

import { BottomWrapperMobile } from 'pages/@layouts/Components'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'
import { PAGE_TITLE_HEIGHT, TAB_HEIGHT } from 'utils/config/constants'

import { LayoutProps } from './types'

enum TabEnum {
  WALLETS,
  ASSETS,
  CREATE,
}

const tabConfigs: TabConfig[] = [
  {
    name: <Trans>WALLETS</Trans>,
    key: TabEnum.WALLETS as unknown as string,
    icon: <Wallet size={20} />,
    activeIcon: <Wallet size={20} weight="fill" />,
  },
  {
    name: <Trans>ASSETS</Trans>,
    key: TabEnum.ASSETS as unknown as string,
    icon: <ChartPie size={20} />,
    activeIcon: <ChartPie size={20} weight="fill" />,
  },
]

const MobileLayout = ({ header, walletList, assetDistribution }: LayoutProps) => {
  const [tab, setTab] = useState(TabEnum.WALLETS)
  return (
    <Box sx={{ position: 'relative', pb: TAB_HEIGHT }}>
      <Box
        width="100%"
        height={PAGE_TITLE_HEIGHT}
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
      <Box
        sx={{
          position: 'fixed',
          bottom: TAB_HEIGHT,
          width: '100%',
          zIndex: 10,
          justifyContent: 'space-around',
          bg: 'neutral7',
        }}
      >
        <BottomWrapperMobile>
          <TabHeader
            onClickItem={(key) => setTab(key as unknown as TabEnum)}
            isActiveFn={(config: TabConfig) => config.key === (tab as unknown as string)}
            configs={tabConfigs}
            size="md"
          />
        </BottomWrapperMobile>
      </Box>
    </Box>
  )
}

export default MobileLayout
