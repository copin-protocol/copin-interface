import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getCopyTradeSettingsListApi } from 'apis/copyTradeApis'
import UserActivityView from 'components/@copyActivity/UserActivityView'
import ListCopyTrade from 'components/@copyTrade/ListCopyTrade'
import SelectCopyWallet from 'components/@copyTrade/SelectCopyWallet'
import { CopyTradeWithCheckingData } from 'components/@copyTrade/types'
import Divider from 'components/@ui/Divider'
import TraderAddress from 'components/@ui/TraderAddress'
import { CopyPositionData, CopyTradeData } from 'entities/copyTrade'
import { CopyWalletData } from 'entities/copyWallet'
import { UserActivityData } from 'entities/user'
import HistoryPositionsView from 'pages/MyProfile/HistoryPositions/HistoryPositionView'
import OpeningPositions from 'pages/MyProfile/OpeningPositions'
import RcDrawer, { DrawerTitle } from 'theme/RcDrawer'
import { TabHeader } from 'theme/Tab'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum, ProtocolEnum, SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { Z_INDEX } from 'utils/config/zIndex'

export default function CopyManagementDrawer({
  isOpen,
  onClose,
  address,
  protocol,
  copyWallet,
  listWallets,
  onChangeWallet,
  isSelectedAll,
  onSelectAllWallets,
}: {
  isOpen: boolean
  onClose: () => void
  address: string
  protocol: ProtocolEnum
  copyWallet: CopyWalletData
  listWallets: CopyWalletData[]
  onChangeWallet: (wallet: CopyWalletData) => void
  isSelectedAll: boolean
  onSelectAllWallets: (wallets?: CopyWalletData[]) => void
}) {
  const { lg } = useResponsive()
  return (
    <RcDrawer open={isOpen} onClose={onClose} width={lg ? '60%' : '100%'} zIndex={Z_INDEX.TOASTIFY}>
      <Flex flexDirection="column" height="100%">
        <Box p={3}>
          <DrawerTitle
            title={
              <Flex sx={{ alignItems: 'center', gap: 3 }}>
                <Type.Head display="flex" sx={{ alignItems: 'center', gap: '1ch' }}>
                  <TraderAddress
                    address={address}
                    options={{ isLink: false, textSx: { fontSize: 'inherit', width: 'auto', fontWeight: 'bold' } }}
                  />
                  COPY-TRADES ON
                  <SelectCopyWallet
                    wallets={listWallets}
                    currentWallet={copyWallet}
                    onChangeWallet={onChangeWallet}
                    isSelectedAll={isSelectedAll}
                    hasSelectAll
                    onSelectAll={onSelectAllWallets}
                  />
                </Type.Head>
              </Flex>
            }
            onClose={onClose}
          />
        </Box>
        <Box flex="1 0 0" overflow="hidden">
          <CopyManagementDrawerContent
            isSelectedAll={isSelectedAll}
            copyWallet={copyWallet}
            address={address}
            protocol={protocol}
            listCopyWallets={listWallets}
          />
        </Box>
      </Flex>
    </RcDrawer>
  )
}

function CopyManagementDrawerContent({
  copyWallet,
  address,
  protocol,
  listCopyWallets,
  isSelectedAll,
}: {
  copyWallet: CopyWalletData
  address: string
  protocol: ProtocolEnum
  listCopyWallets: CopyWalletData[]
  isSelectedAll: boolean
}) {
  const queryParams = {
    copyWalletId: isSelectedAll ? undefined : copyWallet.id,
    accounts: [address],
    status: undefined,
    protocols: [protocol],
  }
  const { data: copyTrades, isFetching: isLoadingCopyTrades } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_SETTINGS, queryParams],

    () => getCopyTradeSettingsListApi(queryParams),
    {
      retry: 0,
      keepPreviousData: true,
    }
  )
  const excludingKeys: (keyof CopyTradeWithCheckingData)[] = useMemo(() => {
    return isSelectedAll ? ['pnl7D', 'pnl'] : ['pnl', 'pnl7D', 'copyWalletId', 'account']
  }, [isSelectedAll])
  return (
    <Flex flexDirection="column" sx={{ width: '100%', height: '100%' }}>
      <Box flex="1 0 0" overflow="hidden">
        <ListCopyTrade
          type={'drawer'}
          copyTrades={copyTrades}
          isLoadingCopyTrades={isLoadingCopyTrades}
          activeWallet={isSelectedAll ? null : copyWallet}
          externalSource={{ copyWallets: listCopyWallets }}
          excludingColumnKeys={excludingKeys}
          tableBg="neutral7"
        />
      </Box>
      <Divider />
      <CopyActivityContent
        copyWallets={isSelectedAll ? listCopyWallets : [copyWallet]}
        address={address}
        isSelectedAll={isSelectedAll}
        copyTrades={copyTrades}
      />
    </Flex>
  )
}

