import { useResponsive } from 'ahooks'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import emptyBg from 'assets/images/opening_empty_bg.png'
import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import HLTraderPositionListView from 'components/@position/TraderPositionsListView'
import { fullOpeningColumns } from 'components/@position/configs/traderPositionRenderProps'
import { PositionData } from 'entities/trader'
import Loading from 'theme/Loading'
import Table from 'theme/Table'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

const emptyCss = {
  backgroundImage: `url(${emptyBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
}

export default function VaultOpeningPositions({
  data,
  isLoading,
  protocol,
  currentSort,
  changeCurrentSort,
}: {
  data: PositionData[] | undefined
  isLoading: boolean
  protocol: ProtocolEnum
  currentSort?: TableSortProps<PositionData> | undefined
  changeCurrentSort?: (sort: TableSortProps<PositionData> | undefined) => void
}) {
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()

  const tableData = useMemo(() => {
    if (!data) return undefined
    let openingPositions = data
    switch (currentSort?.sortBy) {
      case 'durationInSecond':
        openingPositions = openingPositions.sort((a, b) => {
          return (
            (((a?.[currentSort.sortBy] as number) ?? 0) - ((b?.[currentSort.sortBy] as number) ?? 0)) *
            (currentSort?.sortType === SortTypeEnum.DESC ? -1 : 1)
          )
        })
        break
    }

    return {
      data: openingPositions,
      meta: { limit: openingPositions.length, offset: 0, total: openingPositions.length, totalPages: 1 },
    }
  }, [currentSort, data])

  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    window.history.replaceState(null, '', generatePositionDetailsRoute({ ...data, txHash: data.txHashes[0] }))
  }

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  const totalOpening = data?.length ?? 0

  const { lg, sm } = useResponsive()

  return (
    <Flex
      className="opening"
      flexDirection="column"
      flex={1}
      sx={{
        backgroundColor: totalOpening ? 'neutral5' : 'neutral7',
        ...(totalOpening || isLoading ? {} : emptyCss),
        pb: [0, 12],
        overflow: 'auto',
      }}
    >
      {isLoading && <Loading />}
      {!data?.length && !isLoading && (
        <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
          <Type.CaptionBold display="block">This vault’s opening position is empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once the vault starts a new position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {data && data.length > 0 && (
        <Box flex="1" overflowX="auto" overflowY="hidden">
          {sm ? (
            <Table
              restrictHeight={lg}
              wrapperSx={{
                minWidth: 500,
              }}
              data={tableData?.data}
              columns={fullOpeningColumns}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
              isLoading={isLoading}
              onClickRow={handleSelectItem}
              renderRowBackground={() => 'rgb(31, 34, 50)'}
            />
          ) : (
            <HLTraderPositionListView
              data={tableData?.data}
              isLoading={isLoading}
              scrollDep={tableData?.meta?.offset}
              onClickItem={handleSelectItem}
              hasAccountAddress={false}
            />
          )}
        </Box>
      )}

      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        protocol={protocol}
        id={currentPosition?.id}
        chartProfitId="opening-position-detail"
      />
    </Flex>
  )
}
