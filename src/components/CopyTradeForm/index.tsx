import { yupResolver } from '@hookform/resolvers/yup'
import { Trans } from '@lingui/macro'
import { ShieldWarning } from '@phosphor-icons/react'
import { ReactNode, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import Divider from 'components/@ui/Divider'
import useCopyTradePermission from 'hooks/features/useCopyTradePermission'
import useGetTokensTraded from 'hooks/features/useGetTokensTraded'
import Accordion from 'theme/Accordion'
import { Button } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import InputField from 'theme/InputField'
import Label from 'theme/InputField/Label'
import NumberInputField from 'theme/InputField/NumberInputField'
import Select from 'theme/Select'
import SliderInput from 'theme/SliderInput'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { SERVICE_KEYS } from 'utils/config/keys'
import { CURRENCY_PLATFORMS } from 'utils/config/platforms'
import { TOKEN_TRADE_IGNORE, getTokenTradeList } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'

import FundChecking from './FundChecking'
import Wallets from './Wallets'
import {
  CopyTradeFormValues,
  cloneCopyTradeFormSchema,
  copyTradeFormSchema,
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
  const stopLossAmount = watch('stopLossAmount')
  const maxMarginPerPosition = watch('maxMarginPerPosition')
  const tokenAddresses = watch('tokenAddresses') || []
  const protocol = watch('protocol')
  const agreement = watch('agreement')
  const copyAll = watch('copyAll')

  const pairs =
    protocol &&
    getTokenTradeList(protocol).filter((tokenTrade) => !TOKEN_TRADE_IGNORE[platform]?.includes(tokenTrade.name))
  const pairOptions = pairs?.map((e) => {
    return { value: e.address, label: e.name }
  })

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

  return (
    <>
      <Type.Caption color="orange1" mb={1} px={[12, 24]}>
        <Trans>This is a beta feature. Please copy at your own risk.</Trans>
      </Type.Caption>
      <Box sx={{ pb: 24, px: [12, 24], pt: 3 }}>
        <InputField block {...register(fieldName.title)} error={errors.title?.message} label="Label" />
        {(isEdit || isClone) && (
          <>
            {isEdit && (
              <Box mt={24}>
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
                <Box mt={24}>
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
                    <Label label="Copy Wallet" />
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
          </>
        )}

        <Box mt={24}>
          <Label label="Copy Wallet" />
          <Flex sx={{ gap: 2, alignItems: ['start', 'end'] }}>
            <Box flex={1}>
              <Select
                options={exchangeOptions}
                defaultMenuIsOpen={false}
                value={exchangeOptions.find((option) => option.value === platform)}
                onChange={(newValue: any) => setValue(fieldName.exchange, newValue.value)}
                isSearchable={false}
                isDisabled={isEdit || isClone}
              />
            </Box>

            <Box flex={[1, 2]}>
              <Wallets
                disabledSelect={!!isEdit || !!isClone}
                platform={platform}
                currentWalletId={currentWalletId}
                onChangeWallet={onChangeWallet}
              />
            </Box>
          </Flex>
          {errors.copyWalletId?.message && (
            <Type.Caption mt={2} color="red1">
              {errors.copyWalletId.message}
            </Type.Caption>
          )}
        </Box>

        <Box mt={24}>
          <NumberInputField
            label="Margin"
            block
            name={fieldName.volume}
            control={control}
            suffix={<Type.Caption color="neutral2">{CURRENCY_PLATFORMS[platform]}</Type.Caption>}
            error={errors.volume?.message}
          />
          <Type.Caption mt={1} color="neutral2">
            <Trans>
              When the trader opens a trade, the maximum margin per order is{' '}
              {volume ? <Type.CaptionBold>{formatNumber(volume)} USD</Type.CaptionBold> : '--'}.
            </Trans>
          </Type.Caption>
          <FundChecking walletId={copyWalletId} amount={volume} />
        </Box>
        <Box mt={24}>
          <Flex mb={2} sx={{ alignItems: 'center', gap: 12, '& *': { mb: '0 !important' } }}>
            <Label label="Trading Pairs" error={errors.tokenAddresses?.message} />
            <SwitchInputField
              switchLabel="Follow the trader"
              labelColor="neutral1"
              {...register(fieldName.copyAll)}
              error={errors.copyAll?.message}
              wrapperSx={{ flexDirection: 'row-reverse', '*': { fontWeight: 400 } }}
            />
          </Flex>
          <Box
            display={copyAll ? 'none' : 'flex'}
            sx={{ alignItems: 'center', width: '100%', gap: 3, flexWrap: 'wrap' }}
          >
            <Select
              closeMenuOnSelect={false}
              className="select-container pad-right-0"
              options={pairOptions}
              value={pairOptions?.filter?.((option) => tokenAddresses.includes(option.value))}
              onChange={(newValue: any) => {
                clearErrors(fieldName.tokenAddresses)
                setValue(
                  fieldName.tokenAddresses,
                  newValue?.map((data: any) => data.value)
                )
              }}
              components={{
                DropdownIndicator: () => <div></div>,
              }}
              isSearchable
              isMulti
            />
          </Box>
          {!!errors?.tokenAddresses?.message && (
            <Type.Caption color="red1" mt={1} display="block">
              {errors?.tokenAddresses?.message}
            </Type.Caption>
          )}
        </Box>

        <Box mt={24}>
          <Type.Caption color="neutral2" mb={16} fontWeight={600}>
            Leverage
            <Box as="span" color="primary1" ml={2}>
              {leverage}x
            </Box>
          </Type.Caption>
          <Box pb={24}>
            <SliderInput
              name={fieldName.leverage}
              control={control}
              error=""
              minValue={2}
              maxValue={20}
              stepValue={1}
              marksStep={2}
              marksUnit={'x'}
            />
          </Box>
          {errors.leverage?.message ? (
            <Type.Caption color="red1" display="block">
              <Trans>Leverage must be greater or equal to 2</Trans>
            </Type.Caption>
          ) : null}
        </Box>

        <Box mt={24} sx={{ borderRadius: 'xs', border: 'small', borderColor: 'orange1', py: 2, px: 12 }}>
          <SwitchInputField
            switchLabel="Reverse Copy"
            labelColor="orange1"
            {...register(fieldName.reverseCopy)}
            error={errors.reverseCopy?.message}
          />
          <Type.Caption display="block" mt={1} color="neutral2">
            <Trans>Copin will execute the order that is the inverse of the trader&apos;s order.</Trans>
          </Type.Caption>
          <Type.Caption display="block" color="neutral2">
            <Trans>Example: Trader opened LONG, you will open SHORT.</Trans>
          </Type.Caption>
        </Box>
        <Divider mt={24} />
        <Accordion
          header={<Type.BodyBold>Stop Loss</Type.BodyBold>}
          body={
            <Box mt={3}>
              <NumberInputField
                label="Position Stop Loss (Recommended)"
                block
                name={fieldName.stopLossAmount}
                control={control}
                error={errors.stopLossAmount?.message}
                suffix={<InputSuffix>USD</InputSuffix>}
              />
              <Type.Caption mt={1} color="neutral2">
                <Trans>
                  When the loss exceeds{' '}
                  {stopLossAmount ? (
                    <Type.CaptionBold color="red2">{formatNumber(stopLossAmount)} USD</Type.CaptionBold>
                  ) : (
                    '--'
                  )}
                  , the Stop Loss will be triggered to close the position.
                </Trans>
              </Type.Caption>
              <Box bg="rgba(255, 194, 75, 0.10)" py={2} px={12} mt={3}>
                <Flex sx={{ gap: 2 }} color="orange1" alignItems="center">
                  <ShieldWarning />
                  <Type.CaptionBold>Warning</Type.CaptionBold>
                </Flex>
                <Type.Caption mt={2}>
                  <Trans>
                    Make sure you have already activated the{' '}
                    <Box as="a" href={LINKS.bingXGuarantee} target="_blank" rel="noreferrer">
                      BingX Guaranteed Price
                    </Box>{' '}
                    to Prevent Slippage Losses.
                  </Trans>
                </Type.Caption>
              </Box>
            </Box>
          }
        />
        <Divider />
        <Accordion
          header={
            <Type.BodyBold>
              <Trans>Advance Settings</Trans>
            </Type.BodyBold>
          }
          body={
            <Box mt={3}>
              <NumberInputField
                block
                label="Max Margin Per Position"
                name={fieldName.maxMarginPerPosition}
                control={control}
                error={errors.maxMarginPerPosition?.message}
                suffix={<InputSuffix>USD</InputSuffix>}
              />
              <Type.Caption mt={1} color="neutral2">
                <Trans>
                  When the trader increases the position, you will follow with a maximum of{' '}
                  {maxMarginPerPosition ? (
                    <Type.CaptionBold>{formatNumber(maxMarginPerPosition)} USD</Type.CaptionBold>
                  ) : (
                    '--'
                  )}{' '}
                  as the margin.
                </Trans>
              </Type.Caption>
              <Box mt={24}>
                <SwitchInputField
                  switchLabel="Skip Lower Leverage Position"
                  // labelColor="orange1"
                  {...register(fieldName.skipLowLeverage)}
                  error={errors.skipLowLeverage?.message}
                />
                <Type.Caption mt={1} color="neutral2">
                  <Trans>You will not copy the position has opened with leverage lower than {leverage}x.</Trans>
                </Type.Caption>
              </Box>
            </Box>
          }
        />

        <Box mt={3}>
          <Checkbox {...register('agreement')}>
            <Type.Caption>
              I have read and I agree to the{' '}
              <a href={LINKS.agreement} target="_blank" rel="noreferrer">
                Copytrading Service Agreement
              </a>
            </Type.Caption>
          </Checkbox>
        </Box>

        <Box sx={{ gap: 4 }} mt={3}>
          <Button
            block
            variant="primary"
            onClick={() => handleSubmit(onSubmit)()}
            isLoading={isSubmitting}
            disabled={isSubmitting || !agreement}
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

// function RowWrapper2({ children }: { children: ReactNode }) {
//   return <Grid sx={{ gridTemplateColumns: ['1fr', '1fr', '1fr 1fr'], gap: [3, 3, 24], width: '100%' }}>{children}</Grid>
// }

function InputSuffix({ children }: { children: ReactNode }) {
  return <Type.Caption color="neutral2">{children}</Type.Caption>
}

export default CopyTraderForm
