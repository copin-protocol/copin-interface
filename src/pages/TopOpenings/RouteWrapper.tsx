import { Trans } from '@lingui/macro'
import { ListBullets, Pulse } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useHistory } from 'react-router-dom'

import { ProtocolFilter, ProtocolFilterProps } from 'components/@ui/ProtocolFilter'
import useSearchParams from 'hooks/router/useSearchParams'
import { BottomWrapperMobile } from 'pages/@layouts/Components'
import { TabHeader } from 'theme/Tab'
import { Box, Flex, Type } from 'theme/base'
import { PAGE_TITLE_HEIGHT } from 'utils/config/constants'
import ROUTES from 'utils/config/routes'
import { generateOIOverviewRoute, generateOIPositionsRoute } from 'utils/helpers/generateRoute'
import { convertProtocolToParams, useProtocolFromUrl } from 'utils/helpers/graphql'

export default function RouteWrapper({
  children,
  protocolFilter,
}: {
  children: any
  protocolFilter: ProtocolFilterProps
}) {
  // const { symbol } = useParams<{ symbol: string | undefined }>()
  // const { pathname } = useLocation()
  // if (!symbol) return <Redirect to={`${pathname}/${ALL_TOKEN_PARAM}`} />
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
      <RouteHeader protocolFilter={protocolFilter} />
      <Box flex="1 0 0">{children}</Box>
      <RouteFooter />
    </Flex>
  )
}
function RouteFooter() {
  return (
    <BottomWrapperMobile>
      <Tabs size="md" />
    </BottomWrapperMobile>
  )
}
function RouteHeader({ protocolFilter }: { protocolFilter: ProtocolFilterProps }) {
  const { md } = useResponsive()
  const { pathname } = useSearchParams()
  const tabName = pathname.split('/')[2] as 'positions' | 'overview'

  const renderTabName = (key: 'positions' | 'overview') => {
    switch (key) {
      case 'positions':
        return 'OPEN INTEREST'
      case 'overview':
        return 'MARKET'
      default:
        return 'OPEN INTEREST'
    }
  }

  return (
    <Flex
      sx={{
        width: '100%',
        pr: [3, 0, 0],
        pl: [3, 3, 0],
        alignItems: 'center',
        justifyContent: ['start', 'start', 'space-between'],
        borderBottom: 'small',
        borderBottomColor: 'neutral4',
        height: PAGE_TITLE_HEIGHT,
        flexShrink: 0,

        gap: 2,
      }}
    >
      <Flex flex={{ _: '1', md: 'auto' }} sx={{ alignItems: 'center', height: '100%' }}>
        {/* <MarketsDropdown /> */}
        {!md && <Type.BodyBold>{renderTabName(tabName as 'positions' | 'overview')}</Type.BodyBold>}

        {/* <Box display={{ _: 'none', md: 'block' }} height="100%" width="1px" bg="neutral4" /> */}
        <Box width="100%" display={{ _: 'none', md: 'flex' }} sx={{ px: 0, gap: 30 }}>
          <Tabs size="lg" />
        </Box>
      </Flex>
      {/* <Box display={{ _: 'block', md: 'none' }} sx={{ height: '100%', width: '1px', bg: 'neutral4' }} /> */}
      <ProtocolFilter
        {...protocolFilter}
        // checkIsProtocolChecked={protocolFilter.checkIsSelected}
        // handleToggleProtocol={protocolFilter.handleToggle}
        placement={md ? 'bottom' : 'bottomRight'}
        menuSx={{ width: ['300px', '400px', '50vw', '50vw'] }}
      />
    </Flex>
  )
}

function Tabs({ size }: { size: 'lg' | 'md' }) {
  const { searchParams, pathname } = useSearchParams()
  const { push } = useHistory()

  const foundProtocolInUrl = useProtocolFromUrl(searchParams, pathname)
  const protocolParams = convertProtocolToParams(foundProtocolInUrl)

  const onChangeTab = (key: 'positions' | 'overview') => {
    if (key === 'positions') {
      push(generateOIPositionsRoute({ params: { ...searchParams, protocol: protocolParams, page: 1 } }))

      return
    }
    if (key === 'overview') {
      push(generateOIOverviewRoute({ params: { ...searchParams, protocol: protocolParams, page: 1 } }))

      return
    }
  }
  return (
    <TabHeader
      configs={[
        {
          name: <Trans>OPEN INTEREST</Trans>,
          key: 'positions',
          icon: <Pulse size={24} />,
          activeIcon: <Pulse size={24} weight="fill" />,
        },
        {
          name: <Trans>MARKET</Trans>,
          key: 'overview',
          icon: <ListBullets size={24} />,
          activeIcon: <ListBullets size={24} weight="fill" />,
        },
      ]}
      isActiveFn={(config) => {
        if (config.key === 'positions') {
          return !!pathname.match(ROUTES.OPEN_INTEREST_POSITIONS.path)?.length
        }
        if (config.key === 'overview') {
          return !!pathname.match(ROUTES.OPEN_INTEREST_OVERVIEW.path)?.length
        }
        return false
      }}
      onClickItem={(key) => onChangeTab(key as 'positions' | 'overview')}
      hasLine={false}
      fullWidth={false}
      size={size}
    />
  )
}
