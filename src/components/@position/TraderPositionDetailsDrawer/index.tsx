import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { SEARCH_DAILY_POSITION_ID_QUERY, SEARCH_POSITIONS_FUNCTION_NAME, SEARCH_POSITIONS_INDEX } from 'graphql/query'
import { Suspense, lazy, memo, useMemo } from 'react'

import { ApiListResponse } from 'apis/api'
import Container from 'components/@ui/Container'
import NoDataFound from 'components/@ui/NoDataFound'
import { PositionData } from 'entities/trader'
import useIsMobile from 'hooks/helpers/useIsMobile'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import RcDrawer from 'theme/RcDrawer'
import { ProtocolEnum } from 'utils/config/enums'
import { Z_INDEX } from 'utils/config/zIndex'

const TraderPositionDetails = lazy(() => import('components/@position/TraderPositionDetails'))

export default function TraderPositionDetailsDrawer({
  isOpen,
  onDismiss,
  protocol,
  id,
  chartProfitId,
}: {
  isOpen: boolean
  onDismiss: () => void
  protocol: ProtocolEnum | undefined
  id: string | undefined
  chartProfitId: string
}) {
  const { lg, xl } = useResponsive()
  return (
    <RcDrawer open={isOpen} onClose={onDismiss} width={xl ? '60%' : lg ? '80%' : '100%'} zIndex={Z_INDEX.TOASTIFY}>
      <Container sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: '12px', zIndex: 1 }}
          onClick={onDismiss}
        />
        <Suspense fallback={null}>
          {isOpen && <TraderPositionDetails protocol={protocol} id={id} chartProfitId={chartProfitId} />}
        </Suspense>
      </Container>
    </RcDrawer>
  )
}

// TODO: Improve fetch
export const TraderPositionDetailsFromOrderDrawer = memo(function PositionDrawer({
  protocol,
  orderId,
  txHash,
  account,
  logId,
  isOpen,
  onDismiss,
  chartProfitId,
}: {
  isOpen: boolean
  orderId: string | undefined
  protocol: ProtocolEnum | undefined
  txHash: string | undefined
  account: string | undefined
  logId: number | undefined
  onDismiss: () => void
  chartProfitId: string
}) {
  // const { data: positionQueryByTxHash, isFetching: isLoadingQueryTxHash } = useQuery(
  //   [QUERY_KEYS.SEARCH_POSITION_DETAILS_BY_TX_HASH, protocol, txHash, account, logId],
  //   () =>
  //     searchPositionDetailByTxHashApi({
  //       protocol: protocol ?? DEFAULT_PROTOCOL,
  //       txHash: txHash ?? '',
  //       account,
  //       logId,
  //     }),
  //   {
  //     enabled: !!protocol && !!txHash && !!account && logId != null && isOpen,
  //     retry: 0,
  //   }
  // )

  const queryPositionVariables = useMemo(() => {
    return {
      index: SEARCH_POSITIONS_INDEX,
      body: {
        filter: {
          and: [{ field: 'orderIds', in: [orderId] }],
        },
        sorts: {},
        paging: {},
      },
      protocols: [protocol],
    }
  }, [orderId, protocol])

  const { data: positionQueryByOrderIdData, loading: isLoadingQueryOrderId } = useApolloQuery<{
    [SEARCH_POSITIONS_FUNCTION_NAME]: ApiListResponse<PositionData>
  } | null>(SEARCH_DAILY_POSITION_ID_QUERY, {
    variables: queryPositionVariables,
    skip: !isOpen,
  })

  const positionIdByOrderId = positionQueryByOrderIdData?.[SEARCH_POSITIONS_FUNCTION_NAME]?.data?.[0]?.id
  // const positionIdByTxHash =
  //   positionQueryByTxHash && positionQueryByTxHash.length === 1 ? positionQueryByTxHash[0].id : undefined
  // const positionId = positionIdByTxHash ?? positionIdByOrderId
  // const isLoading = isLoadingQueryTxHash || isLoadingQueryOrderId

  const positionId = positionIdByOrderId
  const isLoading = isLoadingQueryOrderId

  const isMobile = useIsMobile()
  const { lg, xl } = useResponsive()

  // TODO: Need to pass data to position details
  return (
    <RcDrawer open={isOpen} onClose={onDismiss} width={xl ? '60%' : lg ? '80%' : '100%'} zIndex={Z_INDEX.TOASTIFY}>
      <Container sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: 3, zIndex: 1 }}
          onClick={onDismiss}
        />
        <Suspense fallback={null}>
          {isLoading && <Loading />}
          {isOpen && !isLoading && !!positionId ? (
            <TraderPositionDetails protocol={protocol} id={positionId} chartProfitId={chartProfitId} />
          ) : (
            <NoDataFound message={<Trans>Position not yet synced</Trans>} />
          )}
        </Suspense>
      </Container>
    </RcDrawer>
  )
})
