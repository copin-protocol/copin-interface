import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useState } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
// import CreateWalletAction from 'components/CreateWalletAction'
import { Box, Flex, Type } from 'theme/base'

import AssetDistribution from './AssetDistribution'
import DesktopLayout from './Layouts/DesktopLayout'
import MobileLayout from './Layouts/MobileLayout'
import TabletLayout from './Layouts/TabletLayout'
import WalletList from './WalletList'

export default function WalletManagement() {
  const { lg, xl } = useResponsive()
  const [hiddenBalance, hideBalance] = useState(true)

  let Layout = MobileLayout
  if (xl) {
    Layout = DesktopLayout
  } else if (lg) {
    Layout = TabletLayout
  }
  return (
    <>
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
            <Type.H5 lineHeight="24px" textAlign="left" sx={{ fontSize: ['18px', '18px', '24px'] }}>
              <Trans>Wallet Management</Trans>
            </Type.H5>
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
    </>
  )
}
