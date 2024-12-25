import { ReactNode, cloneElement, useRef } from 'react'

import { TraderOpeningPositionsListViewProps } from 'components/@position/TraderOpeningPositions'
import useSearchParams from 'hooks/router/useSearchParams'
import { Box, Flex, Type } from 'theme/base'

const TABS = [
  { key: 'opening', label: 'Opening Positions' },
  { key: 'closed', label: 'History' },
]

export default function PositionMobileView({
  historyPositions,
  openingPositions,
}: {
  historyPositions: ReactNode
  openingPositions: ReactNode
}) {
  const { searchParams, setSearchParams } = useSearchParams()
  const currentTabKey = searchParams['position_tab'] ?? TABS[0].key
  const handleChangeTab = (key: string) => setSearchParams({ ['position_tab']: key })
  const firstLoadedRef = useRef(!!searchParams['position_tab'] ? true : false)
  const handleNoOpeningPositionsLoaded = () => {
    if (firstLoadedRef.current) return
    firstLoadedRef.current = true
    handleChangeTab(TABS[1].key)
  }
  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Flex sx={{ alignItems: 'center', bg: 'neutral6' }}>
        {TABS.map((config) => {
          const isActive = currentTabKey === config.key
          return (
            <Box key={config.key} px={3} flex="1">
              <Type.Body
                onClick={() => handleChangeTab(config.key)}
                sx={{
                  cursor: 'pointer',
                  height: 48,
                  width: '100%',
                  lineHeight: '48px',
                  textAlign: 'center',
                  fontWeight: 600,
                  borderBottom: 'small',
                  borderBottomColor: isActive ? 'primary1' : 'transparent',
                }}
                color={isActive ? 'neutral1' : 'neutral2'}
              >
                {config.label}
              </Type.Body>
            </Box>
          )
        })}
      </Flex>
      <Box flex="1 0 0">
        {currentTabKey === TABS[0].key &&
          cloneElement<TraderOpeningPositionsListViewProps>(openingPositions as any, {
            onNoPositionLoaded: handleNoOpeningPositionsLoaded,
          })}
        {currentTabKey === TABS[1].key && historyPositions}
      </Box>
    </Flex>
  )
}
