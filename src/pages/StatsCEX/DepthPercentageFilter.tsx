import React, { ReactNode } from 'react'

import Select from 'theme/Select'
import { Flex } from 'theme/base'

export interface DepthPercentageFilterProps {
  id: string
  label: ReactNode
  value: string
}

export default function DepthPercentageFilter({
  options,
  currentFilter,
  handleFilterChange,
}: {
  options: DepthPercentageFilterProps[]
  currentFilter: DepthPercentageFilterProps | null
  handleFilterChange: (option: DepthPercentageFilterProps) => void
}) {
  return (
    <Flex width={140} alignItems="center" sx={{ gap: ['2px', '2px', '2px', 2] }}>
      <Select
        options={options}
        defaultMenuIsOpen={false}
        value={currentFilter}
        onChange={(newValue: any) => {
          handleFilterChange(newValue as DepthPercentageFilterProps)
        }}
      />
    </Flex>
  )
}
