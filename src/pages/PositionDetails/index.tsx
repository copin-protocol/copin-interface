import { useParams } from 'react-router-dom'

import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import PositionDetails from 'components/PositionDetails'
import useSearchParams from 'hooks/router/useSearchParams'
import { ProtocolEnum } from 'utils/config/enums'

export default function PositionDetailsPage() {
  const { protocol = ProtocolEnum.GMX } = useParams<{ protocol: ProtocolEnum }>()
  const { searchParams } = useSearchParams()
  const id = searchParams['id'] as string
  const account = searchParams['account'] as string
  const indexToken = searchParams['indexToken'] as string
  const dataKey = searchParams['key'] as string

  return (
    <>
      <CustomPageTitle title="Position Details" />
      <Container maxWidth={{ lg: 1000 }}>
        <PositionDetails
          protocol={protocol}
          id={id}
          account={account}
          indexToken={indexToken}
          dataKey={dataKey}
          isShow
          isDrawer={false}
        />
      </Container>
    </>
  )
}
