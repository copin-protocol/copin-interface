import { Trans } from '@lingui/macro'
import { CaretDown, Icon, ListBullets, Pulse } from '@phosphor-icons/react'
import { ReactNode } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { SingleValueProps, components } from 'react-select'

import { RouteSwitchProtocol } from 'components/@widgets/SwitchProtocols'
import useSearchParams from 'hooks/router/useSearchParams'
import Select from 'theme/Select'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { TokenTrade, getTokenTradeList } from 'utils/config/trades'
import { generateOIOverviewRoute, generateOIPositionsRoute } from 'utils/helpers/generateRoute'
import { parseMarketImage } from 'utils/helpers/transform'

import { ALL_TOKEN_PARAM } from './configs'

export default function RouteWrapper({ children }: { children: any }) {
  // const { symbol } = useParams<{ symbol: string | undefined }>()
  // const { pathname } = useLocation()
  // if (!symbol) return <Redirect to={`${pathname}/${ALL_TOKEN_PARAM}`} />
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <RouteHeader />
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
function RouteHeader() {
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
        <MarketsDropdown />
        <Box display={{ _: 'none', md: 'block' }} height="100%" width="1px" bg="neutral4" />
        <Box width="100%" display={{ _: 'none', md: 'flex' }} sx={{ px: 3, gap: 30 }}>
          <Tabs />
        </Box>
      </Flex>
      <Box display={{ _: 'block', md: 'none' }} sx={{ height: '100%', width: '1px', bg: 'neutral4' }} />
      <RouteSwitchProtocol keepSearch={false} componentProps={{ showIcon: true }} />
    </Flex>
  )
}

function Tabs() {
  const { protocol, symbol } = useParams<{ protocol: ProtocolEnum; symbol: string }>()
  const {
    push,
    location: { pathname },
  } = useHistory()
  if (!protocol) return <></>
  const onChangeTab = (key: 'positions' | 'overview') => {
    if (key === 'positions') {
      push(generateOIPositionsRoute({ protocol, symbol }))
      return
    }
    if (key === 'overview') {
      push(generateOIOverviewRoute({ protocol, symbol }))
      return
    }
  }
  return (
    <>
      <TabItem
        label={<Trans>OPEN INTEREST</Trans>}
        icon={Pulse}
        isActive={!!pathname.match(ROUTES.OPEN_INTEREST_POSITIONS.path_prefix)?.length}
        onClick={() => onChangeTab('positions')}
      />
      <TabItem
        label={<Trans>MARKET</Trans>}
        icon={ListBullets}
        isActive={!!pathname.match(ROUTES.OPEN_INTEREST_OVERVIEW.path_prefix)?.length}
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

function MarketsDropdown() {
  const { searchParams } = useSearchParams()
  const { protocol, symbol = ALL_TOKEN_PARAM } = useParams<{ protocol: ProtocolEnum; symbol: string }>()
  const tokenOptions: TokenTrade[] = Object.values(
    getTokenTradeList(protocol).reduce((acc: any, market) => {
      if (!acc[market.symbol]) {
        acc[market.symbol] = market
      }
      return acc
    }, {})
  )
  const {
    push,
    location: { pathname },
  } = useHistory()

  const tokenSelectOptions = [
    { value: ALL_TOKEN_PARAM, label: 'ALL' },
    ...tokenOptions.map((option) => ({ value: option.symbol, label: <MarketItem symbol={option.symbol} /> })),
  ]
  const selectOption = tokenSelectOptions.find((option) => option.value === symbol)
  const onChangeToken = (newValue: any) => {
    const symbol = newValue.value === ALL_TOKEN_PARAM ? undefined : newValue.value
    if (pathname.match(ROUTES.OPEN_INTEREST_OVERVIEW.path_prefix)) {
      push(generateOIOverviewRoute({ protocol, symbol, params: searchParams }))
      return
    }
    if (pathname.match(ROUTES.OPEN_INTEREST_POSITIONS.path_prefix)) {
      push(generateOIPositionsRoute({ protocol, symbol, params: searchParams }))
      return
    }
  }

  if (!protocol) return <></>
  return (
    <Box
      sx={{
        '.select__control': {
          width: 130,
          input: { width: '80px !important', margin: '0 !important' },
        },
      }}
    >
      <Select
        variant="ghost"
        value={selectOption}
        options={tokenSelectOptions}
        onChange={onChangeToken}
        components={{ SingleValue, DropdownIndicator }}
      />
    </Box>
  )
}
const SingleValue = ({ children, ...props }: SingleValueProps<any>) => {
  const value = props.data?.value
  return (
    <components.SingleValue {...props}>
      <Flex sx={{ alignItems: 'center', gap: 1, '*': { fontWeight: 500 } }}>
        {!value || value === ALL_TOKEN_PARAM ? (
          <Type.Body color="primary1">{children}</Type.Body>
        ) : (
          <MarketItem symbol={value} />
        )}
        <CaretDown size={16} style={{ transform: 'translateY(0px)' }} />
      </Flex>
    </components.SingleValue>
  )
}
const DropdownIndicator = () => {
  return null
}

function MarketItem({ symbol }: { symbol: string }) {
  return (
    <Flex sx={{ gap: 1, alignItems: 'center', '*': { flexShrink: 0 } }}>
      <Image width={24} height={24} src={parseMarketImage(symbol)} alt={symbol} />
      <Type.Caption>{symbol}</Type.Caption>
    </Flex>
  )
}
