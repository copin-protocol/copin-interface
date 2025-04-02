import { Funnel } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'
import { v4 as uuid } from 'uuid'

import useSearchParams from 'hooks/router/useSearchParams'
import Dropdown from 'theme/Dropdown'
import { Box, IconBox } from 'theme/base'

import TableRangeFilter from './TableRangeFilter'
import { generateRangeFilterKey, getRangeFilterValues } from './helpers'
import { TableFilterConfig, TableRangeFilterValues } from './types'

export function useFilterAction() {
  const { searchParams, setSearchParams } = useSearchParams()

  const getFilterRangeValues = useCallback(
    ({ listParamKey }: { listParamKey: string[] }) => {
      const values: TableRangeFilterValues = {}
      listParamKey.forEach((key) => {
        const { gteKey, lteKey } = generateRangeFilterKey({ key })
        const _values = getRangeFilterValues({ searchParams: searchParams as Record<string, string>, urlParamKey: key })
        values[gteKey] = _values.gte
        values[lteKey] = _values.lte
      })
      return values
    },
    [searchParams]
  )
  const changeFilterRange = useCallback(
    ({
      filter,
    }: // otherParams = {},
    {
      filter: TableRangeFilterValues
      // otherParams?: Record<string, string | null | undefined>
    }) => {
      const params: Record<string, string | undefined> = { ['page']: undefined }
      Object.entries(filter).forEach(([key, value]) => {
        params[key] = value == null ? undefined : value.toString()
      })
      setSearchParams({
        ...params,
        // ...otherParams,
      })
    },
    [setSearchParams]
  )
  const resetFilterRange = useCallback(
    // ({ listParamKey, otherParams = {} }: { listParamKey: string[]; otherParams?: Record<string, string | null | undefined> }) => {
    ({ listParamKey }: { listParamKey: string[] }) => {
      const params: Record<string, string | undefined> = { ['page']: undefined }
      listParamKey.forEach((key) => {
        const { gteKey, lteKey } = generateRangeFilterKey({ key })
        params[gteKey] = undefined
        params[lteKey] = undefined
      })
      setSearchParams({
        ...params,
        // ...otherParams
      })
    },
    [setSearchParams]
  )
  return { getFilterRangeValues, changeFilterRange, resetFilterRange }
}

// TODO: refactor this component to common component

export default function TableRangeFilterIcon({ config, sx = {} }: { config: TableFilterConfig; sx?: any }) {
  const listParamKey = config.urlParamKey ? [config.urlParamKey] : config.listParamKey ? config.listParamKey : []
  const listLabel = config.label ? [config.label] : config.listLabel ? config.listLabel : []
  const listUnit = config.unit ? [config.unit] : config.listUnit ? config.listUnit : []
  const { getFilterRangeValues, changeFilterRange, resetFilterRange } = useFilterAction()
  const filterValues = getFilterRangeValues({ listParamKey })
  const changeFilter = (filter: TableRangeFilterValues) => {
    changeFilterRange({ filter })
    setVisible(false)
  }
  const resetFilter = () => {
    resetFilterRange({ listParamKey })
    setVisible(false)
  }

  const hasFilter = Object.values(filterValues).some((v) => v != null)
  const [visible, setVisible] = useState(false)
  const [key, setKey] = useState(uuid())
  const _setVisible = (visible: boolean) => {
    setVisible(visible)
    setKey(uuid())
  }

  return (
    <Dropdown
      buttonVariant="ghostInactive"
      inline
      menuDismissible
      dismissible={false}
      visible={visible}
      setVisible={_setVisible as any}
      hasArrow={false}
      menu={
        <Box sx={{ p: 3, width: '300px' }}>
          <TableRangeFilter
            key={key}
            defaultValues={filterValues}
            urlKeys={listParamKey}
            labels={listLabel}
            onApply={changeFilter}
            onReset={resetFilter}
            units={listUnit}
          />
        </Box>
      }
    >
      <IconBox
        icon={<Funnel size={16} weight={!!hasFilter ? 'fill' : 'regular'} />}
        sx={{ transform: 'translateY(-1.5px)' }}
      />
    </Dropdown>
  )
}
