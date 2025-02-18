/* eslint-disable react/jsx-key */
import { Trans } from '@lingui/macro'
import { CheckCircle, Info, XCircle } from '@phosphor-icons/react'
import { ReactNode, useState } from 'react'

import NFTSubscriptionCard from 'components/@widgets/NFTSubscriptionCard'
import Num from 'entities/Num'
import { SubscriptionCountData } from 'entities/user'
import useSubscriptionPlanPrice from 'hooks/features/subscription/useSubscriptionPlanPrice'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
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
import { getSubscriptionCount } from './helpers'
import { PlanRowWrapper } from './styled'

export default function Plans({
  subscriptionCountData,
}: {
  subscriptionCountData: SubscriptionCountData[] | undefined
}) {
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
              <Trans>BASIC PLAN</Trans>
            </Type.BodyBold>
            <Type.H2>
              <Trans>FREE</Trans>
            </Type.H2>
          </Flex>
          <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Flex mb={2} sx={{ alignItems: 'center', gap: 12 }}>
              <CrowIconGold />
              <Type.BodyBold color="orange1">
                <Trans>PREMIUM PLAN</Trans>
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
            <DesktopSubscriptionCount data={subscriptionCountData} plan={SubscriptionPlanEnum.PREMIUM} />
          </Flex>
          <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Flex mb={2} sx={{ alignItems: 'center', gap: 12 }}>
              <VipPlanIcon1 />
              <Type.BodyBold color="violet">
                <Trans>VIP PLAN</Trans>
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
            <DesktopSubscriptionCount data={subscriptionCountData} plan={SubscriptionPlanEnum.VIP} />
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
                  bgType="1"
                  // disabled
                  // buttonText="Coming Soon"
                  buttonText="Mint VIP NFT"
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

function DesktopSubscriptionCount({
  data,
  plan,
}: {
  data: SubscriptionCountData[] | undefined
  plan: SubscriptionPlanEnum
}) {
  const count = getSubscriptionCount({ data, plan })
  return (
    <Type.Caption color="neutral2" sx={{ position: 'absolute', bottom: 0, transform: 'translateY(-100%)' }}>
      <Trans>Minted: {formatNumber(count)} NFTs</Trans>
    </Type.Caption>
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

export function MobilePlans({ subscriptionCountData }: { subscriptionCountData: SubscriptionCountData[] | undefined }) {
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
          <Trans>BASIC PLAN (FREE)</Trans>
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
          <Trans>PREMIUM PLAN</Trans> ({pricePremium?.str ?? '--'}ETH /30days)
          <MobileSubscriptionCount data={subscriptionCountData} plan={SubscriptionPlanEnum.PREMIUM} />
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
          <MobileSubscriptionCount data={subscriptionCountData} plan={SubscriptionPlanEnum.VIP} />
        </Type.LargeBold>
        {planConfigs.features.map((label, index) => (
          <MobilePlanItem label={label} value={planConfigs.vip[index]} />
        ))}
        <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <MintButton planPrice={priceVip?.bn} plan={SubscriptionPlanEnum.VIP} bgType="1" />
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

function MobileSubscriptionCount({
  data,
  plan,
}: {
  data: SubscriptionCountData[] | undefined
  plan: SubscriptionPlanEnum
}) {
  const count = getSubscriptionCount({ data, plan })
  return (
    <Type.Caption color="neutral2" textAlign="center" display="block" mt={1}>
      <Trans>Minted: {formatNumber(count)} NFTs</Trans>
    </Type.Caption>
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
  const { volumeLimit } = useSystemConfigStore()
  return {
    features: [
      <Trans>Trader to copy</Trans>,
      <Trans>Data range</Trans>,
      <p>
        <Trans>Advanced data & visualization</Trans> <TooltipIcon id="advanced-data-visualization" />
      </p>,
      // <Trans>Join Copin Elite club</Trans>,
      <Trans>Alert traders signal</Trans>,
      <Trans>On-chain traders for copying</Trans>,
      <Trans>Copy size</Trans>,
      // <p>
      //   <Trans>
      //     Copy size if non-referral Copin on CEX <TooltipIcon id="vip-referral" />
      //   </Trans>
      // </p>,
      // <p>
      //   <Trans>
      //     Copy size if referral Copin on CEX <TooltipIcon id="vip-referral" />
      //   </Trans>
      // </p>,
      <p>
        <Trans>Copy hot trader</Trans> <TooltipIcon id="hot-trader" />
      </p>,
      <Trans>CEX account connection</Trans>,
      // <Trans>VIP support and exclusive signal</Trans>,
      <p>
        <Trans>VIP exclusive signal (group and APIs)</Trans> <TooltipIcon id="feature-alert" />
      </p>,
      <Trans>License copyright of Copin&apos;s signal</Trans>,
      <Trans>Alpha group access</Trans>,
      <Trans>Export CSV data</Trans>,
    ],
    basic: [
      <Trans>Unlimited</Trans>,
      <Trans>Unlimited</Trans>,
      <Trans>No</Trans>,
      <Trans>20 traders</Trans>,
      <Trans>All stable PerpDEX</Trans>,
      // <Trans>Maximum ${formatNumber(volumeLimit?.volumeWoReferral, 0, 0)}</Trans>,
      <Trans>Maximum ${formatNumber(200_000, 0, 0)}</Trans>,
      <Trans>Maximum copy size ${formatNumber(500, 0, 0)}</Trans>,
      <Trans>All stable CEX</Trans>,
      <Trans>No</Trans>,
      <Trans>Personal</Trans>,
      <Trans>No</Trans>,
      <Trans>No</Trans>,
    ],
    premium: [
      <Trans>Unlimited</Trans>,
      <Trans>Unlimited</Trans>,
      <Box as="span" color="orange1">
        <Trans>Yes</Trans>
      </Box>,
      <Trans>50 traders</Trans>,
      <Trans>All stable PerpDEX</Trans>,
      <Trans>Unlimited</Trans>,
      <Box as="span" color="orange1">
        <Trans>Maximum copy size ${formatNumber(200_000, 0, 0)}</Trans>
      </Box>,
      <Trans>All stable CEX</Trans>,
      <Trans>No</Trans>,
      <Trans>Personal</Trans>,
      <Trans>No</Trans>,
      <Trans>1000 records</Trans>,
    ],
    vip: [
      <Trans>Unlimited</Trans>,
      <Trans>Unlimited</Trans>,
      <Box as="span" color="violet">
        <Trans>Yes</Trans>
      </Box>,
      // <Box as="span" color="violet">
      //   <Trans>Yes</Trans>
      // </Box>,
      <Trans>100 traders</Trans>,
      <p>
        <Trans>All stable PerpDEX + Early access PerpDEX</Trans> <TooltipIcon id="vip-source-copy" />
      </p>,
      // <Trans>Maximum ${formatNumber(volumeLimit?.volumeVipWoReferral, 0, 0)}</Trans>,
      // <Trans>Maximum ${formatNumber(volumeLimit?.volumeVipReferral, 0, 0)}</Trans>,
      <Trans>Unlimited</Trans>,
      <Box as="span" color="violet">
        <Trans>Unlimited copy size</Trans>
      </Box>,
      <p>
        <Trans>All stable CEX + Exclusive CEX request</Trans> <TooltipIcon id="vip-cex-connection" />
      </p>,
      <Box as="span" color="violet">
        <Trans>Yes</Trans>
      </Box>,
      <Trans>Personal</Trans>,
      <Box as="span" color="violet">
        <Trans>Yes</Trans>
      </Box>,
      <Trans>10000 records</Trans>,
    ],
  }
}

function TooltipIcon({ id, sx = {} }: { id: string; sx?: any }) {
  return <IconBox color="neutral2" data-tooltip-id={id} icon={<Info size={14} />} sx={{ ...sx }} />
}

export function Tooltips() {
  return (
    <>
      <Tooltip id="feature-alert">
        <Type.Caption color="neutral2" maxWidth={300}>
          You will receive alerts when MM, insider trader, whale trader... trading
        </Type.Caption>
      </Tooltip>
      <Tooltip id="vip-cex-connection">
        <Type.Caption color="neutral2" maxWidth={300}>
          You can actively request additional CEXs that you want. Support is only provided for VIP packages of over 6
          months
        </Type.Caption>
      </Tooltip>
      <Tooltip id="advanced-data-visualization">
        <Type.Caption color="neutral2" maxWidth={300}>
          Ex: Custom trader percentile rank
        </Type.Caption>
      </Tooltip>
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
      <Tooltip id="hot-trader">
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
