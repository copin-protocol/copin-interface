/* eslint-disable react/jsx-key */
import { Trans } from '@lingui/macro'
import { CheckCircle, Info, XCircle } from '@phosphor-icons/react'
import { ReactNode, useState } from 'react'

import NFTSubscriptionCard from 'components/NFTSubscriptionCard'
import Num from 'entities/Num'
import useSubscriptionPlanPrice from 'hooks/features/useSubscriptionPlanPrice'
import { useSystemConfigContext } from 'hooks/features/useSystemConfigContext'
import { Button } from 'theme/Buttons'
import { CrowIconGold } from 'theme/Icons/CrowIcon'
import { VipPlanIcon1 } from 'theme/Icons/VipPlanIcon'
import Loading from 'theme/Loading'
import Modal from 'theme/Modal'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

import MintButton from './MintButton'
import { PlanRowWrapper } from './styled'

export default function Plans() {
  const priceData = useSubscriptionPlanPrice()
  const pricePremium = priceData[SubscriptionPlanEnum.PREMIUM]
    ? new Num(priceData[SubscriptionPlanEnum.PREMIUM].price)
    : undefined
  const priceVip = priceData[SubscriptionPlanEnum.VIP] ? new Num(priceData[SubscriptionPlanEnum.VIP].price) : undefined
  const [previewPlan, setPreviewPlan] = useState<SubscriptionPlanEnum | null>(null)
  const planConfigs = usePlanConfigs()
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        bg: 'neutral7',
      }}
    >
      <PlanDecorators />
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <PlanRowWrapper height={155}>
          <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Type.H3>
              <Trans>Features</Trans>
            </Type.H3>
          </Flex>
          <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Type.BodyBold mb={2} color="neutral2">
              <Trans>Basic Plan</Trans>
            </Type.BodyBold>
            <Type.H2>
              <Trans>FREE</Trans>
            </Type.H2>
          </Flex>
          <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Flex mb={2} sx={{ alignItems: 'center', gap: 12 }}>
              <CrowIconGold />
              <Type.BodyBold color="orange1">
                <Trans>Premium Plan</Trans>
              </Type.BodyBold>
            </Flex>
            <Type.H2>
              <Box as="span" color="orange1">
                {pricePremium ? (
                  `${pricePremium.str}`
                ) : (
                  <Loading
                    size={24}
                    background="neutral3"
                    indicatorColor="orange1"
                    display="inline-block"
                    margin="0 0 -4px 0 !important"
                  />
                )}
              </Box>
              <Box as="span" sx={{ fontSize: '24px', ml: '0.3ch' }} color="orange1">
                ETH
              </Box>
              <Box as="span" sx={{ fontSize: '16px' }} color="neutral1" fontWeight={400}>
                {' '}
                /30days
              </Box>
            </Type.H2>
          </Flex>
          <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Flex mb={2} sx={{ alignItems: 'center', gap: 12 }}>
              <VipPlanIcon1 />
              <Type.BodyBold color="violet">
                <Trans>VIP Plan</Trans>
              </Type.BodyBold>
            </Flex>
            <Type.H2>
              <Box as="span" color="violet">
                {priceVip ? (
                  `${priceVip.str}`
                ) : (
                  <Loading
                    size={24}
                    background="neutral3"
                    indicatorColor="violet"
                    display="inline-block"
                    margin="0 0 -4px 0 !important"
                  />
                )}
              </Box>
              <Box as="span" sx={{ fontSize: '24px', ml: '0.3ch' }} color="violet">
                ETH
              </Box>
              <Box as="span" sx={{ fontSize: '16px' }} color="neutral1" fontWeight={400}>
                {' '}
                /30days
              </Box>
            </Type.H2>
          </Flex>
        </PlanRowWrapper>
        <Flex sx={{ width: '100%', flexDirection: 'column', gap: 3, py: 3 }}>
          {planConfigs.features.map((value, index) => (
            <PlanRowWrapper key={index}>
              <Flex sx={{ alignItems: 'center', gap: 10 }} px={3}>
                <IconBox icon={<CheckCircle size={24} />} color="primary1" sx={{ flexShrink: 0 }} />
                <Type.Body>{value}</Type.Body>
              </Flex>
              <Flex sx={{ alignItems: 'center', justifyContent: 'center' }} px={3}>
                <Type.Body px={3} textAlign="center" fontWeight={500}>
                  {planConfigs.basic[index]}
                </Type.Body>
              </Flex>
              <Flex sx={{ alignItems: 'center', justifyContent: 'center' }} px={3}>
                <Type.Body px={3} textAlign="center" fontWeight={500}>
                  {planConfigs.premium[index]}
                </Type.Body>
              </Flex>
              <Flex sx={{ alignItems: 'center', justifyContent: 'center' }} px={3}>
                <Type.Body px={3} textAlign="center" fontWeight={500}>
                  {planConfigs.vip[index]}
                </Type.Body>
              </Flex>
            </PlanRowWrapper>
          ))}
          <PlanRowWrapper>
            <Box />
            <Box />
            <Box>
              <Flex sx={{ alignItems: 'center', justifyContent: 'center' }} px={3}>
                <MintButton planPrice={pricePremium?.bn} plan={SubscriptionPlanEnum.PREMIUM} />
              </Flex>
              <Button
                mt={2}
                block
                variant="ghostPrimary"
                onClick={() => setPreviewPlan(SubscriptionPlanEnum.PREMIUM)}
                sx={{ fontWeight: 400, color: 'primary2', '&:hover:not(:disabled)': { color: 'primary1' } }}
              >
                Preview Premium NFT
              </Button>
            </Box>
            <Box>
              <Flex sx={{ alignItems: 'center', justifyContent: 'center' }} px={3}>
                <MintButton
                  planPrice={priceVip?.bn}
                  plan={SubscriptionPlanEnum.VIP}
                  bgType="2"
                  disabled
                  buttonText="Coming Soon"
                />
              </Flex>
              <Button
                mt={2}
                block
                variant="ghostPrimary"
                onClick={() => setPreviewPlan(SubscriptionPlanEnum.VIP)}
                sx={{ fontWeight: 400, color: 'primary2', '&:hover:not(:disabled)': { color: 'primary1' } }}
              >
                Preview VIP NFT
              </Button>
            </Box>
          </PlanRowWrapper>
        </Flex>
      </Box>
      <PreviewNFT plan={previewPlan} onDismiss={() => setPreviewPlan(null)} />
      <Tooltips />
    </Box>
  )
}

