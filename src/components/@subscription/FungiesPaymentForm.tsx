import { Trans } from '@lingui/macro'
import React from 'react'
import { useQuery } from 'react-query'

import { getSubscriptionFungiesPackagesApi } from 'apis/subscription'
import Divider from 'components/@ui/Divider'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import { Box, Flex, Li, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { formatNumber } from 'utils/helpers/format'

export default function FungiesPaymentForm({
  taxPercent,
  plan,
  period,
}: {
  taxPercent: number
  plan: SubscriptionPlanEnum
  period: number
}) {
  const { profile } = useAuthContext()
  const { data: packages, isLoading } = useQuery(
    QUERY_KEYS.GET_SUBSCRIPTION_FUNGIES_PACKAGES,
    getSubscriptionFungiesPackagesApi,
    {
      enabled: !!profile,
    }
  )
  const subscriptionPackage = packages?.find((p) => p.plan === plan && p.durationInMonths === period)
  return isLoading ? (
    <Loading />
  ) : subscriptionPackage && profile?.username ? (
    <>
      <Flex
        sx={{
          borderRadius: 'sm',
          bg: 'neutral5',
          p: 2,
          my: 3,
          width: '100%',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Type.Caption color="neutral2" width="50%">
          <Trans>Sub Total</Trans>
        </Type.Caption>
        <Type.Caption color="neutral2" width="50%" textAlign="right">
          <Trans>${formatNumber(subscriptionPackage.price, 2, 2)}</Trans>
        </Type.Caption>
        <Type.Caption color="neutral2" width="50%">
          <Trans>Taxes</Trans>
        </Type.Caption>
        <Type.Caption color="neutral2" width="50%" textAlign="right">
          <Trans>${formatNumber(subscriptionPackage.price * taxPercent, 2, 2)}</Trans>
        </Type.Caption>
        <Divider sx={{ width: '100%', mt: 2, mb: 1 }} />
        <Type.BodyBold width="50%" mt={1}>
          <Trans>Total</Trans>
        </Type.BodyBold>
        <Type.BodyBold width="50%" textAlign="right" mt={1}>
          <Trans>${formatNumber(subscriptionPackage.price * (1 + taxPercent), 2, 2)}</Trans>
        </Type.BodyBold>
      </Flex>
      <Box as="ul" my={3}>
        <Li>
          <Type.Caption color="green1">
            <Trans>
              Your subscription renews automatically at the end of each billing cycle. You can cancel auto-renew
              anytime.
            </Trans>
          </Type.Caption>
        </Li>
        <Li>
          <Type.Caption color="neutral2">
            <Trans>You will be redirected to the payment gateway.</Trans>
          </Type.Caption>
        </Li>
        <Li>
          <Type.Caption color="neutral2">
            <Trans>The new plan will start within 10 minutes after the payment is successful.</Trans>
          </Type.Caption>
        </Li>
      </Box>
      <a href={subscriptionPackage.checkoutElementUrl.replace('{username}', profile.username)}>
        <Button variant="primary" sx={{ width: '100%' }}>
          <Trans>Process To Checkout</Trans>
        </Button>
      </a>
    </>
  ) : (
    <Type.Caption color="neutral2" sx={{ bg: 'neutral6', p: 2, borderRadius: 'sm', textAlign: 'center' }}>
      <Trans>Sorry, we can&apos;t process your payment now. Please try again later.</Trans>
    </Type.Caption>
  )
}
