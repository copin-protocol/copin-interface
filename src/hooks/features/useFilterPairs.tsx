import useMarketsConfig from 'hooks/helpers/useMarketsConfig'

export const useFilterPairs = ({ pairs, excludedPairs }: { pairs: string[]; excludedPairs: string[] }) => {
  const { getListSymbol } = useMarketsConfig()
  const protocolPairs = getListSymbol?.()

  const isCopyAll = !pairs.length || protocolPairs?.length === pairs.length
  const hasExcludingPairs = excludedPairs.length > 0 && isCopyAll
  const hasFilter = !isCopyAll || hasExcludingPairs

  return {
    hasFilter,
    isCopyAll,
    hasExcludingPairs,
  }
}