function PreviewNFT({ plan, onDismiss }: { plan: SubscriptionPlanEnum | null; onDismiss: () => void }) {
  if (!plan) return null
  return (
    <Modal isOpen={!!plan} onDismiss={onDismiss}>
      <Box sx={{ position: 'relative' }}>
        <IconBox
          icon={<XCircle size={24} />}
          role="button"
          onClick={onDismiss}
          sx={{ position: 'absolute', top: 1, right: 1, zIndex: 1 }}
        />
        <NFTSubscriptionCard data={{ tierId: plan }} />
      </Box>
    </Modal>
  )
}

export function MobilePlans() {
  const planConfigs = usePlanConfigs()
  const priceData = useSubscriptionPlanPrice()
  const pricePremium = priceData[SubscriptionPlanEnum.PREMIUM]
    ? new Num(priceData[SubscriptionPlanEnum.PREMIUM].price)
    : undefined
  const priceVip = priceData[SubscriptionPlanEnum.VIP] ? new Num(priceData[SubscriptionPlanEnum.VIP].price) : undefined
  const [previewPlan, setPreviewPlan] = useState<SubscriptionPlanEnum | null>(null)
  return (
    <>
      <Flex
        sx={{ flexDirection: 'column', gap: 3, p: 3, borderRadius: '4px', border: 'small', borderColor: 'neutral4' }}
        mb={20}
      >
        <Type.LargeBold textAlign="center">
          <Trans>Basic Plan (FREE)</Trans>
        </Type.LargeBold>
        {planConfigs.features.map((label, index) => (
          <MobilePlanItem label={label} value={planConfigs.basic[index]} />
        ))}
      </Flex>
      <Flex
        mb={3}
        sx={{
          flexDirection: 'column',
          gap: 3,
          p: 3,
          borderRadius: '4px',
          border: 'small',
          borderColor: 'neutral4',
          bg: 'neutral5',
        }}
      >
        <Type.LargeBold textAlign="center" color="orange1">
          <Trans>Premium Plan</Trans> ({pricePremium?.str ?? '--'}ETH /30days)
        </Type.LargeBold>
        {planConfigs.features.map((label, index) => (
          <MobilePlanItem label={label} value={planConfigs.premium[index]} />
        ))}
        <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <MintButton planPrice={pricePremium?.bn} plan={SubscriptionPlanEnum.PREMIUM} />
        </Flex>
        <Button
          block
          variant="ghostPrimary"
          onClick={() => setPreviewPlan(SubscriptionPlanEnum.PREMIUM)}
          sx={{ p: 0, fontWeight: 400, color: 'primary2', '&:hover:not(:disabled)': { color: 'primary1' } }}
        >
          Preview Premium NFT
        </Button>
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
        }}
      >
        <Type.LargeBold textAlign="center" color="violet">
          <Trans>VIP Plan</Trans> ({priceVip?.str ?? '--'}ETH /30days)
        </Type.LargeBold>
        {planConfigs.features.map((label, index) => (
          <MobilePlanItem label={label} value={planConfigs.vip[index]} />
        ))}
        <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <MintButton planPrice={priceVip?.bn} plan={SubscriptionPlanEnum.VIP} bgType="2" />
        </Flex>
        <Button
          block
          variant="ghostPrimary"
          onClick={() => setPreviewPlan(SubscriptionPlanEnum.VIP)}
          sx={{ p: 0, fontWeight: 400, color: 'primary2', '&:hover:not(:disabled)': { color: 'primary1' } }}
        >
          Preview VIP NFT
        </Button>
      </Flex>
      <PreviewNFT plan={previewPlan} onDismiss={() => setPreviewPlan(null)} />
      <Tooltips />
    </>
  )
}

