import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { useProtocolFromUrl } from 'utils/helpers/graphql'

import OpenInterestByMarket from './OpenInterestByMarket'
import TopOpenings from './TopOpenIntrest'

export default function OpenInterestPositions() {
  const { searchParams, pathname } = useSearchParams()
  const isInternal = useInternalRole()

  const { symbol } = useParams<{
    symbol: string | undefined
    protocol: ProtocolEnum | undefined
  }>()

  const protocolOptions = useGetProtocolOptions()
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS
  const foundProtocolInUrl = useProtocolFromUrl(searchParams, pathname)

  const { selectedProtocols, checkIsSelected, handleToggle, setSelectedProtocols, urlProtocol, setUrlProtocol } =
    useProtocolFilter({
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
    urlProtocol,
    setUrlProtocol,
  }

  return (
    <>
      {!symbol ? (
        <TopOpenings protocolFilter={protocolFilter} />
      ) : (
        <OpenInterestByMarket protocolFilter={protocolFilter} />
      )}
    </>
  )
}
