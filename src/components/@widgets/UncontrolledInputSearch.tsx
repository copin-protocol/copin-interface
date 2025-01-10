import debounce from 'lodash/debounce'
import { ChangeEvent, ChangeEventHandler, MutableRefObject, RefObject, useCallback, useMemo, useRef } from 'react'

import { InputSearch } from 'theme/Input'

export function useUncontrolledInputSearchHandler({
  onChange,
  onClear,
}: {
  onChange: (searchText: string | undefined) => void
  onClear: () => void
}) {
  const showClearSearchButtonRef = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const handleChangeSearch = useMemo(() => {
    return debounce((e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value) {
        showClearSearchButtonRef.current = true
      } else {
        showClearSearchButtonRef.current = false
      }
      onChange(value)
    }, 200)
  }, [onChange])
  const handleClearSearch = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    showClearSearchButtonRef.current = false
    onClear()
  }, [onClear])
  return {
    handleChangeSearch,
    handleClearSearch,
    inputRef,
    showClearSearchButtonRef,
  }
}

/**
 * Controlled input will render every time user type, then debounce the text before filter the object.
 * Uncontrolled input will debounce when user type => reduce render parent component
 */
export default function UncontrolledInputSearch({
  inputRef,
  showClearSearchButtonRef,
  onChange,
  onClear,
  placeHolder = 'Search',
}: {
  placeHolder?: string
  inputRef: RefObject<HTMLInputElement>
  showClearSearchButtonRef: MutableRefObject<boolean>
  onChange: ChangeEventHandler<HTMLInputElement> | undefined
  onClear: (() => void) | undefined
}) {
  return (
    <InputSearch
      ref={inputRef}
      onChange={onChange}
      onClear={onClear}
      placeholder={placeHolder}
      iconSize={16}
      sx={{
        flex: 1,
        ...(showClearSearchButtonRef.current
          ? {
              '& button.search-btn--clear': {
                visibility: 'visible',
              },
            }
          : {}),
      }}
    />
  )
}
