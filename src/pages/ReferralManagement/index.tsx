import { Trans } from '@lingui/macro'
import { ChartLine, Users, WarningCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'

import { getReferralStatisticApi } from 'apis/referralManagement'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import DirectionButton from 'components/@ui/DirectionButton'
import Divider from 'components/@ui/Divider'
import { ReferralStatisticData } from 'entities/referralManagement'
import useSearchParams from 'hooks/router/useSearchParams'
import { useAuthContext } from 'hooks/web3/useAuth'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { TimeFilterByEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import { InviteButton } from './InviteButton'
import LandingPage from './LandingPage'
import ReferralActivities from './ReferralActivities'
import ReferralHistory from './ReferralHistory'
import ReferralStats from './ReferralStats'
import UserReferralTier from './UserReferralTier'

export default function ReferralManagementPage() {
  const { lg } = useResponsive()
  const { isAuthenticated, profile } = useAuthContext()

  const [hasStatistic, setHasStatistic] = useState<null | boolean>(null)
  const { data: statistic } = useQuery(
    [QUERY_KEYS.GET_REFERRAL_DATA, 'statistic', isAuthenticated, profile?.username],
    () => getReferralStatisticApi(),
    {
      enabled: !!isAuthenticated,
      onSettled(data, error) {
        if (!data || Object.keys(data).length === 0 || error) setHasStatistic(false)
        if (data && !!Object.keys(data).length) setHasStatistic(true)
      },
    }
  )
  const isLogin = useRef(false)
  useEffect(() => {
    if (isLogin.current && !isAuthenticated) {
      setHasStatistic(false)
    }
    isLogin.current = !!isAuthenticated
  }, [isAuthenticated])
  const referralStatistic = statistic?.[TimeFilterByEnum.ALL_TIME]
  return (
    <>
      <CustomPageTitle title="Referral Statistic" />
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
        <Flex
          height={48}
          sx={{
            width: '100%',
            px: 3,
            borderBottom: 'small',
            borderBottomColor: 'neutral4',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <PageTitle />
          <Flex sx={{ alignItems: 'center', gap: 12 }}>
            {/* <Box sx={{ height: '16px', width: '1px', bg: 'neutral4' }} /> */}
            <Flex
              as="a"
              href={LINKS.referralProgram}
              target="_blank"
              sx={{
                cursor: 'pointer',
                gap: 1,
                alignItems: 'center',
                color: 'primar1',
                '&:hover': { color: 'primary2' },
              }}
            >
              <WarningCircle size={20} />
              <Type.Caption>HOW IT WORKS</Type.Caption>
            </Flex>
          </Flex>
        </Flex>
        {lg ? (
          <DesktopView referralData={referralStatistic} hasStatistic={hasStatistic} />
        ) : (
          <MobileView referralData={referralStatistic} hasStatistic={hasStatistic} />
        )}
      </Flex>
    </>
  )
}

function PageTitle() {
  const { sm } = useResponsive()
  return (
    <Flex height="100%" color="neutral1" sx={{ alignItems: 'center', gap: 2 }}>
      <Users weight="fill" size={24} />
      <Type.Body>REFERRAL{sm ? ' STATISTIC' : ''}</Type.Body>
    </Flex>
  )
}

function DesktopView({
  referralData,
  hasStatistic,
}: {
  referralData: ReferralStatisticData | undefined
  hasStatistic: boolean | null
}) {
  const [showLP, setShowLP] = useState(() => {
    if (localStorage.getItem('referral_landing_page') === '0') {
      return false
    }
    return true
  })
  useEffect(() => {
    if (localStorage.getItem('referral_landing_page')) return
    if (hasStatistic == null) return
    setShowLP(!hasStatistic)
  }, [hasStatistic])
  useEffect(() => {
    localStorage.setItem('referral_landing_page', showLP ? '1' : '0')
  }, [showLP])

  return (
    <>
      <Flex sx={{ width: '100%', height: 0 }}>
        <Box flex="1 0 0" sx={{ position: 'relative' }}>
          <DirectionButton
            direction={showLP ? 'top' : 'bottom'}
            onClick={() => setShowLP((prev) => !prev)}
            buttonSx={{
              zIndex: 999,
              left: '50%',
              transform: 'translateX(-50%)',
              top: showLP ? -16 : '-1px',
              // bottom: showLP ? 0 : 'auto',
            }}
          />
        </Box>
        <Box sx={{ flexShrink: 0, width: 450 }} />
      </Flex>
      <Box className="referral_body" flex="1 0 0" overflow="auto">
        {/* Desktop */}
        <Flex sx={{ width: '100%', height: '100%', minHeight: 700 }}>
          <Flex
            flex={1}
            height="100%"
            className="referral_stats__wrapper"
            sx={{ flexDirection: 'column', borderRight: 'small', borderRightColor: 'neutral4', position: 'relative' }}
          >
            <Box
              display={showLP ? 'block' : 'none'}
              sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, zIndex: 1, bg: 'neutral7' }}
            >
              <LandingPage />
            </Box>
            {/* Stats */}
            <Box
              height={{ _: 'auto', xl: 272 }}
              display={showLP ? 'none' : 'flex'}
              sx={{
                // p: 3,
                alignItems: 'center',
                width: '100%',
                '& > *:first-child': { width: '100%', height: '100%' },
              }}
            >
              <ReferralStats data={referralData} />
            </Box>
            {/* History */}
            <Box
              display={showLP ? 'none' : 'block'}
              flex="1 0 0"
              className="referral_history__wrapper"
              sx={{ borderTop: 'small', borderTopColor: 'neutral4' }}
            >
              <ReferralHistory />
            </Box>
          </Flex>
          {/* User tier */}
          <Box
            // flexDirection={'column'}
            className="referral_tier_wrapper"
            height="100%"
            sx={{ flexShrink: 0, width: '450px' }}
          >
            <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <UserReferralTier />
              <Divider mb={3} />
              <ReferralActivities isMobile={false} />
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  )
}

enum TabKeyEnum {
  STATISTIC = 'statistic',
  REFERRAL = 'referral',
}

const tabConfigs: TabConfig[] = [
  {
    icon: <ChartLine size={20} />,
    name: <Trans>STATISTIC</Trans>,
    key: TabKeyEnum.STATISTIC,
  },
  {
    icon: <Users size={20} />,
    name: <Trans>MY REFERRAL</Trans>,
    key: TabKeyEnum.REFERRAL,
  },
]

function MobileView({
  referralData,
  hasStatistic,
}: {
  referralData: ReferralStatisticData | undefined
  hasStatistic: boolean | null
}) {
  const { searchParams, setSearchParams } = useSearchParams()
  const currentTab = searchParams['page-tab'] ?? TabKeyEnum.STATISTIC
  useEffect(() => {
    return () => setSearchParams({ ['page-tab']: null })
  }, [])

  const [showLP, setShowLP] = useState(() => {
    if (localStorage.getItem('referral_landing_page') === '0') {
      return false
    }
    return true
  })

  const onChangeTab = (tabKey: string) => {
    if (tabKey !== currentTab) {
      setShowLP(false)
    }
    setSearchParams({ ['page-tab']: tabKey })
  }
  useEffect(() => {
    if (localStorage.getItem('referral_landing_page')) return
    if (hasStatistic == null) return
    setShowLP(!hasStatistic)
  }, [hasStatistic])
  useEffect(() => {
    localStorage.setItem('referral_landing_page', showLP ? '1' : '0')
  }, [showLP])
  return (
    <>
      <DirectionButton
        direction={showLP ? 'top' : 'bottom'}
        onClick={() => setShowLP((prev) => !prev)}
        buttonSx={{
          zIndex: 999,
          left: '50%',
          transform: 'translateX(-50%)',
          top: showLP ? 32 : 47,
          // bottom: showLP ? 0 : 'auto',
        }}
      />
      <Box flex="1 0 0" sx={{ position: 'relative', overflow: 'auto' }}>
        <Box
          display={showLP ? 'block' : 'none'}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden auto',
            zIndex: 1,
            bg: 'neutral7',
          }}
        >
          <LandingPage />
        </Box>
        <Box
          height="100%"
          display={showLP ? 'none' : currentTab === TabKeyEnum.STATISTIC ? 'flex' : 'none'}
          sx={{ flexDirection: 'column' }}
        >
          <Box p={3} pt={20}>
            <ReferralStats data={referralData} />
          </Box>
          <Box flex="1 0 0" sx={{ borderTop: 'small', borderTopColor: 'neutral4' }}>
            <ReferralHistory />
          </Box>
        </Box>
        <Box
          display={showLP ? 'none' : currentTab === TabKeyEnum.REFERRAL ? 'flex' : 'none'}
          sx={{ flexDirection: 'column' }}
        >
          <UserReferralTier />
          <Divider mb={3} />
          <ReferralActivities isMobile />
        </Box>
      </Box>
      <Box flexShrink={0} sx={{ borderTop: 'small', borderTopColor: 'neutral4', pt: 3, px: 3 }}>
        <InviteButton />

        <TabHeader
          configs={tabConfigs}
          isActiveFn={(config) => config.key === currentTab}
          onClickItem={(key) => onChangeTab(key)}
          fullWidth
          itemSx={{
            width: '100%',
          }}
        />
      </Box>
    </>
  )
}
