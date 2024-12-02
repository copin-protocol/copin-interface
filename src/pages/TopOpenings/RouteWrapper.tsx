import { Trans } from '@lingui/macro'
import { Icon, ListBullets, Pulse } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'
import { useHistory } from 'react-router-dom'

import { ProtocolFilter, ProtocolFilterProps } from 'components/@ui/ProtocolFilter'
import useSearchParams from 'hooks/router/useSearchParams'
import { Box, Flex, IconBox, Type } from 'theme/base'
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
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <RouteHeader protocolFilter={protocolFilter} />
      <Box flex="1 0 0">{children}</Box>
      <RouteFooter />
    </Flex>
  )
}
function RouteFooter() {
  return (
    <Box
      display={{ _: 'flex', md: 'none' }}
      sx={{
        width: '100%',
        alignItems: 'center',
        '& > *': { flex: 1 },
        height: 40,
        borderTop: 'small',
        borderTopColor: 'neutral4',
        px: 3,
      }}
    >
      <Tabs />
    </Box>
  )
}
function RouteHeader({ protocolFilter }: { protocolFilter: ProtocolFilterProps }) {
  const { sm } = useResponsive()
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
        pl: 3,
        pr: [3, 0],
        alignItems: 'center',
        justifyContent: ['start', 'start', 'space-between'],
        borderBottom: 'small',
        borderBottomColor: 'neutral4',
        height: 48,
        flexShrink: 0,
        gap: 2,
      }}
    >
      <Flex flex={{ _: '1', md: 'auto' }} sx={{ alignItems: 'center', height: '100%' }}>
        {/* <MarketsDropdown /> */}
        {!sm && (
          <Trans>
            <Type.BodyBold>{renderTabName(tabName as 'positions' | 'overview')}</Type.BodyBold>
          </Trans>
        )}

        {/* <Box display={{ _: 'none', md: 'block' }} height="100%" width="1px" bg="neutral4" /> */}
        <Box width="100%" display={{ _: 'none', md: 'flex' }} sx={{ px: 0, gap: 30 }}>
          <Tabs />
        </Box>
      </Flex>
      <Box display={{ _: 'block', md: 'none' }} sx={{ height: '100%', width: '1px', bg: 'neutral4' }} />
      <ProtocolFilter
        {...protocolFilter}
        // checkIsProtocolChecked={protocolFilter.checkIsSelected}
        // handleToggleProtocol={protocolFilter.handleToggle}
        placement={sm ? 'bottom' : 'bottomRight'}
        menuSx={{ width: ['300px', '400px', '50vw', '50vw'] }}
      />
    </Flex>
  )
}

function Tabs() {
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
    <>
      <TabItem
        label={<Trans>OPEN INTEREST</Trans>}
        icon={Pulse}
        isActive={!!pathname.match(ROUTES.OPEN_INTEREST_POSITIONS.path)?.length}
        onClick={() => onChangeTab('positions')}
      />
      <TabItem
        label={<Trans>MARKET</Trans>}
        icon={ListBullets}
        isActive={!!pathname.match(ROUTES.OPEN_INTEREST_OVERVIEW.path)?.length}
        onClick={() => onChangeTab('overview')}
      />
    </>
  )
}

function TabItem({
  label,
  icon: IconComponent,
  isActive,
  onClick,
}: {
  label: ReactNode
  icon: Icon
  isActive: boolean
  onClick: () => void
}) {
  const color = isActive ? 'neutral1' : 'neutral3'
  return (
    <Flex role="button" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', color }} onClick={onClick}>
      <IconBox icon={<IconComponent size={24} weight="fill" />} />
      <Type.Body sx={{ flexShrink: 0, fontWeight: 500 }}>{label}</Type.Body>
    </Flex>
  )
}
