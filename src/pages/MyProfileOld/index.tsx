import { UserCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useState } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'

import BalanceMenu from './BalanceMenu'
import ChangePasswordAction from './ChangePasswordAction'
import DesktopLayout from './Layouts/DesktopLayout'
import MobileLayout from './Layouts/MobileLayout'
import TabletLayout from './Layouts/TabletLayout'
import MyCopiesTable from './MyCopiesTable'
import Positions from './Positions'
import Stats from './Stats'

// import MyFavoriteTable from './MyFavoriteTable'

export default function MyProfile() {
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const { myProfile } = useMyProfileStore()

  const { lg, xl } = useResponsive()

  let Layout = MobileLayout
  if (xl) {
    Layout = DesktopLayout
  } else if (lg) {
    Layout = TabletLayout
  }

  return (
    <>
      <CustomPageTitle title="My Profile Old" />
      <Layout>
        <Flex
          sx={{
            pl: 3,
            width: '100%',
            height: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          <Flex sx={{ gap: 2, alignItems: 'center' }}>
            <Box
              sx={{
                lineHeight: 0,
                p: 1,
                borderRadius: 'sm',
                backgroundColor: 'rgba(47, 100, 228, 0.3)',
                color: 'primary3',
              }}
            >
              <UserCircle size={32} />
            </Box>
            <Type.H5>My Profile</Type.H5>
          </Flex>
          <ChangePasswordAction />
        </Flex>

        <BalanceMenu activeKey={activeKey} onChangeKey={setActiveKey} hasCollapse={!lg} />

        <Stats exchange={CopyTradePlatformEnum.BINGX} uniqueKey={activeKey} />
        <>{!!myProfile && <MyCopiesTable myProfile={myProfile} />}</>
        <>{!!myProfile?.id && <Positions userId={myProfile?.id} />}</>
        {/* <MyStats balance={200} copiesVol={1000} /> */}
        {/* {myProfile?.role !== UserRoleEnum.GUEST && (
        <Flex flexDirection={{ _: 'column', xl: 'row' }}>
          <Box flex={1} variant="cardBorder" sx={{ borderRadius: 0, borderTop: 'none' }}>
            <MyCopiesTable />
          </Box>
          <Box flex={1} sx={{ border: 'none' }}>
            <MyCopyPositionTable userId={myProfile?.id} label={'Opening Position'} status={PositionStatusEnum.OPEN} />
            <MyCopyPositionTable userId={myProfile?.id} label={'History'} status={PositionStatusEnum.CLOSE} />
          </Box>
        </Flex>
      )} */}
      </Layout>
    </>
  )
}

// function MyStats({ balance, copiesVol }: { balance: number | undefined; copiesVol: number | undefined }) {
//   return (
//     <Flex sx={{ flexWrap: 'wrap', columnGap: 4, rowGap: 3 }}>
//       <Type.Body color="neutral4">
//         My Wallet: <Type.BodyBold color="neutral8">{balance ? `$${balance}` : '--'}</Type.BodyBold>
//       </Type.Body>
//       <Type.Body color="neutral4">
//         {/* Balance */}
//         My Copies: <Type.BodyBold color="neutral8">{copiesVol ? `$${copiesVol}` : '--'}</Type.BodyBold>
//       </Type.Body>
//     </Flex>
//   )
// }
