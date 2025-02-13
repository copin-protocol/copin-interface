import { useEffect } from 'react'

import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useProtocolFromUrl from 'hooks/router/useProtocolFromUrl'
import useSearchParams from 'hooks/router/useSearchParams'
import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'

import RouteWrapper from './RouteWrapper'
import TopOpenInterest from './TopOpenInterest'

export default function OpenInterestPositionsPage() {
  const { searchParams, pathname } = useSearchParams()
  const isInternal = useInternalRole()

  const protocolOptions = useGetProtocolOptions()
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS
  const { protocols } = useProtocolFromUrl(searchParams, pathname)

  const { selectedProtocols, checkIsSelected, handleToggle, setSelectedProtocols, urlProtocol, setUrlProtocol } =
    useProtocolFilter({
      defaultSelects: protocolOptions.map((_p) => _p.id),
    })

  useEffect(() => {
    if (protocols) {
      setSelectedProtocols(protocols)
    }
  }, [])

  const protocolFilter = {
    allowList,
    selectedProtocols,
    setSelectedProtocols,
    checkIsProtocolChecked: checkIsSelected,
    handleToggleProtocol: handleToggle,
    urlProtocol,
    setUrlProtocol,
  }

  return (
    <RouteWrapper protocolFilter={protocolFilter}>
      <TopOpenInterest />
    </RouteWrapper>
  )
}
