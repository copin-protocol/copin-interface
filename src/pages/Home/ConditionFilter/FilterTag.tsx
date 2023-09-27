import { useResponsive } from 'ahooks'

import { Box, Flex, Type } from 'theme/base'

import { fieldOptionLabels } from './FilterForm'
import { ConditionFormValues } from './types'

const FilterTag = ({ filters }: { filters: ConditionFormValues }) => {
  const { md, xl } = useResponsive()
  const maxTag = xl ? 6 : md ? 4 : 2
  return (
    <Flex sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      {Object.values(filters)
        .slice(0, maxTag)
        .map((values) => {
          if (!values) return <></>
          return (
            <Box
              key={values.key}
              sx={{
                borderRadius: 'xs',
                px: '6px',
                backgroundColor: 'neutral5',
                lineHeight: 0,
                textTransform: 'uppercase',
              }}
            >
              <Type.Caption>{fieldOptionLabels[values.key]}</Type.Caption>{' '}
              <Type.Caption color="primary1">
                {values.conditionType === 'gte' || values.conditionType === 'between' ? `> ${values.gte}` : null}
              </Type.Caption>{' '}
              <Type.Caption color="primary1">
                {values.conditionType === 'lte' || values.conditionType === 'between' ? `< ${values.lte}` : null}
              </Type.Caption>
            </Box>
          )
        })}
      {Object.keys(filters).length > maxTag ? (
        <Type.Caption sx={{ borderRadius: 'xs', padding: 1, px: '6px', backgroundColor: 'neutral5', py: 0 }}>
          ...
        </Type.Caption>
      ) : null}
    </Flex>
  )
}

export default FilterTag
