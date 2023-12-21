import { useResponsive } from 'ahooks'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getTopOpeningPositionsApi } from 'apis/positionApis'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import useSearchParams from 'hooks/router/useSearchParams'
import { useProtocolStore } from 'hooks/store/useProtocols'
import Dropdown, { CheckableDropdownItem } from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

import ListSection from './ListSection'
import VisualizeSection from './VisualizeSection'

const LIMITS = [100, 200, 500]

const SORTS = [
  {
    text: 'Newest',
    key: 'openBlockTime',
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
  const { searchParams, setSearchParams } = useSearchParams()

  const { limit, sort } = useMemo(() => {
    let limit = LIMITS[0]
    let sort = SORTS[0]

    if (searchParams.top && LIMITS.includes(Number(searchParams.top))) {
      limit = Number(searchParams.top)
    }
    if (searchParams.sort) {
      const foundSort = SORTS.find((sort) => sort.key === searchParams.sort?.toString())
      if (foundSort) sort = foundSort
    }
    return { limit, sort }
  }, [searchParams])

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
        sortType: SortTypeEnum.DESC,
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
                      onClick={() => setSearchParams({ top: option.toString() })}
                    />
                  ))}
                </>
              }
            >
              <Type.BodyBold>{limit}</Type.BodyBold>
            </Dropdown>
            <Type.BodyBold sx={{ mt: '-1px' }}>Open Interest By</Type.BodyBold>
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
                      onClick={() => setSearchParams({ sort: option.key })}
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
            <ListSection data={data} sort={sort.key} total={Math.min(limit, data?.length ?? 0)} isLoading={false} />
          </Box>
        </Flex>

        {/* <TopOpenPositions /> */}
      </Box>
    </>
  )
}

export default TopOpenings
