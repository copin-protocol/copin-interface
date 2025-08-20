import { useQuery as useApolloQuery } from '@apollo/client'
import { Trans } from '@lingui/macro'
import { TopOpeningPositionsGraphQLResponse } from 'graphql/entities/topOpeningPositions'
import { SEARCH_TOP_OPENING_POSITIONS_FUNCTION_NAME, SEARCH_TOP_OPENING_POSITIONS_QUERY } from 'graphql/query'
import { useCallback, useMemo, useRef } from 'react'
import { toast } from 'react-toastify'
import { FixedSizeList as List } from 'react-window'

import { normalizePositionData } from 'apis/normalize'
import NoDataFound from 'components/@ui/NoDataFound'
import ToastBody from 'components/@ui/ToastBody'
import { PositionData, ResponsePositionData } from 'entities/trader'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { PositionStatusEnum, SortTypeEnum } from 'utils/config/enums'

import OpenInterestItem from './OpenInterestItem'
import OpenInterestOverall from './OpenInterestOverall'
import { DURATION_DIVIDERS } from './helpers'

interface OpenInterestSectionProps {
  token: string
  sizeFilter: { gte: string | undefined; lte: string | undefined } | null
  selectedAccounts: string[] | null
  onSelectItem: (position: PositionData) => void
}

