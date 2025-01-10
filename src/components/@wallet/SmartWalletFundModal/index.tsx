import { Trans } from '@lingui/macro'
import { ArrowSquareDownLeft, ArrowSquareUpRight } from '@phosphor-icons/react'
import { useState } from 'react'

import useWalletFund from 'hooks/features/useWalletFundSnxV2'
import Modal from 'theme/Modal'
import { TabHeader } from 'theme/Tab'
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
      minHeight="300px"
      dismissable={false}
      hasClose
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={<Trans>Manage Fund</Trans>}
    >
      <Box px={3} pb={3}>
        <TabHeader
          configs={[
            {
              name: <Trans>DEPOSIT</Trans>,
              key: FundTab.Deposit,
              icon: <ArrowSquareDownLeft size={20} />,
            },
            {
              name: <Trans>WITHDRAW</Trans>,
              key: FundTab.Withdraw,
              icon: <ArrowSquareUpRight size={20} />,
            },
          ]}
          hasLine
          isActiveFn={(config) => config.key === tab}
          onClickItem={(key) => setTab(key as FundTab)}
          fullWidth
          size="md"
          sx={{ mb: 3 }}
        />
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
