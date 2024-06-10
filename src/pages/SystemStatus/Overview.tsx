// eslint-disable-next-line no-restricted-imports
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getListenerStatsApi } from 'apis/systemApis'
import useInternalRole from 'hooks/features/useInternalRole'
import { Box, Flex } from 'theme/base'
import { ChainStatsEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { capitalizeFirstLetter, lowerFirstLetter } from 'utils/helpers/transform'

import StatusByNetwork from './StatusByNetwork'

export default function Overview() {
  const isInternal = useInternalRole()
  const { data } = useQuery([QUERY_KEYS.GET_LISTENER_STATS], () => getListenerStatsApi(), {
    retry: 0,
    refetchInterval: 10000,
    enabled: isInternal,
  })

  const formattedData = useMemo(() => {
    if (!data) return
    const result: any = {}

    Object.entries(data).forEach(([network, listenerData]) => {
      const protocols: any = {}

      Object.entries(listenerData).forEach(([key, value]) => {
        if (key.includes('mirror')) {
          let protocol
          const fieldName = 'latestRawDataBlock'
          const [mirrorProtocol, mirrorFieldName] = key.split(capitalizeFirstLetter(network))
          if (!mirrorFieldName) {
            protocol = key.split('LastBlock')?.[0]
          } else {
            protocol = mirrorProtocol
          }

          if (protocol) {
            const blockType = lowerFirstLetter(fieldName)

            if (protocol && !protocols[protocol]) {
              protocols[protocol] = {
                protocol,
                latestRawDataBlock: undefined,
                latestOrderBlock: undefined,
                latestPositionBlock: undefined,
              }
            }
            protocols[protocol][blockType] = value
          }
        } else {
          const [protocol, fieldName] = key.split(capitalizeFirstLetter(network))
          if (protocol && fieldName) {
            const blockType = lowerFirstLetter(fieldName)

            if (protocol && !protocols[protocol]) {
              protocols[protocol] = {
                protocol,
                latestRawDataBlock: undefined,
                latestOrderBlock: undefined,
                latestPositionBlock: undefined,
              }
            }
            protocols[protocol][blockType] = value
          }
        }
      })

      result[network] = Object.values(protocols).map((e: any) => {
        const latestRawDataBlock = e.latestRawDataBlock ?? e.latestOrderBlock
        const delayOrderBlock = e.latestOrderBlock ? (latestRawDataBlock ?? 0) - (e.latestOrderBlock ?? 0) : undefined
        const delayPositionBlock = e.latestPositionBlock
          ? (latestRawDataBlock ?? 0) - (e.latestPositionBlock ?? 0)
          : undefined
        return {
          ...e,
          latestRawDataBlock,
          delayOrderBlock,
          delayPositionBlock,
        }
      })
    })
    return result
  }, [data])

  return (
    <Box p={3} sx={{ height: '100%', overflow: 'hidden auto' }}>
      <Flex flexDirection="column" sx={{ gap: 3 }}>
        <StatusByNetwork network={ChainStatsEnum.ABITRUM} data={formattedData?.[ChainStatsEnum.ABITRUM]} />
        <StatusByNetwork network={ChainStatsEnum.OPTIMISM} data={formattedData?.[ChainStatsEnum.OPTIMISM]} />
        <StatusByNetwork network={ChainStatsEnum.POLYGON} data={formattedData?.[ChainStatsEnum.POLYGON]} />
        <StatusByNetwork network={ChainStatsEnum.BNB_CHAIN} data={formattedData?.[ChainStatsEnum.BNB_CHAIN]} />
        <StatusByNetwork network={ChainStatsEnum.BASE} data={formattedData?.[ChainStatsEnum.BASE]} />
        <StatusByNetwork network={ChainStatsEnum.MANTLE} data={formattedData?.[ChainStatsEnum.MANTLE]} />
      </Flex>
    </Box>
  )
}
