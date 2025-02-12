import { Warning } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import useDebounce from 'hooks/helpers/useDebounce'
import { InputSearch } from 'theme/Input'
import { Box, Type } from 'theme/base'
import { isAddress } from 'utils/web3/contracts'

import useCopierLeaderboardContext from './useCopierLeaderboardProvider'

export default function SearchRanking() {
  const { setKeyword } = useCopierLeaderboardContext()
  const [searchText, setSearchText] = useState('')
  const [error, setError] = useState(false)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.trim())
  }

  const handleClearSearch = () => {
    setSearchText('')
  }

  const debounceSearchText = useDebounce<string>(searchText ?? '', 300)

  useEffect(() => {
    if (!debounceSearchText) {
      setKeyword('')
      setError(false)
      return
    }
    let address = ''
    try {
      address = isAddress(debounceSearchText)
    } catch {}
    if (address) {
      setKeyword(address)
      setError(false)
    } else {
      setKeyword('')
      setError(true)
    }
  }, [debounceSearchText])

  return (
    <Box sx={{ position: 'relative' }}>
      <InputSearch
        placeholder="SEARCH TRADER RANKING"
        sx={{
          height: 'max-content',
          border: 'none',
          backgroundColor: 'transparent',
        }}
        value={searchText}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />
      {error && (
        <Type.Caption
          color="red1"
          sx={{
            position: 'absolute',
            bottom: '-2px',
            left: 0,
            right: 0,
            transform: 'translateY(100%)',
            p: 2,
            bg: 'neutral5',
            display: 'flex',
            alignItems: ['start', 'center'],
            gap: 1,
          }}
        >
          <Warning size={16} style={{ flexShrink: 0, height: '22px' }} />
          <Box as="span">Please enter a correct address</Box>
        </Type.Caption>
      )}
    </Box>
  )
}
