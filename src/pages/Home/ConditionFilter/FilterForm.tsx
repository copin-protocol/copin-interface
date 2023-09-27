import { Plus, Trash } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { getTradersCounter } from 'apis/traderApis'
import { tableSettings } from 'components/Tables/TraderListTable/dataConfig'
import { TraderDataKey } from 'entities/trader'
import useMyProfile from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import Input from 'theme/Input'
import Select from 'theme/Select'
import { Box, Flex, Type } from 'theme/base'
import { QUERY_KEYS, STORAGE_KEYS } from 'utils/config/keys'
import debounce from 'utils/helpers/debounce'
import { getDurationFromTimeFilter } from 'utils/helpers/transform'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'
import { ConditionType, FilterCondition } from 'utils/types'

import useTradersContext from '../useTradersContext'
import ResultEstimated from './ResultEstimated'
import { getDefaultFormValues, getFiltersFromFormValues } from './helpers'
import { ConditionFormValues, FilterValues, RowValues } from './types'

export default function FilterForm({
  defaultFormValues,
  handleClose,
  handleChangeOption,
}: {
  handleClose?: () => void
  handleChangeOption: (option: ConditionFormValues) => void
  defaultFormValues: ConditionFormValues
}) {
  const { myProfile } = useMyProfile()
  const { timeOption, protocol, setCurrentSuggestion } = useTradersContext()
  const effectDays = getDurationFromTimeFilter(timeOption.id)
  const [resetTime, setResetTime] = useState(0)
  const [formValues, setFormValues] = useState<ConditionFormValues>(defaultFormValues)
  const [ranges, setRanges] = useState<FilterValues[]>(getFiltersFromFormValues(defaultFormValues))
  const debounced = useMemo(() => debounce(handleCallAPi, 1000), [])
  function handleCallAPi(values: any) {
    const filterFromForm = getFiltersFromFormValues(values)
    setRanges(filterFromForm)
  }

  const { data: traderCounter, isFetching } = useQuery(
    [QUERY_KEYS.GET_TRADER_FILTER_COUNTER, ranges, timeOption, protocol],
    () =>
      getTradersCounter(
        protocol,
        {
          ranges,
        },
        timeOption.id
      ),
    { keepPreviousData: true, retry: 0 }
  )

  const remainingFieldKeys = fieldOptions.filter((option) => !formValues.map((item) => item.key).includes(option.value))

  const onChangeRowValues = (values: RowValues, index: number) => {
    setFormValues((prev) => {
      const newValues = [...prev]
      newValues[index] = values
      debounced(newValues)
      return newValues
    })
  }

  const handleAddNewRow = () => {
    if (!remainingFieldKeys.length) return
    setFormValues((prev) => {
      const newValues = [...prev]
      const key = remainingFieldKeys[0].value
      newValues.push({
        key,
        ...(tableSettings.find((item) => item.id === key)?.filter ?? {
          conditionType: 'gte',
        }),
      })
      debounced(newValues)
      return newValues
    })
  }
  const handleClearRow = (index: number) => {
    setFormValues((prev) => {
      const newValues = [...prev]
      newValues.splice(index, 1)
      debounced(newValues)
      return newValues
    })
  }

  const onApply = () => {
    localStorage.setItem(STORAGE_KEYS.CONDITIONAL_FILTER, JSON.stringify(formValues))
    handleChangeOption(formValues)
    handleClose && handleClose()
    setCurrentSuggestion(undefined)
    toast.success('Save filter success')

    logEvent(
      {
        category: EventCategory.FILTER,
        action: EVENT_ACTIONS[EventCategory.FILTER].NORMAL,
        label: getUserForTracking(myProfile?.username),
      },
      { protocol, data: JSON.stringify(formValues) }
    )
  }
  const onReset = () => {
    const _formValues = getDefaultFormValues()
    localStorage.setItem(STORAGE_KEYS.CONDITIONAL_FILTER, JSON.stringify(_formValues))
    setFormValues(_formValues)
    handleChangeOption(_formValues)
    handleClose && handleClose()
    setResetTime((prev) => prev + 1)
    setCurrentSuggestion(undefined)
    toast.success('Reset filter success')

    logEvent(
      {
        category: EventCategory.FILTER,
        action: EVENT_ACTIONS[EventCategory.FILTER].RESET_DEFAULT,
        label: getUserForTracking(myProfile?.username),
      },
      { protocol }
    )
  }

  const hasUnchanged = useMemo(() => {
    const str = localStorage.getItem(STORAGE_KEYS.CONDITIONAL_FILTER)
    if (str === JSON.stringify(formValues)) {
      return true
    }
    return false
  }, [formValues])

  const { sm } = useResponsive()

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <Box flex="1" sx={{ flexBasis: 0, overflow: 'auto' }}>
          {formValues.length > 0 && (
            <Box sx={sm ? {} : { position: 'sticky', top: 0, bg: 'neutral7', zIndex: 2 }}>
              <ResultEstimated data={traderCounter} loading={isFetching} effectDays={effectDays} />
            </Box>
          )}

          <RowWrapper sx={{ px: 12, width: '100%', mt: 12 }}>
            <Box px={2} flex="7">
              <Type.Caption color="neutral3">Field</Type.Caption>
            </Box>
            {/* <VerticalDivider hidden /> */}
            <Box px={2} flex="6">
              <Type.Caption color="neutral3">Condition</Type.Caption>
            </Box>
            {/* <VerticalDivider hidden /> */}
            <Box px={2} flex="7">
              <Type.Caption color="neutral3">Value</Type.Caption>
            </Box>
            <Box sx={{ flex: '0 0 24px !important' }}></Box>
          </RowWrapper>
          <Box px={12}>
            {formValues.map((values, index) => {
              if (!values) return <></>
              return (
                <Row
                  key={values.key + resetTime}
                  data={values}
                  excludingKeys={formValues.map((item) => item.key)}
                  onChange={(values) => onChangeRowValues(values, index)}
                  onRemove={() => handleClearRow(index)}
                />
              )
            })}
            <ButtonWithIcon
              py={2}
              px={2}
              mt={2}
              disabled={!remainingFieldKeys.length}
              icon={<Plus size={16} />}
              variant="ghostPrimary"
              onClick={handleAddNewRow}
              sx={{
                fontWeight: 'normal',
              }}
            >
              Add Field
            </ButtonWithIcon>
          </Box>
        </Box>
        <Box
          sx={{
            width: '100%',
            px: 3,
          }}
        >
          <Flex
            sx={{
              justifyContent: 'right',
              alignItems: 'center',
              height: 40,
              width: '100%',
              borderTop: 'small',
              borderTopColor: 'neutral4',
              gap: 12,
            }}
          >
            {handleClose && (
              <Button px={0} variant="ghost" mr="auto" onClick={handleClose} sx={{ fontWeight: 'normal' }}>
                Cancel
              </Button>
            )}
            <Button px={0} variant="ghost" mr={3} onClick={onReset} sx={{ fontWeight: 'normal' }}>
              Reset Default
            </Button>
            <Button
              px={0}
              variant="ghostPrimary"
              onClick={onApply}
              disabled={hasUnchanged}
              sx={{ fontWeight: 'normal' }}
            >
              Apply & Save
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}
const getConditionOption = (conditionType: string) => {
  const option = conditionOptions.find((option) => option.value === conditionType)
  if (!!option) return option
  return conditionOptions[0]
}

