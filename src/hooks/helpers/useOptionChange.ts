import { useCallback, useState } from 'react'

import useSearchParams from 'hooks/router/useSearchParams'

// get initOption from searchParams, check if option.id === initOption return option, else return default option and set search params to current option
export function getInitOption<TOption extends { id: any }>({
  initOption,
  options,
}: {
  initOption: string
  options: TOption[]
}) {
  let result = Object.values(options)[0]
  if (!initOption) return result
  for (const option of options) {
    if (option.id === initOption) {
      result = option
      break
    }
  }
  return result
}

export function useOptionChange<TOption extends { id: any }>({
  optionName,
  options,
  defaultOption,
  callback,
  optionNameToBeDelete,
}: {
  optionName: string
  options: TOption[]
  defaultOption?: string
  callback?: () => void
  optionNameToBeDelete?: string[]
}) {
  const { searchParams, setSearchParams } = useSearchParams()

  const [currentOption, setCurrentOption] = useState<TOption>(
    getInitOption({ initOption: (searchParams[optionName] as string) ?? defaultOption, options })
  )

  const changeCurrentOption = useCallback(
    (option: TOption) => {
      callback && callback()
      setCurrentOption(option)
      const deleteParams: { [key: string]: null } = {}
      if (optionNameToBeDelete && option.id) {
        optionNameToBeDelete.forEach((name) => {
          deleteParams[name] = null
        })
      }
      setSearchParams({ [optionName]: option.id, ...deleteParams })
    },
    [callback, optionName, optionNameToBeDelete, setSearchParams]
  )
  return { currentOption, setCurrentOption, changeCurrentOption }
}
