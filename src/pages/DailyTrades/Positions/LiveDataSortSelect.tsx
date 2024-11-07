import { ReactNode } from 'react'

import { PositionData } from 'entities/trader'
import Select from 'theme/Select'
import { Box } from 'theme/base'

export const SORT_OPTIONS: { value: keyof PositionData; label: ReactNode }[] = [
  { value: 'openBlockTime', label: 'Open Time' },
  { value: 'closeBlockTime', label: 'Close Time' },
  // { value: 'updatedAt', label: 'Update Time' },
]

export function LiveDataSortSelect({
  currentSelection,
  changeSelection,
}: {
  currentSelection: keyof PositionData
  changeSelection: (filter: keyof PositionData) => void
}) {
  return (
    <Box
      sx={{
        '& .select__indicators': {
          pr: '4px !important',
        },
        '& .select__control': {
          minHeight: '0px !important',
          border: 'none',
          p: '0px !important',
        },
        '& .select__value-container': {
          p: '0px !important',
        },
        '& .select__menu': {
          width: '100px !important',
        },
        '& .select__menu-list': {
          overflow: 'hidden !important',
        },
      }}
    >
      <Select
        variant="ghost"
        options={SORT_OPTIONS}
        value={SORT_OPTIONS.filter((o) => currentSelection === o.value)}
        onChange={(newValue: any) => {
          changeSelection(newValue.value)
        }}
        isSearchable={false}
      />
    </Box>
  )
}
