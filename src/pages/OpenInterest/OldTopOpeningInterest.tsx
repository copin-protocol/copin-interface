import { Redirect } from 'react-router-dom'

import { generateOIPositionsRoute } from 'utils/helpers/generateRoute'

const OldTopOpeningInterestPage = () => {
  return <Redirect to={generateOIPositionsRoute({})} />
}

export default OldTopOpeningInterestPage
