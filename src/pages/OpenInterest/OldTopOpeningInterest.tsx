import { Redirect } from 'react-router-dom'

import useProtocolFromUrl from 'hooks/router/useProtocolFromUrl'
import useSearchParams from 'hooks/router/useSearchParams'
import { generateOIPositionsRoute } from 'utils/helpers/generateRoute'

const OldTopOpeningInterestPage = () => {
  const { searchParams, pathname } = useSearchParams()
  const { protocolParams } = useProtocolFromUrl(searchParams, pathname)

  return <Redirect to={generateOIPositionsRoute({ params: { ...searchParams, protocol: protocolParams } })} />
}

export default OldTopOpeningInterestPage
