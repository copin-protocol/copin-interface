import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'
import { ReactNode } from 'react'
import styled from 'styled-components/macro'

import SubscriptionIcon from 'components/@subscription/SubscriptionIcon'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { CopierRankingNumber } from 'components/@ui/LeaderboardRankingNumber'
import NoDataFound from 'components/@ui/NoDataFound'
import { CopierLeaderboardData } from 'entities/copier'
import useCopierLeaderboardContext, {
  CopierLeaderboardContextValues,
} from 'pages/Leaderboard/CopierLeaderboard/useCopierLeaderboardProvider'
import Loading from 'theme/Loading'
import { PaginationWithLimit, PaginationWithSelect } from 'theme/Pagination'
import Table from 'theme/Table'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT, IGNORE_SUBSCRIPTION_ICON } from 'utils/config/constants'
import { formatLocalDate, formatNumber } from 'utils/helpers/format'

import { leaderboardColumns } from './configs'
import { ExternalLeaderboardSource } from './types'

export default function CopierLeaderBoardTableView() {
  const { md } = useResponsive()
  const contextValues = useCopierLeaderboardContext()

  if (!!contextValues.data && !contextValues.data.meta.total) return <NoDataFound />

  return md ? (
    <TopLeaderboardDesktop contextValues={contextValues} />
  ) : (
    <TopLeaderboardMobile contextValues={contextValues} />
  )
}

function TopLeaderboardDesktop({ contextValues }: { contextValues: CopierLeaderboardContextValues }) {
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
    myRankingData,
  } = contextValues

  const externalSource: ExternalLeaderboardSource = {
    isCurrentLeaderboard: true,
  }

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
            columns={leaderboardColumns}
            isLoading={isLoading}
            currentSort={currentSort}
            changeCurrentSort={changeCurrentSort}
            tableHeadSx={{
              py: '6px',
              px: 3,
              borderBottom: 'small',
              borderColor: 'neutral4',
              '& th': { border: 'none' },
            }}
            tableBodySx={{
              px: 3,
              '& tbody td': { py: '2px', verticalAlign: 'middle' },
              '& tr': { display: 'inline-table', borderRadius: '4px', overflow: 'hidden', my: '4px' },
              '& td:last-child': { pr: 2 },
              '[data-ranking="1"], [data-ranking="2"], [data-ranking="3"]': {
                my: '6px',
                background: `linear-gradient(#0B0E18, #0B0E18) padding-box, linear-gradient(90deg, #ABECA2 -1.42%, #2FB3FE 30.38%, #6A8EEA 65.09%, #A185F4 99.55%) border-box !important`,
                border: 'small',
                borderColor: 'transparent',
                '& td': { py: 2 },
                '&:hover': {
                  background: `linear-gradient(#0B0E18, #0B0E18) padding-box, linear-gradient(90deg, #ABECA2 -1.42%, #2FB3FE 30.38%, #6A8EEA 65.09%, #A185F4 99.55%) border-box !important`,
                },
              },
            }}
            externalSource={externalSource}
            footerData={myRankingData}
            footerRowSx={{
              position: !data?.data?.length ? 'absolute' : undefined,
              bottom: !data?.data?.length ? 0 : undefined,
              borderTop: 'small',
              borderColor: 'transparent',
              borderRadius: '4px',
              background: `linear-gradient(180.26deg, #272C43 0.23%, rgba(11, 13, 23, 0) 85.39%) padding-box, linear-gradient(#0B0E18, #0B0E18) padding-box, linear-gradient(90deg, #ABECA2 -1.42%, #2FB3FE 30.38%, #6A8EEA 65.09%, #A185F4 99.55%) border-box !important`,
              '& tr': { my: 0 },
              '[data-ranking="1"], [data-ranking="2"], [data-ranking="3"]': {
                background: 'none !important',
              },
              '& tbody td': { py: 2, verticalAlign: 'middle', border: 'none !important' },
              '& tbody tr:hover': { background: 'transparent !important' },
            }}
            // topIndex={3}
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

