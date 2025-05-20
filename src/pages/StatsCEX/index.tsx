import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'

import Overview from './Overview'
import PermissionContainer from './PermissionContainer'

export default function StatsCEXPage() {
  return (
    <SafeComponentWrapper>
      <CustomPageTitle title="CEX Depth" />
      <Container p={3} height="100%">
        <PermissionContainer>
          <Overview />
        </PermissionContainer>
      </Container>
    </SafeComponentWrapper>
  )
}
