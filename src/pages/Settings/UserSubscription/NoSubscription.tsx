import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

// import useSubscriptionPlanPrice from 'hooks/features/useSubscriptionPlanPrice'
// import MintButton from 'pages/Subscription/MintButton'
import { MobilePlanItem, usePlanConfigs } from 'pages/Subscription/Plans'
import { Tooltips } from 'pages/Subscription/config'
import { checkIsSubscriptionTitle } from 'pages/Subscription/helpers'
import { Button } from 'theme/Buttons'
import { CrowIconSilver } from 'theme/Icons/CrowIcon'
import { Box, Flex, Grid, Type } from 'theme/base'
import ROUTES from 'utils/config/routes'

// import PlanPrice from './PlanPrice'

export default function NoSubscription() {
  const { lg } = useResponsive()
  return lg ? <DesktopNoSubscription /> : <MobileNoSubscription />
}

function DesktopNoSubscription() {
  // const priceData = useSubscriptionPlanPrice()
  const planConfigs = usePlanConfigs()
  return (
    <Box
      sx={{
        py: 24,
        position: 'relative',
        borderRadius: '4px',
        border: '0.5px solid #DCBFF220',
        background: 'linear-gradient(180deg, rgba(62, 162, 244, 0.05) 0%, rgba(66, 62, 244, 0.05) 100%)',
        backdropFilter: 'blur(15.397562980651855px)',
        width: '100%',
        maxWidth: 700,
        mx: 'auto',
      }}
    >
      {/* <Box
        sx={{
          position: 'absolute',
          top: [24, 24, 24, 48],
          bottom: [24, 24, 24, 48],
          right: '640px',
          bg: 'neutral5',
          width: '1px',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: [24, 24, 24, 48],
          bottom: [24, 24, 24, 48],
          right: '320px',
          bg: 'neutral5',
          width: '1px',
        }}
      /> */}
      {/* <RowWrapper> */}
      <Box px={24}>
        <Flex mb={1} sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 3 }}>
          <Flex sx={{ alignItems: 'center', gap: 3 }}>
            <CrowIconSilver />
            <Type.LargeBold>
              <Trans>Basic Plan</Trans>
            </Type.LargeBold>
          </Flex>
          <Box as={Link} to={ROUTES.SUBSCRIPTION.path}>
            <Button size="sm" variant="primary">
              Upgrade
            </Button>
          </Box>
        </Flex>
        <Type.Caption color="neutral3">
          <Trans>The basic plan allows your to experience the basic features of Copin</Trans>
        </Type.Caption>
      </Box>
      {/* <Box px={3}>
          <Flex mb={1} sx={{ alignItems: 'center', gap: 3 }}>
            <CrowIconGold />
            <Type.LargeBold>
              <Trans>Premium Plan</Trans>
            </Type.LargeBold>
          </Flex>
          <Type.Caption color="neutral3">
            <Trans>More insights, more benefits</Trans>
          </Type.Caption>
        </Box>
        <Box px={3}>
          <Flex mb={1} sx={{ alignItems: 'center', gap: 3 }}>
            <CrowIconGold />
            <Type.LargeBold>
              <Trans>VIP Plan</Trans>
            </Type.LargeBold>
          </Flex>
          <Type.Caption color="neutral3">
            <Trans>More insights, more benefits</Trans>
          </Type.Caption>
        </Box> */}
      {/* </RowWrapper> */}

      <Flex mt={20} sx={{ flexDirection: 'column', gap: 20 }}>
        {planConfigs.features.map((value, index) => {
          const isTitle = checkIsSubscriptionTitle(index)
          return (
            <RowWrapper key={index}>
              <Type.Caption px={24} color={isTitle ? 'primary2' : 'inherit'}>
                {value}
              </Type.Caption>
              <Flex px={24}>
                <Type.Caption>{planConfigs.basic[index]}</Type.Caption>
              </Flex>
              {/* <Flex px={3} sx={{ alignItems: 'center', gap: 3 }}>
              <IconBox icon={<CheckCircle size={24} />} color="primary1" />
              <Type.Caption>{planConfigs.premium[index]}</Type.Caption>
            </Flex>
            <Flex px={3} sx={{ alignItems: 'center', gap: 3 }}>
              <IconBox icon={<CheckCircle size={24} />} color="primary1" />
              <Type.Caption>{planConfigs.vip[index]}</Type.Caption>
            </Flex> */}
            </RowWrapper>
          )
        })}
        {/* <RowWrapper>
          <Box />
          <Box />
          <Box px={3}>
            <Divider mb={3} />
            <PricingDropdown
              method="mint"
              plan={SubscriptionPlanEnum.PREMIUM}
              planPrice={priceData[SubscriptionPlanEnum.PREMIUM]?.price}
              buttonLabel={<Trans>Mint Premium NFT</Trans>}
              modalLabels={MINT_MODAL_LABELS}
              buttonSx={{ width: ['100%', 150] }}
              wrapperSx={{ flexDirection: 'column' }}
            />
          </Box>
          <Box px={3}>
            <Divider mb={3} />
            <PricingDropdown
              method="mint"
              plan={SubscriptionPlanEnum.VIP}
              planPrice={priceData[SubscriptionPlanEnum.VIP]?.price}
              buttonLabel={<Trans>Mint VIP NFT</Trans>}
              modalLabels={MINT_MODAL_LABELS}
              buttonSx={{ width: ['100%', 150] }}
              wrapperSx={{ flexDirection: 'column' }}
            />
          </Box>
        </RowWrapper> */}
      </Flex>
      <Tooltips />
    </Box>
  )
}

