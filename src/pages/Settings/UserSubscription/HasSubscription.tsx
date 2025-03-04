import { CheckCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

import NoDataFound from 'components/@ui/NoDataFound'
import NFTCollectionLinks from 'components/@widgets/NFTCollectionLinks'
import NFTSubscriptionCard from 'components/@widgets/NFTSubscriptionCard'
import useUserSubscription from 'hooks/features/subscription/useUserSubscription'
import { MobilePlanItem, usePlanConfigs } from 'pages/Subscription/Plans'
import { Tooltips } from 'pages/Subscription/config'
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
      label = 'PREMIUM PLAN'
      description = 'The NFT subscription premium plan is a new way to provide premium features and benefits to users'
      Icon = CrowIconGold
      color = 'orange1'
      break
    case SubscriptionPlanEnum.VIP:
      label = 'VIP PLAN'
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
            <Button
              as={Link}
              to={ROUTES.SUBSCRIPTION.path}
              variant="ghostPrimary"
              sx={{ p: 0, fontWeight: 500, ml: 2 }}
            >
              UPGRADE
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
            const isTitle = index === 0
            return sm ? (
              <DetailItem key={index} label={label} value={configs[index]} isTitle={isTitle} />
            ) : (
              <MobilePlanItem key={index} label={label} value={configs[index]} isTitle={isTitle} />
            )
          })}
        </Flex>
        <Flex flex="1" mt={24} sx={{ flexDirection: 'column', gap: 24 }}>
          {planConfigs.features.slice(6).map((label, index) => {
            const isTitle = index === 0 || index === 7
            return sm ? (
              <DetailItem key={index} label={label} value={configs[index + 6]} isTitle={isTitle} />
            ) : (
              <MobilePlanItem key={index} label={label} value={configs[index + 6]} isTitle={isTitle} />
            )
          })}
        </Flex>
      </Flex>
    </Box>
  )
}

function DetailItem({ label, value, isTitle }: { label: JSX.Element; value: JSX.Element; isTitle?: boolean }) {
  return (
    <Flex sx={{ width: '100%', alignItems: ['start'], justifyContent: 'space-between' }}>
      <Flex sx={{ alignItems: 'start', gap: 2, flexShrink: 0 }}>
        {!isTitle && <IconBox icon={<CheckCircle size={24} />} color="primary1" sx={{ flexShrink: 0 }} />}
        <Type.Caption color={isTitle ? 'primary2' : 'inherit'}>{label}</Type.Caption>
      </Flex>
      <Flex flex="1" sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Type.CaptionBold px={3} textAlign="right" sx={{ width: '100%' }}>
          {value}
        </Type.CaptionBold>
      </Flex>
    </Flex>
  )
}
