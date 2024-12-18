import { Trans } from '@lingui/macro'

import { Box, Flex } from 'theme/base'

import { GradientText } from './GradientText'

const gradientColor = 'linear-gradient(90deg, #ABECA2 -1.42%, #2FB3FE 30.38%, #6A8EEA 65.09%, #A185F4 99.55%)'

export default function BetaTag() {
  return (
    <Flex
      sx={{
        backgroundImage: gradientColor,
        position: 'relative',
        fontWeight: 500,
        p: '1px',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '2px',
        overflow: 'hidden',
        fontSize: '10px',
      }}
    >
      <Box as="span" sx={{ lineHeight: '14px', bg: 'neutral7', px: '2px', borderRadius: '2px' }}>
        <GradientText bg={gradientColor}>
          <Trans>Beta</Trans>
        </GradientText>
      </Box>
    </Flex>
  )
}
