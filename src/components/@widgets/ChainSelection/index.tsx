import { Trans } from '@lingui/macro'
import debounce from 'lodash/debounce'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'

import { Button } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import { ControlledCheckbox } from 'theme/Checkbox/ControlledCheckBox'
import Dropdown from 'theme/Dropdown'
import { InputSearch } from 'theme/Input'
import { Box, Flex, Grid, Image, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'
import { parseChainImage } from 'utils/helpers/transform'

import IconGroup from '../IconGroup'

interface ChainSelectionProps {
  selectedChains: string[] | undefined
  onApply: (chains: string[] | undefined) => void
  onReset: () => void
}

export function ChainFilterDropdown(props: ChainSelectionProps) {
  const [visible, setVisible] = useState(false)
  const _onApply: ChainSelectionProps['onApply'] = (args) => {
    setVisible(false)
    props.onApply(args)
  }
  const _onReset: ChainSelectionProps['onReset'] = () => {
    setVisible(false)
    props.onReset()
  }
  return (
    <Flex alignItems="start" sx={{ gap: 1, pr: 3 }}>
      <Dropdown
        menu={<ChainSelection selectedChains={props.selectedChains} onApply={_onApply} onReset={_onReset} />}
        placement={'bottomRight'}
        buttonVariant="ghost"
        buttonSx={{ borderRadius: 0, border: 'none', p: 0, color: 'primary1' }}
        menuSx={{
          width: [300, 600, 600, 900],
          py: 3,
        }}
        sx={{ minWidth: 'fit-content' }}
        hasArrow={true}
        dismissible={false}
        visible={visible}
        setVisible={setVisible}
        menuDismissible
      >
        {!props.selectedChains || props.selectedChains.length === 0 ? (
          <Trans>All Chain</Trans>
        ) : (
          <IconGroup iconNames={props.selectedChains} size={20} iconUriFactory={parseChainImage} />
        )}
      </Dropdown>
    </Flex>
  )
}

export function ChainSelection({ selectedChains, onApply, onReset }: ChainSelectionProps) {
  const [chainSelections, setChainSelections] = useState(PROTOCOL_CHAIN)
  const [_selectedChains, _setSelectedChains] = useState<string[] | null>(null)
  const hasSelected = !!_selectedChains?.length
  const isSelectedAll = (_selectedChains?.length ?? 0) === chainSelections.length
  const handleClickSelectedAll = () => {
    if (hasSelected) {
      _setSelectedChains([])
    } else {
      _setSelectedChains(chainSelections)
    }
  }
  useEffect(() => {
    if (selectedChains?.length) {
      _setSelectedChains(selectedChains)
      return
    }
    _setSelectedChains(PROTOCOL_CHAIN)
  }, [selectedChains])
  const handleClickChainItem = ({ isActive, chainName }: { isActive: boolean; chainName: string }) => {
    _setSelectedChains((prev) => {
      if (isActive) {
        return prev?.filter((c) => c !== chainName) ?? []
      } else {
        return [...(prev ?? []), chainName]
      }
    })
  }

  const inputRef = useRef<HTMLInputElement>(null)
  const showClearSearchButtonRef = useRef(false)

  const handleChangeSearch = useMemo(() => {
    return debounce((e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) {
        showClearSearchButtonRef.current = true
      } else {
        showClearSearchButtonRef.current = false
      }
      setChainSelections(PROTOCOL_CHAIN.filter((v) => !!v.toUpperCase().includes(e.target.value.toUpperCase())))
    }, 200)
  }, [])
  const handleClearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    showClearSearchButtonRef.current = false
    setChainSelections(PROTOCOL_CHAIN)
  }

  const _handleApply = () => {
    handleClearSearch()
    if (isSelectedAll || !hasSelected) {
      onApply(undefined)
      return
    }
    if (hasSelected) onApply(_selectedChains)
  }
  const _handleReset = () => {
    handleClearSearch()
    onReset()
  }

  if (_selectedChains === null) return null
  return (
    <Box
      sx={{
        px: 3,
        position: 'relative',
        '.checkbox': { marginRight: '0px !important' },
      }}
    >
      <InputSearch
        block
        ref={inputRef}
        onChange={handleChangeSearch}
        onClear={handleClearSearch}
        placeholder="Search Pair"
        iconSize={16}
        sx={{
          p: '4px 8px',
          flex: 1,
          border: 'none',
          bg: 'neutral5',
          '& input': { fontSize: '16px !important' },
          '&:hover:not([disabled]), &:focus:not([disabled]), &:focus-within:not([disabled])': { bg: 'neutral5' },
          ...(showClearSearchButtonRef.current
            ? {
                '& button.search-btn--clear': {
                  visibility: 'visible',
                },
              }
            : {}),
        }}
      />
      <Box my="16px">
        <Flex sx={{ gap: [1, 2], alignItems: 'center', justifyContent: 'space-between' }} flexWrap={'wrap'}>
          <Flex alignItems={'center'} sx={{ gap: [1, 2] }}>
            <Checkbox
              hasClear={hasSelected}
              checked={isSelectedAll}
              onChange={!!chainSelections?.length ? () => handleClickSelectedAll() : undefined}
              wrapperSx={{ height: 'auto', '*': { cursor: !!chainSelections?.length ? 'pointer' : 'not-allowed' } }}
              disabled={!chainSelections?.length}
            >
              <Type.CaptionBold mx={2} color="neutral1">
                <Trans>Selected</Trans>:
              </Type.CaptionBold>
              <Type.CaptionBold color="neutral3">
                {`${formatNumber(_selectedChains?.length ?? 0)}`}/{formatNumber(PROTOCOL_CHAIN.length)}
              </Type.CaptionBold>
            </Checkbox>
          </Flex>
        </Flex>
      </Box>
      {/* RENDER CHAINS */}
      <Box sx={{ maxHeight: '500px', overflow: 'auto' }}>
        <Grid
          sx={{
            gridTemplateColumns: ['repeat(auto-fill, minmax(160px, 1fr))'],
            gap: 1,
          }}
        >
          {[...chainSelections].sort().map((chainName) => {
            const isActive = _selectedChains?.includes(chainName)
            return (
              <ChainSelectItem
                key={chainName}
                isActive={isActive}
                chainName={chainName}
                onClick={handleClickChainItem}
              />
            )
          })}
        </Grid>
      </Box>
      {/* RENDER TOGGLE BUTTON */}
      <Flex
        sx={{
          bottom: 0,
          width: '100%',
          position: 'sticky',
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: 'neutral7',
          gap: [3, 24],
          px: 2,
          pt: 3,
          zIndex: 1000,
        }}
      >
        <Button variant="ghost" onClick={_handleReset} sx={{ fontWeight: 400, p: 0 }}>
          Reset
        </Button>
        <Button variant="ghostPrimary" onClick={_handleApply} sx={{ fontWeight: 400, p: 0 }} disabled={!hasSelected}>
          Apply & Save
        </Button>
      </Flex>
    </Box>
  )
}

function ChainSelectItem({
  chainName,
  isActive,
  onClick,
}: {
  chainName: string
  isActive: boolean
  onClick: (args: { isActive: boolean; chainName: string }) => void
}) {
  return (
    <Flex
      sx={{
        alignItems: 'center',
        px: 2,
        height: 48,
        width: '100%',
        bg: 'neutral6',
        // backgroundColor: isActive ? 'neutral5' : 'neutral6',
        borderRadius: 'sm',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'neutral5',
        },
      }}
      onClick={() => onClick({ isActive, chainName })}
    >
      <Flex sx={{ alignItems: 'center' }}>
        <ControlledCheckbox checked={isActive} />
        <Image ml={10} src={parseChainImage(chainName)} width={28} height={28} />
        <Type.Caption ml={2}>{chainName}</Type.Caption>
      </Flex>
    </Flex>
  )
}

export const PROTOCOL_CHAIN = [
  'Optimism',
  'Arbitrum',
  'BNB',
  'Base',
  'Polygon',
  'Blast',
  'Mode',
  // 'Linea',
  'Mantle',
  // 'Taiko',
  'opBNB',
  'Scroll',
  'Hyperliquid',
  'Fantom',
  'dYdX',
]
