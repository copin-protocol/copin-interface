// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import { useState } from 'react'
import { useQuery } from 'react-query'

import { getPaymentCurrenciesApi } from 'apis/subscription'
import { useAuthContext } from 'hooks/web3/useAuth'
import Label from 'theme/InputField/Label'
import Modal from 'theme/Modal'
import RadioGroup from 'theme/RadioGroup'
import { Box, Flex, Image, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { PlanConfig } from 'utils/config/subscription'

import CryptoPaymentForm from './CryptoPaymentForm'
import FungiesPaymentForm from './FungiesPaymentForm'
import PeriodSelector from './PeriodSelector'

export default function PaySubscriptionModal({
  plan,
  period,
  onDismiss,
  isExtend = false,
}: {
  plan: PlanConfig
  period: number
  onDismiss: () => void
  isExtend?: boolean
}) {
  return (
    <Modal
      isOpen
      title={isExtend ? <Trans>Extend Subscription</Trans> : <Trans>Payment Details</Trans>}
      onDismiss={onDismiss}
      dismissable={false}
      hasClose
    >
      <PaySubscriptionForm plan={plan} period={period} isExtend={isExtend} />
    </Modal>
  )
}

enum PaymentMethodEnum {
  FUNGIES = 'FUNGIES',
  CRYPTO = 'CRYPTO',
}

const FUNGIES_TAX_PERCENT = 0.05

const PAYMENT_METHODS_OPTIONS = [
  {
    value: PaymentMethodEnum.CRYPTO,
    label: <Trans>Crypto</Trans>,
  },
  {
    value: PaymentMethodEnum.FUNGIES,
    label: (
      <Flex>
        <Trans>Credit / Debit Card</Trans>
        <Type.SmallBold
          sx={{
            bg: 'neutral4',
            px: 2,
            borderRadius: '8px',
            ml: 2,
          }}
          color="neutral1"
        >
          <Trans>Taxes {FUNGIES_TAX_PERCENT * 100}%</Trans>
        </Type.SmallBold>
      </Flex>
    ),
  },
]

function PaySubscriptionForm({
  plan,
  period: defaultPeriod,
  isExtend,
}: {
  plan: PlanConfig
  period: number
  isExtend: boolean
}) {
  const { profile } = useAuthContext()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(PaymentMethodEnum.CRYPTO)
  const [period, setPeriod] = useState(defaultPeriod)

  const { data: currencies } = useQuery(QUERY_KEYS.GET_PAYMENT_CURRENCIES, getPaymentCurrenciesApi, {
    enabled: !!profile,
  })

  return (
    <Box px={3} pb={3} minHeight={300}>
      <Flex
        sx={{
          gap: 2,
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Image height={48} src={`/images/subscriptions/${plan.title}_FULL.png`} alt={`${plan.title} plan`} />
        <Box flex="1">
          <Type.CaptionBold color={plan.color} display="block">
            {plan.title} PLAN
          </Type.CaptionBold>
          <Type.Caption color="neutral2">
            {isExtend ? (
              <Trans>
                You will extend <b>{period * 30} days</b> from your{' '}
                <Box as="span" sx={{ textTransform: 'capitalize' }}>
                  {plan.title}
                </Box>{' '}
                plan
              </Trans>
            ) : (
              <Trans>
                You will receive <b>{period * 30} days</b> of{' '}
                <Box as="span" sx={{ textTransform: 'capitalize' }}>
                  {plan.title}
                </Box>{' '}
                plan
              </Trans>
            )}
          </Type.Caption>
        </Box>
      </Flex>
      {!isExtend && (
        <Flex sx={{ gap: 3, mb: 3 }}>
          <PeriodSelector onChange={() => setPeriod(1)} isActive={period === 1} period={1} plan={plan} />
          <PeriodSelector onChange={() => setPeriod(12)} isActive={period === 12} period={12} plan={plan} />
        </Flex>
      )}
      <Label label={<Trans>Payment Method</Trans>} />
      <RadioGroup
        sx={{ mb: 3 }}
        block
        direction="column"
        options={PAYMENT_METHODS_OPTIONS}
        value={paymentMethod}
        onChange={(newValue: string | number | undefined) => {
          setPaymentMethod(newValue as PaymentMethodEnum)
        }}
      />

      {paymentMethod === PaymentMethodEnum.CRYPTO && currencies && (
        <CryptoPaymentForm currencies={currencies} period={period} plan={plan} />
      )}
      {paymentMethod === PaymentMethodEnum.FUNGIES && (
        <FungiesPaymentForm
          taxPercent={FUNGIES_TAX_PERCENT}
          plan={plan.title as SubscriptionPlanEnum}
          period={period}
        />
      )}
      <Type.Caption color="neutral2" mt={2} mb={1} textAlign="center">
        <Trans>By clicking button above you agreed with</Trans>{' '}
        <a href={LINKS.termOfUse} target="_blank" rel="noreferrer">
          <Trans>Terms of services</Trans>
        </a>
        .
      </Type.Caption>
    </Box>
  )
}
