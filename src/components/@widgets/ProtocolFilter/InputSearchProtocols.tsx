// eslint-disable-next-line no-restricted-imports
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import { InputSearch } from 'theme/Input'
import { Box } from 'theme/base'

export const SearchWrapper = styled<any>(Box)`
  position: relative;
`

export const Wrapper = styled(Box)`
  position: relative;
  width: 100%;
  background: ${({ theme }) => `${theme.colors.neutral7}`};
  padding-left: 16px;
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.neutral4}`};
  @supports (backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)) or (-moz-backdrop-filter: blur(20px)) {
    background: ${({ theme }) => `${theme.colors.neutral7}`};
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    -mox-backdrop-filter: blur(20px);
  }
`

const InputSearchProtocols = ({
  searchText = '',
  setSearchText,
}: {
  searchText: string
  setSearchText: (value: string) => void
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
        placeholder="SEARCH PROTOCOLS"
        sx={{
          bg: 'neutral5',
          border: 'none',
          padding: 2,
          width: '100%',
          height: 'max-content',
          borderRadius: 0,
        }}
        value={searchText}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />
    </SearchWrapper>
  )
}

export default InputSearchProtocols
