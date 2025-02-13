import { useQuery } from 'react-query'

import { getMyCopyTradeOverviewApi } from 'apis/copyTradeApis'
import SelectCopyWallet from 'components/@copyTrade/SelectCopyWallet'
import Logo from 'components/@ui/Logo'
import Num from 'entities/Num'
import { CopyWalletData } from 'entities/copyWallet'
import { Flex, IconBox } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { hideScrollbar } from 'utils/helpers/css'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { getCopyTradePlatformProtocol } from 'utils/web3/dcp'

import WalletStatisticOverview, { WalletStatisticOverviewItem } from './WaletStatisticOverview'

export default function BalanceMenu({
  copyWallets,
  activeWallet,
  onChangeKey,
  balance,
}: {
  copyWallets: CopyWalletData[] | undefined
  activeWallet: CopyWalletData | null
  onChangeKey: (key: CopyWalletData | null) => void
  balance: Num | null
}) {
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

  if (!copyWallets) return <></>
  return (
    <Flex
      sx={{
        flexWrap: 'nowrap',
        gap: [0, 24],
        alignItems: ['start', 'start', 'center'],
        justifyContent: ['start', 'start', 'space-between'],
      }}
      height={40}
    >
      <Flex
        flexDirection={['column', 'row']}
        alignItems={['flex-start', 'center']}
        sx={{ pl: 3, pr: 2, gap: 1, width: ['75%', 'max-content'], borderRight: 'small', borderRightColor: 'neutral4' }}
      >
        <SelectCopyWallet currentWallet={activeWallet} onChangeWallet={onChangeKey} wallets={copyWallets} />
        {/* {activeWallet && CEX_EXCHANGES.includes(activeWallet.exchange) && (
          <ReferralStatus data={activeWallet} sx={{ minWidth: 80 }} />
        )} */}
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
          px: [0, 0, 0, 0, 3],
          gap: [0, 24, 24, 24, 40],
          alignItems: 'center',
          overflow: 'auto',
          ...hideScrollbar(),
        }}
      >
        <WalletStatisticOverviewItem
          title={'Balance'}
          value={balance ? balance.num : overview?.balance}
          prefix="$"
          withHideAction
        />
        <WalletStatisticOverview activeWallet={activeWallet} />
      </Flex>
    </Flex>
  )
}
