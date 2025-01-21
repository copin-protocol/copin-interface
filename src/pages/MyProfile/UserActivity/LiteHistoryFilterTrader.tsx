import {
  SelectTraderIcon,
  SelectTraderLabel,
  SelectTradersCopiedDropdown,
} from 'components/@widgets/SelectTraderCopiedDropdown'
import { useLiteActivitiesContext } from 'pages/CopinLite/Trades/useActivitiesContext'
import { useLiteContext } from 'pages/CopinLite/useCopinLiteContext'

// TODO: Merge all these same component if over 2 month no change in logic
export default function LiteActivitiesFilterTrader({ type }: { type: 'icon' | 'text' | 'textAndIcon' }) {
  const { deletedTraderAddresses, traderAddresses } = useLiteContext()

  const { selectedTraders, isSelectedAllTrader, handleToggleAllTrader, handleToggleTrader } = useLiteActivitiesContext()
  return (
    <SelectTradersCopiedDropdown
      traderAddresses={traderAddresses}
      selectedTraders={selectedTraders}
      isSelectedAllTrader={isSelectedAllTrader}
      deletedTraderAddresses={deletedTraderAddresses}
      handleToggleTrader={handleToggleTrader}
      handleSelectAllTraders={handleToggleAllTrader}
      hasArrow={false}
    >
      {type === 'icon' ? (
        <SelectTraderIcon selectedTraders={selectedTraders} />
      ) : (
        <SelectTraderLabel
          selectedTraders={selectedTraders}
          activeTraderAddresses={undefined}
          hasIcon={type === 'textAndIcon'}
        />
      )}
    </SelectTradersCopiedDropdown>
  )
}
