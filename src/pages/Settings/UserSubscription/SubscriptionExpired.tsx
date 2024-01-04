import { Trans } from '@lingui/macro'
import { WarningCircle } from '@phosphor-icons/react'

import useSubscriptionPlanPrice from 'hooks/features/useSubscriptionPlanPrice'
import Alert from 'theme/Alert'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'

import { MINT_MODAL_LABELS, PricingDropdown } from './PricingOptions'

export default function SubscriptionExpired() {
  const pricePlanData = useSubscriptionPlanPrice()

  if (!pricePlanData) return <></>

  return (
    <>
      <Type.LargeBold mb={3}>
        <Trans>Mint new NFT</Trans>
      </Type.LargeBold>
      <Alert
        variant="primary"
        message={
          <Flex sx={{ gap: 2, alignItems: 'center' }}>
            <IconBox icon={<WarningCircle size={16} />} />
            <Box as="span">
              <Trans>Note:</Trans>
            </Box>
          </Flex>
        }
        description={
          <Trans>
            You&apos;ll still have access to Premium after your NFT expires in 30 minutes. Keep an eye on the renewal
            time.
          </Trans>
        }
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          textAlign: 'left',
          bg: `${themeColors.primary1}15`,
          color: 'primary1',
          borderColor: 'primary1',
        }}
      />

      <Box mt={24} />
      <PricingDropdown
        method="mint"
        buttonLabel={<Trans>Mint</Trans>}
        modalLabels={MINT_MODAL_LABELS}
        buttonSx={{ width: ['100%', 200] }}
      />
    </>
  )
}
