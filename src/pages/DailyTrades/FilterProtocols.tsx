import { memo } from 'react'

import { ProtocolFilter } from 'components/@ui/ProtocolFilter'

import { useProtocolsContext } from './useProtocolsProvider'

const FilterProtocols = memo(function FilterProtocols() {
  const { selectedProtocols, setProtocols, checkIsSelected, handleToggle, allowList } = useProtocolsContext()

  return (
    <ProtocolFilter
      selectedProtocols={selectedProtocols}
      checkIsProtocolChecked={checkIsSelected}
      handleToggleProtocol={handleToggle}
      setSelectedProtocols={setProtocols}
      allowList={allowList}
    />
  )
})

export default FilterProtocols
