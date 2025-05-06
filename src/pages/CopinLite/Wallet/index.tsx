import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useEffect } from 'react'

import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useSearchParams from 'hooks/router/useSearchParams'
import useTabHandler from 'hooks/router/useTabHandler'
import Loading from 'theme/Loading'
import Tabs, { TabPane } from 'theme/Tab'
import { Box } from 'theme/base'

import LiteDepositsAndWithdrawals from '../Transactions/DepositsAndWithdrawals'
import LiteBalance from './Balance'
import ContactLink from './ContactLink'
import LiteDeposit from './Deposit'
import LiteWithdraw from './Withdraw'

export enum LiteWalletTab {
  Deposit = 'deposit',
  Withdraw = 'withdraw',
  History = 'history',
}

const LiteWallet = () => {
  const { searchParams, setSearchParams } = useSearchParams()
  const { embeddedWallet, embeddedWalletInfo, loadingEmbeddedWallets } = useCopyWalletContext()
  const { tab, handleTab: setTab } = useTabHandler({ defaultTab: LiteWalletTab.Deposit, tabKey: 'wallet' })
  const { lg } = useResponsive()

  const address = embeddedWallet?.hyperliquid?.embeddedWallet
  const balance = embeddedWalletInfo ? Number(embeddedWalletInfo.marginSummary.accountValue) : undefined

  useEffect(() => {
    if (lg && tab === LiteWalletTab.History) {
      setTab({ tab: LiteWalletTab.Deposit })
    }
  }, [lg, tab])

  // TODO: Rescusive not having wallet button

  const renderDepositTab = () => {
    if (!address) return <div></div>
    return (
      <TabPane size="lg" key={LiteWalletTab.Deposit} tab={<Trans>Deposit</Trans>} sx={{ py: 0 }}>
        <LiteBalance address={address} balance={balance} />
        <LiteDeposit address={address} />
      </TabPane>
    )
  }

  const renderWithdrawTab = () => {
    if (!address) return <div></div>
    return (
      <TabPane size="lg" key={LiteWalletTab.Withdraw} tab={<Trans>Withdraw</Trans>}>
        <LiteBalance address={address} balance={balance} />
        <LiteWithdraw address={address} />
      </TabPane>
    )
  }

  const renderHistoryTab = () => {
    return (
      <TabPane size="lg" key={LiteWalletTab.History} tab={<Trans>History</Trans>}>
        <LiteDepositsAndWithdrawals currentTab={tab} />
      </TabPane>
    )
  }

  return (
    <Box
      width={['100%', '100%', '100%', 350, 400]}
      height="100%"
      bg={['neutral7', 'neutral7', 'neutral7', 'neutral5']}
      sx={{ overflow: 'hidden', borderRight: 'small', borderColor: 'neutral4' }}
    >
      {loadingEmbeddedWallets ? (
        <Loading />
      ) : !!address ? (
        <Tabs
          sx={{
            width: '100%',
            height: 'calc(100% - 36px)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          tabPanelSx={{
            height: 'calc(100% - 44px)',
            overflow: 'hidden auto',
            py: 0,
          }}
          size={lg ? 'lg' : 'md'}
          defaultActiveKey={tab}
          hasOverlay={false}
          onChange={(tab) => setTab({ tab })}
          tabItemSx={{ width: '100%' }}
        >
          {lg
            ? [renderDepositTab(), renderWithdrawTab()]
            : [renderDepositTab(), renderWithdrawTab(), renderHistoryTab()]}
        </Tabs>
      ) : (
        <div></div>
        // <Flex
        //   flexDirection="column"
        //   justifyContent="center"
        //   alignItems="center"
        //   textAlign="center"
        //   p={4}
        //   height="100%"
        //   sx={{ gap: 3 }}
        // >
        //   <Image src={walletImg} height={60} />
        //   <Type.BodyBold>
        //     <Trans>Create a wallet to start copy trading</Trans>
        //   </Type.BodyBold>
        //   <Button variant="primary" block>
        //     <Trans>Generate</Trans>
        //   </Button>
        // </Flex>
      )}
      <ContactLink />
    </Box>
  )
}

export default LiteWallet
