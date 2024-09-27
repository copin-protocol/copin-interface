import { Redirect } from 'react-router-dom'

import ROUTES from 'utils/config/routes'

export default function RedirectCopierRanking() {
  return <Redirect to={ROUTES.COPIER_RANKING.path} />
}
