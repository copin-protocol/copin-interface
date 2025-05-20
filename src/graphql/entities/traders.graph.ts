import { SEARCH_TRADERS_STATISTIC_FUNCTION_NAME } from 'graphql/query'

import { BaseGraphQLResponse } from './base.graph'

export interface TraderGraphQLResponse<TraderData> {
  [SEARCH_TRADERS_STATISTIC_FUNCTION_NAME]: BaseGraphQLResponse<TraderData>
}
