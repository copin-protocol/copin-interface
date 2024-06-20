import React, { ReactNode } from 'react'

import Select from 'theme/Select'
import { Flex } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'

export interface ExchangeFilterProps {
  id: CopyTradePlatformEnum
  label: ReactNode
}

export default function ExchangeFilter({
  options,
  currentFilter,
  handleFilterChange,
}: {
  options: ExchangeFilterProps[]
  currentFilter: ExchangeFilterProps | null
  handleFilterChange: (option: ExchangeFilterProps) => void
}) {
  return (
    <Flex alignItems="center" sx={{ gap: ['2px', '2px', '2px', 2] }}>
      <Select
        options={options}
        defaultMenuIsOpen={false}
        value={currentFilter}
        onChange={(newValue: any) => {
          handleFilterChange(newValue as ExchangeFilterProps)
        }}
        isSearchable={true}
      />
    </Flex>
  )
}
