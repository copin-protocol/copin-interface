import { yupResolver } from '@hookform/resolvers/yup'
import { Trans } from '@lingui/macro'
import { CrownSimple, ShieldWarning } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getTraderVolumeCopy } from 'apis/copyTradeApis'
import { getCopyVolumeColor } from 'components/@copyTrade/TraderCopyVolumeWarningIcon/helper'
import Divider from 'components/@ui/Divider'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { renderTrader } from 'components/@widgets/renderProps'
import { TradingEventStatusEnum } from 'entities/event'
import useCopyTradePermission from 'hooks/features/useCopyTradePermission'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useGetTokensTraded from 'hooks/features/useGetTokensTraded'
import useInternalRole from 'hooks/features/useInternalRole'
import { useIsPremiumAndAction } from 'hooks/features/useSubscriptionRestrict'
import { getMaxVolumeCopy, useSystemConfigContext } from 'hooks/features/useSystemConfigContext'
import useMyProfileStore from 'hooks/store/useMyProfile'
import Accordion from 'theme/Accordion'
import { Button } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import Input, { Textarea } from 'theme/Input'
import InputField from 'theme/InputField'
import Label from 'theme/InputField/Label'
import NumberInputField from 'theme/InputField/NumberInputField'
import Select from 'theme/Select'
import SliderInput from 'theme/SliderInput'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DCP_SUPPORTED_PROTOCOLS, DEFAULT_PROTOCOL, LINKS, RISK_LEVERAGE } from 'utils/config/constants'
import { CopyTradePlatformEnum, EventTypeEnum, ProtocolEnum, SLTPTypeEnum } from 'utils/config/enums'
import { INTERNAL_SERVICE_KEYS, QUERY_KEYS, SERVICE_KEYS } from 'utils/config/keys'
import { CURRENCY_PLATFORMS } from 'utils/config/platforms'
import ROUTES from 'utils/config/routes'
import {
  TOKEN_TRADE_IGNORE,
  getIndexTokensFromSymbols,
  getSymbolsFromIndexTokens,
  getTokenOptions,
} from 'utils/config/trades'
import { SLTP_TYPE_TRANS } from 'utils/config/translations'
import { formatNumber } from 'utils/helpers/format'
import { generateEventDetailsRoute } from 'utils/helpers/generateRoute'

