import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { useMemo, useState } from 'react'
import { GridProps } from 'styled-system'

import SelectWithCheckbox from 'components/@widgets/SelectWithCheckbox'
import { CopyTradeData } from 'entities/copyTrade'
import useDebounce from 'hooks/helpers/useDebounce'
import { Type } from 'theme/base'
import { SEARCH_DEBOUNCE_TIME } from 'utils/config/constants'

export default function SelectCopyTradesDropdown({
  allCopyTrades,
  selectedCopyTrades,
  handleToggleCopyTrade,
  handleSelectAllCopyTrades,
  menuSx = {},
  placement = 'bottomRight',
}: {
  allCopyTrades: CopyTradeData[]
  selectedCopyTrades: CopyTradeData[]
  handleToggleCopyTrade: (key: CopyTradeData) => void
  handleSelectAllCopyTrades: (isSelectedAll: boolean) => void
  menuSx?: SystemStyleObject & GridProps
  placement?: 'bottom' | 'top' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
}) {
  const [searchText, setSearchText] = useState<string>('')
  const trimmedSearchText = searchText.trim()
  const debounceSearchText = useDebounce<string>(trimmedSearchText, SEARCH_DEBOUNCE_TIME)

  const options = useMemo(() => {
    return allCopyTrades?.filter((option) => {
      return option?.title?.toLowerCase().includes(debounceSearchText.toLowerCase())
    })
  }, [allCopyTrades, debounceSearchText])

  const isSelectedAll =
    !!allCopyTrades.length &&
    allCopyTrades.every((copyTrade) => selectedCopyTrades?.map((e) => e.id).includes(copyTrade.id))

  const filterOptionsBySearchFn = ({ searchText, option }: { searchText: string; option: CopyTradeData }) => {
    if (!searchText) return true
    return !!option.title?.toLowerCase()?.includes(searchText.toLowerCase())
  }
  const optionItemKeyFn = (option: CopyTradeData) => option.id
  const optionItemSelectedFn = (option: CopyTradeData) => selectedCopyTrades.findIndex((o) => o.id === option.id) !== -1
  const renderOptionLabel = (option: CopyTradeData) => {
    return option.title
  }

  return (
    <SelectWithCheckbox
      menuSx={menuSx}
      placement={placement}
      isSelectedAll={isSelectedAll}
      options={options}
      selectAllLabel={
        <>
          <Trans>Select all</Trans> (
          <Type.Caption>
            <Trans>Includes deleted data</Trans>
          </Type.Caption>
          )
        </>
      }
      value={selectedCopyTrades}
      onChangeValue={handleToggleCopyTrade}
      onToggleSelectAll={handleSelectAllCopyTrades}
      filterOptionsBySearchFn={filterOptionsBySearchFn}
      optionItemKeyFn={optionItemKeyFn}
      optionItemSelectedFn={optionItemSelectedFn}
      renderOptionLabel={renderOptionLabel}
    >
      {selectedCopyTrades.length}/{allCopyTrades.length} active {allCopyTrades.length > 1 ? 'copytrades' : 'copytrade'}
    </SelectWithCheckbox>
  )
}
