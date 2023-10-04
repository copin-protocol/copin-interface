import { CopyTradeData } from 'entities/copyTrade'
import { ProtocolEnum } from 'utils/config/enums'

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
  const tradersByProtocol = allCopyTrades?.reduce((result, copyTrade) => {
    result[copyTrade.protocol] = [
      ...(result[copyTrade.protocol] ?? []),
      { address: copyTrade.account, status: 'copying' },
    ]
    return result
  }, {} as TradersByProtocolData)

  if (!!tradersByProtocol) {
    Object.entries(tradersByProtocol).forEach(([protocol]) => {
      tradersByProtocol[protocol as ProtocolEnum] = tradersByProtocol[protocol as ProtocolEnum].filter((data) =>
        allTraders.includes(data.address)
      )
    })
  }

  if (!tradersByProtocol) return <></>
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
