import React from 'react'

import { TraderData } from 'entities/trader.d'
import { useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'
import SearchBox from 'pages/@layouts/Navbar/SearchBox'

const AddCustomTrader = () => {
  const { addTraderToHomeInstance } = useSelectBacktestTraders()
  return (
    <SearchBox
      allowAllProtocol={false}
      allowSearchPositions={false}
      bg="neutral6"
      placeholder="Enter address to add more traders"
      actionTitle="Add"
      onSelect={(data: TraderData) => {
        addTraderToHomeInstance(data)
      }}
    />
  )
}

export default AddCustomTrader
