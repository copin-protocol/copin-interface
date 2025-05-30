import { useMemo } from 'react'
import { useQuery } from 'react-query'

import { getListenerStatsApi } from 'apis/systemApis'
import useInternalRole from 'hooks/features/useInternalRole'
import { Box, Flex } from 'theme/base'
import { QUERY_KEYS } from 'utils/config/keys'
import { lowerFirstLetter } from 'utils/helpers/transform'

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
        let protocol = ''
        let blockType = ''
        if (key.match('synthetixV3')?.length) {
          protocol = 'synthetix_v3'
          blockType = lowerFirstLetter(key.split(/synthetixV3/i)?.[1])
        } else if (key.match('gmxV2')?.length) {
          protocol = 'gmx_V2'
          blockType = lowerFirstLetter(key.split(/gmxV2Arb/i)?.[1])
        } else if (key.includes('mirror')) {
          blockType = 'latestRawDataBlock'
          const [mirrorProtocol, mirrorBlockType] = key.split(new RegExp(network, 'i'))
          if (!mirrorBlockType) {
            protocol = key.split('LastBlock')?.[0]
          } else {
            protocol = mirrorProtocol
          }
        } else {
          const [_protocol, _blockType] = key.split(new RegExp(network, 'i'))
          if (_protocol && _blockType) {
            blockType = lowerFirstLetter(_blockType)
            protocol = _protocol
          }
        }
        protocols[protocol] = { ...(protocols[protocol] ?? {}), protocol, [blockType]: value }
        protocol = ''
        blockType = ''
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

  if (!formattedData) return null

  return (
    <Box p={3} sx={{ height: '100%', overflow: 'hidden auto' }}>
      <Flex flexDirection="column" sx={{ gap: 3 }}>
        {Object.entries(formattedData).map(([chain, protocolsData]) => {
          return <StatusByNetwork key={chain} network={chain} data={protocolsData as any} />
        })}
      </Flex>
    </Box>
  )
}
