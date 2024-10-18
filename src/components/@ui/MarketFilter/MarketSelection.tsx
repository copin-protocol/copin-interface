import { Trans } from '@lingui/macro'
import { useState } from 'react'

import { ALL_TOKEN_PARAM } from 'pages/TopOpenings/configs'
import { Button } from 'theme/Buttons'
import Select from 'theme/Select'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'

export interface MarketSelectionProps {
  selectedPairs: string[]
  onChangePairs: (pairs: string[], unPairs: string[]) => void
  allPairs: string[]
  isAllPairs: boolean
  excludedPairs: string[]
  handleToggleDropdown?: () => void
}

const MarketSelection = ({
  selectedPairs,
  onChangePairs,
  allPairs,
  isAllPairs,
  excludedPairs,
  handleToggleDropdown,
}: MarketSelectionProps) => {
  const fullOptions = allPairs.map((pair) => ({ value: pair, label: pair }))

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [copyAll, setCopyAll] = useState(isAllPairs)
  const [isExcluded, setIsExcluded] = useState(!!excludedPairs.length)
  const [chosenPairs, setChosenPairs] = useState(isAllPairs ? [] : selectedPairs)
  const [chosenExcludedPairs, setChosenExcludedPairs] = useState(excludedPairs)

  const disabledResetBtn = copyAll && chosenPairs.length == 0 && chosenExcludedPairs.length == 0
  const emptyExcludedPair = isExcluded && chosenExcludedPairs.length === 0
  const emptySelectedPairs = !copyAll && chosenPairs.length === 0

  const resizePosition = () => {
    if (isDropdownOpen && (chosenPairs.length > 0 || chosenExcludedPairs.length > 0)) return 270

    if (isDropdownOpen) return 245

    return 3
  }

  const handleSubmit = () => {
    if (emptyExcludedPair || emptySelectedPairs) return
    if (copyAll) {
      onChangePairs(allPairs, chosenExcludedPairs)
      handleToggleDropdown?.()
      return
    }
    onChangePairs(chosenPairs, chosenExcludedPairs)
    handleToggleDropdown?.()
  }

  const handleSelectAll = (isSelectAll: boolean) => {
    setCopyAll(isSelectAll)
    setIsExcluded(false)
    setChosenPairs([])
    setChosenExcludedPairs([])
  }

  const handleReset = () => {
    handleSelectAll(true)
    onChangePairs(allPairs, [])
  }

  return (
    <Box p={3} height={'fit-content'} sx={{ transition: 'height 500ms' }}>
      <Type.BodyBold mb={2}>
        <Trans>Trading Pairs</Trans>
      </Type.BodyBold>
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <SwitchInputField
          switchLabel={`All pairs ${!copyAll ? `(${chosenPairs.length})` : ''}`}
          labelColor="neutral1"
          checked={copyAll}
          wrapperSx={{ flexDirection: 'row-reverse', '*': { fontWeight: 400 } }}
          onChange={(newValue: any) => handleSelectAll(newValue.target.checked)}
        />
        {copyAll && (
          <Flex
            sx={{
              alignItems: 'center',
              '& input:checked + .slider': {
                backgroundColor: `${themeColors.red1}50 !important`,
              },
            }}
          >
            <SwitchInputField
              switchLabel={`Exclude (${chosenExcludedPairs.length})`}
              labelColor="neutral3"
              checked={isExcluded}
              wrapperSx={{
                flexDirection: 'row-reverse',
                '*': { fontWeight: 400 },
              }}
              onChange={(newValue: any) => {
                const isExcluded = newValue.target.checked
                setIsExcluded(isExcluded)
                if (!isExcluded) {
                  setChosenExcludedPairs([])
                }
              }}
            />
          </Flex>
        )}
      </Flex>
      <Box display={copyAll ? 'none' : 'flex'} sx={{ alignItems: 'center', gap: 3, mt: 3 }}>
        <Select
          closeMenuOnSelect={false}
          className="select-container pad-right-0"
          options={fullOptions}
          value={chosenPairs.map((option) => ({ value: option, label: option }))}
          onMenuOpen={() => setIsDropdownOpen(true)}
          onMenuClose={() => setIsDropdownOpen(false)}
          error={emptySelectedPairs}
          maxHeightSelectContainer={'70px'}
          blurInputOnSelect={false}
          onChange={(newValue: any, actionMeta: any) => {
            if (actionMeta?.option?.value === ALL_TOKEN_PARAM) {
              setChosenPairs(fullOptions.map((data: any) => data.value))
              return
            }
            setChosenPairs(newValue?.map((data: any) => data.value))
          }}
          components={{
            DropdownIndicator: () => <div></div>,
          }}
          isSearchable
          isMulti
        />
      </Box>
      {emptySelectedPairs && (
        <Type.Caption color="red1" mt={1} display="block">
          {'Please select at least one pair'}
        </Type.Caption>
      )}

      <Box
        display={isExcluded && copyAll ? 'flex' : 'none'}
        sx={{ alignItems: 'center', gap: 3, mt: 3 }}
        // onClick={() => setScalingDropdown(!toggleValue)}
      >
        <Select
          closeMenuOnSelect={false}
          className="select-container pad-right-0"
          options={fullOptions}
          value={chosenExcludedPairs.map((option) => ({ value: option, label: option }))}
          onMenuOpen={() => setIsDropdownOpen(true)}
          onMenuClose={() => setIsDropdownOpen(false)}
          maxHeightSelectContainer={'70px'}
          error={emptyExcludedPair}
          blurInputOnSelect={false}
          onChange={(newValue: any, actionMeta: any) => {
            setChosenExcludedPairs(newValue?.map((data: any) => data.value))
          }}
          components={{
            DropdownIndicator: () => <div></div>,
          }}
          isSearchable
          isMulti
        />
      </Box>
      {emptyExcludedPair && (
        <Type.Caption color="red1" mt={1} display="block">
          {'Please select at least one pair to exclude'}
        </Type.Caption>
      )}

      {/* <Box display={isScaling ? 'block' : 'none'} sx={{ height: '600px' }} /> */}

      <Flex
        sx={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: 'neutral7',
          gap: [3, 24],
          mt: resizePosition(),
        }}
      >
        <Button
          variant="ghost"
          disabled={disabledResetBtn}
          onMouseDown={handleReset}
          onClick={handleReset}
          sx={{ fontWeight: 400, p: 0 }}
        >
          Reset
        </Button>
        <Button
          variant="ghostPrimary"
          disabled={emptyExcludedPair || emptySelectedPairs}
          onMouseDown={handleSubmit}
          onClick={handleSubmit}
          sx={{ fontWeight: 400, p: 0 }}
        >
          Apply & Save
        </Button>
      </Flex>
    </Box>
  )
}

export default MarketSelection
