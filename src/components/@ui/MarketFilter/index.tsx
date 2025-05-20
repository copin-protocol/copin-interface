import { useResponsive } from 'ahooks'
import { DropdownProps } from 'rc-dropdown/lib/Dropdown'
import { Fragment, ReactNode, useState } from 'react'

import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import Dropdown from 'theme/Dropdown'
import { Flex } from 'theme/base'

import MarketSelection from './MarketSelection'
import { SelectedMarkets } from './SelectedMarkets'

export interface MarketFilterProps {
  menuSx?: any
  placement?: DropdownProps['placement']
  pairs: string[]
  excludedPairs: string[]
  onChangePairs: (pairs: string[], excludedPairs: string[]) => void
  menuWrapper?: any
  titleSuffix?: ReactNode
  iconSize?: number
  allowedFilter?: boolean
}

export function MarketFilter({
  menuSx = {},
  placement = 'bottomRight',
  pairs,
  onChangePairs,
  excludedPairs,
  menuWrapper: MenuWrapper = Fragment,
  titleSuffix,
  iconSize,
  allowedFilter,
}: MarketFilterProps) {
  const { xl } = useResponsive()
  const { getListSymbol } = useMarketsConfig()
  const protocolPairs = getListSymbol?.()
  const isCopyAll = protocolPairs?.length === pairs.length

  const [visible, setVisible] = useState(false)

  return (
    <Flex alignItems="start" sx={{ gap: 1, pr: 2 }}>
      <Dropdown
        iconSize={iconSize}
        buttonVariant="ghostPrimary"
        menu={
          allowedFilter ? (
            <MenuWrapper isFilterPair>
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
            </MenuWrapper>
          ) : (
            <></>
          )
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
        <SelectedMarkets pairs={pairs} excludedPairs={excludedPairs} titleSuffix={titleSuffix} />
      </Dropdown>
    </Flex>
  )
}
