import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useHistory } from 'react-router-dom'

import { ApiListResponse } from 'apis/api'
import { AccountInfo } from 'components/@ui/AccountInfo'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import Table from 'components/@ui/Table'
import { TableSortProps } from 'components/@ui/Table/types'
import { TraderData } from 'entities/trader'
import { PaginationWithLimit } from 'theme/Pagination'
import { Box, Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

import { ExternalSource, searchResultsColumn } from './ColumnsData'

type ResultsProps = {
  keyword: string
  searchTraders?: ApiListResponse<TraderData>
  isLoading: boolean
  currentLimit: number
  currentPage: number
  currentSort?: TableSortProps<TraderData>
  changeCurrentLimit: (limit: number) => void
  changeCurrentPage: (page: number) => void
  changeCurrentSort: (data?: TableSortProps<TraderData>) => void
}

const SearchAllResults = ({
  keyword,
  searchTraders,
  isLoading,
  currentLimit,
  currentPage,
  currentSort,
  changeCurrentLimit,
  changeCurrentPage,
  changeCurrentSort,
}: ResultsProps) => {
  const { sm } = useResponsive()

  const history = useHistory()

  const handleSelectItem = (data: TraderData) => {
    history.push(generateTraderMultiExchangeRoute({ protocol: data.protocol, address: data.account }))
  }

  const externalSource: ExternalSource = {
    keyword,
  }

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Box
        sx={{
          flex: '1 0 0',
          overflowX: 'auto',
          ...(sm
            ? {}
            : {
                '& *': {
                  fontSize: '13px !important',
                  lineHeight: '18px !important',
                },
              }),
          border: 'small',
          borderColor: 'neutral4',
          borderLeft: ['none', 'none', 'none', 'small'],
          borderRight: ['none', 'none', 'none', 'small'],
          borderLeftColor: ['none', 'none', 'none', 'neutral4'],
          borderRightColor: ['none', 'none', 'none', 'neutral4'],
        }}
      >
        {sm ? (
          <Table
            restrictHeight
            data={searchTraders?.data}
            columns={searchResultsColumn}
            isLoading={isLoading}
            onClickRow={handleSelectItem}
            changeCurrentSort={changeCurrentSort}
            currentSort={currentSort}
            externalSource={externalSource}
            tableBodyWrapperSx={{
              table: { borderSpacing: '0' },
              tbody: {
                '& td:first-child': {
                  pl: 3,
                },
              },
            }}
            tableHeadSx={{
              th: {
                pt: 2,
              },
              '& th:first-child': {
                pl: 3,
              },
            }}
          />
        ) : (
          <Box
            sx={{
              '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4' },
              '& > *:last-child': { borderBottom: 'none' },
            }}
          >
            {searchTraders?.data.map((data) => {
              return <ResultItemMobile key={data.id} keyword={keyword} data={data} />
            })}
          </Box>
        )}
      </Box>
      <Box px={2} sx={{ borderLeft: 'small', borderRight: 'small', borderColor: 'neutral4' }}>
        <PaginationWithLimit
          currentPage={currentPage}
          currentLimit={currentLimit}
          onPageChange={changeCurrentPage}
          onLimitChange={changeCurrentLimit}
          apiMeta={searchTraders?.meta}
          menuPosition="top"
          sx={{ my: 1, width: '100%', justifyContent: 'space-between', gap: 2 }}
        />
      </Box>
    </Flex>
  )
}

export default SearchAllResults

function ResultItemMobile({ data, keyword }: { data: TraderData; keyword: string }) {
  return (
    <Box sx={{ color: 'neutral1', position: 'relative', px: 3, py: '6px' }}>
      <AccountInfo
        isOpenPosition={data.isOpenPosition}
        keyword={keyword}
        address={data.account}
        smartAccount={data.smartAccount}
        protocol={data.protocol}
        size={40}
        sx={{
          width: 168,
        }}
      />
      <Flex sx={{ position: 'absolute', right: 16, top: 12, gap: 1 }}>
        <Type.Caption color="neutral3">
          <Trans>Last Trade:</Trans>
        </Type.Caption>
        <RelativeTimeText date={data.lastTradeAt} />
      </Flex>
      <Flex mt={3} sx={{ width: '100%', justifyContent: 'space-between' }}>
        <Box>
          <Type.Caption color="neutral3" display="block">
            <Trans>Win Rate</Trans>
          </Type.Caption>
          <Type.Caption>{data.winRate ? `${formatNumber(data.winRate, 0, 0)}%` : '--'}</Type.Caption>
        </Box>
        <Box>
          <Type.Caption color="neutral3" display="block">
            <Trans>Total Trades</Trans>
          </Type.Caption>
          <Type.Caption>{formatNumber(data.totalTrade, 0, 0)}</Type.Caption>
        </Box>
        <Box>
          <Type.Caption color="neutral3" display="block">
            <Trans>Total Volume</Trans>
          </Type.Caption>
          <Type.Caption>{formatNumber(data.totalVolume, 0, 0)}</Type.Caption>
        </Box>
      </Flex>
    </Box>
  )
}
