import { useResponsive } from 'ahooks'
import React from 'react'

import { TraderAlertData } from 'entities/alert'
import { TraderData } from 'entities/trader'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useUserNextPlan from 'hooks/features/subscription/useUserNextPlan'
import { Flex } from 'theme/base'
import { AlertCustomType } from 'utils/config/enums'

import TradersTag from '../TradersTag'
import { EditAlertHeader } from '../components'
import { TraderGroupFooter, TraderGroupList, TraderGroupSearch } from './components'
import { TraderGroupProps } from './types'
import { useTraderGroupState } from './useTraderGroupState'
import { useTraderGroupTable } from './useTraderGroupTable'

/**
 * TraderGroup Component
 * Allows users to manage a group of traders for custom alerts.
 */
const TraderGroup = ({
  id,
  defaultValues,
  groupTraders,
  customType = AlertCustomType.TRADER_GROUP,
  onBack,
  onApply,
  setMatchingTraderCount,
  submitting,
  isNew,
}: TraderGroupProps) => {
  const { lg } = useResponsive()
  const isMobile = !lg
  const { maxTraderAlert, isEliteUser } = useBotAlertContext()

  // Initialize state using custom hook
  const {
    name,
    description,
    traderGroupAdd,
    traderGroupUpdate,
    traderGroupRemove,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    hasChange,
    totalTrader,
    totalActiveTrader,
    filteredTraders,
    paginatedTraders,
    ignoreSelectTraders,
    onChangeName,
    onChangeDescription,
    onAddWatchlist,
    onUpdateWatchlist,
    onRemoveWatchlist,
    handleApply,
    handleReset,
  } = useTraderGroupState({
    customType,
    defaultValues,
    groupTraders,
    onApply,
    setMatchingTraderCount,
  })

  const { userNextPlan } = useUserNextPlan()

  // Get table configuration
  const { columns } = useTraderGroupTable(onUpdateWatchlist, onRemoveWatchlist)

  return (
    <Flex flexDirection="column" width="100%" height="100%" sx={{ overflow: 'hidden' }}>
      <Flex flexDirection="column">
        {/* Header section */}
        <EditAlertHeader
          isNew={isNew}
          hasChange={hasChange}
          customType={customType}
          name={name}
          description={description}
          setName={onChangeName}
          setDescription={onChangeDescription}
          onBack={onBack}
          total={totalActiveTrader}
          limit={maxTraderAlert}
          userNextPlan={userNextPlan}
        />

        {/* Search section */}
        <TraderGroupSearch
          id={id}
          customType={customType}
          totalTrader={totalActiveTrader}
          maxTraderAlert={maxTraderAlert}
          isEliteUser={isEliteUser}
          ignoreSelectTraders={ignoreSelectTraders}
          searchText={searchText}
          setSearchText={setSearchText}
          onAddWatchlist={onAddWatchlist}
          onRemoveWatchlist={(data: TraderData) => {
            onRemoveWatchlist?.({ address: data.account, protocol: data.protocol } as TraderAlertData)
          }}
        />
      </Flex>

      {/* Change section */}
      <Flex alignItems="center" sx={{ px: 3, pt: 2, gap: 2 }}>
        {!!traderGroupAdd?.length && <TradersTag title={'ADD NEW'} traders={traderGroupAdd} />}
        {!!traderGroupUpdate?.length && <TradersTag title={'MODIFY'} traders={traderGroupUpdate} />}
        {!!traderGroupRemove?.length && <TradersTag title={'REMOVE'} traders={traderGroupRemove} />}
      </Flex>

      {/* Trader list section */}
      <TraderGroupList
        customType={customType}
        isMobile={isMobile}
        paginatedTraders={paginatedTraders}
        columns={columns}
        onUpdateWatchlist={onUpdateWatchlist}
        onRemoveWatchlist={onRemoveWatchlist}
      />

      {/* Footer section */}
      <TraderGroupFooter
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        filteredTraders={filteredTraders}
        paginatedTraders={paginatedTraders}
        hasChange={hasChange}
        handleReset={handleReset}
        handleApply={handleApply}
        submitting={submitting}
        isNew={isNew}
        traderGroupAdd={traderGroupAdd}
        traderGroupUpdate={traderGroupUpdate}
        traderGroupRemove={traderGroupRemove}
      />
    </Flex>
  )
}

export default TraderGroup