function RowWrapper({ children }: { children: ReactNode }) {
  // return <Grid sx={{ gridTemplateColumns: '240px 320px 320px 320px' }}>{children}</Grid>
  return <Grid sx={{ gridTemplateColumns: '1fr 1fr' }}>{children}</Grid>
}

export function MobileNoSubscription() {
  // const priceData = useSubscriptionPlanPrice()
  const planConfigs = usePlanConfigs()
  return (
    <>
      <Flex
        sx={{ flexDirection: 'column', gap: 3, p: 3, borderRadius: '4px', border: 'small', borderColor: 'neutral4' }}
        mb={20}
      >
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <CrowIconSilver />
          <Type.BodyBold>
            <Trans>Current Plan</Trans>
          </Type.BodyBold>
        </Flex>
        {planConfigs.features.map((label, index) => (
          <MobilePlanItem
            key={index}
            label={label}
            value={planConfigs.basic[index]}
            isTitle={checkIsSubscriptionTitle(index)}
          />
        ))}
        <Button size="xs" px={4} as={Link} to={ROUTES.SUBSCRIPTION.path} variant="primary">
          Upgrade
        </Button>
      </Flex>
      <Tooltips />
      {/* <Flex
        sx={{
          flexDirection: 'column',
          gap: 3,
          p: 3,
          borderRadius: '4px',
          border: 'small',
          borderColor: 'neutral4',
          bg: 'neutral5',
          width: '100%',
        }}
      >
        <Flex sx={{ alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <CrowIconGold />
          <Type.BodyBold>
            <Trans>Premium Plan</Trans>
          </Type.BodyBold>
        </Flex>
        {planConfigs.features.map((value, index) => (
          <Flex key={index} sx={{ alignItems: 'center', gap: 3 }}>
            <Flex sx={{ alignItems: 'center', width: 175, flexShrink: 0 }}>
              <Type.Caption>{value}</Type.Caption>
            </Flex>
            <Flex sx={{ alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <IconBox icon={<CheckCircle size={24} />} color="primary1" sx={{ flexShrink: 0 }} />
              <Type.CaptionBold>{planConfigs.premium[index]}</Type.CaptionBold>
            </Flex>
          </Flex>
        ))}
        <Box height={0} />
        <PricingDropdown
          method="mint"
          plan={SubscriptionPlanEnum.PREMIUM}
          planPrice={priceData[SubscriptionPlanEnum.PREMIUM]?.price}
          buttonLabel={<Trans>Mint Premium NFT</Trans>}
          modalLabels={MINT_MODAL_LABELS}
          buttonSx={{ width: ['100%', 200] }}
        /> 
        <PricingDropdown
          method="mint"
          plan={SubscriptionPlanEnum.VIP}
          planPrice={priceData[SubscriptionPlanEnum.VIP]?.price}
          buttonLabel={<Trans>Mint VIP NFT</Trans>}
          modalLabels={MINT_MODAL_LABELS}
          buttonSx={{ width: ['100%', 200] }}
        />
        <Box>
          <PlanPrice planPrice={priceData?.price} />
        </Box>
        <MintButton
          planPrice={priceData?.price}
          buttonType="primary"
          buttonSx={{ width: '100%', height: 40, '& *': { fontSize: '13px !important' } }}
          buttonText={<Trans>Mint to upgrade</Trans>}
        /> 
      </Flex> */}
    </>
  )
}
