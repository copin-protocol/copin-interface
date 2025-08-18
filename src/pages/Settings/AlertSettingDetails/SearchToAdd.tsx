import { Trans } from '@lingui/macro'
import { Plus, Trash } from '@phosphor-icons/react'
import React, { ChangeEvent, RefObject, memo, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components/macro'

import UpgradeButton from 'components/@subscription/UpgradeButton'
import UpgradeModal from 'components/@subscription/UpgradeModal'
import { AccountInfo } from 'components/@ui/AccountInfo'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import { LastTrade, TotalPnL, TotalVolume } from 'components/@widgets/SearchTraderResultItem'
import { TraderData } from 'entities/trader'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import useSearchAllData from 'hooks/features/trader/useSearchAllData'
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
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

const SearchToAdd = memo(function SearchToAddMemo({
  totalTrader,
  maxTraderAlert,
  ignoreSelectTraders,
  onSelect,
  onRemove,
}: {
  totalTrader: number
  maxTraderAlert: number
  ignoreSelectTraders?: { account: string; protocol: ProtocolEnum }[]
  onSelect: (data: TraderData) => void
  onRemove?: (data: TraderData) => void
}) {
  const { maxWatchedListQuota } = useAlertPermission()
  const [openModal, setOpenModal] = useState(false)
  const [openLimitModal, setOpenLimitModal] = useState(false)

  const handleOpenLimitModal = () => setOpenLimitModal(true)
  const handleDismissLimitModal = () => setOpenLimitModal(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleDismissModal = () => setOpenModal(false)

  return (
    <>
      <ButtonWithIcon
        size="xs"
        variant="outlinePrimary"
        icon={<Plus />}
        onClick={totalTrader >= maxTraderAlert ? handleOpenLimitModal : handleOpenModal}
      >
        <Trans>Add Trader</Trans>
      </ButtonWithIcon>
      {openLimitModal && (
        <UpgradeModal
          isOpen={openLimitModal}
          onDismiss={handleDismissLimitModal}
          title={<Trans>YOU’VE HIT YOUR WATCHLIST TRADERS LIMIT</Trans>}
          description={
            <Trans>
              You’re reach the maximum of Trader in watchlist for your current plan. Upgrade your plan to unlock access
              up to <b>{formatNumber(maxWatchedListQuota)} traders</b>
            </Trans>
          }
        />
      )}
      {openModal && (
        <SearchContainer
          isOpen={openModal}
          onDismiss={handleDismissModal}
          ignoreSelectTraders={ignoreSelectTraders}
          onSelect={onSelect}
          onRemove={onRemove}
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
  onRemove,
}: {
  isOpen: boolean
  onDismiss: () => void
  placeholder?: string
  ignoreSelectTraders?: { account: string; protocol: ProtocolEnum }[]
  onSelect: (data: TraderData) => void
  onRemove?: (data: TraderData) => void
}) {
  const { releasedProtocols } = useProtocolPermission()
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
    searchHLTrader,
  } = useSearchAllData({
    onSelect,
    protocols: releasedProtocols,
    returnRanking: true,
    allowAllProtocol: false,
    limit: 500,
  })
  // const traders = [...filterFoundData(searchTraders?.data, ignoreSelectTraders)]
  let traders: TraderData[]
  if (
    searchHLTrader &&
    !searchTraders?.data?.find(
      (t) => t.account.toLowerCase() === searchHLTrader.account.toLowerCase() && t.protocol === ProtocolEnum.HYPERLIQUID
    )
  ) {
    traders = [searchHLTrader, ...(searchTraders?.data ?? [])]
  } else {
    traders = searchTraders?.data ?? []
  }

  const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e)
  }

  const handleClickSearchItem = (data: TraderData) => {
    if (ignoreSelectTraders.find((e) => e.account === data.account && e.protocol === data.protocol)) return
    onSelect(data)
  }

  const handleRemoveSearchItem = (data: TraderData) => {
    if (!onRemove || !ignoreSelectTraders.find((e) => e.account === data.account && e.protocol === data.protocol))
      return
    onRemove(data)
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
                onRemoveTraderItem={handleRemoveSearchItem}
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
  onRemoveTraderItem,
  handleHideResult,
}: {
  keyword: string
  searchTraders: TraderData[] | undefined
  ignoreSelectTraders?: { account: string; protocol: ProtocolEnum }[]
  onClickTraderItem: (data: TraderData) => void
  onRemoveTraderItem?: (data: TraderData) => void
  handleHideResult?: () => void
}) {
  const { allowedSelectProtocols, pagePermission } = useProtocolPermission()
  const [selectedItem, setSelectedItem] = useState(-1)
  const searchResultRef = useRef<{ data: any[]; selectedIndex: number }>({
    data: [],
    selectedIndex: 0,
  })

  const handleKeyboard = useCallback(
    (e: KeyboardEvent) => {
      if (!searchResultRef.current) return
      if (e.key === 'Enter') {
        const data = searchResultRef.current.data[searchResultRef.current.selectedIndex]
        if (data) {
          if (!allowedSelectProtocols?.includes(data.protocol)) return
          if (ignoreSelectTraders?.find((e) => e.account === data.account && e.protocol === data.protocol)) {
            onRemoveTraderItem?.(data)
          } else {
            onClickTraderItem(data)
          }
        }
      }
      if (e.key === 'ArrowDown') {
        setSelectedItem((prev) => (prev + 1 > searchResultRef.current.data.length - 1 ? prev : prev + 1))
      }
      if (e.key === 'ArrowUp') {
        setSelectedItem((prev) => (prev === 0 ? 0 : prev - 1))
      }
    },
    [ignoreSelectTraders, onClickTraderItem, onRemoveTraderItem]
  )
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
            const isAllowed = allowedSelectProtocols?.includes(traderData.protocol)
            const isActive = selectedItem === index
            const isSelected = !!ignoreSelectTraders?.find(
              (e) => e.account === traderData.account && e.protocol === traderData.protocol
            )
            const requiredPlanToProtocol = getRequiredPlan({
              conditionFn: (plan) =>
                (traderData.protocol && pagePermission?.[plan]?.protocolAllowed?.includes(traderData.protocol)) ||
                false,
            })
            return (
              <Box id={`search_trader_${index}`} key={traderData.id} sx={{ bg: isActive ? 'neutral4' : 'transparent' }}>
                <Box
                  role="button"
                  key={traderData.id}
                  onClick={() =>
                    !isAllowed
                      ? undefined
                      : isSelected
                      ? onRemoveTraderItem?.(traderData)
                      : onClickTraderItem(traderData)
                  }
                  sx={{
                    pt: 2,
                    pb: 1,
                    px: 3,
                    borderRadius: 'sm',
                    '&:hover': { bg: 'neutral6' },
                    borderTop: 'small',
                    borderColor: 'neutral5',
                  }}
                >
                  <Flex alignItems="center" justifyContent="space-between">
                    <AccountInfo
                      address={traderData.account}
                      protocol={traderData.protocol}
                      textSx={{ width: 'fit-content' }}
                      hasLink={false}
                      avatarSize={24}
                    />
                    {!!traderData.lastTradeAt && <LastTrade value={traderData.lastTradeAt} sx={{ flexShrink: 0 }} />}
                  </Flex>
                  <Flex mt={1} alignItems="center" justifyContent="space-between">
                    <Flex color="neutral2" sx={{ gap: 1 }}>
                      <TotalPnL
                        value={traderData.pnl}
                        sx={{ flex: ['0 0 130px', '0 0 170px'], flexDirection: ['column', 'row'] }}
                      />
                      <TotalVolume
                        value={traderData.totalVolume}
                        sx={{ flex: ['0 0 130px', '0 0 180px'], flexDirection: ['column', 'row'] }}
                      />
                      {/* <LastTrade value={data.lastTradeAt} sx={{ display: ['none', 'none', 'flex'], flex: '0 0 180px' }} /> */}
                    </Flex>
                    {isAllowed ? (
                      <ButtonWithIcon
                        variant={isSelected ? 'ghostDanger' : 'ghostPrimary'}
                        icon={isSelected ? <Trash /> : <Plus />}
                        p={0}
                      >
                        {isSelected ? (
                          <Type.Caption>
                            <Trans>Remove</Trans>
                          </Type.Caption>
                        ) : (
                          <Type.Caption>
                            <Trans>Add</Trans>
                          </Type.Caption>
                        )}
                      </ButtonWithIcon>
                    ) : (
                      <UpgradeButton
                        requiredPlan={requiredPlanToProtocol}
                        text={
                          <Type.Caption>
                            <Trans>Upgrade To Add</Trans>
                          </Type.Caption>
                        }
                        buttonSx={{ mr: 0 }}
                      />
                    )}
                  </Flex>
                </Box>
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
