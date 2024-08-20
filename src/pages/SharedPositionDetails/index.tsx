import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getSharedPositionSettingApi } from 'apis/shareApis'
import TraderPositionDetails from 'components/@position/TraderPositionDetails'
import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import Loading from 'theme/Loading'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export default function SharedPositionDetailsPage() {
  const { protocol = DEFAULT_PROTOCOL, sharedId } = useParams<{
    protocol: ProtocolEnum
    sharedId: string
  }>()
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_SHARED_POSITION_DATA, sharedId],
    () => getSharedPositionSettingApi(sharedId ?? ''),
    { enabled: !!sharedId }
  )

  if (isLoading) return <Loading />

  return (
    <>
      <CustomPageTitle title="Position Details" />
      <Container maxWidth={{ lg: 1000 }}>
        {data?.query?.positionId && (
          <TraderPositionDetails
            isDrawer={false}
            protocol={protocol}
            id={data?.query.positionId}
            chartProfitId="share-position-details-page"
          />
        )}
      </Container>
    </>
  )
}
