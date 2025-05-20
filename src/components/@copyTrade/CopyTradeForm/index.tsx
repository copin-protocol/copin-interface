import { yupResolver } from '@hookform/resolvers/yup'
import { Trans } from '@lingui/macro'
import { CrownSimple, StarFour } from '@phosphor-icons/react'
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

import { getCopyTradeSettingsListApi } from 'apis/copyTradeApis'
import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import UpgradeModal from 'components/@subscription/UpgradeModal'
import Divider from 'components/@ui/Divider'
import LabelWithTooltip from 'components/@ui/LabelWithTooltip'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { parseInputValue } from 'components/@ui/TextWithEdit'
import ToastBody from 'components/@ui/ToastBody'
import { renderTrader } from 'components/@widgets/renderProps'
import { ProtocolPermission, ProtocolPermissionConfig } from 'entities/permission'
import useCheckCopyTradeExchange from 'hooks/features/copyTrade/useCheckCopyExchange'
import useCopyTradePermission from 'hooks/features/subscription/useCopyTradePermission'
import useGetSubscriptionPermission from 'hooks/features/subscription/useGetSubscriptionPermission'
import useGetTokensTraded from 'hooks/features/trader/useGetTokensTraded'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useInternalRole from 'hooks/features/useInternalRole'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useMyProfileStore from 'hooks/store/useMyProfile'
import Accordion from 'theme/Accordion'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Checkbox from 'theme/Checkbox'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import Input, { Textarea } from 'theme/Input'
import InputField from 'theme/InputField'
import Label from 'theme/InputField/Label'
import NumberInputField from 'theme/InputField/NumberInputField'
import RadioGroup from 'theme/RadioGroup'
import Select from 'theme/Select'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DCP_SUPPORTED_PROTOCOLS, DEFAULT_PROTOCOL, LINKS } from 'utils/config/constants'
import {
  CopyTradePlatformEnum,
  CopyTradeSideEnum,
  CopyTradeStatusEnum,
  SLTPTypeEnum,
  SubscriptionFeatureEnum,
  SubscriptionPermission,
  SubscriptionPlanEnum,
} from 'utils/config/enums'
import { CURRENCY_PLATFORMS } from 'utils/config/platforms'
import { TOKEN_TRADE_IGNORE } from 'utils/config/trades'
import { COPY_SIDE_TRANS, SLTP_TYPE_TRANS } from 'utils/config/translations'
import { formatNumber } from 'utils/helpers/format'
import { getAvatarName } from 'utils/helpers/generateAvatar'
import { getCopyService } from 'utils/helpers/getCopyService'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'
import { capitalizeFirstLetter } from 'utils/helpers/transform'
import { getUserForTracking, logEventLite } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import {
  dcpExchangeOptions,
  fieldName,
  getExchangeOptions,
  getProtocolOptions,
  internalExchangeOptions,
  vaultExchangeOptions,
} from '../configs'
import { CopyTradeFormValues } from '../types'
import {
  bulkUpdateFormSchema,
  cloneCopyTradeFormSchema,
  copyTradeFormSchema,
  updateCopyTradeFormSchema,
} from '../yupSchemas'
import FundChecking, { SmartWalletFund } from './FundChecking'
import QuickEditField from './QuickEditField'
import VaultWallets from './VaultWallets'
import Wallets from './Wallets'

export type FormType = 'edit' | 'create' | 'clone' | 'onboarding' | 'lite' | 'vault' | 'bulkEdit' | 'dcp'

