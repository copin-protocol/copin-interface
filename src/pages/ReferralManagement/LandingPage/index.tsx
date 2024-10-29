import {
  ArrowRight,
  BoundingBox,
  Icon,
  LightbulbFilament,
  MedalMilitary,
  TreasureChest,
  UsersFour,
} from '@phosphor-icons/react'
import { ReactNode } from 'react'

import { GradientText } from 'components/@ui/GradientText'
import { Box, Flex, Grid, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'

import Tiers from './Tiers'

export default function LandingPage() {
  return (
    <Box display={['block', 'block', 'flex']} sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Box
        height={['auto', 'auto', 272]}
        width="100%"
        sx={{
          flexShrink: 0,
          position: 'relative',
          backgroundImage: [
            'none',
            'none',
            'linear-gradient(90deg, rgba(62, 162, 244, 0) 13.07%, rgba(66, 62, 244, 0.1) 103.18%)',
          ],
        }}
      >
        <Box px={40} pt={40} maxWidth={380} mb={[-16, -16, 0]}>
          <Type.LargeBold mb={12}>Unlock Rewards with the Copin Referral Program</Type.LargeBold>
          <Type.Caption color="neutral2">
            Earn rebates and commissions by inviting friends. Grow your network and benefit from our 6-tier reward
            system.
          </Type.Caption>
          {/* <Flex
            as={Link}
            to={ROUTES.REFERRAL_MANAGEMENT.path}
            sx={{ alignItems: 'center', gap: 2, color: 'primary2', '&:hover': { color: 'primary1' } }}
          >
            <Type.Caption sx={{ fontWeight: 600 }}>View referral Ranking</Type.Caption>
            <ArrowRight size={16} />
          </Flex> */}
        </Box>
        <Box
          sx={{
            position: ['relative', 'relative', 'absolute'],
            bottom: 0,
            right: 0,
            zIndex: 1,
            display: 'flex',
            width: ['auto', '100%', 'auto'],
            justifyContent: 'end',
            pr: [0, 0, 48],
            py: [0, 0, 1],
          }}
        >
          <Tiers />
        </Box>
      </Box>
      <Box sx={{ p: 3, borderTop: ['none', 'none', 'small'], borderTopColor: ['none', 'none', 'neutral4'] }}>
        <Flex mb={12} sx={{ alignItems: 'center', gap: 2 }}>
          <IconBox icon={<LightbulbFilament size={24} />} sx={{ color: 'neutral3' }} />
          <Type.Body sx={{ fontWeight: 500 }}>How It Works?</Type.Body>
        </Flex>
        <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr', '1fr 1fr', '1fr 1fr', '1fr 1fr 1fr 1fr'], gap: 2 }}>
          <ItemHow
            icon={BoundingBox}
            title={'1. Two-Level Referral System'}
            description={'Invite friends and earn from two levels: F1 (your referrals) and F2 (their referrals)'}
          />
          <ItemHow
            icon={UsersFour}
            title={'2. Earn Rebates & Commissions'}
            description={'Earn rebates on your trades and commissions from F1 and F2.'}
          />
          <ItemHow
            icon={TreasureChest}
            title={'3. Claim Daily Rewards'}
            description={'Rewards are credited after trades close and claimable daily at 0:00 UTC.'}
          />
          <ItemHow
            icon={MedalMilitary}
            title={'4. Referral Tier System'}
            description={'Your tier is based on total fees paid by F0, F1, and F2 over the last 30 days'}
          />
        </Grid>
      </Box>
      <Flex
        pb={[36, 36, 16]}
        sx={{ flex: 1, width: '100%', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
      >
        <Flex
          sx={{ p: [12, 12, 12, 12, 24], bg: 'neutral6', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        >
          <Type.BodyBold mb={1} sx={{ textAlign: 'center', maxWidth: '300px' }}>
            Apply{' '}
            <GradientText bg="linear-gradient(90deg, #ABECA2 -1.42%, #2FB3FE 30.38%, #6A8EEA 65.09%, #A185F4 99.55%)">
              Copin Affilate Program
            </GradientText>{' '}
            to get more benefits!
          </Type.BodyBold>
          <Flex
            as="a"
            href={LINKS.support}
            sx={{ alignItems: 'center', gap: 2, color: 'primary1', '&:hover': { color: 'primary2' } }}
            target="_blank"
          >
            <Type.Caption sx={{ fontWeight: 600 }}>Contact us</Type.Caption>
            <ArrowRight size={16} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

function ItemHow({
  icon: IconComponent,
  title,
  description,
}: {
  icon: Icon
  title: ReactNode
  description: ReactNode
}) {
  return (
    <Box sx={{ p: 3, borderRadius: '2px', border: 'small', borderColor: 'neutral4' }}>
      <Box
        mb={24}
        sx={{
          position: 'relative',
          p: 2,
          borderRadius: '2px',
          overflow: 'hidden',
          width: 'max-content',
          height: 'max-content',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            backgroundImage:
              'conic-gradient(from 124.76deg at 49.86% 36.95%, #A185F4 -5.64deg, #ABECA2 0.06deg, #2FB3FE 111.61deg, #6A8EEA 233.41deg, #A185F4 354.35deg, #ABECA2 360.06deg)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            // backgroundBlendMode: 'overlay',
            backdropFilter: 'blur(10px)',
            // background: 'rbga(0, 0, 0, 0.1)',
            // backgroundImage:
            //   'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0.01%, rgba(4, 9, 20, 0.2) 31.13%, rgba(255, 255, 255, 0.2) 110.67%)',
          }}
        />
        <IconBox icon={<IconComponent size={30} />} sx={{ color: 'neutral1', position: 'relative', zIndex: 2 }} />
      </Box>
      <Type.Body mb={2} sx={{ fontWeight: 500 }}>
        {title}
      </Type.Body>
      <Type.Caption color="neutral2">{description}</Type.Caption>
    </Box>
  )
}