export function MobilePlanItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Flex sx={{ alignItems: 'start', gap: [0, 4] }}>
      <Flex sx={{ alignItems: 'start', gap: 2, width: [168, 270, 400], flexShrink: 0 }}>
        <IconBox icon={<CheckCircle size={20} />} color="primary1" sx={{ flexShrink: 0 }} />
        <Type.Caption>{label}</Type.Caption>
      </Flex>
      <Type.CaptionBold width="100%" textAlign={['right', 'left']}>
        {value}
      </Type.CaptionBold>
    </Flex>
  )
}

function PlanDecorators() {
  return (
    <>
      {/* Light */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%) translateY(-50%)',
          width: ['100%', '100%', 716],
          height: 175,
          borderRadius: 200,
          background: 'radial-gradient(75.94% 115.68% at 73.2% 6.65%, #FFF 0%, #3EA2F4 27.6%, #423EF4 100%)',
          filter: 'blur(85.5px)',
        }}
      />
      {/* Glass */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          borderRadius: '4px',
          border: '0.5px solid',
          borderColor: 'neutral4',
          backdropFilter: 'blur(8px)',
          background:
            'linear-gradient(259deg, rgba(62, 162, 244, 0.05) 4.64%, rgba(0, 0, 0, 0.10) 64.5%, rgba(66, 62, 244, 0.04) 99.63%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          mixBlendMode: 'soft-light',
        }}
      />
      {/* Premium Glass */}
      <Box
        sx={{
          position: 'absolute',
          right: '300px',
          top: '-18px',
          bottom: '-18px',
          width: '300px',
          borderRadius: '4px',
          background:
            'linear-gradient(198deg, rgba(62, 162, 244, 0.22) 3.06%, rgba(0, 41, 75, 0.40) 46.94%, rgba(66, 62, 244, 0.17) 98.26%)',
          backdropFilter: 'blur(80px)',
        }}
      >
        <Box
          sx={{
            bg: 'neutral7',
            position: 'absolute',
            zIndex: 0,
            width: 105,
            height: 36,
            lineHeight: '36px',
            textAlign: 'center',
            top: 0,
            left: '50%',
            transform: 'translateY(-50%) translateX(-50%)',
            borderRadius: '4px',
          }}
        />
        <Type.Body
          sx={{
            width: 105,
            height: 36,
            position: 'absolute',
            lineHeight: '36px',
            textAlign: 'center',
            top: 0,
            left: '50%',
            transform: 'translateY(-50%) translateX(-50%)',
            zIndex: 1,
            borderRadius: '4px',
            background:
              'linear-gradient(90deg, #ABECA2 -1.42%, rgba(47, 179, 254, 0.5) 30.38%, rgba(106, 142, 234, 0.3) 65.09%, rgba(161, 133, 244, 0.15) 99.55%)',
          }}
        >
          Popular
        </Type.Body>
      </Box>
      {/* <Box
        sx={{
          position: 'absolute',
          right: '8px',
          top: '8px',
          bottom: '8px',
          width: '278px',
          borderRadius: '4px',
          border: '0.5px solid',
          borderColor: '#DCBFF270',
          background: 'linear-gradient(180deg, rgba(62, 162, 244, 0.05) 0%, rgba(66, 62, 244, 0.05) 100%)',
          boxShadow: '1px 0px 6px 0px #3D7AF0',
          backdropFilter: 'blur(16px)',
        }}
      /> */}
      {/* Lines */}
      <Box
        sx={{
          top: 155,
          left: 0,
          position: 'absolute',
          width: '100%',
          height: '1px',
          background:
            'linear-gradient(270deg, rgba(226, 226, 226, 0) 0%, rgba(123, 218, 239, 0.65) 44.79%, rgba(226, 226, 226, 0) 100%)',
        }}
      />
      <Box
        sx={{
          right: 900,
          top: 0,
          position: 'absolute',
          width: '1px',
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(226, 226, 226, 0) 0%, rgba(123, 218, 239, 0.65) 44.79%, rgba(226, 226, 226, 0) 100%)',
        }}
      />
      <Box
        sx={{
          top: 0,
          right: 600,
          position: 'absolute',
          width: '1px',
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(226, 226, 226, 0) 0%, rgba(123, 218, 239, 0.65) 44.79%, rgba(226, 226, 226, 0) 100%)',
        }}
      />
      <Box
        sx={{
          top: 0,
          right: 300,
          position: 'absolute',
          width: '1px',
          height: '100%',
          background:
            'linear-gradient(180deg, rgba(226, 226, 226, 0) 0%, rgba(123, 218, 239, 0.65) 44.79%, rgba(226, 226, 226, 0) 100%)',
        }}
      />
    </>
  )
}

