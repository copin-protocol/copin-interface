import { useResponsive } from 'ahooks'
import { memo, useState } from 'react'

import TraderListCard from 'components/@trader/TraderExplorerListView'
import TraderListTable from 'components/@trader/TraderExplorerTableView'
import { mobileTableSettings, tableSettings } from 'components/@trader/TraderExplorerTableView/configs'
import { TraderData } from 'entities/trader.d'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import useTraderFavorites, { getTraderFavoriteValue } from 'hooks/store/useTraderFavorites'
import useQueryTraders from 'pages/Explorer/ListTradersSection/useQueryTraders'
import { TradersContextData } from 'pages/Explorer/useTradersContext'
import { PaginationWithLimit } from 'theme/Pagination'
import { Box, Flex } from 'theme/base'
import { getPaginationDataFromList } from 'utils/helpers/transform'

const ListTraderFavorites = memo(function ListTraderFavoritesMemo({
  contextValues,
  notes,
}: {
  contextValues: TradersContextData
  notes: { [key: string]: string }
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
  } = contextValues

  const { data, isLoading } = useQueryTraders({
    tab,
    timeRange,
    timeOption,
    isRangeSelection,
    accounts,
    filterTab,
    selectedProtocols,
    isFavTraders: true,
    traderFavorites,
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
    .map((item) => ({ ...item, note: notes ? notes[item.account] : undefined }))
    .filter(({ account, protocol }) => {
      const traderFavorite = getTraderFavoriteValue({ address: account, protocol })
      return traderFavorites.includes(traderFavorite)
    })

  const paginatedData = getPaginationDataFromList({ currentPage, limit: currentLimit, data: formattedData })

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
          <TraderListTable
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
          />
        ) : (
          <TraderListCard data={paginatedData.data} isLoading={isLoading} />
        )}
      </Box>
      <PaginationWithLimit
        currentPage={currentPage}
        currentLimit={currentLimit}
        onPageChange={changeCurrentPage}
        onLimitChange={changeCurrentLimit}
        apiMeta={paginatedData.meta}
      />
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
