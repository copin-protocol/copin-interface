import { ArrowSquareOut } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import React, { ReactNode, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getHlNonFundingLedger } from 'apis/hyperliquid'
import { LocalTimeText } from 'components/@ui/DecoratedText/TimeText'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import { PaginationWithSelect } from 'theme/Pagination'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
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
  const paginatedData = useMemo(
    () => getPaginationDataFromList({ currentPage, limit: 10, data: sortedData }),
    [currentPage, sortedData]
  )

  const { xl } = useResponsive()

  return (
    <Flex flex={1} flexDirection="column" sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <Flex flex={1} mt="6px" flexDirection="column" overflow={xl ? 'auto' : 'hidden'}>
        {isLoading && <Loading />}
        {!isLoading && !paginatedData?.data?.length && <NoDataFound />}
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
              <Flex flexWrap="wrap" sx={{ gap: 1 }}>
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
      <Flex width="100%" alignItems="center" justifyContent="flex-end">
        <PaginationWithSelect currentPage={currentPage} onPageChange={setCurrentPage} apiMeta={paginatedData.meta} />
      </Flex>
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
