import { Trans } from '@lingui/macro'
import { Pulse } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode, useMemo, useState } from 'react'

import ChartHLPositionRealtime from 'components/@charts/ChartHLPositionRealtime'
import SelectCopyWallet from 'components/@copyTrade/SelectCopyWallet'
import Logo from 'components/@ui/Logo'
import SectionTitle from 'components/@ui/SectionTitle'
import Badge from 'theme/Badge'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { hideScrollbar } from 'utils/helpers/css'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { getCopyTradePlatformProtocol } from 'utils/web3/dcp'

import WalletStatisticOverview from '../DCPManagement/WaletStatisticOverview'
import HlOpeningPositions from './HlOpeningPositions'
import useIFManagementContext, { IFManagementProvider } from './useIFManagementContext'

export default function IFManagementPage() {
  return (
    <IFManagementProvider>
      <IFManagementComponent />
    </IFManagementProvider>
  )
}
export function IFManagementComponent() {
  const { xl } = useResponsive()
  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Box sx={{ width: '100%', height: '100%', minHeight: 600, overflow: 'hidden' }}>
        {xl ? <DesktopView /> : <MobileView />}
      </Box>
    </Box>
  )
}

function DesktopView() {
  const {
    activeWallet,
    handleChangeActiveWallet,
    hlWallets,
    hlPositions,
    hlOpenOrders,
    currentHlPosition,
    loadingHlPositions,
    setCurrentHlPosition,
    reloadHlPositions,
  } = useIFManagementContext()

  const openOrders = useMemo(
    () => hlOpenOrders?.filter((e) => e.pair === currentHlPosition?.pair),
    [currentHlPosition?.pair, hlOpenOrders]
  )

  return (
    <>
      <Flex
        sx={{
          height: 48,
          width: '100%',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'space-between',
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
        }}
      >
        <Flex px={3} sx={{ width: '100%', height: '100%', alignItems: 'center' }}>
          <Flex mr={10} sx={{ height: '100%', alignItems: 'center' }}>
            <SelectCopyWallet
              currentWallet={activeWallet}
              wallets={hlWallets}
              onChangeWallet={handleChangeActiveWallet}
            />
            {activeWallet &&
              activeWallet.exchange === CopyTradePlatformEnum.HYPERLIQUID &&
              !!activeWallet?.hyperliquid?.apiKey && (
                <IconBox
                  as={'a'}
                  href={generateTraderDetailsRoute(
                    getCopyTradePlatformProtocol(activeWallet.exchange),
                    activeWallet?.hyperliquid?.apiKey
                  )}
                  target="_blank"
                  icon={<Logo size={16} />}
                />
              )}
          </Flex>
          <Flex ml={2} sx={{ height: '100%', gap: 24, alignItems: 'center', flexShrink: 0 }}>
            <WalletStatisticOverview activeWallet={activeWallet} />
          </Flex>
          <Box flex="1" />
          <Flex ml={24} sx={{ height: '100%', alignItems: 'center', gap: 3 }}>
            <VerticalDivider />
          </Flex>
        </Flex>
      </Flex>
      <Flex sx={{ height: 'calc(100% - 48px)', width: '100%', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, bg: 'neutral5' }}>
          <Box sx={{ bg: 'neutral8' }}>
            {!!currentHlPosition && <ChartHLPositionRealtime position={currentHlPosition} orders={openOrders} />}
          </Box>
          <Flex flexDirection="column" height="calc(100% - 300px)">
            <Box px={3} pt={16}>
              <SectionTitle
                icon={Pulse}
                title={
                  <Flex alignItems="center" sx={{ gap: 2 }}>
                    <Trans>Open Positions</Trans>
                    {!!hlPositions?.length && <Badge count={hlPositions.length} />}
                  </Flex>
                }
                iconColor="primary1"
              />
            </Box>
            <Box flex="auto" height="100%" width="100%" overflow="auto">
              <HlOpeningPositions
                data={hlPositions}
                isLoading={loadingHlPositions}
                currentHlPosition={currentHlPosition}
                setCurrentHlPosition={setCurrentHlPosition}
                onClosePositionSuccess={reloadHlPositions}
              />
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

enum TabEnum {
  POSITIONS = 'positions',
}
const tabConfigs = [{ id: TabEnum.POSITIONS, title: <Trans>OPENING POSITIONS</Trans> }]

const TabButton = ({
  // icon: TabIcon,
  title,
  isActive,
  onClick,
}: {
  // icon: Icon
  title: ReactNode
  isActive: boolean
  onClick: () => void
}) => (
  <Flex role="button" onClick={onClick} width="fit-content" sx={{ gap: 2 }} justifyContent="center" alignItems="center">
    {/* <IconBox color={isActive ? 'primary1' : 'neutral3'} icon={<TabIcon size={24} />}></IconBox> */}
    <Type.BodyBold color={isActive ? 'neutral1' : 'neutral3'}>{title}</Type.BodyBold>
  </Flex>
)

function MobileView() {
  const [tab, setTab] = useState(TabEnum.POSITIONS)
  const { activeWallet } = useIFManagementContext()
  const { xl } = useResponsive()
  return (
    <>
      {xl ? (
        <>
          <Flex
            sx={{
              height: 48,
              width: '100%',
              alignItems: 'center',
              gap: 2,
              justifyContent: 'space-between',
              borderBottom: 'small',
              borderBottomColor: 'neutral4',
            }}
          >
            <Flex px={3} sx={{ width: '100%', height: '100%', alignItems: 'center', gap: 24 }}>
              <SelectWalletSection />

              <Flex sx={{ height: '100%', gap: 24, alignItems: 'center' }}>
                <WalletStatisticOverview activeWallet={activeWallet} />
              </Flex>
              <Box flex="1" />
            </Flex>
          </Flex>
        </>
      ) : (
        <>
          <Flex
            sx={{
              width: '100%',
              height: 60,
              flexWrap: 'nowrap',
              gap: 3,
              px: 3,
              alignItems: 'center',
              borderBottom: 'small',
              borderBottomColor: 'neutral4',
            }}
          >
            <SelectWalletSection />
            <VerticalDivider />
            <Flex
              width={{ _: '100%', sm: 'auto' }}
              height="100%"
              sx={{
                gap: 3,
                alignItems: 'center',
                overflow: 'auto',
                ...hideScrollbar(),
              }}
            >
              <WalletStatisticOverview activeWallet={activeWallet} />
            </Flex>
          </Flex>
        </>
      )}
      <Flex
        sx={{ px: 3, height: 48, gap: 3, alignItems: 'center', borderBottom: 'small', borderBottomColor: 'neutral4' }}
      >
        {tabConfigs.map((configs) => (
          <TabButton
            key={configs.id}
            title={configs.title}
            isActive={tab === configs.id}
            onClick={() => setTab(configs.id)}
          />
        ))}
      </Flex>

      <Box sx={{ height: xl ? 'calc(100% - 48px - 48px)' : 'calc(100% - 60px - 48px)' }}>
        {tab === TabEnum.POSITIONS && (
          <>
            <ListPositionSection />
          </>
        )}
      </Box>
    </>
  )
}

function SelectWalletSection() {
  const { activeWallet, handleChangeActiveWallet, hlWallets } = useIFManagementContext()
  return (
    <Flex sx={{ height: '100%', alignItems: 'center', flexShrink: 0 }}>
      <SelectCopyWallet currentWallet={activeWallet} wallets={hlWallets} onChangeWallet={handleChangeActiveWallet} />
      {activeWallet &&
        activeWallet.exchange === CopyTradePlatformEnum.HYPERLIQUID &&
        !!activeWallet?.hyperliquid?.apiKey && (
          <IconBox
            as={'a'}
            href={generateTraderDetailsRoute(
              getCopyTradePlatformProtocol(activeWallet.exchange),
              activeWallet?.hyperliquid?.apiKey
            )}
            target="_blank"
            icon={<Logo size={16} />}
          />
        )}
    </Flex>
  )
}

function ListPositionSection() {
  const { hlPositions, hlOpenOrders, currentHlPosition, loadingHlPositions, reloadHlPositions, setCurrentHlPosition } =
    useIFManagementContext()
  const { sm } = useResponsive()

  const openOrders = useMemo(
    () => hlOpenOrders?.filter((e) => e.pair === currentHlPosition?.pair),
    [currentHlPosition?.pair, hlOpenOrders]
  )

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ height: sm ? 400 : 360, bg: 'neutral8', overflow: 'hidden', transition: '0.3s' }}>
        {!!currentHlPosition && <ChartHLPositionRealtime position={currentHlPosition} orders={openOrders} />}
      </Box>
      <Flex
        flexDirection="column"
        height={sm ? 'calc(100% - 300px)' : 'calc(100% - 250px)'}
        sx={{ position: 'relative', transition: '0.3s', border: 'none', borderTop: 'small', borderColor: 'neutral4' }}
      >
        <Box px={3} pt={16}>
          <SectionTitle
            icon={Pulse}
            title={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Trans>Open Positions</Trans>
                {!!hlPositions?.length && <Badge count={hlPositions.length} />}
              </Flex>
            }
            iconColor="primary1"
          />
        </Box>
        <Box flex="auto" height="100%" sx={{ overflow: 'auto' }}>
          <HlOpeningPositions
            data={hlPositions}
            isLoading={loadingHlPositions}
            setCurrentHlPosition={setCurrentHlPosition}
            onClosePositionSuccess={reloadHlPositions}
          />
        </Box>
      </Flex>
    </Box>
  )
}

function VerticalDivider({ fullHeight = false }: { fullHeight?: boolean }) {
  return <Box sx={{ width: '1px', height: fullHeight ? '100%' : 'calc(100% - 6px)', flexShrink: 0, bg: 'neutral4' }} />
}
