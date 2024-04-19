import { CheckCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

import NoDataFound from 'components/@ui/NoDataFound'
import NFTCollectionLinks from 'components/NFTCollectionLinks'
import NFTSubscriptionCard from 'components/NFTSubscriptionCard'
import useUserSubscription from 'hooks/features/useUserSubscription'
import { MobilePlanItem, Tooltips, usePlanConfigs } from 'pages/Subscription/Plans'
import { Button } from 'theme/Buttons'
import { CrowIconGold } from 'theme/Icons/CrowIcon'
import { VipPlanIcon1 } from 'theme/Icons/VipPlanIcon'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

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
            <PlanDetails plan={data.tierId} />
          </Box>
          <Box sx={{ p: 3 }}>
            {nftExpired ? <SubscriptionExpired /> : <ExtendPlan tokenId={data.tokenId} plan={data.tierId} />}
          </Box>
        </Box>
      </Flex>
      <Tooltips />
    </>
  )
}

export function PlanDetails({ plan }: { plan: SubscriptionPlanEnum }) {
  const planConfigs = usePlanConfigs()
  const { sm } = useResponsive()
  let label = ''
  let description = ''
  let color = ''
  let Icon: any = Fragment
  switch (plan) {
    case SubscriptionPlanEnum.PREMIUM:
      label = 'Premium Plan'
      description = 'The NFT subscription premium plan is a new way to provide premium features and benefits to users'
      Icon = CrowIconGold
      color = 'orange1'
      break
    case SubscriptionPlanEnum.VIP:
      label = 'VIP Plan'
      Icon = VipPlanIcon1
      description = 'The NFT subscription VIP plan is a new way to provide premium features and benefits to users'
      color = 'violet'
      break
  }
  const configs = plan === SubscriptionPlanEnum.PREMIUM ? planConfigs.premium : planConfigs.vip
  return (
    <Box>
      <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}>
        <Flex sx={{ alignItems: 'center', gap: 12 }}>
          <Icon />
          <Type.LargeBold color={color}>{label}</Type.LargeBold>
          {plan !== SubscriptionPlanEnum.VIP && (
            <Button as={Link} to={ROUTES.SUBSCRIPTION.path} variant="ghostPrimary" sx={{ p: 0, fontWeight: 500 }}>
              Upgrade
            </Button>
          )}
        </Flex>
        <Box>
          <NFTCollectionLinks hasText sx={{ gap: 2 }} />
        </Box>
      </Flex>
      {/* <Type.Caption mt={2} color="neutral3">
        {description}
      </Type.Caption> */}
      <Flex sx={{ flexDirection: ['column', 'column', 'column', 'column', 'row'] }}>
        <Flex flex="1" mt={24} sx={{ flexDirection: 'column', gap: 24 }}>
          {planConfigs.features.slice(0, 6).map((label, index) => {
            return sm ? (
              <DetailItem key={index} label={label} value={configs[index]} />
            ) : (
              <MobilePlanItem key={index} label={label} value={configs[index]} />
            )
          })}
        </Flex>
        <Flex flex="1" mt={24} sx={{ flexDirection: 'column', gap: 24 }}>
          {planConfigs.features.slice(6).map((label, index) => {
            return sm ? (
              <DetailItem key={index} label={label} value={configs[index + 6]} />
            ) : (
              <MobilePlanItem key={index} label={label} value={configs[index + 6]} />
            )
          })}
        </Flex>
      </Flex>
    </Box>
  )
}

function DetailItem({ label, value }: { label: JSX.Element; value: JSX.Element }) {
  return (
    <Flex sx={{ width: '100%', alignItems: ['start'], justifyContent: 'space-between' }}>
      <Flex sx={{ alignItems: 'start', gap: 2, flexShrink: 0 }}>
        <IconBox icon={<CheckCircle size={24} />} color="primary1" sx={{ flexShrink: 0 }} />
        <Type.Caption>{label}</Type.Caption>
      </Flex>
      <Flex flex="1" sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Type.CaptionBold px={3} textAlign="right" sx={{ width: '100%' }}>
          {value}
        </Type.CaptionBold>
      </Flex>
    </Flex>
  )
}
