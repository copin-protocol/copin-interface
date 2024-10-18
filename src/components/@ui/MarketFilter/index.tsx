import { Trans } from '@lingui/macro'
import { Exclude } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { DropdownProps } from 'rc-dropdown/lib/Dropdown'
import { useState } from 'react'

import Dropdown from 'theme/Dropdown'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { RELEASED_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { getPairsByProtocols } from 'utils/helpers/graphql'

import MarketSelection from './MarketSelection'
import PairGroup, { PairGroupFull } from './PairGroup'

// import ProtocolSelection from './ProtocolSelection'

export interface MarketFilterProps {
  // allPairs?: boolean
  menuSx?: any
  placement?: DropdownProps['placement']
  protocols: ProtocolEnum[]
  pairs: string[]
  excludedPairs: string[]
  onChangePairs: (pairs: string[], excludedPairs: string[]) => void
}

export function MarketFilter({
  menuSx = {},
  placement = 'bottomRight',
  protocols,
  pairs,
  onChangePairs,
  excludedPairs,
}: // ...props
MarketFilterProps) {
  const { xl } = useResponsive()
  const protocolPairs = getPairsByProtocols(RELEASED_PROTOCOLS)
  const isCopyAll = protocolPairs.length === pairs.length
  const hasExcludingPairs = excludedPairs.length > 0 && isCopyAll
  const tooltipId = `tt_excluding_pairs_0`

  const [visible, setVisible] = useState(false)

  return (
    <Flex alignItems="start" sx={{ gap: 1, pr: 2 }}>
      <Dropdown
        menu={
          <MarketSelection
            // protocols={protocols}
            isAllPairs={isCopyAll}
            selectedPairs={pairs}
            onChangePairs={onChangePairs}
            allPairs={protocolPairs}
            excludedPairs={excludedPairs}
            handleToggleDropdown={() => setVisible(!visible)}
          />
        }
        placement={xl ? undefined : placement}
        buttonVariant="ghost"
        buttonSx={{ borderRadius: 0, border: 'none', p: 0, color: 'primary1' }}
        menuSx={{
          width: '360px',
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
          <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable>
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
