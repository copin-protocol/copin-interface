import { useEffect, useState } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { CopyWalletData } from 'entities/copyWallet'
import useMyProfileStore from 'hooks/store/useMyProfile'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'

import useCopyWalletContext from '../WalletManagement/useCopyWalletContext'
import BalanceMenu from './BalanceMenu'
import HistoryPositions from './HistoryPositions'
import Layout from './Layouts/Layout'
import MainSection from './MainSection'
import OpeningPosition from './OpeningPositions'
import Referral from './Referral'
import Stats from './Stats'

export default function MyProfile() {
  const { copyWallets, loadingCopyWallets } = useCopyWalletContext()
  const [activeWallet, setActiveWallet] = useState<CopyWalletData | null>(null)
  useEffect(() => {
    if (!copyWallets?.length || loadingCopyWallets || !!activeWallet) return
    const storedKey = sessionStorage.getItem(STORAGE_KEYS.MY_COPY_WALLET)
    const walletStored = storedKey ? (JSON.parse(storedKey) as CopyWalletData) : null
    setActiveWallet((prev) => {
      if (!!prev) return prev
      if (!!walletStored && copyWallets.some((data) => data.id === walletStored.id)) {
        return walletStored
      }
      return copyWallets[0]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingCopyWallets])

  useEffect(() => {
    if (!activeWallet) return
    sessionStorage.setItem(STORAGE_KEYS.MY_COPY_WALLET, JSON.stringify(activeWallet) ?? '')
  }, [activeWallet])
  const { myProfile } = useMyProfileStore()

  useEffect(() => {
    return () => {
      sessionStorage.clear()
    }
  }, [])

  if (loadingCopyWallets) return <Loading />

  if (!loadingCopyWallets && !copyWallets) return <Box>No wallet</Box>

  return (
    <>
      <CustomPageTitle title="My Profile" />
      <Flex
        sx={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Box flex="1 0 0 " sx={{ overflow: 'hidden' }}>
          <Layout
            balanceMenu={
              <BalanceMenu copyWallets={copyWallets} activeWallet={activeWallet} onChangeKey={setActiveWallet} />
            }
            mainSection={
              <>
                {!!myProfile && (
                  <MainSection
                    myProfile={myProfile}
                    exchange={activeWallet?.exchange ?? CopyTradePlatformEnum.BINGX}
                    copyWallet={activeWallet}
                  />
                )}
              </>
            }
            positionsTable={
              <>{!!myProfile?.id && <OpeningPosition activeWallet={activeWallet} copyWallets={copyWallets} />}</>
            }
            stats={
              <Stats exchange={activeWallet?.exchange ?? CopyTradePlatformEnum.BINGX} copyWalletId={activeWallet?.id} />
            }
            historyTable={<>{!!myProfile?.id && <HistoryPositions />}</>}
            referral={<Referral />}
          ></Layout>
        </Box>
      </Flex>
    </>
  )
}
