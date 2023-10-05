import { yupResolver } from '@hookform/resolvers/yup'
import { ReactNode, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import Divider from 'components/@ui/Divider'
import { volumeMultiplierContent, volumeProtectionContent } from 'components/TooltipContents'
import { Button } from 'theme/Buttons'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import InputField, { InputPasswordField } from 'theme/InputField'
import NumberInputField from 'theme/InputField/NumberInputField'
import Select from 'theme/Select'
import SliderInput from 'theme/SliderInput'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, Type } from 'theme/base'
import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import { getTokenTradeList } from 'utils/config/trades'

import {
  CopyTradeFormValues,
  cloneCopyTradeFormSchema,
  copyTradeFormSchema,
  defaultCopyTradeFormValues,
  exchangeOptions,
  fieldName,
  updateCopyTradeFormSchema,
} from './configs'

export default function CopyTraderForm({
  protocol,
  onSubmit,
  submitButtonText = 'Copy Trade',
  isSubmitting,
  defaultFormValues,
  isEdit = false,
  isClone = false,
  disabledEdit = false,
  tokensTraded,
}: {
  protocol: ProtocolEnum
  onSubmit: (data: CopyTradeFormValues) => void
  isSubmitting: boolean
  submitButtonText?: string
  defaultFormValues?: CopyTradeFormValues
  isEdit?: boolean
  isClone?: boolean
  disabledEdit?: boolean
  tokensTraded?: string[]
}) {
  const {
    control,
    watch,
    register,
    setValue,
    handleSubmit,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm<CopyTradeFormValues>({
    resolver: yupResolver(
      isClone ? cloneCopyTradeFormSchema : isEdit ? updateCopyTradeFormSchema : copyTradeFormSchema
    ),
  })

  const leverage = watch('leverage')
  const platform = watch('exchange')
  const enableStopLoss = watch('enableStopLoss')
  const volumeProtection = watch('volumeProtection')
  const enableMaxVolMultiplier = watch('enableMaxVolMultiplier')
  const tokenAddresses = watch('tokenAddresses')

  const pairs = useMemo(() => getTokenTradeList(protocol), [protocol])
  const addressPairs = pairs.map((e) => e.address)
  const isSelectedAll = addressPairs.length === tokenAddresses?.length

  useEffect(() => {
    const defaultValues = defaultFormValues ?? defaultCopyTradeFormValues
    for (const key in defaultValues) {
      const _key = key as keyof CopyTradeFormValues
      setValue(_key, defaultValues[_key])
    }
    if (!defaultFormValues && tokensTraded?.length) {
      setValue('tokenAddresses', tokensTraded)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFormValues, tokensTraded])

  const handleSelectAll = () => {
    if (isSelectedAll) {
      setValue('tokenAddresses', [])
    } else {
      setValue('tokenAddresses', addressPairs)
      clearErrors('tokenAddresses')
    }
  }

  return (
    <>
      <Box sx={{ p: 3 }}>
        {(isEdit || isClone) && (
          <>
            <Flex sx={{ gap: [3, 3, 4] }} mb={[3, 4]} flexDirection={['column', 'column', 'row']}>
              {isEdit && (
                <Box flex="1">
                  <InputField
                    disabled={isEdit || isClone}
                    block
                    {...register('account')}
                    error={errors.account?.message}
                    label="Account"
                  />
                </Box>
              )}
              {isClone && (
                <Box flex="1">
                  <InputField
                    block
                    {...register(fieldName.duplicateToAddress)}
                    disabled={!!defaultFormValues?.duplicateToAddress}
                    error={errors.duplicateToAddress?.message}
                    label="Clone To Address"
                  />
                </Box>
              )}
            </Flex>{' '}
            <Divider my={20} />
          </>
        )}

        <Type.BodyBold mb={3}>1. Copy Information</Type.BodyBold>
        <Flex sx={{ gap: [3, 4] }} mb={[3, 20]} flexDirection={['column', 'row']}>
          <Box flex="1" width="100%">
            <InputField block {...register(fieldName.title)} error={errors.title?.message} label="Title" />
          </Box>
          <Box flex="1" width="100%">
            <NumberInputField
              label="Max Margin Per Order"
              block
              name={fieldName.volume}
              disabled={disabledEdit}
              control={control}
              suffix={<Type.Caption color="neutral2">USD</Type.Caption>}
              error={errors.volume?.message}
            />
          </Box>
        </Flex>

        <Flex sx={{ gap: [3, 3, 4] }} mb={3} flexDirection={['column', 'column', 'row']}>
          <Box flex={['auto', 'auto', 1]}>
            <Flex alignItems="center" mb={12} sx={{ gap: 3 }}>
              <SwitchInputField
                checked={isSelectedAll}
                onChange={handleSelectAll}
                switchLabel="Trading Pairs"
                labelColor={errors.tokenAddresses?.message ? 'red1' : 'neutral2'}
                disabled={disabledEdit}
              />
            </Flex>
            <Flex sx={{ alignItems: 'center', width: '100%', gap: 3, flexWrap: 'wrap' }}>
              {pairs.map((pair) => {
                return (
                  <ControlledCheckbox
                    key={pair.address}
                    value={pair.address}
                    label={`${pair.name}/USD`}
                    // labelSx={{ fontSize: 14, lineHeight: '20px' }}
                    size={16}
                    disabled={disabledEdit}
                    {...register(fieldName.tokenAddresses)}
                    wrapperSx={{ width: 95, flexShrink: 0 }}
                  />
                )
              })}
            </Flex>
            {!!errors?.tokenAddresses?.message && (
              <Type.Caption color="red1" mt={1} display="block">
                {errors?.tokenAddresses?.message}
              </Type.Caption>
            )}
          </Box>
          <Box flex={['auto', 'auto', 1]} height={80}>
            <Type.Caption color="neutral3" mb={16} fontWeight={600}>
              Leverage slider:{' '}
              <Box as="span" color="primary1">
                {leverage}x
              </Box>
            </Type.Caption>
            <Box pb={24}>
              <SliderInput
                name={fieldName.leverage}
                control={control}
                error=""
                minValue={1}
                maxValue={50}
                stepValue={1}
                marksStep={5}
                marksUnit={'x'}
                disabled={disabledEdit}
              />
            </Box>
            {errors.leverage?.message ? (
              <Type.Caption color="red1" display="block">
                Leverage must be greater or equal to 2
              </Type.Caption>
            ) : null}
          </Box>
        </Flex>
        <Box flex="1">
          <SwitchInputField
            switchLabel="Reverse Copy"
            labelColor="orange1"
            {...register(fieldName.reverseCopy)}
            error={errors.reverseCopy?.message}
          />
          <Type.Caption mt={2} color="neutral2">
            Copin will execute the order that is the inverse of the trader&apos;s order.
          </Type.Caption>
        </Box>
        <Divider my={20} />
        <Type.BodyBold mb={3}>2. Risk Management</Type.BodyBold>
        <RowWrapper3>
          <Box>
            <SwitchInputField
              wrapperSx={{ mb: 12 }}
              switchLabel="Volume Protection"
              {...register(fieldName.volumeProtection, {
                onChange: (e) => {
                  const checked = e.target.checked
                  if (checked) {
                    setValue(
                      fieldName.lookBackOrders,
                      defaultFormValues?.lookBackOrders ?? defaultCopyTradeFormValues.lookBackOrders
                    )
                  } else {
                    trigger(fieldName.lookBackOrders)
                  }
                },
              })}
              error={errors.volumeProtection?.message}
              tooltipContent={
                <Box width="calc(100vw - 32px)" maxWidth={450}>
                  {volumeProtectionContent}
                </Box>
              }
            />
            <NumberInputField
              block
              name={fieldName.lookBackOrders}
              control={control}
              error={errors.lookBackOrders?.message}
              disabled={!volumeProtection}
              inputHidden={!volumeProtection}
              suffix={<InputSuffix>Orders</InputSuffix>}
            />
          </Box>
          <Box>
            <SwitchInputField
              wrapperSx={{ mb: 12 }}
              switchLabel="Stoploss Amount"
              {...register(fieldName.enableStopLoss, {
                onChange: (e) => {
                  const checked = e.target.checked
                  if (checked) {
                    setValue(
                      fieldName.stopLossAmount,
                      defaultFormValues?.stopLossAmount ?? defaultCopyTradeFormValues.stopLossAmount
                    )
                  } else {
                    trigger(fieldName.stopLossAmount)
                  }
                },
              })}
              error={errors.enableStopLoss?.message}
            />
            <NumberInputField
              block
              name={fieldName.stopLossAmount}
              control={control}
              error={errors.stopLossAmount?.message}
              disabled={!enableStopLoss}
              inputHidden={!enableStopLoss}
              suffix={<InputSuffix>USD</InputSuffix>}
            />
          </Box>
          <Box>
            <SwitchInputField
              wrapperSx={{ mb: 12 }}
              switchLabel="Max Volume Multiplier"
              {...register(fieldName.enableMaxVolMultiplier, {
                onChange: (e) => {
                  const checked = e.target.checked
                  if (checked) {
                    setValue(
                      fieldName.maxVolMultiplier,
                      defaultFormValues?.maxVolMultiplier ?? defaultCopyTradeFormValues.maxVolMultiplier
                    )
                  } else {
                    trigger(fieldName.maxVolMultiplier)
                  }
                },
              })}
              error={errors.enableMaxVolMultiplier?.message}
              tooltipContent={
                <Box width="calc(100vw - 32px)" maxWidth={450}>
                  {volumeMultiplierContent}
                </Box>
              }
            />
            <NumberInputField
              block
              name={fieldName.maxVolMultiplier}
              control={control}
              error={errors.maxVolMultiplier?.message}
              disabled={!enableMaxVolMultiplier}
              inputHidden={!enableMaxVolMultiplier}
              suffix={<InputSuffix>Times</InputSuffix>}
            />
          </Box>
        </RowWrapper3>
        <Box mt={20}>
          <SwitchInputField
            switchLabel="Skip Low Leverage"
            // labelColor="orange1"
            {...register(fieldName.skipLowLeverage)}
            error={errors.skipLowLeverage?.message}
          />
          <Type.Caption mt={2} color="neutral2">
            Copin will not execute the order that has leverage lower than the leverage you are setting.
          </Type.Caption>
        </Box>
        {!isClone && (
          <>
            <Divider my={20} />
            <Type.BodyBold mb={3}>3. Copy Platform</Type.BodyBold>
            <Flex sx={{ gap: [3, 3, 4] }} mb={[3, 4]} flexDirection={['column', 'column', 'row']} alignItems="start">
              <Flex flex="1" sx={{ gap: [3, 4] }} flexDirection={['column', 'row']} width="100%" alignItems="start">
                <Box flex="1" width="100%">
                  <Type.Caption color="neutral3" mb={2} fontWeight={600}>
                    Platform
                  </Type.Caption>
                  <Controller
                    name={fieldName.exchange}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Select
                          options={exchangeOptions}
                          defaultValue={
                            defaultFormValues ??
                            exchangeOptions.find((option) => option.value === CopyTradePlatformEnum.BINGX)
                          }
                          defaultMenuIsOpen={false}
                          value={exchangeOptions.find((option) => option.value === value)}
                          onChange={(newValue: any) => onChange(newValue.value)}
                          isSearchable={false}
                          isDisabled={isEdit || disabledEdit}
                        />
                      )
                    }}
                  />
                </Box>
                {platform === CopyTradePlatformEnum.BINGX && (
                  <Box flex="2" width="100%">
                    <InputPasswordField
                      label="Your BingX API Key"
                      block
                      {...register(fieldName.bingXApiKey)}
                      error={errors.bingXApiKey?.message}
                      disabled={isEdit || disabledEdit}
                      allowShowPassword
                    />
                    <Flex mt={12} alignItems="center" sx={{ gap: 2 }}>
                      <Type.Caption>Don&#39;t have a BingX account?</Type.Caption>
                      <Box as="a" lineHeight="20px" href="https://bingx.com/en-us/invite/DY5QNN/" target="_blank">
                        <Type.Caption>Register Here</Type.Caption>
                      </Box>
                    </Flex>
                  </Box>
                )}
              </Flex>
              {platform === CopyTradePlatformEnum.GMX && (
                <Box flex="1" width="100%">
                  <InputPasswordField
                    label="Your Private Key"
                    block
                    {...register(fieldName.privateKey)}
                    error={errors.privateKey?.message}
                    disabled={isEdit || disabledEdit}
                  />
                </Box>
              )}
              {platform === CopyTradePlatformEnum.BINGX && (
                <Box flex="1" width="100%">
                  <InputPasswordField
                    label="Your BingX Secret Key"
                    block
                    {...register(fieldName.bingXSecretKey)}
                    error={errors.bingXSecretKey?.message}
                    disabled={isEdit || disabledEdit}
                  />
                  {/* <InputField
                  block
                  {...register(fieldName.proxyUrl)}
                  error={errors.proxyUrl?.message}
                  label="Proxy url: (Ex: http://[username]:[password]@[ip]:[port])"
                /> */}
                </Box>
              )}
            </Flex>
          </>
        )}
        <Box sx={{ gap: 4 }} mt={4}>
          <Button
            block
            variant="primary"
            onClick={() => handleSubmit(onSubmit)()}
            isLoading={isSubmitting}
            disabled={isSubmitting || disabledEdit}
          >
            {submitButtonText}
          </Button>
        </Box>
      </Box>
    </>
  )
}

function RowWrapper3({ children }: { children: ReactNode }) {
  return (
    <Grid sx={{ gridTemplateColumns: ['1fr', '1fr', '1fr 1fr 1fr'], gap: [3, 3, 24], width: '100%' }}>{children}</Grid>
  )
}

function InputSuffix({ children }: { children: ReactNode }) {
  return <Type.Caption color="neutral2">{children}</Type.Caption>
}
