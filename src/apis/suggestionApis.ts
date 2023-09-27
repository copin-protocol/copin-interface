import requester from 'apis'

import { FilterSuggestionData } from 'entities/suggestion.d'
import { ProtocolEnum } from 'utils/config/enums'

const SERVICE = 'filter-suggestions'

export async function getFilterSuggestionsApi(protocol: ProtocolEnum) {
  return requester.get(`${protocol}/${SERVICE}/list`).then((res: any) => res.data as FilterSuggestionData[])
}
