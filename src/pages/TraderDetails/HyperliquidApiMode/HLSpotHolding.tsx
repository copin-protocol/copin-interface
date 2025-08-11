import { useResponsive } from 'ahooks'
import React, { ReactNode, useMemo, useState } from 'react'

import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import { HlAccountSpotData } from 'entities/hyperliquid'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { PaginationWithSelect } from 'theme/Pagination'
import { Box, Flex, Type } from 'theme/base'
import { formatNumber, formatPrice } from 'utils/helpers/format'
import { getPaginationDataFromList, getPairFromSymbol } from 'utils/helpers/transform'

export default function HLSpotHolding({ hlAccountSpotData }: { hlAccountSpotData?: HlAccountSpotData[] }) {
  const sortedData = useMemo(
    () => hlAccountSpotData?.sort((a, b) => b.currentValue - a.currentValue),
    [hlAccountSpotData]
  )

  const [currentPage, setCurrentPage] = useState(1)
  const paginatedData = useMemo(
    () => getPaginationDataFromList({ currentPage, limit: 10, data: sortedData }),
    [currentPage, sortedData]
  )

  const { xl } = useResponsive()

  return (
    <Flex flex={1} flexDirection="column" sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <Flex flex={1} mt="6px" flexDirection="column" overflow={xl ? 'auto' : 'hidden'}>
        {!paginatedData?.data?.length && <NoDataFound />}
        {paginatedData?.data?.map((item) => {
          const getHlSzDecimalsByPair = useSystemConfigStore.getState().marketConfigs.getHlSzDecimalsByPair
          const hlDecimals = getHlSzDecimalsByPair?.(getPairFromSymbol(item.coin))

          return (
            <Box key={item.coin} px={2}>
              <Flex flexWrap="wrap" sx={{ gap: 1 }}>
                <Property label="Asset" value={<Type.Caption>{item.coin}</Type.Caption>} />
                <Property label="Total Balance" value={<Type.Caption>{formatNumber(item.total, 0)}</Type.Caption>} />
                <Property
                  label="Price"
                  value={<Type.Caption>{formatPrice(item.price, 2, 2, { hlDecimals })}</Type.Caption>}
                />
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
