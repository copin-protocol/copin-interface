import { ClockCounterClockwise, SubtractSquare, Users } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import useTabHandler from 'hooks/router/useTabHandler'
import Tabs, { TabPane } from 'theme/Tab'
import { Box, Flex } from 'theme/base'

import ManagementLayoutDesktop from './ManagementLayoutDesktop'
import ManagementLayoutMobile from './ManagementLayoutMobile'
import { LayoutComponents } from './types'

export enum TabKeyEnum {
  Management = 'management',
  History = 'history',
  Referral = 'referral',
}

export default function Layout(components: LayoutComponents) {
  const { tab, handleTab } = useTabHandler(TabKeyEnum.Management)
  const { lg } = useResponsive()
  const ManagementLayout = lg ? ManagementLayoutDesktop : ManagementLayoutMobile
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Tabs
        defaultActiveKey={tab}
        onChange={handleTab}
        fullWidth
        headerSx={{ borderBottom: 'small', borderColor: 'neutral4', px: 16, width: '100%', mb: 0 }}
        tabItemSx={{
          flex: [1, 1, '0 0 auto'],
          pb: 10,
          fontSize: 16,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <TabPane
          tab={
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <SubtractSquare size={24} />
              <Box as="span">MANAGEMENT</Box>
            </Flex>
          }
          key={TabKeyEnum.Management}
        >
          <div></div>
        </TabPane>
        <TabPane
          tab={
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <ClockCounterClockwise size={24} />
              <Box as="span">HISTORY</Box>
            </Flex>
          }
          key={TabKeyEnum.History}
        >
          <div></div>
        </TabPane>
        <TabPane
          tab={
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <Users size={24} />
              <Box as="span">REFERRAL</Box>
            </Flex>
          }
          key={TabKeyEnum.Referral}
        >
          <div></div>
        </TabPane>
      </Tabs>
      <Box sx={{ overflow: 'hidden', flexBasis: 0, flexGrow: 1 }}>
        {tab === TabKeyEnum.Management && <ManagementLayout {...components} />}
        {tab === TabKeyEnum.History && components.historyTable}
        {tab === TabKeyEnum.Referral && components.referral}
      </Box>
    </Flex>
  )
}
