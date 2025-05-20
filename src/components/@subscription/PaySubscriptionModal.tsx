// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import { CheckCircle, X } from '@phosphor-icons/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { getSubscriptionDiscountCodeApi, paySubscriptionApi } from 'apis/subscription'
import Divider from 'components/@ui/Divider'
import ToastBody from 'components/@ui/ToastBody'
import { PaymentCurrencyData } from 'entities/subscription'
import { useAuthContext } from 'hooks/web3/useAuth'
import Accordion from 'theme/Accordion'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import Input from 'theme/Input'
import Modal from 'theme/Modal'
import Select from 'theme/Select'
import { Box, Flex, IconBox, Image, Li, Type } from 'theme/base'
import { EMAIL_REGEX, LINKS } from 'utils/config/constants'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'
import { PlanConfig } from 'utils/config/subscription'
import { formatNumber } from 'utils/helpers/format'
import { getErrorMessage } from 'utils/helpers/handleError'

export default function PaySubscriptionModal({
  plan,
  period,
  currencies,
  onDismiss,
  isExtend = false,
}: {
  plan: PlanConfig
  period: number
  currencies: PaymentCurrencyData[]
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
      <PaySubscriptionForm plan={plan} period={period} currencies={currencies} isExtend={isExtend} />
    </Modal>
  )
}

function PeriodSelector({
  plan,
  isActive,
  period,
  onChange,
}: {
  plan: PlanConfig
  isActive: boolean
  period: number
  onChange: (period: number) => void
}) {
  return (
    <Box
      flex="1"
      role="button"
      onClick={() => onChange(period)}
      variant="card"
      sx={{ border: 'small', borderColor: isActive ? 'primary1' : 'neutral4', borderRadius: 'xs', p: 2 }}
    >
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Type.Caption color="neutral3">
          <Trans>Pay</Trans> {period === 12 ? <Trans>Yearly</Trans> : <Trans>Monthly</Trans>}
        </Type.Caption>
        {isActive && <IconBox icon={<CheckCircle size={18} />} color="green1" />}
      </Flex>
      <Box mt={1}>
        <Type.CaptionBold>
          $
          {formatNumber(
            (plan.price * period * (1 - (plan.discountByPeriod?.[period] || 0) / 100)) / (period === 12 ? 1 : period)
          )}
          /{period === 12 ? <Trans>year</Trans> : <Trans>month</Trans>}
        </Type.CaptionBold>
        {!!plan.discountByPeriod?.[period] && plan.discountByPeriod[period] > 0 && (
          <Type.SmallBold
            sx={{
              bg: isActive ? 'green1' : 'neutral3',
              px: 2,
              borderRadius: '8px',
              ml: 2,
            }}
            color="neutral8"
          >
            <Trans>Save {plan.discountByPeriod[period]}%</Trans>
          </Type.SmallBold>
        )}
      </Box>
    </Box>
  )
}

interface PaySubscriptionFormValues {
  period: number
  token: string
  chain: string
  discountCode: string
  refundEmail: string
}

