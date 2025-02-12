import { Funnel, XCircle } from '@phosphor-icons/react'
import debounce from 'lodash/debounce'
import { useMemo, useState } from 'react'

import MarketGroup from 'components/@ui/MarketGroup'
import ConditionFilterForm from 'components/@widgets/ConditionFilterForm'
import { ConditionFormValues, FieldOption } from 'components/@widgets/ConditionFilterForm/types'
import IconGroup from 'components/@widgets/IconGroup'
import { TableCustomMultiSelectListItem } from 'components/@widgets/TableFilter/TableMultiSelectFilter'
import { TableSelectFilter } from 'components/@widgets/TableFilter/TableSelectFilter'
import { generateRangeFilterKey } from 'components/@widgets/TableFilter/helpers'
import { FilterValues, TableFilterConfig } from 'components/@widgets/TableFilter/types'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import useSearchParams from 'hooks/router/useSearchParams'
import { FilterPairDropdown } from 'pages/PerpDEXsExplorer/components/FilterPairDropdown'
import { TABLE_RANGE_FILTER_CONFIGS } from 'pages/PerpDEXsExplorer/configs'
import { getFilters } from 'pages/PerpDEXsExplorer/utils'
import { Button } from 'theme/Buttons'
import Dropdown from 'theme/Dropdown'
import Label from 'theme/InputField/Label'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { parseCollateralColorImage } from 'utils/helpers/transform'
import { ConditionType } from 'utils/types'

export default function FilterButtonMobile() {
  const [key, setKey] = useState(1)
  return <FilterButton key={key} resetState={() => setKey((prev) => prev + 1)} />
}

