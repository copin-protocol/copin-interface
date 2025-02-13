import { Trans } from '@lingui/macro'
import { Wallet } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useState } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import PageTitle from 'theme/PageTitle'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
// import CreateWalletAction from 'components/CreateWalletAction'
import { Box, Flex } from 'theme/base'

import AssetDistribution from './AssetDistribution'
import DesktopLayout from './Layouts/DesktopLayout'
import MobileLayout from './Layouts/MobileLayout'
import TabletLayout from './Layouts/TabletLayout'
import WalletList from './WalletList'

export default function WalletManagementPage() {
  const { lg, xl } = useResponsive()
  const [hiddenBalance, hideBalance] = useState(true)

  let Layout = MobileLayout
  if (xl) {
    Layout = DesktopLayout
  } else if (lg) {
    Layout = TabletLayout
  }
  return (
    <SafeComponentWrapper>
      <CustomPageTitle title={`Wallet Management`} />
      <Layout
        header={
          <Flex
            sx={{
              width: '100%',
              height: '100%',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              columnGap: [2, 3],
              rowGap: 1,
              px: 3,
            }}
          >
            <PageTitle title={<Trans>Wallet Management</Trans>} icon={Wallet} />
            <SwitchInputField
              switchLabel="Hide/Show Balance"
              checked={!hiddenBalance}
              onChange={() => hideBalance(!hiddenBalance)}
              wrapperSx={{ '*': { fontWeight: 400 } }}
            />
          </Flex>
        }
        walletList={
          <Box height={['auto', 'auto', 'auto', 'auto', '100%']}>
            <WalletList hiddenBalance={hiddenBalance} />
          </Box>
        }
        assetDistribution={
          <Box width="100%" height="100%" overflow="hidden">
            <AssetDistribution hiddenBalance={hiddenBalance} />
          </Box>
        }
      />
    </SafeComponentWrapper>
  )
}
