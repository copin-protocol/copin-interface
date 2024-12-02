import { ReactNode, useState } from 'react'

import MarketSelection from 'components/@ui/MarketFilter/MarketSelection'
import useMarketsConfig from 'hooks/helpers/useMarketsConfig'
import Dropdown from 'theme/Dropdown'
import { Flex } from 'theme/base'

export function FilterPairDropdown({
  currentPairs,
  isExcluded,
  onChangePairs,
  children,
  hasArrow = false,
}: {
  currentPairs: string[]
  isExcluded: boolean
  onChangePairs: (pairs: string[], unPairs: string[]) => void
  children: ReactNode
  hasArrow?: boolean
}) {
  const [visible, setVisible] = useState(false)
  const { getListSymbol } = useMarketsConfig()
  const allPairs = getListSymbol()
  const isCopyAll = !isExcluded && currentPairs.length === allPairs?.length
  const selectedPairs = isExcluded ? [] : currentPairs
  const excludedPairs = isExcluded ? currentPairs : []
  return (
    <Dropdown
      buttonSx={{ p: 0, border: 'none' }}
      hasArrow={hasArrow}
      menuDismissible
      dismissible={false}
      visible={visible}
      setVisible={setVisible}
      menu={
        <Flex sx={{ flexDirection: 'column', bg: 'neutral7', p: 2, width: 250 }}>
          <MarketSelection
            key={visible.toString()}
            // protocols={protocols}
            isAllPairs={isCopyAll}
            selectedPairs={selectedPairs}
            onChangePairs={onChangePairs}
            allPairs={allPairs}
            excludedPairs={excludedPairs}
            handleToggleDropdown={() => setVisible(!visible)}
          />
        </Flex>
      }
    >
      {children}
    </Dropdown>
  )
}
