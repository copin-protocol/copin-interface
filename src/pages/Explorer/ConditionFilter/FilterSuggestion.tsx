import { Trans } from '@lingui/macro'
import { useQuery } from 'react-query'

import { getFilterSuggestionsApi } from 'apis/suggestionApis'
import { getFormValuesFromFilters } from 'components/@widgets/ConditionFilterForm/helpers'
import { ConditionFormValues } from 'components/@widgets/ConditionFilterForm/types'
import { FilterSuggestionData } from 'entities/suggestion.d'
import { TraderData } from 'entities/trader'
import useGlobalStore from 'hooks/store/useGlobalStore'
import useMyProfile from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import { Flex, Type } from 'theme/base'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import useTradersContext from '../useTradersContext'
import { suggestionFactory } from './helpers'

export default function FilterSuggestion({
  changeFilters,
}: {
  changeFilters: (options: ConditionFormValues<TraderData>) => void
}) {
  const { myProfile } = useMyProfile()
  const { protocol } = useGlobalStore()
  const { currentSuggestion, setCurrentSuggestion } = useTradersContext()
  const { data } = useQuery(
    [QUERY_KEYS.GET_TRADER_FILTER_SUGGESTIONS, protocol],
    () => getFilterSuggestionsApi(protocol ?? DEFAULT_PROTOCOL),
    {
      keepPreviousData: true,
      retry: 0,
    }
  )

  const handleSelect = (data: FilterSuggestionData) => {
    setCurrentSuggestion(data.id)
    const formValues = getFormValuesFromFilters(data.ranges, suggestionFactory)
    changeFilters(formValues)

    logEvent(
      {
        category: EventCategory.FILTER,
        action: EVENT_ACTIONS[EventCategory.FILTER].SUGGESTION,
        label: getUserForTracking(myProfile?.username) + '-' + data.title,
      },
      { protocol, data }
    )
  }

  return data ? (
    <Flex mt={1} sx={{ gap: 2 }}>
      <Type.Caption color="neutral3" sx={{ flexShrink: 0, py: 1 }}>
        <Trans>Suggestion:</Trans>
      </Type.Caption>
      <Flex alignItems="center" sx={{ gap: 1, flexWrap: 'wrap' }}>
        {data.map((item) => {
          const isActive = currentSuggestion === item.id
          return (
            <Button
              variant={isActive ? 'ghostActive' : 'ghostInactive'}
              type="button"
              key={item.id}
              onClick={() => handleSelect(item)}
              sx={{ px: 2, py: 1, mx: 0, bg: isActive ? 'neutral5' : 'transparent' }}
            >
              <Type.Caption>{item.title}</Type.Caption>
            </Button>
          )
        })}
      </Flex>
    </Flex>
  ) : (
    <></>
  )
}
