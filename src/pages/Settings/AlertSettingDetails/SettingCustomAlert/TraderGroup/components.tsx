import { Trans } from '@lingui/macro'
import { ArrowLeft, ArrowSquareOut } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import UpgradeButton from 'components/@subscription/UpgradeButton'
import BadgeWithLimit from 'components/@ui/BadgeWithLimit'
import InputSearchText from 'components/@ui/InputSearchText'
import NoDataFound from 'components/@ui/NoDataFound'
import useAlertPermission from 'hooks/features/subscription/useAlertPermission'
import { useIsElite } from 'hooks/features/subscription/useSubscriptionRestrict'
import SearchToAdd from 'pages/Settings/AlertSettingDetails/SearchToAdd'
import { Button } from 'theme/Buttons'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
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
  const { userWatchlistNextPlan } = useAlertPermission()
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
        <BadgeWithLimit
          total={totalTrader}
          limit={maxTraderAlert}
          tooltipContent={
            userWatchlistNextPlan && (
              <PlanUpgradePrompt
                requiredPlan={userWatchlistNextPlan}
                title={<Trans>You have exceeded your trader limit for the current plan.</Trans>}
                confirmButtonVariant="textPrimary"
                titleSx={{ textTransform: 'none !important', fontWeight: 400 }}
              />
            )
          }
          clickableTooltip
        />
      </Flex>
      <Box width={20} />
    </Flex>
  )
}

/**
 * Search section with add trader functionality
 */
export const TraderGroupSearch = ({
  id,
  customType,
  totalTrader,
  maxTraderAlert,
  ignoreSelectTraders,
  searchText,
  setSearchText,
  onAddWatchlist,
  onRemoveWatchlist,
}: TraderGroupSearchProps) => {
  const { isAvailableWatchlistAlert, watchlistRequiredPlan } = useAlertPermission()
  const { lg } = useResponsive()
  const isElite = useIsElite()
  const isShowUpgradeButton =
    lg && isAvailableWatchlistAlert && customType !== AlertCustomType.TRADER_BOOKMARK && !isElite
  const canAddTrader = totalTrader < (maxTraderAlert ?? 0) && customType === AlertCustomType.TRADER_GROUP
  return (
    <Flex alignItems="center" sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
      <Flex
        sx={{
          pl: 1,
          width: 200,
          borderRight: 'small',
          borderColor: 'neutral4',
        }}
      >
        <InputSearchText
          placeholder="SEARCH ADDRESS"
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
      <Flex
        flex={1}
        justifyContent={isShowUpgradeButton && canAddTrader ? 'space-between' : 'end'}
        sx={{ px: 2, gap: 2 }}
      >
        {canAddTrader && (
          <SearchToAdd
            totalTrader={totalTrader}
            maxTraderAlert={maxTraderAlert ?? 0}
            ignoreSelectTraders={ignoreSelectTraders}
            onSelect={onAddWatchlist}
            onRemove={onRemoveWatchlist}
          />
        )}
        {customType === AlertCustomType.TRADER_BOOKMARK && (
          <Link to={`${ROUTES.BOOKMARKS.path}?groupId=${id}`} target="_blank">
            <ButtonWithIcon variant="ghostPrimary" sx={{ px: 0 }} direction="right" icon={<ArrowSquareOut size={16} />}>
              <Trans>Edit Bookmark</Trans>
            </ButtonWithIcon>
          </Link>
        )}
        {isShowUpgradeButton && <UpgradeButton requiredPlan={watchlistRequiredPlan} showCurrentPlan showIcon={false} />}
      </Flex>
    </Flex>
  )
}

/**
 * Trader list component - handles both mobile and desktop views
 */
export const TraderGroupList = ({
  customType,
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

  const availableColumns =
    customType === AlertCustomType.TRADER_BOOKMARK ? columns.slice(0, columns.length - 1) : columns

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
                customType={customType}
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
          columns={availableColumns}
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
