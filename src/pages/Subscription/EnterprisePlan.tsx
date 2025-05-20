import { Trans } from '@lingui/macro'
import { CheckCircle } from '@phosphor-icons/react'
import React from 'react'
import styled from 'styled-components/macro'

import { Button } from 'theme/Buttons'
import { Box, Flex, Grid, IconBox, Type } from 'theme/base'
import { linearGradient1 } from 'theme/colors'
import { LINKS } from 'utils/config/constants'

const EnterpriseWrapper = styled(Box)`
  position: relative;
  border-radius: 8px;
  padding: 1px;
  background: ${linearGradient1};
  margin-top: 48px;
  margin-bottom: 24px;
  overflow: hidden;
`

const EnterpriseContent = styled(Box)`
  border-radius: 7px;
  background: ${({ theme }) => theme.colors.neutral7};
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const FeatureItem = styled(Flex)`
  align-items: center;
  gap: 12px;
`
const TextGradient = styled(Type.LargeBold)`
  background: ${linearGradient1};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const EnterprisePlan: React.FC = () => {
  return (
    <EnterpriseWrapper>
      <EnterpriseContent>
        <Grid sx={{ gridTemplateColumns: ['1fr', '1fr', '1fr 1fr'], gap: 3, alignItems: 'center' }}>
          <Box textAlign="left">
            <TextGradient color="primary1" mb={2}>
              <Trans>ENTERPRISE</Trans>
            </TextGradient>

            <Type.H5 mb={2} color="white" sx={{ textTransform: 'none' }}>
              <Trans>Do you need more data or features?</Trans>
            </Type.H5>

            <Type.Body color="neutral3" mb={3} display="block">
              <Trans>Customize a pricing plan that scales to your business&apos; needs</Trans>
            </Type.Body>
            <a href={LINKS.support} target="_blank" rel="noreferrer">
              <Button variant="primary" width={['100%', '100%', 230]}>
                <Trans>CONTACT US</Trans>
              </Button>
            </a>
          </Box>

          <Grid sx={{ gridTemplateColumns: ['1fr', '1fr', '1fr', '2fr 3fr'], gap: 3, height: 'fit-content' }}>
            <FeatureItem>
              <IconBox color="primary1" icon={<CheckCircle size={24} />} />
              <Type.Body>
                <Trans>API access rights</Trans>
              </Type.Body>
            </FeatureItem>
            <FeatureItem>
              <IconBox color="primary1" icon={<CheckCircle size={24} />} />
              <Type.Body textAlign="left">
                <Trans>Custom license</Trans>
              </Type.Body>
            </FeatureItem>

            <FeatureItem>
              <IconBox color="primary1" icon={<CheckCircle size={24} />} />
              <Type.Body textAlign="left">
                <Trans>Custom call limits</Trans>
              </Type.Body>
            </FeatureItem>
            <FeatureItem>
              <IconBox color="primary1" icon={<CheckCircle size={24} />} />
              <Type.Body textAlign="left">
                <Trans>Start with $2000/month. 12-month contract</Trans>
              </Type.Body>
            </FeatureItem>
          </Grid>
        </Grid>
      </EnterpriseContent>
    </EnterpriseWrapper>
  )
}

export default EnterprisePlan
