import { Trans } from '@lingui/macro'
import { ArrowLeft } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import InputSearchText from 'components/@ui/InputSearchText'
import NoDataFound from 'components/@ui/NoDataFound'
import SearchToAdd from 'pages/Settings/AlertSettingDetails/SearchToAdd'
import Badge from 'theme/Badge'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import { PaginationWithSelect } from 'theme/Pagination'
import Popconfirm from 'theme/Popconfirm'
import Table from 'theme/Table'
import { Box, Flex, Type } from 'theme/base'
import { AlertCustomType } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'

import BasicInfoModal from '../BasicInfoModal'
import MobileTraderItem from './MobileTraderItem'
import { TraderGroupFooterProps, TraderGroupHeaderProps, TraderGroupListProps, TraderGroupSearchProps } from './types'

/**
 * Header component with back button and title
 */
export const TraderGroupHeader = ({
  isNew,
  name,
  totalTrader,
  maxTraderAlert,
  hasChange,
  onBack,
}: TraderGroupHeaderProps) => {
  return (
    <Flex flex={1} px={3} py={2} alignItems="center" justifyContent="space-between" flexWrap="wrap" sx={{ gap: 2 }}>
      <Flex alignItems="center" sx={{ gap: 2 }}>
        {hasChange ? (
          <Popconfirm
            action={<IconButton icon={<ArrowLeft size={20} />} variant="ghost" size={20} sx={{ p: 0 }}></IconButton>}
            title="Discard changes?"
            description="You have unsaved changes. Are you sure to discard them?"
            onConfirm={onBack}
            cancelAfterHide={false}
            confirmButtonProps={{ variant: 'ghostDanger' }}
          />
        ) : (
          <IconButton
            icon={<ArrowLeft size={20} />}
            variant="ghost"
            size={20}
            onClick={onBack}
            sx={{ p: 0 }}
          ></IconButton>
        )}
      </Flex>
      <Flex alignItems="center" sx={{ gap: 2 }}>
        <Type.Body>{isNew ? 'TRADER GROUP' : name}</Type.Body>
        <Badge count={`${totalTrader}/${maxTraderAlert}`} />
      </Flex>
      <Box width={20} />
    </Flex>
  )
}

/**
 * Search section with add trader functionality
 */
export const TraderGroupSearch = ({
  totalTrader,
  maxTraderAlert,
  isVIPUser,
  ignoreSelectTraders,
  searchText,
  setSearchText,
  onAddWatchlist,
  onRemoveWatchlist,
}: TraderGroupSearchProps) => {
  return (
    <Flex alignItems="center" sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
      <Flex sx={{ pl: 1, width: 200, borderRight: 'small', borderColor: 'neutral4' }}>
        <InputSearchText
          placeholder="SEARCH TRADER"
          sx={{
            width: '100%',
            height: 'max-content',
            border: 'none',
            borderRadius: 'xs',
            backgroundColor: 'transparent !important',
          }}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </Flex>
      <Flex flex={1} justifyContent="flex-end" sx={{ pr: 3, gap: 2 }}>
        {totalTrader < (maxTraderAlert ?? 0) && (
          <SearchToAdd
            ignoreSelectTraders={ignoreSelectTraders}
            onSelect={onAddWatchlist}
            onRemove={onRemoveWatchlist}
          />
        )}
        {!isVIPUser && totalTrader >= (maxTraderAlert ?? 0) && (
          <Link to={ROUTES.SUBSCRIPTION.path}>
            <Button size="xs" variant="outlinePrimary">
              <Trans>Upgrade</Trans>
            </Button>
          </Link>
        )}
      </Flex>
    </Flex>
  )
}

/**
 * Trader list component - handles both mobile and desktop views
 */
export const TraderGroupList = ({
  isMobile,
  paginatedTraders,
  columns,
  onUpdateWatchlist,
  onRemoveWatchlist,
}: TraderGroupListProps) => {
  if (!paginatedTraders?.data?.length) {
    return (
      <Flex flex={1} flexDirection="column">
        <NoDataFound />
      </Flex>
    )
  }

  return (
    <Flex
      flex={1}
      flexDirection="column"
      sx={{ overflow: 'auto', maxHeight: isMobile ? 'max-content' : 'calc(100vh - 280px)' }}
    >
      {isMobile ? (
        <Flex pt={2} flexDirection="column" sx={{ gap: 2, overflow: 'auto' }}>
          {paginatedTraders.data.length > 0 &&
            paginatedTraders.data.map((data) => (
              <MobileTraderItem
                key={`${data.address}-${data.protocol}`}
                data={data}
                onUpdateWatchlist={onUpdateWatchlist}
                onRemoveWatchlist={onRemoveWatchlist}
              />
            ))}
          {!paginatedTraders.data.length && <NoDataFound message={<Trans>No Trader Found</Trans>} />}
        </Flex>
      ) : (
        <Table
          data={paginatedTraders?.data}
          columns={columns}
          isLoading={false}
          tableHeadSx={{
            '& th': {
              py: 2,
            },
          }}
          wrapperSx={{
            table: {
              '& th:first-child, td:first-child': {
                pl: 3,
              },
              '& th:last-child, td:last-child': {
                pr: 3,
              },
            },
          }}
        />
      )}
    </Flex>
  )
}

/**
 * Footer component with pagination and action buttons
 */
export const TraderGroupFooter = ({
  currentPage,
  setCurrentPage,
  filteredTraders,
  paginatedTraders,
  hasChange,
  handleReset,
  handleApply,
  submitting,
  isNew,
  traderGroupAdd,
  traderGroupUpdate,
  traderGroupRemove,
}: TraderGroupFooterProps) => {
  const [openModal, setOpenModal] = useState(false)

  const onSubmit = () => {
    if (isNew) {
      setOpenModal(true)
    } else {
      handleApply()
    }
  }

  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="space-between"
      sx={{ borderTop: 'small', borderColor: 'neutral4' }}
    >
      {filteredTraders.length > 0 ? (
        <PaginationWithSelect
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          apiMeta={paginatedTraders?.meta}
          sx={{
            py: 1,
            px: 2,
          }}
        />
      ) : (
        <Box />
      )}
      <Flex justifyContent="flex-end" sx={{ gap: 2 }}>
        <Button variant="ghost" onClick={handleReset} disabled={!hasChange || submitting}>
          <Trans>Reset</Trans>
        </Button>
        <Button variant="ghostPrimary" onClick={onSubmit} isLoading={submitting} disabled={!hasChange || submitting}>
          <Trans>Save</Trans>
        </Button>
      </Flex>
      {openModal && (
        <BasicInfoModal
          isOpen
          defaultValues={{
            traderGroupAdd,
            traderGroupUpdate,
            traderGroupRemove,
            customType: AlertCustomType.TRADER_GROUP,
          }}
          submitting={submitting}
          onSubmit={handleApply}
          onDismiss={() => setOpenModal(false)}
        />
      )}
    </Flex>
  )
}
