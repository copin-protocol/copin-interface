import { useEffect, useState } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { Box, Flex } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'

import BalanceMenu from './BalanceMenu'
import HistoryPositions from './HistoryPositions'
import Layout from './Layouts/Layout'
import MainSection from './MainSection'
import OpeningPosition from './OpeningPositions'
import Referral from './Referral'
import Stats from './Stats'

export default function MyProfile() {
  const [activeKey, setActiveKey] = useState<string | null>(() => {
    const storedKey = sessionStorage.getItem(STORAGE_KEYS.MY_COPY_ACTIVE_KEY)
    return !!storedKey ? storedKey : null
  })
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.MY_COPY_ACTIVE_KEY, activeKey ?? '')
  }, [activeKey])
  const { myProfile } = useMyProfileStore()

  useEffect(() => {
    return () => {
      sessionStorage.clear()
    }
  }, [])

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
            balanceMenu={<BalanceMenu activeKey={activeKey} onChangeKey={setActiveKey} />}
            mainSection={
              <>
                {!!myProfile && (
                  <MainSection myProfile={myProfile} exchange={CopyTradePlatformEnum.BINGX} uniqueKey={activeKey} />
                )}
              </>
            }
            positionsTable={<>{!!myProfile?.id && <OpeningPosition activeKey={activeKey} />}</>}
            stats={<Stats exchange={CopyTradePlatformEnum.BINGX} uniqueKey={activeKey} />}
            historyTable={<>{!!myProfile?.id && <HistoryPositions />}</>}
            referral={<Referral />}
          ></Layout>
        </Box>
      </Flex>
    </>
  )
}
