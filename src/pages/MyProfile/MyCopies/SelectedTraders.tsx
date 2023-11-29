import { CopyTradeData } from 'entities/copyTrade'
import { CopyTradeStatusEnum } from 'utils/config/enums'

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
  const checkerMapping: Record<string, { [protocol: string]: boolean }> = {}
  const tradersByProtocol = allCopyTrades?.reduce((result, copyTrade) => {
    if (checkerMapping[copyTrade.account]?.[copyTrade.protocol] || !allTraders.includes(copyTrade.account))
      return result
    checkerMapping[copyTrade.account] = { [copyTrade.protocol]: true }
    result[copyTrade.protocol] = [
      ...(result[copyTrade.protocol] ?? []),
      { address: copyTrade.account, status: copyTrade.status === CopyTradeStatusEnum.RUNNING ? 'copying' : 'deleted' },
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
