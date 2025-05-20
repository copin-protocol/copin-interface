/* eslint-disable react/jsx-key */
import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'

import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'

import PinIcon from './PinIcon'

export default function TermsAndConditions({ text: Text = Type.Body }: { text?: typeof Type.Body }) {
  return (
    <Box
      sx={{
        p: [16, 16, 24],
        borderRadius: '4px',
        border: 'small',
        borderColor: 'neutral4',
        backdropFilter: 'blur(10px)',
        background: 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <Flex
        mb={24}
        sx={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Type.BodyBold
          sx={{
            width: 'max-content',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            p: '4px 7px 4px 4px',
            borderRadius: '2px',
            border: '1px solid rgba(49, 56, 86, 0.20)',
            background: 'linear-gradient(92deg, rgba(151, 207, 253, 0.20) 57.35%, rgba(78, 174, 253, 0.20) 96.57%)',
          }}
        >
          <Box sx={{ width: '4px', height: '24px', bg: 'primary1' }} />
          <Box as="span">
            <Trans>Terms And Conditions</Trans>
          </Box>
        </Type.BodyBold>
        <Flex as="a" href={LINKS.subscriptionDocument} target="_blank" sx={{ gap: 2 }}>
          <Type.Body>
            <Trans>READ MORE</Trans>
          </Type.Body>
          <IconBox color="inherit" icon={<ArrowSquareOut size={20} />} />
        </Flex>
      </Flex>
      {termConfigs.map((value, index) => {
        return (
          <Flex key={index} mb={12} sx={{ gap: 1 }}>
            <IconBox icon={<PinIcon />} sx={{ flexShrink: 0 }} />
            <Text color="neutral2">{value}</Text>
          </Flex>
        )
      })}
    </Box>
  )
}
const termConfigs = [
  <Trans>To unlock premium and VIP features, mint a Copin NFT.</Trans>,
  <Trans>
    Your premium status lasts for 30 days, after which the NFT expires and cannot be used for premium access. To
    continue, mint a new NFT.
  </Trans>,
  <Trans>A 10% loyalty fee applies when trading the NFT.</Trans>,
  <Trans>Benefits in each plan are added or removed continuously without prior notice.</Trans>,
  <Trans>Prices may be changed by Copin depending on the project&apos;s performance and operations.</Trans>,
  <Trans>Refund not accepted.</Trans>,
  <p>
    <Trans>
      Exclusive Copin Elite Club Membership: Join the inner circle and connect with a community of experts for superior
      trading insights.
    </Trans>{' '}
    <a href={LINKS.copinEliteClub} target="_blank" rel="noreferrer">
      <Box alignItems="center" sx={{ gap: 1, display: 'inline-flex' }}>
        <Trans>More</Trans>
        <ArrowSquareOut />
      </Box>
    </a>
  </p>,
  <Trans>
    When creating copy trades via Hyperliquid (or from Copin Lite), there is no size limit for copy trading and no
    restriction on the number of hot traders you can follow. The size limit is calculated based on the total copy trades
    of the respective trader.
  </Trans>,
]