function Row({
  data,
  excludingKeys,
  onChange,
  onRemove,
}: {
  data: RowValues
  excludingKeys: TraderDataKey[]
  onChange: (values: RowValues) => void
  onRemove: () => void
}) {
  const [conditionOption, setConditionOption] = useState<ConditionOption>(() => getConditionOption(data.conditionType))
  const [fieldNameOption, setFieldNameOption] = useState<FieldOption>(() => {
    const option = fieldOptions.find((option) => option.value === data.key)
    if (!!option) return option
    return fieldOptions[0]
  })
  const { watch, setValue } = useForm<RowValues>({
    defaultValues: data,
  })
  const fieldName = fieldNameOption.value
  const conditionType = conditionOption.value
  const gte = watch('gte')
  const lte = watch('lte')

  useEffect(() => {
    onChange({
      key: fieldName,
      conditionType,
      gte,
      lte,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionType, fieldName, gte, lte])

  return (
    <Flex
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        my: 1,
      }}
    >
      <RowWrapper
        sx={{
          borderBottom: 'small',
          borderColor: 'neutral5',
          height: 40,
          '&:hover': {
            borderColor: 'neutral3',
          },
        }}
      >
        <Box flex="7">
          <Select
            menuPlacement="top"
            maxMenuHeight={300}
            menuPosition="fixed"
            variant="ghost"
            options={fieldOptions.filter(
              (option) => option.value === fieldNameOption.value || !excludingKeys.includes(option.value)
            )}
            value={fieldNameOption}
            onChange={(newValue) => {
              const value = newValue as FieldOption
              setFieldNameOption(value)
              if (value.default) {
                setValue('gte', value.default.gte)
                setValue('lte', value.default.lte)
                setConditionOption(getConditionOption(value.default.conditionType))
              }
            }}
          />
        </Box>
        {/* <VerticalDivider /> */}
        <Box flex="6">
          <Select
            isSearchable={false}
            menuPlacement="top"
            maxMenuHeight={300}
            menuPosition="fixed"
            variant="ghost"
            options={conditionOptions}
            value={conditionOption}
            onChange={(newValue) => setConditionOption(newValue as ConditionOption)}
          />
        </Box>
        {/* <VerticalDivider /> */}
        <Box height="100%" flex="7">
          <Flex sx={{ alignItems: 'center', gap: 2, '& > *': { flex: 1 }, height: '100%' }}>
            {conditionOption.value === 'gte' || conditionOption.value === 'between' ? (
              <Input
                type="number"
                placeholder=""
                value={gte ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  const number: number | null = value ? Number(value) : null
                  setValue('gte', number)
                }}
                sx={{
                  px: 2,
                  border: 'none',
                  bg: 'transparent !important',
                }}
                suffix={fieldNameOption.unit}
              />
            ) : null}
            {conditionOption.value === 'lte' || conditionOption.value === 'between' ? (
              <>
                {conditionOption.value === 'between' && <VerticalDivider sx={{ height: 'calc(100% - 16px)' }} />}
                <Input
                  type="number"
                  placeholder=""
                  value={lte ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    const number: number | null = value ? Number(value) : null
                    setValue('lte', number)
                  }}
                  sx={{
                    px: 2,
                    border: 'none',
                    bg: 'transparent !important',
                  }}
                  suffix={fieldNameOption.unit}
                />
              </>
            ) : null}
          </Flex>
        </Box>
      </RowWrapper>
      <IconButton
        variant="ghost"
        icon={<Trash size={16} weight="fill" />}
        onClick={onRemove}
        sx={{ color: 'neutral3', width: 'max-content', height: 'max-content' }}
      />
    </Flex>
  )
}

