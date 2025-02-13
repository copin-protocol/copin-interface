import { ReactNode, cloneElement, useRef } from 'react'

import { TraderOpeningPositionsListViewProps } from 'components/@position/TraderOpeningPositions'
import useSearchParams from 'hooks/router/useSearchParams'
import { TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'

enum TabKeyEnum {
  OPENING = 'opening',
  CLOSED = 'closed',
}
const TABS = [
  { key: TabKeyEnum.OPENING, name: 'Opening Positions' },
  { key: TabKeyEnum.CLOSED, name: 'History' },
]

export default function PositionMobileView({
  historyPositions,
  openingPositions,
}: {
  historyPositions: ReactNode
  openingPositions: ReactNode
}) {
  const { searchParams, setSearchParams } = useSearchParams()
  const currentTabKey = searchParams['position_tab'] ?? TabKeyEnum.OPENING
  const handleChangeTab = (key: string) => setSearchParams({ ['position_tab']: key })
  const firstLoadedRef = useRef(!!searchParams['position_tab'] ? true : false)
  const handleNoOpeningPositionsLoaded = () => {
    if (firstLoadedRef.current) return
    firstLoadedRef.current = true
    handleChangeTab(TabKeyEnum.CLOSED)
  }
  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
      <TabHeader
        configs={TABS}
        isActiveFn={(config) => config.key === currentTabKey}
        onClickItem={handleChangeTab}
        hasLine
      />
      <Box flex="1 0 0">
        {currentTabKey === TabKeyEnum.OPENING &&
          cloneElement<TraderOpeningPositionsListViewProps>(openingPositions as any, {
            onNoPositionLoaded: handleNoOpeningPositionsLoaded,
          })}
        {currentTabKey === TabKeyEnum.CLOSED && historyPositions}
      </Box>
    </Flex>
  )
}
