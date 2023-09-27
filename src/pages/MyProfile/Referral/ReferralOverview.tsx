import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'
import { useQuery } from 'react-query'

import { getReferralStatsApi } from 'apis/userApis'
import useMyProfile from 'hooks/store/useMyProfile'
import CopyButton from 'theme/Buttons/CopyButton'
import { Box, Flex, Type } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'

const StatsBox = ({ isLoading = false, title, value }: { isLoading?: boolean; title: ReactNode; value?: number }) => {
  return (
    <Box minWidth={80}>
      <Box>
        <Type.Caption color={'neutral2'}>{title}</Type.Caption>
      </Box>
      <Type.CaptionBold color={'neutral1'} mr={1}>
        {isLoading ? '-' : value !== undefined ? formatNumber(value) : '-'}
      </Type.CaptionBold>
      <Type.Caption color={'neutral3'}>User(s)</Type.Caption>
    </Box>
  )
}

const ReferralOverview = () => {
  const { myProfile } = useMyProfile()
  const referralCode = myProfile?.referralCode ?? ''

  const { data, isLoading } = useQuery([QUERY_KEYS.GET_REFERRAL_STATS], () => getReferralStatsApi(), {
    retry: 0,
    keepPreviousData: true,
  })

  return (
    <Box p={3} maxWidth={550}>
      <Box>
        <Type.BodyBold color={'neutral1'}>
          <Trans>Referrals</Trans>
        </Type.BodyBold>
        <Flex
          my={3}
          sx={{
            borderBottom: 'small',
            borderColor: 'neutral5',
            gap: [20, 40],
            flexWrap: 'wrap',
          }}
          pb={3}
        >
          <StatsBox isLoading={isLoading} title={<Trans>Today</Trans>} value={data?.todayReferral} />
          <StatsBox isLoading={isLoading} title={<Trans>Yesterday</Trans>} value={data?.yesterdayReferral} />
          <StatsBox isLoading={isLoading} title={<Trans>Last 30 Days</Trans>} value={data?.d30Referral} />
          <StatsBox isLoading={isLoading} title={<Trans>Total</Trans>} value={data?.totalReferral} />
        </Flex>
      </Box>

      <Box>
        <Type.Caption color={'neutral1'}>
          <Trans>Referral Code</Trans>
        </Type.Caption>

        <CopyButton
          type="button"
          value={referralCode}
          mt={10}
          block
          sx={{
            color: 'neutral1',
            borderRadius: 4,
            padding: '8px 16px',
            gap: 4,
            border: 'small',
            borderColor: 'neutral3',
            bg: 'neutral5',
            width: '100%',
          }}
          iconSize={24}
          iconSx={{ color: 'primary1' }}
        >
          {referralCode}
        </CopyButton>
      </Box>

      <Box mt={3}>
        <Type.Caption color={'neutral1'}>
          <Trans>Share Landing Page</Trans>
        </Type.Caption>
        <CopyButton
          type="button"
          value={`https://copin.io?ref=${referralCode}`}
          mt={10}
          block
          sx={{
            color: 'neutral1',
            borderRadius: 4,
            padding: '8px 16px',
            gap: 4,
            border: 'small',
            borderColor: 'neutral3',
            bg: 'neutral5',
            width: '100%',
          }}
          iconSize={24}
          iconSx={{ color: 'primary1' }}
        >
          {`https://copin.io?ref=${referralCode}`}
        </CopyButton>
      </Box>

      <Box mt={3} mb={12}>
        <Type.Caption color={'neutral1'}>
          <Trans>Share DApp</Trans>
        </Type.Caption>
        <CopyButton
          type="button"
          value={`${import.meta.env.VITE_URL}?ref=${referralCode}`}
          mt={10}
          block
          sx={{
            color: 'neutral1',
            borderRadius: 4,
            padding: '8px 16px',
            gap: 4,
            border: 'small',
            borderColor: 'neutral3',
            bg: 'neutral5',
            width: '100%',
          }}
          iconSize={24}
          iconSx={{ color: 'primary1' }}
        >
          {`${import.meta.env.VITE_URL}?ref=${referralCode}`}
        </CopyButton>
      </Box>
    </Box>
  )
}

export default ReferralOverview
