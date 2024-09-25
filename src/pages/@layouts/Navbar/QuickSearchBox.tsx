import { Trans } from '@lingui/macro'
import { CaretDown, MagnifyingGlass } from '@phosphor-icons/react'
import { ChangeEvent, MouseEventHandler, RefObject, memo, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import ProtocolSelection from 'components/@ui/ProtocolFilter/ProtocolSelection'
import ProtocolGroup from 'components/@ui/ProtocolGroup'
import SearchPositionResultItem from 'components/@widgets/SearchPositionResultItem'
import SearchTraderResultItems from 'components/@widgets/SearchTraderResultItem'
import { PositionData, TraderData } from 'entities/trader'
import useInternalRole from 'hooks/features/useInternalRole'
import useSearchAllData from 'hooks/features/useSearchAllData'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useIsMobile from 'hooks/helpers/useIsMobile'
import { useSearchProtocolFilter } from 'hooks/store/useSearchProtocolFilter'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import ArrowUpIcon from 'theme/Icons/ArrowUpIcon'
import CommandIcon from 'theme/Icons/CommandIcon'
import EnterKeyIcon from 'theme/Icons/EnterKeyIcon'
import { InputSearch } from 'theme/Input'
import Loading from 'theme/Loading'
import RcDialog from 'theme/RcDialog'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ALLOWED_COPYTRADE_PROTOCOLS, SEARCH_DEFAULT_LIMIT } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

const QuickSearchBox = memo(function QuickSearchBoxMemo() {
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleDismissModal = () => setOpenModal(false)

  const keyDownHandler = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      setOpenModal((prev) => !prev)
    }
  }, [])
  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler)
    return () => window.removeEventListener('keydown', keyDownHandler)
  }, [keyDownHandler])
  const isMobile = useIsMobile()
  return (
    <>
      {isMobile ? (
        <IconButton variant="ghost" icon={<MagnifyingGlass size={24} />} onClick={handleOpenModal} />
      ) : (
        <Flex
          role="button"
          onClick={handleOpenModal}
          sx={{
            alignItems: 'center',
            height: '40px',
            px: 2,
            bg: 'neutral5',
            borderRadius: '4px',
            '& *': { transition: '0.3s' },
            '&:hover': { bg: 'neutral4', '.glass': { color: 'neutral1' }, '.text': { color: 'neutral2' } },
            gap: 1,
          }}
        >
          <IconBox icon={<MagnifyingGlass size={20} className="glass" />} color="neutral2 " />
          <Type.Caption className="text" color="neutral3">
            Search
          </Type.Caption>
          <Box className="text" color="neutral3">
            (
            <IconBox icon={<CommandIcon className="text" />} color="neutral3" />
            <Type.Caption className="text" color="neutral3">
              +K
            </Type.Caption>
            )
          </Box>
        </Flex>
      )}
      <QuickSearchContainer isOpen={openModal} onDismiss={handleDismissModal} />
    </>
  )
})

export default QuickSearchBox

