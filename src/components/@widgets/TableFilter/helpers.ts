export function generateRangeFilterKey({ key }: { key: string }) {
  return { gteKey: `${key}g`, lteKey: `${key}l` }
}

/**
 *  use for from to values
 */
export function getRangeFilterValues({
  searchParams,
  urlParamKey,
}: {
  searchParams: Record<string, string | undefined>
  urlParamKey: string
}) {
  const values: { gte: number | undefined; lte: number | undefined } = { gte: undefined, lte: undefined }
  const { gteKey, lteKey } = generateRangeFilterKey({ key: urlParamKey })
  const gteString = searchParams[gteKey]
  const lteString = searchParams[lteKey]

  if (gteString != null) {
    values.gte = Number(gteString)
  }
  if (lteString != null) {
    values.lte = Number(lteString)
  }
  return values
}

export function resetRangeFilter({
  setSearchParams,
  urlParamKey,
}: {
  setSearchParams: (params: { [key: string]: string | null | undefined }) => void
  urlParamKey: string
}) {
  const { gteKey, lteKey } = generateRangeFilterKey({ key: urlParamKey })
  const params: Record<string, string | undefined> = { ['page']: '1' }
  params[gteKey] = undefined
  params[lteKey] = undefined
  setSearchParams(params)
}
