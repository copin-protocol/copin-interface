import { yupResolver } from '@hookform/resolvers/yup'
import { Trans } from '@lingui/macro'
import { ReactNode, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Divider from 'components/@ui/Divider'
import { volumeMultiplierContent, volumeProtectionContent } from 'components/TooltipContents'
import useCopyTradePermission from 'hooks/features/useCopyTradePermission'
import useGetTokensTraded from 'hooks/features/useGetTokensTraded'
import { Button } from 'theme/Buttons'
import InputField from 'theme/InputField'
import Label from 'theme/InputField/Label'
import NumberInputField from 'theme/InputField/NumberInputField'
import Select from 'theme/Select'
import SliderInput from 'theme/SliderInput'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { SERVICE_KEYS } from 'utils/config/keys'
import { CURRENCY_PLATFORMS } from 'utils/config/platforms'
import { TOKEN_TRADE_IGNORE, getTokenTradeList } from 'utils/config/trades'

import FundChecking from './FundChecking'
import Wallets from './Wallets'
import {
  CopyTradeFormValues,
  cloneCopyTradeFormSchema,
  copyTradeFormSchema,
  defaultCopyTradeFormValues,
  exchangeOptions,
  fieldName,
  protocolOptions,
  updateCopyTradeFormSchema,
} from './configs'

type CommonProps = {
  onSubmit: (data: CopyTradeFormValues) => void
  isSubmitting: boolean
  defaultFormValues: CopyTradeFormValues
  submitButtonText?: ReactNode
}

type CopyTraderEditFormProps = {
  isEdit: boolean
}
type CopyTraderCloneFormProps = {
  isClone: boolean
}
type CopyTradeFormComponent = {
  (props: CommonProps): JSX.Element
  (props: CopyTraderEditFormProps & CommonProps): JSX.Element
  (props: CopyTraderCloneFormProps & CommonProps): JSX.Element
}
const CopyTraderForm: CopyTradeFormComponent = ({
  onSubmit,
  isSubmitting,
  defaultFormValues,
  submitButtonText = 'Copy Trade',
  isEdit,
  isClone,
}: Partial<CopyTraderEditFormProps> & Partial<CopyTraderCloneFormProps> & CommonProps) => {
  const {
    control,
    watch,
    register,
    setValue,
    handleSubmit,
    clearErrors,
    trigger,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<CopyTradeFormValues>({
    mode: 'onChange',
    resolver: yupResolver(
      isClone ? cloneCopyTradeFormSchema : isEdit ? updateCopyTradeFormSchema : copyTradeFormSchema
    ),
  })

  const volume = watch('volume')
  const copyWalletId = watch('copyWalletId')
  const leverage = watch('leverage')
  const platform = watch('exchange')
  const enableStopLoss = watch('enableStopLoss')
  const volumeProtection = watch('volumeProtection')
  const enableMaxVolMultiplier = watch('enableMaxVolMultiplier')
  const tokenAddresses = watch('tokenAddresses')
  const protocol = watch('protocol')

  const pairs =
    protocol &&
    getTokenTradeList(protocol).filter((tokenTrade) => !TOKEN_TRADE_IGNORE[platform]?.includes(tokenTrade.name))
  const addressPairs = pairs?.map((e) => e.address)
  const pairOptions = pairs?.map((e) => {
    return { value: e.address, label: e.name }
  })
  pairOptions?.unshift({ value: 'all', label: 'All Tokens' })

  const account = watch('account')
  const duplicateToAddress = watch('duplicateToAddress')
  useGetTokensTraded(
    {
      account: isClone ? duplicateToAddress ?? '' : account ?? '',
      protocol: protocol ?? ProtocolEnum.GMX,
    },
    {
      enabled: !isEdit && (isClone ? !!duplicateToAddress : !!account),
      select: (data) => data.filter((address) => !TOKEN_TRADE_IGNORE[platform]?.includes(address)),
      onSuccess: (data) => {
        !!data?.length && setValue('tokenAddresses', data)
      },
    }
  )

  const currentWalletId = watch('copyWalletId')
  const onChangeWallet = (walletId: string) => setValue(fieldName.copyWalletId, walletId, { shouldValidate: true })

  useEffect(() => {
    reset(defaultFormValues)
    setTimeout(() => {
      if (isEdit) {
        return setFocus(fieldName.volume)
      }
      if (isClone && !defaultFormValues.duplicateToAddress) {
        return setFocus(fieldName.duplicateToAddress!)
      }
      setFocus(fieldName.title)
    }, 200)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const permissionToSelectProtocol = useCopyTradePermission(true)
  const isSelectedAlltokens = tokenAddresses?.length === addressPairs?.length

  return (
    <>
      <Type.Caption color="orange1" mb={1} px={24}>
        <Trans>This is a beta feature. Please DYOR before copytrading.</Trans>
      </Type.Caption>
      <Box sx={{ p: 24, pt: 3 }}>
        {(isEdit || isClone) && (
          <>
            <Flex sx={{ gap: [3, 3, 4] }} mb={[3, 4]} flexDirection={['column', 'column', 'row']}>
              {isEdit && (
                <Box flex="1">
                  <InputField
                    disabled
                    block
                    {...register(fieldName.account!)}
                    error={errors.account?.message}
                    label="Account"
                  />
                </Box>
              )}
              {isClone && (
                <>
                  <Box flex="1">
                    <InputField
                      block
                      {...register(fieldName.duplicateToAddress!)}
                      disabled={!!defaultFormValues.duplicateToAddress}
                      error={errors.duplicateToAddress?.message}
                      label="Clone To Address"
                      sx={{ flexGrow: 1 }}
                    />
                  </Box>
                  {permissionToSelectProtocol && (
                    <Box sx={{ flex: '0 0 max-content' }}>
                      <Label label="Protocol" />
                      <Select
                        options={protocolOptions}
                        defaultMenuIsOpen={false}
                        value={protocolOptions.find((option) => option.value === protocol)}
                        onChange={(newValue: any) => {
                          setValue('protocol', newValue.value)
                          setValue('serviceKey', SERVICE_KEYS[newValue.value as ProtocolEnum])
                        }}
                        isSearchable={false}
                        isDisabled={!!defaultFormValues.duplicateToAddress}
                      />
                    </Box>
                  )}
                </>
              )}
            </Flex>{' '}
            <Divider my={20} />
          </>
        )}

        <Type.BodyBold mb={3}>
          <Trans>1. Choose Platform</Trans>
        </Type.BodyBold>
        <Flex sx={{ gap: [3, 4], flexDirection: ['column', 'row'], alignItems: ['start', 'end'] }}>
          <Box flex="1" width="100%">
            <Type.Caption color="neutral3" mb={2} fontWeight={600}>
              Platform
            </Type.Caption>
            <Select
              options={exchangeOptions}
              defaultMenuIsOpen={false}
              value={exchangeOptions.find((option) => option.value === platform)}
              onChange={(newValue: any) => setValue(fieldName.exchange, newValue.value)}
              isSearchable={false}
              isDisabled={isEdit || isClone}
            />
          </Box>
          <Box flex="1" width="100%" sx={{ alignItems: 'center', gap: 2 }}>
            <Wallets
              disabledSelect={!!isEdit || !!isClone}
              platform={platform}
              currentWalletId={currentWalletId}
              onChangeWallet={onChangeWallet}
            />
          </Box>
        </Flex>
        {errors.copyWalletId?.message && (
          <Flex mt={2} sx={{ flexDirection: ['column', 'row'] }}>
            <Box flex="1" />
            <Type.Caption color="red1" sx={{ flex: '1', pl: [0, 4] }}>
              {errors.copyWalletId.message}
            </Type.Caption>
          </Flex>
        )}

        <Type.BodyBold mb={3} mt={[3, 20]}>
          2. Copy Information
        </Type.BodyBold>
        <Flex sx={{ gap: [3, 4] }} mb={[3, 20]} flexDirection={['column', 'row']}>
          <Box flex="1" width="100%">
            <InputField block {...register(fieldName.title)} error={errors.title?.message} label="Title" />
          </Box>
          <Box flex="1" width="100%">
            <NumberInputField
              label="Max Margin Per Order"
              block
              name={fieldName.volume}
              control={control}
              suffix={<Type.Caption color="neutral2">{CURRENCY_PLATFORMS[platform]}</Type.Caption>}
              error={errors.volume?.message}
            />
            <FundChecking walletId={copyWalletId} amount={volume} />
          </Box>
        </Flex>
        <Box mb={3}>
          <Label label="Trading Pairs" error={errors.tokenAddresses?.message} />
          <Flex sx={{ alignItems: 'center', width: '100%', gap: 3, flexWrap: 'wrap' }}>
            <Select
              menuIsOpen={isSelectedAlltokens ? false : undefined}
              closeMenuOnSelect={false}
              options={pairOptions}
              value={pairOptions?.filter?.((option) => tokenAddresses.includes(option.value))}
              onChange={(newValue: any, actionMeta: any) => {
                clearErrors(fieldName.tokenAddresses)
                if (actionMeta?.option?.value === 'all') {
                  setValue(fieldName.tokenAddresses, addressPairs)
                  return
                }
                setValue(
                  fieldName.tokenAddresses,
                  newValue?.map((data: any) => data.value)
                )
              }}
              isSearchable
              isMulti
            />
          </Flex>
          {!!errors?.tokenAddresses?.message && (
            <Type.Caption color="red1" mt={1} display="block">
              {errors?.tokenAddresses?.message}
            </Type.Caption>
          )}
        </Box>

        <Flex sx={{ gap: [3, 3, 3] }} mb={3} flexDirection={['column', 'column', 'row']}>
          <Box flex="1" height={80}>
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
              />
            </Box>
            {errors.leverage?.message ? (
              <Type.Caption color="red1" display="block">
                Leverage must be greater or equal to 2
              </Type.Caption>
            ) : null}
          </Box>
          <Box ml={3} sx={{ height: 76, width: '1px', bg: 'neutral4', display: ['none', 'none', 'block'] }} />
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
        </Flex>
        <Divider my={20} />
        <Type.BodyBold mb={3}>3. Risk Management</Type.BodyBold>
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
        <Box mt={3}>
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
        <Box sx={{ gap: 4 }} mt={4}>
          <Button
            block
            variant="primary"
            onClick={() => handleSubmit(onSubmit)()}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {submitButtonText}
          </Button>
          {/*<Button block variant="primary" disabled>*/}
          {/*  Maintaining*/}
          {/*</Button>*/}
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

export default CopyTraderForm
