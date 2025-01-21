// eslint-disable-next-line no-restricted-imports
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import { InputSearch } from 'theme/Input'
import { Box } from 'theme/base'

const SearchWrapper = styled<any>(Box)`
  position: relative;
`

const InputSearchText = ({
  searchText = '',
  placeholder = 'Input keyword',
  setSearchText,
  sx,
}: {
  searchText: string
  placeholder: string
  setSearchText: (value: string) => void
  sx?: any
}) => {
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const inputSearchRef = useRef<HTMLInputElement>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const handleClearSearch = () => {
    setSearchText('')
  }

  useEffect(() => {
    if (!inputSearchRef.current) return
    inputSearchRef.current.blur()
  }, [])

  return (
    <SearchWrapper ref={searchWrapperRef} width="100%">
      <InputSearch
        ref={inputSearchRef}
        placeholder={placeholder}
        sx={{
          px: 2,
          width: '100%',
          height: 'max-content',
          // borderColor: 'neutral2',
          ...sx,
        }}
        value={searchText}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />
    </SearchWrapper>
  )
}

export default InputSearchText
