import openingBg from 'assets/images/opening_bg.svg'
import { PositionData } from 'entities/trader'
import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'

import LoadingBar from './LoadingBar'
import OpeningPositionsBubble from './OpeningPositionsBubble'

const VisualizeSection = ({
  protocol,
  data,
  isLoading,
  isRefetching,
}: {
  protocol: ProtocolEnum
  data: PositionData[] | undefined
  isLoading: boolean
  isRefetching: boolean
}) => {
  // const queryClient = useQueryClient()
  const longVol = data ? data.filter((item) => item.isLong).reduce((prev, cur) => (prev += cur.size), 0) : undefined
  const longTraders = data ? new Set(data.filter((item) => item.isLong).map((item) => item.account)) : undefined
  const shortTraders = data ? new Set(data.filter((item) => !item.isLong).map((item) => item.account)) : undefined
  const shortVol = data ? data.filter((item) => !item.isLong).reduce((prev, cur) => (prev += cur.size), 0) : undefined
  const longRate = longVol != null && shortVol != null ? (longVol * 100) / (longVol + shortVol) : undefined
  // useEffect(() => {
  //   if (!data) return
  //   setTimeout(() => {
  //     if (data) {
  //       if (tested.current) return
  //       tested.current = true
  //       queryClient.setQueryData([QUERY_KEYS.GET_TOP_OPEN_POSITIONS, protocol, limit], (data: any) => {
  //         return [...data, { ...data[0], id: 'test' }]
  //       })
  //     }
  //   }, 3000)
  // }, [data])
  return (
    <>
      <Box height="100%">
        <Flex
          height="calc(100% - 136px)"
          sx={{
            position: 'relative',
            borderBottom: 'small',
            borderTop: 'small',
            borderColor: 'neutral4',
            backgroundImage: `url(${openingBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, right: 0, width: '100%' }}>
            <LoadingBar isRefetching={isRefetching} />
            {isRefetching && (
              <Box sx={{ position: 'absolute', top: 0, right: '8px' }}>
                <Loading />
              </Box>
            )}
          </Box>

          {!data && isLoading && <Loading />}
          {data && <OpeningPositionsBubble data={data} protocol={protocol} />}
        </Flex>
        <Box height="136px" p={12}>
          {!!longRate && (
            <>
              <Flex justifyContent="space-between" mb={3}>
                <Type.CaptionBold>Long Rate: {formatNumber(longRate, 1, 1)}%</Type.CaptionBold>
                <Type.CaptionBold>Short Rate: {formatNumber(100 - longRate, 1, 1)}%</Type.CaptionBold>
              </Flex>

              <Flex width="100%" height="8px">
                <Box width={`calc(${longRate}% - 6px)`} height="100%" bg="green1"></Box>
                <Box width="12px" sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      display: 'inline-block',
                      borderStyle: 'solid',
                      borderWidth: '4px',
                      borderTopColor: 'green1',
                      borderLeftColor: 'green1',
                      borderBottomColor: 'transparent',
                      borderRightColor: 'transparent',
                    }}
                    width="0"
                    height="0"
                  ></Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      display: 'inline-block',
                      borderStyle: 'solid',
                      borderWidth: '4px',
                      borderTopColor: 'transparent',
                      borderLeftColor: 'transparent',
                      borderBottomColor: 'red1',
                      borderRightColor: 'red1',
                    }}
                    width="0"
                    height="0"
                  ></Box>
                </Box>
                <Box width={`calc(${100 - longRate}% - 6px)`} height="100%" bg="red1"></Box>
              </Flex>
              <Flex justifyContent="space-between" mt={3}>
                <Box>
                  <Type.Caption display="block">Long Volume: ${formatNumber(longVol, 0, 0)}</Type.Caption>
                  <Type.Caption>{longTraders?.size ?? '--'} traders</Type.Caption>
                </Box>
                <Box textAlign="right">
                  <Type.Caption display="block">Short Volume: ${formatNumber(shortVol, 0, 0)}</Type.Caption>
                  <Type.Caption>{shortTraders?.size ?? '--'} traders</Type.Caption>
                </Box>
              </Flex>
            </>
          )}
        </Box>
      </Box>
    </>
  )
}

export default VisualizeSection
