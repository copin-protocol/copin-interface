import { PairFilterEnum } from 'utils/config/enums'

export function getPairsParam({
  pairs,
  defaultAllPairs,
  excludedPairs,
}: {
  pairs: string[]
  defaultAllPairs: string[] | undefined
  excludedPairs: string[]
}) {
  let params: { pairs: string | null; excludedPairs: string | null } = { pairs: null, excludedPairs: null }
  const isCopyAll = pairs.length === defaultAllPairs?.length
  const hasExcludingPairs = excludedPairs.length > 0 && isCopyAll
  if (hasExcludingPairs) {
    params = { pairs: PairFilterEnum.ALL, excludedPairs: excludedPairs.join('_') }
  } else if (!isCopyAll) {
    params = { pairs: pairs.join('_'), excludedPairs: null }
  } else {
    params = { pairs: null, excludedPairs: null }
  }
  return params
}
