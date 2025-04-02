import { useResponsive } from 'ahooks'

import { PositionData } from 'entities/trader'
import { usePageChangeWithLimit } from 'hooks/helpers/usePageChange'
import { PaginationWithLimit } from 'theme/Pagination'
import { Box, Flex } from 'theme/base'
import { DEFAULT_LIMIT } from 'utils/config/constants'
import { pageToOffset } from 'utils/helpers/transform'

import { ListOpeningPositions, default as OpeningsTable } from './OpeningPositionList'

export default function PositionsSection({
  data,
  total,
  isLoading,
}: {
  total: number
  data: PositionData[] | undefined
  isLoading: boolean
}) {
  // const dataRef = useRef(data)
  const { currentPage, currentLimit, changeCurrentPage, changeCurrentLimit } = usePageChangeWithLimit({
    pageName: `page`,
    limitName: 'limit',
    defaultLimit: DEFAULT_LIMIT,
  })

  const offset = pageToOffset(currentPage, currentLimit)
  const pagedData = data?.slice(offset, offset + currentLimit)

  const { sm } = useResponsive()

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', bg: 'neutral5' }}>
      <Box sx={{ flex: '1 0 0', overflowX: 'auto', overflowY: 'hidden' }}>
        {sm ? (
          <OpeningsTable data={pagedData} isLoading={isLoading} scrollDep={currentPage} />
        ) : (
          <ListOpeningPositions data={pagedData} isLoading={isLoading} scrollDep={currentPage} />
        )}
      </Box>
      <Box p={1} sx={{ borderTop: 'small', borderColor: 'neutral4' }}>
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
          sx={{ width: '100%', justifyContent: 'space-between', gap: 2 }}
        />
      </Box>
    </Flex>
  )
}
