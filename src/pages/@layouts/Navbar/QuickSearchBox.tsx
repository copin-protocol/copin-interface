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
import { Z_INDEX } from 'utils/config/zIndex'
import { formatNumber } from 'utils/helpers/format'

const QuickSearchBox = memo(function QuickSearchBoxMemo() {
  const [openModal, setOpenModal] = useState(false)
  const [searchTextRef, setSearchTextRef] = useState('')
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
            height: '100%',
            px: 3,
            bg: 'transparent',
            borderLeft: 'small',
            borderColor: 'neutral4',
            // borderRadius: '4px',
            '& *': { transition: '0.3s' },
            '&:hover': { bg: 'neutral5', '.glass': { color: 'neutral1' }, '.text': { color: 'neutral2' } },
            gap: 1,
          }}
        >
          <IconBox icon={<MagnifyingGlass size={16} className="glass" />} color="neutral2 " />
          <Type.Caption className="text" color="neutral3" ml="4px" display={['none', 'inline-block']}>
            {searchTextRef ? (
              <Box as="span" color="neutral1">
                {searchTextRef.length > 3 ? `${searchTextRef.substring(0, 3)}...` : searchTextRef}
              </Box>
            ) : (
              'SEARCH'
            )}
          </Type.Caption>
          <Box
            display={['none', 'block']}
            className="text"
            color="neutral3"
            sx={{
              '* > svg': {
                position: 'relative',
                top: '-0.5px',
                transition: '0s',
              },
              display: ['none', 'block'],
            }}
          >
            <Box
              sx={{
                ml: 1,
                bg: 'neutral4',
                px: 1,
              }}
            >
              <IconBox icon={<CommandIcon className="text" size={14} />} color="neutral2" />
              <Type.Caption className="text" color="neutral2">
                K
              </Type.Caption>
            </Box>
          </Box>
        </Flex>
      )}
      <QuickSearchContainer isOpen={openModal} onDismiss={handleDismissModal} setSearchTextRef={setSearchTextRef} />
    </>
  )
})

export default QuickSearchBox

function QuickSearchContainer({
  isOpen,
  onDismiss,
  placeholder = 'SEARCH ADDRESS OR TRANSACTION',
  onSelect,
  returnRanking = false,
  allowAllProtocol = true,
  allowSearchPositions = true,
  setSearchTextRef,
}: {
  isOpen: boolean
  onDismiss: () => void
  placeholder?: string
  onSelect?: (data: TraderData) => void
  returnRanking?: boolean
  allowAllProtocol?: boolean
  allowSearchPositions?: boolean
  maxWidth?: string | number
  setSearchTextRef?: (keyword: string) => void
}) {
  const isMobile = useIsMobile()
  const [openSelectProtocols, setOpenSelectProtocols] = useState(false)
  const handleToggleSelectProtocols = () => setOpenSelectProtocols((prev) => !prev)

  const isInternal = useInternalRole()
  const protocolOptions = useGetProtocolOptions()
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS

  const {
    protocolSortBy,
    setProtocolSortBy,
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
    searchHLTrader,
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

  const totalResultTraders =
    (searchTraders?.meta?.total ?? 0) +
    (searchHLTrader &&
    !searchTraders?.data?.find(
      (t) => t.account.toLowerCase() === searchHLTrader.account.toLowerCase() && t.protocol === ProtocolEnum.HYPERLIQUID
    )
      ? 1
      : 0)
  const totalResultPositions = searchPositions?.length ?? 0

  const totalResult = isTxHash ? totalResultPositions : totalResultTraders
  const showViewAllResultText = isTxHash ? false : totalResultTraders > (searchTraders?.data?.length ?? 0)

  useEffect(() => {
    if (isOpen) {
      inputSearchRef.current?.focus?.()
    }
    if (!isOpen) {
      setSearchTextRef?.(searchText)
    }
  }, [isOpen])

  return (
    <RcDialog
      isOpen={isOpen}
      onDismiss={onDismiss}
      offsetTop={isMobile ? '48px' : '75px'}
      offsetBottom={isMobile ? '48px' : '75px'}
      zIndex={Z_INDEX.TOASTIFY} // Above all
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
            handleToggleDropdown={handleToggleSelectProtocols}
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
                  : totalResultTraders
                  ? `(${formatNumber(totalResultTraders, 0, 0)})`
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
                searchHLTrader={searchHLTrader}
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
  searchHLTrader,
  searchPositions,
  onClickTraderItem,
  onClickPositionItem,
  handleHideResult,
}: {
  keyword: string
  isTxHash: boolean
  searchTraders: TraderData[] | undefined
  searchHLTrader: TraderData | undefined
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
  let traders: TraderData[] = []
  if (
    searchHLTrader &&
    !searchTraders?.find(
      (t) => t.account.toLowerCase() === searchHLTrader.account.toLowerCase() && t.protocol === ProtocolEnum.HYPERLIQUID
    )
  ) {
    traders = [searchHLTrader, ...(searchTraders ?? [])]
  } else {
    traders = searchTraders || []
  }

  useEffect(() => {
    if (!searchPositions?.length && !searchTraders?.length && !searchHLTrader) {
      setSelectedItem(-1)
      return
    }
    searchResultRef.current.data = isTxHash ? searchPositions ?? [] : traders
    searchResultRef.current.isTxHash = isTxHash
  }, [isTxHash, searchPositions, traders])
  return (
    <>
      {!isTxHash && (traders?.length ?? 0) > 0 && (
        <Box>
          {traders?.map((userData, index) => {
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
      {!isTxHash && traders?.length === 0 && <NoDataFound message={<Trans>No Trader Found</Trans>} />}
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
        width: 'max-content',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        height: 28,
        p: 0,
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
      <Flex sx={{ gap: 2, alignItems: 'center' }} color="neutral2">
        <TagContainer>
          <CommandIcon />
          <Type.Caption>K</Type.Caption>
        </TagContainer>
        <Type.Caption>TO OPEN SEARCH</Type.Caption>
      </Flex>
      <Flex sx={{ gap: 2, alignItems: 'center' }} color="neutral2">
        <TagContainer>
          <EnterKeyIcon />
        </TagContainer>
        <Type.Caption>TO ENTER</Type.Caption>
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
