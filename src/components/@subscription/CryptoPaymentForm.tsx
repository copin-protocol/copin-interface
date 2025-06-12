// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import '@lingui/react'
import { X } from '@phosphor-icons/react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
import Select from 'theme/Select'
import { Box, Flex, Image, Li, Type } from 'theme/base'
import { EMAIL_REGEX } from 'utils/config/constants'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'
import { PlanConfig } from 'utils/config/subscription'
import { formatNumber } from 'utils/helpers/format'
import { getErrorMessage } from 'utils/helpers/handleError'

interface PaySubscriptionFormValues {
  token: string
  chain: string
  discountCode: string
  refundEmail: string
}

export default function CryptoPaymentForm({
  currencies,
  period,
  plan,
}: {
  currencies: PaymentCurrencyData[]
  period: number
  plan: PlanConfig
}) {
  const [isExpandDiscountInput, setExpandInput] = useState(false)
  const [applyingDiscount, setApplyingDiscount] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [discountData, setDiscountData] = useState<{ discountPercent: number; discountCode: string } | null>(null)
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
      ...(currencies?.length ? currencies[0] : {}),
    },
  })
  const handleExpandDiscountInput: Dispatch<SetStateAction<boolean>> = (args) => {
    setExpandInput(args)
  }

  const { mutate } = useMutation(paySubscriptionApi)
  const { profile } = useAuthContext()

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
      period,
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
  const total = plan.price * period * (1 - (plan.discountByPeriod?.[period] || 0) / 100)

  return (
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
      <Type.Caption color="neutral2">
        <Trans>The email is used for transaction updates and refunds.</Trans>
      </Type.Caption>
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
      <Box as="ul" my={3}>
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
      <Button
        variant="primary"
        type="submit"
        isLoading={submitting}
        disabled={submitting || hasError}
        sx={{ width: '100%' }}
      >
        <Trans>Process To Checkout</Trans>
      </Button>
    </form>
  )
}
