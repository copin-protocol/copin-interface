import React, { ReactNode } from 'react'

import Select from 'theme/Select'
import { Flex } from 'theme/base'

export interface TraderFilterProps {
  id: string
  label: ReactNode
  value: string
}

export default function TraderFilter({
  options,
  currentFilter,
  handleFilterChange,
}: {
  options: TraderFilterProps[]
  currentFilter: TraderFilterProps | null
  handleFilterChange: (option: TraderFilterProps) => void
}) {
  return (
    <Flex width={180} alignItems="center" sx={{ gap: ['2px', '2px', '2px', 2] }}>
      <Select
        options={options}
        defaultMenuIsOpen={false}
        value={currentFilter}
        onChange={(newValue: any) => {
          handleFilterChange(newValue as TraderFilterProps)
        }}
        isSearchable
      />
    </Flex>
  )
}
