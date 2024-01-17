import { Trans } from '@lingui/macro'
import { ArrowSquareOut, BookBookmark, CaretRight, CopySimple, SpeakerSimpleHigh, Wallet } from '@phosphor-icons/react'
import { ReactNode, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Settings } from 'react-slick'

import { getLatestActivityLogsApi } from 'apis/activityLogApis'
import { getMyCopyTradeOverviewApi } from 'apis/copyTradeApis'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import Divider from 'components/@ui/Divider'
import Logo from 'components/@ui/Logo'
import BalanceText from 'components/BalanceText'
import ConnectButton from 'components/LoginAction/ConnectButton'
import { CopyPositionData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useMyProfileStore from 'hooks/store/useMyProfile'
import OpeningPositions from 'pages/MyProfile/OpeningPositions'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { addressShorten, compactNumber, formatNumber, shortenText } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { parseWalletName } from 'utils/helpers/transform'

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
      <Tutorial />
      <Activities />
    </Flex>
  )
}

function UserOverview() {
  const { copyWallets, loadingCopyWallets } = useCopyWalletContext()
  const selectedWallet = copyWallets?.[0]
  const myProfile = useMyProfileStore((state) => state.myProfile)
  return (
    <Box>
      {!myProfile ? (
        <>
          <Box px={3} pt={3}>
            <Flex mb={24} sx={{ alignItems: 'center', gap: 2 }}>
              <Logo size={24} />
              <Type.BodyBold>
                <Trans>Connect wallet to start copy-trade</Trans>
              </Type.BodyBold>
            </Flex>
            <ConnectButton variant="primary" block />
          </Box>
          <Divider my={3} />
        </>
      ) : (
        <>
          <WalletOverview isLoading={loadingCopyWallets} selectedWallet={selectedWallet} />
          <OpeningSection selectedWallet={selectedWallet} />
        </>
      )}
    </Box>
  )
}

function WalletOverview({
  isLoading,
  selectedWallet,
}: {
  isLoading: boolean
  selectedWallet: CopyWalletData | undefined
}) {
  const { data: overview } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_BALANCE_OVERVIEW, selectedWallet?.id],
    () =>
      getMyCopyTradeOverviewApi({
        exchange: selectedWallet?.exchange ?? CopyTradePlatformEnum.BINGX,
        copyWalletId: selectedWallet?.id,
      }),
    {
      enabled: !!selectedWallet?.id,
    }
  )

  return (
    <Box>
      <Box px={3} pt={3}>
        <Flex mb={12} sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
          <SectionLabel icon={<Wallet size={24} />} label={<Trans>Your copy wallet</Trans>} />
          <Navigator route={ROUTES.WALLET_MANAGEMENT.path} />
        </Flex>
        {selectedWallet ? (
          <Flex sx={{ gap: 24 }}>
            <WalletStateItem label={<Trans>Copy Wallet</Trans>} value={parseWalletName(selectedWallet, true, true)} />
            <WalletStateItem
              label={<Trans>Balance</Trans>}
              value={
                <Flex sx={{ alignItems: 'center', height: 22, width: 60 }}>
                  <BalanceText value={compactNumber(selectedWallet.balance, 2)} component={Type.Caption} />
                </Flex>
              }
            />
            <WalletStateItem
              label={<Trans>Total PnL</Trans>}
              value={<SignedText isCompactNumber value={overview?.pnl || undefined} maxDigit={2} minDigit={2} />}
            />
          </Flex>
        ) : (
          <Flex sx={{ gap: 48 }}>
            <WalletStateItem label={<Trans>Balance</Trans>} value={'--'} />
            <WalletStateItem label={<Trans>Total PnL</Trans>} value={'--'} />
          </Flex>
        )}
      </Box>
      <Divider my={3} />
    </Box>
  )
}
function WalletStateItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
      <Type.Caption>{label}</Type.Caption>
      <Type.CaptionBold>{value}</Type.CaptionBold>
    </Flex>
  )
}

