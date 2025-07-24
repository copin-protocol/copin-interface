import { Trans } from '@lingui/macro'
import { PresentationChart, Users } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useRef } from 'react'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import SafeComponentWrapper from 'components/@widgets/SafeComponentWrapper'
import useSearchParams from 'hooks/router/useSearchParams'
import { BodyWrapperMobile, BottomWrapperMobile } from 'pages/@layouts/Components'
import { TabHeader } from 'theme/Tab'
import { Box, Flex } from 'theme/base'

import Overview from './Overview'
import Traders from './Traders'
import { OVERVIEW_WIDTH } from './configs'

export default function HomePage() {
  const { md } = useResponsive()
  return (
    <SafeComponentWrapper>
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
    </SafeComponentWrapper>
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
    <BodyWrapperMobile sx={{ overflow: 'hidden' }}>
      <Box display={currentTab === TabKeys.traders ? 'block' : 'none'} sx={{ width: '100%', height: '100%' }}>
        <Traders />
      </Box>
      <Box display={currentTab === TabKeys.overview ? 'block' : 'none'} sx={{ width: '100%', height: '100%' }}>
        <Overview />
      </Box>
      <BottomWrapperMobile>
        <TabHeader
          configs={tabConfigs}
          isActiveFn={(config) => config.key === currentTab}
          fullWidth={false}
          onClickItem={handleClickItem}
        />
      </BottomWrapperMobile>
    </BodyWrapperMobile>
  )
}
const TabKeys = {
  traders: 'traders',
  overview: 'overview',
}

const tabConfigs = [
  {
    name: <Trans>TRADERS</Trans>,
    activeIcon: <Users size={24} weight="fill" />,
    icon: <Users size={24} />,
    key: TabKeys.traders,
    paramKey: TabKeys.traders,
  },
  {
    name: <Trans>OVERVIEW</Trans>,
    icon: <PresentationChart size={24} />,
    activeIcon: <PresentationChart size={24} weight="fill" />,
    key: TabKeys.overview,
    paramKey: TabKeys.overview,
  },
]
