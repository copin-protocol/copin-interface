import { Redirect } from 'react-router-dom'

import useSearchParams from 'hooks/router/useSearchParams'
import { generateExplorerRoute } from 'utils/helpers/generateRoute'
import { convertProtocolToParams, useProtocolFromUrl } from 'utils/helpers/graphql'

const OldExplorer = () => {
  const { searchParams, pathname } = useSearchParams()
  const foundProtocolInUrl = useProtocolFromUrl(searchParams, pathname)
  const protocolParams = convertProtocolToParams(foundProtocolInUrl)

  return <Redirect to={generateExplorerRoute({ params: { ...searchParams, protocol: protocolParams } })} />
}

export default OldExplorer
