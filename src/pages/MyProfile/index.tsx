import { Trans } from '@lingui/macro'
import { useEffect, useState } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import CreateWalletAction from 'components/CreateWalletAction'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useMyProfileStore from 'hooks/store/useMyProfile'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'

import BalanceMenu from './BalanceMenu'
import HistoryPositions from './HistoryPositions'
import Layout from './Layouts/Layout'
import MainSection from './MainSection'
import OpeningPosition from './OpeningPositions'
import Stats from './Stats'
import UserActivity from './UserActivity'

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

  if (!loadingCopyWallets && !copyWallets?.length)
    return (
      <Flex mt={[3, 100]} sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Type.LargeBold mb={1}>
          <Trans>You don&apos;t have any wallet</Trans>
        </Type.LargeBold>
        <Type.Caption mb={24} color="neutral2">
          <Trans>Please create a wallet to start copy</Trans>
        </Type.Caption>
        <Flex
          sx={{
            flexDirection: ['column', 'row'],
            maxWidth: 600,
            gap: 3,
            '& > *': {
              flex: 1,
              flexDirection: 'column',
              border: 'small',
              borderColor: 'neutral4',
              borderRadius: 'xs',
              '& > *:nth-child(2)': { flex: 1 },
            },
          }}
        >
          <CreateWalletAction />
        </Flex>
      </Flex>
    )

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
            activities={<UserActivity />}
          ></Layout>
        </Box>
      </Flex>
    </>
  )
}
