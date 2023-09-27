import { Pulse } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { Box, Flex } from 'theme/base'
import { CopyTradePlatformEnum, PositionStatusEnum } from 'utils/config/enums'
import { STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'

import BalanceMenu from './BalanceMenu'
// import ChangePasswordAction from './ChangePasswordAction'
import Layout from './Layouts/Layout'
import MainSection from './MainSection'
import MyCopyPositionTable, { historyColumns } from './MyCopyPositionTable'
import Referral from './Referral'
import Stats from './Stats'

// import MyFavoriteTable from './MyFavoriteTable'

export default function MyProfile() {
  const [activeKey, setActiveKey] = useState<string | null>(() => {
    const storedKey = sessionStorage.getItem(STORAGE_KEYS.MY_COPY_ACTIVE_KEY)
    return !!storedKey ? storedKey : null
  })
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.MY_COPY_ACTIVE_KEY, activeKey ?? '')
  }, [activeKey])
  const { myProfile } = useMyProfileStore()

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
        {/* <Flex
        sx={{
          pl: 3,
          width: '100%',
          height: 60,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 3,
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
        }}
      >
        <Type.H5>My Profile</Type.H5>
        <ChangePasswordAction />
      </Flex> */}
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
            positionsTable={
              <>
                {!!myProfile?.id && (
                  <MyCopyPositionTable
                    userId={myProfile.id}
                    queryParams={{ identifyKey: activeKey ?? undefined, status: [PositionStatusEnum.OPEN] }}
                    bgColor="neutral5"
                    title="Opening Positions"
                    titleIcon={<Pulse size={24} />}
                    pageParamKey={URL_PARAM_KEYS.MY_PROFILE_OPENINGS_PAGE}
                  />
                )}
              </>
            }
            stats={<Stats exchange={CopyTradePlatformEnum.BINGX} uniqueKey={activeKey} />}
            historyTable={
              <>
                {!!myProfile?.id && (
                  <MyCopyPositionTable
                    queryParams={{}}
                    userId={myProfile.id}
                    bgColor="neutral7"
                    title="History"
                    hideTitle
                    pageParamKey={URL_PARAM_KEYS.MY_PROFILE_ALL_HISTORY_PAGE}
                    limitParamKey={URL_PARAM_KEYS.MY_PROFILE_ALL_HISTORY_LIMIT}
                    isInfiniteLoad={false}
                    tableSettings={historyColumns}
                    tableWrapperSx={{ pt: 3 }}
                    tableHeadSx={{
                      '& th:first-child': {
                        pl: 3,
                      },
                      '& th': {
                        pr: '16px !important',
                        border: 'none',
                      },
                    }}
                    tableBodySx={{
                      borderSpacing: ' 0px 4px',
                      'td:first-child': {
                        pl: 3,
                      },
                      '& td': {
                        pr: 3,
                        bg: 'neutral6',
                      },
                      '& tbody tr:hover td': {
                        bg: 'neutral5',
                      },
                    }}
                  />
                )}
              </>
            }
            referral={<Referral />}
          ></Layout>
        </Box>
      </Flex>
    </>
  )
}
