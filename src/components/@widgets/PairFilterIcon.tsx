import { Trans } from '@lingui/macro'
import { Funnel } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { createGlobalStyle } from 'styled-components/macro'

import TableFilterMenuWrapper from 'components/@subscription/TableFilterMenuWrapper'
import MarketSelection from 'components/@ui/MarketFilter/MarketSelection'
import { useFilterPairs } from 'hooks/features/useFilterPairs'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import Dropdown from 'theme/Dropdown'
import Select from 'theme/Select'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { getSymbolFromPair } from 'utils/helpers/transform'

const GlobalStyle = createGlobalStyle`
  .daily_trades_select_pairs {
    .select__value-container {
      max-height: 150px;
      overflow: auto;
    }
  }
`

export function PairFilterIcon({
  pairs,
  excludedPairs,
  changePairs,
  requiredPlan,
}: {
  pairs: string[]
  excludedPairs: string[]
  changePairs: (pairs: string[], excludedPairs: string[]) => void
  requiredPlan?: SubscriptionPlanEnum
}) {
  const { getListSymbol } = useMarketsConfig()
  const [visible, setVisible] = useState(false)
  const protocolPairs = getListSymbol?.()
  const isCopyAll = protocolPairs?.length === pairs.length
  const hasExcludingPairs = excludedPairs.length > 0 && isCopyAll
  const hasFilter = (pairs.length > 0 || excludedPairs.length > 0) && (!isCopyAll || hasExcludingPairs)

  return (
    <Dropdown
      buttonVariant="ghostInactive"
      inline
      menuDismissible
      dismissible={false}
      visible={visible}
      setVisible={setVisible}
      hasArrow={false}
      menu={
        <TableFilterMenuWrapper requiredPlan={requiredPlan}>
          <MarketSelection
            key={visible.toString()}
            // protocols={protocols}
            isAllPairs={isCopyAll}
            selectedPairs={pairs}
            onChangePairs={changePairs}
            allPairs={protocolPairs ?? []}
            excludedPairs={excludedPairs}
            handleToggleDropdown={() => setVisible(!visible)}
          />
        </TableFilterMenuWrapper>
      }
      menuSx={{
        width: '250px',
        bg: '#0B0E18CC',
        backdropFilter: 'blur(10px)',
      }}
    >
      <IconBox
        role="button"
        icon={<Funnel size={16} weight={!!hasFilter ? 'fill' : 'regular'} />}
        sx={{
          transform: 'translateY(-1.5px)',
        }}
      />
    </Dropdown>
  )
}

export const MarketSelect = ({
  pairs,
  excludedPairs,
  onChange,
}: {
  pairs: string[]
  excludedPairs: string[]
  onChange: (pairs: string[], excludedPairs: string[]) => void
}) => {
  const { getListSymbol } = useMarketsConfig()
  const { fullOptions } = useMemo(() => {
    const listAllSymbol = getListSymbol?.()
    // const allPairs = listAllSymbol.map((symbol) => getPairFromSymbol(symbol))
    const options = listAllSymbol?.map((symbol) => ({ value: getSymbolFromPair(symbol), label: symbol })) ?? []
    return { fullOptions: options }
  }, [getListSymbol])
  const { isCopyAll, hasExcludingPairs } = useFilterPairs({ pairs, excludedPairs })
  const [isSelectAll, setIsSelectAll] = useState(isCopyAll)
  const [isSelectExcluded, setIsSelectExcluded] = useState(hasExcludingPairs)

  const toggleSelectAll = (e: any) => {
    const isChecked = !!e?.target?.checked
    setIsSelectAll(isChecked)
    setIsSelectExcluded(false)
    onChange([], [])
  }
  const toggleExcluded = (e: any) => {
    const isChecked = !!e?.target?.checked
    setIsSelectExcluded(isChecked)
    setIsSelectAll(true)
    onChange([], [])
  }
  return (
    <Box sx={{ transition: 'height 500ms' }}>
      <GlobalStyle />
      <Type.CaptionBold mb={2}>
        <Trans>Trading Pairs</Trans>
      </Type.CaptionBold>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <SwitchInputField
          switchLabel={`All pairs ${!isSelectAll ? `(${pairs?.length ?? 0})` : ''}`}
          labelColor="neutral1"
          checked={isSelectAll}
          wrapperSx={{ flexDirection: 'row-reverse', '*': { fontWeight: 400 } }}
          onChange={toggleSelectAll}
        />
        <SwitchInputField
          switchLabel={`Exclude ${isCopyAll ? `(${excludedPairs?.length ?? 0})` : ''}`}
          labelColor="neutral3"
          checked={isSelectExcluded}
          wrapperSx={{
            flexDirection: 'row-reverse',
            '*': { fontWeight: 400 },
          }}
          disabled={!isSelectAll}
          onChange={toggleExcluded}
        />
      </Flex>
      <Box display={!isSelectAll || isSelectExcluded ? 'flex' : 'none'} sx={{ alignItems: 'center', gap: 3, mt: 3 }}>
        <Select
          closeMenuOnSelect={false}
          className="select-container daily_trades_select_pairs"
          options={fullOptions}
          value={fullOptions.filter((o) => {
            if (isSelectExcluded) return excludedPairs.includes(o.value)
            if (!isCopyAll) return pairs?.includes(o.value)
            return false
          })}
          onChange={(newValue: any) => {
            if (isSelectExcluded) {
              onChange(
                pairs,
                newValue.map((o: any) => o.value)
              )
              return
            }
            if (!isSelectAll) {
              onChange(
                newValue.map((o: any) => o.value),
                excludedPairs
              )
            }
          }}
          components={{
            DropdownIndicator: () => <div></div>,
          }}
          isSearchable
          isMulti
          blurInputOnSelect={false}
        />
      </Box>
    </Box>
  )
}