function QuickSearchContainer({
  isOpen,
  onDismiss,
  placeholder = 'Search trader wallet address, smart account or transaction',
  onSelect,
  returnRanking = false,
  allowAllProtocol = true,
  allowSearchPositions = true,
}: {
  isOpen: boolean
  onDismiss: () => void
  placeholder?: string
  onSelect?: (data: TraderData) => void
  returnRanking?: boolean
  allowAllProtocol?: boolean
  allowSearchPositions?: boolean
  maxWidth?: string | number
}) {
  const isMobile = useIsMobile()
  const [openSelectProtocols, setOpenSelectProtocols] = useState(false)
  const handleToggleSelectProtocols = () => setOpenSelectProtocols((prev) => !prev)

  const isInternal = useInternalRole()
  const protocolOptions = useGetProtocolOptions()
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS

  const {
    selectedProtocols,
    checkIsSelected: checkIsProtocolChecked,
    handleToggle: handleToggleProtocol,
    setSelectedProtocols,
  } = useSearchProtocolFilter({ defaultSelects: protocolOptions.map((_p) => _p.id) })
  const {
    inputSearchRef,
    searchText,
    handleSearchFocus,
    handleSearchChange,
    handleClearSearch,
    handleClickViewAll,
    visibleSearchResult,
    isLoading,
    searchTraders,
    searchPositions,
    handleClick,
    handleClickPosition,
    isTxHash,
  } = useSearchAllData({
    onSelect,
    returnRanking,
    allowAllProtocol,
    allowSearchPositions,
    protocols: selectedProtocols,
  })

  const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setOpenSelectProtocols(false)
    handleSearchChange(e)
  }
  const handleClickViewAllResult: MouseEventHandler = (e) => {
    e.stopPropagation()
    handleClickViewAll(true)
    setOpenSelectProtocols(false)
    onDismiss()
  }
  const handleClickSearchItem = (data: TraderData) => {
    handleClick(data)
    onDismiss()
  }
  const handleClickSearchPositionItem = (data: PositionData) => {
    handleClickPosition(data)
    onDismiss()
  }

  const totalResultTraders = searchTraders?.meta?.total ?? 0
  const totalResultPositions = searchPositions?.length ?? 0

  const totalResult = isTxHash ? totalResultPositions : totalResultTraders
  const showViewAllResultText = isTxHash
    ? false
    : totalResultTraders > (searchTraders?.data?.length ?? 0)
    ? true
    : false

  useEffect(() => {
    if (isOpen) {
      inputSearchRef.current?.focus?.()
    }
  }, [isOpen])

  return (
    <RcDialog isOpen={isOpen} onDismiss={onDismiss} offsetBottom={isMobile ? '48px' : '100px'}>
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
            selectedProtocols={selectedProtocols}
            handleToggleSelectProtocols={handleToggleSelectProtocols}
          />
          {isMobile && (
            <Button variant="ghost" onClick={onDismiss}>
              Cancel
            </Button>
          )}
        </Flex>
        <Box
          display={openSelectProtocols ? 'block' : 'none'}
          sx={{ flex: 1, overflow: 'hidden auto', position: 'relative', zIndex: 1 }}
        >
          <ProtocolSelection
            selectedProtocols={selectedProtocols}
            setSelectedProtocols={setSelectedProtocols}
            checkIsProtocolChecked={checkIsProtocolChecked}
            handleToggleProtocol={handleToggleProtocol}
            allowList={allowList}
            hasSearch={false}
          />
        </Box>

        <Box overflow="hidden auto" display={visibleSearchResult && !openSelectProtocols ? 'block' : 'none'}>
          <Type.Caption mb={3} px={3} color="neutral3">
            {isTxHash ? 'Position' : 'Trader'} search results{' '}
            {showViewAllResultText ? (
              <>
                (
                <Box
                  as="span"
                  role="button"
                  onClick={handleClickViewAllResult}
                  sx={{ color: 'primary1', '&:hover': { color: 'primary2' } }}
                >
                  View all {formatNumber(totalResult, 0, 0)} results
                </Box>
                )
              </>
            ) : (
              <Box as="span">
                {isTxHash
                  ? totalResultPositions
                    ? `(${formatNumber(totalResultPositions, 0, 0)})`
                    : ''
                  : searchTraders?.data?.length
                  ? `(${formatNumber(searchTraders.data.length, 0, 0)})`
                  : ''}
              </Box>
            )}
          </Type.Caption>
          <Box sx={{ flex: 1, overflow: 'hidden auto' }}>
            <Box display={isLoading ? 'block' : 'none'} textAlign="center" p={4}>
              <Loading />
            </Box>
            <Box display={!isLoading && selectedProtocols?.length ? 'block' : 'none'}>
              <SearchResult
                keyword={searchText}
                isTxHash={isTxHash}
                searchTraders={searchTraders?.data}
                searchPositions={searchPositions}
                onClickTraderItem={handleClickSearchItem}
                onClickPositionItem={handleClickSearchPositionItem}
                handleHideResult={onDismiss}
              />
            </Box>
            {!isLoading && !selectedProtocols?.length && isTxHash && (
              <NoDataFound message={<Trans>No Transaction Found</Trans>} />
            )}
            {!isLoading && !selectedProtocols?.length && !isTxHash && (
              <NoDataFound message={<Trans>No Trader Found</Trans>} />
            )}
          </Box>
        </Box>

        {!isMobile && (
          <Box sx={{ position: 'sticky', bottom: 0, left: 0, bg: 'neutral6' }}>
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
  selectedProtocols,
  handleToggleSelectProtocols,
}: {
  isOpen: boolean
  searchText: string
  inputSearchRef: RefObject<HTMLInputElement>
  placeholder: string
  handleSearchFocus: () => void
  handleChangeSearchInput: (e: ChangeEvent<HTMLInputElement>) => void
  handleClearSearch: () => void
  selectedProtocols: ProtocolEnum[]
  handleToggleSelectProtocols: () => void
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
      suffix={<SelectProtocolsButton selectedProtocols={selectedProtocols} onClick={handleToggleSelectProtocols} />}
    />
  )
}

function SearchResult({
  keyword,
  isTxHash,
  searchTraders,
  searchPositions,
  onClickTraderItem,
  onClickPositionItem,
  handleHideResult,
}: {
  keyword: string
  isTxHash: boolean
  searchTraders: TraderData[] | undefined
  searchPositions: PositionData[] | undefined
  onClickTraderItem: (data: TraderData) => void
  onClickPositionItem: (data: PositionData) => void
  handleHideResult?: () => void
}) {
  const [selectedItem, setSelectedItem] = useState(-1)
  const searchResultRef = useRef<{ data: any[]; isTxHash: boolean; selectedIndex: number }>({
    data: [],
    isTxHash: false,
    selectedIndex: 0,
  })
  const handleKeyboard = useCallback((e: KeyboardEvent) => {
    if (!searchResultRef.current) return
    if (e.key === 'Enter') {
      const data = searchResultRef.current.data[searchResultRef.current.selectedIndex]
      if (searchResultRef.current.isTxHash && data) onClickPositionItem(data)
      if (!searchResultRef.current.isTxHash && data) onClickTraderItem(data)
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
    const searchPositionItemBox = document.getElementById(`search_position_${selectedItem}`)
    if (!searchTraderItemBox && !searchPositionItemBox) return
    searchTraderItemBox?.scrollIntoView?.({ block: 'center', inline: 'center' })
    searchPositionItemBox?.scrollIntoView?.({ block: 'center', inline: 'center' })
  }, [selectedItem])
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboard)
    return () => {
      window.removeEventListener('keydown', handleKeyboard)
    }
  }, [handleKeyboard])
  useEffect(() => {
    if (!searchPositions?.length && !searchTraders?.length) {
      setSelectedItem(-1)
      return
    }
    searchResultRef.current.data = isTxHash ? searchPositions ?? [] : searchTraders ?? []
    searchResultRef.current.isTxHash = isTxHash
  }, [isTxHash, searchTraders, searchPositions])
  return (
    <>
      {!isTxHash && (searchTraders?.length ?? 0) > 0 && (
        <Box>
          {searchTraders?.map((userData, index) => {
            const isActive = selectedItem === index
            return (
              <Box id={`search_trader_${index}`} key={userData.id} sx={{ bg: isActive ? 'neutral4' : 'transparent' }}>
                <SearchTraderResultItems
                  keyword={keyword}
                  data={userData}
                  hasBorder={index !== 0}
                  handleClick={handleHideResult}
                />
              </Box>
            )
          })}
        </Box>
      )}
      {isTxHash && (searchPositions?.length ?? 0) > 0 && (
        <Box>
          {searchPositions?.slice(0, SEARCH_DEFAULT_LIMIT)?.map((positionData, index) => {
            const isActive = selectedItem === index
            return (
              <Box
                id={`search_position_${index}`}
                key={positionData.id}
                sx={{ bg: isActive ? 'neutral4' : 'transparent' }}
              >
                <SearchPositionResultItem data={positionData} handleClick={handleHideResult} keyword={keyword} />
              </Box>
            )
          })}
        </Box>
      )}
      {!isTxHash && searchTraders?.length === 0 && <NoDataFound message={<Trans>No Trader Found</Trans>} />}
      {isTxHash && searchPositions?.length === 0 && <NoDataFound message={<Trans>No Transaction Found</Trans>} />}
    </>
  )
}

