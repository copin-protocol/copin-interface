import { Trans } from '@lingui/macro'
import { useQuery } from 'react-query'

import { getFilterSuggestionsApi } from 'apis/suggestionApis'
import { getFormValuesFromFilters } from 'components/ConditionFilterForm/helpers'
import { ConditionFormValues } from 'components/ConditionFilterForm/types'
import { FilterSuggestionData } from 'entities/suggestion.d'
import { TraderData } from 'entities/trader'
import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { Button } from 'theme/Buttons'
import { Flex, Type } from 'theme/base'
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
