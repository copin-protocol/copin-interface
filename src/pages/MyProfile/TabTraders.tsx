import { useState } from 'react'

import TraderListTable from 'components/Tables/TraderListTable'
import { TraderListSortProps, myTradersTableSettings } from 'components/Tables/TraderListTable/dataConfig'
import { MyCopyTraderData } from 'entities/trader'
import Loading from 'theme/Loading'
import { Box } from 'theme/base'
import { SortTypeEnum } from 'utils/config/enums'

import NoDataOrSelect from './NoDataOrSelect'

export default function MyTradersTab({
  data,
  isLoading,
  isSelectedAll,
  handleSelectAll,
  checkIsSelected,
  handleSelect,
}: {
  data: MyCopyTraderData[] | undefined
  isLoading: boolean
  isSelectedAll: boolean
  handleSelectAll: (isSelectedAll: boolean) => void
  checkIsSelected: (data: MyCopyTraderData) => boolean
  handleSelect: (args: { isSelected: boolean; data: MyCopyTraderData }) => void
}) {
  const [currentSort, setCurrentSort] = useState<TraderListSortProps<MyCopyTraderData>>()
  const changeCurrentSort = (sort: TraderListSortProps<MyCopyTraderData> | undefined) => {
    setCurrentSort(sort)
  }
  let sortedData: MyCopyTraderData[] | undefined = undefined
  if (data) {
    sortedData = [...data]
    if (!!currentSort) {
      sortedData.sort((a, b) => {
        return (
          (((a?.[currentSort.sortBy] as number) ?? 0) - ((b?.[currentSort.sortBy] as number) ?? 0)) *
          (currentSort?.sortType === SortTypeEnum.DESC ? -1 : 1)
        )
      })
    }
  }
  if (isLoading) return <Loading />
  if (!isLoading && (!data || !data.length)) return <NoDataOrSelect type="noTraders" />
  return (
    <>
      {data && (
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <TraderListTable
            data={sortedData}
            tableSettings={myTradersTableSettings}
            isLoading={false}
            isSelectedAll={isSelectedAll}
            handleSelectAll={handleSelectAll}
            checkIsSelected={checkIsSelected}
            handleSelect={handleSelect}
            hasCustomize={false}
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
            freezeBg="neutral7"
          />
        </Box>
      )}
    </>
  )
}
