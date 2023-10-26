import { yupResolver } from '@hookform/resolvers/yup'
import { ArrowRight } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import Divider from 'components/@ui/Divider'
import RangeFilter from 'components/@ui/TimeFilter/RangeFilter'
import { volumeMultiplierContent, volumeProtectionContent } from 'components/TooltipContents'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import NumberInput from 'theme/Input/NumberInput'
import NumberInputField from 'theme/InputField/NumberInputField'
import SliderInput from 'theme/SliderInput'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Grid, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_ADDRESSES, getTokenTradeList } from 'utils/config/trades'

import BacktestGuideTour, { tourConfigs } from './BacktestGuideTour'
import { defaultMaxVolMultiplier, fieldName, getDefaultBackTestFormValues } from './constants'
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

  const tokenAddresses = watch('tokenAddresses')
  const leverage = watch('leverage')
  const volumeProtection = watch('volumeProtection')
  const enableStopLoss = watch('enableStopLoss')
  const startTime = watch('startTime')
  const endTime = watch('endTime')
  const today = useMemo(() => new Date(), [])
  const pairs = useMemo(() => getTokenTradeList(protocol), [protocol])
  const addressPairs = pairs.map((e) => e.address)
  const isSelectedAll = addressPairs.length === tokenAddresses?.length
  const [enableVolumeMultiplier, setEnableVolumeMultiplier] = useState(!!watch('maxVolMultiplier'))

  const { sm } = useResponsive()
  const [showGuide, setShowGuide] = useState(false)
  useEffect(() => {
    sm ? setTimeout(() => setShowGuide(true), 300) : setShowGuide(false)
  }, [sm])

  const handleSelectAll = () => {
    if (isSelectedAll) {
      setValue('tokenAddresses', [])
    } else {
      setValue('tokenAddresses', addressPairs)
      clearErrors('tokenAddresses')
    }
  }

  return (
    <Box px={3}>
      {showGuide && <BacktestGuideTour />}
      <Type.H5 mb={20} sx={{ lineHeight: '1em', borderLeft: '2px solid', borderLeftColor: 'primary1', pl: 2 }}>
        Backtest Strategy
      </Type.H5>
      <Type.BodyBold mb={3}>1. Copy Information</Type.BodyBold>
      <RowWrapper2>
        <Box id={tourConfigs.investmentCapital.id}>
          <NumberInputField
            block
            name={fieldName.balance}
            control={control}
            label="Investment Capital"
            suffix={<InputSuffix>USD</InputSuffix>}
            error={errors.balance?.message}
          />
        </Box>
        <Box id={tourConfigs.amountPerOrder.id}>
          <NumberInputField
            block
            name={fieldName.orderVolume}
            control={control}
            label="Max Margin Per Order"
            suffix={<InputSuffix>USD</InputSuffix>}
            error={errors.orderVolume?.message}
          />
        </Box>
      </RowWrapper2>
      <Box mb={20} />
      <RowWrapper2>
        <Box id={tourConfigs.tradingPairs.id}>
          <Box mb={12}>
            <SwitchInputField
              checked={isSelectedAll}
              onChange={handleSelectAll}
              switchLabel="Trading Pairs"
              labelColor={errors.tokenAddresses?.message ? 'red1' : 'neutral2'}
            />
          </Box>
          <Flex sx={{ alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            {pairs.map((pair) => {
              return (
                <ControlledCheckbox
                  key={pair.address}
                  value={pair.address}
                  label={`${pair.name}/USD`}
                  // labelSx={{ fontSize: 14, lineHeight: '20px' }}
                  size={16}
                  {...register(fieldName.tokenAddresses)}
                  wrapperSx={{ width: 95, flexShrink: 0 }}
                />
              )
            })}
          </Flex>
          {errors.tokenAddresses && <Type.Caption color="red1">{errors.tokenAddresses.message}</Type.Caption>}
        </Box>
        <Box>
          <Box id={tourConfigs.leverage.id}>
            <Type.Caption mb={12} color="neutral3" fontWeight={600}>
              Leverage Slider:{' '}
              <Box as="span" color="primary1">
                {leverage}x
              </Box>
            </Type.Caption>
            <Box pr={1} pb={24}>
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
        </Box>
      </RowWrapper2>
      <Box mb={20} />
      <RowWrapper2>
        <Box>
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
      </RowWrapper2>

      <Divider my={20} />

      <Type.BodyBold mb={3}>2. Risk Management</Type.BodyBold>

      <RowWrapper3>
        <Box id={tourConfigs.volumeProtection.id}>
          <SwitchInputField
            wrapperSx={{ mb: 2 }}
            switchLabel="Lookback To Protect Volume"
            {...register(fieldName.volumeProtection)}
            error={errors.volumeProtection?.message}
            tooltipContent={
              <Box width="calc(100vw - 32px)" maxWidth={450}>
                {volumeProtectionContent}
              </Box>
            }
          />
          <NumberInput
            block
            name={fieldName.lookBackOrders}
            control={control}
            error={errors.lookBackOrders?.message}
            suffix={<InputSuffix>Orders</InputSuffix>}
            disabled={!volumeProtection}
            inputHidden={!volumeProtection}
          />
        </Box>

        <Box id={tourConfigs.stoploss.id}>
          <SwitchInputField
            wrapperSx={{ mb: 2 }}
            switchLabel="Stoploss Amount Per Position"
            {...register(fieldName.enableStopLoss)}
            error={errors.enableStopLoss?.message}
          />
          <NumberInput
            block
            name={fieldName.stopLossAmount}
            control={control}
            error={errors.stopLossAmount?.message}
            suffix={<InputSuffix>USD</InputSuffix>}
            disabled={!enableStopLoss}
            inputHidden={!enableStopLoss}
          />
        </Box>
        <Box id={tourConfigs.maxVolMultiplier.id}>
          <SwitchInputField
            wrapperSx={{ mb: 2 }}
            switchLabel="Max Volume Multiplier"
            checked={enableVolumeMultiplier}
            onChange={(e) => {
              if (e.target.checked) {
                setValue(fieldName.maxVolMultiplier!, defaultMaxVolMultiplier)
              } else {
                setValue(fieldName.maxVolMultiplier!, undefined)
              }
              setEnableVolumeMultiplier(e.target.checked)
            }}
            tooltipContent={
              <Box width="calc(100vw - 32px)" maxWidth={450}>
                {volumeMultiplierContent}
              </Box>
            }
          />
          <NumberInput
            block
            name={fieldName.maxVolMultiplier}
            control={control}
            error={errors.maxVolMultiplier?.message}
            suffix={<InputSuffix>Times</InputSuffix>}
            disabled={!enableVolumeMultiplier}
            inputHidden={!enableVolumeMultiplier}
          />
        </Box>
      </RowWrapper3>

      <Divider my={20} />

      <RowWrapper3>
        <Box id={tourConfigs.timePeriod.id}>
          <Type.BodyBold mb={'6px'}>3. Backtest Period</Type.BodyBold>
          <Box>
            {startTime && (
              <RangeFilter
                isRangeSelection
                forceDisplaySelectedDate
                from={startTime}
                to={endTime}
                changeTimeRange={(range) => {
                  clearErrors()
                  setValue(fieldName.startTime, range.from ?? today)
                  setValue(fieldName.endTime, range.to ?? today)
                }}
                posDefine={{ top: '-350px' }}
                iconColor="primary1"
                iconHoverColor="primary1"
              />
            )}
            {errors.startTime && <Type.Caption color="red1">{errors.startTime.message}</Type.Caption>}
            {errors.endTime && <Type.Caption color="red1">{errors.endTime.message}</Type.Caption>}
          </Box>
        </Box>
      </RowWrapper3>

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
