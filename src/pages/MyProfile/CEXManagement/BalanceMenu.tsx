import { useQuery } from 'react-query'

import { getMyCopyTradeOverviewApi } from 'apis/copyTradeApis'
import Logo from 'components/@ui/Logo'
import ReferralStatus from 'components/@wallet/WalletReferralStatus'
import { Flex, IconBox } from 'theme/base'
import { CEX_EXCHANGES } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { hideScrollbar } from 'utils/helpers/css'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { getCopyTradePlatformProtocol } from 'utils/web3/dcp'

import SelectSingleWallet from '../SelectSingleWallet'
import WalletStatisticOverview, { WalletStatisticOverviewItem } from '../WaletStatisticOverview'
import useCEXManagementContext from './useCEXManagementContext'

export default function BalanceMenu() {
  const { activeWallet, cexWallets, handleChangeActiveWallet } = useCEXManagementContext()
  const { data: overview } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_BALANCE_OVERVIEW, activeWallet],
    () =>
      getMyCopyTradeOverviewApi({
        exchange: activeWallet?.exchange ?? CopyTradePlatformEnum.BINGX,
        copyWalletId: activeWallet?.id,
      }),
    {
      enabled: !!activeWallet,
    }
  )

  if (!cexWallets) return <></>
  return (
    <Flex
      sx={{
        flexWrap: 'nowrap',
        gap: [0, 24],
        alignItems: ['start', 'start', 'center'],
        justifyContent: ['start', 'start', 'space-between'],
      }}
      py={[1, 12]}
    >
      <Flex
        flexDirection={['column', 'row']}
        alignItems={['flex-start', 'center']}
        sx={{ pl: 3, pr: 2, gap: 1, width: ['75%', 'max-content'], borderRight: 'small', borderRightColor: 'neutral4' }}
      >
        <SelectSingleWallet
          currentWallet={activeWallet}
          onChangeWallet={handleChangeActiveWallet}
          wallets={cexWallets}
        />
        {activeWallet && CEX_EXCHANGES.includes(activeWallet.exchange) && (
          <ReferralStatus data={activeWallet} sx={{ minWidth: 80 }} />
        )}
        {activeWallet &&
          activeWallet.exchange === CopyTradePlatformEnum.GNS_V8 &&
          !!activeWallet.smartWalletAddress && (
            <IconBox
              as={'a'}
              href={generateTraderDetailsRoute(
                getCopyTradePlatformProtocol(activeWallet.exchange),
                activeWallet.smartWalletAddress
              )}
              target="_blank"
              icon={<Logo size={16} />}
            />
          )}
      </Flex>
      <Flex
        width={{ _: '100%', sm: 'auto' }}
        height="100%"
        sx={{
          px: [3, 0, 0, 0, 3],
          gap: [3, 24, 24, 24, 40],
          alignItems: 'center',
          overflow: 'auto',
          ...hideScrollbar(),
        }}
      >
        <WalletStatisticOverviewItem title={'Balance'} value={overview?.balance} prefix="$" withHideAction />
        <WalletStatisticOverview activeWallet={activeWallet} />
      </Flex>
    </Flex>
  )
}
