import { useEffect, useRef } from 'react'

import { default as OpeningsTable } from 'components/TopOpeningPositions/TopOpeningsWindow'
import { PositionData } from 'entities/trader'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import { PaginationWithLimit } from 'theme/Pagination'
import { Box, Flex } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { pageToOffset } from 'utils/helpers/transform'

export default function ListSection({ data, total }: { total: number; data: PositionData[] | undefined }) {
  const totalRef = useRef(total)
  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: `page`,
    limitName: 'limit',
    defaultLimit: DEFAULT_LIMIT,
  })

  const offset = pageToOffset(currentPage, currentLimit)
  const pagedData = data?.slice(offset, offset + currentLimit)

  useEffect(() => {
    if (totalRef.current !== total) {
      totalRef.current = total
      changeCurrentPage(1)
    }
  }, [total])

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', bg: 'neutral5', pt: 2 }}>
      <Box sx={{ flex: '1', overflowX: 'auto', overflowY: 'hidden' }}>
        <OpeningsTable data={pagedData} isLoading={false} />
      </Box>
      <Box px={2} sx={{ borderTop: 'small', borderColor: 'neutral4' }}>
        <PaginationWithLimit
          currentPage={currentPage}
          currentLimit={currentLimit}
          onPageChange={changeCurrentPage}
          onLimitChange={changeCurrentLimit}
          apiMeta={{
            total,
            totalPages: Math.ceil(total / currentLimit),
            limit: currentLimit,
            offset,
          }}
          menuPosition="top"
          sx={{ my: 1, width: '100%', justifyContent: 'space-between', gap: 2 }}
        />
      </Box>
    </Flex>
  )
}
