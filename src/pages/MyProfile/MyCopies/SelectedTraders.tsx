import { CopyTradeData } from 'entities/copyTrade'

import SelectTradersDropdown, { TradersByProtocolData } from '../SelectTradersDropdown'

function SelectedTraders({
  allTraders,
  selectedTraders,
  handleToggleTrader,
  handleSelectAllTraders,
  allCopyTrades,
}: {
  allTraders: string[] // to check two request has same addresses
  selectedTraders: string[]
  allCopyTrades: CopyTradeData[] | undefined
  handleToggleTrader: (key: string) => void
  handleSelectAllTraders: (isSelectedAll: boolean) => void
}) {
  const checkerMapping: Record<string, boolean> = {}
  const tradersByProtocol = allCopyTrades?.reduce((result, copyTrade) => {
    if (checkerMapping[copyTrade.account] || !allTraders.includes(copyTrade.account)) return result
    checkerMapping[copyTrade.account] = true
    result[copyTrade.protocol] = [
      ...(result[copyTrade.protocol] ?? []),
      { address: copyTrade.account, status: 'copying' },
    ]
    return result
  }, {} as TradersByProtocolData)

  if (!tradersByProtocol || !allTraders.length) return <></>
  return (
    <SelectTradersDropdown
      allTraders={allTraders}
      selectedTraders={selectedTraders}
      handleSelectAllTraders={handleSelectAllTraders}
      handleToggleTrader={handleToggleTrader}
      tradersByProtocol={tradersByProtocol}
    />
  )
}

export default SelectedTraders
