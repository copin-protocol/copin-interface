import { useResponsive } from 'ahooks'
import React from 'react'

import { EditAlertHeader } from 'pages/Settings/AlertSettingDetails/SettingCustomAlert/components'
import { Box, Flex } from 'theme/base'
import { AlertCustomType } from 'utils/config/enums'

import { TraderFilterFooter, TraderFilterForm } from './components'
import { LIMIT_TRADERS } from './constants'
import { TraderFilterProps } from './types'
import { useTraderFilterState } from './useTraderFilterState'

/**
 * TraderFilter Component
 * Allows users to filter traders based on various criteria
 */
const TraderFilter: React.FC<TraderFilterProps> = ({
  defaultValues,
  onBack,
  onApply,
  matchingTraderCount,
  setMatchingTraderCount,
  submitting,
  isNew,
}) => {
  const { lg } = useResponsive()
  const isMobile = !lg

  // Initialize state using custom hook
  const {
    name,
    setName,
    description,
    setDescription,
    timeFrame,
    setTimeFrame,
    protocols,
    setProtocols,
    pairs,
    setPairs,
    conditionFormValues,
    setConditionFormValues,
    hasChange,
    protocolOptions,
    pairOptions,
    handleApplyFilter,
    handleResetFilter,
  } = useTraderFilterState({
    defaultValues,
    onApply,
  })

  return (
    <Flex flexDirection="column" width="100%" height="100%" sx={{ overflow: 'auto' }}>
      {/* Header */}
      <EditAlertHeader
        isNew={isNew}
        hasChange={hasChange}
        customType={AlertCustomType.TRADER_FILTER}
        name={name}
        description={description}
        setName={setName}
        setDescription={setDescription}
        onBack={onBack}
      />

      {/* Main content */}
      <Box p={3} sx={{ overflow: 'hidden' }}>
        {/* Form */}
        <TraderFilterForm
          isMobile={isMobile}
          timeFrame={timeFrame}
          setTimeFrame={setTimeFrame}
          protocols={protocols}
          setProtocols={setProtocols}
          pairs={pairs}
          setPairs={setPairs}
          protocolOptions={protocolOptions}
          pairOptions={pairOptions}
          conditionFormValues={conditionFormValues}
          setConditionFormValues={setConditionFormValues}
          matchingTraderCount={matchingTraderCount}
          setMatchingTraderCount={setMatchingTraderCount}
        />

        {/* Footer */}
        <TraderFilterFooter
          isNew={isNew}
          hasChange={hasChange}
          name={defaultValues?.name}
          description={defaultValues?.description}
          timeFrame={timeFrame}
          protocols={protocols}
          pairs={pairs}
          conditionFormValues={conditionFormValues}
          matchingTraderCount={matchingTraderCount}
          limitFilterTraders={LIMIT_TRADERS}
          changeName={setName}
          changeDescription={setDescription}
          handleResetFilter={handleResetFilter}
          handleApplyFilter={handleApplyFilter}
          submitting={submitting}
        />
      </Box>
    </Flex>
  )
}

export default TraderFilter
