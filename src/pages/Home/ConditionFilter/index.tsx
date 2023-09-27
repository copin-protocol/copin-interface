import { Funnel } from '@phosphor-icons/react'

import { Box, Flex, Type } from 'theme/base'

import FilterForm from './FilterForm'
import FilterSuggestion from './FilterSuggestion'
import { ConditionFilterProps } from './types'

export default function ConditionFilter({ filters, onCancel, onClickTitle, changeFilters }: ConditionFilterProps) {
  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%' }}>
      <Flex
        sx={{
          alignItems: 'center',
          gap: 2,
          px: [2, 2, 2, 3],
          pt: [2, 2, 2, 3],
          pb: [2, 2, 2, 12],
          borderBottom: 'small',
          borderBottomColor: 'neutral5',
          color: 'neutral2',
          cursor: onClickTitle ? 'pointer' : 'default',
        }}
        justifyContent="space-between"
        onClick={onClickTitle}
      >
        <Box>
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Funnel size={20} />
            <Type.BodyBold color="neutral1" fontSize={[14, 14, 16]}>
              Filter
            </Type.BodyBold>
          </Flex>
          <FilterSuggestion changeFilters={changeFilters} />
        </Box>
      </Flex>
      <Box flex="1">
        <FilterForm
          key={filters?.join(',')}
          defaultFormValues={filters}
          handleChangeOption={changeFilters}
          handleClose={onCancel}
        />
      </Box>
    </Flex>
  )
}
