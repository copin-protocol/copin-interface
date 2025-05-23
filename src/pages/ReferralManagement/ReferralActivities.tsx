import { Trans } from '@lingui/macro'
import { SpeakerSimpleHigh } from '@phosphor-icons/react'
import { useQuery } from 'react-query'

import { getReferralActivitiesApi } from 'apis/referralManagement'
import tokenNotFound from 'assets/images/token-not-found.png'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import SectionTitle from 'components/@ui/SectionTitle'
import { ReferralActivityData } from 'entities/referralManagement'
import Loading from 'theme/Loading'
import { Box, Flex, Image, Type } from 'theme/base'
import { ReferralActivityTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'

export default function ReferralActivities({ isMobile }: { isMobile: boolean }) {
  const { data: activities, isLoading } = useQuery(
    [QUERY_KEYS.GET_REFERRAL_DATA, 'activities'],
    getReferralActivitiesApi,
    {
      retry: 0,
      refetchInterval: 120_000,
    }
  )
  return isMobile ? (
    <Box>
      <Box px={3}>
        <Head />
      </Box>
      <Flex px={3} pb={3} sx={{ width: '100%', flexDirection: 'column', gap: 12 }}>
        {activities ? <ListActivity activities={activities} /> : null}
      </Flex>
    </Box>
  ) : (
    <Box sx={{ display: 'flex', width: '100%', flex: '1 0 0', flexDirection: 'column' }}>
      <Box px={3}>
        <Head />
      </Box>
      <Flex
        px={3}
        pb={3}
        sx={{
          flexDirection: 'column',
          gap: 12,
          flex: '1 0 0',
          overflow: 'auto',
        }}
      >
        {isLoading ? <Loading /> : <ListActivity activities={activities} />}
      </Flex>
    </Box>
  )
}
function Head() {
  return (
    <SectionTitle icon={SpeakerSimpleHigh} iconColor="neutral3" title={<Trans>GLOBAL REFERRAL ACTIVITIES</Trans>} />
  )
}

function ListActivity({ activities }: { activities: ReferralActivityData[] | undefined }) {
  if (!activities?.length) {
    return (
      <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 3 }}>
        <Image height={160} src={tokenNotFound} />
        <Type.Caption color="neutral3">
          <Box as="span" color="neutral1">
            Recent Activities
          </Box>{' '}
          will show here
        </Type.Caption>
      </Flex>
    )
  }
  return (
    <>
      {activities.map((data) => {
        return (
          <Box key={data.id}>
            <Box sx={{ a: { color: 'neutral1', textDecoration: 'underline', '&:hover': { color: 'neutral2' } } }}>
              <Type.Caption color="neutral3" display="block" width="max-content">
                <RelativeTimeText date={data.time} />
              </Type.Caption>
              <Type.Caption color="neutral2">
                {data.type === ReferralActivityTypeEnum.COMMISSION && (
                  <Trans>
                    <Box as="b" color="neutral1">
                      {data.referralFromUser}{' '}
                    </Box>
                    earned {formatNumber(data.commission)} USDC in commission from{' '}
                    <Box as="b" color="neutral1">
                      {data.referralUser}
                    </Box>
                  </Trans>
                )}
                {data.type === ReferralActivityTypeEnum.INVITE && (
                  <Trans>
                    <Box as="span" color="neutral1">
                      {data.referralUser}{' '}
                    </Box>
                    invited by{' '}
                    <Box as="span" color="neutral1">
                      {data.referralFromUser}
                    </Box>
                  </Trans>
                )}
              </Type.Caption>
            </Box>
          </Box>
        )
      })}
    </>
  )
}
