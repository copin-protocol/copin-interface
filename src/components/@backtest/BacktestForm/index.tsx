import { yupResolver } from '@hookform/resolvers/yup'
import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { SelectSLTPType } from 'components/@copyTrade/CopyTradeForm'
import Divider from 'components/@ui/Divider'
import RangeFilter from 'components/@ui/TimeFilter/RangeFilter'
import useInternalRole from 'hooks/features/useInternalRole'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import Accordion from 'theme/Accordion'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Label from 'theme/InputField/Label'
import NumberInputField from 'theme/InputField/NumberInputField'
import Select from 'theme/Select'
import SliderInput from 'theme/SliderInput'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Type } from 'theme/base'
import { RISK_LEVERAGE } from 'utils/config/constants'
import { ProtocolEnum, SLTPTypeEnum } from 'utils/config/enums'
import { PROTOCOLS_CROSS_MARGIN } from 'utils/config/protocols'
import { SLTP_TYPE_TRANS } from 'utils/config/translations'
import { formatNumber } from 'utils/helpers/format'

import { fieldName } from '../configs'
import { getDefaultBackTestFormValues } from '../helpers'
import { BackTestFormValues } from '../types'
import { backTestFormSchema } from '../yupSchemas'
import BacktestGuideTour, { tourConfigs } from './BacktestGuideTour'

