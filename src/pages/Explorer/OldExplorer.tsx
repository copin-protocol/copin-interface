import { Redirect } from 'react-router-dom'

import useProtocolFromUrl from 'hooks/router/useProtocolFromUrl'
import useSearchParams from 'hooks/router/useSearchParams'
import { generateExplorerRoute } from 'utils/helpers/generateRoute'

const OldExplorerPage = () => {
  const { searchParams, pathname } = useSearchParams()
  const { protocolParams } = useProtocolFromUrl(searchParams, pathname)

  return <Redirect to={generateExplorerRoute({ params: { ...searchParams, protocol: protocolParams } })} />
}

export default OldExplorerPage
