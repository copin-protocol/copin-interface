import { Trans } from '@lingui/macro'
import { Plus, Trash } from '@phosphor-icons/react'
import { ReactNode, useEffect, useId, useState } from 'react'

import UpgradeButton from 'components/@subscription/UpgradeButton'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import Input from 'theme/Input'
import Select from 'theme/Select'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { Color } from 'theme/types'

import { parseNumber } from './helpers'
import { ConditionFilterFormProps, ConditionOption, FieldOption, RowValues } from './types'

export default function ConditionFilterForm<T>({
  formValues,
  setFormValues,
  fieldOptions,
  onValuesChange,
  type,
  wrapperSx = {},
  labelColor = 'neutral3',
  showUpgradeWarning,
  maxFilterFields,
  invalidFormValues,
}: ConditionFilterFormProps<T> & { wrapperSx?: any; labelColor?: Color; showUpgradeWarning?: boolean }) {
  const remainingFieldKeys = fieldOptions.filter((option) => !formValues.map((item) => item.key).includes(option.value))
  const optionsLength = fieldOptions.length
  const remainingLength = remainingFieldKeys.length

  const onChangeRowValues = (index: number, values: RowValues<T>) => {
    setFormValues((prev) => {
      const newValues = [...prev.slice(0, index), values, ...prev.slice(index + 1)]
      onValuesChange && onValuesChange(newValues)
      return newValues
    })
  }

  const handleAddNewRow = () => {
    const remainingKeys = remainingFieldKeys.filter((o) => !o.isDisabled)
    if (!remainingKeys.length) return
    setFormValues((prev) => {
      const newValues = [...prev]
      const key = remainingKeys[0].value
      newValues.push({
        key,
        ...(fieldOptions.find((item) => item.value === key)?.default ?? {
          conditionType: 'gte',
        }),
      })
      onValuesChange && onValuesChange(newValues)
      return newValues
    })
  }
  const handleClearRow = (key: keyof T) => {
    setFormValues((prev) => {
      const newValues = prev.filter((values) => values.key !== key)
      onValuesChange && onValuesChange(newValues)
      return newValues
    })
  }

  let valueText = <Trans>VALUE</Trans>
  switch (type) {
    case 'ranking':
      valueText = <Trans>PERCENTILE</Trans>
      break
    default:
      break
  }

  const hasInvalidValues = !!invalidFormValues?.length
  const invalidKeys = invalidFormValues?.map((e) => e.key)

  return (
    <Box px={8} width="100%" height="100%" sx={wrapperSx}>
      <RowWrapper sx={{ width: '100%' }}>
        <Box px={2} flex="7">
          <Type.Caption color={labelColor}>
            <Trans>FIELD</Trans>
          </Type.Caption>
        </Box>
        {/* <VerticalDivider hidden /> */}
        <Box px={2} flex="6">
          <Type.Caption color={labelColor}>
            <Trans>CONDITION</Trans>
          </Type.Caption>
        </Box>
        {/* <VerticalDivider hidden /> */}
        <Box px={2} flex="7">
          <Type.Caption color={labelColor}>{valueText}</Type.Caption>
        </Box>
        <Box sx={{ flex: '0 0 24px !important' }}></Box>
      </RowWrapper>
      <Box>
        {formValues
          .filter((e) => e.key !== 'indexTokens' || invalidKeys?.includes(e.key))
          .map((values, index) => {
            if (!values) return <></>
            return (
              <Row
                fieldOptions={fieldOptions}
                key={values.key.toString() + index}
                data={values}
                excludingKeys={formValues.map((item) => item.key)}
                onChange={(values) => onChangeRowValues(index, values)}
                onRemove={() => handleClearRow(values.key)}
                disabled={hasInvalidValues}
                type={type}
              />
            )
          })}

        {hasInvalidValues
          ? invalidFormValues
              .filter((e) => e.key !== 'indexTokens')
              .map((values, index) => {
                if (!values) return <></>
                return (
                  <Row
                    fieldOptions={fieldOptions}
                    key={values.key.toString() + index}
                    data={values}
                    disabled
                    wrapperSx={{
                      '& *': { color: `${themeColors.neutral3} !important` },
                    }}
                    type={type}
                  />
                )
              })
          : null}
        {hasInvalidValues ? null : (
          <>
            {showUpgradeWarning && maxFilterFields != null && formValues.length >= maxFilterFields ? (
              <>
                <Box mt={12} />
                <Flex sx={{ alignItems: 'center', gap: 3, px: 2 }}>
                  <Type.Caption>
                    {!!optionsLength ? (
                      <Trans>
                        Using {optionsLength - remainingLength} of {maxFilterFields} filters. Upgrade to add more
                      </Trans>
                    ) : (
                      <Trans>Upgrade to filter</Trans>
                    )}
                  </Type.Caption>
                  <UpgradeButton />
                </Flex>
              </>
            ) : (
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
            )}
          </>
        )}
      </Box>
    </Box>
  )
}
const getConditionOption = (conditionType: string) => {
  const option = conditionOptions.find((option) => option.value === conditionType)
  if (!!option) return option
  return conditionOptions[0]
}

