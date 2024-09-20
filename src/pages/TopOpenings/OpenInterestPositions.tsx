import { url } from 'inspector'
import { set } from 'lodash'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import useInternalRole from 'hooks/features/useInternalRole'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { getProtocolFromUrl } from 'utils/helpers/graphql'

import OpenInterestByMarket from './OpenInterestByMarket'
import TopOpenings from './TopOpenIntrest'

export default function OpenInterestPositions() {
  const isInternal = useInternalRole()

  const { symbol } = useParams<{
    symbol: string | undefined
    protocol: ProtocolEnum | undefined
  }>()

  const protocolOptions = useGetProtocolOptions()
  const allowList = isInternal ? protocolOptions.map((_p) => _p.id) : ALLOWED_COPYTRADE_PROTOCOLS
  const protocol = getProtocolFromUrl()

  const { selectedProtocols, checkIsSelected, handleToggle, setSelectedProtocols, urlProtocol, setUrlProtocol } =
    useProtocolFilter({
      defaultSelects: protocolOptions.map((_p) => _p.id),
    })

  useEffect(() => {
    if (protocol) {
      setSelectedProtocols([protocol])
    }
  }, [protocol])

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
