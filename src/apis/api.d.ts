export type ApiMeta = {
  limit: number
  offset: number
  total: number
  totalPages: number
}

export type ApiListResponse<T> = {
  meta: ApiMeta
  data: T[]
}
