import { SEARCH_TOP_OPENING_POSITIONS_FUNCTION_NAME } from 'graphql/query'

import { BaseGraphQLResponse } from './base.graph'

export interface TopOpeningPositionsGraphQLResponse<PositionData> {
  [SEARCH_TOP_OPENING_POSITIONS_FUNCTION_NAME]: BaseGraphQLResponse<PositionData>
}
