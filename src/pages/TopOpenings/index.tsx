import { Redirect, Route, Switch } from 'react-router-dom'

import { ProtocolPageWrapper } from 'components/RouteWrapper'
import { Box } from 'theme/base'
import { DEFAULT_PROTOCOL } from 'utils/config/constants'
import ROUTES from 'utils/config/routes'
import { generateOIPositionsRoute } from 'utils/helpers/generateRoute'

import OpenInterestOverview from './OpenInterestOverview'
import OpenInterestPositions from './OpenInterestPositions'

export default function TopOpenings() {
  return (
    <ProtocolPageWrapper>
      <TopOpeningsPage />
    </ProtocolPageWrapper>
  )
}
function TopOpeningsPage() {
  return (
    <Box width="100%" height="100%">
      <Switch>
        <Route exact path={ROUTES.OPEN_INTEREST_OVERVIEW.path}>
          <OpenInterestOverview />
        </Route>
        <Route exact path={ROUTES.OPEN_INTEREST_POSITIONS.path}>
          <OpenInterestPositions />
        </Route>
        <Route exact path={ROUTES.OPEN_INTEREST_OVERVIEW.alter_path}>
          <OpenInterestOverview />
        </Route>
        <Route exact path={ROUTES.OPEN_INTEREST_POSITIONS.alter_path}>
          <OpenInterestPositions />
        </Route>
        <Redirect to={generateOIPositionsRoute({ protocol: DEFAULT_PROTOCOL })} />
      </Switch>
    </Box>
  )
}
