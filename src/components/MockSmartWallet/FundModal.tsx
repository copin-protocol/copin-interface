import { JsonRpcProvider } from '@ethersproject/providers'
import { useState } from 'react'

import Modal from 'theme/Modal'
import Tabs, { TabPane } from 'theme/Tab'
import { Box } from 'theme/base'
import { Account } from 'utils/web3/types'

import BridgeAndSwap from './BridgeAndSwap'
import Deposit from './Deposit'

enum FundTab {
  Deposit = 'Deposit',
  BridgeSwap = 'BridgeSwap',
}

const FundModal = ({
  isOpen,
  account,
  smartAccount,
  chainId,
  defaultChainProvider,
  onDismiss,
}: {
  isOpen: boolean
  account: Account
  smartAccount: string
  chainId: number
  defaultChainProvider: JsonRpcProvider
  onDismiss: () => void
}) => {
  const [tab, setTab] = useState<string>(FundTab.BridgeSwap)

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={
        <Tabs defaultActiveKey={tab} onChange={(tab) => setTab(tab)} headerSx={{ marginBottom: 0 }}>
          <TabPane key={FundTab.Deposit} tab="Deposit">
            <></>
          </TabPane>
          <TabPane key={FundTab.BridgeSwap} tab="Bridge & Swap">
            <></>
          </TabPane>
        </Tabs>
      }
    >
      <Box p={3}>
        {tab === FundTab.Deposit && <Deposit smartAccount={smartAccount} account={account} chainId={chainId} />}
        {tab === FundTab.BridgeSwap && <BridgeAndSwap defaultChainProvider={defaultChainProvider} />}
      </Box>
    </Modal>
  )
}

export default FundModal
