import { useResponsive } from 'ahooks'

import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import TagWrapper from 'theme/Tag/TagWrapper'
import { Box, Flex, Type } from 'theme/base'
import { rankingFieldOptions } from 'utils/config/options'

import { FilterTabEnum, defaultFieldOptionLabels, defaultFieldOptions, rankingFieldOptionLabels } from './configs'

const FilterTag = ({
  filters,
  filterTab,
  limit,
  tagSx,
}: {
  filters: ConditionFormValues<TraderData>
  filterTab: FilterTabEnum
  limit?: number
  tagSx?: any
}) => {
  const { lg, xl } = useResponsive()
  const maxTag = limit ? limit : xl ? 4 : lg ? 3 : 1
  const fieldOptionLabels = filterTab === FilterTabEnum.RANKING ? rankingFieldOptionLabels : defaultFieldOptionLabels
  const fieldOptions = filterTab === FilterTabEnum.RANKING ? rankingFieldOptions : defaultFieldOptions
  return (
    <Flex sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      {Object.values(filters)
        .slice(0, maxTag)
        .map((values) => {
          if (!values) return <></>
          const unit = fieldOptions.find((e) => e.value === values.key)?.unit
          return (
            <TagWrapper key={values.key} sx={tagSx}>
              <Type.Caption>{fieldOptionLabels[values.key]}</Type.Caption>{' '}
              <Type.Caption>
                <Box as="span" color="primary1">
                  {values.conditionType === 'gte' || values.conditionType === 'between' ? `> ${values.gte}` : null}
                </Box>{' '}
                <Box as="span" color="primary1">
                  {values.conditionType === 'lte' || values.conditionType === 'between' ? `< ${values.lte}` : null}
                </Box>{' '}
                <Box as="span" color="neutral3">
                  {unit}
                </Box>
              </Type.Caption>
            </TagWrapper>
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
