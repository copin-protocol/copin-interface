import { Trans } from '@lingui/macro'
import { SpeakerSimpleHigh } from '@phosphor-icons/react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import Slider, { Settings } from 'react-slick'

import { getLatestActivityLogsApi } from 'apis/activityLogApis'
import homeEventBanner from 'assets/images/home-event-banner.png'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import SectionTitle from 'components/@ui/SectionTitle'
import { EventDetailsData, TradingEventStatusEnum } from 'entities/event'
import { LatestActivityLogData } from 'entities/user'
import { useIsPremiumAndAction } from 'hooks/features/useSubscriptionRestrict'
import { useSystemConfigContext } from 'hooks/features/useSystemConfigContext'
import useMyProfile from 'hooks/store/useMyProfile'
import { useAuthContext } from 'hooks/web3/useAuth'
import { GradientText } from 'pages/@layouts/Navbar/EventButton'
import { Button } from 'theme/Buttons'
import { HorizontalCarouselWrapper } from 'theme/Carousel/Wrapper'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Image, Type } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { addressShorten, formatImageUrl, formatNumber } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'
import { logEventCompetition } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

export default function Overview() {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        borderLeft: 'small',
        borderLeftColor: 'neutral4',
      }}
    >
      <UserOverview />
      {/* <Tutorial /> */}
      <Box mb={3} />
      <Activities />
    </Flex>
  )
}

function UserOverview() {
  const { events } = useSystemConfigContext()
  const filterEvents = events?.filter((e) => e.status !== TradingEventStatusEnum.ENDED)
  return (
    <Box sx={{ position: 'relative' }}>
      <HorizontalCarouselWrapper>
        <Slider {...settings}>
          {filterEvents?.map((e) => {
            return <EventItem key={e.id} eventDetails={e} />
          })}
        </Slider>
      </HorizontalCarouselWrapper>
    </Box>
  )
}

const settings: Settings = {
  speed: 500,
  autoplay: true,
  autoplaySpeed: 8000,
  pauseOnHover: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  dots: true,
}

function EventItem({ eventDetails }: { eventDetails: EventDetailsData }) {
  const { myProfile } = useMyProfile()
  const eventSlug = eventDetails?.slug ?? eventDetails?.id
  return (
    <Box height={165}>
      <Box
        role="button"
        as={eventSlug ? Link : 'div'}
        to={eventSlug ? `/${ROUTES.EVENT_DETAILS.path_prefix}/${eventSlug}` : undefined}
        onClick={() => {
          logEventCompetition({
            event: EVENT_ACTIONS[EventCategory.COMPETITION].HOME_CLICK_BANNER,
            username: myProfile?.username,
          })
        }}
        sx={{ borderBottom: 'small', borderBottomColor: 'neutral4', position: 'relative' }}
      >
        <Image
          src={eventDetails?.bannerUrl ? formatImageUrl(eventDetails?.bannerUrl) : homeEventBanner}
          sx={{ objectFit: 'cover', height: '100%', width: '100%' }}
        />
      </Box>
    </Box>
  )
}

function Activities() {
  const { isAuthenticated } = useAuthContext()
  const { data: activities } = useQuery([QUERY_KEYS.GET_LATEST_ACTIVITY_LOGS], () => getLatestActivityLogsApi({}), {
    refetchInterval: 15_000,
  })
  return activities?.length ? (
    <Flex pb={3} sx={{ width: '100%', flex: '1 0 0', flexDirection: 'column', overflow: 'hidden', minHeight: 200 }}>
      <Box px={3}>
        <SectionTitle icon={SpeakerSimpleHigh} title={<Trans>LATEST ACTIVITIES</Trans>} />
      </Box>
      <Flex
        px={3}
        sx={{
          flexDirection: 'column',
          gap: 3,
          flex: '1 0 0',
          overflow: 'auto',
        }}
      >
        {activities.map((data) => {
          return (
            <Box key={data.id}>
              <Box sx={{ a: { color: 'neutral1', textDecoration: 'underline', '&:hover': { color: 'neutral2' } } }}>
                <Type.Caption color="neutral3">
                  <RelativeTimeText date={data.createdAt} />
                </Type.Caption>
                <Type.Caption color="neutral2">
                  <Box as="b" color="neutral1">
                    {addressShorten(data.username)}
                  </Box>{' '}
                  <Trans>copied a position from trader</Trans>{' '}
                  {isAuthenticated ? <RenderTrader data={data} /> : <RenderHiddenTrader data={data} />} with a size of $
                  {formatNumber((data?.volume ?? 0) * (data?.price ?? 0), 2, 2)}
                </Type.Caption>
              </Box>
            </Box>
          )
        })}
      </Flex>
    </Flex>
  ) : null
}

