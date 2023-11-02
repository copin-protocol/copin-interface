import React, { useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import useLeaderboardContext from 'hooks/features/useLeaderboardProvider'
import { InputSearch } from 'theme/Input'

const SearchRanking = () => {
  const history = useHistory()
  const { keyword: searchText, setKeyword: setSearchText } = useLeaderboardContext()
  const inputSearchRef = useRef<HTMLInputElement>(null)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.trim())
  }

  const handleClearSearch = () => {
    setSearchText('')
  }

  useEffect(() => {
    if (!inputSearchRef.current) return
    inputSearchRef.current.blur()
  }, [history.location.pathname])

  return (
    <InputSearch
      ref={inputSearchRef}
      placeholder="Search Trader Ranking"
      sx={{
        ml: [0, 0, 3, 3],
        width: ['100%', '100%', '200px', '300px'],
        height: 'max-content',
        borderColor: 'neutral4',
        borderRadius: 'xs',
        backgroundColor: 'transparent',
      }}
      value={searchText}
      onChange={handleSearchChange}
      onClear={handleClearSearch}
    />
  )
}

export default SearchRanking