import { dcpExchangeOptions, exchangeOptions, fieldName, internalExchangeOptions, protocolOptions } from '../configs'
import { getExchangeOption } from '../helpers'
import { CopyTradeFormValues } from '../types'
import { cloneCopyTradeFormSchema, copyTradeFormSchema, updateCopyTradeFormSchema } from '../yupSchemas'
import FundChecking, { SmartWalletFund } from './FundChecking'
import Wallets from './Wallets'

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
  defaultFormValues: _defaultFormValues,
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
    setError,
    formState: { errors },
  } = useForm<CopyTradeFormValues>({
    // mode: 'onChange',
    resolver: yupResolver(
      isClone ? cloneCopyTradeFormSchema : isEdit ? updateCopyTradeFormSchema : copyTradeFormSchema
    ),
  })
  const protocol = watch('protocol') || DEFAULT_PROTOCOL

  const { checkIsPremium, isPremiumUser } = useIsPremiumAndAction()
  const isInternal = useInternalRole()
  const cexOptions = isInternal ? internalExchangeOptions : exchangeOptions
  const options =
    !!protocol && DCP_SUPPORTED_PROTOCOLS.includes(protocol) ? [...dcpExchangeOptions, ...cexOptions] : cexOptions
  const serviceCopy = isInternal ? INTERNAL_SERVICE_KEYS : SERVICE_KEYS

  const volume = watch('volume')
  const copyWalletId = watch('copyWalletId')
  const leverage = watch('leverage')
  const platform = watch('exchange')
  const stopLossType = watch('stopLossType')
  const stopLossAmount = watch('stopLossAmount')
  const takeProfitType = watch('takeProfitType')
  const takeProfitAmount = watch('takeProfitAmount')
  const maxMarginPerPosition = watch('maxMarginPerPosition')
  const lookBackOrders = watch('lookBackOrders')
  const tokenAddresses = watch('tokenAddresses') || []
  const copyAll = watch('copyAll')
  const skipLowLeverage = watch('skipLowLeverage')
  const lowLeverage = watch('lowLeverage')
  const excludingTokenAddresses = watch('excludingTokenAddresses')
  const hasExclude = watch('hasExclude')

  const skipLowCollateral = watch('skipLowCollateral')
  const lowCollateral = watch('lowCollateral')
  const skipLowSize = watch('skipLowSize')
  const lowSize = watch('lowSize')

  const [tradedPairs, setTradedPairs] = useState<string[]>([])

  const pairOptions = getTokenOptions({ protocol, ignoredAll: true }).filter(
    (option) => !TOKEN_TRADE_IGNORE[platform]?.includes(option.value)
  )
  const allPairs = pairOptions.map((p) => p.value)

  pairOptions.unshift({ id: 'all', value: 'all', label: 'All Tokens' })

  const multipleCopy = watch('multipleCopy')
  const account = watch('account')
  const accounts = watch('accounts')
  const duplicateToAddress = watch('duplicateToAddress')
  useGetTokensTraded(
    {
      account: isClone ? duplicateToAddress ?? '' : account ?? '',
      protocol,
    },
    {
      enabled: !isEdit && (isClone ? !!duplicateToAddress : !!account),
      select: (data) => {
        const symbols = getSymbolsFromIndexTokens(protocol, data)
        return symbols.filter((address) => !TOKEN_TRADE_IGNORE[platform]?.includes(address))
      },
      onSuccess: (data) => {
        if (!!data?.length) {
          if (!isEdit && (isClone ? !!duplicateToAddress : !!account)) {
            setValue('tokenAddresses', data)
          }
          setTradedPairs(data ?? [])
        }
      },
    }
  )

  const { events } = useSystemConfigContext()
  const gnsEvent = events?.find((e) => e.type === EventTypeEnum.GNS && e.status !== TradingEventStatusEnum.ENDED)

  const { copyWallets } = useCopyWalletContext()

  const setDefaultWallet = (currentPlatform: string) => {
    const copyWalletsByExchange = copyWallets?.filter((e) => e.exchange === currentPlatform)
    onChangeWallet(copyWalletsByExchange?.[0]?.id ?? '')
  }
  const isBingXWallet = copyWallets?.find((e) => e.id === copyWalletId)?.exchange === CopyTradePlatformEnum.BINGX

  const onChangeWallet = (walletId: string) => setValue(fieldName.copyWalletId, walletId, { shouldValidate: true })

  const onChangeSLType = (type: SLTPTypeEnum) => setValue(fieldName.stopLossType, type)

  const onChangeTPType = (type: SLTPTypeEnum) => setValue(fieldName.takeProfitType, type)

  const myProfile = useMyProfileStore((_s) => _s.myProfile)

  const currentWallet = copyWallets?.find((_w) => _w.id === copyWalletId)
  const currentWalletOption = currentWallet?.exchange && getExchangeOption(currentWallet.exchange)
  const walletHasRef = !!currentWallet?.isReferral
  const userPlan = myProfile?.plan
  const totalVolume = volume * leverage

  const { data: traderVolumeCopy } = useQuery(
    [QUERY_KEYS.GET_TRADER_VOLUME_COPY, protocol, account, platform],
    () => getTraderVolumeCopy({ protocol, account, exchange: platform }),
    { enabled: !!account && !!protocol && !!platform }
  )
  const { volumeLimit } = useSystemConfigContext()

  const maxVolume = getMaxVolumeCopy({ plan: myProfile?.plan, isRef: walletHasRef, volumeLimitData: volumeLimit })
  const currentCopyVolume = traderVolumeCopy?.[0]?.totalVolume

  const showWarningVolume = totalVolume > maxVolume

  // Todo: uncomment after 20/4
  const _handleSubmit = () =>
    handleSubmit((_formValues) => {
      const formValues = { ..._formValues }
      if (formValues.tokenAddresses?.length) {
        formValues.tokenAddresses = getIndexTokensFromSymbols(protocol, formValues.tokenAddresses)
      }
      if (formValues.excludingTokenAddresses?.length) {
        formValues.excludingTokenAddresses = getIndexTokensFromSymbols(protocol, formValues.excludingTokenAddresses)
      }
      delete formValues.totalVolume
      onSubmit(formValues)
    })()

  // useEffect(() => {
  //   if (totalVolume > maxVolume) {
  //     const errorMsg = `Maximum volume (include leverage) is ${formatNumber(maxVolume, 0, 0)}`
  //     setError('totalVolume', { message: errorMsg })
  //   } else {
  //     clearErrors('totalVolume')
  //   }
  // }, [maxVolume, totalVolume])

  useEffect(() => {
    const defaultFormValues = { ..._defaultFormValues }
    if (defaultFormValues.tokenAddresses?.length) {
      defaultFormValues.tokenAddresses = getSymbolsFromIndexTokens(
        defaultFormValues.protocol ?? DEFAULT_PROTOCOL,
        defaultFormValues.tokenAddresses
      )
    }
    if (defaultFormValues.excludingTokenAddresses?.length) {
      defaultFormValues.excludingTokenAddresses = getSymbolsFromIndexTokens(
        defaultFormValues.protocol ?? DEFAULT_PROTOCOL,
        defaultFormValues.excludingTokenAddresses
      )
    }
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

  useEffect(() => {
    if (copyWalletId) {
      clearErrors('copyWalletId')
    }
  }, [clearErrors, copyWalletId])

  const permissionToSelectProtocol = useCopyTradePermission(true)
  const { sm } = useResponsive()

  const SwitchMultipleCopy = useCallback(
    (props: { label: string; switchLabel: string }) => {
      return (
        <Flex mb={12} sx={{ alignItems: 'center', gap: 12, '& *': { mb: '0 !important' } }}>
          <Label label={props.label} />
          <SwitchInputField
            switchLabel={
              <Flex alignItems="center" sx={{ gap: 1 }}>
                <LabelWithTooltip
                  id="tt_multiple_address"
                  tooltip={`The feature for premium users allows copying multiple traders with the same configuration. List of addresses in line break format.`}
                  sx={{ borderBottom: '1px dashed', mb: '-1px', borderBottomColor: 'neutral3', textDecoration: 'none' }}
                >
                  {props.switchLabel}
                </LabelWithTooltip>
                <IconBox icon={<CrownSimple size={16} weight="fill" />} color="orange1" />
              </Flex>
            }
            labelColor="neutral1"
            {...register(fieldName.multipleCopy)}
            wrapperSx={{ flexDirection: 'row-reverse', '*': { fontWeight: 400 } }}
            onChange={(newValue: any) => {
              if (!checkIsPremium()) {
                setValue(fieldName.multipleCopy, false)
              } else {
                setValue(fieldName.multipleCopy, newValue.target.checked)
              }
            }}
          />
        </Flex>
      )
    },
    [register, isPremiumUser, checkIsPremium]
  )
  const SourceTrader = useCallback(() => {
    if (!account || !protocol) return null
    return (
      <Flex mb={1} sx={{ alignItems: 'center', gap: 2 }}>
        {renderTrader(account, protocol)}
        <Type.Caption>-</Type.Caption>
        <Flex sx={{ alignItems: 'center', gap: 2 }}>
          <ProtocolLogo protocol={protocol} size={16} />
          <Type.Caption>{protocolOptions?.find((e) => e.value === protocol)?.label}</Type.Caption>
        </Flex>
      </Flex>
    )
  }, [account, protocol])

  const leverageError = errors.leverage?.message || errors.totalVolume?.message
  const volumeError = errors.volume?.message || errors.totalVolume?.message

  return (
    <>
      <Type.Caption color="orange1" mb={20} px={[12, 24]}>
        <Trans>This is a beta feature. Please copy at your own risk.</Trans>
      </Type.Caption>
      {account && protocol && (
        <Box px={[12, 24]}>
          <Flex mb={1} sx={{ alignItems: 'center', gap: 2 }}>
            {renderTrader(account, protocol, true)}
            <Type.Caption>-</Type.Caption>
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <ProtocolLogo protocol={protocol} size={24} />
            </Flex>
          </Flex>
          <Type.Caption mt={12} display="inline-block" color="neutral3">
            Your copy size:{' '}
            <Box as="span" color={getCopyVolumeColor({ copyVolume: currentCopyVolume ?? 0, maxVolume })}>
              {currentCopyVolume == null ? '--' : `$${formatNumber(currentCopyVolume, 0, 0)}`}
            </Box>{' '}
            <Box as="span" sx={{ fontWeight: 600, color: 'neutral1' }}>
              / ${formatNumber(maxVolume, 0, 0)}
            </Box>
          </Type.Caption>
        </Box>
      )}

      <Box sx={{ pb: 24, px: [12, 24], pt: 3 }}>
        <InputField block maxLength={40} {...register(fieldName.title)} error={errors.title?.message} label="Label" />
        {(isEdit || isClone) && (
          <>
            {isEdit && (
              <Box mt={24}>
                <SwitchMultipleCopy label="Address" switchLabel="Multiple addresses" />
                {multipleCopy && (
                  <Textarea
                    block
                    rows={5}
                    placeholder={`List of addresses in line break format as below:\n0xaddress1\n0xaddress2`}
                    value={accounts?.join('\n') || account}
                    defaultValue={_defaultFormValues?.accounts?.join('\n') || _defaultFormValues?.account}
                    sx={{ textarea: { fontSize: 13 } }}
                    onChange={(e) => {
                      const value = e.target.value
                      setValue('accounts', value.split(/\s+/))
                    }}
                  />
                )}
                {!multipleCopy && <Input block {...register(fieldName.account!)} error={errors.account?.message} />}

                {(errors.account?.message || errors.accounts?.message) && (
                  <Type.Caption color="red1">{errors.account?.message || errors.accounts?.message}</Type.Caption>
                )}
                {/*{multipleCopy && (*/}
                {/*  <Box mt={1}>*/}
                {/*    <Type.Caption color="neutral2">*/}
                {/*      <Trans>List of addresses in line break format as below:</Trans>*/}
                {/*    </Type.Caption>*/}
                {/*    <Type.Caption color="neutral2">*/}
                {/*      {`0x37EB10AC8A2745C1108fdf6756e52535b00f589c\n0x8D3ddFeB1613094Ef86758CcB6E8bb64C4929E8C`}*/}
                {/*    </Type.Caption>*/}
                {/*  </Box>*/}
                {/*)}*/}
              </Box>
            )}
            {isClone && (
              <>
                <Box mt={24}>
                  <SwitchMultipleCopy label="Clone to address" switchLabel="Multiple addresses" />
                  {multipleCopy && (
                    <Textarea
                      block
                      rows={5}
                      value={accounts?.join('\n')}
                      defaultValue={_defaultFormValues?.accounts?.join('\n')}
                      sx={{ textarea: { fontSize: 13 } }}
                      onChange={(e) => {
                        const value = e.target.value
                        setValue('accounts', value.split(/\s+/))
                      }}
                    />
                  )}
                  {!multipleCopy && (
                    <Input
                      block
                      {...register(fieldName.duplicateToAddress!)}
                      disabled={!!_defaultFormValues.duplicateToAddress}
                      error={errors.duplicateToAddress?.message}
                      sx={{ flexGrow: 1 }}
                    />
                  )}

                  {(errors.duplicateToAddress?.message || errors.accounts?.message) && (
                    <Type.Caption color="red1">
                      {errors.duplicateToAddress?.message || errors.accounts?.message}
                    </Type.Caption>
                  )}
                </Box>
              </>
            )}
          </>
        )}

        {(isEdit || isClone) && permissionToSelectProtocol && (
          <Box mt={24} sx={{ flex: '0 0 max-content' }}>
            <Label label="Protocol" />
            <Select
              options={protocolOptions}
              defaultMenuIsOpen={false}
              value={protocolOptions.find((option) => option.value === protocol)}
              onChange={(newValue: any) => {
                setValue('protocol', newValue.value)
                setValue('serviceKey', serviceCopy[newValue.value as ProtocolEnum])
              }}
              isSearchable
              isDisabled={!!_defaultFormValues.duplicateToAddress}
            />
          </Box>
        )}

        <Box mt={24}>
          {isClone ? (
            <Flex mb={3} alignItems="center" sx={{ gap: 1 }}>
              <LabelWithTooltip
                id="tt_copy_wallet"
                tooltip={`The feature for premium users allows cloning a copy-trade settings to other wallet.`}
                sx={{ borderBottom: '1px dashed', mb: '-1px', borderBottomColor: 'neutral3', textDecoration: 'none' }}
              >
                Copy Wallet
              </LabelWithTooltip>
              <IconBox icon={<CrownSimple size={16} weight="fill" />} color="orange1" />
            </Flex>
          ) : (
            <Label label="Copy Wallet" />
          )}
          <Flex sx={{ gap: 2, alignItems: ['start', 'end'] }}>
            <Box flex={1}>
              <Select
                options={options}
                defaultMenuIsOpen={false}
                value={options.find((option) => option.value === platform)}
                onChange={(newValue: any) => {
                  if (platform !== newValue.value) {
                    setDefaultWallet(newValue.value)
                  }
                  setValue(fieldName.exchange, newValue.value)
                }}
                isSearchable
                isDisabled={isEdit || (isClone && !isPremiumUser)}
              />
            </Box>

            <Box flex={[1, 2]}>
              <Wallets
                disabledSelect={!!isEdit || (!!isClone && !isPremiumUser)}
                platform={platform}
                currentWalletId={copyWalletId}
                onChangeWallet={onChangeWallet}
              />
            </Box>
          </Flex>
          {errors.copyWalletId?.message && (
            <Type.Caption mt={2} color="red1">
              {errors.copyWalletId.message}
            </Type.Caption>
          )}
          {/* {!!currentWallet?.exchange && (
            <Type.Caption color="neutral2" mt={2}>
              Copin&apos;s referral code:{' '}
              <Box as="span" color="neutral1" fontWeight={600}>
                {currentWalletOption?.refCode}
              </Box>{' '}
              {walletHasRef ? 'is ' : 'is not '} used with your {currentWalletOption?.labelText} account. The maximum
              volume that you can set up for copies is{' '}
              <Box as="span" color="neutral1" fontWeight={600}>
                {maxVolume} USDT
              </Box>{' '}
              (include leverage). Applicable from{' '}
              <Box as="span" color="neutral1" fontWeight={600}>
                April 20 2024
              </Box>
              .{' '}
              <Box as="a" target="_blank" href="/">
                Learn more.
              </Box>
            </Type.Caption>
          )} */}
          {platform === CopyTradePlatformEnum.GNS_V8 && !!gnsEvent && (
            <Type.Caption mt={2} display="block">
              DCP gTrade competition is ongoing.{' '}
              <Box as={Link} to={generateEventDetailsRoute(gnsEvent)} target="_blank">
                Join now.
              </Box>
            </Type.Caption>
          )}
        </Box>

        <Box mt={24}>
          <NumberInputField
            maxLength={40}
            label="Margin"
            block
            name={fieldName.volume}
            control={control}
            suffix={<Type.Caption color="neutral2">{CURRENCY_PLATFORMS[platform]}</Type.Caption>}
            annotation={
              platform === CopyTradePlatformEnum.SYNTHETIX_V2 ||
              platform === CopyTradePlatformEnum.SYNTHETIX_V3 ||
              platform === CopyTradePlatformEnum.GNS_V8 ? (
                <SmartWalletFund walletId={copyWalletId} platform={platform} />
              ) : (
                <div></div>
              )
            }
            error={volumeError}
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
          <Flex mb={2} alignItems="center" justifyContent="space-between">
            <Flex sx={{ alignItems: 'center', gap: 12, '& *': { mb: '0 !important' } }}>
              <Label label="Trading Pairs" error={errors.tokenAddresses?.message} />
              <SwitchInputField
                switchLabel="Follow the trader"
                labelColor="neutral1"
                {...register(fieldName.copyAll)}
                error={errors.copyAll?.message}
                wrapperSx={{ flexDirection: 'row-reverse', '*': { fontWeight: 400 } }}
                onChange={(newValue: any) => {
                  clearErrors(fieldName.excludingTokenAddresses)
                  clearErrors(fieldName.tokenAddresses)
                  clearErrors(fieldName.hasExclude)
                  setValue(fieldName.copyAll, newValue.target.checked)
                  if (!newValue.target.checked) {
                    setValue(fieldName.excludingTokenAddresses, [])
                    setValue(fieldName.hasExclude, false)
                    setValue(fieldName.tokenAddresses, tradedPairs)
                  }
                }}
              />
            </Flex>

            {copyAll && (
              <Flex
                sx={{
                  alignItems: 'center',
                  gap: 12,
                  '& *': { mb: '0 !important' },
                  '& input:checked + .slider': {
                    backgroundColor: `${themeColors.red1}50 !important`,
                  },
                }}
              >
                <SwitchInputField
                  switchLabel={`Exclude (${excludingTokenAddresses?.length ?? 0})`}
                  labelColor="neutral3"
                  {...register(fieldName.hasExclude)}
                  error={errors.hasExclude?.message}
                  wrapperSx={{
                    flexDirection: 'row-reverse',

                    '*': { fontWeight: 400 },
                  }}
                  tooltipContent={
                    <Type.Caption color="neutral2" maxWidth={400}>
                      The pairs you choose below will not be copied if the trader has a newly opened position.
                    </Type.Caption>
                  }
                />
              </Flex>
            )}
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
              onChange={(newValue: any, actionMeta: any) => {
                clearErrors(fieldName.tokenAddresses)
                if (actionMeta?.option?.value === 'all') {
                  setValue(fieldName.tokenAddresses, allPairs)
                  return
                }
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
        <Box
          display={copyAll && hasExclude ? 'flex' : 'none'}
          sx={{ alignItems: 'center', width: '100%', gap: 1, flexWrap: 'wrap' }}
        >
          <Select
            closeMenuOnSelect={false}
            className="select-container pad-right-0 warning"
            options={pairOptions}
            value={pairOptions?.filter?.((option) => excludingTokenAddresses?.includes(option.value))}
            onChange={(newValue: any, actionMeta: any) => {
              clearErrors(fieldName.excludingTokenAddresses)
              if (actionMeta?.option?.value === 'all') {
                setValue(fieldName.excludingTokenAddresses, allPairs)
                return
              }
              setValue(
                fieldName.excludingTokenAddresses,
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
        {!!errors?.excludingTokenAddresses?.message && (
          <Type.Caption color="red1" mt={1} display="block">
            {errors?.excludingTokenAddresses?.message}
          </Type.Caption>
        )}

        <Box mt={24}>
          <Type.Caption color="neutral2" fontWeight={600}>
            Leverage
            <Box as="span" color={leverage > RISK_LEVERAGE ? 'orange1' : 'primary1'} ml={2}>
              {leverage}x
            </Box>
          </Type.Caption>
          <Box mt={3} pb={28} pl={'6px'} pr={'10px'}>
            <SliderInput
              name={fieldName.leverage}
              control={control}
              error=""
              minValue={2}
              maxValue={50}
              stepValue={1}
              marksStep={5}
              marksUnit={'x'}
            />
          </Box>
          <Type.Caption
            color={leverageError ? 'red1' : leverage > RISK_LEVERAGE ? 'orange1' : 'inherit'}
            display="block"
            sx={{
              height: 22,
              visibility: leverageError || leverage > RISK_LEVERAGE ? 'visible' : 'hidden',
              ...(!leverageError && leverage > RISK_LEVERAGE
                ? {
                    textAlign: ['left', 'justify'],
                    textJustify: 'inter-word',
                    textAlignLast: ['left', 'justify'],
                  }
                : {}),
            }}
          >
            {leverageError
              ? leverageError
              : `The current position is highly leveraged. Please be cautious of the risk involved`}
          </Type.Caption>
        </Box>

        <Box mt={[24, 12]} sx={{ borderRadius: 'xs', border: 'small', borderColor: 'orange1', py: 2, px: 12 }}>
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

        {platform !== CopyTradePlatformEnum.SYNTHETIX_V2 && platform !== CopyTradePlatformEnum.SYNTHETIX_V3 && (
          <Accordion
            header={<Type.BodyBold>Stop Loss / Take Profit</Type.BodyBold>}
            defaultOpen={(isEdit || isClone) && (!!stopLossAmount || !!takeProfitAmount)}
            body={
              <Box mt={3}>
                <NumberInputField
                  maxLength={40}
                  label="Stop Loss (Recommended)"
                  block
                  name={fieldName.stopLossAmount}
                  control={control}
                  error={errors.stopLossAmount?.message}
                  suffix={
                    <InputSuffix>
                      <SelectSLTPType type={stopLossType} onTypeChange={onChangeSLType} />
                      {/*<SelectSLTPType name={fieldName.stopLossType} type={stopLossType} onTypeChange={onChangeSLType} />*/}
                    </InputSuffix>
                  }
                />
                <Type.Caption mt={1} color="neutral2">
                  <Trans>
                    When the position&apos;s loss exceeds{' '}
                    {stopLossAmount ? (
                      <Type.CaptionBold color="red2">
                        {formatNumber(stopLossAmount)} {SLTP_TYPE_TRANS[stopLossType]}
                      </Type.CaptionBold>
                    ) : (
                      '--'
                    )}
                    , the Stop Loss will be triggered to close the position.
                  </Trans>
                </Type.Caption>

                <Box mt={3} />
                <NumberInputField
                  label="Take Profit"
                  block
                  maxLength={40}
                  name={fieldName.takeProfitAmount}
                  control={control}
                  error={errors.takeProfitAmount?.message}
                  suffix={
                    <InputSuffix>
                      <SelectSLTPType type={takeProfitType} onTypeChange={onChangeTPType} />
                    </InputSuffix>
                  }
                />
                <Type.Caption mt={1} color="neutral2">
                  <Trans>
                    When the position&apos;s profit exceeds{' '}
                    {takeProfitAmount ? (
                      <Type.CaptionBold color="green1">
                        {formatNumber(takeProfitAmount)} {SLTP_TYPE_TRANS[takeProfitType]}
                      </Type.CaptionBold>
                    ) : (
                      '--'
                    )}
                    , the Take Profit will be triggered to close the position.
                  </Trans>
                </Type.Caption>

                {isBingXWallet && (
                  <Box bg="rgba(255, 194, 75, 0.10)" py={2} px={12} mt={20}>
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
                )}

                {platform === CopyTradePlatformEnum.GNS_V8 && (
                  <Box bg="rgba(255, 194, 75, 0.10)" py={2} px={12} mt={20}>
                    <Flex sx={{ gap: 2 }} color="orange1" alignItems="center">
                      <ShieldWarning />
                      <Type.CaptionBold>Warning</Type.CaptionBold>
                    </Flex>
                    <Type.Caption mt={2}>
                      <Trans>
                        Due to price slippage prevention, the stop loss price will increase / decrease by 0.1%
                      </Trans>
                    </Type.Caption>
                  </Box>
                )}
              </Box>
            }
          />
        )}
        <Divider />
        <Accordion
          defaultOpen={(isEdit || isClone) && (!!maxMarginPerPosition || !!skipLowLeverage || !!skipLowCollateral)}
          header={
            <Type.BodyBold>
              <Trans>Advance Settings</Trans>
            </Type.BodyBold>
          }
          body={
            <Box mt={3}>
              {platform !== CopyTradePlatformEnum.GNS_V8 && (
                <>
                  <NumberInputField
                    maxLength={40}
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
                </>
              )}

              {platform !== CopyTradePlatformEnum.SYNTHETIX_V2 &&
                platform !== CopyTradePlatformEnum.SYNTHETIX_V3 &&
                platform !== CopyTradePlatformEnum.GNS_V8 && (
                  <Box mt={24}>
                    <NumberInputField
                      maxLength={40}
                      block
                      label="Margin Protection"
                      name={fieldName.lookBackOrders}
                      control={control}
                      error={errors.lookBackOrders?.message}
                      suffix={<InputSuffix>Orders Lookback</InputSuffix>}
                    />
                    <Type.Caption mt={1} color="neutral2">
                      <Trans>
                        Allocating margin based on trader&#39;s average margin of the last{' '}
                        {lookBackOrders ? <Type.CaptionBold>{lookBackOrders}</Type.CaptionBold> : '--'}{' '}
                      </Trans>{' '}
                      orders.{' '}
                      <a href={'https://tutorial.copin.io/how-to-use-copy-trading'} target="_blank" rel="noreferrer">
                        <Trans>Example</Trans>
                      </a>
                    </Type.Caption>
                  </Box>
                )}
              <Box mt={24}>
                <SwitchInputField
                  switchLabel="Skip Lower Leverage Position"
                  // labelColor="orange1"
                  {...register(fieldName.skipLowLeverage)}
                  error={errors.skipLowLeverage?.message}
                />
                <Box mt={2} sx={{ display: skipLowLeverage ? 'block' : 'none' }}>
                  <NumberInputField
                    maxLength={40}
                    block
                    required
                    label="Low Leverage"
                    name={fieldName.lowLeverage}
                    control={control}
                    error={errors.lowLeverage?.message}
                    suffix={<InputSuffix>x</InputSuffix>}
                  />
                </Box>
                <Type.Caption mt={1} color="neutral2">
                  <Trans>You will not copy the position has opened with leverage lower than</Trans> {lowLeverage}x.
                </Type.Caption>
              </Box>
              {platform !== CopyTradePlatformEnum.SYNTHETIX_V2 && platform !== CopyTradePlatformEnum.SYNTHETIX_V3 && (
                <Box mt={24}>
                  <SwitchInputField
                    switchLabel="Skip Lower Collateral Position"
                    // labelColor="orange1"
                    {...register(fieldName.skipLowCollateral)}
                    error={errors.skipLowCollateral?.message}
                  />
                  <Box mt={2} sx={{ display: skipLowCollateral ? 'block' : 'none' }}>
                    <NumberInputField
                      maxLength={40}
                      block
                      required
                      label="Low Collateral"
                      name={fieldName.lowCollateral}
                      control={control}
                      error={errors.lowCollateral?.message}
                      suffix={<InputSuffix>$</InputSuffix>}
                    />
                  </Box>
                  <Type.Caption mt={1} color="neutral2">
                    <Trans>You will not copy the position has opened with collateral lower than</Trans> $
                    {formatNumber(lowCollateral, 0)}.
                  </Type.Caption>
                </Box>
              )}
              {platform !== CopyTradePlatformEnum.GNS_V8 &&
                platform !== CopyTradePlatformEnum.SYNTHETIX_V2 &&
                platform !== CopyTradePlatformEnum.SYNTHETIX_V3 && (
                  <>
                    <Box mt={24}>
                      <SwitchInputField
                        switchLabel="Skip Lower Size Position"
                        // labelColor="orange1"
                        {...register(fieldName.skipLowSize)}
                        error={errors.skipLowSize?.message}
                      />
                      <Box mt={2} sx={{ display: skipLowSize ? 'block' : 'none' }}>
                        <NumberInputField
                          maxLength={40}
                          block
                          required
                          label="Low Size"
                          name={fieldName.lowSize}
                          control={control}
                          error={errors.lowSize?.message}
                          suffix={<InputSuffix>$</InputSuffix>}
                        />
                      </Box>
                      <Type.Caption mt={1} color="neutral2">
                        <Trans>You will not copy the position has opened with size lower than</Trans> $
                        {formatNumber(lowSize, 0)}.
                      </Type.Caption>
                    </Box>
                  </>
                )}
            </Box>
          }
        />

        {(platform === CopyTradePlatformEnum.SYNTHETIX_V2 || platform === CopyTradePlatformEnum.GNS_V8) && (
          <Flex sx={{ gap: 2, borderRadius: 'sm', p: 2 }} bg="neutral6">
            {platform === CopyTradePlatformEnum.SYNTHETIX_V2 && (
              <>
                <Type.Caption color="neutral3">Execution Fee Per Order:</Type.Caption>
                <Type.Caption>0.001 ETH</Type.Caption>
              </>
            )}
            {platform === CopyTradePlatformEnum.GNS_V8 && (
              <>
                <Type.Caption color="neutral3">Max slippage:</Type.Caption>
                <Type.Caption>0.5%</Type.Caption>
              </>
            )}

            <Type.Caption color="neutral2">|</Type.Caption>
            <Type.Caption color="neutral3">Protocol Fee:</Type.Caption>
            <Type.Caption>0.025% trading size</Type.Caption>
          </Flex>
        )}

        {platform === CopyTradePlatformEnum.GNS_V8 && !!gnsEvent && (
          <Type.Caption mt={2} display="block">
            Fee-rebates program is ongoing.{' '}
            <Box as={Link} to={ROUTES.FEE_REBATE.path} target="_blank">
              View.
            </Box>
          </Type.Caption>
        )}

        <Box mt={3}>
          <Checkbox {...register('agreement')}>
            <Type.Caption>
              I have read and I agree to the{' '}
              <a href={LINKS.agreement} target="_blank" rel="noreferrer">
                Copytrading Service Agreement
              </a>
            </Type.Caption>
          </Checkbox>
          {!!errors.agreement?.message && (
            <Type.Caption color="red1" display="block" mt={1}>
              You must agree to the agreement before continuing
            </Type.Caption>
          )}
        </Box>

        <Box sx={{ gap: 4 }} mt={3}>
          <Button
            block
            variant="primary"
            onClick={_handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting || !!Object.keys(errors).length}
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

export const SelectSLTPType = ({
  type = SLTPTypeEnum.PERCENT,
  onTypeChange,
}: {
  type?: SLTPTypeEnum
  onTypeChange: (type: SLTPTypeEnum) => void
}) => {
  const options = [
    { label: SLTP_TYPE_TRANS[SLTPTypeEnum.PERCENT], value: SLTPTypeEnum.PERCENT },
    { label: SLTP_TYPE_TRANS[SLTPTypeEnum.USD], value: SLTPTypeEnum.USD },
  ]
  const renderTypes = useCallback(() => {
    return (
      <Box>
        {options.map((option) => (
          <DropdownItem key={option.value} size="sm" onClick={() => onTypeChange(option.value)}>
            <Type.Caption color={type === option.value ? 'primary1' : 'inherit'}>{option.label}</Type.Caption>
          </DropdownItem>
        ))}
      </Box>
    )
  }, [options, type])
  return (
    <Dropdown
      menu={renderTypes()}
      buttonVariant="ghost"
      buttonSx={{ p: 0, border: 'none' }}
      menuSx={{ minWidth: 70, width: 70 }}
      hasArrow
    >
      <Type.Caption>{SLTP_TYPE_TRANS[type]}</Type.Caption>
    </Dropdown>
  )
}

function InputSuffix({ children }: { children: ReactNode }) {
  return <Type.Caption color="neutral2">{children}</Type.Caption>
}

export default CopyTraderForm
