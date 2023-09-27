import { useQuery } from 'react-query'

import { getFilterSuggestionsApi } from 'apis/suggestionApis'
import { FilterSuggestionData } from 'entities/suggestion.d'
import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { Button } from 'theme/Buttons'
import { Flex, Type } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import useTradersContext from '../useTradersContext'
import { getFormValuesFromFilters } from './helpers'
import { ConditionFormValues } from './types'

export default function FilterSuggestion({ changeFilters }: { changeFilters: (options: ConditionFormValues) => void }) {
  const { myProfile } = useMyProfile()
  const { protocol } = useProtocolStore()
  const { currentSuggestion, setCurrentSuggestion } = useTradersContext()
  const { data } = useQuery(
    [QUERY_KEYS.GET_TRADER_FILTER_SUGGESTIONS, protocol],
    () => getFilterSuggestionsApi(protocol),
    {
      keepPreviousData: true,
      retry: 0,
    }
  )

  const handleSelect = (data: FilterSuggestionData) => {
    setCurrentSuggestion(data.id)
    const formValues = getFormValuesFromFilters(data.ranges)
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
    <Flex alignItems="center" mt={1} sx={{ gap: 2 }}>
      <Type.Caption color="neutral3">Suggestion:</Type.Caption>
      <Flex alignItems="center" sx={{ gap: 1 }}>
        {data.map((item) => {
          return (
            <Button
              variant={currentSuggestion === item.id ? 'ghostActive' : 'ghostInactive'}
              type="button"
              key={item.id}
              onClick={() => handleSelect(item)}
              sx={{ px: 2, py: 1, mx: 0 }}
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
