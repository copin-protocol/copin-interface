import { Trans } from '@lingui/macro'
import React, { ReactNode } from 'react'

import Select from 'theme/Select'
import { Box } from 'theme/base'
import { themeColors } from 'theme/colors'
import { ProtocolSortByEnum } from 'utils/config/enums'

export type ProtocolSortProps = {
  id: ProtocolSortByEnum
  label: ReactNode
  value: ProtocolSortByEnum
}

const PROTOCOL_SORT_OPTIONS: ProtocolSortProps[] = [
  {
    id: ProtocolSortByEnum.ALPHABET,
    label: <Trans>SORT BY A-Z</Trans>,
    value: ProtocolSortByEnum.ALPHABET,
  },
  {
    id: ProtocolSortByEnum.TRADERS,
    label: <Trans>SORT BY TRADERS</Trans>,
    value: ProtocolSortByEnum.TRADERS,
  },
  {
    id: ProtocolSortByEnum.OI,
    label: <Trans>SORT BY OI</Trans>,
    value: ProtocolSortByEnum.OI,
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
      width={150}
      display={['none', 'block']}
      sx={{
        '.select__control': {
          minHeight: 'auto !important',
          py: '0px !important',
          width: '150px !important',
          height: '40px !important',
          border: 'none !important',
          borderRadius: '0 !important',
          bg: `${themeColors.neutral5} !important`,
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
