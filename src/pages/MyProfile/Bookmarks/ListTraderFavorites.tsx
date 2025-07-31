import { Trans } from '@lingui/macro'
import { useResponsive, useSize } from 'ahooks'
import { ReactNode, memo, useEffect, useRef, useState } from 'react'

import PlanUpgradePrompt from 'components/@subscription/PlanUpgradePrompt'
import { CustomizeColumnWithState } from 'components/@trader/CustomizeColumnWithState'
import TraderListCard from 'components/@trader/TraderExplorerListView'
import TraderListTable from 'components/@trader/TraderExplorerTableView'
import { mobileTableSettings, tableSettings } from 'components/@trader/TraderExplorerTableView/configs'
import NoFavoriteFound from 'components/@ui/NoDataFound/NoFavoriteFound'
import { TraderData } from 'entities/trader.d'
import useExplorerPermission from 'hooks/features/subscription/useExplorerPermission'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import useTraderFavorites, { getTraderFavoriteValue } from 'hooks/store/useTraderFavorites'
import useQueryTraders from 'pages/Explorer/ListTradersSection/useQueryTraders'
import { TradersContextData } from 'pages/Explorer/useTradersContext'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import { Box, Flex } from 'theme/base'
import { SubscriptionFeatureEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'
import { getRequiredPlan } from 'utils/helpers/permissionHelper'
import { getPaginationDataFromList } from 'utils/helpers/transform'

const ListTraderFavorites = memo(function ListTraderFavoritesMemo({
  contextValues,
  bookmarks,
  totalAccounts,
}: {
  contextValues: TradersContextData
  bookmarks: { [key: string]: { note?: string; customAlertIds?: string[] } }
  groupId?: string
  totalAccounts: number
}) {
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const { traderFavorites } = useTraderFavorites()
  const { md } = useResponsive()
  const settings = md ? tableSettings : mobileTableSettings
  const {
    tab,
    accounts,
    isRangeSelection,
    timeRange,
    timeOption,
    currentSort,
    changeCurrentSort,
    filterTab,
    currentPage,
    currentLimit,
    changeCurrentPage,
    changeCurrentLimit,
    rankingFilters,
    labelsFilters,
    ifFilters,
    filters,
    resetFilter,
  } = contextValues

  // Permission
  const { userPermission, pagePermission } = useExplorerPermission()
  let noDataMessage: ReactNode | undefined
  {
    const hasFilterTimeFromHigherPlan = !userPermission?.timeFramesAllowed?.includes(timeOption.id)
    let requiredPlan: SubscriptionPlanEnum | undefined = undefined
    if (hasFilterTimeFromHigherPlan) {
      requiredPlan = getRequiredPlan({
        conditionFn: (plan) => {
          return !!pagePermission?.[plan]?.timeFramesAllowed?.includes(timeOption.id)
        },
      })
    }

    if (requiredPlan) {
      const title = (
        <Trans>This URL contains filters available from {SUBSCRIPTION_PLAN_TRANSLATION[requiredPlan]} plan</Trans>
      )
      const description = <Trans>Please upgrade to explore traders with advanced filters</Trans>
      noDataMessage = (
        <Box pt={4}>
          <PlanUpgradePrompt
            title={title}
            description={description}
            requiredPlan={requiredPlan}
            learnMoreSection={SubscriptionFeatureEnum.TRADER_FAVORITE}
            useLockIcon
            showTitleIcon
            cancelText={<Trans>Reset Filters</Trans>}
            onCancel={resetFilter}
          />
        </Box>
      )
    }
  }

  const { data, isLoading } = useQueryTraders({
    currentLimit,
    currentPage,
    currentSort,
    tab,
    timeRange,
    timeOption,
    isRangeSelection,
    accounts,
    filterTab,
    selectedProtocols,
    isFavTraders: true,
    traderFavorites,
    rankingFilters,
    labelsFilters,
    ifFilters,
    filters,
    enabled: !noDataMessage,
  })

  const [selectedTraders, setSelectedTraders] = useState<string[]>([])
  const handleSelect = ({ isSelected, data }: { isSelected: boolean; data: TraderData }) => {
    setSelectedTraders((prev) => {
      if (isSelected) {
        return prev.filter((address) => address !== data.account)
      }
      return [...prev, data.account]
    })
  }
  const checkIsSelected = (data: TraderData) => selectedTraders.includes(data.account)
  const formattedData = data?.data
    .map((item) => ({
      ...item,
      note: bookmarks ? bookmarks[`${item.account}-${item.protocol}`]?.note : undefined,
      customAlertIds: bookmarks ? bookmarks[`${item.account}-${item.protocol}`]?.customAlertIds : undefined,
    }))
    .filter(({ account, protocol }) => {
      const traderFavorite = getTraderFavoriteValue({ address: account, protocol })
      return traderFavorites.includes(traderFavorite)
    })

  const paginatedData = getPaginationDataFromList({ currentPage, limit: currentLimit, data: formattedData })
  const ref = useRef(null)
  const size = useSize(ref)

  // if (paginatedData.data?.length === 0 && !isLoading && totalAccounts > 0) {
  //   const title = <Trans>All traders from higher plan are not shown</Trans>
  //   const description = <Trans>Please upgrade to explore all traders</Trans>
  //   noDataMessage = (
  //     <Box pt={4}>
  //       <PlanUpgradePrompt
  //         title={title}
  //         description={description}
  //         requiredPlan={SubscriptionPlanEnum.ELITE}
  //         learnMoreSection={SubscriptionFeatureEnum.TRADER_FAVORITE}
  //         useLockIcon
  //         showTitleIcon
  //       />
  //     </Box>
  //   )
  // }

  useEffect(() => {
    if (paginatedData.data?.length === 0 && !isLoading && currentPage > 1) {
      changeCurrentPage(1)
    }
  }, [paginatedData, isLoading, currentPage, changeCurrentPage])

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Box
        flex="1 0 0"
        sx={{
          overflow: 'hidden',
          borderBottom: 'small',
          borderBottomColor: 'neutral5',
          bg: 'neutral7',
          position: 'relative',
        }}
      >
        {md ? (
          noDataMessage == null && paginatedData.data?.length === 0 ? (
            isLoading ? (
              <Loading />
            ) : (
              <NoFavoriteFound message={<Trans>No traders match your protocol filters</Trans>} />
              // <NoDataFound/>
            )
          ) : (
            <TraderListTable
              freezeBg="neutral8"
              data={paginatedData.data}
              isLoading={isLoading}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
              handleSelectAll={null}
              tableSettings={settings}
              checkIsSelected={checkIsSelected}
              handleSelect={handleSelect}
              hiddenSelectAllBox
              hiddenSelectItemBox
              lefts={[0, 0]}
              noDataMessage={noDataMessage}
              learnMoreSection={SubscriptionFeatureEnum.TRADER_FAVORITE}
              dataView="BOOKMARK"
            />
          )
        ) : (
          <TraderListCard
            data={paginatedData.data}
            isLoading={isLoading}
            isFavoritePage
            noDataMessage={noDataMessage}
            dataView="BOOKMARK"
          />
        )}
      </Box>
      <Flex className="pagination__wrapper" sx={{ alignItems: 'center', justifyContent: 'end' }}>
        <PaginationWithLimit
          currentPage={currentPage}
          currentLimit={currentLimit}
          onPageChange={changeCurrentPage}
          onLimitChange={changeCurrentLimit}
          apiMeta={paginatedData.meta}
          my={1}
          menuPosition="top"
          disabledInput={size?.width && size.width < 550 ? true : false}
        />
        {data && (
          <Flex alignItems={'center'}>
            <Box sx={{ width: 1, height: 40, bg: 'neutral4', flexShrink: 0 }} />
            <Flex sx={{ gap: 20, alignItems: 'center', px: 2, py: 2, pr: 2 }}>
              <CustomizeColumnWithState />
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
})

export default ListTraderFavorites

// function CompareTradersButton({ selectedTraders }: { selectedTraders: string[] }) {
//   return (
//     <Box
//       display={{ _: 'none', lg: 'flex' }}
//       width={['100%', 228]}
//       height={40}
//       sx={{
//         alignItems: 'center',
//         gap: 2,
//         px: selectedTraders.length === 2 ? 0 : 3,
//         flexShrink: 0,
//         borderRight: 'small',
//         borderColor: ['transparent', 'neutral4'],
//       }}
//       color="neutral3"
//     >
//       {selectedTraders.length === 2 ? (
//         <CompareButton listAddress={selectedTraders} hasDivider={false} block />
//       ) : (
//         <>
//           <ArrowElbowLeftUp size={16} />
//           <Type.Caption color="neutral3">Select 2 traders to compare</Type.Caption>
//         </>
//       )}
//     </Box>
//   )
// }
