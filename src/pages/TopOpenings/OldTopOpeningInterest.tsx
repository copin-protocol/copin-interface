import { Redirect } from 'react-router-dom'

import useSearchParams from 'hooks/router/useSearchParams'
import { generateOIPositionsRoute } from 'utils/helpers/generateRoute'
import { convertProtocolToParams, getProtocolFromUrl } from 'utils/helpers/graphql'

const OldTopOpeningInterest = () => {
  const { searchParams, pathname } = useSearchParams()
  const foundProtocolInUrl = getProtocolFromUrl(searchParams, pathname)
  const protocolParams = convertProtocolToParams(foundProtocolInUrl)

  return <Redirect to={generateOIPositionsRoute({ params: { ...searchParams, protocol: protocolParams } })} />
}

export default OldTopOpeningInterest
