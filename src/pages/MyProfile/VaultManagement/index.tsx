import { Trans } from '@lingui/macro'
import { Eye, EyeClosed, Funnel, Pulse, XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { ReactNode, useEffect, useState } from 'react'

import ChartGainsPositionRealtime from 'components/@charts/ChartGainsPositionRealtime'
import SelectedCopyTradeActions from 'components/@copyTrade/ListCopyTrade/SelectedCopyTradeActions'
import SelectCopyWallet from 'components/@copyTrade/SelectCopyWallet'
import DirectionButton from 'components/@ui/DirectionButton'
import Divider from 'components/@ui/Divider'
import Logo from 'components/@ui/Logo'
import SectionTitle from 'components/@ui/SectionTitle'
import FundModal, { FundTab } from 'components/@wallet/SmartWalletFundModal'
import SmartWalletActions from 'components/@wallet/WalletDetailsCard/SmartWalletActions'
import useWalletFund from 'hooks/features/copyTrade/useWalletFundSnxV2'
import Badge from 'theme/Badge'
import { Button } from 'theme/Buttons'
import RcDrawer from 'theme/RcDrawer'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { CopyTradePlatformEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'
import { hideScrollbar } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'
import { generateTraderDetailsRoute } from 'utils/helpers/generateRoute'
import { getCopyTradePlatformProtocol } from 'utils/web3/dcp'

import WalletStatisticOverview from '../DCPManagement/WaletStatisticOverview'
import FilterBySource, { FilterBySourceDropdown } from '../FilterBySource'
import FilterByStatus from '../FilterByStatus'
import OnchainPositions from '../OpeningPositions/OnchainPositions'
import SettingConfigs from '../OpeningPositions/SettingConfigs'
import SelectTradersCopied from '../SelectTradersCopied'
import ListVaultCopyTrades from './ListVaultCopyTrades'
import VaultOnchainPositions from './VaultOnchainPositions'
import useVaultManagementContext, { VaultManagementProvider } from './useVaultManagementContext'

export default function VaultManagementPage() {
  return (
    <VaultManagementProvider>
      <VaultManagementComponent />
    </VaultManagementProvider>
  )
}
export function VaultManagementComponent() {
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
    vaultWallets,
    selectedTraders,
    listTraderAddresses,
    allCopyTrades,
    handleToggleTrader,
    handleSelectAllTraders,
    currentOnchainPosition,
    currentOnchainOrders,
    onchainPositions,
  } = useVaultManagementContext()
  const [expandedTable, setExpandedTable] = useState(
    sessionStorage.getItem(STORAGE_KEYS.USER_VAULT_MANAGEMENT_EXPANDED) === '1'
  )
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEYS.USER_VAULT_MANAGEMENT_EXPANDED, expandedTable ? '1' : '0')
  }, [expandedTable])
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
              wallets={vaultWallets}
              onChangeWallet={handleChangeActiveWallet}
            />
            {activeWallet &&
              activeWallet.exchange === CopyTradePlatformEnum.GNS_V8 &&
              !!activeWallet.smartWalletAddress && (
                <IconBox
                  as={'a'}
                  href={generateTraderDetailsRoute(
                    getCopyTradePlatformProtocol(activeWallet.exchange),
                    activeWallet.smartWalletAddress
                  )}
                  target="_blank"
                  icon={<Logo size={16} />}
                />
              )}
          </Flex>
          <SelectTradersCopied
            selectedTraders={selectedTraders}
            allTraders={listTraderAddresses}
            allCopyTrades={allCopyTrades}
            handleToggleTrader={handleToggleTrader}
            handleSelectAllTraders={handleSelectAllTraders}
          />
          <Flex ml={2} sx={{ height: '100%', gap: 24, alignItems: 'center', flexShrink: 0 }}>
            <WalletStatisticOverview activeWallet={activeWallet} />
          </Flex>
          <Box flex="1" />
          <Flex ml={24} sx={{ height: '100%', alignItems: 'center', gap: 3 }}>
            <VerticalDivider />
            <FundManagement />
          </Flex>
        </Flex>
      </Flex>
      <Flex sx={{ height: 'calc(100% - 48px)', width: '100%', overflow: 'hidden' }}>
        <Box
          sx={{
            height: '100%',
            flex: '1 0',
            minWidth: '550px',
            position: 'relative',
            borderRight: 'small',
            borderRightColor: 'neutral4',
          }}
        >
          <DirectionButton
            direction={expandedTable ? 'left' : 'right'}
            buttonSx={{
              top: '-1px',
              right: expandedTable ? '-1px' : '0px',
              height: 48,
              borderLeft: 'small',
              border: 'none',
              borderColor: ['neutral4', 'neutral4', 'neutral4', 'neutral4'],
            }}
            onClick={() => setExpandedTable((prev) => !prev)}
          />
          <Flex
            pl={3}
            pr={4}
            sx={{
              height: 48,
              width: '100%',
              borderBottom: 'small',
              borderBottomColor: 'neutral4',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <FilterSection />
          </Flex>
          <Box height="calc(100% - 48px - 32px)">
            <ListVaultCopyTrades expanded={expandedTable} />
          </Box>
          <Flex px={2} height={32} sx={{ alignItems: 'center' }}>
            <SelectedCopyTradeActions />
          </Flex>
        </Box>
        <Box sx={{ flex: expandedTable ? 0 : '2 1', bg: 'neutral5' }}>
          <Box sx={{ height: 350, bg: 'neutral8' }}>
            <ChartGainsPositionRealtime position={currentOnchainPosition} orders={currentOnchainOrders} />
          </Box>
          <Flex flexDirection="column" height="calc(100% - 300px)">
            <Box px={3} pt={16}>
              <SectionTitle
                icon={Pulse}
                title={
                  <Flex alignItems="center" sx={{ gap: 2 }}>
                    <Trans>Open Positions</Trans>
                    {!!onchainPositions?.length && <Badge count={onchainPositions.length} />}
                  </Flex>
                }
                iconColor="primary1"
                suffix={<SettingConfigs activeWallet={activeWallet ?? null} copyWallets={vaultWallets} />}
              />
            </Box>
            <Box flex="auto" height="100%" width="100%" overflow="auto">
              {!!activeWallet && <VaultOnchainPositions smartWalletAddress={activeWallet.smartWalletAddress} />}
            </Box>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

enum TabEnum {
  SETTINGS = 'settings',
  POSITIONS = 'positions',
}
const tabConfigs = [
  { id: TabEnum.SETTINGS, title: <Trans>COPIES</Trans> },
  { id: TabEnum.POSITIONS, title: <Trans>OPENING POSITIONS</Trans> },
]

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
  const [tab, setTab] = useState(TabEnum.SETTINGS)
  const {
    activeWallet,
    selectedTraders,
    listTraderAddresses,
    allCopyTrades,
    handleToggleTrader,
    handleSelectAllTraders,
  } = useVaultManagementContext()
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
              <FundManagement />
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
        {tab === TabEnum.SETTINGS && (
          <>
            <Flex
              sx={{
                height: 48,
                width: '100%',
                borderBottom: 'small',
                borderBottomColor: 'neutral4',
                alignItems: 'center',
                gap: 0,
                position: 'relative',
              }}
            >
              <Box sx={{ maxWidth: [100, 100, 'max-content'], flexShrink: 0, px: 2 }}>
                <SelectTradersCopied
                  selectedTraders={selectedTraders}
                  allTraders={listTraderAddresses}
                  allCopyTrades={allCopyTrades}
                  handleToggleTrader={handleToggleTrader}
                  handleSelectAllTraders={handleSelectAllTraders}
                />
              </Box>
              {xl ? (
                <>
                  <Box flex="1" />
                  <VerticalDivider />
                  <FilterSection />
                </>
              ) : (
                <>
                  <VerticalDivider />
                  <Flex flex="1" sx={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <FundManagement />
                  </Flex>
                  <VerticalDivider />
                  <Flex pl={10} pr={3} sx={{ height: '100%', alignItems: 'center' }}>
                    <MobileFilterButton />
                  </Flex>
                </>
              )}
              <SelectedCopyTradeActions isAbsolutePosition hiddenSelectedText />
            </Flex>
            <Box height="calc(100% - 48px)">
              <ListVaultCopyTrades expanded={true} />
            </Box>
          </>
        )}
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
  const { activeWallet, handleChangeActiveWallet, vaultWallets } = useVaultManagementContext()
  return (
    <Flex sx={{ height: '100%', alignItems: 'center', flexShrink: 0 }}>
      <SelectCopyWallet currentWallet={activeWallet} wallets={vaultWallets} onChangeWallet={handleChangeActiveWallet} />
      {activeWallet && activeWallet.exchange === CopyTradePlatformEnum.GNS_V8 && !!activeWallet.smartWalletAddress && (
        <IconBox
          as={'a'}
          href={generateTraderDetailsRoute(
            getCopyTradePlatformProtocol(activeWallet.exchange),
            activeWallet.smartWalletAddress
          )}
          target="_blank"
          icon={<Logo size={16} />}
        />
      )}
    </Flex>
  )
}

function MobileFilterButton() {
  const {
    selectedStatus,
    isToggleAllProtocol,
    toggleAllProtocol,
    checkIsProtocolChecked,
    handleToggleProtocol,
    selectedProtocol,
    checkIsStatusChecked,
    handleToggleStatus,
  } = useVaultManagementContext()
  const [openMobileFilterModal, setOpenModal] = useState(false)

  return (
    <>
      <Flex sx={{ alignItems: 'center', gap: 1, flexShrink: 0 }} role="button" onClick={() => setOpenModal(true)}>
        <IconBox icon={<Funnel size={20} />} color="neutral3" sx={{ flexShrink: 0 }} />
        <Box
          sx={{
            fontSize: '11px',
            fontWeight: 'normal',
            lineHeight: '14px',
            width: 14,
            height: 14,
            borderRadius: '50%',
            bg: 'primary1',
            color: 'neutral8',
            textAlign: 'center',
          }}
        >
          {selectedStatus.length + selectedProtocol.length}
        </Box>
      </Flex>
      <RcDrawer
        background={themeColors.neutral7}
        open={openMobileFilterModal}
        onClose={() => setOpenModal(false)}
        width="300px"
        maskColor="rgba(19, 19, 19, 0.83)"
      >
        <Box p={3} sx={{ position: 'relative' }}>
          <Box sx={{ position: 'fixed', p: 2, top: 0, right: 0, bg: 'neutral7' }}>
            <IconBox icon={<XCircle size={20} />} color="neutral3" role="button" onClick={() => setOpenModal(false)} />
          </Box>
          <FilterByStatus checkIsStatusChecked={checkIsStatusChecked} handleToggleStatus={handleToggleStatus} />
          <Divider my={3} />
          <FilterBySource
            isDCP
            selectedProtocols={selectedProtocol}
            isToggleAllProtocol={isToggleAllProtocol}
            toggleAllProtocol={toggleAllProtocol}
            checkIsProtocolChecked={checkIsProtocolChecked}
            handleToggleProtocol={handleToggleProtocol}
          />
        </Box>
      </RcDrawer>
    </>
  )
}

function ListPositionSection() {
  const { activeWallet, vaultWallets, onchainPositions, currentOnchainPosition, currentOnchainOrders } =
    useVaultManagementContext()
  const [expandedPositions, setExpandedPositions] = useState(
    sessionStorage.getItem('user_vault_list_position_expanded') === '1'
  )
  useEffect(() => {
    sessionStorage.setItem('user_vault_list_position_expanded', expandedPositions ? '1' : '0')
  }, [expandedPositions])

  const { sm } = useResponsive()

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box
        sx={{ height: expandedPositions ? 0 : sm ? 400 : 360, bg: 'neutral8', overflow: 'hidden', transition: '0.3s' }}
      >
        <ChartGainsPositionRealtime position={currentOnchainPosition} orders={currentOnchainOrders} />
      </Box>
      <Flex
        flexDirection="column"
        height={expandedPositions ? '100%' : sm ? 'calc(100% - 300px)' : 'calc(100% - 250px)'}
        sx={{ position: 'relative', transition: '0.3s', border: 'none', borderTop: 'small', borderColor: 'neutral4' }}
      >
        <DirectionButton
          direction={expandedPositions ? 'bottom' : 'top'}
          buttonSx={{
            left: '50%',
            transform: 'translateX(-50%)',
            top: expandedPositions ? '-1px' : '-16px',
            border: 'small',
            zIndex: 1,
          }}
          onClick={() => setExpandedPositions((prev) => !prev)}
        />
        <Box px={3} pt={16}>
          <SectionTitle
            icon={Pulse}
            title={
              <Flex alignItems="center" sx={{ gap: 2 }}>
                <Trans>Open Positions</Trans>
                {!!onchainPositions?.length && <Badge count={onchainPositions.length} />}
              </Flex>
            }
            iconColor="primary1"
            suffix={<SettingConfigs activeWallet={activeWallet ?? null} copyWallets={vaultWallets} />}
          />
        </Box>
        <Box flex="auto" height="100%">
          {!!activeWallet && <OnchainPositions activeWallet={activeWallet} />}
        </Box>
      </Flex>
    </Box>
  )
}

function FilterSection() {
  const {
    isToggleAllProtocol,
    toggleAllProtocol,
    checkIsProtocolChecked,
    handleToggleProtocol,
    selectedProtocol,
    checkIsStatusChecked,
    handleToggleStatus,
  } = useVaultManagementContext()
  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <FilterBySourceDropdown
          isDCP
          selectedProtocols={selectedProtocol}
          isToggleAllProtocol={isToggleAllProtocol}
          toggleAllProtocol={toggleAllProtocol}
          checkIsProtocolChecked={checkIsProtocolChecked}
          handleToggleProtocol={handleToggleProtocol}
        />
        <SelectedCopyTradeActions isAbsolutePosition hiddenCancel hiddenSelectAll wrapperSx={{ px: 0 }} />
      </Box>
      <FilterByStatus checkIsStatusChecked={checkIsStatusChecked} handleToggleStatus={handleToggleStatus} />
    </>
  )
}

