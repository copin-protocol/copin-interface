import { Trans } from '@lingui/macro'
import React from 'react'
import { useQuery } from 'react-query'

import { getLiteTransactionsApi } from 'apis/liteApis'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { Box, Flex } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { pageToOffset } from 'utils/helpers/transform'

import { TradesTab } from '../Trades/types'
import { LiteWalletTab } from '../Wallet'
import { transactionColumns } from './configs'

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

  return (
    <Flex flexDirection="column" height="100%">
      <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
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