function RenderTrader({ data }: { data: LatestActivityLogData }) {
  return (
    <Box
      as={Link}
      to={generateTraderMultiExchangeRoute({ protocol: data.protocol, address: data.sourceAccount })}
      sx={{
        color: 'neutral1',
        fontWeight: 'bold',
        textDecoration: 'none!important',
        '&:hover': {
          textDecoration: 'underline!important',
        },
      }}
    >
      [{addressShorten(data.sourceAccount)}]
    </Box>
  )
}

function RenderHiddenTrader({ data }: { data: LatestActivityLogData }) {
  const { isAuthenticated } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const { checkIsPremium } = useIsPremiumAndAction()

  const tooltipId = `tt-activities-${data.id}`

  return (
    <>
      <Box display="inline-block" data-tooltip-id={tooltipId} data-tooltip-delay-show={360}>
        <Type.CaptionBold color="neutral1">[0x...***]</Type.CaptionBold>
      </Box>
      <Tooltip id={tooltipId} place="top" type="dark" effect="solid" clickable>
        {isAuthenticated ? (
          <Type.Caption>
            Please{' '}
            <Button
              variant="ghostPrimary"
              sx={{ p: 0, width: 'fit-content', textTransform: 'capitalize' }}
              onClick={checkIsPremium}
            >
              <GradientText>Upgrade Premium</GradientText>
            </Button>{' '}
            to see
          </Type.Caption>
        ) : (
          <Type.Caption>
            Please{' '}
            <Button
              variant="ghostPrimary"
              sx={{
                p: 0,
                textTransform: 'capitalize',
                width: 'fit-content',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
              onClick={handleClickLogin}
            >
              Login
            </Button>{' '}
            to see
          </Type.Caption>
        )}
      </Tooltip>
    </>
  )
}

// function WalletOverview({
//   isLoading,
//   selectedWallet,
// }: {
//   isLoading: boolean
//   selectedWallet: CopyWalletData | undefined
// }) {
//   const { data: overview } = useQuery(
//     [QUERY_KEYS.GET_COPY_TRADE_BALANCE_OVERVIEW, selectedWallet?.id],
//     () =>
//       getMyCopyTradeOverviewApi({
//         exchange: selectedWallet?.exchange ?? CopyTradePlatformEnum.BINGX,
//         copyWalletId: selectedWallet?.id,
//       }),
//     {
//       enabled: !!selectedWallet?.id,
//     }
//   )

//   const { total: balance } = useWalletFund({
//     address: selectedWallet?.smartWalletAddress,
//     enabled: !!selectedWallet?.smartWalletAddress,
//     platform: selectedWallet?.exchange,
//   })

//   return (
//     <Box>
//       <Box px={3} pt={3}>
//         <Flex mb={12} sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
//           <SectionLabel icon={<Wallet size={24} weight="fill" />} label={<Trans>Your copy wallet</Trans>} />
//           <TrackingRouteWrapper event={EVENT_ACTIONS[EventCategory.ROUTES].HOME_WALLET_MANAGEMENT}>
//             <Navigator route={ROUTES.WALLET_MANAGEMENT.path} />
//           </TrackingRouteWrapper>
//         </Flex>
//         {selectedWallet ? (
//           <Flex sx={{ gap: 24 }}>
//             <WalletStateItem label={<Trans>Copy Wallet</Trans>} value={parseWalletName(selectedWallet, true, true)} />
//             <WalletStateItem
//               label={<Trans>Balance</Trans>}
//               value={
//                 <Flex sx={{ alignItems: 'center', height: 22, width: 60 }}>
//                   <BalanceText
//                     value={compactNumber(balance ? balance.num : selectedWallet.balance, 2)}
//                     component={Type.Caption}
//                   />
//                 </Flex>
//               }
//             />
//             <WalletStateItem
//               label={<Trans>Total PnL</Trans>}
//               value={<SignedText isCompactNumber value={overview?.pnl || undefined} maxDigit={2} minDigit={2} />}
//             />
//           </Flex>
//         ) : (
//           <Flex sx={{ gap: 48 }}>
//             <WalletStateItem label={<Trans>Balance</Trans>} value={'--'} />
//             <WalletStateItem label={<Trans>Total PnL</Trans>} value={'--'} />
//           </Flex>
//         )}
//       </Box>
//       <Divider my={3} />
//     </Box>
//   )
// }
// function WalletStateItem({ label, value }: { label: ReactNode; value: ReactNode }) {
//   return (
//     <Flex sx={{ flexDirection: 'column', gap: 1 }}>
//       <Type.Caption>{label}</Type.Caption>
//       <Type.CaptionBold
//         sx={{
//           maxWidth: '120px',
//           overflow: 'hidden',
//           textOverflow: 'ellipsis',
//           whiteSpace: 'nowrap',
//         }}
//       >
//         {value}
//       </Type.CaptionBold>
//     </Flex>
//   )
// }

// function OpeningSection({ selectedWallet }: { selectedWallet: CopyWalletData | undefined }) {
//   const [hasPositions, setHasPositions] = useState<boolean | null>(null)
//   const handleLoadPositionSuccess = (data: CopyPositionData[] | undefined) => {
//     if (!data?.length) {
//       setHasPositions(false)
//       return
//     }
//     setHasPositions(true)
//   }
//   if (!selectedWallet) return <></>
//   return (
//     <Box display={hasPositions ? 'block' : 'none'}>
//       <Box>
//         <Flex px={3} mb={20} sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
//           <SectionLabel
//             icon={<CopySimple size={24} weight="fill" />}
//             label={<Trans>Your copy opening positions</Trans>}
//           />
//           <TrackingRouteWrapper event={EVENT_ACTIONS[EventCategory.ROUTES].HOME_COPYTRADE_MANAGEMENT}>
//             <Navigator route={ROUTES.MY_MANAGEMENT.path} />
//           </TrackingRouteWrapper>
//         </Flex>
//         <Box>
//           <OpeningPositions
//             restrictHeight={false}
//             hasLabel={false}
//             activeWallet={selectedWallet}
//             copyWallets={undefined}
//             onSuccess={handleLoadPositionSuccess}
//             layoutType="simple"
//             tableProps={{
//               tableBodyWrapperSx: {
//                 height: 'max-content',
//                 maxHeight: '150px !important',
//                 overflow: 'auto !important',
//                 flex: 'auto',
//               },
//             }}
//           />
//         </Box>
//       </Box>
//       <Divider my={3} />
//     </Box>
//   )
// }

// function Tutorial() {
//   const { myProfile } = useMyProfile()
//   return (
//     // <Box sx={{ borderTop: 'small', borderTopColor: 'neutral4' }}>
//     <Box>
//       <Box px={3}>
//         <Flex sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
//           <SectionLabel icon={<BookBookmark size={24} weight="fill" />} label={<Trans>Getting started</Trans>} />

//           <TrackingRouteWrapper event={EVENT_ACTIONS[EventCategory.ROUTES].HOME_GETTING_STARTED}>
//             <ExternalLink href={LINKS.docs} />
//           </TrackingRouteWrapper>
//         </Flex>
//       </Box>
//       <Divider my={3} />
//       {/* <Box mt={3} pb={3}>
//         <HorizontalCarouselWrapper>
//           <Slider {...settings}>
//             <Box sx={{ height: 140, bg: 'neutral5', p: 3, lineHeight: '114px' }}>Introduction about Copin</Box>
//             <Box sx={{ height: 140, bg: 'neutral5', p: 3, lineHeight: '114px' }}>Introduction about Copin</Box>
//             <Box sx={{ height: 140, bg: 'neutral5', p: 3, lineHeight: '114px' }}>Introduction about Copin</Box>
//           </Slider>
//         </HorizontalCarouselWrapper>
//       </Box> */}
//     </Box>
//   )
// }

// function Navigator({ route }: { route: string }) {
//   return (
//     <Box as={Link} to={route} sx={{ display: 'block', width: 20 }}>
//       <IconBox icon={<CaretRight size={20} />} color="neutral2" sx={{ px: 2, '&:hover': { color: 'neutral1' } }} />
//     </Box>
//   )
// }
// function ExternalLink({ href }: { href: string }) {
//   return (
//     <Box as="a" href={href} target="_blank" sx={{ display: 'block', width: 20 }}>
//       <IconBox icon={<ArrowSquareOut size={20} />} color="neutral2" sx={{ px: 2, '&:hover': { color: 'neutral1' } }} />
//     </Box>
//   )
// }
