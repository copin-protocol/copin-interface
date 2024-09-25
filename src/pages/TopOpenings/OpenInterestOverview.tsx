import { useEffect } from 'react'

import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'
import { getProtocolFromUrl } from 'utils/helpers/graphql'

import OpenInterestByMarkets from './OpenInterestByMarkets'

export default function OpenInterestOverview() {
  const isInternal = useInternalRole()
  const { searchParams, pathname } = useSearchParams()
  const protocolOptions = useGetProtocolOptions()
  const foundProtocolInUrl = getProtocolFromUrl(searchParams, pathname)
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS

  const { selectedProtocols, checkIsSelected, handleToggle, setSelectedProtocols } = useProtocolFilter({
    defaultSelects: protocolOptions.map((_p) => _p.id),
  })

  useEffect(() => {
    if (foundProtocolInUrl) {
      setSelectedProtocols(foundProtocolInUrl)
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
