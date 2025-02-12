import { Trans } from '@lingui/macro'
import { Lightbulb, Plus } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useCallback, useMemo } from 'react'

import { normalizeTraderData } from 'apis/normalize'
import { RequestBodyApiData } from 'apis/types'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import SectionTitle from 'components/@ui/SectionTitle'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import { TraderAlertData } from 'entities/alert'
import useBotAlertContext from 'hooks/features/useBotAlertProvider'
import useSettingWatchlistTraders from 'hooks/features/useSettingWatchlistTraders'
import useTraderLastViewed from 'hooks/store/useTraderLastViewed'
import { useAuthContext } from 'hooks/web3/useAuth'
import useTimeFilterData from 'pages/Explorer/ListTradersSection/useTimeFilterData'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex } from 'theme/base'
import { MAX_LIMIT } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'

import {
  MobileRowItem,
  Trader24hTrades,
  Trader30dTrades,
  TraderAddress,
  TraderLastTradeAt,
  TraderStatus,
} from '../AlertSettingDetails/config'
import NoAlertList from './NoAlertList'

export default function TraderLastViewed() {
  const { lg } = useResponsive()
  const isMobile = !lg
  const { traderLastViewed = [] } = useTraderLastViewed()
  const { botAlert, handleGenerateLinkBot, loadingAlerts, isGeneratingLink } = useBotAlertContext()

  const { isAuthenticated } = useAuthContext()
  const handleClickLogin = useClickLoginButton()

  const accounts = traderLastViewed?.map((data) => data.address)
  const protocols = traderLastViewed?.map((data) => data.protocol)
  const requestData = useMemo<RequestBodyApiData>(() => {
    const request: Record<string, any> = {
      ranges: [
        {
          fieldName: 'account',
          in: accounts,
        },
      ],
      pagination: {
        limit: MAX_LIMIT,
        offset: 0,
      },
      sorts: [
        {
          field: 'realisedPnl',
          direction: 'desc',
        },
      ],
    }
    return request
  }, [accounts])
  const { traders } = useTimeFilterData({
    requestData,
    timeOption: TIME_FILTER_OPTIONS[2],
    selectedProtocols: protocols,
  })
  const traderLastViewedWithStats = useMemo(() => {
    const formattedTraders = traders?.data.map((trader) => normalizeTraderData(trader))
    return traderLastViewed.map((data) => {
      const stats = formattedTraders?.find((e) => e.account === data.address && e.protocol === data.protocol)
      return {
        ...data,
        id: stats?.id ?? '',
        trade30D: stats?.totalTrade,
        pnl30D: stats?.pnl,
        lastTradeAt: stats?.lastTradeAt,
      } as TraderAlertData
    })
  }, [traderLastViewed, traders?.data])

  const { createTraderAlert, submittingCreate } = useSettingWatchlistTraders({})

  const onSubmit = (protocol: ProtocolEnum, address: string) => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (!botAlert?.chatId) {
      handleGenerateLinkBot?.()
      return
    }
    createTraderAlert({ address, protocol })
  }

  const TraderActions = useCallback(
    ({ data }: { data: TraderAlertData }) => {
      return (
        <ButtonWithIcon
          type="button"
          variant="ghostPrimary"
          icon={<Plus />}
          sx={{ p: 0 }}
          disabled={loadingAlerts || submittingCreate || isGeneratingLink}
          onClick={() => onSubmit(data.protocol, data.address)}
        >
          <Trans>ADD</Trans>
        </ButtonWithIcon>
      )
    },
    [isGeneratingLink, loadingAlerts, submittingCreate]
  )

  const columns = useMemo(() => {
    const result: ColumnData<TraderAlertData>[] = [
      {
        title: 'TRADERS',
        dataIndex: 'address',
        key: 'address',
        style: { minWidth: '150px' },
        render: (item) => <TraderAddress data={item} />,
      },
      {
        title: 'LAST TRADE',
        dataIndex: 'lastTradeAt',
        key: 'lastTradeAt',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => <TraderLastTradeAt data={item} />,
      },
      {
        title: '30D TRADES',
        dataIndex: 'trade30D',
        key: 'trade30D',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => <Trader30dTrades data={item} />,
      },
      {
        title: 'ACTION',
        dataIndex: 'id',
        key: 'id',
        style: { minWidth: '80px', textAlign: 'right' },
        render: (item) => (
          <Flex alignItems="center" justifyContent="flex-end">
            <TraderActions data={item} />
          </Flex>
        ),
      },
    ]
    return result
  }, [isGeneratingLink, loadingAlerts, submittingCreate])

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
      <Box flex={1}>
        <NoAlertList />
      </Box>
      {traderLastViewed && traderLastViewed.length > 0 && (
        <Box
          sx={{
            overflow: 'auto',
            bg: 'neutral6',
            borderTop: 'small',
            borderTopColor: 'neutral4',
            pt: 2,
          }}
        >
          <SectionTitle icon={Lightbulb} title={<Trans>RECOMMEND TRADERS</Trans>} sx={{ px: 3, mb: 2 }} />
          <Flex
            flex="1"
            flexDirection="column"
            sx={{
              overflow: 'auto',
            }}
          >
            {isMobile ? (
              <Flex px={3} flexDirection="column" sx={{ gap: 2 }}>
                {traderLastViewedWithStats?.map((data, index) => {
                  return (
                    <Flex
                      key={data.id}
                      flexDirection="column"
                      width="100%"
                      sx={{ py: 2, gap: 2, borderTop: index > 0 ? 'small' : 'none', borderColor: 'neutral4' }}
                    >
                      <Flex alignItems="center" justifyContent="space-between">
                        <TraderAddress data={data} />
                        <Flex alignItems="center" sx={{ gap: 3 }}>
                          <TraderStatus data={data} />
                          <TraderActions data={data} />
                        </Flex>
                      </Flex>
                      <MobileRowItem label={'Last Trade'} value={<TraderLastTradeAt data={data} />} />
                      <MobileRowItem label={'24H Trades'} value={<Trader24hTrades data={data} />} />
                    </Flex>
                  )
                })}
              </Flex>
            ) : (
              <Table
                data={traderLastViewedWithStats}
                columns={columns}
                isLoading={false}
                tableHeadSx={{
                  '& th': {
                    py: 2,
                    borderTop: 'small',
                    borderBottom: 'small',
                    borderColor: 'neutral4',
                  },
                }}
                wrapperSx={{
                  table: {
                    '& th:first-child, td:first-child': {
                      pl: 3,
                    },
                    '& th:last-child, td:last-child': {
                      pr: 3,
                    },
                  },
                }}
              />
            )}
          </Flex>
        </Box>
      )}
    </Flex>
  )
}
