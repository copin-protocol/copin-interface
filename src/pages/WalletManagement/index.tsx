import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import CreateWalletAction from 'components/CreateWalletAction'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useWalletMargin from 'hooks/features/useWalletMargin'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'

import AssetDistribution from './AssetDistribution'
import DesktopLayout from './Layouts/DesktopLayout'
import MobileLayout from './Layouts/MobileLayout'
import TabletLayout from './Layouts/TabletLayout'
import WalletList from './WalletList'
import YouMightNeed from './YouMightNeed'

export default function WalletManagement() {
  const { lg, xl } = useResponsive()

  let Layout = MobileLayout
  if (xl) {
    Layout = DesktopLayout
  } else if (lg) {
    Layout = TabletLayout
  }

  const { copyWallets } = useCopyWalletContext()

  const smartWallet = copyWallets?.find((w) => w.exchange === CopyTradePlatformEnum.SYNTHETIX)?.smartWalletAddress

  const { available, total, loading } = useWalletMargin({
    address: smartWallet,
    enabled: !!smartWallet,
    availableOnly: false,
  })

  console.log('available', available)
  console.log('total', total)
  console.log('loading', loading)

  return (
    <>
      <CustomPageTitle title={`Wallet Management`} />
      <Layout>
        {/* child 0 */}
        <Flex
          sx={{
            width: '100%',
            height: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          <Type.H5 px={3} lineHeight="24px" textAlign="left">
            <Trans>Wallet Management</Trans>
          </Type.H5>
        </Flex>

        {/* child 1 */}
        <Box
          display={['block', 'block', 'flex']}
          flexDirection="column"
          height={['auto', 'auto', 'auto', 'auto', '100%']}
        >
          <WalletList />
        </Box>

        {/* child 2 */}
        <Box display={['block', 'block', 'flex']} flexDirection="column" height="100%">
          <Flex flexDirection="column">
            <CreateWalletAction />
          </Flex>
          <YouMightNeed />
        </Box>

        {/* child 3 */}
        <></>

        {/* child 4 */}
        <div>{/* {!!_address && <ActivityHeatmap account={_address} />} */}</div>

        {/* child 5 */}
        <Box>
          <AssetDistribution />
        </Box>
      </Layout>
    </>
  )
}
