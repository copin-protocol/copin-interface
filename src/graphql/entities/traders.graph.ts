import { BaseGraphQLResponse } from './base.graph'

export interface TraderGraphQLResponse<TraderData> {
  searchPositionStatistic: BaseGraphQLResponse<TraderData>
}
