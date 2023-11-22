import { useResponsive, useSize } from 'ahooks'
import { memo, useEffect, useRef } from 'react'
import styled from 'styled-components/macro'

import { ApiListResponse } from 'apis/api'
import PickTradersButton from 'components/BacktestPickTradersButton'
import { useClickLoginButton } from 'components/LoginAction'
import TraderListTable from 'components/Tables/TraderListTable'
import CustomizeColumn from 'components/Tables/TraderListTable/CustomizeColumn'
import { mobileTableSettings, tableSettings } from 'components/Tables/TraderListTable/dataConfig'
import { TraderData } from 'entities/trader.d'
import { useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'
import { useAuthContext } from 'hooks/web3/useAuth'
import { PaginationWithLimit } from 'theme/Pagination'
import ProgressBar from 'theme/ProgressBar'
import { Box, Flex, Type } from 'theme/base'
import { MEDIA_WIDTHS } from 'theme/theme'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { TradersContextData } from '../useTradersContext'
import useBacktestTradersActions from './useBacktestTradersActions'
import useQueryTraders from './useQueryTraders'

function ListTradersSection({
  contextValues,
  notes,
}: {
  contextValues: TradersContextData
  notes?: { [key: string]: string }
}) {
  const { sm } = useResponsive()
  const settings = sm ? tableSettings : mobileTableSettings
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
  } = contextValues

  const { data, isLoading, isRangeProgressing, loadingRangeProgress } = useQueryTraders({
    protocol,
    tab,
    timeRange,
    timeOption,
    isRangeSelection,
    accounts,
    filterTab,
  })

  const { isSelectedAll, handleSelectAll, checkIsSelected, handleSelect } = useBacktestTradersActions({
    tradersData: data,
    isLoading,
  })

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
            flex="1"
            sx={{ overflow: 'hidden', borderBottom: 'small', borderBottomColor: 'neutral5', bg: 'neutral7' }}
          >
            <TraderListTable
              data={data?.data.map((item) => ({ ...item, note: notes ? notes[item.account] : undefined }))}
              isLoading={isLoading}
              currentLimit={currentLimit}
              currentSort={currentSort}
              changeCurrentSort={changeCurrentSort}
              isSelectedAll={isSelectedAll}
              handleSelectAll={handleSelectAll}
              tableSettings={settings}
              checkIsSelected={checkIsSelected}
              handleSelect={handleSelect}
            />
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
}

export default memo(ListTradersSection)

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
      {accounts?.length && <MultipleBacktestButton />}
      {!accounts?.length &&
        (md ? (
          <TabletWrapper ref={ref}>
            <Flex
              className="layout__wrapper"
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                columnGap: 2,
                rowGap: 0,
                pr: [48, 48, 48, 0],
              }}
            >
              <MultipleBacktestButton />
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
                />
                {data && (
                  <>
                    <Box sx={{ width: 1, height: 40, bg: 'neutral4', flexShrink: 0 }} />
                    <Flex sx={{ gap: 20, alignItems: 'center', px: 2, py: 2, pr: !md ? 5 : 2 }}>
                      {/* <TradersVisualizer traders={data.data} hasButtonTitle={buttonsHasTitle ? true : lg ? true : false} /> */}
                      <CustomizeColumn hasTitle={size?.width && size.width > 900 ? true : false} />
                    </Flex>
                  </>
                )}
              </Flex>
            </Flex>
          </TabletWrapper>
        ) : (
          <Box display={['block', 'flex']}>
            <MultipleBacktestButton />
            <Flex
              sx={{
                px: 12,
                '& *': { fontSize: '13px' },
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
              <CustomizeColumn hasTitle={false} />
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

function MultipleBacktestButton() {
  const { currentHomeInstanceId, getCommonData, toggleFocusBacktest } = useSelectBacktestTraders()
  const { isAuthenticated, profile } = useAuthContext()
  const handleClickLogin = useClickLoginButton()

  const { homeInstance: currentHomeInstance } = getCommonData({ homeId: currentHomeInstanceId })
  const listAddress = currentHomeInstance?.tradersByIds ?? []

  const handleClickBacktestButton = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    toggleFocusBacktest()

    logEvent({
      label: getUserForTracking(profile?.username),
      category: EventCategory.BACK_TEST,
      action: EVENT_ACTIONS[EventCategory.BACK_TEST].OPEN_MULTIPLE,
    })
  }

  useEffect(() => {
    return () => toggleFocusBacktest(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box sx={{ height: 40, width: ['100%', 228], flexShrink: 0 }}>
      <PickTradersButton listAddress={listAddress} handleClick={handleClickBacktestButton} />
    </Box>
  )
}
