import { Trans } from '@lingui/macro'
import { CheckCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'

import Divider from 'components/@ui/Divider'
import useSubscriptionPlanPrice from 'hooks/features/useSubscriptionPlanPrice'
// import MintButton from 'pages/Subscription/MintButton'
import { planConfigs } from 'pages/Subscription/Plans'
import { CrowIconGold, CrowIconSilver } from 'theme/Icons/CrowIcon'
import { Box, Flex, IconBox, Type } from 'theme/base'

// import PlanPrice from './PlanPrice'
import { MINT_MODAL_LABELS, PricingDropdown } from './PricingOptions'

export default function NoSubscription() {
  const { lg } = useResponsive()
  return lg ? <DesktopNoSubscription /> : <MobileNoSubscription />
}

function DesktopNoSubscription() {
  return (
    <Box
      sx={{
        py: [24, 24, 24, 48],
        position: 'relative',
        borderRadius: '4px',
        border: '0.5px solid #DCBFF220',
        background: 'linear-gradient(180deg, rgba(62, 162, 244, 0.05) 0%, rgba(66, 62, 244, 0.05) 100%)',
        backdropFilter: 'blur(15.397562980651855px)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: [24, 24, 24, 48],
          bottom: [24, 24, 24, 48],
          left: 'calc(50% - 10px)',
          bg: 'neutral5',
          width: '1px',
        }}
      />
      <RowWrapper
        leftContent={
          <>
            <Flex mb={1} sx={{ alignItems: 'center', gap: 3 }}>
              <CrowIconSilver />
              <Type.LargeBold>
                <Trans>Current Plan</Trans>
              </Type.LargeBold>
            </Flex>
            <Type.Caption color="neutral3">
              <Trans>The basic plan allows your to experience the basic features of Copin</Trans>
            </Type.Caption>
          </>
        }
        rightContent={
          <>
            <Flex mb={1} sx={{ alignItems: 'center', gap: 3 }}>
              <CrowIconGold />
              <Type.LargeBold>
                <Trans>Premium Plan</Trans>
              </Type.LargeBold>
            </Flex>
            <Type.Caption color="neutral3">
              <Trans>More insights, more benefits</Trans>
            </Type.Caption>
          </>
        }
      />

      <Flex mt={20} sx={{ flexDirection: 'column', gap: 20 }}>
        {planConfigs.features.map((value, index) => (
          <RowWrapper
            key={index}
            leftContent={
              <Flex>
                <Type.Caption sx={{ width: [260, 260, 260, 300], flexShrink: 0 }}>{value}</Type.Caption>
                <Type.Caption px={3}>{planConfigs.basic[index]}</Type.Caption>
              </Flex>
            }
            rightContent={
              <Flex sx={{ alignItems: 'center' }}>
                <IconBox icon={<CheckCircle size={24} />} color="primary1" />
                <Type.Caption px={3}>{planConfigs.premium[index]}</Type.Caption>
              </Flex>
            }
          ></RowWrapper>
        ))}
        <RowWrapper
          leftContent={<Box />}
          rightContent={
            <>
              <Divider mt={1} mb={24} sx={{ bg: 'neutral5' }} />
              <PricingDropdown
                method="mint"
                buttonLabel={<Trans>Mint NFT</Trans>}
                modalLabels={MINT_MODAL_LABELS}
                buttonSx={{ width: ['100%', 150] }}
              />
            </>
          }
        />
      </Flex>
    </Box>
  )
}

function RowWrapper({ leftContent, rightContent }: { leftContent: ReactNode; rightContent: ReactNode }) {
  return (
    <Flex>
      <Box sx={{ flex: 1, px: 24 }}>{leftContent}</Box>
      <Box sx={{ flex: 1, px: 24, pl: 40 }}>{rightContent}</Box>
    </Flex>
  )
}

export function MobileNoSubscription() {
  const priceData = useSubscriptionPlanPrice()
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
        {planConfigs.features.map((value, index) => (
          <Flex key={index} sx={{ alignItems: 'center', gap: 3 }}>
            <Flex sx={{ alignItems: 'center', width: 175, flexShrink: 0 }}>
              <Type.Caption>{value}</Type.Caption>
            </Flex>
            <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <Type.CaptionBold>{planConfigs.basic[index]}</Type.CaptionBold>
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Flex
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
          buttonLabel={<Trans>Mint NFT</Trans>}
          modalLabels={MINT_MODAL_LABELS}
          buttonSx={{ width: ['100%', 200] }}
        />
        {/* <Box>
          <PlanPrice planPrice={priceData?.price} />
        </Box>
        <MintButton
          planPrice={priceData?.price}
          buttonType="primary"
          buttonSx={{ width: '100%', height: 40, '& *': { fontSize: '13px !important' } }}
          buttonText={<Trans>Mint to upgrade</Trans>}
        /> */}
      </Flex>
    </>
  )
}
