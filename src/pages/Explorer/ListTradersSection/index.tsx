import { ArrowElbowLeftUp } from '@phosphor-icons/react'
import { useResponsive, useSize } from 'ahooks'
import { memo, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import { ApiListResponse } from 'apis/api'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import { CompareButton } from 'components/@backtest/BacktestPickTradersButton'
import TraderListCard from 'components/@trader/TraderExplorerListView'
import CustomizeColumnMobile from 'components/@trader/TraderExplorerListView/CustomizeColumnMobile'
import TraderListTable from 'components/@trader/TraderExplorerTableView'
import CustomizeColumn from 'components/@trader/TraderExplorerTableView/CustomizeColumn'
import { tableSettings } from 'components/@trader/TraderExplorerTableView/configs'
import { TraderData } from 'entities/trader.d'
import { useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'
import { useAuthContext } from 'hooks/web3/useAuth'
import ExportCsvButton from 'pages/Explorer/ConditionFilter/ExportCsvButton'
import useBacktestTradersActions from 'pages/Explorer/ListTradersSection/useBacktestTradersActions'
import useQueryTraders from 'pages/Explorer/ListTradersSection/useQueryTraders'
import { TradersContextData } from 'pages/Explorer/useTradersContext'
import { PaginationWithLimit } from 'theme/Pagination'
import ProgressBar from 'theme/ProgressBar'
import { Box, Flex, Type } from 'theme/base'
import { MEDIA_WIDTHS } from 'theme/theme'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

const ListTradersSection = memo(function ListTradersSectionMemo({
  contextValues,
  notes,
}: {
  contextValues: TradersContextData
  notes?: { [key: string]: string }
}) {
  const { sm } = useResponsive()
  const {
    protocol,
    tab,
    accounts,
    isRangeSelection,
    timeRange,
    timeOption,
    currentSort,
    changeCurrentSort,
    currentPage,
    changeCurrentPage,
    currentLimit,
    changeCurrentLimit,
    filterTab,
    selectedProtocols,
    setSelectedProtocols,
  } = contextValues

  const { data, isLoading, isRangeProgressing, loadingRangeProgress } = useQueryTraders({
    protocol,
    tab,
    timeRange,
    timeOption,
    isRangeSelection,
    accounts,
    filterTab,
    selectedProtocols,
    setSelectedProtocols,
  })

  const { isSelectedAll, handleSelectAll, checkIsSelected, handleSelect } = useBacktestTradersActions({
    tradersData: data,
    isLoading,
  })

  const formatedData = data?.data.map((item) => ({ ...item, note: notes ? notes[item.account] : undefined }))

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <>
        {isRangeProgressing ? (
          <Flex sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Box mt={4} mb={3} variant="card" sx={{ mx: 'auto', maxWidth: 600, width: '100%' }}>
              <Type.Body textAlign="center" display="block" mb={24}>
                Data is being processed. Please wait a few minutes
              </Type.Body>
              <ProgressBar
                percent={((loadingRangeProgress?.processed ?? 0) / (loadingRangeProgress?.total ?? 0)) * 100}
                height={8}
                color="primary1"
                bg="neutral6"
              />
            </Box>
          </Flex>
        ) : null}
      </>
      {isRangeProgressing ? null : (
        <>
          <Box
            flex="1 0 0"
            sx={{
              overflow: 'hidden',
              borderBottom: 'small',
              borderBottomColor: 'neutral5',
              bg: 'neutral7',
              position: 'relative',
            }}
          >
            {sm ? (
              <TraderListTable
                data={formatedData}
                isLoading={isLoading}
                currentSort={currentSort}
                changeCurrentSort={changeCurrentSort}
                isSelectedAll={isSelectedAll}
                handleSelectAll={handleSelectAll}
                tableSettings={tableSettings}
                checkIsSelected={checkIsSelected}
                handleSelect={handleSelect}
                hiddenSelectAllBox
                hiddenSelectItemBox
                lefts={[0, 0]}
              />
            ) : (
              <TraderListCard data={formatedData} isLoading={isLoading} />
            )}
          </Box>
          <TablePagination
            data={data}
            accounts={accounts}
            currentPage={currentPage}
            currentLimit={currentLimit}
            changeCurrentLimit={changeCurrentLimit}
            changeCurrentPage={changeCurrentPage}
          />
        </>
      )}
    </Flex>
  )
})

export default ListTradersSection

function TablePagination({
  data,
  accounts,
  currentPage,
  currentLimit,
  changeCurrentPage,
  changeCurrentLimit,
}: {
  accounts: string[] | undefined
  currentPage: number
  currentLimit: number
  changeCurrentPage: (page: number) => void
  changeCurrentLimit: (page: number) => void
  data: ApiListResponse<TraderData> | undefined
}) {
  const { md } = useResponsive()
  const ref = useRef(null)
  const size = useSize(ref)
  return (
    <>
      {accounts?.length && <CompareTradersButton />}
      {!accounts?.length &&
        (md ? (
          <TabletWrapper ref={ref}>
            <Flex
              className="layout__wrapper"
              sx={{
                alignItems: 'center',
                justifyContent: 'end',
                columnGap: 2,
                rowGap: 0,
                pr: [48, 48, 48, 0],
              }}
            >
              <Flex className="pagination__wrapper" sx={{ alignItems: 'center', gap: 0 }}>
                <PaginationWithLimit
                  sx={{ px: 2 }}
                  currentPage={currentPage}
                  currentLimit={currentLimit}
                  onPageChange={changeCurrentPage}
                  onLimitChange={changeCurrentLimit}
                  apiMeta={data?.meta}
                  my={1}
                  menuPosition="top"
                  disabledInput={size?.width && size.width < 550 ? true : false}
                />
                {data && (
                  <>
                    <Box sx={{ width: 1, height: 40, bg: 'neutral4', flexShrink: 0 }} />
                    <ExportCsvButton hasTitle={size?.width && size.width > 950 ? true : false} />
                    <Box sx={{ width: 1, height: 40, bg: 'neutral4', flexShrink: 0 }} />
                    <Flex sx={{ gap: 20, alignItems: 'center', px: 2, py: 2, pr: !md ? 5 : 2 }}>
                      {/* <TradersVisualizer traders={data.data} hasButtonTitle={buttonsHasTitle ? true : lg ? true : false} /> */}
                      <CustomizeColumn hasTitle={size?.width && size.width > 950 ? true : false} />
                    </Flex>
                  </>
                )}
              </Flex>
            </Flex>
          </TabletWrapper>
        ) : (
          <Box display={['block', 'flex']}>
            <Flex
              sx={{
                px: 12,
                '& *': { fontSize: '12px' },
                alignItems: 'center',
                gap: [12, 2],
                borderTop: ['small', 'none'],
                borderTopColor: ['neutral4', 'none'],
              }}
            >
              <Box flex="1">
                <PaginationWithLimit
                  currentLimit={currentLimit}
                  onLimitChange={changeCurrentLimit}
                  currentPage={currentPage}
                  onPageChange={changeCurrentPage}
                  apiMeta={data?.meta}
                  sx={{ flexDirection: 'row', px: 0 }}
                />
              </Box>
              <Box sx={{ width: 1, height: 40, bg: 'neutral4', flexShrink: 0 }} />
              <CustomizeColumnMobile />
            </Flex>
          </Box>
        ))}
    </>
  )
}

const TabletWrapper = styled(Box)`
  ${({ theme }) => `
    @media screen and (max-width: 1250px) and (min-width: ${MEDIA_WIDTHS.upToMedium}px) {
      .layout__wrapper {
        flex-direction: column;
        align-items: start;
        
      }
      .pagination__wrapper {
        border-top: 1px solid ${theme.colors.neutral4};
        width: 100%;
      }
    }
  `}
`

function CompareTradersButton() {
  const { currentHomeInstanceId, getCommonData } = useSelectBacktestTraders()

  const { homeInstance: currentHomeInstance } = getCommonData({ homeId: currentHomeInstanceId })

  const listAddress = currentHomeInstance?.tradersByIds ?? []
  return (
    <Flex
      width={['100%', 228]}
      height={40}
      sx={{
        alignItems: 'center',
        gap: 2,
        px: listAddress.length === 2 ? 0 : 3,
        flexShrink: 0,
        borderRight: 'small',
        borderColor: ['transparent', 'neutral4'],
      }}
      color="neutral3"
    >
      {listAddress.length === 2 ? (
        <CompareButton listAddress={listAddress} hasDivider={false} block />
      ) : (
        <>
          <ArrowElbowLeftUp size={16} />
          <Type.Caption color="neutral3">Select 2 traders to compare</Type.Caption>
        </>
      )}
    </Flex>
  )
}