type Props = {
  onSubmit: (data: CopyTradeFormValues) => void
  isSubmitting: boolean
  defaultFormValues: CopyTradeFormValues
  submitButtonText?: ReactNode
  formTypes?: FormType[]
  defaultOpenUpgradeModal?: boolean
  onDismissUpgradeModal?: () => void
}
const CopyTraderForm = ({
  onSubmit,
  defaultOpenUpgradeModal = false,
  isSubmitting: requestSubmitting,
  defaultFormValues: _defaultFormValues,
  submitButtonText = 'Copy Trade',
  formTypes,
  onDismissUpgradeModal,
}: Props) => {
  const isEdit = !!formTypes?.includes('edit')
  const isClone = !!formTypes?.includes('clone')
  const isVault = !!formTypes?.includes('vault')
  const isLite = !!formTypes?.includes('lite')
  const isOnboarding = !!formTypes?.includes('onboarding')
  const isBulkEdit = !!formTypes?.includes('bulkEdit')
  const isDcp = !!formTypes?.includes('dcp')
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
    formState: { errors, isDirty },
  } = useForm<CopyTradeFormValues>({
    // mode: 'onChange',
    resolver: yupResolver(
      isBulkEdit
        ? bulkUpdateFormSchema
        : isClone
        ? cloneCopyTradeFormSchema
        : isEdit
        ? updateCopyTradeFormSchema
        : copyTradeFormSchema
    ),
  })

  const [
    title,
    platform,
    protocol = DEFAULT_PROTOCOL,
    volume,
    copyWalletId,
    leverage,
    stopLossType,
    stopLossAmount,
    takeProfitType,
    takeProfitAmount,
    maxMarginPerPosition,
    lookBackOrders,
    tokenAddresses = [],
    copyAll,
    excludingTokenAddresses,
    hasExclude,
    skipLowLeverage,
    lowLeverage,
    skipLowCollateral,
    lowCollateral,
    skipLowSize,
    lowSize,
    multipleCopy,
    account,
    accounts,
    duplicateToAddress,
    side,
  ] = watch([
    'title',
    'exchange',
    'protocol',
    'volume',
    'copyWalletId',
    'leverage',
    'stopLossType',
    'stopLossAmount',
    'takeProfitType',
    'takeProfitAmount',
    'maxMarginPerPosition',
    'lookBackOrders',
    'tokenAddresses',
    'copyAll',
    'excludingTokenAddresses',
    'hasExclude',
    'skipLowLeverage',
    'lowLeverage',
    'skipLowCollateral',
    'lowCollateral',
    'skipLowSize',
    'lowSize',
    'multipleCopy',
    'account',
    'accounts',
    'duplicateToAddress',
    'side',
  ])

  const { disabledExchanges } = useCheckCopyTradeExchange()
  const isInternal = useInternalRole()

  const { userPermission, pagePermission } = useCopyTradePermission()
  const { userPermission: userProtocolPermission, pagePermission: pageProtocolPermission } =
    useGetSubscriptionPermission<ProtocolPermission, ProtocolPermissionConfig>({
      section: SubscriptionPermission.PROTOCOL,
    })

  const isEnableMultiAccount = userPermission?.isEnableMultiAccount

  const enableMultiAccountRequiredPlan = getRequiredPlan({
    conditionFn: (plan) => !!pagePermission?.[plan]?.isEnableMultiAccount,
  })

  // TODO: comeback

  const { getListSymbolOptions, getListSymbolByListIndexToken, getListIndexTokenByListSymbols } = useMarketsConfig()

  const pairOptions = useMemo(() => {
    const allOptions = getListSymbolOptions?.().filter(
      (option) => !TOKEN_TRADE_IGNORE[platform]?.includes(option.value)
    )
    if (!allOptions?.length) return []
    allOptions.unshift({ id: 'all', value: 'all', label: 'All Tokens' })
    return allOptions
  }, [getListSymbolOptions, platform])

  const allPairs = pairOptions.slice(1).map((p) => p.value)

  useGetTokensTraded(
    {
      account: isClone ? duplicateToAddress ?? '' : account ?? '',
      protocol,
    },
    {
      enabled: !isEdit && (isClone ? !!duplicateToAddress : !!account) && !isBulkEdit,
      select: (data) => {
        const symbols = getListSymbolByListIndexToken?.({ protocol, listIndexToken: data })
        if (!symbols?.length) return []
        return symbols.filter((address) => !TOKEN_TRADE_IGNORE[platform]?.includes(address))
      },
      onSuccess: (data) => {
        if (!!data?.length) {
          if (!isEdit && (isClone ? !!duplicateToAddress : !!account) && !isBulkEdit) {
            setValue('tokenAddresses', data)
          }
          setTradedPairs(data ?? [])
        }
      },
    }
  )
  const { copyWallets } = useCopyWalletContext()

  const recheckedExchange = useRef(false)
  const [tradedPairs, setTradedPairs] = useState<string[]>([])
  const [isOpenUpgradeModal, setIsOpenUpgradeModal] = useState(defaultOpenUpgradeModal)
  const [submitting, setSubmitting] = useState(false)

  const cexOptions = isInternal ? internalExchangeOptions : getExchangeOptions({ userPermission, pagePermission })
  const options = (
    isVault
      ? vaultExchangeOptions
      : !!protocol && DCP_SUPPORTED_PROTOCOLS.includes(protocol)
      ? [...dcpExchangeOptions, ...cexOptions]
      : cexOptions
  ).filter((v) => {
    return disabledExchanges.length ? !disabledExchanges.includes(v.value) : true
  })

  useEffect(() => {
    if (recheckedExchange.current) return
    if (platform === CopyTradePlatformEnum.GNS_V8 && disabledExchanges.includes(platform) && isClone) {
      setValue('exchange', CopyTradePlatformEnum.HYPERLIQUID)
      recheckedExchange.current = true
    }
  }, [platform, disabledExchanges, isClone])

  const setDefaultWallet = (currentPlatform: string) => {
    const copyWalletsByExchange = copyWallets?.filter((e) => e.exchange === currentPlatform)
    onChangeWallet(copyWalletsByExchange?.[0]?.id ?? '')
  }

  const onChangeWallet = (walletId: string) =>
    setValue(fieldName.copyWalletId, walletId, { shouldValidate: true, shouldDirty: true })

  const onChangeSLType = (type: SLTPTypeEnum) => setValue(fieldName.stopLossType, type)

  const onChangeTPType = (type: SLTPTypeEnum) => setValue(fieldName.takeProfitType, type)

  const onChangeSide = (side: CopyTradeSideEnum) => setValue(fieldName.side, side, { shouldDirty: true })

  const myProfile = useMyProfileStore((_s) => _s.myProfile)

  // Todo: uncomment after 20/4
  const _handleSubmit = () =>
    handleSubmit(async (_formValues) => {
      setSubmitting(true)
      const formValues = { ..._formValues }
      if (formValues.tokenAddresses?.length) {
        formValues.tokenAddresses =
          getListIndexTokenByListSymbols?.({
            protocol,
            listSymbol: formValues.tokenAddresses,
          }) ?? []
      }
      if (formValues.excludingTokenAddresses?.length) {
        formValues.excludingTokenAddresses =
          getListIndexTokenByListSymbols?.({
            protocol,
            listSymbol: formValues.excludingTokenAddresses,
          }) ?? []
      }
      delete formValues.totalVolume
      const allCopyTrades = await getCopyTradeSettingsListApi()
      if (
        !isEdit &&
        !isBulkEdit &&
        userPermission?.copyTradeQuota != null &&
        allCopyTrades.filter((copyTrade) => copyTrade.status === CopyTradeStatusEnum.RUNNING).length + 1 >
          userPermission.copyTradeQuota
      ) {
        setIsOpenUpgradeModal(true)
        setSubmitting(false)
        return
      }

      onSubmit(formValues)
      setSubmitting(false)
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
    if (!defaultFormValues.title && defaultFormValues?.account) {
      defaultFormValues.title = capitalizeFirstLetter(getAvatarName({ address: defaultFormValues.account }))
    }
    if (defaultFormValues.tokenAddresses?.length) {
      defaultFormValues.tokenAddresses =
        getListSymbolByListIndexToken?.({
          protocol: defaultFormValues.protocol ?? DEFAULT_PROTOCOL,
          listIndexToken: defaultFormValues.tokenAddresses,
        }) ?? []
    }
    if (defaultFormValues.excludingTokenAddresses?.length) {
      defaultFormValues.excludingTokenAddresses =
        getListSymbolByListIndexToken?.({
          protocol: defaultFormValues.protocol ?? DEFAULT_PROTOCOL,
          listIndexToken: defaultFormValues.excludingTokenAddresses,
        }) ?? []
    }
    reset(defaultFormValues)
    setTimeout(() => {
      if (isEdit || isBulkEdit) {
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

  const permissionToSelectProtocol = !isLite && (isEdit || isClone) && !isBulkEdit
  const disabledSelectWallet = isClone && !isInternal
  const hiddenSelectWallet = isEdit || isLite || isOnboarding || isBulkEdit
  const isSubmitting = requestSubmitting || submitting
  const protocolOptions = useMemo(() => {
    return getProtocolOptions({
      userPermission: userProtocolPermission,
      pagePermission: pageProtocolPermission,
    })
  }, [userProtocolPermission, pageProtocolPermission])

  const SwitchMultipleCopy = useCallback(
    (props: { label: string; switchLabel: string }) => {
      return (
        <Flex mb={12} sx={{ alignItems: 'center', gap: 12, '& *': { mb: '0 !important' } }}>
          <Label label={props.label} />
          <SwitchInputField
            disabled={!isEnableMultiAccount}
            switchLabel={
              <Flex alignItems="center" sx={{ gap: 1 }}>
                <LabelWithTooltip
                  id="tt_multiple_address"
                  tooltip={`Allows copying multiple traders with the same configuration. List of addresses in line break format.`}
                  sx={{
                    borderBottom: '1px dashed',
                    mb: '-1px',
                    borderBottomColor: 'neutral3',
                    textDecoration: 'none',
                  }}
                >
                  {props.switchLabel}
                </LabelWithTooltip>
                {!isEnableMultiAccount && !!enableMultiAccountRequiredPlan && (
                  <PlanUpgradeIndicator
                    requiredPlan={enableMultiAccountRequiredPlan as SubscriptionPlanEnum}
                    learnMoreSection={SubscriptionFeatureEnum.COPY_TRADE}
                  />
                )}
              </Flex>
            }
            labelColor="neutral1"
            {...register(fieldName.multipleCopy)}
            wrapperSx={{ flexDirection: 'row-reverse', '*': { fontWeight: 400 } }}
            onChange={(newValue: any) => {
              if (!isEnableMultiAccount) {
                setValue(fieldName.multipleCopy, false)
              } else {
                setValue(fieldName.multipleCopy, newValue.target.checked)
              }
            }}
          />
        </Flex>
      )
    },
    [register, isEnableMultiAccount]
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

  const volumeError = errors.volume?.message

  const updateNumberValue = ({
    value,
    field,
    booleanField,
  }: {
    value: string
    field: keyof CopyTradeFormValues
    booleanField?: keyof CopyTradeFormValues
  }) => {
    if (typeof value !== 'string') return
    if (value === '' || value === '--') {
      setValue(field, undefined, { shouldDirty: true })
      if (booleanField) {
        setValue(booleanField, false, { shouldDirty: true })
      }
      return
    }
    const numberValue = parseInputValue(value)
    setValue(field, numberValue, { shouldDirty: true })
    if (booleanField) {
      setValue(booleanField, true, { shouldDirty: true })
    }
  }
  const validateNumberValue = ({ value, field }: { value: string; field: keyof CopyTradeFormValues }) => {
    if (typeof value !== 'string') return
    const numberValue = parseInputValue(value)
    if (value === '') {
      return true
    }
    switch (field) {
      case 'volume':
        return true
      case 'leverage':
        if (numberValue < 2) {
          toast.error(<ToastBody title="Error" message="Leverage must be greater than or equal to 2" />)
          return
        }
        if (numberValue > 50) {
          toast.error(<ToastBody title="Error" message="Leverage must be less than 50x" />)
          return
        }
        return true
    }
    return numberValue >= 0
  }

  return (
    <>
      {!isBulkEdit && !isOnboarding && account && protocol && (
        <Flex mb={1} px={[12, 3]} sx={{ alignItems: 'center', gap: 2 }}>
          {renderTrader(account, protocol, true)}
          <Type.Caption>-</Type.Caption>
          <Flex sx={{ alignItems: 'center', gap: 2 }}>
            <ProtocolLogo protocol={protocol} size={24} />
          </Flex>
        </Flex>
      )}
      {/* {!isOnboarding && !isLite && (
        <Type.Caption mt={12} px={[12, 3]} display="inline-block" color="neutral3">
          Your current copy size:{' '}
          <Box as="span" color={getCopyVolumeColor({ copyVolume: currentCopyVolume ?? 0, maxVolume })}>
            {currentCopyVolume == null ? '--' : `$${formatNumber(currentCopyVolume, 0, 0)}`}
          </Box>{' '}
          {!isUnlimitedCopySize && (
            <Box as="span" sx={{ fontWeight: 600, color: 'neutral1' }}>
              / ${formatNumber(maxVolume, 0, 0)}
            </Box>
          )}
        </Type.Caption>
      )} */}

      <Box sx={{ pb: 20, px: [12, 3], mt: 3 }}>
        {!isBulkEdit && (isEdit || isClone) && !isLite && (
          <>
            {isEdit && (
              <Box mt={20}>
                <SwitchMultipleCopy label="Address" switchLabel="Multiple addresses" />
                {multipleCopy && (
                  <Textarea
                    block
                    rows={5}
                    placeholder={`List of addresses in line break format as below:\n0xaddress1\n0xaddress2`}
                    value={accounts?.join('\n') || account}
                    defaultValue={_defaultFormValues?.accounts?.join('\n') || _defaultFormValues?.account}
                    sx={{ textarea: { fontSize: 12 } }}
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
                <Box mt={20}>
                  <SwitchMultipleCopy label="Clone to address" switchLabel="Multiple addresses" />
                  {multipleCopy && (
                    <Textarea
                      block
                      rows={5}
                      value={accounts?.join('\n')}
                      defaultValue={_defaultFormValues?.accounts?.join('\n')}
                      sx={{ textarea: { fontSize: 12 } }}
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

        {permissionToSelectProtocol && (
          <Box
            mt={20}
            sx={{
              flex: '0 0 max-content',
            }}
          >
            <Label label="Protocol" />
            <Select
              options={protocolOptions}
              defaultMenuIsOpen={false}
              value={protocolOptions.find((option) => option.value === protocol)}
              onChange={(newValue: any) => {
                setValue('protocol', newValue.value, { shouldDirty: true })
                setValue('serviceKey', getCopyService({ protocol: newValue.value, exchange: platform, isInternal }))
              }}
              isSearchable
              isDisabled={!!_defaultFormValues.duplicateToAddress}
            />
          </Box>
        )}

        {!hiddenSelectWallet && (
          <Box mt={20}>
            {isClone ? (
              <Flex mb={3} alignItems="center" sx={{ gap: 1 }}>
                <LabelWithTooltip
                  id="tt_copy_wallet"
                  tooltip={`The feature for premium users allows cloning a copy-trade settings to other wallet.`}
                  sx={{
                    borderBottom: '1px dashed',
                    mb: '-1px',
                    borderBottomColor: 'neutral3',
                    textDecoration: 'none',
                  }}
                >
                  Your Copy Wallet
                </LabelWithTooltip>
                <IconBox icon={<CrownSimple size={16} weight="fill" />} color="orange1" />
              </Flex>
            ) : (
              <Label label="Your Copy Wallet" />
            )}
            <Flex sx={{ gap: 2, alignItems: ['start', 'end'] }}>
              <Box flex={1} sx={{ '&& .select__menu': { zIndex: 10 } }}>
                <Select
                  components={isLite ? { DropdownIndicator: SelectWalletIndicatorLite } : {}}
                  options={options}
                  defaultMenuIsOpen={false}
                  value={options.find((option) => option.value === platform)}
                  onChange={(newValue: any) => {
                    if (platform !== newValue.value) {
                      setDefaultWallet(newValue.value)
                    }
                    setValue(fieldName.exchange, newValue.value, { shouldDirty: true })
                  }}
                  isSearchable
                  isDisabled={disabledSelectWallet}
                />
              </Box>

              <Box flex={1}>
                {isVault ? (
                  <VaultWallets
                    disabledSelect={disabledSelectWallet}
                    platform={platform}
                    currentWalletId={copyWalletId}
                    onChangeWallet={onChangeWallet}
                  />
                ) : (
                  <Wallets
                    disabledSelect={disabledSelectWallet}
                    platform={platform}
                    currentWalletId={copyWalletId}
                    onChangeWallet={onChangeWallet}
                    selectProps={{ components: isLite ? { DropdownIndicator: SelectWalletIndicatorLite } : {} }}
                  />
                )}
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
            {/*{platform === CopyTradePlatformEnum.GNS_V8 && !!gnsEvent && (*/}
            {/*  <Type.Caption mt={2} display="block">*/}
            {/*    DCP gTrade competition is ongoing.{' '}*/}
            {/*    <Box as={Link} to={generateEventDetailsRoute(gnsEvent)} target="_blank">*/}
            {/*      Join now.*/}
            {/*    </Box>*/}
            {/*  </Type.Caption>*/}
            {/*)}*/}
          </Box>
        )}

        <Flex alignItems="flex-start" mt={20} sx={{ gap: 2 }}>
          <Box flex={1}>
            <NumberInputField
              maxLength={40}
              label={
                <LabelWithTooltip
                  id="tt_margin_per_order"
                  tooltip={`When the trader opens a trade, the maximum margin per order is ${formatNumber(volume)} USD`}
                  sx={{
                    borderBottom: '1px dashed',
                    mb: '-1px',
                    borderBottomColor: 'neutral4',
                    textDecoration: 'none',
                  }}
                >
                  Margin Per Order
                </LabelWithTooltip>
              }
              block
              name={fieldName.volume}
              control={control}
              suffix={<Type.Caption color="neutral2">{CURRENCY_PLATFORMS[platform]}</Type.Caption>}
              annotation={
                platform === CopyTradePlatformEnum.SYNTHETIX_V2 ||
                platform === CopyTradePlatformEnum.SYNTHETIX_V3 ||
                platform === CopyTradePlatformEnum.GNS_V8 ? (
                  <SmartWalletFund
                    walletId={copyWalletId}
                    platform={platform}
                    sx={{ display: 'flex', flexDirection: 'row', alignItems: 'end' }}
                  />
                ) : (
                  <div></div>
                )
              }
              error={volumeError}
            />
          </Box>
          <Box flex={1}>
            <NumberInputField
              maxLength={40}
              block
              sx={{ height: '100%', justifyContent: 'space-between' }}
              label={
                <LabelWithTooltip
                  id="tt_leverage"
                  tooltip={`Minimum leverage is 2 and maximum leverage is 50`}
                  sx={{
                    borderBottom: '1px dashed',
                    mb: '-1px',
                    borderBottomColor: 'neutral4',
                    textDecoration: 'none',
                  }}
                >
                  Leverage
                </LabelWithTooltip>
              }
              name={fieldName.leverage}
              control={control}
              error={errors.leverage?.message}
              suffix={<InputSuffix>x</InputSuffix>}
            />
          </Box>
        </Flex>
        <FundChecking walletId={copyWalletId} amount={volume} />
        {platform !== CopyTradePlatformEnum.GNS_V8 && !(isBulkEdit && isDcp) && (
          <>
            <NumberInputField
              maxLength={40}
              block
              label={
                <LabelWithTooltip
                  id="tt_leverage"
                  tooltip={`When the trader increases the position, you will follow with a maximum of ${
                    maxMarginPerPosition ? formatNumber(maxMarginPerPosition) : '--'
                  } USD as the margin.`}
                  sx={{
                    borderBottom: '1px dashed',
                    mb: '-1px',
                    borderBottomColor: 'neutral4',
                    textDecoration: 'none',
                  }}
                >
                  Maximum Position Margin
                </LabelWithTooltip>
              }
              name={fieldName.maxMarginPerPosition}
              control={control}
              error={errors.maxMarginPerPosition?.message}
              suffix={<InputSuffix>USD</InputSuffix>}
              sx={{ mt: 20 }}
            />
          </>
        )}
        <Divider mt={24} />

        <Accordion
          headerWrapperSx={{ gap: 2, justifyContent: 'start', '& > *:first-child': { width: 'auto' } }}
          defaultOpen={
            (isEdit || isClone) &&
            (takeProfitAmount != null ||
              stopLossAmount != null ||
              !!lookBackOrders ||
              !!skipLowLeverage ||
              !!skipLowCollateral ||
              !!skipLowSize)
          }
          header={
            <Type.BodyBold>
              <Trans>ADVANCE SETTINGS</Trans>
            </Type.BodyBold>
          }
          subHeader={
            <>
              <Box flex="1" order={3} />
              <ButtonWithIcon
                spacing={1}
                size="xs"
                icon={<StarFour size={16} />}
                onClick={() => {
                  setValue('takeProfitAmount', 50, { shouldDirty: true })
                  setValue('takeProfitType', SLTPTypeEnum.PERCENT, { shouldDirty: true })
                  setValue('stopLossAmount', 50, { shouldDirty: true })
                  setValue('stopLossType', SLTPTypeEnum.PERCENT, { shouldDirty: true })
                  setValue('lookBackOrders', 10, { shouldDirty: true })
                  setValue('skipLowLeverage', true, { shouldDirty: true })
                  setValue('lowLeverage', 5, { shouldDirty: true })
                  setValue('skipLowCollateral', true, { shouldDirty: true })
                  setValue('lowCollateral', 300, { shouldDirty: true })
                  setValue('skipLowSize', true, { shouldDirty: true })
                  setValue('lowSize', 20_000, { shouldDirty: true })
                  if (isLite) {
                    logEventLite({
                      event: EVENT_ACTIONS[EventCategory.LITE].LITE_COPY_USE_RECOMMEDATION_SETTINGS,
                      username: getUserForTracking(myProfile?.username),
                    })
                  }
                }}
                sx={{
                  overflow: 'hidden',
                  color: 'neutral7',
                  '& svg': { fill: 'neutral7' },
                  backgroundImage: 'linear-gradient(90deg, #A9AFFF 0%, #FFAEFF 100%)',
                  '&:hover': {
                    backgroundImage: 'linear-gradient(90deg, #A9AFFF 0%, #FFAEFF 50%,  #A9AFFF 100%)',
                  },
                  transition: 'all 0.3s ease',
                  order: 4,
                }}
              >
                <Type.CaptionBold>
                  <Trans>Auto-Fill Recommendations</Trans>
                </Type.CaptionBold>
              </ButtonWithIcon>
            </>
          }
          body={
            <Box
              mt={3}
              sx={{
                '.select__control': { maxHeight: '300px !important' },
                '&& .select__indicators': { height: 'max-content', position: 'sticky', top: 0 },
              }}
            >
              {!isBulkEdit && (
                <>
                  <Box>
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
                        menuIsOpen={allPairs.length === tokenAddresses?.length ? false : undefined}
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
                      menuIsOpen={allPairs.length === excludingTokenAddresses?.length ? false : undefined}
                      isSearchable
                      isMulti
                    />
                  </Box>
                  {!!errors?.excludingTokenAddresses?.message && (
                    <Type.Caption color="red1" mt={1} display="block">
                      {errors?.excludingTokenAddresses?.message}
                    </Type.Caption>
                  )}
                </>
              )}
              {!isBulkEdit && (
                <Box mt={20}>
                  <InputField
                    block
                    maxLength={40}
                    {...register(fieldName.title)}
                    error={errors.title?.message}
                    label="Label"
                  />
                </Box>
              )}
              {platform !== CopyTradePlatformEnum.SYNTHETIX_V2 && platform !== CopyTradePlatformEnum.SYNTHETIX_V3 && (
                <Flex mt={3} sx={{ gap: 2 }}>
                  <Box flex={1}>
                    <NumberInputField
                      label={
                        <LabelWithTooltip
                          id="tt_stop_loss"
                          tooltip={`When the position's loss exceeds ${
                            stopLossAmount ? (
                              <Type.CaptionBold color="red2">
                                {formatNumber(stopLossAmount)} {SLTP_TYPE_TRANS[stopLossType]}
                              </Type.CaptionBold>
                            ) : (
                              '--'
                            )
                          }, the Stop Loss will be triggered to close the position.`}
                          sx={{
                            borderBottom: '1px dashed',
                            mb: '-1px',
                            borderBottomColor: 'neutral4',
                            textDecoration: 'none',
                          }}
                        >
                          Stop Loss (Recommended)
                        </LabelWithTooltip>
                      }
                      block
                      name={fieldName.stopLossAmount}
                      control={control}
                      error={errors.stopLossAmount?.message}
                      suffix={
                        <InputSuffix>
                          <SelectSLTPType type={stopLossType} onTypeChange={onChangeSLType} />
                        </InputSuffix>
                      }
                    />
                  </Box>
                  <Box flex={1}>
                    <NumberInputField
                      label={
                        <LabelWithTooltip
                          id="tt_take_profit"
                          tooltip={`When the position's profit exceeds ${
                            takeProfitAmount ? (
                              <Type.CaptionBold color="green1">
                                {formatNumber(takeProfitAmount)} {SLTP_TYPE_TRANS[takeProfitType]}
                              </Type.CaptionBold>
                            ) : (
                              '--'
                            )
                          }, the Take Profit will be triggered to close the position.`}
                          sx={{
                            borderBottom: '1px dashed',
                            mb: '-1px',
                            borderBottomColor: 'neutral4',
                            textDecoration: 'none',
                          }}
                        >
                          Take Profit
                        </LabelWithTooltip>
                      }
                      block
                      name={fieldName.takeProfitAmount}
                      control={control}
                      error={errors.takeProfitAmount?.message}
                      suffix={
                        <InputSuffix>
                          <SelectSLTPType type={takeProfitType} onTypeChange={onChangeTPType} />
                        </InputSuffix>
                      }
                    />
                  </Box>
                </Flex>
              )}

              <SelectSide side={side} onChangeSide={onChangeSide} />

              {platform !== CopyTradePlatformEnum.SYNTHETIX_V2 &&
                platform !== CopyTradePlatformEnum.SYNTHETIX_V3 &&
                platform !== CopyTradePlatformEnum.GNS_V8 &&
                (!(isBulkEdit && isDcp) ? (
                  <Box mt={24}>
                    <Type.CaptionBold mb={1}>
                      <Trans>Adjust Margin</Trans>
                    </Type.CaptionBold>
                    <Flex sx={{ flexDirection: 'column', gap: 1, width: '100%' }}>
                      <QuickEditField
                        value={lookBackOrders}
                        label={<Trans>Look Back The Latest</Trans>}
                        tooltipContent={
                          <Type.Caption>
                            <Trans>
                              Allocating margin based on trader&apos;s average margin of the last{' '}
                              {lookBackOrders ? <b>{lookBackOrders}</b> : '--'} orders.{' '}
                              {/* <a
                                  href={'https://tutorial.copin.io/how-to-use-copy-trading'}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <Trans>Example</Trans>
                                </a> */}
                            </Trans>
                          </Type.Caption>
                        }
                        unit="Orders"
                        onSave={(value) => updateNumberValue({ value, field: 'lookBackOrders' })}
                        onValidate={(value) => {
                          clearErrors('lookBackOrders')
                          return validateNumberValue({
                            value,
                            field: 'lookBackOrders',
                          })
                        }}
                      />
                    </Flex>
                  </Box>
                ) : null)}
              <Box mt={24}>
                <Type.CaptionBold mb={1}>
                  <Trans>Skip Trade</Trans>
                </Type.CaptionBold>

                <Flex sx={{ flexDirection: 'column', gap: 1, width: '100%' }}>
                  <QuickEditField
                    value={lowLeverage}
                    label={<Trans>Leverage Lower Than</Trans>}
                    tooltipContent={
                      <Type.Caption>
                        <Trans>You will not copy the position has opened with leverage lower than</Trans> {lowLeverage}
                        x.
                      </Type.Caption>
                    }
                    unit="x"
                    onSave={(value) =>
                      updateNumberValue({ value, field: 'lowLeverage', booleanField: 'skipLowLeverage' })
                    }
                    onValidate={(value) => {
                      clearErrors('lowLeverage')
                      return validateNumberValue({
                        value,
                        field: 'lowLeverage',
                      })
                    }}
                  />

                  {platform !== CopyTradePlatformEnum.SYNTHETIX_V2 &&
                    platform !== CopyTradePlatformEnum.SYNTHETIX_V3 && (
                      <QuickEditField
                        value={lowCollateral}
                        label={<Trans>Collateral Lower Than</Trans>}
                        tooltipContent={
                          <Type.Caption>
                            <Trans>You will not copy the position has opened with collateral lower than</Trans> $
                            {formatNumber(lowCollateral, 0)}.
                          </Type.Caption>
                        }
                        unit="USD"
                        onSave={(value) =>
                          updateNumberValue({ value, field: 'lowCollateral', booleanField: 'skipLowCollateral' })
                        }
                        onValidate={(value) => {
                          clearErrors('lowCollateral')
                          return validateNumberValue({
                            value,
                            field: 'lowCollateral',
                          })
                        }}
                      />
                    )}

                  {platform !== CopyTradePlatformEnum.GNS_V8 &&
                    platform !== CopyTradePlatformEnum.SYNTHETIX_V2 &&
                    platform !== CopyTradePlatformEnum.SYNTHETIX_V3 &&
                    !(isBulkEdit && isDcp) && (
                      <QuickEditField
                        value={lowSize}
                        label={<Trans>Size Lower Than</Trans>}
                        tooltipContent={
                          <Type.Caption>
                            <Trans>You will not copy the position has opened with size lower than</Trans> $
                            {formatNumber(lowSize, 0)}.
                          </Type.Caption>
                        }
                        unit="USD"
                        onSave={(value) => updateNumberValue({ value, field: 'lowSize', booleanField: 'skipLowSize' })}
                        onValidate={(value) => {
                          clearErrors('lowSize')
                          return validateNumberValue({
                            value,
                            field: 'lowSize',
                          })
                        }}
                      />
                    )}
                </Flex>
              </Box>

              <Box mt={20} sx={{ borderRadius: 'xs', border: 'small', borderColor: 'orange1', py: 2, px: 12 }}>
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

        {!isBulkEdit && (
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
        )}

        <Box sx={{ gap: 4 }} mt={3}>
          <Button
            block
            variant="primary"
            onClick={_handleSubmit}
            isLoading={isSubmitting}
            disabled={!isDirty || isSubmitting || !!Object.keys(errors).length}
          >
            {submitButtonText}
          </Button>
          {/*<Button block variant="primary" disabled>*/}
          {/*  Maintaining*/}
          {/*</Button>*/}
        </Box>
      </Box>
      {!!pagePermission?.[SubscriptionPlanEnum.ELITE] && (
        <UpgradeModal
          isOpen={isOpenUpgradeModal}
          onDismiss={() => {
            setIsOpenUpgradeModal(false)
            onDismissUpgradeModal?.()
          }}
          title={<Trans>You&apos;ve hit your copy trades limit</Trans>}
          description={
            <Trans>
              You&apos;re reach the maximum of Copy Trades for your current plan. Upgrade your plan to unlock access up
              to {pagePermission[SubscriptionPlanEnum.ELITE].copyTradeQuota} copy trades
            </Trans>
          }
        />
      )}
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
    <Dropdown menu={renderTypes()} buttonVariant="ghost" inline menuSx={{ minWidth: 70, width: 70 }} hasArrow>
      <Type.Caption>{SLTP_TYPE_TRANS[type]}</Type.Caption>
    </Dropdown>
  )
}

export const SelectSide = ({
  side = CopyTradeSideEnum.BOTH,
  onChangeSide,
}: {
  side?: CopyTradeSideEnum
  onChangeSide: (type: CopyTradeSideEnum) => void
}) => {
  const options = [
    { label: COPY_SIDE_TRANS[CopyTradeSideEnum.BOTH], value: CopyTradeSideEnum.BOTH },
    {
      label: <Type.Caption>{COPY_SIDE_TRANS[CopyTradeSideEnum.ONLY_LONG]}</Type.Caption>,
      value: CopyTradeSideEnum.ONLY_LONG,
    },
    {
      label: <Type.Caption> {COPY_SIDE_TRANS[CopyTradeSideEnum.ONLY_SHORT]}</Type.Caption>,
      value: CopyTradeSideEnum.ONLY_SHORT,
    },
  ]

  return (
    <Box mt={3}>
      <LabelWithTooltip
        id={'tt_position_side'}
        tooltip={`You will only copy positions that are opened with the selected side strategy.`}
        sx={{
          borderBottom: '1px dashed',
          mb: 2,
          borderBottomColor: 'neutral3',
          textDecoration: 'none',
        }}
      >
        Position Side
      </LabelWithTooltip>
      <RadioGroup
        value={side}
        options={options}
        onChange={(value) => {
          onChangeSide(value as CopyTradeSideEnum)
        }}
        sxChildren={{ mt: 0 }}
      />
    </Box>
  )
}

function InputSuffix({ children }: { children: ReactNode }) {
  return <Type.Caption color="neutral2">{children}</Type.Caption>
}
function SelectWalletIndicatorLite() {
  return <div></div>
}

export default CopyTraderForm
