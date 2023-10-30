import { Trans } from '@lingui/macro'
import { ArrowSquareDownLeft, ArrowSquareUpRight, Swap } from '@phosphor-icons/react'
import { useState } from 'react'

import Modal from 'theme/Modal'
import Tabs, { TabPane } from 'theme/Tab'
import IconTabItem from 'theme/Tab/IconTabItem'
import { Box } from 'theme/base'

import BridgeAndSwap from './BridgeAndSwap'
import Deposit from './Deposit'
import Withdraw from './Withdraw'

export enum FundTab {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  BridgeSwap = 'BridgeSwap',
}

const FundModal = ({
  isOpen = true,
  initialTab = FundTab.Deposit,
  smartAccount,
  onDismiss,
}: {
  isOpen?: boolean
  initialTab?: FundTab
  smartAccount: string
  onDismiss: () => void
}) => {
  const [tab, setTab] = useState<string>(initialTab)

  return (
    <Modal
      maxWidth="510px"
      dismissable={false}
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={
        <Tabs
          defaultActiveKey={tab}
          onChange={(tab) => setTab(tab)}
          sx={{
            width: '100%',
          }}
          headerSx={{ marginBottom: 0, gap: 0, width: '100%' }}
          tabItemSx={{
            pt: 0,
          }}
        >
          <TabPane
            key={FundTab.Deposit}
            tab={
              <IconTabItem
                icon={<ArrowSquareDownLeft size={24} weight={tab === FundTab.Deposit ? 'fill' : 'regular'} />}
                text={<Trans>Deposit</Trans>}
                active={tab === FundTab.Deposit}
              />
            }
          >
            <></>
          </TabPane>
          <TabPane
            key={FundTab.Withdraw}
            tab={
              <IconTabItem
                icon={<ArrowSquareUpRight size={24} weight={tab === FundTab.Withdraw ? 'fill' : 'regular'} />}
                text={<Trans>Withdraw</Trans>}
                active={tab === FundTab.Withdraw}
              />
            }
          >
            <></>
          </TabPane>
          <TabPane
            key={FundTab.BridgeSwap}
            tab={
              <IconTabItem
                icon={<Swap size={24} weight={tab === FundTab.BridgeSwap ? 'fill' : 'regular'} />}
                text={<Trans>Swap</Trans>}
                active={tab === FundTab.BridgeSwap}
              />
            }
          >
            <></>
          </TabPane>
        </Tabs>
      }
    >
      <Box px={3} pb={3}>
        {tab === FundTab.Deposit && <Deposit smartAccount={smartAccount} onDismiss={onDismiss} />}
        {tab === FundTab.Withdraw && <Withdraw smartAccount={smartAccount} onDismiss={onDismiss} />}
        {tab === FundTab.BridgeSwap && <BridgeAndSwap />}
      </Box>
    </Modal>
  )
}

export default FundModal
