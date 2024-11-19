import { useResponsive } from 'ahooks'

import { CopyTradePlatformEnum } from 'utils/config/enums'

import CheckingWalletRenderer, { CreateTypeWalletEnum } from '../CheckingWalletRenderer'
import OpeningPositions from '../OpeningPositions'
import BalanceMenu from './BalanceMenu'
import ManagementLayoutDesktop from './Layouts/ManagementLayoutDesktop'
import ManagementLayoutMobile from './Layouts/ManagementLayoutMobile'
import ListCEXCopyTrades from './ListCEXCopyTrades'
import Stats from './Stats'
import useCEXManagementContext, { CEXManagementProvider } from './useCEXManagementContext'

export default function CEXManagement() {
  return (
    <CEXManagementProvider>
      <CEXManagementComponent />
    </CEXManagementProvider>
  )
}
export function CEXManagementComponent() {
  const { activeWallet, cexWallets, isLoadingCopyWallets } = useCEXManagementContext()
  const { lg } = useResponsive()
  const ManagementLayout = lg ? ManagementLayoutDesktop : ManagementLayoutMobile
  // const [expandedTable, setExpandedTable] = useState(
  //   sessionStorage.getItem(STORAGE_KEYS.USER_DCP_MANAGEMENT_EXPANDED) === '1'
  // )
  // useEffect(() => {
  //   sessionStorage.setItem(STORAGE_KEYS.USER_DCP_MANAGEMENT_EXPANDED, expandedTable ? '1' : '0')
  // }, [expandedTable])
  return (
    <CheckingWalletRenderer
      loadingCopyWallets={isLoadingCopyWallets}
      copyWallets={cexWallets}
      type={CreateTypeWalletEnum.CEX}
    >
      <ManagementLayout
        balanceMenu={<BalanceMenu />}
        mainSection={<ListCEXCopyTrades expanded={false} />}
        positionsTable={<OpeningPositions activeWallet={activeWallet} copyWallets={cexWallets} />}
        stats={
          <Stats exchange={activeWallet?.exchange ?? CopyTradePlatformEnum.BINGX} copyWalletId={activeWallet?.id} />
        }
      />
    </CheckingWalletRenderer>
  )
}