function FundManagement() {
  const [showBalance, setShowBalance] = useState(false)
  const { activeWallet } = useVaultManagementContext()
  const { total, available } = useWalletFund({
    address: activeWallet?.smartWalletAddress,
    platform: activeWallet?.exchange,
    totalIncluded: true,
  })
  const Icon = showBalance ? EyeClosed : Eye
  const { sm } = useResponsive()
  return (
    <Flex sx={{ alignItems: 'center' }}>
      <Type.Caption>{sm ? <Trans>Available / Total Fund:</Trans> : <Trans>Available:</Trans>}</Type.Caption>
      {sm ? (
        <Type.Caption ml={2} sx={{ fontWeight: 600 }}>
          {showBalance ? (
            `$${formatNumber(available?.num ?? 0, 2, 2)} / $${formatNumber(total?.num ?? 0, 2, 2)}`
          ) : (
            <>
              <Box as="span" sx={{ transform: 'translateY(3px)', display: 'inline-block' }}>
                ********
              </Box>{' '}
              /{' '}
              <Box as="span" sx={{ transform: 'translateY(3px)', display: 'inline-block' }}>
                ********
              </Box>
            </>
          )}
        </Type.Caption>
      ) : (
        <Type.Caption ml={2} sx={{ fontWeight: 600 }}>
          {showBalance ? (
            `$${formatNumber(available?.num ?? 0, 2, 2)}`
          ) : (
            <Type.Caption>
              <Box as="span" sx={{ transform: 'translateY(3px)', display: 'inline-block' }}>
                ********
              </Box>
              {sm && (
                <>
                  {' / '}
                  <Box as="span" sx={{ transform: 'translateY(3px)', display: 'inline-block' }}>
                    ********
                  </Box>
                </>
              )}
            </Type.Caption>
          )}
        </Type.Caption>
      )}
      <IconBox
        role="button"
        onClick={() => setShowBalance((prev) => !prev)}
        ml={2}
        mr={3}
        icon={<Icon size={16} />}
        color="neutral3"
        sx={{ '&:hover': { color: 'neutral2' } }}
      />
      <DepositButton />
    </Flex>
  )
}

function DepositButton() {
  const [fundingModal, setFundingModal] = useState<FundTab | null>(null)
  const { activeWallet } = useVaultManagementContext()
  return (
    <>
      <Flex alignItems="center" sx={{ gap: 0 }}>
        <Button variant="ghostPrimary" sx={{ p: 0 }} onClick={() => setFundingModal(FundTab.Deposit)}>
          Deposit
        </Button>
        {activeWallet && <SmartWalletActions data={activeWallet} setFundingModal={setFundingModal} isOnlyAction />}
        {activeWallet && fundingModal && (
          <FundModal
            initialTab={fundingModal}
            smartWallet={activeWallet.smartWalletAddress ?? ''}
            platform={activeWallet.exchange}
            onDismiss={() => setFundingModal(null)}
          />
        )}
      </Flex>
    </>
  )
}

function VerticalDivider({ fullHeight = false }: { fullHeight?: boolean }) {
  return <Box sx={{ width: '1px', height: fullHeight ? '100%' : 'calc(100% - 6px)', flexShrink: 0, bg: 'neutral4' }} />
}
