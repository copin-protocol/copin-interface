import Container from 'components/@ui/Container'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'

import Overview from './Overview'

export default function StatsCEXPage() {
  return (
    <SafeComponentWrapper>
      <CustomPageTitle title="CEX Depth" />
      <Container p={3} height="100%">
        <Overview />
      </Container>
    </SafeComponentWrapper>
  )
}
