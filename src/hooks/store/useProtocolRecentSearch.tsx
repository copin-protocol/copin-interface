import dayjs from 'dayjs'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { ProtocolEnum } from 'utils/config/enums'

interface ProtocolRecentSearch {
  protocol: ProtocolEnum
  timestamp: number
}

interface ProtocolRecentSearchState {
  protocolRecentSearch: ProtocolRecentSearch[]
  setProtocolRecentSearch: (data: ProtocolRecentSearch[]) => void
}

const useProtocolRecentSearchStore = create<ProtocolRecentSearchState>()(
  persist(
    immer((set) => ({
      protocolRecentSearch: [],
      setProtocolRecentSearch: (traders: ProtocolRecentSearch[]) =>
        set((state) => {
          state.protocolRecentSearch = traders
        }),
    })),
    {
      name: 'protocol-recent-search',
      getStorage: () => localStorage,
    }
  )
)

const useProtocolRecentSearch = () => {
  const { protocolRecentSearch, setProtocolRecentSearch } = useProtocolRecentSearchStore()

  const addProtocolRecentSearch = (protocol: ProtocolEnum) => {
    const index = protocolRecentSearch?.findIndex((e) => e.protocol === protocol)
    const oldData = protocolRecentSearch ? [...protocolRecentSearch] : []
    if (index < 0) {
      if (protocolRecentSearch && protocolRecentSearch.length >= 5) {
        oldData.pop()
      }
    }
    const result: ProtocolRecentSearch = {
      protocol,
      timestamp: dayjs().local().valueOf(),
    }
    const results = [result, ...oldData.filter((e) => e.protocol !== protocol)]
    results.sort((a, b) => b.timestamp - a.timestamp)
    setProtocolRecentSearch(results)
  }

  return {
    protocolRecentSearch,
    addProtocolRecentSearch,
  }
}

export default useProtocolRecentSearch
