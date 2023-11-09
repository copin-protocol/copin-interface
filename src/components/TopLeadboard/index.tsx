import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'
import styled from 'styled-components/macro'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import NoDataFound from 'components/@ui/NoDataFound'
import Table from 'components/@ui/Table'
import useLeaderboardProvider, { LeaderboardContextValues } from 'hooks/features/useLeaderboardProvider'
import Accordion from 'theme/Accordion'
import Loading from 'theme/Loading'
import { PaginationWithLimit, PaginationWithSelect } from 'theme/Pagination'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { formatLocalDate, formatNumber } from 'utils/helpers/format'

import { AccountInfo, LeaderboardColumns, RankingInfo } from './ColumnsData'

const TopLeaderboard = () => {
  const { sm } = useResponsive()
  const contextValues = useLeaderboardProvider()

  if (contextValues.isLoading)
    return (
      <Box textAlign="center" p={3} width="100%">
        <Loading />
      </Box>
    )

  if (!!contextValues.data && !contextValues.data.meta.total) return <NoDataFound />

  return sm ? (
    <TopLeaderboardDesktop contextValues={contextValues} />
  ) : (
    <TopLeaderboardMobile contextValues={contextValues} />
  )
}

export default TopLeaderboard

function TopLeaderboardDesktop({ contextValues }: { contextValues: LeaderboardContextValues }) {
  const {
    data,
    isLoading,
    currentPage,
    currentLimit,
    currentSort,
    changeCurrentPage,
    changeCurrentLimit,
    changeCurrentSort,
    lastTimeUpdated,
  } = contextValues
  return (
    <>
      <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
        <Box
          sx={{
            flex: '1 0 0',
            overflowX: 'auto',
          }}
        >
          <Table
            restrictHeight
            data={data?.data}
            columns={LeaderboardColumns}
            isLoading={isLoading}
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
            tableBodyWrapperSx={{
              table: { borderSpacing: '0' },
              tbody: {
                '& tr': {
                  px: 3,
                },
                '& td:first-child': {
                  pl: 0,
                },
                '& th:last-child': {
                  pr: 3,
                },
              },
            }}
            tableHeadSx={{
              th: {
                pt: 2,
                pb: 12,
              },
              '& th:first-child': {
                pl: 4,
                minWidth: ['90px !important', '90px !important', '85px !important', '85px !important'],
              },
              '& th:last-child': {
                pr: 4,
                minWidth: ['152px !important', '152px !important', '182px !important', '182px !important'],
              },
            }}
            topIndex={3}
          />
        </Box>
        <Flex
          py={1}
          alignItems="center"
          px={3}
          flexWrap="wrap"
          justifyContent="space-between"
          sx={{ gap: 2, borderTop: 'small', borderColor: 'neutral4' }}
        >
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Type.Caption color="neutral2">Last Updated:</Type.Caption>
            <Type.Caption>{formatLocalDate(lastTimeUpdated, DAYJS_FULL_DATE_FORMAT)}</Type.Caption>
          </Flex>
          <PaginationWithLimit
            currentPage={currentPage}
            currentLimit={currentLimit}
            onPageChange={changeCurrentPage}
            onLimitChange={changeCurrentLimit}
            apiMeta={data?.meta}
            menuPosition="top"
            sx={{ justifyContent: 'flex-end', gap: 2, px: 0 }}
          />
        </Flex>
      </Flex>
    </>
  )
}

