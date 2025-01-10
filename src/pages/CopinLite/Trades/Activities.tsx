import { Trans } from '@lingui/macro'
import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useState } from 'react'
import { useQuery } from 'react-query'

import { getUserActivityLogsApi } from 'apis/activityLogApis'
import CopyPositionDetails from 'components/@position/CopyPositionDetails'
import Container from 'components/@ui/Container'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useIsMobile from 'hooks/helpers/useIsMobile'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import ListActivityMobile from 'pages/MyProfile/UserActivity/ListActivityMobile'
import { CopySelection, ExternalSource, getUserActivityColumns } from 'pages/MyProfile/UserActivity/configs'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import RcDrawer from 'theme/RcDrawer'
import Table from 'theme/Table'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { QUERY_KEYS, TOOLTIP_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import { TradesTab } from './types'

const LiteActivities = ({ currentTab }: { currentTab: string }) => {
  const { lg } = useResponsive()
  const { embeddedWallet, loadingEmbeddedWallets } = useCopyWalletContext()
  const { currentPage, changeCurrentPage, currentLimit, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: URL_PARAM_KEYS.LITE_ACTIVITIES_PAGE,
    limitName: URL_PARAM_KEYS.LITE_ACTIVITIES_LIMIT,
    defaultLimit: DEFAULT_LIMIT,
  })
  const { data, isFetching } = useQuery(
    [QUERY_KEYS.GET_USER_ACTIVITY_LOGS, currentPage, currentLimit, embeddedWallet?.id],
    () =>
      getUserActivityLogsApi({
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
        copyWalletIds: embeddedWallet ? [embeddedWallet.id] : [],
      }),
    { keepPreviousData: true, retry: 0, enabled: currentTab === TradesTab.Activities }
  )

  const [openCopyDrawer, setOpenCopyDrawer] = useState(false)
  const [currentCopyPosition, setCurrentCopyPosition] = useState<CopySelection>()
  const handleSelectCopyItem = async (data: CopySelection) => {
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

  return (
    <>
      <Flex flexDirection="column" height="100%">
        {loadingEmbeddedWallets ? (
          <Loading />
        ) : (
          <>
            <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
              {lg ? (
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
                />
              ) : (
                <ListActivityMobile
                  data={data?.data}
                  isLoading={isFetching}
                  externalSource={externalSource}
                  layoutType="lite"
                />
              )}
              <Tooltip id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE} place="top" type="dark" effect="solid">
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
          <CopyPositionDetails id={currentCopyPosition?.id ?? ''} copyTradeId={currentCopyPosition?.copyTradeId} />
        </Container>
      </RcDrawer>
    </>
  )
}

export default LiteActivities
