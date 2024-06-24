import { useResponsive } from 'ahooks'

import { CopyTradeData } from 'entities/copyTrade'

import SelectTradersDropdown from '../SelectTradersDropdown'
import { getTradersByProtocolFromCopyTrade } from '../helpers'

function SelectedTraders({
  allTraders,
  selectedTraders,
  handleToggleTrader,
  handleSelectAllTraders,
  allCopyTrades,
  buttonSx,
}: {
  allTraders: string[] // to check two request has same addresses
  selectedTraders: string[]
  allCopyTrades: CopyTradeData[] | undefined
  handleToggleTrader: (key: string) => void
  handleSelectAllTraders: (isSelectedAll: boolean) => void
  buttonSx?: any
}) {
  const tradersByProtocol = getTradersByProtocolFromCopyTrade(allCopyTrades, allTraders)
  const { sm } = useResponsive()

  if (!tradersByProtocol || !allTraders.length) return <></>

  let activeTraderAddress: string[] = []
  let deletedTraderAddresses: string[] = []
  Object.entries(tradersByProtocol).forEach(([_, traderData]) => {
    traderData.forEach((data) => {
      if (data.status === 'copying') activeTraderAddress.push(data.address)
      if (data.status === 'deleted') deletedTraderAddresses.push(data.address)
    })
  })
  activeTraderAddress = Array.from(new Set(activeTraderAddress))
  deletedTraderAddresses = Array.from(new Set(deletedTraderAddresses))

  return (
    <SelectTradersDropdown
      menuSx={sm ? undefined : { transform: 'translateX(10px)' }}
      allTraders={allTraders}
      selectedTraders={selectedTraders}
      activeTraderAddresses={activeTraderAddress}
      deletedTraderAddresses={deletedTraderAddresses}
      handleSelectAllTraders={handleSelectAllTraders}
      handleToggleTrader={handleToggleTrader}
      buttonSx={buttonSx}
    />
  )
}

export default SelectedTraders