function SelectProtocolsButton({
  selectedProtocols,
  onClick,
}: {
  selectedProtocols: ProtocolEnum[]
  onClick: () => void
}) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      sx={{
        color: 'neutral3',
        bg: 'neutral6',
        width: 'max-content',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        height: 28,
        p: 0,
        px: 2,
        mx: 2,
        gap: 1,
      }}
    >
      {selectedProtocols?.length ? (
        <>
          <ProtocolGroup protocols={selectedProtocols} size={20} />
          <CaretDown size={16} />
        </>
      ) : (
        'Select protocol'
      )}
    </Button>
  )
}

function NavigationHelp() {
  return (
    <Flex p={3} sx={{ gap: 3, flexShrink: 0, flexWrap: 'wrap' }}>
      <Flex sx={{ gap: 2 }} color="neutral2">
        <TagContainer>
          <CommandIcon />
          <Type.Caption>K</Type.Caption>
        </TagContainer>
        <Type.Caption>To open search</Type.Caption>
      </Flex>
      <Flex sx={{ gap: 2 }} color="neutral2">
        <TagContainer>
          <EnterKeyIcon />
        </TagContainer>
        <Type.Caption>To enter</Type.Caption>
      </Flex>
      <Flex sx={{ gap: 2 }} color="neutral2">
        <Flex sx={{ gap: 1 }}>
          <TagContainer>
            <ArrowUpIcon />
          </TagContainer>
          <TagContainer sx={{ transform: 'rotate(180deg)' }}>
            <ArrowUpIcon />
          </TagContainer>
        </Flex>
        <Type.Caption>To navigate</Type.Caption>
      </Flex>
      <Flex sx={{ gap: 2 }} color="neutral2">
        <TagContainer>
          <Type.Caption>ESC</Type.Caption>
        </TagContainer>
        <Type.Caption>To exit</Type.Caption>
      </Flex>
    </Flex>
  )
}
const TagContainer = styled(Flex)`
  height: 24px;
  align-items: center;
  justify-content: center;
  padding: 0px 4px;
  background: ${({ theme }) => theme.colors.neutral3};
  border-radius: 2px;
`
