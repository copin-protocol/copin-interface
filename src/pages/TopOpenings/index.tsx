import { useResponsive } from 'ahooks'
import { useState } from 'react'
import { useQuery } from 'react-query'

import { getTopOpeningPositionsApi } from 'apis/positionApis'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import { useProtocolStore } from 'hooks/store/useProtocols'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'

import ListSection from './ListSection'
import VisualizeSection from './VisualizeSection'

const LIMITS = [100, 200, 500]

const SORTS = [
  {
    text: 'Newest',
    key: 'createdAt',
  },
  {
    text: 'PnL',
    key: 'pnl',
  },
  {
    text: 'Size',
    key: 'size',
  },
]

const TopOpenings = () => {
  const { protocol } = useProtocolStore()
  const { lg } = useResponsive()
  const [limit, setLimit] = useState(LIMITS[0])
  const [sort, setSort] = useState(SORTS[0])

  // const tested = useRef(false)

  const {
    data,
    isFetching: isLoading,
    isRefetching,
  } = useQuery(
    [QUERY_KEYS.GET_TOP_OPEN_POSITIONS, protocol, limit, sort.key],
    () =>
      getTopOpeningPositionsApi({
        protocol,
        limit,
        offset: 0,
        sortBy: sort.key,
        sortType: 'desc',
      }).then((data) => data.data),
    {
      retry: 0,
      // keepPreviousData: true,
      refetchInterval: 5000,
    }
  )
  return (
    <>
      <CustomPageTitle title={`Top Opening Positions on ${protocol}`} />
      <Box sx={{ flex: '1 0 0', borderTop: 'small', borderColor: 'neutral4', height: '100%' }}>
        <Flex justifyContent="space-between" p={12} height="48px">
          <Flex sx={{ gap: 2 }} alignItems="center">
            <Type.BodyBold sx={{ mt: '-1px' }}>Top</Type.BodyBold>
            <Dropdown
              buttonSx={{
                border: 'none',
                py: 0,
                px: 0,
              }}
              menuSx={{
                width: '80px',
                minWidth: 'auto',
              }}
              placement="bottom"
              menu={
                <>
                  {LIMITS.map((option) => (
                    <CheckableDropdownItem
                      key={option}
                      selected={option === limit}
                      text={option}
                      onClick={() => setLimit(option)}
                    />
                  ))}
                </>
              }
            >
              <Type.BodyBold>{limit}</Type.BodyBold>
            </Dropdown>
            <Type.BodyBold sx={{ mt: '-1px' }}>By</Type.BodyBold>
            <Dropdown
              buttonSx={{
                border: 'none',
                py: 0,
                px: 0,
              }}
              menuSx={{
                width: '80px',
                minWidth: 'auto',
              }}
              placement="bottom"
              menu={
                <>
                  {SORTS.map((option) => (
                    <CheckableDropdownItem
                      key={option.key}
                      selected={option.key === sort.key}
                      text={option.text}
                      onClick={() => setSort(option)}
                    />
                  ))}
                </>
              }
            >
              <Type.BodyBold>{sort.text}</Type.BodyBold>
            </Dropdown>
          </Flex>
          <Flex alignItems="center" sx={{ gap: 1 }}>
            <Box width="16px" height="16px" color="green1" className="circle-pulse"></Box>
            <Type.Caption>Live</Type.Caption>
          </Flex>
        </Flex>
        <Flex height="calc(100% - 48px)">
          {lg && (
            <Box flex="1" display={['none', 'none', 'none', 'block']}>
              <VisualizeSection protocol={protocol} data={data} isLoading={isLoading} isRefetching={isRefetching} />
            </Box>
          )}
          <Box flex={[1, 1, 1, '0 0 650px']}>
            <ListSection data={data} total={limit} />
          </Box>
        </Flex>

        {/* <TopOpenPositions /> */}
      </Box>
    </>
  )
}

export default TopOpenings