export default function BacktestForm({
  protocol,
  tokensTraded,
  onSubmit,
  isSubmitting,
  onCancel,
  defaultValues,
  isModalOpen,
}: {
  protocol: ProtocolEnum
  tokensTraded?: string[]
  onSubmit: ((data: BackTestFormValues) => void) | undefined
  onCancel?: () => void
  isSubmitting: boolean
  defaultValues?: BackTestFormValues
  isModalOpen?: boolean
}) {
  const {
    control,
    watch,
    register,
    setValue,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<BackTestFormValues>({
    resolver: yupResolver(backTestFormSchema),
  })
  const isInternal = useInternalRole()
  const { getListSymbol, getListSymbolByListIndexToken } = useMarketsConfig()

  useEffect(() => {
    const _defaultValues = defaultValues ? { ...defaultValues } : getDefaultBackTestFormValues(protocol)
    for (const key in _defaultValues) {
      const _key = key as keyof BackTestFormValues
      setValue(_key, _defaultValues[_key])
    }
    if (!defaultValues?.pairs.length && !!tokensTraded?.length) {
      setValue('pairs', getListSymbolByListIndexToken({ protocol, listIndexToken: tokensTraded }))
      return
    }
    if (!_defaultValues.pairs?.length) {
      setValue('pairs', getListSymbol({ protocol }))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, tokensTraded, protocol])

  const copyAll = watch('copyAll')
  const orderVolume = watch('orderVolume')
  const pairs = watch('pairs')
  const leverage = watch('leverage')
  const stopLossAmount = watch('stopLossAmount')
  const stopLossType = watch('stopLossType')
  const takeProfitType = watch('takeProfitType')
  const takeProfitAmount = watch('takeProfitAmount')
  const maxMarginPerPosition = watch('maxMarginPerPosition')
  const lookBackOrders = watch('lookBackOrders')
  const startTime = watch('startTime')
  const endTime = watch('endTime')
  const maxDate = useMemo(() => {
    const dateOffset = 24 * 60 * 60 * 1000 * 1 //1 days
    const _maxDate = new Date()
    _maxDate.setTime(_maxDate.getTime() - dateOffset)
    _maxDate.setHours(23, 59, 59, 999)
    return _maxDate
  }, [])

  const { getListSymbolOptions } = useMarketsConfig()
  const pairOptions = useMemo(() => {
    const allOptions = getListSymbolOptions()
    allOptions.unshift({ id: 'all', value: 'all', label: 'All Tokens' })
    return allOptions
  }, [getListSymbolOptions])
  const allPairs = pairOptions.map((p) => p.value)

  const isSelectedAll = allPairs.length === pairs?.length

  const { sm } = useResponsive()
  const [showGuide, setShowGuide] = useState(false)

  const onChangeSLType = (type: SLTPTypeEnum) => setValue(fieldName.stopLossType, type)
  const onChangeTPType = (type: SLTPTypeEnum) => setValue(fieldName.takeProfitType, type)

  useEffect(() => {
    sm ? setTimeout(() => setShowGuide(true), 300) : setShowGuide(false)
  }, [sm])

  const _handleSubmit = () => {
    handleSubmit((_formValues) => {
      const formValues = { ..._formValues }
      if (formValues.pairs?.length) {
        formValues.pairs = formValues.pairs.map((v) => `${v}-USDT`)
      }
      onSubmit?.(formValues)
    })()
  }

  useEffect(() => {
    if (isModalOpen != null && !isModalOpen) setShowGuide(false)
  }, [isModalOpen])

  return (
    <Box px={3}>
      {showGuide && <BacktestGuideTour />}
      <Type.H5 sx={{ lineHeight: '1em', borderLeft: '2px solid', borderLeftColor: 'primary1', pl: 2 }}>
        Backtest Strategy
      </Type.H5>
      <Box mt={24} id={tourConfigs.investmentCapital.id}>
        <NumberInputField
          block
          name={fieldName.balance}
          control={control}
          label="Investment Capital"
          suffix={<InputSuffix>USD</InputSuffix>}
          error={errors.balance?.message}
        />
      </Box>
      <Box mt={24} id={tourConfigs.amountPerOrder.id}>
        <NumberInputField
          block
          name={fieldName.orderVolume}
          control={control}
          label="Margin"
          suffix={<InputSuffix>USD</InputSuffix>}
          error={errors.orderVolume?.message}
        />
        <Type.Caption mt={1} color="neutral2">
          <Trans>
            When the trader opens a trade, the maximum margin per order is{' '}
            {orderVolume ? <Type.CaptionBold>{formatNumber(orderVolume)} USD</Type.CaptionBold> : '--'}.
          </Trans>
        </Type.Caption>
      </Box>

      <Box mt={24} id={tourConfigs.tradingPairs.id}>
        <Box mb={3}>
          <Flex mb={2} sx={{ alignItems: 'center', gap: 12, '& *': { mb: '0 !important' } }}>
            <Label label="Trading Pairs" error={errors.pairs?.message} />
            <SwitchInputField
              switchLabel="Follow the trader"
              labelColor="neutral1"
              {...register(fieldName.copyAll, { onChange: () => clearErrors('pairs') })}
              error={errors.copyAll?.message}
              wrapperSx={{ flexDirection: 'row-reverse', '*': { fontWeight: 400 } }}
            />
          </Flex>
          <Box
            display={copyAll ? 'none' : 'flex'}
            sx={{ alignItems: 'center', width: '100%', gap: 3, flexWrap: 'wrap' }}
          >
            <Select
              menuIsOpen={isSelectedAll ? false : undefined}
              closeMenuOnSelect={false}
              className="select-container pad-right-0"
              options={pairOptions}
              value={pairOptions?.filter?.((option) => pairs?.includes(option.value))}
              onChange={(newValue: any, actionMeta: any) => {
                clearErrors(fieldName.pairs)
                if (actionMeta?.option?.value === 'all') {
                  setValue(fieldName.pairs, allPairs)
                  return
                }
                setValue(
                  fieldName.pairs,
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
          {!!errors?.pairs?.message && (
            <Type.Caption color="red1" mt={1} display="block">
              {errors?.pairs?.message}
            </Type.Caption>
          )}
        </Box>
      </Box>

      <Box mt={24} height={80} id={tourConfigs.leverage.id}>
        <Type.Caption color="neutral2" mb={16} fontWeight={600}>
          Leverage
          <Box as="span" color={leverage > RISK_LEVERAGE ? 'orange1' : 'primary1'} ml={2}>
            {leverage}x
          </Box>
        </Type.Caption>
        <Box pr={1} pb={24}>
          <SliderInput
            name={fieldName.leverage}
            control={control}
            error=""
            minValue={2}
            maxValue={isInternal ? 50 : 30}
            stepValue={1}
            marksStep={sm ? (isInternal ? 5 : 2) : 5}
            marksUnit={'x'}
          />
        </Box>
        {errors.leverage?.message ? (
          <Type.Caption color="red1" display="block">
            Leverage must be greater or equal to 2
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
        header={<Type.BodyBold>Stop Loss / Take Profit</Type.BodyBold>}
        defaultOpen={!!stopLossAmount || !!takeProfitAmount}
        body={
          <Box mt={3}>
            <NumberInputField
              label="Position Stop Loss (Recommended)"
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
          </Box>
        }
      />
      <Divider mt={1} />
      <Accordion
        header={
          <Type.BodyBold>
            <Trans>Advance Settings</Trans>
          </Type.BodyBold>
        }
        body={
          <>
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
                When the trader increases the position, you will follow with a maximum of{' '}
                {maxMarginPerPosition ? (
                  <Type.CaptionBold>{formatNumber(maxMarginPerPosition)} USD</Type.CaptionBold>
                ) : (
                  '--'
                )}{' '}
                as the margin.
              </Type.Caption>
            </Box>
            {!PROTOCOLS_CROSS_MARGIN.includes(protocol) && (
              <Box mt={24}>
                <NumberInputField
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
          </>
        }
      />
      <Divider mt={1} mb={24} />
      <Flex
        id={tourConfigs.timePeriod.id}
        sx={{ columnGap: 2, rowGap: 1, flexDirection: ['column', 'row'], alignItems: ['start', 'center'] }}
      >
        <Type.BodyBold>Backtest Period</Type.BodyBold>
        <Box>
          {startTime && (
            <RangeFilter
              isRangeSelection
              forceDisplaySelectedDate
              from={startTime}
              to={endTime}
              changeTimeRange={(range) => {
                clearErrors()
                setValue(fieldName.startTime, range.from ?? maxDate)
                setValue(fieldName.endTime, range.to ?? maxDate)
              }}
              maxDate={maxDate}
              posDefine={{ top: '-350px' }}
              iconColor="primary1"
              iconHoverColor="primary1"
            />
          )}
          {errors.startTime && <Type.Caption color="red1">{errors.startTime.message}</Type.Caption>}
          {errors.endTime && <Type.Caption color="red1">{errors.endTime.message}</Type.Caption>}
        </Box>
      </Flex>
      <Flex mt={24} sx={{ gap: 3, width: '100%', justifyContent: 'end' }}>
        {onCancel ? (
          <Button variant="outline" onClick={onCancel} isLoading={isSubmitting} disabled={isSubmitting} width="150px">
            Back
          </Button>
        ) : null}
        <ButtonWithIcon
          width="150px"
          direction="right"
          variant="primary"
          icon={<ArrowRight size={16} weight="bold" />}
          onClick={_handleSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Simulate
        </ButtonWithIcon>
      </Flex>
    </Box>
  )
}

function InputSuffix({ children }: { children: ReactNode }) {
  return <Type.Caption color="neutral2">{children}</Type.Caption>
}
