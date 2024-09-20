import { ArrowsIn, ArrowsOutSimple, Pulse } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import emptyBg from 'assets/images/opening_empty_bg.png'
import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import TraderPositionListView from 'components/@position/TraderPositionsListView'
import { fullOpeningColumns, openingColumns } from 'components/@position/configs/traderPositionRenderProps'
import SectionTitle from 'components/@ui/SectionTitle'
import { PositionData } from 'entities/trader'
import Loading from 'theme/Loading'
import Table from 'theme/Table'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

const emptyCss = {
  backgroundImage: `url(${emptyBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
}

export default function TraderOpeningPositionsTable({
  data,
  isLoading,
  protocol,
  currentSort,
  changeCurrentSort,
  toggleExpand,
  isExpanded,
}: {
  data: PositionData[] | undefined
  isLoading: boolean
  protocol: ProtocolEnum
  currentSort?: TableSortProps<PositionData> | undefined
  changeCurrentSort?: (sort: TableSortProps<PositionData> | undefined) => void
  toggleExpand?: () => void
  isExpanded?: boolean
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
    if (!!data.txHashes?.length) {
      window.history.replaceState(null, '', generatePositionDetailsRoute({ ...data, txHash: data.txHashes?.[0] }))
    }
  }

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  const totalOpening = data?.length ?? 0

  const { lg, xl, sm } = useResponsive()

  return (
    <Box
      className="opening"
      display={['block', 'block', 'block', 'flex']}
      flexDirection="column"
      height="100%"
      sx={{
        backgroundColor: totalOpening ? 'neutral5' : 'neutral7',
        ...(totalOpening || isLoading ? {} : emptyCss),
        pb: [0, 12],
      }}
    >
      <Flex px={12} pt={12} alignItems="center" justifyContent="space-between">
        <SectionTitle
          icon={<Pulse size={24} />}
          title={`Opening Positions${totalOpening ? ` (${formatNumber(totalOpening)})` : ''}`}
          suffix={
            toggleExpand && (
              <IconBox
                icon={isExpanded ? <ArrowsIn size={20} /> : <ArrowsOutSimple size={20} />}
                role="button"
                sx={{
                  width: 32,
                  height: 32,
                  display: ['none', 'none', 'none', 'none', 'flex'],
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 'sm',
                  // border: 'small',
                  // borderColor: 'neutral4',
                  color: 'neutral2',
                  '&:hover': { color: 'neutral1' },
                }}
                onClick={toggleExpand}
              />
            )
          }
        />
      </Flex>
      {isLoading && <Loading />}
      {!data?.length && !isLoading && (
        <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
          <Type.CaptionBold display="block">This trader’s opening position is empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once the trader starts a new position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {data && data.length > 0 && (
        <Box flex="1 0 0" overflowX="auto" overflowY="hidden">
          {sm ? (
            <Table
              restrictHeight={lg}
              wrapperSx={{
                minWidth: 500,
              }}
              data={tableData?.data}
              columns={xl && isExpanded ? fullOpeningColumns : openingColumns}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
              isLoading={isLoading}
              onClickRow={handleSelectItem}
              renderRowBackground={() => 'rgb(31, 34, 50)'}
            />
          ) : (
            <TraderPositionListView
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
    </Box>
  )
}