function PaySubscriptionForm({
  plan,
  period: defaultPeriod,
  currencies,
  isExtend,
}: {
  plan: PlanConfig
  period: number
  currencies: PaymentCurrencyData[]
  isExtend: boolean
}) {
  const [submitting, setSubmitting] = useState(false)
  const { mutate } = useMutation(paySubscriptionApi)
  const { profile } = useAuthContext()

  const {
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    register,
    formState: { errors },
  } = useForm<PaySubscriptionFormValues>({
    defaultValues: {
      period: defaultPeriod,
      ...(currencies?.length ? currencies[0] : {}),
    },
  })

  const [isExpandDiscountInput, setExpandInput] = useState(false)
  const [applyingDiscount, setApplyingDiscount] = useState(false)
  const [discountData, setDiscountData] = useState<{ discountPercent: number; discountCode: string } | null>(null)
  const handleExpandDiscountInput: Dispatch<SetStateAction<boolean>> = (args) => {
    setExpandInput(args)
  }

  const token = watch('token')
  const discountCode = watch('discountCode')
  const tokenOptions = Array.from(new Set(currencies?.map((c) => c.token))).map((token) => ({
    value: token,
    label: (
      <Flex sx={{ alignItems: 'center', gap: 1 }}>
        <Image height={16} src={`/images/payments/${token}.png`} alt={token} />
        <Type.Caption>{token}</Type.Caption>
      </Flex>
    ),
  }))
  const chainOptions = Array.from(new Set(currencies?.filter((c) => c.token === token).map((c) => c.chain))).map(
    (chain) => ({
      value: chain,
      label: chain,
    })
  )
  const chain = watch('chain')

  const period = watch('period')

  const total = plan.price * period * (1 - (plan.discountByPeriod?.[period] || 0) / 100)

  useEffect(() => {
    if (!token || !currencies) return
    const filteredCurrencies = currencies?.filter((c) => c.token === token)
    setValue('chain', filteredCurrencies?.[0].chain || '')
  }, [token, currencies])

  const handleApplyDiscountCode = async () => {
    setApplyingDiscount(true)
    setDiscountData(null)
    if (discountCode === '') {
      clearErrors('discountCode')
      setValue('discountCode', '')
      return
    }

    try {
      const discount = await getSubscriptionDiscountCodeApi(discountCode)
      setDiscountData({
        discountPercent: discount.discountPercent,
        discountCode,
      })
      clearErrors('discountCode')
      return discount
    } catch (err) {
      setError('discountCode', { message: getErrorMessage(err) })
      return undefined
    } finally {
      setApplyingDiscount(false)
    }
  }

  const onSubmit = async (values: PaySubscriptionFormValues) => {
    const currency = currencies?.find((c) => c.token === values.token && c.chain === values.chain)
    if (!currency) return
    setSubmitting(true)
    const newPayload = {
      plan: plan.title as SubscriptionPlanEnum,
      currency: currency.currency,
      period: values.period,
      discountCode: discountData?.discountCode,
      refundEmail: values.refundEmail,
    }
    mutate(
      { payload: newPayload },
      {
        onSuccess(data) {
          localStorage.setItem(`${profile?.id}_${STORAGE_KEYS.PAYMENT_ID}`, data.id)
          window.open(data.checkoutLink, '_top')
        },
        onError(error) {
          setSubmitting(false)
          toast.error(<ToastBody title={'Error'} message={getErrorMessage(error)} />)
        },
      }
    )
  }

  const hasError = !!Object.keys(errors).length

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
        <Flex sx={{ gap: 3 }}>
          <PeriodSelector onChange={() => setValue('period', 1)} isActive={period === 1} period={1} plan={plan} />
          <PeriodSelector onChange={() => setValue('period', 12)} isActive={period === 12} period={12} plan={plan} />
        </Flex>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Type.Caption color="neutral2" mt={2} mb={1}>
          <Trans>Currency</Trans>
        </Type.Caption>
        <Select
          value={tokenOptions.find((option) => option.value === token)}
          options={tokenOptions}
          onChange={(newValue: any) => {
            setValue('token', newValue.value)
          }}
        />
        <Type.Caption color="neutral2" mt={2} mb={1}>
          <Trans>Network</Trans>
        </Type.Caption>
        <Select
          value={chainOptions.find((option) => option.value === chain)}
          options={chainOptions}
          onChange={(newValue: any) => {
            setValue('chain', newValue.value)
          }}
        />
        <Type.Caption color="neutral2" mt={2} mb={1}>
          <Trans>Email</Trans>
        </Type.Caption>
        <Input
          {...register('refundEmail', {
            required: { value: true, message: 'Email is required' },
            pattern: {
              value: EMAIL_REGEX,
              message: t`Please use a valid email address.`,
            },
            onChange: (e) => {
              e.target.value = e.target.value.trim().replace(/\s/g, '')
            },
          })}
          sx={{ width: '100%' }}
          error={errors.refundEmail}
        />
        {errors.refundEmail && (
          <Type.Caption color="red1" mt={1} display="block">
            {errors.refundEmail.message}
          </Type.Caption>
        )}
        <Box as="ul" mt={3}>
          <Li>
            <Type.Caption color="neutral2">
              <Trans>The email is used for transaction updates and refunds.</Trans>
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
        <Box
          sx={{
            borderRadius: 'sm',
            bg: 'neutral5',
            p: 2,
            pt: 0,
            my: 3,
            width: '100%',
          }}
        >
          <Accordion
            isExpand={isExpandDiscountInput}
            setIsExpand={handleExpandDiscountInput}
            iconSize={12}
            header={
              <Type.Caption color={errors?.discountCode?.message ? 'red1' : 'neutral1'}>
                <Trans>Apply Discount Code</Trans>
              </Type.Caption>
            }
            body={
              <Box mt={2}>
                <Flex justifyContent="start" alignItems="center" sx={{ gap: 2, width: '100%' }}>
                  <Input
                    suffix={
                      discountCode && (
                        <IconButton
                          variant="ghost"
                          type="button"
                          size={16}
                          icon={<X size={12} />}
                          onClick={() => {
                            setDiscountData(null)
                            clearErrors('discountCode')
                            setValue('discountCode', '')
                          }}
                        />
                      )
                    }
                    sx={{ flex: 1, height: 28 }}
                    error={!!errors.discountCode}
                    placeholder="Enter Discount Code"
                    {...register('discountCode')}
                  />
                  <Button
                    type="button"
                    variant="outlinePrimary"
                    size="xs"
                    onClick={handleApplyDiscountCode}
                    disabled={submitting || !discountCode || applyingDiscount}
                    isLoading={applyingDiscount}
                  >
                    <Trans>Apply</Trans>
                  </Button>
                </Flex>
                {errors.discountCode && (
                  <Type.Caption color="red1" mt={1}>
                    {errors.discountCode.message}
                  </Type.Caption>
                )}
                {!!discountData && (
                  <Type.Caption color="green1" mt={1}>
                    <Trans>
                      Successfully applied discount code: <b>{discountData.discountCode}</b>
                    </Trans>
                  </Type.Caption>
                )}
              </Box>
            }
          />
          <Divider mb={2} />
          <Flex justifyContent="space-between" alignItems="center">
            <Type.CaptionBold>
              <Trans>Total</Trans>
              {!!discountData && (
                <>
                  {' '}
                  <Trans>({discountData.discountPercent}% off)</Trans>
                </>
              )}
            </Type.CaptionBold>
            <Box textAlign="right">
              <Box>
                {!!discountData && (
                  <Type.Large sx={{ textDecoration: 'line-through', mr: 2 }} color="neutral3">
                    ${formatNumber(total)}
                  </Type.Large>
                )}
                <Type.LargeBold color={plan.color}>
                  ${formatNumber(total * (1 - (discountData?.discountPercent || 0) / 100))}
                </Type.LargeBold>
              </Box>
            </Box>
          </Flex>
          <Type.Caption color="neutral2" textAlign="right" sx={{ width: '100%', mt: 1 }}>
            <Trans>
              Payment by <b>{token}</b> of <b>{chain} Network</b>
            </Trans>
          </Type.Caption>
        </Box>

        <Button
          variant="primary"
          type="submit"
          isLoading={submitting}
          disabled={submitting || hasError}
          sx={{ width: '100%' }}
        >
          <Trans>Process To Checkout</Trans>
        </Button>
        <Type.Caption color="neutral2" mt={2} mb={1} textAlign="center">
          <Trans>By clicking button above you agreed with</Trans>{' '}
          <a href={LINKS.termOfUse} target="_blank" rel="noreferrer">
            <Trans>Terms of services</Trans>
          </a>
          .
        </Type.Caption>
      </form>
    </Box>
  )
}
