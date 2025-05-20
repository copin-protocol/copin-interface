import { Trans } from '@lingui/macro'
import { WarningCircle } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

// import useSubscriptionPlanPrice from 'hooks/features/useSubscriptionPlanPrice'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
// import { SubscriptionPlanEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

// import { MINT_MODAL_LABELS, PricingDropdown } from './PricingOptions'

export default function SubscriptionExpired() {
  // const pricePlan = useSubscriptionPlanPrice()

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

      {/* <Box mt={24} /> */}
      <Flex mt={24} sx={{ alignItems: 'center', gap: 3 }}>
        <Button size="xs" variant="primary" as={Link} to={ROUTES.SUBSCRIPTION.path} sx={{ fontWeight: 600 }}>
          Mint New NFT
        </Button>
      </Flex>

      {/* <PricingDropdown
        method="mint"
        plan={SubscriptionPlanEnum.PREMIUM}
        planPrice={pricePlan[SubscriptionPlanEnum.PREMIUM]?.price}
        buttonLabel={<Trans>Mint Premium NFT</Trans>}
        modalLabels={MINT_MODAL_LABELS}
        buttonSx={{ width: ['100%', 200] }}
      />
      <Box mt={3} />
      <PricingDropdown
        method="mint"
        plan={SubscriptionPlanEnum.VIP}
        planPrice={pricePlan[SubscriptionPlanEnum.VIP]?.price}
        buttonLabel={<Trans>Mint VIP NFT</Trans>}
        modalLabels={MINT_MODAL_LABELS}
        buttonSx={{ width: ['100%', 200] }}
      /> */}
    </>
  )
}
