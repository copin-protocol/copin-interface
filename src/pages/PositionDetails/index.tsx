import { useParams } from 'react-router-dom'

import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import PositionDetails from 'components/PositionDetails'
import { ProtocolEnum } from 'utils/config/enums'

export default function PositionDetailsPage() {
  const { protocol = ProtocolEnum.GMX, id } = useParams<{ protocol: ProtocolEnum; id: string }>()
  return (
    <>
      <CustomPageTitle title="Position Details" />
      <Container maxWidth={{ lg: 1000 }}>
        <PositionDetails protocol={protocol} id={id} isShow isDrawer={false} />
      </Container>
    </>
  )
}
