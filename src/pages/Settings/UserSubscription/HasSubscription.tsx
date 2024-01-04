import { Trans } from '@lingui/macro'
import { CheckCircle } from '@phosphor-icons/react'
import dayjs from 'dayjs'

import NoDataFound from 'components/@ui/NoDataFound'
import NFTCollectionLinks from 'components/NFTCollectionLinks'
import NFTSubscriptionCard from 'components/NFTSubscriptionCard'
import useUserSubscription from 'hooks/features/useUserSubscription'
import { planConfigs } from 'pages/Subscription/Plans'
import { CrowIconGold } from 'theme/Icons/CrowIcon'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'

import ExtendPlan from './ExtendPlan'
import SubscriptionExpired from './SubscriptionExpired'

export default function HasSubscription() {
  const { data, isLoading } = useUserSubscription()
  if (isLoading) return <Loading />
  if (!data) return <NoDataFound />
  const nftExpired = dayjs.utc(data.expiredTime).valueOf() < dayjs.utc().valueOf()
  return (
    <>
      <Flex
        sx={{
          flexDirection: ['column', 'column', 'column', 'row'],
          borderRadius: '4px',
          border: 'small',
          borderColor: 'neutral4',
        }}
      >
        <Box
          sx={{
            p: 3,
            flexShrink: 0,
            borderRight: ['none', 'none', 'none', 'small'],
            borderRightColor: ['transparent', 'transparent', 'transparent', 'neutral4'],
            width: 'auto',
            maxWidth: 360,
            mx: 'auto',
          }}
        >
          <NFTSubscriptionCard data={data} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ p: 3, bg: 'neutral6', borderBottom: 'small', borderBottomColor: 'neutral4' }}>
            <PremiumPlanDetails />
          </Box>
          <Box sx={{ p: 3 }}>{nftExpired ? <SubscriptionExpired /> : <ExtendPlan tokenId={data.tokenId} />}</Box>
        </Box>
      </Flex>
    </>
  )
}

export function PremiumPlanDetails() {
  return (
    <Box>
      <Flex
        mb={2}
        sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}
      >
        <Flex sx={{ alignItems: 'center', gap: 12 }}>
          <CrowIconGold />
          <Type.LargeBold>
            <Trans>Premium Plan</Trans>
          </Type.LargeBold>
        </Flex>
        <Box>
          <NFTCollectionLinks hasText sx={{ gap: 2 }} />
        </Box>
      </Flex>
      <Type.Caption mb={24} color="neutral3">
        <Trans>The NFT subscription premium plan is a new way to provide premium features and benefits to users</Trans>
      </Type.Caption>
      <Flex sx={{ flexDirection: 'column', gap: 24 }}>
        {planConfigs.features.map((feature, index) => {
          return <DetailItem key={index} feature={feature} value={planConfigs.premium[index]} />
        })}
      </Flex>
    </Box>
  )
}

function DetailItem({ feature, value }: { feature: JSX.Element; value: JSX.Element }) {
  return (
    <Flex sx={{ alignItems: 'center' }}>
      <Flex sx={{ alignItems: 'center', gap: 10, width: [150, 200, 200, 300], flexShrink: 0 }}>
        <IconBox icon={<CheckCircle size={24} />} color="primary1" />
        <Type.Caption>{feature}</Type.Caption>
      </Flex>
      <Flex sx={{ alignItems: 'center', justifyContent: 'center' }} px={3}>
        <Type.Caption px={3}>{value}</Type.Caption>
      </Flex>
    </Flex>
  )
}