enum TabKeyEnum {
  OPENING = 'opening',
  CLOSED = 'closed',
  ACTIVITIES = 'activities',
}

const TABS = [
  { key: TabKeyEnum.OPENING, name: <Trans>Opening Positions</Trans> },
  { key: TabKeyEnum.CLOSED, name: <Trans>History</Trans> },
  { key: TabKeyEnum.ACTIVITIES, name: <Trans>Activities</Trans> },
]

function CopyActivityContent({
  copyWallets,
  address,
  isSelectedAll,
  copyTrades,
}: {
  copyTrades: CopyTradeData[] | undefined
  address: string
  isSelectedAll: boolean
  copyWallets: CopyWalletData[]
}) {
  const [currentTab, setTab] = useState(TabKeyEnum.OPENING)
  const handleChangeTab = (key: string) => setTab(key as TabKeyEnum)
  return (
    <>
      <TabHeader
        configs={TABS}
        isActiveFn={(config) => config.key === currentTab}
        onClickItem={handleChangeTab}
        hasLine
      />
      <Box flex="1 0 0" overflow="hidden">
        {currentTab === TabKeyEnum.OPENING && (
          <OpeningPositions
            activeWallet={null}
            copyWallets={copyWallets}
            traders={[address]}
            hasLabel={false}
            layoutType={'normal'}
            excludingColumnKeys={isSelectedAll ? [] : ['copyAccount']}
            bg="transparent"
          />
        )}
        {currentTab === TabKeyEnum.CLOSED && (
          <HistoryPositions copyWallets={copyWallets} address={address} isSelectedAll={isSelectedAll} />
        )}
        {currentTab === TabKeyEnum.ACTIVITIES && (
          <UserActivities copyWallets={copyWallets} address={address} copyTrades={copyTrades} />
        )}
      </Box>
    </>
  )
}

function HistoryPositions({
  address,
  copyWallets,
  isSelectedAll,
}: {
  address: string
  copyWallets: CopyWalletData[]
  isSelectedAll: boolean
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT)

  const [currentSort, setCurrentSort] = useState<TableSortProps<CopyPositionData> | undefined>(() => {
    const initSortBy: TableSortProps<CopyPositionData>['sortBy'] = 'createdAt'
    const initSortType = SortTypeEnum.DESC
    return { sortBy: initSortBy, sortType: initSortType }
  })
  const changeCurrentSort = (sort: TableSortProps<CopyPositionData> | undefined) => {
    setCurrentSort(sort)
    setCurrentPage(1)
  }
  const excludingKeys: (keyof CopyPositionData)[] = isSelectedAll ? ['copyAccount'] : ['copyAccount', 'copyTradeId']
  return (
    <Flex flexDirection="column" sx={{ width: '100%', height: '100%' }}>
      <HistoryPositionsView
        layoutType="normal"
        selectedTraders={[address]}
        deletedTraders={undefined}
        selectedStatus={[PositionStatusEnum.CLOSE]}
        selectedWallets={copyWallets}
        currentSort={currentSort}
        changeCurrentSort={changeCurrentSort}
        currentPage={currentPage}
        currentLimit={currentLimit}
        changeCurrentPage={setCurrentPage}
        changeCurrentLimit={setCurrentLimit}
        excludingColumnKeys={excludingKeys}
      />
    </Flex>
  )
}

function UserActivities({
  copyWallets,
  address,
  copyTrades,
}: {
  copyWallets: CopyWalletData[]
  address: string
  copyTrades: CopyTradeData[] | undefined
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT)

  const [currentSort, setCurrentSort] = useState<TableSortProps<UserActivityData> | undefined>(() => {
    const initSortBy: TableSortProps<UserActivityData>['sortBy'] = 'createdAt'
    const initSortType = SortTypeEnum.DESC
    return { sortBy: initSortBy, sortType: initSortType }
  })
  const changeCurrentSort = (sort: TableSortProps<UserActivityData> | undefined) => {
    setCurrentSort(sort)
    setCurrentPage(1)
  }
  const excludingKeys: (keyof UserActivityData)[] = ['sourceAccount']

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
      {copyTrades && (
        <UserActivityView
          traders={[address]}
          copyWalletIds={copyWallets.map((e) => e.id)}
          copyTradeIds={copyTrades.map((v) => v.id)}
          currentPage={currentPage}
          currentLimit={currentLimit}
          currentSort={currentSort}
          changeCurrentPage={setCurrentPage}
          changeCurrentLimit={setCurrentLimit}
          changeCurrentSort={changeCurrentSort}
          copyWallets={copyWallets}
          excludingColumnKeys={excludingKeys}
        />
      )}
    </Flex>
  )
}
