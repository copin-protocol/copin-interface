import { useResponsive } from 'ahooks'

import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { TraderData } from 'entities/trader'
import TagWrapper from 'theme/Tag/TagWrapper'
import { Box, Flex, Type } from 'theme/base'

import { FilterTabEnum, defaultFieldOptionLabels, rankingFieldOptionLabels } from './configs'

const FilterTag = ({ filters, filterTab }: { filters: ConditionFormValues<TraderData>; filterTab: FilterTabEnum }) => {
  const { md, xl } = useResponsive()
  const maxTag = xl ? 6 : md ? 4 : 1
  const fieldOptionLabels = filterTab === FilterTabEnum.RANKING ? rankingFieldOptionLabels : defaultFieldOptionLabels
  return (
    <Flex sx={{ gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
      {Object.values(filters)
        .slice(0, maxTag)
        .map((values) => {
          if (!values) return <></>
          return (
            <TagWrapper key={values.key}>
              <Type.Caption>{fieldOptionLabels[values.key]}</Type.Caption>{' '}
              <Type.Caption>
                <Box as="span" color="primary1">
                  {values.conditionType === 'gte' || values.conditionType === 'between' ? `> ${values.gte}` : null}
                </Box>{' '}
                <Box as="span" color="primary1">
                  {values.conditionType === 'lte' || values.conditionType === 'between' ? `< ${values.lte}` : null}
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
