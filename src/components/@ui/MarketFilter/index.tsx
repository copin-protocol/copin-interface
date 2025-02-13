import { Trans } from '@lingui/macro'
import { Exclude } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { DropdownProps } from 'rc-dropdown/lib/Dropdown'
import { useState } from 'react'

import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import Dropdown from 'theme/Dropdown'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'

import MarketSelection from './MarketSelection'
import PairGroup, { PairGroupFull } from './PairGroup'

// import ProtocolSelection from './ProtocolSelection'

export interface MarketFilterProps {
  // allPairs?: boolean
  menuSx?: any
  placement?: DropdownProps['placement']
  pairs: string[]
  excludedPairs: string[]
  onChangePairs: (pairs: string[], excludedPairs: string[]) => void
}

export function MarketFilter({
  menuSx = {},
  placement = 'bottomRight',
  pairs,
  onChangePairs,
  excludedPairs,
}: // ...props
MarketFilterProps) {
  const { xl } = useResponsive()
  const { getListSymbol } = useMarketsConfig()
  const protocolPairs = getListSymbol?.()
  const isCopyAll = protocolPairs?.length === pairs.length
  const hasExcludingPairs = excludedPairs.length > 0 && isCopyAll
  const tooltipId = `tt_excluding_pairs_0`

  const [visible, setVisible] = useState(false)

  return (
    <Flex alignItems="start" sx={{ gap: 1, pr: 2 }}>
      <Dropdown
        buttonVariant="ghostPrimary"
        menu={
          <MarketSelection
            key={visible.toString()}
            // protocols={protocols}
            isAllPairs={isCopyAll}
            selectedPairs={pairs}
            onChangePairs={onChangePairs}
            allPairs={protocolPairs ?? []}
            excludedPairs={excludedPairs}
            handleToggleDropdown={() => setVisible(!visible)}
          />
        }
        placement={xl ? undefined : placement}
        inline
        menuSx={{
          width: '250px',
          bg: '#0B0E18CC',
          backdropFilter: 'blur(10px)',
          // maxWidth: menuSx.maxWidth ? menuSx.maxWidth : '330px',
          // maxHeight: '50svh',
          // py: 2,
          ...menuSx,
        }}
        sx={{ minWidth: 'fit-content' }}
        hasArrow={true}
        dismissible={false}
        visible={visible}
        setVisible={setVisible}
        menuDismissible
      >
        {/* TODO: Change this later */}
        {isCopyAll ? (
          <Flex width="100%" justifyContent="flex-start" alignItems="center" sx={{ gap: 1 }}>
            {hasExcludingPairs && (
              <Exclude color={`${themeColors.red1}80`} data-tooltip-id={hasExcludingPairs ? tooltipId : undefined} />
            )}
            <Trans>All pairs</Trans>
          </Flex>
        ) : (
          <PairGroup pairs={pairs} />
        )}

        {hasExcludingPairs && (
          <Tooltip id={tooltipId} clickable>
            <Box>
              <Type.Caption mb={1} width="100%" color="neutral3" textAlign="left">
                Excluding pairs:
              </Type.Caption>
              <PairGroupFull
                pairs={excludedPairs}
                hasName
                sx={{
                  maxWidth: 400,
                  maxHeight: 350,
                  overflowY: 'auto',
                  justifyContent: 'flex-start',
                }}
              />
            </Box>
          </Tooltip>
        )}
      </Dropdown>
    </Flex>
  )
}
