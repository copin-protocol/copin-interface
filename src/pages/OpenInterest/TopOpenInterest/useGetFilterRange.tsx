import { useMemo } from 'react'

import { getRangeFilterValues } from 'components/@widgets/TableFilter/helpers'
import { RangeFilterValues } from 'components/@widgets/TableFilter/types'
import useSearchParams from 'hooks/router/useSearchParams'

import { TOP_POSITION_RANGE_CONFIG_MAPPING } from '../configs'

export default function useGetFilterRange() {
  const { searchParams, setSearchParams, setSearchParamsOnly } = useSearchParams()
  const ranges: RangeFilterValues[] = useMemo(() => {
    const result = Object.entries(TOP_POSITION_RANGE_CONFIG_MAPPING).map(([field, values]) => {
      const result = getRangeFilterValues({ urlParamKey: values.urlParamKey ?? '', searchParams: searchParams as any })
      Object.entries(result).forEach(([key, value]) => {
        //@ts-ignore
        if (value == null) delete result[key]
      })
      return {
        ...result,
        field,
      }
    })
    return result.filter((v) => v.gte != null || v.lte != null)
  }, [searchParams])
  return { ranges, setSearchParams, setSearchParamsOnly }
}