function TopLeaderboardMobile({ contextValues }: { contextValues: CopierLeaderboardContextValues }) {
  const { data, isLoading, currentPage, changeCurrentPage, lastTimeUpdated, myRankingData } = contextValues
  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
      <Flex
        sx={{
          flex: '1 0 0',
          flexDirection: 'column',
          gap: 2,
          overflow: isLoading ? 'hidden' : 'hidden auto',
          position: 'relative',
        }}
      >
        {data?.data.map((copierData) => {
          return (
            <Box key={copierData.id} sx={{ bg: 'neutral6' }}>
              <LeaderboardMobileItem data={copierData} />
            </Box>
          )
        })}
        {isLoading && (
          <Flex
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              bg: 'modalBG',
              backdropFilter: 'blur(5px)',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <Loading />
          </Flex>
        )}
      </Flex>
      {myRankingData?.length && (
        <Box
          sx={{
            borderTop: 'small',
            borderTopColor: 'transparent',
            borderRadius: '4px',
            overflow: 'hidden',
            background:
              'linear-gradient(180.26deg, #272C43 0.23%, rgba(11, 13, 23, 0) 85.39%) padding-box, linear-gradient(#0B0E18, #0B0E18) padding-box, linear-gradient(90deg, #ABECA2 -1.42%, #2FB3FE 30.38%, #6A8EEA 65.09%, #A185F4 99.55%) border-box',
          }}
        >
          <LeaderboardMobileItem data={myRankingData[0]} />
        </Box>
      )}
      <Flex sx={{ alignItems: 'center', borderTop: 'small', borderTopColor: 'neutral4' }}>
        <Type.Caption color="neutral3" sx={{ flexShrink: 0, px: 12, flex: 1 }}>
          <Trans>Last Updated:</Trans> <Box as="span">{formatLocalDate(lastTimeUpdated, DAYJS_FULL_DATE_FORMAT)}</Box>
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

function LeaderboardMobileItem({ data }: { data: CopierLeaderboardData }) {
  return (
    <Box key={data.id} sx={{ position: 'relative', px: 3, py: 2, zIndex: 1 }}>
      {data.ranking < 4 ? <StyledBorder /> : <NormalBorder />}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box pb={2}>
          <Flex sx={{ gap: 2 }}>
            <Flex pb={2} color="neutral1" flex="1" sx={{ alignItems: 'center', gap: 2 }}>
              <Type.CaptionBold>
                {data.displayName}
                {data.isMe ? (
                  <Box as="span" color="primary1">
                    {' '}
                    (Me)
                  </Box>
                ) : (
                  ''
                )}
              </Type.CaptionBold>
              {!!data.plan && !IGNORE_SUBSCRIPTION_ICON.includes(data.plan) && <SubscriptionIcon plan={data.plan} />}
            </Flex>
            <Box sx={{ mr: '-12px' }}>
              <CopierRankingNumber ranking={data.ranking} />
            </Box>
          </Flex>
          <RowWrapper>
            <RowItem label={<Trans>Win Rate</Trans>} value={formatNumber(data.winRate, 2, 2)} />
            <RowItem
              label={<Trans>Win/Lose</Trans>}
              value={`${formatNumber(data.totalWin, 0, 0)}/${formatNumber(data.totalLose, 0, 0)}`}
            />
            {/* </RowWrapper> */}
            {/* <RowWrapper> */}
            <RowItem label={<Trans>Total Volume</Trans>} value={`$${formatNumber(data.volume, 2, 2)}`} />
            <RowItem
              label={<Trans>ePNL</Trans>}
              value={<SignedText prefix="$" value={data.estPnl} maxDigit={2} minDigit={2} fontInherit />}
            />
          </RowWrapper>
        </Box>
      </Box>
    </Box>
  )
}

const RowWrapper = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr 1.6fr 1.3fr;
  gap: 8px;
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
  // border: 1px solid ${({ theme }) => theme.colors.neutral4};
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
