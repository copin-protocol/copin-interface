import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'

import { GetMyPositionRequestBody, GetMyPositionsParams } from 'apis/types'
import { getMyCopyPositionsApi } from 'apis/userApis'
import CopyHistoryPositions from 'components/@position/CopyHistoryPositions'
import LiteHistoryFilterTrader from 'components/@position/CopyHistoryPositions/LiteHistoryFilterTrader'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import NoDataOrSelect from 'pages/MyProfile/NoDataOrSelect'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import { Box, Flex } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { PositionStatusEnum } from 'utils/config/enums'
import { QUERY_KEYS, STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import SwitchLayoutButtons from '../SwitchLayoutButtons'
import useMobileLayoutHandler from '../useMobileLayoutHandler'
import { TradesTab } from './types'
import { useLiteHistoryPositionsContext } from './useHistoryPositionsContext'

const LiteHistory = ({ currentTab }: { currentTab: string }) => {
  const { embeddedWallet, loadingEmbeddedWallets } = useCopyWalletContext()
  const { selectedTraders, handleToggleAllTrader } = useLiteHistoryPositionsContext()

  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    limitName: URL_PARAM_KEYS.LITE_HISTORY_LIMIT,
    pageName: URL_PARAM_KEYS.LITE_HISTORY_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  })
  const _queryParams: GetMyPositionsParams = useMemo(
    () => ({
      limit: currentLimit,
      offset: pageToOffset(currentPage, currentLimit),
      status: [PositionStatusEnum.CLOSE],
    }),
    [currentLimit, currentPage]
  )
  const _queryBody: GetMyPositionRequestBody = useMemo(
    () => ({
      copyWalletIds: embeddedWallet ? [embeddedWallet.id] : [],
      traders: !!selectedTraders ? selectedTraders : undefined,
    }),
    [embeddedWallet, selectedTraders]
  )
  const {
    data,
    isFetching: isLoading,
    refetch,
  } = useQuery(
    [QUERY_KEYS.GET_MY_COPY_POSITIONS, _queryParams, _queryBody, currentPage, embeddedWallet?.id],
    () => getMyCopyPositionsApi(_queryParams, _queryBody),
    {
      enabled: currentTab == TradesTab.History,
      retry: 0,
      keepPreviousData: true,
    }
  )
  const hasSelectedTraders = selectedTraders == null || !!selectedTraders.length
  const { lg } = useResponsive()

  const { layoutType, handleChangeLayout } = useMobileLayoutHandler({
    storageKey: STORAGE_KEYS.LITE_HISTORY_LAYOUT,
    mobileBreakpoint: lg,
  })

  return (
    <Flex flexDirection="column" height="100%">
      {loadingEmbeddedWallets ? (
        <Loading />
      ) : (
        <>
          {!lg && (
            <Flex
              sx={{
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: 'small',
                borderBottomColor: 'neutral4',
                px: 3,
              }}
            >
              <LiteHistoryFilterTrader type="textAndIcon" />
              <SwitchLayoutButtons layoutType={layoutType} onChangeType={handleChangeLayout} />
            </Flex>
          )}
          <Box flex="1 0 0" overflow="hidden">
            <CopyHistoryPositions
              layoutType="lite"
              mobileLayoutType={layoutType}
              data={data?.data}
              isLoading={isLoading}
              currentSort={undefined}
              changeCurrentSort={undefined}
              deletedTraders={[]}
              onClosePositionSuccess={refetch}
              noDataComponent={
                !hasSelectedTraders ? (
                  <NoDataOrSelect
                    type="noSelectTradersInHistory"
                    handleClickActionButton={() => handleToggleAllTrader(true)}
                    actionButtonText={<Trans>Select All Traders</Trans>}
                    isLoading={isLoading}
                  />
                ) : undefined
              }
            />
          </Box>
          <PaginationWithLimit
            currentLimit={currentLimit}
            onLimitChange={changeCurrentLimit}
            currentPage={currentPage}
            onPageChange={changeCurrentPage}
            apiMeta={data?.meta}
            sx={{ py: 2 }}
          />
        </>
      )}
    </Flex>
  )
}

export default LiteHistory
