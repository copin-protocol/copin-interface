import { Trans } from '@lingui/macro'
import { ArrowSquareDownLeft, ArrowSquareUpRight } from '@phosphor-icons/react'
import { useState } from 'react'

import useWalletFund from 'hooks/features/useWalletFundSnxV2'
import Modal from 'theme/Modal'
import Tabs, { TabPane } from 'theme/Tab'
import IconTabItem from 'theme/Tab/IconTabItem'
import { Box } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'

// import BridgeAndSwap from './BridgeAndSwap'
import Deposit from './Deposit'
import Withdraw from './Withdraw'

// const SocketBridge = lazy(() => import('./SocketBridge'))

export enum FundTab {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  BridgeSwap = 'BridgeSwap',
}

const FundModal = ({
  isOpen = true,
  initialTab = FundTab.Deposit,
  smartWallet,
  platform,
  onDismiss,
}: {
  isOpen?: boolean
  initialTab?: FundTab
  smartWallet: string
  platform: CopyTradePlatformEnum
  onDismiss: () => void
}) => {
  const [tab, setTab] = useState<string>(initialTab)
  const smartWalletFund = useWalletFund({ address: smartWallet, platform })

  return (
    <Modal
      maxWidth="510px"
      minHeight="320px"
      dismissable={false}
      hasClose
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={<Trans>Manage Fund</Trans>}
    >
      <Box px={3} pb={3}>
        <Tabs
          defaultActiveKey={tab}
          onChange={(tab) => setTab(tab)}
          sx={{
            width: '100%',
          }}
          headerSx={{ marginBottom: 0, gap: 0, width: '100%', mb: 3, px: 0 }}
          tabItemSx={{
            pt: 0,
            px: 24,
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
          {/* {DEFAULT_CHAIN_ID === OPTIMISM_MAINNET ? (
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
          ) : (
            <></>
          )} */}
        </Tabs>
        {tab === FundTab.Deposit && (
          <Deposit
            smartWallet={smartWallet}
            smartWalletFund={smartWalletFund}
            platform={platform}
            onDismiss={onDismiss}
          />
        )}
        {tab === FundTab.Withdraw && (
          <Withdraw
            smartWallet={smartWallet}
            smartWalletFund={smartWalletFund}
            platform={platform}
            onDismiss={onDismiss}
          />
        )}
        {/* {DEFAULT_CHAIN_ID === OPTIMISM_MAINNET && (
          <div
            style={{
              display: tab === FundTab.BridgeSwap ? 'block' : 'none',
            }}
          >
            {NETWORK === 'mainnet' ? (
              <Suspense fallback={<Loading />}>
                <SocketBridge />
              </Suspense>
            ) : (
              <BridgeAndSwap />
            )}
          </div>
        )} */}
      </Box>
    </Modal>
  )
}

export default FundModal
