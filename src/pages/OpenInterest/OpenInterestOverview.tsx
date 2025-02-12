import { useEffect } from 'react'

import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useProtocolFromUrl from 'hooks/router/useProtocolFromUrl'
import useSearchParams from 'hooks/router/useSearchParams'
import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'

import OpenInterestByMarkets from './OpenInterestByMarkets'

export default function OpenInterestOverviewPage() {
  const isInternal = useInternalRole()
  const { searchParams, pathname } = useSearchParams()
  const protocolOptions = useGetProtocolOptions()
  const { protocols } = useProtocolFromUrl(searchParams, pathname)
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS

  const { selectedProtocols, checkIsSelected, handleToggle, setSelectedProtocols } = useProtocolFilter({
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
  }
  return <OpenInterestByMarkets protocolFilter={protocolFilter} />
}