export function FilterButton({ resetState }: { resetState: () => void }) {
  const { searchParams, setSearchParamsOnly } = useSearchParams()
  const [formValues, setFormValues] = useState<ConditionFormValues<PerpDEXSourceResponse>>(() => {
    const currentFilters = getFilters({ searchParams: searchParams as Record<string, string> })
    const _rangeFilters: ConditionFormValues<PerpDEXSourceResponse> = []
    currentFilters.forEach((filter) => {
      if (filter.type === 'number' || filter.type === 'duration') {
        const gte = filter.gte
        const lte = filter.lte
        const conditionType: ConditionType = gte != null && lte != null ? 'between' : gte != null ? 'gte' : 'lte'
        const _gte = conditionType === 'lte' ? undefined : gte
        const _lte = conditionType === 'gte' ? undefined : lte
        const key = filter.fieldName
        _rangeFilters.push({
          key,
          gte: _gte,
          lte: _lte,
          conditionType,
        })
      }
    })
    return _rangeFilters
  })
  const [isOpen, setOpen] = useState(false)
  const handleDismiss = () => {
    resetState()
    setOpen(false)
  }
  const fieldRangeOptions = useMemo(() => {
    const options: FieldOption<PerpDEXSourceResponse>[] = []
    Object.entries(TABLE_RANGE_FILTER_CONFIGS).forEach(([fieldName, config]) => {
      if ((config.type === 'number' || config.type === 'duration') && !!config.urlParamKey && !!config.label) {
        options.push({
          value: fieldName as keyof PerpDEXSourceResponse,
          label: config.label,
          default: { conditionType: 'gte', gte: 10 },
          unit: config.unit,
          searchText: (config.label as string) ?? '',
        })
      }
      if (
        (config.type === 'number' || config.type === 'duration') &&
        !!config.listLabel &&
        !!config.listParamKey &&
        !!config.listUnit
      ) {
        config.listParamKey.forEach((paramKey, index) => {
          options.push({
            value: paramKey as keyof PerpDEXSourceResponse,
            label: config.listLabel![index],
            default: { conditionType: 'gte', gte: 10 },
            unit: config.listUnit![index],
            searchText: config.listLabel![index] as string,
          })
        })
      }
    })
    return options
  }, [])
  const filterSelectConfigs = useMemo(() => {
    return Object.entries(TABLE_RANGE_FILTER_CONFIGS).reduce((result, [fieldName, config]) => {
      if (config.type === 'select') {
        return [...result, config]
      }
      return result
    }, [] as TableFilterConfig[])
  }, [])
  const filterMultiSelectConfigs = useMemo(() => {
    return Object.entries(TABLE_RANGE_FILTER_CONFIGS).reduce((result, [fieldName, config]) => {
      if (config.type === 'multiSelect' && fieldName === 'collateralAssets') {
        const newOptions = config.multiSelectOptions?.map((option) => {
          return {
            value: option.value,
            label: (
              <Flex key={option.value} sx={{ alignItems: 'center', gap: 1 }}>
                {option.label}
                <Type.Caption>{option.value}</Type.Caption>
              </Flex>
            ),
          }
        })
        return [...result, { ...config, multiSelectOptions: newOptions }]
      }
      return result
    }, [] as TableFilterConfig[])
  }, [])
  const [params, setParams] = useState<Record<string, string | undefined>>(() => {
    const newParams = { ...searchParams }
    Object.entries(TABLE_RANGE_FILTER_CONFIGS).forEach(([fieldName, config]) => {
      if ((config.type === 'number' || config.type === 'duration') && !!config.urlParamKey && !!config.label) {
        const { gteKey, lteKey } = generateRangeFilterKey({ key: config.urlParamKey })
        if (newParams[gteKey]) delete newParams[gteKey]
        if (newParams[lteKey]) delete newParams[lteKey]
      }
      if (
        (config.type === 'number' || config.type === 'duration') &&
        !!config.listLabel &&
        !!config.listParamKey &&
        !!config.listUnit
      ) {
        config.listParamKey.forEach((paramKey, index) => {
          const { gteKey, lteKey } = generateRangeFilterKey({ key: paramKey })
          if (newParams[gteKey]) delete newParams[gteKey]
          if (newParams[lteKey]) delete newParams[lteKey]
        })
      }
    })
    return newParams as any
  })
  const handleSetParams = useMemo(() => {
    return debounce((params: Record<string, string | undefined>) => {
      setParams((prev) => ({ ...prev, ...params }))
    }, 100)
  }, [])
  const handleChangeParams = ({ urlParamKey, value }: { urlParamKey: string; value: string | undefined }) => {
    handleSetParams({ [urlParamKey]: value })
  }
  const { getListSymbol } = useMarketsConfig()
  const allPairs = getListSymbol?.()

  const onChangePairs = (pairs: string[], unPairs: string[]) => {
    if (unPairs?.length) {
      handleSetParams({ ['pairs']: unPairs.join('_'), ['isExcludedPairs']: '1' })
    } else {
      if (!pairs?.length || pairs?.length === allPairs?.length) {
        handleSetParams({ ['pairs']: undefined, ['isExcludedPairs']: undefined })
      } else {
        handleSetParams({ ['pairs']: pairs.join('_'), ['isExcludedPairs']: undefined })
      }
    }
  }
  const handleReset = () => {
    setOpen(false)
    setParams({})
    setFormValues([])
    setSearchParamsOnly({})
  }
  const handleApply = () => {
    const rangeParams: Record<string, string | undefined> = {}
    formValues.forEach((v) => {
      const gte = v.conditionType === 'lte' ? undefined : v.gte
      const lte = v.conditionType === 'gte' ? undefined : v.lte
      const { gteKey, lteKey } = generateRangeFilterKey({ key: v.key })
      rangeParams[gteKey] = gte == null ? undefined : gte.toString()
      rangeParams[lteKey] = lte == null ? undefined : lte.toString()
    })
    setSearchParamsOnly({ ...rangeParams, ...params })
    setOpen(false)
  }
  const filterMapping = useMemo(() => {
    const currentFilters = getFilters({ searchParams: params })
    return currentFilters.reduce<Record<keyof PerpDEXSourceResponse, FilterValues>>((result, filter) => {
      return { ...result, [filter.fieldName]: filter }
    }, {} as Record<keyof PerpDEXSourceResponse, FilterValues>)
  }, [params])

  //@ts-ignore
  const currentPairs = filterMapping['pairs'].pairs ?? []
  //@ts-ignore
  const isExcludedPairs = filterMapping['pairs'].isExcluded ?? false

  return (
    <>
      <Button
        variant="ghost"
        sx={{ p: 0, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'normal' }}
        onClick={() => setOpen(true)}
      >
        <IconBox icon={<Funnel size={20} weight="fill" />} color="neutral1" />
        <Type.Caption sx={{ fontWeight: 600 }}>Filter</Type.Caption>
        {/* <Box
          sx={{
            width: 16,
            height: 16,
            textAlign: 'center',
            bg: 'primary1',
            color: 'neutral8',
            borderRadius: '50%',
            fontSize: '11px',
          }}
        >
          {Object.keys(filterMapping).length}
        </Box> */}
      </Button>
      <Modal mode="bottom" isOpen={isOpen} onDismiss={handleDismiss}>
        {isOpen && (
          <Box
            pt={3}
            sx={{
              '.select__value-container .select__multi-value ': { width: 80 },
              maxHeight: '100%',
              overflow: 'auto',
            }}
          >
            <Flex mb={3} sx={{ width: '100%', justifyContent: 'space-between', px: 3 }}>
              <Type.BodyBold>FILTERS</Type.BodyBold>
              <IconBox
                role="button"
                icon={<XCircle size={20} />}
                sx={{ color: 'neutral3', '&:hover': { color: 'neutral1' } }}
                onClick={handleDismiss}
              />
            </Flex>
            <Box mb={3} px={3}>
              <FilterPairDropdown
                currentPairs={currentPairs}
                onChangePairs={onChangePairs}
                isExcluded={isExcludedPairs}
                hasArrow
              >
                <Flex sx={{ alignItems: 'center', gap: 1 }}>
                  <Type.CaptionBold color="neutral2">{isExcludedPairs ? 'Excluded Pairs:' : 'Pairs:'}</Type.CaptionBold>
                  {!currentPairs?.length ? (
                    <Type.CaptionBold color="neutral1">All</Type.CaptionBold>
                  ) : (
                    <MarketGroup symbols={currentPairs} />
                  )}
                </Flex>
              </FilterPairDropdown>
            </Box>
            <Box px={3}>
              <Label label="Range Filters" />
            </Box>
            <ConditionFilterForm
              wrapperSx={{ px: 2 }}
              type="default"
              formValues={formValues}
              setFormValues={setFormValues}
              fieldOptions={fieldRangeOptions}
            />
            <Box mb={3} />
            {filterSelectConfigs.map((config) => {
              return (
                <Box key={config.urlParamKey} px={3}>
                  <Label label={config.label} />
                  <TableSelectFilter
                    key={config.urlParamKey}
                    //@ts-ignore
                    options={config.options}
                    //@ts-ignore
                    currentFilter={filterMapping[config.urlParamKey]?.selectedValue}
                    //@ts-ignore
                    changeFilter={(filter) => {
                      handleChangeParams({ urlParamKey: config.urlParamKey!, value: filter })
                    }}
                  />
                  <Box mb={3} />
                </Box>
              )
            })}
            {filterMultiSelectConfigs.map((config) => {
              //@ts-ignore
              if (config.urlParamKey !== 'collateralAssets') return null
              const selectedValues = params[config.urlParamKey]?.split('_')
              return (
                <Flex px={3} mb={3} key={config.urlParamKey} sx={{ alignItems: 'center', gap: 1 }}>
                  <Type.Caption fontWeight={600} color="neutral2">
                    {config.label}:
                  </Type.Caption>
                  <Dropdown
                    inline
                    buttonVariant="ghost"
                    menuDismissible
                    dismissible={false}
                    menu={
                      <Flex sx={{ flexDirection: 'column', bg: 'neutral7', p: 2 }}>
                        <Flex sx={{ flexDirection: 'column', gap: 12 }}>
                          <TableCustomMultiSelectListItem
                            options={config.multiSelectOptions!}
                            currentFilter={
                              (filterMapping[config.urlParamKey] as any)?.listSelectedValue ??
                              config.multiSelectOptions!.map((v) => v.value)
                            }
                            changeFilter={(v) => {
                              if (!v?.length) return
                              const isSelectedAll = v == null || v.length === config.multiSelectOptions?.length
                              handleChangeParams({
                                urlParamKey: config.urlParamKey!,
                                value: isSelectedAll ? undefined : v?.join('_'),
                              })
                            }}
                          />
                        </Flex>
                      </Flex>
                    }
                  >
                    {selectedValues ? (
                      <IconGroup iconNames={selectedValues} iconUriFactory={parseCollateralColorImage} />
                    ) : (
                      'All assets'
                    )}
                  </Dropdown>
                </Flex>
              )
            })}

            <Box
              sx={{
                width: '100%',
                px: 3,
                position: 'sticky',
                bottom: 0,
                bg: 'neutral7',
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
                <Button px={0} variant="ghost" mr={3} onClick={handleReset} sx={{ fontWeight: 'normal' }}>
                  Reset Default
                </Button>
                <Button
                  px={0}
                  variant="ghostPrimary"
                  onClick={handleApply}
                  // disabled={!hasChanged}
                  sx={{ fontWeight: 'normal' }}
                >
                  Apply & Save
                </Button>
              </Flex>
            </Box>
          </Box>
        )}
      </Modal>
    </>
  )
}
