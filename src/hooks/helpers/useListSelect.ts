import { useState } from 'react'

export default function useListSelect<T>(args?: { selector: (data: T) => string }) {
  const [selected, setSelected] = useState<string[]>([])
  const [rawSelected, setRawSelected] = useState<Record<string, T>>({})
  const handleSelect = (list: string[], listData?: T[]) => {
    setSelected((prev) => Array.from(new Set([...prev, ...list])))
    if (!args?.selector || !listData) return
    const record = listData.reduce((result, data) => {
      return { ...result, [args.selector(data)]: data }
    }, {})
    setRawSelected((prev) => ({ ...prev, ...record }))
  }
  const handleUnSelect = (list: string[]) => {
    setSelected((prev) => prev.filter((value) => !list.includes(value)))
    setRawSelected((prev) => {
      const newData = { ...prev }
      list.forEach((value) => delete newData[value])
      return newData
    })
  }
  const reset = (args?: { list?: string[]; raw?: Record<string, T> }) => {
    setSelected(args?.list ?? [])
    setRawSelected(args?.raw ?? {})
  }
  return {
    selected,
    handleSelect,
    handleUnSelect,
    rawSelected,
    reset,
    selector: args?.selector ?? (() => ''),
  }
}

export type ListSelectHandler<T> = ReturnType<typeof useListSelect<T>>
