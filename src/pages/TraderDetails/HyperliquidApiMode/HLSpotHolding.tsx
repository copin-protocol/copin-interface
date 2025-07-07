import { useResponsive } from 'ahooks'
import React, { ReactNode, useMemo, useState } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import Divider from 'components/@ui/Divider'
import { HlAccountSpotData } from 'entities/hyperliquid'
import { PaginationWithLimit } from 'theme/Pagination'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { formatNumber, formatPrice } from 'utils/helpers/format'
import { getPaginationDataFromList } from 'utils/helpers/transform'

export default function HLSpotHolding({ hlAccountSpotData }: { hlAccountSpotData?: HlAccountSpotData[] }) {
  const sortedData = useMemo(
    () => hlAccountSpotData?.sort((a, b) => b.currentValue - a.currentValue),
    [hlAccountSpotData]
  )

  const [currentPage, setCurrentPage] = useState(1)
  const [currentLimit, setCurrentLimit] = useState(DEFAULT_LIMIT)
  const paginatedData = useMemo(
    () => getPaginationDataFromList({ currentPage, limit: currentLimit, data: sortedData }),
    [currentLimit, currentPage, sortedData]
  )

  const columns = useMemo(() => {
    const result: ColumnData<HlAccountSpotData>[] = [
      {
        title: 'Asset',
        dataIndex: 'coin',
        key: 'coin',
        style: { minWidth: '80px' },
        render: (item: HlAccountSpotData) => {
          return <Type.Caption>{item.coin}</Type.Caption>
        },
      },
      {
        title: 'Total Balance',
        dataIndex: 'total',
        key: 'total',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item: HlAccountSpotData) => {
          return <Type.Caption>{formatNumber(item.total, 0)}</Type.Caption>
        },
      },
      {
        title: 'Entry Value',
        dataIndex: 'entryValue',
        key: 'entryValue',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item: HlAccountSpotData) => {
          return <Type.Caption>${formatNumber(item.entryValue, 0)}</Type.Caption>
        },
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        style: { minWidth: '70px', textAlign: 'right' },
        render: (item: HlAccountSpotData) => {
          return <Type.Caption>{formatPrice(item.price)}</Type.Caption>
        },
      },
      {
        title: 'Current Value',
        dataIndex: 'currentValue',
        key: 'currentValue',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item: HlAccountSpotData) => {
          return <Type.Caption>${formatNumber(item.currentValue, 0)}</Type.Caption>
        },
      },
      {
        title: 'Unrealized PnL',
        dataIndex: 'unrealizedPnl',
        key: 'unrealizedPnl',
        style: { minWidth: '100px', textAlign: 'right' },
        render: (item: HlAccountSpotData) => {
          return (
            <Type.Caption>
              <SignedText value={item.unrealizedPnl} minDigit={0} maxDigit={0} fontInherit prefix="$" />
            </Type.Caption>
          )
        },
      },
      {
        title: 'ROE',
        dataIndex: 'roe',
        key: 'roe',
        style: { minWidth: '90px', textAlign: 'right' },
        render: (item: HlAccountSpotData) => {
          return (
            <Type.Caption>
              {!!item.roe ? <SignedText value={item.roe} minDigit={2} maxDigit={2} fontInherit suffix="%" /> : '--'}
            </Type.Caption>
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
          isLoading={false}
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
            return (
              <Box key={item.coin} px={2}>
                <Flex flexWrap="wrap" sx={{ gap: 1 }}>
                  <Property label="Asset" value={<Type.Caption>{item.coin}</Type.Caption>} />
                  <Property label="Total Balance" value={<Type.Caption>{formatNumber(item.total, 0)}</Type.Caption>} />
                  <Property label="Price" value={<Type.Caption>{formatPrice(item.price)}</Type.Caption>} />
                </Flex>
                <Flex mt={1} flexWrap="wrap" sx={{ gap: 1 }}>
                  <Property
                    label="Entry Value"
                    value={<Type.Caption>${formatNumber(item.entryValue, 0)}</Type.Caption>}
                  />
                  <Property
                    label="Current Value"
                    value={<Type.Caption>${formatNumber(item.currentValue, 0)}</Type.Caption>}
                  />
                  <Property
                    label="Unrealized PnL"
                    value={
                      <Type.Caption>
                        {!!item.unrealizedPnl ? (
                          <SignedText value={item.unrealizedPnl} minDigit={0} maxDigit={0} fontInherit prefix="$" />
                        ) : (
                          '--'
                        )}
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
