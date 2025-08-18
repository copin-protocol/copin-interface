// eslint-disable-next-line no-restricted-imports
import { Trans, t } from '@lingui/macro'
import React from 'react'

import PlanUpgradeIndicator from 'components/@subscription/PlanUpgradeIndicator'
import { AccountInfo } from 'components/@ui/AccountInfo'
import NoDataFound from 'components/@ui/NoDataFound'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import useSearchAllData from 'hooks/features/trader/useSearchAllData'
import { InputSearch } from 'theme/Input'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'
import { SubscriptionFeatureEnum } from 'utils/config/enums'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'

import { FindAndSelectTraderProps } from './FindAndSelectTrader'
import { filterFoundData } from './helpers'

export default function SearchTraders({
  resultHeight = 200,
  ...props
}: FindAndSelectTraderProps & { resultHeight?: number }) {
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
  } = useSearchAllData({ onSelect: props.onSelect, returnRanking: true, allowAllProtocol: true, limit: props.limit })

  const { allowedSelectProtocols, pagePermission } = useProtocolPermission()

  const traders = [...filterFoundData(searchTraders?.data, props.ignoreSelectTraders)]

  return (
    <Box ref={searchWrapperRef} sx={{ position: 'relative' }}>
      <InputSearch
        ref={inputSearchRef}
        placeholder={props.placeholder ?? t`SEARCH BY ADDRESS`}
        sx={{
          width: '100%',
        }}
        value={searchText}
        onFocus={handleSearchFocus}
        onChange={handleSearchChange}
        onClear={handleClearSearch}
      />
      {visibleSearchResult && (
        <Flex
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            transform: 'translateY(100%)',
            maxHeight: resultHeight,
            bg: 'neutral5',
            flexDirection: 'column',
            overflow: 'auto',
            zIndex: 100,
          }}
        >
          {isLoading ? (
            <Box px={1}>
              <Loading />
            </Box>
          ) : (
            <>
              {!traders.length && <NoDataFound message={<Trans>No Trader Found</Trans>} />}
              {traders.map((traderData) => {
                const isAllowed = allowedSelectProtocols?.includes(traderData.protocol)
                const requiredPlanToProtocol = getRequiredPlan({
                  conditionFn: (plan) =>
                    (traderData.protocol && pagePermission?.[plan]?.protocolAllowed?.includes(traderData.protocol)) ||
                    false,
                })
                return (
                  <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    role="button"
                    key={traderData.id}
                    onClick={() => (isAllowed ? props.onSelect(traderData) : undefined)}
                    sx={{ py: '6px', px: 2, borderRadius: 'sm', '&:hover': { bg: 'neutral6' } }}
                  >
                    <AccountInfo
                      address={traderData.account}
                      protocol={traderData.protocol}
                      hasLink={false}
                      avatarSize={24}
                      textSx={{ width: 'fit-content' }}
                    />
                    {isAllowed ? (
                      props.addWidget
                    ) : (
                      <PlanUpgradeIndicator
                        requiredPlan={requiredPlanToProtocol}
                        learnMoreSection={SubscriptionFeatureEnum.TRADER_PROFILE}
                        useLockIcon={false}
                      />
                    )}
                  </Flex>
                )
              })}
            </>
          )}
        </Flex>
      )}
    </Box>
  )
}
