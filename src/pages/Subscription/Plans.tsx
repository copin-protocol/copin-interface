/* eslint-disable react/jsx-key */
import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { CheckCircle } from '@phosphor-icons/react'

import Num from 'entities/Num'
import { CrowIconGold } from 'theme/Icons/CrowIcon'
import Loading from 'theme/Loading'
import { Box, Flex, IconBox, Type } from 'theme/base'

import MintButton from './MintButton'
import { PlanRowWrapper } from './styled'

export default function Plans({ planPrice }: { planPrice: BigNumber | undefined }) {
  const price = planPrice ? new Num(planPrice) : undefined
  return (
    <Box
      sx={{
        position: 'relative',
        width: ['100%', '100%', '100%', 824],
        height: 524,
        mx: 'auto',
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
            <Type.BodyBold mb={2}>
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
                {price ? (
                  `${price.str}`
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
        </PlanRowWrapper>
        <Flex sx={{ width: '100%', flexDirection: 'column', gap: 24, py: 24 }}>
          {planConfigs.features.map((value, index) => (
            <PlanRowWrapper key={index}>
              <Flex sx={{ alignItems: 'center', gap: 10 }} px={3}>
                <IconBox icon={<CheckCircle size={24} />} color="primary1" sx={{ flexShrink: 0 }} />
                <Type.Body>{value}</Type.Body>
              </Flex>
              <Flex sx={{ alignItems: 'center', justifyContent: 'center' }} px={3}>
                <Type.Body px={3}>{planConfigs.basic[index]}</Type.Body>
              </Flex>
              <Flex sx={{ alignItems: 'center', justifyContent: 'center' }} px={3}>
                <Type.Body px={3}>{planConfigs.premium[index]}</Type.Body>
              </Flex>
            </PlanRowWrapper>
          ))}
          <PlanRowWrapper>
            <Box />
            <Box />
            <Flex sx={{ alignItems: 'center', justifyContent: 'center' }} px={3}>
              <MintButton planPrice={planPrice} />
            </Flex>
          </PlanRowWrapper>
        </Flex>
      </Box>
    </Box>
  )
}

export function MobilePlans({ planPrice }: { planPrice: BigNumber | undefined }) {
  const price = planPrice ? new Num(planPrice) : undefined
  return (
    <>
      <Flex
        sx={{ flexDirection: 'column', gap: 3, p: 3, borderRadius: '4px', border: 'small', borderColor: 'neutral4' }}
        mb={20}
      >
        <Type.LargeBold textAlign="center">
          <Trans>Basic Plan (FREE)</Trans>
        </Type.LargeBold>
        {planConfigs.features.map((value, index) => (
          <Flex key={index} sx={{ alignItems: 'center', gap: 3 }}>
            <Flex sx={{ alignItems: 'center', gap: 10, width: 150, flexShrink: 0 }}>
              <IconBox icon={<CheckCircle size={24} />} color="primary1" sx={{ flexShrink: 0 }} />
              <Type.Body>{value}</Type.Body>
            </Flex>
            <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <Type.BodyBold>{planConfigs.basic[index]}</Type.BodyBold>
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
        }}
      >
        <Type.LargeBold textAlign="center" color="orange1">
          <Trans>Premium Plan</Trans> ({price?.str ?? '--'}ETH /30days)
        </Type.LargeBold>
        {planConfigs.features.map((value, index) => (
          <Flex key={index} sx={{ alignItems: 'center', gap: 3 }}>
            <Flex sx={{ alignItems: 'center', gap: 10, width: 150, flexShrink: 0 }}>
              <IconBox icon={<CheckCircle size={24} />} color="primary1" sx={{ flexShrink: 0 }} />
              <Type.Body>{value}</Type.Body>
            </Flex>
            <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <Type.BodyBold>{planConfigs.premium[index]}</Type.BodyBold>
            </Flex>
          </Flex>
        ))}
        <Flex sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <MintButton planPrice={planPrice} />
        </Flex>
      </Flex>
    </>
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
          right: '8px',
          top: '8px',
          bottom: '8px',
          width: '278px',
          borderRadius: '4px',
          background:
            'linear-gradient(198deg, rgba(62, 162, 244, 0.22) 3.06%, rgba(0, 41, 75, 0.40) 46.94%, rgba(66, 62, 244, 0.17) 98.26%)',
          backdropFilter: 'blur(80px)',
        }}
      />
      <Box
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
      />
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
          left: 236,
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
          right: 294,
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

export const planConfigs = {
  features: [
    <Trans>Copytrades</Trans>,
    <Trans>Data filter</Trans>,
    <Trans>Custom trader percentile rank</Trans>,
    <Trans>Join Copin Alpha Club</Trans>,
    <Trans>Alert traders signal</Trans>,
  ],
  basic: [
    <Trans>Up to 3 traders</Trans>,
    <Trans>Last 60 days</Trans>,
    <Trans>No</Trans>,
    <Trans>No</Trans>,
    <Trans>10 traders</Trans>,
  ],
  premium: [
    <Trans>Unlimited</Trans>,
    <Trans>Unlimited</Trans>,
    <Trans>Yes</Trans>,
    <Trans>Yes</Trans>,
    <Trans>50 traders</Trans>,
  ],
}
