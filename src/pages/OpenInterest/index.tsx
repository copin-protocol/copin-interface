import { Route, Switch } from 'react-router-dom'

import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import { Box } from 'theme/base'
import ROUTES from 'utils/config/routes'

import OpenInterestOverviewPage from './OpenInterestOverview'
import OpenInterestPositionsPage from './OpenInterestPositions'

export default function OpenInterestPage() {
  return (
    <SafeComponentWrapper>
      <Box width="100%" height="100%">
        <Switch>
          <Route exact path={ROUTES.OPEN_INTEREST_OVERVIEW.path}>
            <OpenInterestOverviewPage />
          </Route>
          <Route exact path={ROUTES.OPEN_INTEREST_POSITIONS.path}>
            <OpenInterestPositionsPage />
          </Route>
        </Switch>
      </Box>
    </SafeComponentWrapper>
  )
}
