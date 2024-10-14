import { Trans } from '@lingui/macro'
import { Users, WarningCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useEffect } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Divider from 'components/@ui/Divider'
import useSearchParams from 'hooks/router/useSearchParams'
import { TabConfig, TabHeader } from 'theme/Tab'
import { Box, Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'

import { InviteButton } from './InviteButton'
import ReferralActivities from './ReferralActivities'
import ReferralHistory from './ReferralHistory'
import ReferralStats from './ReferralStats'
import UserReferralTier from './UserReferralTier'

export default function ReferralManagement() {
  const { lg } = useResponsive()
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
          }}
        >
          <PageTitle />
          <Flex sx={{ alignItems: 'center', gap: 12 }}>
            <Box sx={{ height: '16px', width: '1px', bg: 'neutral4' }} />
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
              <Type.Caption>How It Works</Type.Caption>
            </Flex>
          </Flex>
        </Flex>
        {lg ? <DesktopView /> : <MobileView />}
      </Flex>
    </>
  )
}

function PageTitle() {
  return (
    <Flex height="100%" color="neutral1" sx={{ alignItems: 'center', gap: 2 }}>
      <Users weight="fill" size={24} />
      <Type.Body>REFERRAL STATISTIC</Type.Body>
    </Flex>
  )
}

function DesktopView() {
  return (
    <>
      <Box className="referral_body" flex="1 0 0" overflow="auto">
        {/* Desktop */}
        <Flex sx={{ width: '100%', height: '100%', minHeight: 768 }}>
          <Flex
            flex={1}
            height="100%"
            className="referral_stats__wrapper"
            sx={{ flexDirection: 'column', borderRight: 'small', borderRightColor: 'neutral4' }}
          >
            {/* Stats */}
            <Flex
              height={{ _: 'auto', xl: 272 }}
              sx={{
                // p: 3,
                alignItems: 'center',
                width: '100%',
                '& > *:first-child': { width: '100%', height: '100%' },
              }}
            >
              <ReferralStats />
            </Flex>
            {/* History */}
            <Box
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
    name: <Trans>Statistic</Trans>,
    key: TabKeyEnum.STATISTIC,
  },
  {
    name: <Trans>My Referral</Trans>,
    key: TabKeyEnum.REFERRAL,
  },
]

function MobileView() {
  const { searchParams, setSearchParams } = useSearchParams()
  const currentTab = searchParams['page-tab'] ?? TabKeyEnum.STATISTIC
  const onChangeTab = (tabKey: string) => setSearchParams({ ['page-tab']: tabKey })
  useEffect(() => {
    return () => setSearchParams({ ['page-tab']: null })
  }, [])
  return (
    <>
      <Box flex="1 0 0" sx={{ overflow: 'auto' }}>
        <Box
          height="100%"
          display={currentTab === TabKeyEnum.STATISTIC ? 'flex' : 'none'}
          sx={{ flexDirection: 'column' }}
        >
          <Box p={3}>
            <ReferralStats />
          </Box>
          <Box flex="1 0 0" sx={{ borderTop: 'small', borderTopColor: 'neutral4' }}>
            <ReferralHistory />
          </Box>
        </Box>
        <Box display={currentTab === TabKeyEnum.REFERRAL ? 'flex' : 'none'} sx={{ flexDirection: 'column' }}>
          <UserReferralTier />
          <Divider mb={3} />
          <ReferralActivities isMobile />
        </Box>
      </Box>
      <Box flexShrink={0} sx={{ borderTop: 'small', borderTopColor: 'neutral4', p: 3 }}>
        <InviteButton />
        <Box mb={12} />
        <TabHeader
          itemSx={{ py: 2, border: 'none !important', flex: 1, fontWeight: 500 }}
          itemActiveSx={{ fontWeight: 700 }}
          sx={{ borderBottom: 'none' }}
          configs={tabConfigs}
          isActiveFn={(config) => config.key === currentTab}
          onClickItem={(key) => onChangeTab(key)}
          fullWidth
        />
      </Box>
    </>
  )
}
