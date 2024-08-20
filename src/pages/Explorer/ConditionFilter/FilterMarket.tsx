import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useState } from 'react'

import { ConditionFormValues, RowValues } from 'components/@widgets/ConditionFilterForm/types'
import SelectMarketWithSearch from 'components/@widgets/SelectMarketWithSearch'
import { TraderData } from 'entities/trader'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { Flex, Type } from 'theme/base'
import { getTokenTradeList } from 'utils/config/trades'

export default function FilterMarket({
  filters,
  changeFilters,
}: {
  filters: ConditionFormValues<TraderData>
  changeFilters: (options: ConditionFormValues<TraderData>) => void
}) {
  const { protocol } = useProtocolStore()
  const pairs = protocol && getTokenTradeList(protocol)
  const pairOptions = Object.values(
    pairs
      ?.sort((x, y) => (x.symbol < y.symbol ? -1 : x.symbol > y.symbol ? 1 : 0))
      ?.reduce((acc: any, market) => {
        if (!acc[market.symbol]) {
          acc[market.symbol] = market
        }
        return acc
      }, {})
  )?.map((e: any) => {
    return { value: e.symbol, label: e.symbol }
  })

  const allPairs = Array.from(new Set(pairs?.map((e) => e.symbol))) ?? []
  const initSelected = filters.find((e) => e.key === 'indexTokens')?.in
  const [keyword, setKeyword] = useState<string | undefined>()
  const [selectedItems, setSelectedItems] = useState<string[]>(() => {
    return initSelected ?? allPairs ?? []
  })

  const handleSelect = (item: string) => {
    const newValues = selectedItems.includes(item) ? selectedItems.filter((e) => e !== item) : [...selectedItems, item]
    const symbols = Array.from(new Set(pairs.filter((e) => newValues.includes(e.symbol)).map((e) => e.symbol)))
    setSelectedItems(symbols)
    let formValues = [...filters]
    const index = filters.findIndex((e) => e.key === 'indexTokens')
    const filterValue: RowValues<TraderData> = { key: 'indexTokens', conditionType: 'in', in: symbols }
    if (symbols.length > 0) {
      if (index === -1) {
        formValues = [...formValues, filterValue]
      } else {
        formValues[index] = filterValue
      }
    } else {
      formValues = formValues.filter((e) => e.key !== 'indexTokens')
    }
    changeFilters(formValues)
  }

  const handleSelectAll = (isSelectedAll: boolean) => {
    if (isSelectedAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(allPairs)
    }
    changeFilters(filters.filter((e) => e.key !== 'indexTokens'))
  }

  const { sm } = useResponsive()

  return (
    <Flex alignItems="center" px={3} mt={1} sx={{ gap: 2 }}>
      <Type.Caption color="neutral3" sx={{ flexShrink: 0, py: 1 }}>
        <Trans>Market:</Trans>
      </Type.Caption>
      <SelectMarketWithSearch
        allItems={pairOptions}
        selectedItems={selectedItems}
        keyword={keyword}
        handleToggleItem={handleSelect}
        handleSelectAllItems={handleSelectAll}
        handleChangeKeyword={setKeyword}
        limit={sm ? 4 : 2}
      />
    </Flex>
  )
}
