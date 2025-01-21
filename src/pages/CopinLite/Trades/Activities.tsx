import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useState } from 'react'
import { useQuery } from 'react-query'

import { getUserActivityLogsApi } from 'apis/activityLogApis'
import CopyPositionDetails from 'components/@position/CopyPositionDetails'
import Container from 'components/@ui/Container'
import { CopyPositionData } from 'entities/copyTrade'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useIsMobile from 'hooks/helpers/useIsMobile'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import NoDataOrSelect from 'pages/MyProfile/NoDataOrSelect'
import ListActivityMobile from 'pages/MyProfile/UserActivity/ListActivityMobile'
import LiteActivitiesFilterTrader from 'pages/MyProfile/UserActivity/LiteHistoryFilterTrader'
import { ExternalSource, getUserActivityColumns } from 'pages/MyProfile/UserActivity/configs'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import RcDrawer from 'theme/RcDrawer'
import Table from 'theme/Table'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS, STORAGE_KEYS, TOOLTIP_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import SwitchLayoutButtons from '../SwitchLayoutButtons'
import useMobileLayoutHandler from '../useMobileLayoutHandler'
import { TradesTab } from './types'
import { useLiteActivitiesContext } from './useActivitiesContext'

const LiteActivities = ({ currentTab }: { currentTab: string }) => {
  const { lg } = useResponsive()
  const { embeddedWallet, loadingEmbeddedWallets } = useCopyWalletContext()
  const { selectedTraders, handleToggleAllTrader } = useLiteActivitiesContext()

  const { currentPage, changeCurrentPage, currentLimit, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: URL_PARAM_KEYS.LITE_ACTIVITIES_PAGE,
    limitName: URL_PARAM_KEYS.LITE_ACTIVITIES_LIMIT,
    defaultLimit: DEFAULT_LIMIT,
  })
  const { data, isFetching } = useQuery(
    [QUERY_KEYS.GET_USER_ACTIVITY_LOGS, currentPage, currentLimit, embeddedWallet?.id, selectedTraders],
    () =>
      getUserActivityLogsApi({
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        copyWalletIds: embeddedWallet ? [embeddedWallet.id] : [],
        traders: !!selectedTraders ? selectedTraders : undefined,
        method: 'POST',
        sortBy: 'createdAt',
        sortType: SortTypeEnum.DESC,
      }),
    { keepPreviousData: true, retry: 0, enabled: currentTab === TradesTab.Activities }
  )

  const [openCopyDrawer, setOpenCopyDrawer] = useState(false)
  const [currentCopyPosition, setCurrentCopyPosition] = useState<CopyPositionData>()
  const handleSelectCopyItem = async (data: CopyPositionData) => {
    setCurrentCopyPosition(data)
    setOpenCopyDrawer(true)
  }
  const handleCopyDismiss = () => {
    setOpenCopyDrawer(false)
  }

  const isMobile = useIsMobile()

  const externalSource: ExternalSource = {
    handleSelectCopyItem,
    copyWallets: embeddedWallet ? [embeddedWallet] : undefined,
    isMobile: !lg,
  }

  const hasSelectedTraders = selectedTraders == null || !!selectedTraders.length
  const { layoutType, handleChangeLayout } = useMobileLayoutHandler({
    storageKey: STORAGE_KEYS.LITE_HISTORY_LAYOUT,
    mobileBreakpoint: lg,
  })

  return (
    <>
      <Flex flexDirection="column" height="100%">
        {loadingEmbeddedWallets ? (
          <Loading />
        ) : (
          <>
            {!lg && (
              <Flex
                sx={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: 'small',
                  borderBottomColor: 'neutral4',
                  px: 3,
                }}
              >
                <LiteActivitiesFilterTrader type="textAndIcon" />
                <SwitchLayoutButtons layoutType={layoutType} onChangeType={handleChangeLayout} />
              </Flex>
            )}
            <Box flex="1 0 0" sx={{ overflow: 'hidden', pt: 2 }}>
              {layoutType === 'LIST' ? (
                <Table
                  data={data?.data}
                  restrictHeight
                  columns={getUserActivityColumns('lite')}
                  isLoading={isFetching}
                  externalSource={externalSource}
                  tableBodyWrapperSx={{ table: { borderSpacing: '0 0' }, '& tbody tr': { bg: 'neutral7' } }}
                  noDataMessage={<Trans>No Activity Found</Trans>}
                  currentSort={undefined}
                  changeCurrentSort={undefined}
                  noDataComponent={
                    !hasSelectedTraders ? (
                      <NoSelectTrader isFetching={isFetching} handleToggleAllTrader={handleToggleAllTrader} />
                    ) : undefined
                  }
                />
              ) : (
                <ListActivityMobile
                  data={data?.data}
                  isLoading={isFetching}
                  externalSource={externalSource}
                  layoutType="lite"
                  noDataComponent={
                    !hasSelectedTraders ? (
                      <NoSelectTrader isFetching={isFetching} handleToggleAllTrader={handleToggleAllTrader} />
                    ) : undefined
                  }
                />
              )}
              <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE}>
                <Type.Caption color="orange1" sx={{ maxWidth: 350 }}>
                  Reverse Copy
                </Type.Caption>
              </Tooltip>
            </Box>
            <PaginationWithLimit
              currentPage={currentPage}
              currentLimit={currentLimit}
              onPageChange={changeCurrentPage}
              onLimitChange={changeCurrentLimit}
              apiMeta={data?.meta}
              sx={{ py: 2 }}
            />
          </>
        )}
      </Flex>
      <RcDrawer
        open={openCopyDrawer}
        onClose={handleCopyDismiss}
        width={isMobile ? '100%' : '60%'}
        background={themeColors.neutral5}
      >
        <Container sx={{ position: 'relative', height: '100%' }}>
          <IconButton
            icon={<XCircle size={24} />}
            variant="ghost"
            sx={{ position: 'absolute', right: 1, top: 1, zIndex: 1 }}
            onClick={handleCopyDismiss}
          />
          <CopyPositionDetails copyPositionData={currentCopyPosition} />
        </Container>
      </RcDrawer>
    </>
  )
}

export default LiteActivities

function NoSelectTrader({
  isFetching,
  handleToggleAllTrader,
}: {
  isFetching: boolean
  handleToggleAllTrader: (isSelectedAll: boolean) => void
}) {
  return (
    <NoDataOrSelect
      type="noSelectTradersInHistory"
      handleClickActionButton={() => handleToggleAllTrader(true)}
      actionButtonText={<Trans>Select All Traders</Trans>}
      isLoading={isFetching}
    />
  )
}
