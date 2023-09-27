import { ListSelectHandler } from './useListSelect'

// use with useListSelect
export default function useTableSelect<T>({
  dataList,
  dataListRaw,
  selected,
  selector,
  handleSelectItems,
  handleUnSelectItems,
}: {
  dataList: string[]
  dataListRaw?: T[]
  selected: string[]
  selector: ListSelectHandler<T>['selector']
  handleSelectItems: ListSelectHandler<T>['handleSelect']
  handleUnSelectItems: ListSelectHandler<T>['handleUnSelect']
}) {
  const isSelectedAll = dataList.every((item) => selected.includes(item))
  const handleSelectAll = (isSelectedAll: boolean) => {
    if (isSelectedAll) {
      handleUnSelectItems(dataList)
    } else {
      handleSelectItems(dataList, dataListRaw)
    }
  }
  const checkIsSelected = (data: T) => selected.includes(selector(data))
  const handleSelect = ({ isSelected, data }: { isSelected: boolean; data: T }) => {
    if (isSelected) {
      handleUnSelectItems([selector(data)])
    } else {
      handleSelectItems([selector(data)], [data])
    }
  }
  const reset = ({ data, dataListRaw }: { data: string[]; dataListRaw: T[] }) => {
    handleUnSelectItems(selected)
    handleSelectItems(data, dataListRaw)
  }
  return { isSelectedAll, handleSelectAll, checkIsSelected, handleSelect, reset }
}

export type TableSelectHandler<T> = ReturnType<typeof useTableSelect<T>>
