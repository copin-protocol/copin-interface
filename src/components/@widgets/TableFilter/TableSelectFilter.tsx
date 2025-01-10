import { Funnel } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import Dropdown from 'theme/Dropdown'
import Select from 'theme/Select'
import { Box, Flex, IconBox } from 'theme/base'

export type SelectOption = { value: string | undefined; label: ReactNode }
type Props = {
  options: SelectOption[]
  currentFilter: SelectOption['value']
  changeFilter: (filter: SelectOption['value']) => void
}

export function TableSelectFilterIcon(props: Props) {
  const hasFilter = !!props.currentFilter
  return (
    <Dropdown
      buttonVariant="ghostInactive"
      inline
      hasArrow={false}
      menu={
        <Flex sx={{ flexDirection: 'column', bg: 'neutral7' }}>
          <TableCustomSelectListItem {...props} />
        </Flex>
      }
    >
      <IconBox
        icon={<Funnel size={16} weight={hasFilter ? 'fill' : 'regular'} />}
        sx={{
          transform: 'translateY(-1.5px)',
        }}
      />
    </Dropdown>
  )
}

function TableCustomSelectListItem({ options, currentFilter, changeFilter }: Props) {
  return (
    <>
      {options.map((config) => {
        const isActive = config.value == currentFilter
        return (
          <Box
            role="button"
            key={`${config.label}`}
            sx={{
              height: 32,
              lineHeight: '32px',
              px: 2,
              bg: isActive ? 'neutral4' : 'transparent',
              '&:hover': { bg: 'neutral5' },
            }}
            onClick={() => changeFilter(config.value)}
          >
            {config.label}
          </Box>
        )
      })}
    </>
  )
}

export function TableSelectFilter({ options, currentFilter, changeFilter }: Props) {
  return (
    <>
      <Select
        options={options}
        value={options.find((option) => option.value === currentFilter)}
        onChange={(newValue: any) => {
          changeFilter(newValue.value)
        }}
        components={{
          DropdownIndicator: () => <div></div>,
        }}
        isSearchable={false}
      />
    </>
  )
}
