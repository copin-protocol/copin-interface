import { yupResolver } from '@hookform/resolvers/yup'
import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import Divider from 'components/@ui/Divider'
import RangeFilter from 'components/@ui/TimeFilter/RangeFilter'
import Accordion from 'theme/Accordion'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Label from 'theme/InputField/Label'
import NumberInputField from 'theme/InputField/NumberInputField'
import Select from 'theme/Select'
import SliderInput from 'theme/SliderInput'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_ADDRESSES, getTokenTradeList } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'

import BacktestGuideTour, { tourConfigs } from './BacktestGuideTour'
import { fieldName, getDefaultBackTestFormValues } from './constants'
import { BackTestFormValues } from './types'
import { backTestFormSchema } from './yupSchema'

export default function BacktestForm({
  protocol,
  tokensTraded,
  onSubmit,
  isSubmitting,
  onCancel,
  defaultValues,
}: {
  protocol: ProtocolEnum
  tokensTraded?: string[]
  onSubmit: (data: BackTestFormValues) => void
  onCancel?: () => void
  isSubmitting: boolean
  defaultValues?: BackTestFormValues
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

  useEffect(() => {
    const _defaultValues = defaultValues ?? getDefaultBackTestFormValues(protocol)
    for (const key in _defaultValues) {
      const _key = key as keyof BackTestFormValues
      setValue(_key, _defaultValues[_key])
    }
    if (!defaultValues?.tokenAddresses.length && !!tokensTraded?.length) {
      setValue('tokenAddresses', tokensTraded)
      return
    }
    if (!_defaultValues.tokenAddresses.length) {
      setValue('tokenAddresses', Object.values(TOKEN_ADDRESSES[protocol]))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, tokensTraded, protocol])

  const orderVolume = watch('orderVolume')
  const tokenAddresses = watch('tokenAddresses')
  const leverage = watch('leverage')
  const stopLossAmount = watch('stopLossAmount')
  const maxMarginPerPosition = watch('maxMarginPerPosition')
  const startTime = watch('startTime')
  const endTime = watch('endTime')
  const maxDate = useMemo(() => {
    const dateOffset = 24 * 60 * 60 * 1000 * 1 //1 days
    const _maxDate = new Date()
    _maxDate.setTime(_maxDate.getTime() - dateOffset)
    _maxDate.setHours(23, 59, 59, 999)
    return _maxDate
  }, [])
  const pairs = useMemo(() => getTokenTradeList(protocol), [protocol])
  const addressPairs = pairs.map((e) => e.address)
  const isSelectedAll = addressPairs.length === tokenAddresses?.length
  const pairOptions = pairs?.map((e) => {
    return { value: e.address, label: e.name }
  })
  pairOptions?.unshift({ value: 'all', label: 'All Tokens' })

  const { sm } = useResponsive()
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    sm ? setTimeout(() => setShowGuide(true), 300) : setShowGuide(false)
  }, [sm])

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
          <Label label="Trading Pairs" error={errors.tokenAddresses?.message} />
          <Flex sx={{ alignItems: 'center', width: '100%', gap: 3, flexWrap: 'wrap' }}>
            <Select
              menuIsOpen={isSelectedAll ? false : undefined}
              closeMenuOnSelect={false}
              className="select-container pad-right-0"
              options={pairOptions}
              value={pairOptions?.filter?.((option) => tokenAddresses?.includes(option.value))}
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
              components={{
                DropdownIndicator: () => <div></div>,
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
      </Box>

      <Box mt={24} height={80} id={tourConfigs.leverage.id}>
        <Type.Caption color="neutral2" mb={16} fontWeight={600}>
          Leverage
          <Box as="span" color="primary1" ml={2}>
            {leverage}x
          </Box>
        </Type.Caption>
        <Box pr={1} pb={24}>
          <SliderInput
            name={fieldName.leverage}
            control={control}
            error=""
            minValue={1}
            maxValue={20}
            stepValue={1}
            marksStep={2}
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
        header={<Type.BodyBold>SL / TP</Type.BodyBold>}
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
        }
      />
      <Divider mt={1} mb={24} />
      <Flex id={tourConfigs.timePeriod.id} alignItems="center" sx={{ gap: 2 }}>
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
          onClick={() => handleSubmit(onSubmit)()}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Simulate
        </ButtonWithIcon>
      </Flex>
    </Box>
  )
}

function RowWrapper2({ children }: { children: ReactNode }) {
  return <Grid sx={{ gridTemplateColumns: ['1fr', '1fr', '1fr 1fr'], gap: [3, 3, 24], width: '100%' }}>{children}</Grid>
}

function RowWrapper3({ children }: { children: ReactNode }) {
  return (
    <Grid sx={{ gridTemplateColumns: ['1fr', '1fr', '1fr 1fr 1fr'], gap: [3, 3, 24], width: '100%' }}>{children}</Grid>
  )
}

function InputSuffix({ children }: { children: ReactNode }) {
  return <Type.Caption color="neutral2">{children}</Type.Caption>
}
