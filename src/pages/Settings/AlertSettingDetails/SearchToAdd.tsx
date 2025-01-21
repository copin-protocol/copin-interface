import { Trans } from '@lingui/macro'
import { Check, Plus } from '@phosphor-icons/react'
import React, { ChangeEvent, RefObject, memo, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import TraderAddress from 'components/@ui/TraderAddress'
import { TraderData } from 'entities/trader'
import useSearchAllData from 'hooks/features/useSearchAllData'
import useIsMobile from 'hooks/helpers/useIsMobile'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import ArrowUpIcon from 'theme/Icons/ArrowUpIcon'
import EnterKeyIcon from 'theme/Icons/EnterKeyIcon'
import { InputSearch } from 'theme/Input'
import Loading from 'theme/Loading'
import RcDialog from 'theme/RcDialog'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { Z_INDEX } from 'utils/config/zIndex'
import { formatNumber } from 'utils/helpers/format'

const SearchToAdd = memo(function SearchToAddMemo({
  ignoreSelectTraders,
  onSelect,
}: {
  ignoreSelectTraders?: { account: string; protocol: ProtocolEnum }[]
  onSelect: (data: TraderData) => void
}) {
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleDismissModal = () => setOpenModal(false)

  return (
    <>
      <ButtonWithIcon size="xs" variant="outlinePrimary" icon={<Plus />} onClick={handleOpenModal}>
        <Trans>Add Trader</Trans>
      </ButtonWithIcon>
      {openModal && (
        <SearchContainer
          isOpen={openModal}
          onDismiss={handleDismissModal}
          ignoreSelectTraders={ignoreSelectTraders}
          onSelect={onSelect}
        />
      )}
    </>
  )
})

export default SearchToAdd

function SearchContainer({
  isOpen,
  onDismiss,
  placeholder = 'SEARCH ADDRESS TO ADD',
  ignoreSelectTraders = [],
  onSelect,
}: {
  isOpen: boolean
  onDismiss: () => void
  placeholder?: string
  ignoreSelectTraders?: { account: string; protocol: ProtocolEnum }[]
  onSelect: (data: TraderData) => void
}) {
  const isMobile = useIsMobile()

  const {
    searchWrapperRef,
    inputSearchRef,
    searchText,
    handleSearchFocus,
    handleSearchChange,
    handleClearSearch,
    visibleSearchResult,
    isLoading,
    searchTraders,
  } = useSearchAllData({ onSelect, returnRanking: true, allowAllProtocol: true, limit: 500 })
  // const traders = [...filterFoundData(searchTraders?.data, ignoreSelectTraders)]
  const traders = searchTraders?.data ?? []

  const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e)
  }

  const handleClickSearchItem = (data: TraderData) => {
    if (ignoreSelectTraders.find((e) => e.account === data.account && e.protocol === data.protocol)) return
    onSelect(data)
  }

  return (
    <RcDialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      offsetTop={isMobile ? '48px' : '75px'}
      offsetBottom={isMobile ? '48px' : '75px'}
      zIndex={Z_INDEX.TOASTIFY - 1} // Above all
    >
      <Box
        sx={{
          bg: 'neutral7',
        }}
      >
        <Flex p={3} sx={{ width: '100%', position: 'sticky', top: 0, left: 0, bg: 'neutral6', zIndex: 2, gap: 3 }}>
          <InputSearchComponent
            isOpen={isOpen}
            inputSearchRef={inputSearchRef}
            placeholder={placeholder}
            searchText={searchText}
            handleSearchFocus={handleSearchFocus}
            handleChangeSearchInput={handleChangeSearchInput}
            handleClearSearch={handleClearSearch}
          />
          {isMobile && (
            <Button variant="ghost" onClick={onDismiss}>
              Cancel
            </Button>
          )}
        </Flex>
        <Box display={visibleSearchResult && !!traders.length ? 'block' : 'none'}>
          <Type.Caption my={2} px={3} color="neutral3">
            Search results:{' '}
            <Type.Caption color="neutral2">
              {formatNumber(traders?.length)} trader{traders?.length > 1 ? 's' : ''}
            </Type.Caption>
          </Type.Caption>
        </Box>
        <Box overflow="hidden auto" display={visibleSearchResult ? 'block' : 'none'}>
          <Box sx={{ flex: 1, overflow: 'hidden auto' }}>
            <Box display={isLoading ? 'block' : 'none'} textAlign="center" p={4}>
              <Loading />
            </Box>
            <Box maxHeight={360} display={!isLoading ? 'block' : 'none'}>
              <SearchResult
                keyword={searchText}
                searchTraders={traders}
                ignoreSelectTraders={ignoreSelectTraders}
                onClickTraderItem={handleClickSearchItem}
                handleHideResult={onDismiss}
              />
              {!traders?.length && <NoDataFound message={<Trans>No Trader Found</Trans>} />}
            </Box>
          </Box>
        </Box>

        {!isMobile && (
          <Box sx={{ position: 'sticky', bottom: 0, left: 0, bg: 'neutral6', zIndex: 1 }}>
            <Divider />
            <NavigationHelp />
          </Box>
        )}
      </Box>
    </RcDialog>
  )
}

