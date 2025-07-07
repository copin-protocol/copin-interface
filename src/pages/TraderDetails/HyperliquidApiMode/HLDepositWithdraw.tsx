import { ArrowSquareOut } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import React, { ReactNode, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getHlNonFundingLedger } from 'apis/hyperliquid'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import Divider from 'components/@ui/Divider'
import { HlNonFundingLedgerData } from 'entities/hyperliquid'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DAYJS_FULL_DATE_FORMAT, DEFAULT_LIMIT } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import { addressShorten, formatNumber } from 'utils/helpers/format'
import { getPaginationDataFromList } from 'utils/helpers/transform'
import { CHAINS, HYPERLIQUID_MAINNET } from 'utils/web3/chains'

export default function HLDepositWithdraw({ address }: { address?: string }) {
  const startTime = dayjs().utc().subtract(1, 'year').valueOf()
  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_HYPERLIQUID_TRADER_NON_FUNDING_LEDGER, address],
    () =>
      getHlNonFundingLedger({
        user: address ?? '',
        startTime,
      }),
    {
      enabled: !!address,
      retry: 0,
      keepPreviousData: true,
    }
  )
  const sortedData = useMemo(() => data?.sort((a, b) => b.time - a.time), [data])

  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT)
  const paginatedData = useMemo(
    () => getPaginationDataFromList({ currentPage, limit: currentLimit, data: sortedData }),
    [currentLimit, currentPage, sortedData]
  )

  const columns = useMemo(() => {
    const result: ColumnData<HlNonFundingLedgerData>[] = [
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        style: { minWidth: '150px' },
        render: (item: HlNonFundingLedgerData) => {
          return (
            <Type.Caption>
              <LocalTimeText date={item.time} format={DAYJS_FULL_DATE_FORMAT} />
            </Type.Caption>
          )
        },
      },
      {
        title: 'Type',
        key: undefined,
        style: { minWidth: '180px' },
        render: (item: HlNonFundingLedgerData) => {
          let bg = themeColors.neutral5
          let color = '#7AA6FF'
          switch (item.delta.type) {
            case 'deposit':
              bg = `${themeColors.green1}20`
              color = themeColors.green1
              break
            case 'withdraw':
              bg = `${themeColors.red2}20`
              color = themeColors.red2
              break
          }

          //TODO: Replace with component Label status
          return (
            <Flex sx={{ width: 'max-content', px: 2, py: 1, borderRadius: '4px', bg, color }}>
              <Type.Caption sx={{ textTransform: 'capitalize' }}>{item.delta.type}</Type.Caption>
            </Flex>
          )
        },
      },
      {
        title: 'Amount',
        key: undefined,
        style: { minWidth: '100px' },
        render: (item: HlNonFundingLedgerData) => {
          return <Type.Caption>{item.delta.usdc ? `$${formatNumber(Number(item.delta.usdc), 0)}` : 'N/A'}</Type.Caption>
        },
      },
      {
        title: 'Transaction',
        key: undefined,
        style: { minWidth: '150px', textAlign: 'right' },
        render: (item: HlNonFundingLedgerData) => {
          return (
            <Flex alignItems="center" justifyContent="flex-end">
              <ButtonWithIcon
                icon={<IconBox icon={<ArrowSquareOut size={16} />} color="neutral3" />}
                direction="right"
                as={'a'}
                href={`${CHAINS[HYPERLIQUID_MAINNET].blockExplorerUrl}/tx/${item.hash}`}
                target="_blank"
                type="button"
                variant="ghostPrimary"
                sx={{
                  px: 0,
                  py: 1,
                  color: 'neutral1',
                }}
              >
                <Type.Caption>{addressShorten(item.hash)}</Type.Caption>
              </ButtonWithIcon>
            </Flex>
          )
        },
      },
    ]
    return result
  }, [])

  const { xl } = useResponsive()

  return (
    <Flex flex={1} flexDirection="column" sx={{ position: 'relative', width: '100%' }}>
      {xl ? (
        <Table
          restrictHeight
          data={paginatedData.data}
          columns={columns}
          isLoading={isLoading}
          tableBodySx={{ color: 'neutral1' }}
          wrapperSx={{
            table: {
              '& th:first-child, td:first-child': {
                pl: 3,
              },
              '& th:last-child': {
                pr: 3,
              },
              '& td:last-child': {
                pr: 2,
              },
            },
          }}
        />
      ) : (
        <Flex mt="6px" flexDirection="column">
          {paginatedData?.data?.map((item) => {
            let color = '#7AA6FF'
            switch (item.delta.type) {
              case 'deposit':
                color = themeColors.green1
                break
              case 'withdraw':
                color = themeColors.red2
                break
            }

            return (
              <Box key={item.hash} px={2}>
                <Flex flexWrap="wrap" sx={{ gap: 1 }}>
                  <Property
                    label="Time"
                    value={
                      <Type.Caption>
                        <LocalTimeText date={item.time} format={DAYJS_FULL_DATE_FORMAT} />
                      </Type.Caption>
                    }
                  />
                  <Property
                    label="Transaction"
                    value={
                      <Flex alignItems="center" justifyContent="flex-start">
                        <ButtonWithIcon
                          icon={<IconBox icon={<ArrowSquareOut size={16} />} color="neutral3" />}
                          direction="right"
                          as={'a'}
                          href={`${CHAINS[HYPERLIQUID_MAINNET].blockExplorerUrl}/tx/${item.hash}`}
                          target="_blank"
                          type="button"
                          variant="ghostPrimary"
                          sx={{
                            px: 0,
                            py: 1,
                            color: 'neutral1',
                          }}
                        >
                          <Type.Caption>{addressShorten(item.hash)}</Type.Caption>
                        </ButtonWithIcon>
                      </Flex>
                    }
                  />
                </Flex>
                <Flex mt={1} flexWrap="wrap" sx={{ gap: 1 }}>
                  <Property
                    label="Type"
                    value={
                      <Type.Caption color={color} sx={{ textTransform: 'capitalize' }}>
                        {item.delta.type}
                      </Type.Caption>
                    }
                  />
                  <Property
                    label="Amount"
                    value={
                      <Type.Caption>
                        {item.delta.usdc ? `$${formatNumber(Number(item.delta.usdc), 0)}` : 'N/A'}
                      </Type.Caption>
                    }
                  />
                </Flex>
                <Divider color="neutral5" my="6px" />
              </Box>
            )
          })}
        </Flex>
      )}
      <PaginationWithLimit
        currentPage={currentPage}
        currentLimit={currentLimit}
        onPageChange={setCurrentPage}
        onLimitChange={setCurrentLimit}
        apiMeta={paginatedData.meta}
      />
    </Flex>
  )
}

function Property({ label, value, sx }: { label: ReactNode; value: ReactNode; sx?: any }) {
  return (
    <Box sx={sx} flex={1}>
      <Type.Caption color="neutral3" display="block">
        {label}
      </Type.Caption>
      {value}
    </Box>
  )
}
