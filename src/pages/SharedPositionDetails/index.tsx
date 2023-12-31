import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getSharedPositionSettingApi } from 'apis/shareApis'
import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import PositionDetails from 'components/PositionDetails'
import Loading from 'theme/Loading'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export default function SharedPositionDetailsPage() {
  const { protocol = ProtocolEnum.GMX, sharedId } = useParams<{
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
          <PositionDetails protocol={protocol} id={data?.query.positionId} isShow isDrawer={false} />
        )}
      </Container>
    </>
  )
}
