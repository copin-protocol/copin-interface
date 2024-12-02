import { Funnel } from '@phosphor-icons/react'
import { useCallback, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'

import TableRangeFilter, { Values } from 'components/@widgets/TableRangeFilter'
import useSearchParams from 'hooks/router/useSearchParams'
import Dropdown from 'theme/Dropdown'
import { Box, IconBox } from 'theme/base'

import { RangeValuesType } from './types'

export type TableFilterConfig = {
  urlParamKey: string
  type: 'number' | 'duration' | 'select'
}

export type TableRangeFilterConfig = {
  urlParamKey: string
  type: 'number' | 'duration'
}

export function useFilterAction() {
  const { searchParams, setSearchParams } = useSearchParams()

  const getFilterRangeValues = useCallback(
    ({ urlParamKey }: { urlParamKey: string }) => {
      const gteString = searchParams[`${urlParamKey}g`] as string | undefined
      const lteString = searchParams[`${urlParamKey}l`] as string | undefined
      const values: RangeValuesType = {
        gte: undefined,
        lte: undefined,
      }
      if (gteString != null) {
        values.gte = Number(gteString)
      }
      if (lteString != null) {
        values.lte = Number(lteString)
      }
      return values
    },
    [searchParams]
  )
  const changeFilterRange = useCallback(
    ({
      filter,
      urlParamKey,
      params = {},
    }: {
      filter: RangeValuesType
      urlParamKey: string
      params?: Record<string, string | null | undefined>
    }) => {
      setSearchParams({
        [`${urlParamKey}g`]: filter?.gte ? filter.gte.toString() : undefined,
        [`${urlParamKey}l`]: filter?.lte ? filter.lte.toString() : undefined,
        ...params,
      })
    },
    [setSearchParams]
  )
  const resetFilterRange = useCallback(
    ({ urlParamKey, params = {} }: { urlParamKey: string; params?: Record<string, string | null | undefined> }) => {
      setSearchParams({
        [`${urlParamKey}g`]: undefined,
        [`${urlParamKey}l`]: undefined,
        ...params,
      })
    },
    [setSearchParams]
  )
  return { getFilterRangeValues, changeFilterRange, resetFilterRange }
}

export default function TableRangeFilterIcon({ config, sx = {} }: { config: TableRangeFilterConfig; sx?: any }) {
  const urlParamKey = config.urlParamKey
  const { getFilterRangeValues, changeFilterRange, resetFilterRange } = useFilterAction()
  const { gte, lte } = getFilterRangeValues({ urlParamKey })
  const changeFilter = (filter: Values) => {
    changeFilterRange({ filter, urlParamKey })
    setVisible(false)
  }
  const resetFilter = () => {
    resetFilterRange({ urlParamKey })
    setVisible(false)
  }
  const defaultValues = useMemo(() => {
    return { gte, lte }
  }, [gte, lte])
  const hasFilter = gte != null || lte != null
  const [visible, setVisible] = useState(false)
  const [key, setKey] = useState(uuid())
  const _setVisible = (visible: boolean) => {
    setVisible(visible)
    setKey(uuid())
  }

  return (
    <Dropdown
      menuDismissible
      dismissible={false}
      visible={visible}
      setVisible={_setVisible as any}
      buttonSx={{ p: 0, border: 'none', ...sx }}
      hasArrow={false}
      menu={
        <Box sx={{ p: 3, width: '300px' }}>
          <TableRangeFilter
            key={key}
            defaultValues={defaultValues}
            onApply={changeFilter}
            onReset={resetFilter}
            unit={'$'}
          />
        </Box>
      }
    >
      <IconBox
        role="button"
        icon={<Funnel size={16} weight={!!hasFilter ? 'fill' : 'regular'} />}
        sx={{ color: !!hasFilter ? 'neutral2' : 'neutral3', '&:hover:': { color: 'neutral1' } }}
      />
    </Dropdown>
  )
}
