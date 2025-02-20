import { Redirect } from 'react-router-dom'

import { generateExplorerRoute } from 'utils/helpers/generateRoute'

const OldExplorerPage = () => {
  return <Redirect to={generateExplorerRoute({})} />
}

export default OldExplorerPage
