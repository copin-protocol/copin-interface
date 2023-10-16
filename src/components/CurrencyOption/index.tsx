// eslint-disable-next-line no-restricted-imports
import { t } from '@lingui/macro'
import React from 'react'

import Select from 'theme/Select'
import { Box } from 'theme/base'
import { TokenOptionProps } from 'utils/config/trades'

export default function CurrencyOption({
  options,
  currentOption,
  handleChangeOption,
}: {
  options: TokenOptionProps[]
  currentOption: TokenOptionProps
  handleChangeOption: (option: TokenOptionProps) => void
}) {
  return (
    <Box sx={{ width: 85, overflowY: 'auto' }}>
      <Select
        isSearchable={true}
        menuPlacement="auto"
        maxMenuHeight={236}
        menuPosition="fixed"
        variant="outlinedSecondary"
        options={options}
        value={currentOption}
        noOptionsMessage={() => t`No Data`}
        onChange={(newValue) => handleChangeOption(newValue as TokenOptionProps)}
      />
    </Box>
  )
}
