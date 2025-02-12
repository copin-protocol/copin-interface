import { Route, Switch } from 'react-router-dom'

import { Box } from 'theme/base'
import ROUTES from 'utils/config/routes'

import OpenInterestOverviewPage from './OpenInterestOverview'
import OpenInterestPositionsPage from './OpenInterestPositions'

export default function OpenInterestPage() {
  return (
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
  )
}
