import { ApiMeta } from 'apis/api'

export interface BaseGraphQLResponse<T> {
  data: T[]
  meta: ApiMeta
}
