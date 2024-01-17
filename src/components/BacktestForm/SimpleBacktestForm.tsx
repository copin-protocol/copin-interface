import { yupResolver } from '@hookform/resolvers/yup'
import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { ReactNode, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { TIME_FILTER_OPTIONS, TimeFilterProps } from 'components/@ui/TimeFilter'
import { useClickLoginButton } from 'components/LoginAction'
import { useIsPremiumAndAction } from 'hooks/features/useSubscriptionRestrict'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Label from 'theme/InputField/Label'
import NumberInputField from 'theme/InputField/NumberInputField'
import Select from 'theme/Select'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, TimeFilterByEnum } from 'utils/config/enums'
import { TOKEN_ADDRESSES } from 'utils/config/trades'
import { formatNumber } from 'utils/helpers/format'

import { fieldName, getDefaultBackTestFormValues } from './constants'
import { BackTestFormValues } from './types'
import { backTestFormSchema } from './yupSchema'

export default function SimpleBacktestForm({
  timeOption,
  onChangeTimeOption,
  protocol,
  onSubmit,
  isSubmitting,
  onCancel,
  defaultValues,
}: {
  timeOption: TimeFilterProps
  onChangeTimeOption: (option: TimeFilterProps) => void
  protocol: ProtocolEnum
  onSubmit: ((data: BackTestFormValues) => void) | undefined
  onCancel?: () => void
  isSubmitting: boolean
  defaultValues?: BackTestFormValues
}) {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<BackTestFormValues>({
    resolver: yupResolver(backTestFormSchema),
  })

  const _timeOption = timeOption.id === TimeFilterByEnum.ALL_TIME ? TIME_FILTER_OPTIONS[3] : timeOption

  useEffect(() => {
    const _defaultValues = defaultValues ?? getDefaultBackTestFormValues(protocol)
    for (const key in _defaultValues) {
      const _key = key as keyof BackTestFormValues
      setValue(_key, _defaultValues[_key])
    }
    if (!_defaultValues.tokenAddresses.length) {
      setValue('tokenAddresses', Object.values(TOKEN_ADDRESSES[protocol]))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, protocol])

  const orderVolume = watch('orderVolume')
  useEffect(() => {
    const endTime = dayjs().set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0)
    const startTime = endTime.subtract(_timeOption.value, 'days')
    setValue('startTime', startTime.toDate())
    setValue('endTime', endTime.toDate())
  }, [setValue, _timeOption])

  const { checkIsPremium } = useIsPremiumAndAction()
  const selectOptions = TIME_FILTER_OPTIONS.filter((option) => option.id !== TimeFilterByEnum.ALL_TIME).map(
    (option) => ({
      value: option.id,
      label: option.text,
    })
  )
  const selectValue = selectOptions.find((option) => option.value === _timeOption.id)
  const handleChangeTime = (_selectValue: any) => {
    if (_selectValue.value === TimeFilterByEnum.ALL_TIME && !checkIsPremium()) return
    onChangeTimeOption(
      TIME_FILTER_OPTIONS.find((option) => option.id === _selectValue?.value) ?? TIME_FILTER_OPTIONS[0]
    )
  }
  const { myProfile } = useMyProfileStore()
  const handleClickLogin = useClickLoginButton()

  return (
    <Box>
      <NumberInputField
        block
        name={fieldName.balance}
        control={control}
        label={
          <Box as="span" color="neutral1">
            <Trans>Investment Capital</Trans>
          </Box>
        }
        suffix={<InputSuffix>USD</InputSuffix>}
        error={errors.balance?.message}
      />
      {/* </Box> */}
      <Box mt={20}>
        <NumberInputField
          block
          name={fieldName.orderVolume}
          control={control}
          label={
            <Box as="span" color="neutral1">
              <Trans>Margin</Trans>
            </Box>
          }
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

      <Flex mt={20} flexDirection="column" sx={{ gap: 0 }}>
        <Label label={<Trans>Backtest Period</Trans>} columnGap={0} labelColor="neutral1" />
        <Select
          width={100}
          variant="ghostPrimary"
          isSearchable={false}
          options={selectOptions}
          value={selectValue}
          onChange={handleChangeTime}
        />
      </Flex>
      <Flex mt={20} sx={{ gap: 3, width: '100%', justifyContent: 'end' }}>
        {onCancel ? (
          <Button variant="outline" onClick={onCancel} isLoading={isSubmitting} disabled={isSubmitting} width="150px">
            Back
          </Button>
        ) : null}
        <ButtonWithIcon
          direction="right"
          centered={false}
          variant="primary"
          block
          icon={isSubmitting ? <></> : <ArrowRight size={16} weight="bold" />}
          onClick={() => {
            if (!myProfile) {
              handleClickLogin()
              return
            }
            onSubmit && handleSubmit(onSubmit)()
          }}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          <Trans>Backtest</Trans>
        </ButtonWithIcon>
      </Flex>
    </Box>
  )
}

function InputSuffix({ children }: { children: ReactNode }) {
  return <Type.Caption color="neutral2">{children}</Type.Caption>
}
