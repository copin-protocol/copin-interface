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
  return (
    <SelectTradersDropdown
      menuSx={sm ? undefined : { transform: 'translateX(10px)' }}
      allTraders={allTraders}
      selectedTraders={selectedTraders}
      handleSelectAllTraders={handleSelectAllTraders}
      handleToggleTrader={handleToggleTrader}
      tradersByProtocol={tradersByProtocol}
      buttonSx={buttonSx}
    />
  )
}

export default SelectedTraders
