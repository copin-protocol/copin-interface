import { Trans } from '@lingui/macro'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { searchPositionDetailByTxHashApi } from 'apis/positionApis'
import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import NoDataFound from 'components/@ui/NoDataFound'
import PositionDetails from 'components/PositionDetails'
import PositionTxResults from 'components/PositionTxResults'
import useSearchParams from 'hooks/router/useSearchParams'
import Loading from 'theme/Loading'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'

export default function PositionDetailsPage() {
  const { protocol = ProtocolEnum.GMX, id } = useParams<{ protocol: ProtocolEnum; id: string }>()
  const { searchParams } = useSearchParams()
  const txHash = id?.startsWith('0x') ? id : ''
  const account = searchParams?.[URL_PARAM_KEYS.ACCOUNT] as string
  const logId = Number(searchParams?.[URL_PARAM_KEYS.LOG_ID] as string)

  const { data, isFetching: isLoading } = useQuery(
    [QUERY_KEYS.SEARCH_POSITION_DETAILS_BY_TX_HASH, protocol, txHash, account, logId],
    () =>
      searchPositionDetailByTxHashApi({
        protocol,
        txHash,
        account,
        logId,
      }),
    {
      enabled: !!protocol && !!txHash,
      retry: 0,
    }
  )

  const positionId = !!txHash ? (data && data.length === 1 ? data[0].id : undefined) : id

  return (
    <>
      <CustomPageTitle title="Position Details" />
      <Container maxWidth={{ lg: 1000 }} height="100%">
        {isLoading && <Loading />}
        {!isLoading && !account && !data?.length && !!txHash && (
          <NoDataFound message={<Trans>No Position Found</Trans>} />
        )}
        {!!positionId && <PositionDetails protocol={protocol} id={positionId} isShow isDrawer={false} />}
        {!!txHash && !!account && !positionId && (
          <PositionTxResults
            txHash={txHash}
            protocol={protocol}
            account={account}
            title={<Trans>Recommend Results</Trans>}
          />
        )}
      </Container>
    </>
  )
}
