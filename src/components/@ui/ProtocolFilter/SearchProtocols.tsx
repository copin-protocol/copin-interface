// eslint-disable-next-line no-restricted-imports
import { Trans } from '@lingui/macro'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import { SearchResult, SearchWrapper } from './styled'
import styled from 'styled-components/macro'

import NoDataFound from 'components/@ui/NoDataFound'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useOnClickOutside from 'hooks/helpers/useOnClickOutside'
import { Button } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import { InputSearch } from 'theme/Input'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import { getChainMetadata } from 'utils/web3/chains'

export const SearchWrapper = styled<any>(Box)`
  position: relative;
`

export const SearchResult = styled<any>(Box)`
  position: absolute;
  top: 48px;
  left: 0;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.neutral6};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.neutral4};
  border-top: none;
  z-index: 4;
  max-height: 80vh;
  overflow: auto;
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

const SearchProtocols = ({
  protocols,
  onSelect,
  checkIsProtocolChecked,
  checkIsAllowedProtocol,
}: {
  protocols: ProtocolEnum[]
  onSelect?: (data: ProtocolEnum) => void
  checkIsProtocolChecked: (status: ProtocolEnum) => boolean
  checkIsAllowedProtocol: (status: ProtocolEnum) => boolean
}) => {
  const searchWrapperRef = useRef<HTMLDivElement>(null)
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const [visibleSearchResult, setVisibleSearchResult] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const trimmedSearchText = searchText.trim()

  const results = useMemo(() => {
    return (
      protocols.filter((protocol) =>
        PROTOCOL_OPTIONS_MAPPING[protocol].text.toLowerCase().includes(trimmedSearchText.toLowerCase())
      ) ?? []
    )
  }, [protocols, trimmedSearchText])

  useOnClickOutside(searchWrapperRef, () => {
    setVisibleSearchResult(false)
  })

  const handleSearchFocus = () => {
    if (trimmedSearchText.length) {
      setVisibleSearchResult(true)
    }
    setVisibleSearchResult(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    if (e.target.value.trim().length > 0) {
      setVisibleSearchResult(true)
    } else {
      setVisibleSearchResult(false)
    }
  }

  const handleClick = useCallback(
    (data?: ProtocolEnum) => {
      if (data) {
        onSelect?.(data)
      } else {
        if (results.length > 0) {
          onSelect?.(results[0])
        }
      }
      // setVisibleSearchResult(false)
    },
    [onSelect, results]
  )

  const handleSearchEnter = () => {
    if (trimmedSearchText.length === 0) return
    handleClick()
  }

  const handleClearSearch = () => {
    setSearchText('')
    setVisibleSearchResult(false)
  }

  useEffect(() => {
    if (!inputSearchRef.current) return
    inputSearchRef.current.blur()
  }, [])

  return (
    <SearchWrapper ref={searchWrapperRef} width="100%">
      <InputSearch
        ref={inputSearchRef}
        placeholder="Search protocols"
        sx={{
          padding: 2,
          width: '100%',
          height: 'max-content',
          borderColor: 'neutral5',
          borderRadius: 'xs',
        }}
        value={searchText}
        onFocus={handleSearchFocus}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
        onKeyDown={(e) => (e.key === 'Enter' ? handleSearchEnter() : undefined)}
      />
      {visibleSearchResult && (
        <SearchResult>
          {results.length > 0 && (
            <Box>
              {results.map((data) => (
                <SearchResultItems
                  key={data}
                  data={data}
                  handleClick={handleClick}
                  checkIsProtocolChecked={checkIsProtocolChecked}
                  checkIsAllowedProtocol={checkIsAllowedProtocol}
                />
              ))}
            </Box>
          )}
          {results.length === 0 && <NoDataFound message={<Trans>No Protocol Found</Trans>} />}
        </SearchResult>
      )}
    </SearchWrapper>
  )
}

export default SearchProtocols

const SearchResultItems = ({
  data,
  handleClick,
  checkIsProtocolChecked,
  checkIsAllowedProtocol,
}: {
  data: ProtocolEnum
  handleClick?: (data: ProtocolEnum) => void
  checkIsProtocolChecked: (status: ProtocolEnum) => boolean
  checkIsAllowedProtocol: (status: ProtocolEnum) => boolean
}) => {
  const protocol = PROTOCOL_OPTIONS_MAPPING[data]
  const isAllowedProtocol = checkIsAllowedProtocol(protocol.id)

  return (
    <Box
      px={3}
      py="6px"
      sx={{
        borderTop: 'small',
        borderColor: 'neutral4',
        '&:hover': {
          backgroundColor: '#292d40',
        },
      }}
    >
      <Button
        variant="ghost"
        type="button"
        onClick={() => (isAllowedProtocol ? (handleClick ? handleClick(data) : undefined) : undefined)}
        sx={{ color: 'inherit', p: 0, mx: 0 }}
        width="100%"
      >
        <Flex
          width="fit-content"
          justifyContent="center"
          sx={{
            gap: 2,
          }}
        >
          <Checkbox
            key={protocol.id}
            checked={checkIsProtocolChecked(protocol.id)}
            wrapperSx={{ height: 'auto' }}
            disabled={!isAllowedProtocol}
          />

          <ProtocolLogo protocol={data} isActive={false} hasText={false} size={32} />
          <Box>
            <Type.Caption textAlign="left" display="block" lineHeight="16px" color="neutral1">
              {protocol.text}
            </Type.Caption>
            <Type.Caption textAlign="left" display="block" lineHeight="16px" color="neutral3">
              {getChainMetadata(protocol.chainId).label}
            </Type.Caption>
          </Box>
        </Flex>
      </Button>
    </Box>
  )
}
