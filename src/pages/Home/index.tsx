import { Trans } from '@lingui/macro'
import { PresentationChart, Users } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useRef } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import useSearchParams from 'hooks/router/useSearchParams'
import { BodyWrapperMobile, BottomTabItemMobile, BottomTabWrapperMobile } from 'pages/@layouts/Components'
import { Box, Flex } from 'theme/base'

import Overview from './Overview'
import Traders from './Traders'
import { OVERVIEW_WIDTH } from './configs'

export default function Home() {
  const { md } = useResponsive()
  return (
    <>
      <CustomPageTitle title="Copin Analyzer" />
      {md ? (
        <Flex
          sx={{
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            mx: 'auto',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              flex: 1,
              height: '100%',
              background: 'linear-gradient(180.16deg, #1D2238 0.14%, rgba(11, 13, 23, 0) 24.31%) no-repeat',
              backgroundSize: '100% 500px',
            }}
          >
            <Traders />
          </Box>
          <Box width={OVERVIEW_WIDTH} sx={{ height: '100%', flexShrink: 0 }}>
            <Overview />
          </Box>
        </Flex>
      ) : (
        <MobileHome />
      )}
    </>
  )
}

function MobileHome() {
  const { searchParams, setSearchParamsOnly } = useSearchParams()
  const currentTab = searchParams.tab ?? TabKeys.traders
  const searchParamsRef = useRef<any>({})
  const handleClickItem = (key: string) => {
    const prevParams = { ...searchParamsRef.current }
    const prevKey = prevParams.tab
    if (!prevKey) {
      searchParamsRef.current = searchParams
      setSearchParamsOnly({ tab: key })
      return
    }
    if (key === prevKey) {
      searchParamsRef.current = searchParams
      setSearchParamsOnly(prevParams)
    }
  }
  return (
    <BodyWrapperMobile>
      <Box display={currentTab === TabKeys.traders ? 'block' : 'none'} sx={{ width: '100%', height: '100%' }}>
        <Traders />
      </Box>
      <Box display={currentTab === TabKeys.overview ? 'block' : 'none'} sx={{ width: '100%', height: '100%' }}>
        <Overview />
      </Box>
      <BottomTabWrapperMobile>
        {tabConfigs.map((config, index) => {
          const isActive = !!searchParams.tab ? searchParams.tab === config.key : config.key === TabKeys.traders
          return (
            <BottomTabItemMobile
              key={index}
              color={isActive ? 'primary1' : 'neutral3'}
              onClick={() => handleClickItem(config.key)}
              fontWeight={isActive ? 500 : 400}
              icon={isActive ? config.activeIcon : config.inactiveIcon}
              text={config.name}
            />
          )
        })}
      </BottomTabWrapperMobile>
    </BodyWrapperMobile>
  )
}

const TabKeys = {
  traders: 'traders',
  overview: 'overview',
}

const tabConfigs = [
  {
    name: <Trans>Traders</Trans>,
    activeIcon: <Users size={24} weight="fill" />,
    inactiveIcon: <Users size={24} />,
    key: TabKeys.traders,
    paramKey: TabKeys.traders,
  },
  {
    name: <Trans>Overview</Trans>,
    inactiveIcon: <PresentationChart size={24} />,
    activeIcon: <PresentationChart size={24} weight="fill" />,
    key: TabKeys.overview,
    paramKey: TabKeys.overview,
  },
]
