import { Trans } from '@lingui/macro'
import { CaretLeft, Check, CheckCircle, Gear, Trash } from '@phosphor-icons/react'
import { Fragment, ReactNode, useCallback, useMemo, useState } from 'react'
import { FixedSizeList } from 'react-window'
import styled from 'styled-components/macro'
import { v4 as uuid } from 'uuid'

import UncontrolledInputSearch, { useUncontrolledInputSearchHandler } from 'components/@widgets/UncontrolledInputSearch'
import { Button } from 'theme/Buttons'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { overflowEllipsis } from 'utils/helpers/css'

import Divider from '../Divider'
import Market from '../MarketGroup/Market'

const StyledList = styled(FixedSizeList)`
  ::-webkit-scrollbar {
    border: none;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
  }
`

type Option = { value: string; label: string }
export interface MarketSelectionProps {
  selectedPairs: string[]
  onChangePairs: (pairs: string[], unPairs: string[]) => void
  allPairs: string[]
  isAllPairs: boolean
  excludedPairs: string[]
  handleToggleDropdown?: () => void
}

type State = {
  id: string
  isExcluded: boolean
  selectedPairs: Record<string, string>
  excludedPairs: Record<string, string>
}
const MarketSelection = ({
  selectedPairs,
  onChangePairs,
  allPairs,
  isAllPairs,
  excludedPairs,
  handleToggleDropdown,
}: MarketSelectionProps) => {
  // TODO: condition to disable btn save
  const fullOptions = useMemo(() => {
    return allPairs.map((pair) => ({ value: pair, label: pair }))
  }, [allPairs?.sort?.()?.join('')])

  const [state, setState] = useState<State>({
    id: '',
    isExcluded: !!excludedPairs?.length,
    selectedPairs: isAllPairs
      ? {}
      : selectedPairs.reduce((result, pair) => {
          return { ...result, [pair]: pair }
        }, {}),
    excludedPairs: excludedPairs.reduce((result, pair) => {
      return { ...result, [pair]: pair }
    }, {}),
  })
  const [savedFilter, setSavedFilter] = useState<State[]>(() => {
    const savedDataString = localStorage.getItem('open_interest_pair_filter')
    if (!savedDataString) return []
    const savedData = JSON.parse(savedDataString) as State[]
    if (!savedData?.length) return []
    return savedData
  })

  const _selectedPairs = Object.values(state.selectedPairs)
  const _excludedPairs = Object.values(state.excludedPairs)

  const handleSubmit = () => {
    const isExcluded = state.isExcluded
    const submitPairs = isExcluded ? allPairs : _selectedPairs.length ? _selectedPairs : allPairs
    const submitExcludedPairs = state.isExcluded ? _excludedPairs : []
    onChangePairs(submitPairs, submitExcludedPairs)
    const _statePairs = state.isExcluded ? _excludedPairs : _selectedPairs
    if (!_statePairs.length) {
      handleToggleDropdown?.()
      return
    }
    const isSavedFilter = savedFilter.some((filter) => {
      const _filterIsExcluded = filter.isExcluded
      const _filterPairsMapping = _filterIsExcluded ? filter.excludedPairs : filter.selectedPairs
      return (
        Object.keys(_filterPairsMapping).length === _statePairs.length &&
        _statePairs.every((pair) => !!_filterPairsMapping[pair])
      )
    })
    if (!isSavedFilter && _statePairs.length && _statePairs.length !== allPairs.length) {
      // !!(Object.keys(state.selectedPairs).length || !!(isExcluded && Object.keys(state.excludedPairs).length))
      setSavedFilter((prev) => {
        const newSavedData = [...prev, { ...state, id: uuid() }]
        localStorage.setItem('open_interest_pair_filter', JSON.stringify(newSavedData))
        return newSavedData
      })
    }
    handleToggleDropdown?.()
  }

  const _handleSelectPair = (pair: string) => {
    setState((prev) => {
      const newState = { ...prev }
      if (newState.isExcluded) {
        const newPairs = { ...newState.excludedPairs }
        if (newPairs[pair]) {
          delete newPairs[pair]
        } else {
          newPairs[pair] = pair
        }
        newState.excludedPairs = newPairs
      } else {
        const newPairs = { ...newState.selectedPairs }
        if (newPairs[pair]) {
          delete newPairs[pair]
        } else {
          newPairs[pair] = pair
        }
        newState.selectedPairs = newPairs
      }
      return newState
    })
  }
  const _handleToggleExcluded = () => {
    setState((prev) => {
      const newState = { ...prev }
      newState.isExcluded = !newState.isExcluded
      return newState
    })
  }
  const _handleSelectSavedFilter = (filter: State) => {
    setState(filter)
    setShowPreference(false)
    const _selectedPairs = Object.values(filter.selectedPairs)
    const _excludedPairs = Object.values(filter.excludedPairs)
    const submitPairs = filter.isExcluded ? allPairs : _selectedPairs.length ? _selectedPairs : allPairs
    const submitExcludedPairs = filter.isExcluded ? _excludedPairs : []
    onChangePairs(submitPairs, submitExcludedPairs)
    handleToggleDropdown?.()
  }
  const _handleDeleteSavedFilter = (id: string) => {
    setSavedFilter((prev) => {
      const newSavedData = prev.filter((v) => v.id !== id)
      localStorage.setItem('open_interest_pair_filter', JSON.stringify(newSavedData))
      return newSavedData
    })
  }
  const _selectedPairsText = _selectedPairs.join(', ')
  const _excludedPairsText = _excludedPairs.join(', ')
  const _disabledResetBtn = state.isExcluded ? !_excludedPairs.length : !_selectedPairs.length
  // const _disableApplyBtn // TODO

  const [showPreference, setShowPreference] = useState(false)

  const [filterOptions, setFilterOptions] = useState(fullOptions)
  const onChangeSearch = useCallback(
    (searchText: string | undefined) => {
      setFilterOptions(
        searchText ? fullOptions.filter((v) => !!v.value.toUpperCase().includes(searchText.toUpperCase())) : fullOptions
      )
    },
    [fullOptions]
  )
  const onClearSearch = useCallback(() => {
    setFilterOptions(fullOptions)
  }, [fullOptions])

  const { inputRef, showClearSearchButtonRef, handleChangeSearch, handleClearSearch } =
    useUncontrolledInputSearchHandler({ onChange: onChangeSearch, onClear: onClearSearch })

  const _handleReset = () => {
    setState((prev) => {
      const newState = { ...prev }
      if (newState.isExcluded) {
        newState.excludedPairs = {}
      } else {
        newState.selectedPairs = {}
      }
      return newState
    })
    handleClearSearch()
  }

  const Row = useCallback(
    ({ data, index, style }: { data: Option[]; index: number; style: any }) => {
      const cellData = data[index] as Option
      const _checkIconColor = state.isExcluded ? 'red1' : 'green2'
      const _isSelected = state.isExcluded
        ? !!state.excludedPairs[cellData.value]
        : !!state.selectedPairs[cellData.value]
      return (
        <ItemWrapper key={cellData.value} onClick={() => _handleSelectPair(cellData.value)} sx={style}>
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Market symbol={cellData.value} size={20} hasName />
            <IconBox
              icon={<Check size={16} />}
              color={_checkIconColor}
              sx={{ visibility: _isSelected ? 'visible' : 'hidden' }}
            />
          </Flex>
        </ItemWrapper>
      )
    },
    [state.excludedPairs, state.isExcluded, state.selectedPairs]
  )

  return (
    <Flex sx={{ p: 2, width: '100%', height: 330 }}>
      <Box display={showPreference ? 'flex' : 'none'} width="100%" height="100%" sx={{ flexDirection: 'column' }}>
        <Flex sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Type.BodyBold sx={{ lineHeight: '32px' }}>Preferences</Type.BodyBold>
          <IconBox
            icon={<Gear size={20} />}
            sx={{
              zIndex: 2,
              cursor: 'pointer',
              color: showPreference ? 'neutral1' : 'neutral3',
              '&:hover': { color: 'neutral2' },
              flexShrink: 0,
            }}
            onClick={() => setShowPreference((prev) => !prev)}
          />
        </Flex>
        <Divider mt={1} mb={10} />
        <Type.Caption mb={2} sx={{ lineHeight: '24px', fontWeight: 600 }} color="neutral2">
          Saved filters
        </Type.Caption>
        {!savedFilter.length && (
          <Box flex="1 0 0">
            {' '}
            <Type.Caption color="neutral2">No saved filters</Type.Caption>
          </Box>
        )}
        {!!savedFilter.length && (
          <ScrollWrapper>
            {savedFilter.map((filter) => {
              const _isExcluded = filter.isExcluded
              const _filter = _isExcluded ? filter.excludedPairs : filter.selectedPairs
              const _filterPairs = Object.values(_filter)
              const _selectedPairs = _isExcluded ? excludedPairs : isAllPairs ? [] : selectedPairs
              const _isSelected =
                !!_selectedPairs.length &&
                _selectedPairs.length === _filterPairs.length &&
                _selectedPairs.every((pair) => !!_filter[pair])
              return (
                <ItemWrapper
                  key={filter.id}
                  onClick={_isSelected ? undefined : () => _handleSelectSavedFilter(filter)}
                  sx={{
                    bg: _isSelected ? '#777E9033' : '',
                    cursor: _isSelected ? '' : 'pointer',
                    gap: 2,
                    '&:hover': {
                      bg: '#777E9033',
                      '.icon_delete, .icon_apply': { display: 'block' },
                    },
                  }}
                >
                  <Flex flex={1} key={filter.id} sx={{ alignItems: 'center', gap: 2, width: '100%' }}>
                    <Type.Caption
                      color={_isSelected ? 'neutral1' : 'neutral2'}
                      sx={{ flex: '1 0 0', ...overflowEllipsis() }}
                    >
                      {_isExcluded
                        ? _filterPairs.map((v, index) => (
                            <Fragment key={v}>
                              <Box as="span" sx={{ textDecoration: 'line-through' }}>
                                {v}
                              </Box>
                              {index + 1 === _excludedPairs.length || _filterPairs.length === 1 ? '' : ', '}
                            </Fragment>
                          ))
                        : _filterPairs.join(', ')}
                    </Type.Caption>
                  </Flex>
                  {!_isSelected && (
                    <IconBox
                      className="icon_apply"
                      icon={<CheckCircle size={16} />}
                      color="neutral1"
                      sx={{ display: 'none', '&:hover': { color: 'neutral2' } }}
                      // sx={{ color: _isSelected ? 'neutral1' : 'neutral2', '&:hover': { color: 'neutral2' } }}
                    />
                  )}
                  <IconBox
                    className="icon_delete"
                    icon={<Trash size={16} />}
                    sx={{ display: 'none', color: 'red1', '&:hover': { color: 'red2' }, cursor: 'pointer' }}
                    onClick={(e: any) => {
                      e?.stopPropagation()
                      _handleDeleteSavedFilter(filter.id)
                    }}
                  />
                </ItemWrapper>
              )
            })}
          </ScrollWrapper>
        )}
        <Flex mt={2} mb={1} sx={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Flex
            sx={{ alignItems: 'center', gap: 1, cursor: 'pointer', '&:hover': { color: 'neutral2' } }}
            onClick={() => setShowPreference(false)}
          >
            <CaretLeft size={16} />
            <Type.Caption sx={{ lineHeight: '24px', fontWeight: 600 }}>
              <Trans>Back To Select</Trans>
            </Type.Caption>
          </Flex>
        </Flex>
      </Box>

      <Box
        display={showPreference ? 'none' : 'flex'}
        flex="1 0 0"
        sx={{ '& *': { fontSize: '13px !important' }, width: '100%', flexDirection: 'column' }}
      >
        <Flex
          mb={10}
          sx={{
            width: '100%',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <UncontrolledInputSearch
            inputRef={inputRef}
            showClearSearchButtonRef={showClearSearchButtonRef}
            onChange={handleChangeSearch}
            onClear={handleClearSearch}
          />

          <IconBox
            icon={<Gear size={20} />}
            sx={{
              zIndex: 2,
              cursor: 'pointer',
              color: showPreference ? 'neutral1' : 'neutral3',
              '&:hover': { color: 'neutral2' },
              flexShrink: 0,
            }}
            onClick={() => setShowPreference((prev) => !prev)}
          />
        </Flex>
        <StyledList
          width={232}
          height={200}
          itemCount={filterOptions.length}
          itemSize={30}
          itemData={filterOptions}
          overscanCount={20}
        >
          {Row as any}
        </StyledList>
        <Divider my={10} />
        <Type.Caption color="neutral2" mb={'4px'} sx={{ width: '100%', lineHeight: '24px', ...overflowEllipsis() }}>
          {state.isExcluded
            ? _excludedPairsText
              ? `All Pairs & Excluded: ${_excludedPairsText}`
              : 'All Pairs & Not Excluded'
            : !!_selectedPairsText
            ? `Selected: ${_selectedPairsText}`
            : 'Selected All Pairs'}
        </Type.Caption>
        <Flex mb={1} sx={{ width: '100%', alignItems: 'center', height: '24px', justifyContent: 'space-between' }}>
          <SwitchInputField
            switchLabel={'Exclude Mode'}
            labelColor="neutral2"
            checked={state.isExcluded}
            wrapperSx={{
              width: 'max-content',
              flexDirection: 'row-reverse',
              '*': { fontWeight: '400 !important' },
              '& .slider': { bg: state.isExcluded ? `${themeColors.red1} !important` : '' },
            }}
            onChange={_handleToggleExcluded}
          />
          <Box sx={{ height: '16px', width: '1px', flexShrink: 0, bg: 'neutral4' }} />

          <Flex
            sx={{
              alignItems: 'center',
              gap: 12,
            }}
            pr={8}
          >
            <Button variant="ghost" disabled={_disabledResetBtn} onClick={_handleReset} sx={{ fontWeight: 400, p: 0 }}>
              Clear
            </Button>
            <Button
              variant="ghostPrimary"
              onMouseDown={handleSubmit}
              onClick={handleSubmit}
              sx={{ fontWeight: 400, p: 0 }}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}

export default MarketSelection

function ItemWrapper({
  children,
  onClick,
  sx = {},
}: {
  children: ReactNode
  onClick: (() => void) | undefined
  sx?: any
}) {
  return (
    <Flex
      onClick={onClick}
      sx={{
        width: '100%',
        px: 2,
        height: 28,
        flexShrink: 0,
        alignItems: 'center',
        borderRadius: '2px',
        cursor: 'pointer',
        '&:hover': { bg: '#777E9033' },
        ...sx,
      }}
    >
      {children}
    </Flex>
  )
}

function ScrollWrapper({ children }: { children: ReactNode }) {
  return (
    <Flex
      sx={{
        flex: '1 0 0',
        overflow: 'auto',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
        '::-webkit-scrollbar': {
          border: 'none',
        },
        '::-webkit-scrollbar-thumb': {
          borderRadius: '4px',
        },
      }}
    >
      {children}
    </Flex>
  )
}
