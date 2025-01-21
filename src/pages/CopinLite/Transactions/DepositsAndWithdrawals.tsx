import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import React, { ReactNode } from 'react'
import { useQuery } from 'react-query'

import { getLiteTransactionsApi } from 'apis/liteApis'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import { LiteTransactionData } from 'entities/lite'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useMyProfileStore from 'hooks/store/useMyProfile'
import Loading from 'theme/Loading'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { QUERY_KEYS, STORAGE_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import SwitchLayoutButtons from '../SwitchLayoutButtons'
import { TradesTab } from '../Trades/types'
import { LiteWalletTab } from '../Wallet'
import useMobileLayoutHandler from '../useMobileLayoutHandler'
import { renderProps, transactionColumns, transactionTitles } from './configs'

const LiteDepositsAndWithdrawals = ({ currentTab }: { currentTab: string }) => {
  const { myProfile } = useMyProfileStore()
  const { currentPage, changeCurrentPage, currentLimit, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: URL_PARAM_KEYS.LITE_TRANSATIONS_PAGE,
    limitName: URL_PARAM_KEYS.LITE_TRANSATIONS_LIMIT,
    defaultLimit: DEFAULT_LIMIT,
  })
  const { data, isFetching } = useQuery(
    [QUERY_KEYS.EMBEDDED_WALLET_TRANSACTIONS, currentPage, currentLimit, currentTab, myProfile?.id],
    () =>
      getLiteTransactionsApi({
        limit: currentLimit,
        offset: pageToOffset(currentPage, currentLimit),
      }),
    {
      keepPreviousData: true,
      retry: 0,
      enabled:
        !!myProfile?.id && (currentTab === TradesTab.DepositsAndWithdrawals || currentTab === LiteWalletTab.History),
    }
  )
  const { lg } = useResponsive()

  const { layoutType, handleChangeLayout } = useMobileLayoutHandler({
    storageKey: STORAGE_KEYS.LITE_DEPOSIT_HISTORY_LAYOUT,
    mobileBreakpoint: lg,
  })

  return (
    <Flex flexDirection="column" height="100%">
      {!lg && (
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'end',
            alignItems: 'center',
            borderBottom: 'small',
            borderBottomColor: 'neutral4',
            pr: 2,
          }}
        >
          <SwitchLayoutButtons layoutType={layoutType} onChangeType={handleChangeLayout} />
        </Flex>
      )}
      <Box flex="1 0 0" sx={{ overflow: 'hidden', pt: 2 }}>
        {layoutType === 'LIST' ? (
          <Table
            data={data?.data}
            restrictHeight
            columns={transactionColumns}
            isLoading={isFetching}
            tableBodyWrapperSx={{ table: { borderSpacing: '0 0' }, '& tbody tr': { bg: 'neutral7' } }}
            // tableHeadSx={{ th: { borderBottom: 'none' } }}
            noDataMessage={<Trans>No Transactions Found</Trans>}
            currentSort={undefined}
            changeCurrentSort={undefined}
          />
        ) : (
          <ListTransaction data={data?.data} isLoading={isFetching} />
        )}
      </Box>
      <PaginationWithLimit
        currentPage={currentPage}
        currentLimit={currentLimit}
        onPageChange={changeCurrentPage}
        onLimitChange={changeCurrentLimit}
        apiMeta={data?.meta}
        sx={{ py: 2 }}
      />
    </Flex>
  )
}

export default LiteDepositsAndWithdrawals

function ListTransaction({ data, isLoading }: { data: LiteTransactionData[] | undefined; isLoading: boolean }) {
  return (
    <Flex
      py={2}
      sx={{
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        height: '100%',
        overflow: 'hidden auto',
        position: 'relative',
      }}
    >
      {!isLoading && !data?.length && <NoDataFound />}
      {isLoading && (
        <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 1 }}>
          <Loading />
        </Box>
      )}
      {data?.map((_d) => {
        return (
          <Box
            key={_d.data.requestTxHash + _d.data.requestLogIndex}
            sx={{ bg: 'neutral6', px: 3, py: 2, position: 'relative' }}
          >
            <Flex sx={{ alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
              <Type.CaptionBold sx={{ '& *': { fontWeight: 'inherit' } }}>{renderProps.action?.(_d)}</Type.CaptionBold>
              {renderProps.status?.(_d)}
            </Flex>
            <Divider my={2} />
            <Flex sx={{ width: '100%', flexDirection: 'column', gap: 2 }}>
              <RowItem label={transactionTitles.accountValueChange} value={renderProps.accountValueChange?.(_d)} />
              <RowItem label={transactionTitles.fee} value={renderProps.fee?.(_d)} />
              <RowItem label={transactionTitles.time} value={renderProps.time?.(_d)} />
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}

function RowItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Flex sx={{ alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
      <Type.Caption color="neutral3" sx={{ flexShrink: 0 }}>
        {label}
      </Type.Caption>
      {value}
    </Flex>
  )
}
