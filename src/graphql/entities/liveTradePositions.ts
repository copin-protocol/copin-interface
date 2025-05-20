import { SEARCH_POSITIONS_FUNCTION_NAME } from 'graphql/query'

import { BaseGraphQLResponse } from './base.graph'

export interface LiveTradePositionsGraphQLResponse<PositionData> {
  [SEARCH_POSITIONS_FUNCTION_NAME]: BaseGraphQLResponse<PositionData>
}
