import { useResponsive, useSize } from 'ahooks'
import { memo, useEffect, useMemo, useRef } from 'react'
import styled from 'styled-components/macro'

import { ApiListResponse } from 'apis/api'
import { WarningType } from 'components/BacktestModal/WarningModal'
import PickTradersButton from 'components/BacktestPickTradersButton'
import { useClickLoginButton } from 'components/LoginAction'
import TraderListTable from 'components/Tables/TraderListTable'
import CustomizeColumn from 'components/Tables/TraderListTable/CustomizeColumn'
import { mobileTableSettings, tableSettings } from 'components/Tables/TraderListTable/dataConfig'
import { TraderData } from 'entities/trader.d'
import useBacktestWarningModal from 'hooks/store/useBacktestWarningModal'
import { useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'
// import useBacktestRequest from 'hooks/helpers/useBacktestRequest'
import { useAuthContext } from 'hooks/web3/useAuth'
import { PaginationWithLimit, PaginationWithSelect } from 'theme/Pagination'
import ProgressBar from 'theme/ProgressBar'
import { Box, Flex, Type } from 'theme/base'
import { MEDIA_WIDTHS } from 'theme/theme'
import { CheckAvailableStatus } from 'utils/config/enums'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import { TradersContextData } from './useTradersContext'

function ListTradersSection({
  buttonsHasTitle = false,
  contextValues,
  notes,
}: {
  buttonsHasTitle?: boolean
  contextValues: TradersContextData
  notes?: { [key: string]: string }
}) {
  const { sm } = useResponsive()
  const settings = sm ? tableSettings : mobileTableSettings
  const {
    accounts,
    isRangeSelection,
    data,
    isLoading,
    loadingRangeProgress,
    currentSort,
    changeCurrentSort,
    currentPage,
    changeCurrentPage,
    currentLimit,
    changeCurrentLimit,
  } = contextValues

  const {
    getCommonData,
    currentHomeInstanceId,
    addTraderToHomeInstance,
    removeTraderFromHomeInstance,
    updateHomeInstance,
  } = useSelectBacktestTraders()
  const { openModal, dismissModal } = useBacktestWarningModal()
  const listTraderData = data?.data ?? []
  const listAddress = listTraderData.map((trader) => trader.account)
  const { homeInstance: currentHomeInstance } = getCommonData({ homeId: currentHomeInstanceId })
  const listAddressSelected = currentHomeInstance?.tradersByIds ?? []
  const isSelectedAll = useMemo(
    () => {
      if (!currentHomeInstance || !listAddress.length || isLoading) return false
      return listAddress.every((address) => listAddressSelected.includes(address))
    },
    // () => !!data && getAddresses(data).every((item) => getAddresses(listTrader).includes(item)),
    [currentHomeInstance, listAddress, listAddressSelected]
  )
  const handleSelectAll = (isSelectedAll: boolean) => {
    if (!listTraderData.length) return
    if (!isSelectedAll) {
      addTraderToHomeInstance(listTraderData)
    } else {
      if (
        listAddressSelected.length === listAddress.length &&
        listAddressSelected.every((address) => listAddress.includes(address)) &&
        !!currentHomeInstance?.isTested
      ) {
        openModal({
          type: WarningType.CLEAR_GROUP,
          confirmFunction: () => {
            removeTraderFromHomeInstance(listTraderData)
            dismissModal()
          },
        })
        return
      }
      removeTraderFromHomeInstance(listTraderData)
    }
  }

  const checkIsSelected = (data: TraderData) => {
    const isSelected = !!currentHomeInstance?.tradersByIds?.includes(data.account)
    return isSelected
  }
  const handleSelect = ({ isSelected, data }: { isSelected: boolean; data: TraderData }) => {
    if (isSelected) {
      if (currentHomeInstance?.isTested && !currentHomeInstance?.isShowedWarningDeleteTrader) {
        openModal({
          type: WarningType.REMOVE_TRADER,
          confirmFunction: () => {
            updateHomeInstance({ homeId: currentHomeInstance.id ?? '', data: { isShowedWarningDeleteTrader: true } })
            removeTraderFromHomeInstance(data)
            dismissModal()
          },
        })
        return
      }
      if (currentHomeInstance?.tradersByIds.length === 1 && currentHomeInstance?.isTested) {
        openModal({
          type: WarningType.REMOVE_LAST_TRADER,
          confirmFunction: () => {
            removeTraderFromHomeInstance(data)
            dismissModal()
          },
        })
        return
      }
      removeTraderFromHomeInstance(data)
      return
    }
    addTraderToHomeInstance(data)
  }
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <>
        {isRangeSelection && isLoading && loadingRangeProgress?.status !== CheckAvailableStatus.FINISH ? (
          <Flex sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', p: 3 }}>
            <Box mt={4} mb={3} variant="card" sx={{ mx: 'auto', maxWidth: 600, width: '100%' }}>
              <Type.Body textAlign="center" display="block" mb={24}>
                Data is being processed. Please wait a minute
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
      {isRangeSelection && isLoading && loadingRangeProgress?.status !== CheckAvailableStatus.FINISH ? null : (
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
  const { md, xl } = useResponsive()
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
                px: 3,
                '& *': { fontSize: '13px' },
                alignItems: 'center',
                gap: 2,
                borderTop: ['small', 'none'],
                borderTopColor: ['neutral4', 'none'],
              }}
            >
              <PaginationWithSelect currentPage={currentPage} onPageChange={changeCurrentPage} apiMeta={data?.meta} />
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