function Row<T>({
  fieldOptions,
  data,
  excludingKeys,
  onChange,
  onRemove,
  type,
  disabled,
  wrapperSx = {},
}: {
  fieldOptions: FieldOption<T>[]
  data: RowValues<T>
  excludingKeys?: (keyof T)[]
  onChange?: (values: RowValues<T>) => void
  onRemove?: () => void
  type: ConditionFilterFormProps<T>['type']
  disabled?: boolean
  wrapperSx?: any
}) {
  const [conditionOption, setConditionOption] = useState<ConditionOption>(() => getConditionOption(data.conditionType))
  const [fieldNameOption, setFieldNameOption] = useState<FieldOption<T>>(() => {
    const option = fieldOptions.find((option) => option.value === data.key)
    if (!!option) return option
    return fieldOptions[0]
  })
  const fieldName = fieldNameOption?.value
  const conditionType = conditionOption?.value
  const [gte, setGte] = useState<string | undefined>(data?.gte?.toString())
  const [lte, setLte] = useState<string | undefined>(data?.lte?.toString())

  useEffect(() => {
    !disabled && onChange?.({ key: fieldName, conditionType, gte: parseNumber(gte), lte: parseNumber(lte) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conditionType, fieldName, gte, lte])

  const instanceId = useId()

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
          '&:hover': disabled
            ? {}
            : {
                borderColor: 'neutral3',
              },
          ...wrapperSx,
        }}
      >
        <Box flex="7" pl={2}>
          <Select
            isDisabled={disabled}
            components={disabled ? { DropdownIndicator: () => <Box /> } : {}}
            id={instanceId}
            instanceId={instanceId}
            menuPlacement="top"
            maxMenuHeight={230}
            menuPosition="fixed"
            variant="ghost"
            options={fieldOptions.filter(
              (option) => option.value === fieldNameOption?.value || !excludingKeys?.includes(option.value)
            )}
            filterOption={type === 'default' ? customFilter : undefined}
            value={fieldNameOption}
            onChange={(newValue) => {
              const value = newValue as FieldOption<T>
              setFieldNameOption(value)
              if (value.default) {
                setGte(value.default?.gte?.toString())
                setLte(value.default?.lte?.toString())
                setConditionOption(getConditionOption(value.default.conditionType))
              }
            }}
          />
        </Box>
        {/* <VerticalDivider /> */}
        <Box flex="6">
          <Select
            isDisabled={disabled}
            components={disabled ? { DropdownIndicator: () => <Box /> } : {}}
            isSearchable={false}
            menuPlacement="top"
            maxMenuHeight={300}
            menuPosition="fixed"
            variant="ghost"
            options={conditionOptions}
            value={conditionOption}
            onChange={(newValue) => {
              setGte(gte || '0')
              setLte(lte || '0')
              setConditionOption(newValue as ConditionOption)
            }}
          />
        </Box>
        {/* <VerticalDivider /> */}
        <Box height="100%" flex="7">
          <Flex sx={{ alignItems: 'center', gap: 2, '& > *': { flex: 1 }, height: '100%' }}>
            {conditionOption.value === 'gte' || conditionOption.value === 'between' ? (
              <Input
                disabled={disabled}
                key="gte"
                type="number"
                placeholder=""
                value={gte}
                onChange={(e) => {
                  const value = e.target.value
                  setGte(value)
                }}
                sx={{
                  px: 2,
                  border: 'none',
                  bg: 'transparent !important',
                }}
                suffix={fieldNameOption?.unit}
              />
            ) : null}
            {conditionOption.value === 'lte' || conditionOption.value === 'between' ? (
              <>
                {conditionOption.value === 'between' && <VerticalDivider sx={{ height: 'calc(100% - 16px)' }} />}
                <Input
                  disabled={disabled}
                  key="lte"
                  type="number"
                  placeholder=""
                  value={lte}
                  onChange={(e) => {
                    const value = e.target.value
                    setLte(value)
                  }}
                  sx={{
                    px: 2,
                    border: 'none',
                    bg: 'transparent !important',
                  }}
                  suffix={fieldNameOption?.unit}
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
        sx={{
          color: 'neutral3',
          width: 'max-content',
          height: 'max-content',
          visibility: disabled ? 'hidden' : 'visible',
        }}
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

const customFilter: any = (option: any, searchText: any) => {
  if (
    typeof option?.data?.searchText === 'string' &&
    option.data.searchText.toLowerCase().includes(searchText?.toLowerCase?.())
  ) {
    return true
  }
  if (typeof option?.label === 'string' && option.label.toLowerCase().includes(searchText?.toLowerCase?.())) {
    return true
  }
  if (typeof option?.value === 'string' && option.value.toLowerCase().includes(searchText?.toLowerCase?.())) {
    return true
  }
  return false
}