function RowWrapper({ children, sx }: { children: ReactNode; sx?: any }) {
  return <Flex sx={{ width: '100%', alignItems: 'center', '& > *': { flex: 1 }, ...(sx ?? {}) }}>{children}</Flex>
}
function VerticalDivider({ hidden, sx }: { hidden?: boolean; sx?: any }) {
  return (
    <Box
      sx={{
        bg: hidden ? 'transparent' : 'neutral4',
        height: '100%',
        width: '1px',
        flex: '0 0 1px !important',
        ...(sx ?? {}),
      }}
    />
  )
}

interface FieldOption {
  value: TraderDataKey
  label: ReactNode
  default?: FilterCondition
  unit?: string
}
const fieldOptions: FieldOption[] = tableSettings
  .filter((item) => item.filter != null)
  .map((item) => ({
    value: item.id,
    label: <div>{item.text}</div>,
    default: item.filter,
    unit: item.unit,
  }))

export const fieldOptionLabels: { [key: string]: ReactNode } = fieldOptions.reduce((prev, cur) => {
  prev[cur.value] = cur.label
  return prev
}, {} as { [key: string]: ReactNode })

interface ConditionOption {
  value: ConditionType
  label: string
}
const conditionOptions: ConditionOption[] = [
  {
    value: 'gte',
    label: 'Greater than',
  },
  {
    value: 'lte',
    label: 'Less than',
  },
  {
    value: 'between',
    label: 'Between',
  },
]