export function usePlanConfigs() {
  const { volumeLimit } = useSystemConfigContext()
  return {
    features: [
      <Trans>Trader to copy</Trans>,
      <Trans>Data filter</Trans>,
      <Trans>Custom trader percentile rank</Trans>,
      <Trans>Join Copin Elite club</Trans>,
      <Trans>Alert traders signal</Trans>,
      <Trans>Trader data source to copy</Trans>,
      <p>
        <Trans>
          Copy size if non-referral Copin on CEX <TooltipIcon id="vip-referral" />
        </Trans>
      </p>,
      <p>
        <Trans>
          Copy size if referral Copin on CEX <TooltipIcon id="vip-referral" />
        </Trans>
      </p>,
      <p>
        <Trans>Copy hot trader</Trans> <TooltipIcon id="vip-hot-trader" />
      </p>,
      <Trans>CEX account connection</Trans>,
      <Trans>VIP support and exclusive signal</Trans>,
      <Trans>License copyright of Copin</Trans>,
      <Trans>Platform</Trans>,
    ],
    basic: [
      <Trans>Up to 3 traders</Trans>,
      <Trans>Last 60 days</Trans>,
      <Trans>No</Trans>,
      <Trans>No</Trans>,
      <Trans>10 traders</Trans>,
      <Trans>4 perpetual DEX: GMX, GMXV2, Kwenta, Polynomial</Trans>,
      <Trans>Maximum ${formatNumber(volumeLimit?.volumeWoReferral, 0, 0)}</Trans>,
      <Trans>Maximum ${formatNumber(volumeLimit?.volumeReferral, 0, 0)}</Trans>,
      <Trans>No</Trans>,
      <Trans>2 exchanges (BingX, Bitget)</Trans>,
      <Trans>No</Trans>,
      <Trans>Personal</Trans>,
      <Trans>https://app.copin.io</Trans>,
    ],
    premium: [
      <Trans>Unlimited</Trans>,
      <Trans>Unlimited</Trans>,
      <Box as="span" color="orange1">
        <Trans>Yes</Trans>
      </Box>,
      <Trans>No</Trans>,
      <Trans>50 traders</Trans>,
      <Trans>4 perpetual DEX: GMX, GMXV2, Kwenta, Polynomial</Trans>,
      <Trans>Maximum ${formatNumber(volumeLimit?.volumePremiumWoReferral, 0, 0)}</Trans>,
      <Trans>Maximum ${formatNumber(volumeLimit?.volumePremiumReferral, 0, 0)}</Trans>,
      <Box as="span" color="orange1">
        <Trans>Yes</Trans>
      </Box>,
      <Trans>2 exchanges (BingX, Bitget)</Trans>,
      <Trans>No</Trans>,
      <Trans>Personal</Trans>,
      <Trans>https://app.copin.io</Trans>,
    ],
    vip: [
      <Trans>Unlimited</Trans>,
      <Trans>Unlimited</Trans>,
      <Box as="span" color="violet">
        <Trans>Yes</Trans>
      </Box>,
      <Box as="span" color="violet">
        <Trans>Yes</Trans>
      </Box>,
      <Trans>100 traders</Trans>,
      <p>
        <Trans>5 perpetual DEX: GMX, GMXv2, Kwenta, Polynomial, gTrade and more...</Trans>{' '}
        <TooltipIcon id="vip-source-copy" />
      </p>,
      <Trans>Maximum ${formatNumber(volumeLimit?.volumeVipWoReferral, 0, 0)}</Trans>,
      <Trans>Maximum ${formatNumber(volumeLimit?.volumeVipReferral, 0, 0)}</Trans>,
      <Box as="span" color="violet">
        <Trans>Yes</Trans>
      </Box>,
      <p>
        <p>
          <Trans>6 exchanges and more... (BingX, Bitget, OKX, Gate, ByBit, Binance)</Trans>
        </p>
        <Box as="p" color="primary2">
          <Trans>(Go live on 1st May)</Trans>
        </Box>
      </p>,
      <Box as="span" color="violet">
        <Trans>Yes</Trans>
      </Box>,
      <Trans>Personal</Trans>,
      <p>
        <Trans>https://vip.copin.io</Trans> <TooltipIcon id="vip-platform" />
      </p>,
    ],
  }
}

function TooltipIcon({ id, sx = {} }: { id: string; sx?: any }) {
  return <IconBox color="neutral2" data-tooltip-id={id} icon={<Info size={14} />} sx={{ ...sx }} />
}

export function Tooltips() {
  return (
    <>
      <Tooltip id="vip-non-referral">
        <Type.Caption color="neutral2" maxWidth={300}>
          The size is include leverage, Maximum size per exchange.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="vip-referral">
        <Type.Caption color="neutral2" maxWidth={300}>
          The size is include leverage, Maximum size per exchange.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="vip-hot-trader">
        <Type.Caption color="neutral2" maxWidth={300}>
          Hot trader is trader has more than 10 copiers are following.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="vip-platform">
        <Type.Caption color="neutral2" maxWidth={300}>
          More powerful tools to management.
        </Type.Caption>
      </Tooltip>
      <Tooltip id="vip-source-copy">
        <Type.Caption color="neutral2" maxWidth={300}>
          Early access to our data indexing.
        </Type.Caption>
      </Tooltip>
    </>
  )
}