const POSITIONS_LIMIT = 3
function OpeningSection({ selectedWallet }: { selectedWallet: CopyWalletData | undefined }) {
  const [hasPositions, setHasPositions] = useState<boolean | null>(null)
  const handleLoadPositionSuccess = (data: CopyPositionData[] | undefined) => {
    if (!data?.length) {
      setHasPositions(false)
      return
    }
    setHasPositions(true)
  }
  if (!selectedWallet) return <></>
  return (
    <Box display={hasPositions ? 'block' : 'none'}>
      <Box>
        <Flex px={3} mb={20} sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
          <SectionLabel icon={<CopySimple size={24} />} label={<Trans>Your copy opening positions</Trans>} />
          <Navigator route={ROUTES.MY_MANAGEMENT.path} />
        </Flex>
        <Box>
          <OpeningPositions
            restrictHeight={false}
            hasLabel={false}
            activeWallet={selectedWallet}
            copyWallets={undefined}
            onSuccess={handleLoadPositionSuccess}
            limit={POSITIONS_LIMIT}
            layoutType="simple"
            tableProps={{
              tableBodyWrapperSx: {
                height: 'max-content',
                maxHeight: '150px !important',
                overflow: 'auto !important',
                flex: 'auto',
              },
            }}
          />
        </Box>
      </Box>
      <Divider my={3} />
    </Box>
  )
}

function Activities() {
  const { data: activities } = useQuery([QUERY_KEYS.GET_LATEST_ACTIVITY_LOGS], () => getLatestActivityLogsApi({}), {
    refetchInterval: 15_000,
  })
  return activities?.length ? (
    <Flex pb={3} sx={{ width: '100%', flex: '1 0 0', flexDirection: 'column', overflow: 'hidden', minHeight: 200 }}>
      <Box px={3}>
        <SectionLabel icon={<SpeakerSimpleHigh size={24} />} label={<Trans>Latest activities</Trans>} />
      </Box>
      <Flex
        mt={3}
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
            <Box
              key={data.id}
              sx={{ a: { color: 'neutral1', textDecoration: 'underline', '&:hover': { color: 'neutral2' } } }}
            >
              <Type.Caption mb={1} color="neutral3">
                <RelativeTimeText date={data.createdAt} />
              </Type.Caption>
              <Type.Caption color="neutral3">
                <Box as="span" color="neutral1">
                  {shortenText(data.username, 8)}
                </Box>{' '}
                <Trans>copied a position from trader</Trans>{' '}
                <Box as={Link} to={generateTraderDetailsRoute(data.protocol, data.sourceAccount)}>
                  {addressShorten(data.sourceAccount)}
                </Box>{' '}
                with a size of ${formatNumber(data?.volume, 2, 2)}
              </Type.Caption>
            </Box>
          )
        })}
      </Flex>
    </Flex>
  ) : null
}

function Tutorial() {
  return (
    // <Box sx={{ borderTop: 'small', borderTopColor: 'neutral4' }}>
    <Box>
      <Box px={3}>
        <Flex sx={{ width: '100%', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
          <SectionLabel icon={<BookBookmark size={24} />} label={<Trans>Getting started</Trans>} />
          <ExternalLink href={LINKS.docs} />
        </Flex>
      </Box>
      <Divider my={3} />
      {/* <Box mt={3} pb={3}>
        <HorizontalCarouselWrapper>
          <Slider {...settings}>
            <Box sx={{ height: 140, bg: 'neutral5', p: 3, lineHeight: '114px' }}>Introduction about Copin</Box>
            <Box sx={{ height: 140, bg: 'neutral5', p: 3, lineHeight: '114px' }}>Introduction about Copin</Box>
            <Box sx={{ height: 140, bg: 'neutral5', p: 3, lineHeight: '114px' }}>Introduction about Copin</Box>
          </Slider>
        </HorizontalCarouselWrapper>
      </Box> */}
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

function Navigator({ route }: { route: string }) {
  return (
    <Box as={Link} to={route} sx={{ display: 'block', width: 20 }}>
      <IconBox icon={<CaretRight size={20} />} color="neutral2" sx={{ px: 2, '&:hover': { color: 'neutral1' } }} />
    </Box>
  )
}
function ExternalLink({ href }: { href: string }) {
  return (
    <Box as="a" href={href} target="_blank" sx={{ display: 'block', width: 20 }}>
      <IconBox icon={<ArrowSquareOut size={20} />} color="neutral2" sx={{ px: 2, '&:hover': { color: 'neutral1' } }} />
    </Box>
  )
}
function SectionLabel({ icon, label }: { icon: ReactNode; label: ReactNode }) {
  return (
    <Flex sx={{ alignItems: 'center', gap: 2 }}>
      <IconBox icon={icon} color="neutral3" size={24} />
      <Type.Body>{label}</Type.Body>
    </Flex>
  )
}
