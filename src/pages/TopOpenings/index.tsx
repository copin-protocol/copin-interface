import { Route, Switch } from 'react-router-dom'

import { Box } from 'theme/base'
import ROUTES from 'utils/config/routes'

import OpenInterestOverview from './OpenInterestOverview'
import OpenInterestPositions from './OpenInterestPositions'

export default function TopOpenings() {
  return (
    <Box width="100%" height="100%">
      <Switch>
        <Route exact path={ROUTES.OPEN_INTEREST_OVERVIEW.path}>
          <OpenInterestOverview />
        </Route>
        <Route exact path={ROUTES.OPEN_INTEREST_POSITIONS.path}>
          <OpenInterestPositions />
        </Route>
      </Switch>
    </Box>
  )
}
