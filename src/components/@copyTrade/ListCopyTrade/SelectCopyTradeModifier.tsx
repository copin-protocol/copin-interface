import { useEffect, useRef } from 'react'

import { CopyTradeData } from 'entities/copyTrade'
import { useSelectCopyTrade } from 'hooks/features/copyTrade/useSelectCopyTrade'

export default function SelectCopyTradeModifier({ data }: { data: CopyTradeData[] | undefined }) {
  const [recheckCopyTrades, setAllCopyTrades, reset] = useSelectCopyTrade((s) => [
    s.recheckCopyTrades,
    s.setAllCopyTrades,
    s.reset,
  ])
  const loadedRef = useRef(false)
  const copyTradesRef = useRef(data)
  useEffect(() => {
    if (!loadedRef.current && data?.length) {
      reset()
      loadedRef.current = true
      setAllCopyTrades(data)
      copyTradesRef.current = data
      return
    }
    if (loadedRef.current && copyTradesRef.current && copyTradesRef.current !== data) {
      copyTradesRef.current = data
      recheckCopyTrades(data ?? [])
      return
    }
  }, [data])
  return null
}
