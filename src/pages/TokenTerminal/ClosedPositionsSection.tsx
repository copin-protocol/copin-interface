import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { SEARCH_DAILY_POSITIONS_QUERY, SEARCH_POSITIONS_FUNCTION_NAME } from 'graphql/query'
import { useMemo } from 'react'
import { toast } from 'react-toastify'

import { normalizePositionData } from 'apis/normalize'
import { closedPositionsColumns } from 'components/@position/configs/traderPositionRenderProps'
import NoDataFound from 'components/@ui/NoDataFound'
import ToastBody from 'components/@ui/ToastBody'
import { PositionData, ResponsePositionData } from 'entities/trader'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { Box } from 'theme/base'
import { PositionStatusEnum, SortTypeEnum } from 'utils/config/enums'
import { pageToOffset } from 'utils/helpers/transform'

interface ClosedPositionsSectionProps {
  token: string
  sizeFilter: { gte: string | undefined; lte: string | undefined } | null
  selectedAccounts: string[] | null
  isLong: boolean
  onSelectItem: (position: PositionData) => void
}

export default function ClosedPositionsSection({
  token,
  sizeFilter,
  selectedAccounts,
  isLong,
  onSelectItem,
}: ClosedPositionsSectionProps) {
  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: `${isLong ? 'long' : 'short'}PositionsPage`,
    limitName: `${isLong ? 'long' : 'short'}PositionsLimit`,
    defaultLimit: 20,
  })
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)

  const queryVariables = useMemo(() => {
    const filter = {
      and: [
        { field: 'pair', in: [`${token}-USDT`] },
        { field: 'isLong', match: isLong.toString() },
        { field: 'status', match: PositionStatusEnum.CLOSE },
      ],
    }
    if (sizeFilter) {
      filter.and.push({ field: 'size', gte: sizeFilter.gte, lte: sizeFilter.lte } as any)
    }
    if (selectedAccounts) {
      filter.and.push({ field: 'account', in: selectedAccounts } as any)
    }
    return {
      index: 'copin.positions',
      protocols: selectedProtocols ?? [],
      body: {
        filter,
        sorts: [{ field: 'closeBlockTime', direction: SortTypeEnum.DESC }],
        paging: { size: currentLimit, from: pageToOffset(currentPage, currentLimit) },
      },
    }
  }, [token, selectedProtocols, currentPage, currentLimit, sizeFilter, selectedAccounts])

  const {
    data: closedPositionsData,
    loading,
    previousData,
  } = useApolloQuery<{ [SEARCH_POSITIONS_FUNCTION_NAME]: { data: ResponsePositionData[]; meta: any } }>(
    SEARCH_DAILY_POSITIONS_QUERY,
    {
      skip: selectedProtocols == null,
      variables: queryVariables,
      onError: (error) => {
        toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
      },
    }
  )

  const rawPositionData =
    closedPositionsData?.[SEARCH_POSITIONS_FUNCTION_NAME]?.data || previousData?.[SEARCH_POSITIONS_FUNCTION_NAME]?.data

  const positions = useMemo(() => {
    return rawPositionData?.map((position: ResponsePositionData) => normalizePositionData(position)) ?? []
  }, [rawPositionData])

  if (loading && !previousData) {
    return (
      <Box p={4}>
        <Loading />
      </Box>
    )
  }

  if (!positions || positions.length === 0) {
    return <NoDataFound message={<Trans>No closed positions found for {token}</Trans>} />
  }

  return (
    <Box height="100%">
      <Table
        columns={closedPositionsColumns}
        data={positions}
        isLoading={loading && !closedPositionsData}
        restrictHeight
        onClickRow={(row) => onSelectItem(row)}
        footer={
          <Box color="neutral1">
            <PaginationWithLimit
              currentPage={currentPage}
              currentLimit={currentLimit}
              onPageChange={changeCurrentPage}
              onLimitChange={changeCurrentLimit}
              apiMeta={closedPositionsData?.[SEARCH_POSITIONS_FUNCTION_NAME]?.meta}
            />
          </Box>
        }
      />
    </Box>
  )
}
