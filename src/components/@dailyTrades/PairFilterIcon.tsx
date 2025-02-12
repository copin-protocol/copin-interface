import { Trans } from '@lingui/macro'
import { Funnel } from '@phosphor-icons/react'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { createGlobalStyle } from 'styled-components/macro'

import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import { Button } from 'theme/Buttons'
import Dropdown from 'theme/Dropdown'
import Select from 'theme/Select'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { getPairFromSymbol } from 'utils/helpers/transform'

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
  changePairs,
}: {
  pairs: string[] | undefined
  changePairs: (pairs: string[] | undefined) => void
  title?: ReactNode
}) {
  const { getListSymbol } = useMarketsConfig()
  const { fullOptions, allPairs } = useMemo(() => {
    const listAllSymbol = getListSymbol?.()
    const allPairs = listAllSymbol?.map((symbol) => getPairFromSymbol(symbol)) ?? []
    const options = listAllSymbol?.map((symbol) => ({ value: getPairFromSymbol(symbol), label: symbol })) ?? []
    return { fullOptions: options, allPairs }
  }, [getListSymbol])
  const [visible, setVisible] = useState(false)
  const applyChangePairs = (_pairs: string[] | undefined) => {
    if (_pairs?.length) {
      changePairs(_pairs)
    } else {
      changePairs(undefined)
    }
    setVisible(false)
  }
  const resetPairs = () => {
    changePairs(undefined)
    setVisible(false)
  }
  const hasFilter = !!pairs?.length

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
        <Box sx={{ p: 3, width: '330px' }}>
          <MarketSelection
            fullOptions={fullOptions}
            allPairs={allPairs}
            defaultPairs={pairs?.length ? pairs : allPairs}
            onApply={applyChangePairs}
            onReset={resetPairs}
          />
        </Box>
      }
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

export interface MarketSelectionProps {
  defaultPairs: string[]
  allPairs: string[]
  fullOptions: { value: string; label: string }[]
  onApply: (pairs: string[]) => void
  onReset: () => void
}

const MarketSelection = ({ defaultPairs, allPairs, fullOptions, onApply, onReset }: MarketSelectionProps) => {
  const [isScaling, setIsScaling] = useState(false)

  const [isSelectAll, setIsSelectAll] = useState(false)
  const [currentOptions, setOptions] = useState<{ label: any; value: string }[]>([])
  useEffect(() => {
    if (defaultPairs.length === allPairs.length) {
      setIsSelectAll(true)
    } else {
      setIsScaling(true)
      setOptions(fullOptions.filter((option) => defaultPairs.includes(option.value)))
    }
  }, [allPairs.length, defaultPairs, fullOptions])

  // const disabledResetBtn = copyAll && chosenPairs.length == 0 && chosenExcludedPairs.length == 0
  const toggleSelectAll = (e: any) => {
    const isChecked = !!e?.target?.checked
    setIsScaling(!isChecked)
    setIsSelectAll(isChecked)
  }

  const resetPairs = () => {
    setIsSelectAll(true)
    setOptions([])
    setIsScaling(false)
    onReset()
  }
  const applySelect = () => {
    if (isSelectAll) {
      onApply([])
    } else {
      onApply(currentOptions.map((o) => o.value))
    }
  }

  return (
    <Box sx={{ transition: 'height 500ms' }}>
      <GlobalStyle />
      <Type.BodyBold mb={3}>
        <Trans>Trading Pairs</Trans>
      </Type.BodyBold>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <SwitchInputField
          switchLabel={`All pairs ${!isSelectAll ? `(${currentOptions.length})` : ''}`}
          labelColor="neutral1"
          checked={isSelectAll}
          wrapperSx={{
            flexDirection: 'row-reverse',
            '*': { fontWeight: 400 },
            '& *': { fontWeight: 'normal !important' },
          }}
          onChange={toggleSelectAll}
        />
      </Flex>
      <Box display={isSelectAll ? 'none' : 'flex'} sx={{ alignItems: 'center', gap: 3, mt: 3 }}>
        <Select
          menuIsOpen={isScaling}
          closeMenuOnSelect={false}
          className="select-container daily_trades_select_pairs"
          options={fullOptions}
          value={currentOptions}
          // onMenuOpen={() => setIsScaling(true)}
          // onMenuClose={() => setIsScaling(false)}
          onChange={(newValue: any) => {
            setOptions(newValue)
          }}
          components={{
            DropdownIndicator: () => <div></div>,
          }}
          isSearchable
          isMulti
        />
      </Box>
      {isSelectAll && !isScaling && (
        <Type.Caption color="neutral3" mt={2}>
          <Trans>Toggle to select specific pairs</Trans>
        </Type.Caption>
      )}
      <Box height={isScaling ? 270 : 16} />
      <Flex
        sx={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: 'neutral7',
          gap: [3, 24],
          // bottom: '20px',
          // px: 2,
          zIndex: 1000,
        }}
      >
        <Button variant="ghost" onClick={resetPairs} sx={{ fontWeight: 400, p: 0 }}>
          Reset
        </Button>
        <Button variant="ghostPrimary" onClick={applySelect} sx={{ fontWeight: 400, p: 0 }}>
          Apply
        </Button>
      </Flex>
    </Box>
  )
}

export default MarketSelection

export const MarketSelect = ({
  pairs,
  onChange,
}: {
  pairs: string[] | undefined
  onChange: (pairs: string[] | undefined) => void
}) => {
  const { getListSymbol } = useMarketsConfig()
  const { fullOptions } = useMemo(() => {
    const listAllSymbol = getListSymbol?.()
    // const allPairs = listAllSymbol.map((symbol) => getPairFromSymbol(symbol))
    const options = listAllSymbol?.map((symbol) => ({ value: getPairFromSymbol(symbol), label: symbol })) ?? []
    return { fullOptions: options }
  }, [getListSymbol])
  const [isSelectAll, setIsSelectAll] = useState(pairs?.length ? false : true)

  const toggleSelectAll = (e: any) => {
    const isChecked = !!e?.target?.checked
    setIsSelectAll(isChecked)
    onChange(undefined)
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
      </Flex>
      <Box display={isSelectAll ? 'none' : 'flex'} sx={{ alignItems: 'center', gap: 3, mt: 3 }}>
        <Select
          closeMenuOnSelect={false}
          className="select-container daily_trades_select_pairs"
          options={fullOptions}
          value={fullOptions.filter((o) => pairs?.includes(o.value))}
          onChange={(newValue: any) => {
            onChange(newValue.map((o: any) => o.value))
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
