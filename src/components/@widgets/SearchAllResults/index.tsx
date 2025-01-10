import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { useHistory } from 'react-router-dom'

import { ApiListResponse } from 'apis/api'
import { AccountInfo } from 'components/@ui/AccountInfo'
import { RelativeTimeText } from 'components/@ui/DecoratedText/TimeText'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { TraderData } from 'entities/trader'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { TableSortProps } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { compactNumber, formatNumber } from 'utils/helpers/format'
import { generateTraderMultiExchangeRoute } from 'utils/helpers/generateRoute'

import { ExternalSource, searchResultsColumn } from './configs'

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
          borderTop: 'none',
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
      <Flex alignItems="center" sx={{ width: '100%', justifyContent: 'space-between', gap: 3 }}>
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
        <ProtocolLogo protocol={data.protocol} isActive={true} size={24} />
      </Flex>
      <Flex mt={2} sx={{ width: '100%', justifyContent: 'space-between' }}>
        <Box>
          <Type.Caption color="neutral3" display="block">
            <Trans>Last Trade</Trans>
          </Type.Caption>
          <RelativeTimeText date={data.lastTradeAt} />
        </Box>
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
          <Type.Caption>
            ${data.totalVolume < 10000000 ? formatNumber(data.totalVolume, 0, 0) : compactNumber(data.totalVolume, 1)}
          </Type.Caption>
        </Box>
      </Flex>
    </Box>
  )
}
