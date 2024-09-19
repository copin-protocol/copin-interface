import { BaseGraphQLResponse } from './base.graph'

export interface TopOpeningPositionsGraphQLResponse<PositionData> {
  searchTopOpeningPosition: BaseGraphQLResponse<PositionData>
}
