import { Redirect } from 'react-router-dom'

import useSearchParams from 'hooks/router/useSearchParams'
import { generateExplorerRoute } from 'utils/helpers/generateRoute'
import { convertProtocolToParams, getProtocolFromUrl } from 'utils/helpers/graphql'

const OldExplorer = () => {
  const { searchParams, pathname } = useSearchParams()
  const foundProtocolInUrl = getProtocolFromUrl(searchParams, pathname)
  const protocolParams = convertProtocolToParams(foundProtocolInUrl)

  return <Redirect to={generateExplorerRoute({ params: { ...searchParams, protocol: protocolParams } })} />
}

export default OldExplorer