function InputSearchComponent({
  isOpen,
  inputSearchRef,
  placeholder,
  searchText,
  handleSearchFocus,
  handleChangeSearchInput,
  handleClearSearch,
}: {
  isOpen: boolean
  searchText: string
  inputSearchRef: RefObject<HTMLInputElement>
  placeholder: string
  handleSearchFocus: () => void
  handleChangeSearchInput: (e: ChangeEvent<HTMLInputElement>) => void
  handleClearSearch: () => void
}) {
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputSearchRef.current?.focus?.()
      }, 100)
    }
  }, [isOpen])
  return (
    <InputSearch
      ref={inputSearchRef}
      placeholder={placeholder}
      sx={{
        padding: 2,
        width: '100%',
        height: 'max-content',
        borderColor: 'neutral5',
        borderRadius: 'xs',
      }}
      value={searchText}
      onFocus={handleSearchFocus}
      onChange={handleChangeSearchInput}
      onClear={handleClearSearch}
      // onKeyDown={(e) => e.key === 'Enter' && (isTxHash ? handleSearchPositionsEnter() : handleSearchEnter())}
    />
  )
}

function SearchResult({
  keyword,
  searchTraders,
  ignoreSelectTraders,
  onClickTraderItem,
  handleHideResult,
}: {
  keyword: string
  searchTraders: TraderData[] | undefined
  ignoreSelectTraders?: { account: string; protocol: ProtocolEnum }[]
  onClickTraderItem: (data: TraderData) => void
  handleHideResult?: () => void
}) {
  const [selectedItem, setSelectedItem] = useState(-1)
  const searchResultRef = useRef<{ data: any[]; selectedIndex: number }>({
    data: [],
    selectedIndex: 0,
  })
  const handleKeyboard = useCallback((e: KeyboardEvent) => {
    if (!searchResultRef.current) return
    if (e.key === 'Enter') {
      const data = searchResultRef.current.data[searchResultRef.current.selectedIndex]
      if (data) onClickTraderItem(data)
    }
    if (e.key === 'ArrowDown') {
      setSelectedItem((prev) => (prev + 1 > searchResultRef.current.data.length - 1 ? prev : prev + 1))
    }
    if (e.key === 'ArrowUp') {
      setSelectedItem((prev) => (prev === 0 ? 0 : prev - 1))
    }
  }, [])
  useEffect(() => {
    searchResultRef.current.selectedIndex = selectedItem
    const searchTraderItemBox = document.getElementById(`search_trader_${selectedItem}`)
    if (!searchTraderItemBox) return
    searchTraderItemBox?.scrollIntoView?.({ block: 'center', inline: 'center' })
  }, [selectedItem])
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboard)
    return () => {
      window.removeEventListener('keydown', handleKeyboard)
    }
  }, [handleKeyboard])

  useEffect(() => {
    if (!searchTraders?.length) {
      setSelectedItem(-1)
      return
    }
    searchResultRef.current.data = searchTraders
  }, [searchTraders])
  return (
    <>
      {!!searchTraders?.length && (
        <Box>
          {searchTraders?.map((traderData, index) => {
            const isActive = selectedItem === index
            const isSelected = !!ignoreSelectTraders?.find(
              (e) => e.account === traderData.account && e.protocol === traderData.protocol
            )
            return (
              <Box id={`search_trader_${index}`} key={traderData.id} sx={{ bg: isActive ? 'neutral4' : 'transparent' }}>
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  role="button"
                  key={traderData.id}
                  onClick={() => onClickTraderItem(traderData)}
                  sx={{ py: '6px', px: 3, borderRadius: 'sm', '&:hover': { bg: 'neutral6' } }}
                >
                  <TraderAddress
                    address={traderData.account}
                    protocol={traderData.protocol}
                    options={{
                      isLink: false,
                      textSx: { width: 80 },
                    }}
                  />
                  <ButtonWithIcon
                    variant="ghostPrimary"
                    icon={isSelected ? <Check /> : <Plus />}
                    p={0}
                    disabled={isSelected}
                  >
                    {isSelected ? <Type.Caption>Added</Type.Caption> : <Type.Caption>Add</Type.Caption>}
                  </ButtonWithIcon>
                </Flex>
              </Box>
            )
          })}
        </Box>
      )}
    </>
  )
}

function NavigationHelp() {
  return (
    <Flex p={3} sx={{ gap: 3, flexShrink: 0, flexWrap: 'wrap' }}>
      <Flex sx={{ gap: 2, alignItems: 'center' }} color="neutral2">
        <TagContainer>
          <EnterKeyIcon />
        </TagContainer>
        <Type.Caption>TO ADD</Type.Caption>
      </Flex>
      <Flex sx={{ gap: 2, alignItems: 'center' }} color="neutral2">
        <Flex sx={{ gap: 1 }}>
          <TagContainer>
            <ArrowUpIcon />
          </TagContainer>
          <TagContainer sx={{ transform: 'rotate(180deg)' }}>
            <ArrowUpIcon />
          </TagContainer>
        </Flex>
        <Type.Caption>TO NAVIGATE</Type.Caption>
      </Flex>
      <Flex sx={{ gap: 2, alignItems: 'center' }} color="neutral2">
        <TagContainer>
          <Type.Caption>ESC</Type.Caption>
        </TagContainer>
        <Type.Caption>TO EXIT</Type.Caption>
      </Flex>
    </Flex>
  )
}
const TagContainer = styled(Flex)`
  height: 24px;
  align-items: center;
  justify-content: center;
  padding: 0px 4px;
  background: ${({ theme }) => theme.colors.neutral4};
  border-radius: 2px;
`