function TopLeaderboardMobile({ contextValues }: { contextValues: LeaderboardContextValues }) {
  const { data, currentPage, changeCurrentPage, lastTimeUpdated } = contextValues
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column' }}>
      <Flex sx={{ flex: '1 0 0', flexDirection: 'column', gap: 2, overflow: 'hidden auto' }}>
        {data?.data.map((traderData) => {
          return (
            <Box key={traderData.id} sx={{ position: 'relative', px: 3, py: 2 }}>
              {traderData.ranking < 4 ? <StyledBorder /> : <NormalBorder />}
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Accordion
                  type="vertical"
                  header={
                    <Box pb={2}>
                      <Flex sx={{ gap: 2 }}>
                        <Box pb={2} color="neutral1" flex="1">
                          <AccountInfo info={traderData} size={32} />
                        </Box>
                        <RankingInfo ranking={traderData.ranking} />
                      </Flex>
                      <RowWrapper>
                        <RowItem label={<Trans>Total Trades</Trans>} value={formatNumber(traderData.totalTrade)} />
                        <RowItem label={<Trans>Total Wins</Trans>} value={formatNumber(traderData.totalWin)} />
                        <RowItem
                          label={<Trans>PNL</Trans>}
                          value={<SignedText prefix="$" value={traderData.totalPnl} maxDigit={0} fontInherit />}
                        />
                      </RowWrapper>
                    </Box>
                  }
                  body={
                    <RowWrapper pb={2}>
                      <RowItem
                        label={<Trans>Total Liquidations</Trans>}
                        value={formatNumber(traderData.totalLiquidation)}
                      />
                      <RowItem label={<Trans>Total Loses</Trans>} value={formatNumber(traderData.totalLose)} />
                      <RowItem label={<Trans>Total Volume</Trans>} value={`$${formatNumber(traderData.totalVolume)}`} />
                      <RowItem label={<Trans>Total Paid Fees</Trans>} value={`$${formatNumber(traderData.totalFee)}`} />
                    </RowWrapper>
                  }
                />
              </Box>
            </Box>
          )
        })}
      </Flex>
      <Flex sx={{ alignItems: 'center', borderTop: 'small', borderTopColor: 'neutral4' }}>
        <Type.Caption color="neutral2" sx={{ flexShrink: 0, px: 12, flex: 1 }}>
          <Trans>Last Updated:</Trans>{' '}
          <Box as="span" color="neutral1">
            {formatLocalDate(lastTimeUpdated, DAYJS_FULL_DATE_FORMAT)}
          </Box>
        </Type.Caption>
        <PaginationWithSelect
          currentPage={currentPage}
          onPageChange={changeCurrentPage}
          apiMeta={data?.meta}
          disabledInput
          sx={{ borderLeft: 'small', borderLeftColor: 'neutral4', py: 1, px: 12 }}
        />
      </Flex>
    </Flex>
  )
}
const RowWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1.3fr;
  gap: 12px;
`
function RowItem({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <Box>
      <Type.Caption mb={1} color="neutral3" display="block">
        {label}
      </Type.Caption>
      <Type.Caption color="neutral1">{value}</Type.Caption>
    </Box>
  )
}
const NormalBorder = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid ${({ theme }) => theme.colors.neutral4};
  z-index: 0;
`
const StyledBorder = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  clip-path: polygon(
    0 0,
    100% 0,
    100% 100%,
    0 100%,
    0 0.001px,
    1px 0.001px,
    1px calc(100% - 1px),
    calc(100% - 1px) calc(100% - 1px),
    calc(100% - 1px) 1px,
    0 1px
  );
  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 200%;
    height: 200%;
    transform: translateX(-50%) translateY(-50%);
    top: 0;
    left: 0;
    background: radial-gradient(
      circle,
      rgba(171, 236, 162, 1) 0%,
      rgba(47, 179, 254, 0.5) 30%,
      rgba(106, 142, 234, 0.3) 65%,
      rgba(161, 133, 244, 0.15) 99%
    );
    animation: ani 3s linear infinite;
  }
  @keyframes ani {
    0% {
      top: 0;
      left: 0;
    }
    30% {
      top: 0;
      left: 100%;
    }
    50% {
      top: 100%;
      left: 100%;
    }
    70% {
      top: 100%;
      left: 0;
    }
    100% {
      top: 0;
      left: 0;
    }
  }
`