export default function OpenInterestSection({
  token,
  sizeFilter,
  selectedAccounts,
  onSelectItem,
}: OpenInterestSectionProps) {
  const selectedProtocols = useGlobalProtocolFilterStore((s) => s.selectedProtocols)
  const longListRef = useRef<List>(null)
  const shortListRef = useRef<List>(null)

  const queryVariables = useMemo(() => {
    const filter = {
      and: [
        { field: 'pair', in: [`${token}-USDT`] },
        { field: 'status', match: PositionStatusEnum.OPEN },
      ],
    }
    if (sizeFilter) {
      filter.and.push({ field: 'size', gte: sizeFilter.gte, lte: sizeFilter.lte } as any)
    }
    if (selectedAccounts) {
      filter.and.push({ field: 'account', in: selectedAccounts })
    }
    return {
      index: 'copin.positions',
      protocols: selectedProtocols ?? [],
      body: {
        filter,
        sorts: [{ field: 'size', direction: SortTypeEnum.DESC }],
        paging: { size: 200, from: 0 },
      },
    }
  }, [token, selectedProtocols, sizeFilter, selectedAccounts])

  const {
    data: openInterestData,
    loading,
    previousData,
  } = useApolloQuery<TopOpeningPositionsGraphQLResponse<ResponsePositionData>>(SEARCH_TOP_OPENING_POSITIONS_QUERY, {
    skip: selectedProtocols == null,
    variables: queryVariables,
    onError: (error) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
    pollInterval: 10000,
  })

  const positions = useMemo(() => {
    let data = openInterestData?.[SEARCH_TOP_OPENING_POSITIONS_FUNCTION_NAME]?.data
    if (!data) {
      data = previousData?.[SEARCH_TOP_OPENING_POSITIONS_FUNCTION_NAME]?.data?.filter((p) => p.pair === `${token}-USDT`)
    }
    return data?.map((position: ResponsePositionData) => normalizePositionData(position)) ?? []
  }, [openInterestData, previousData, token])

  const longPositions = useMemo(
    () =>
      positions
        .filter((p) => p.isLong)
        .sort((a, b) => new Date(b.openBlockTime).getTime() - new Date(a.openBlockTime).getTime()),
    [positions]
  )
  const shortPositions = useMemo(
    () =>
      positions
        .filter((p) => !p.isLong)
        .sort((a, b) => new Date(b.openBlockTime).getTime() - new Date(a.openBlockTime).getTime()),
    [positions]
  )

  // Calculate summary statistics

  const highestLongSize = useMemo(() => {
    return longPositions.reduce((max, p) => Math.max(max, p.size || 0), 0)
  }, [longPositions])
  const highestShortSize = useMemo(() => {
    return shortPositions.reduce((max, p) => Math.max(max, p.size || 0), 0)
  }, [shortPositions])

  // Virtual list renderers
  const renderLongPosition = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const position = longPositions[index]
      return (
        <Flex style={{ ...style, direction: 'ltr' }} justifyContent="flex-end" width="100%">
          <OpenInterestItem position={position} onClick={() => onSelectItem(position)} highestSize={highestLongSize} />
        </Flex>
      )
    },
    [longPositions, highestLongSize, onSelectItem]
  )

  const renderShortPosition = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const position = shortPositions[index]
      return (
        <Box style={style}>
          <OpenInterestItem position={position} onClick={() => onSelectItem(position)} highestSize={highestShortSize} />
        </Box>
      )
    },
    [shortPositions, highestShortSize, onSelectItem]
  )

  if (loading && !positions.length) {
    return (
      <Box p={4}>
        <Loading />
      </Box>
    )
  }

  if (!positions || positions.length === 0) {
    return <NoDataFound message={<Trans>No open interest found</Trans>} />
  }

  return (
    <>
      <OpenInterestOverall longPositions={longPositions} shortPositions={shortPositions} token={token} />
      <Box sx={{ position: 'relative' }}>
        <Flex width="100%" sx={{ gap: 3, height: '280px', position: 'relative', zIndex: 1 }}>
          {/* Long positions virtual list - scrollbar on left */}
          <Box flex="1" sx={{ overflowX: 'auto', overflowY: 'hidden', direction: 'rtl' }}>
            <Flex flexDirection="column" width="max-content" minWidth="100%" sx={{ position: 'relative' }}>
              <Flex
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  bottom: 0,
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              >
                {DURATION_DIVIDERS.map((divider, index) => {
                  const width = index === 0 ? divider.width : divider.width - DURATION_DIVIDERS[index - 1].width
                  return (
                    <Box
                      key={`long-${divider.label}`}
                      width={width}
                      sx={{
                        borderLeft: '1px dashed',
                        borderColor: 'neutral5',
                      }}
                    ></Box>
                  )
                })}
              </Flex>
              <Flex flex="1" height="100%" sx={{ position: 'relative', zIndex: 2 }}>
                <List
                  ref={longListRef}
                  height={250}
                  direction="rtl"
                  itemCount={longPositions.length}
                  itemSize={56}
                  width="100%"
                  itemData={longPositions}
                >
                  {renderLongPosition}
                </List>
              </Flex>
              <Box sx={{ flexShrink: 0, width: '100%' }}>
                {DURATION_DIVIDERS.map((divider, index) => {
                  const width = index === 0 ? divider.width : divider.width - DURATION_DIVIDERS[index - 1].width
                  return (
                    <Type.Caption
                      key={divider.label}
                      width={width}
                      color="neutral3"
                      textAlign="center"
                      sx={{ transform: 'translateX(-50%)' }}
                    >
                      {divider.label}
                    </Type.Caption>
                  )
                })}
              </Box>
            </Flex>
          </Box>

          <Box flex="1" sx={{ overflowX: 'auto', overflowY: 'hidden' }}>
            <Flex flexDirection="column" width="max-content" minWidth="100%" sx={{ position: 'relative' }}>
              <Flex
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  bottom: 0,
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              >
                {DURATION_DIVIDERS.map((divider, index) => {
                  const width = index === 0 ? divider.width : divider.width - DURATION_DIVIDERS[index - 1].width
                  return (
                    <Box
                      key={`long-${divider.label}`}
                      width={width}
                      sx={{
                        borderRight: '1px dashed',
                        borderColor: 'neutral5',
                      }}
                    ></Box>
                  )
                })}
              </Flex>
              <Flex flex="1" height="100%" sx={{ position: 'relative', zIndex: 2 }}>
                <List
                  ref={shortListRef}
                  height={250}
                  direction="ltr"
                  itemCount={shortPositions.length}
                  itemSize={56}
                  width="100%"
                  itemData={shortPositions}
                >
                  {renderShortPosition}
                </List>
              </Flex>
              <Box sx={{ flexShrink: 0, width: '100%' }}>
                {DURATION_DIVIDERS.map((divider, index) => {
                  const width = index === 0 ? divider.width : divider.width - DURATION_DIVIDERS[index - 1].width
                  return (
                    <Type.Caption
                      key={divider.label}
                      width={width}
                      color="neutral3"
                      textAlign="center"
                      sx={{ transform: 'translateX(50%)' }}
                    >
                      {divider.label}
                    </Type.Caption>
                  )
                })}
              </Box>
            </Flex>
          </Box>
        </Flex>

        {/* Duration Legend */}
        {/* <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'neutral5', position: 'relative' }}>
          <Flex width="100%" sx={{ gap: 3 }}>
            <Flex flex="1" sx={{ position: 'relative', height: '20px', flexDirection: 'row-reverse' }}>
              {DURATION_DIVIDERS.map((divider, index) => {
                const width = index === 0 ? divider.width : divider.width - DURATION_DIVIDERS[index - 1].width
                return (
                  <Type.Caption
                    key={divider.label}
                    width={width}
                    color="neutral2"
                    textAlign={index === 0 ? 'left' : 'right'}
                    pl={index === 0 ? 3 : 0}
                  >
                    {divider.label}
                  </Type.Caption>
                )
              })}
            </Flex>
            <Flex flex="1" sx={{ position: 'relative', height: '20px', flexDirection: 'row' }}>
              {DURATION_DIVIDERS.map((divider, index) => {
                const width = index === 0 ? divider.width : divider.width - DURATION_DIVIDERS[index - 1].width
                return (
                  <Type.Caption
                    key={divider.label}
                    width={width}
                    color="neutral2"
                    textAlign={index === 0 ? 'right' : 'left'}
                    pr={index === 0 ? 3 : 0}
                  >
                    {divider.label}
                  </Type.Caption>
                )
              })}
            </Flex>
          </Flex>
        </Box> */}
      </Box>
    </>
  )
}
