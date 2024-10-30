import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'

import Select from 'theme/Select'
import { Box } from 'theme/base'
import { ProtocolSortByEnum } from 'utils/config/enums'

export type ProtocolSortProps = {
  id: ProtocolSortByEnum
  label: ReactNode
  value: ProtocolSortByEnum
}

const PROTOCOL_SORT_OPTIONS: ProtocolSortProps[] = [
  {
    id: ProtocolSortByEnum.ALPHABET,
    label: <Trans>Sort by A-Z</Trans>,
    value: ProtocolSortByEnum.ALPHABET,
  },
  {
    id: ProtocolSortByEnum.TRADERS,
    label: <Trans>Sort by traders</Trans>,
    value: ProtocolSortByEnum.TRADERS,
  },
]

// Define the props interface
interface ProtocolSortOptionProps {
  currentSort?: ProtocolSortByEnum
  changeCurrentSort: (data?: ProtocolSortByEnum) => void
}

const ProtocolSortOptions: React.FC<ProtocolSortOptionProps> = ({ currentSort, changeCurrentSort }) => {
  const currentOption = PROTOCOL_SORT_OPTIONS.find((option) => option.id === currentSort)
  return (
    <Box
      width={135}
      sx={{
        '.select__control': {
          minHeight: 'auto !important',
          py: '0px !important',
          width: '134px !important',
        },
        '.select__value-container': { px: '8px !important' },
        '.select__indicators': { pr: '8px !important' },
      }}
    >
      <Select
        isSearchable={false}
        options={PROTOCOL_SORT_OPTIONS}
        value={currentOption}
        onChange={(newValue: any) => {
          changeCurrentSort(newValue.id)
        }}
      />
    </Box>
  )
}

export default ProtocolSortOptions
