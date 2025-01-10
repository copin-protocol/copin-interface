import { Warning } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'

import useDebounce from 'hooks/helpers/useDebounce'
import { InputSearch } from 'theme/Input'
import { Box, Type } from 'theme/base'
import { isAddress } from 'utils/web3/contracts'

export default function SearchTrader({
  address,
  setAddress,
}: {
  address: string | undefined
  setAddress: (address: string) => void
}) {
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
      if (!!address) {
        setAddress('')
      }
      setError(false)
      return
    }
    let _address = ''
    try {
      _address = isAddress(debounceSearchText)
    } catch {}
    if (_address) {
      setAddress(_address)
      setError(false)
    } else {
      setError(true)
    }
  }, [debounceSearchText])

  return (
    <Box sx={{ position: 'relative', width: 'max-content', maxWidth: '220px' }}>
      <InputSearch
        placeholder="SEARCH TRADER"
        sx={{
          width: 'auto',
          height: 'max-content',
          border: 'none',
          borderRadius: 'xs',
          backgroundColor: 'transparent !important',
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
            zIndex: 1,
          }}
        >
          <Warning size={16} style={{ flexShrink: 0, height: '22px' }} />
          <Box as="span">Please enter a correct user address</Box>
        </Type.Caption>
      )}
    </Box>
  )
}
