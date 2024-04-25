// eslint-disable-next-line no-restricted-imports
import React, { ReactNode } from 'react'
import { useQuery } from 'react-query'

import { getListenerStatsApi } from 'apis/systemApis'
import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import { Box, Flex, Image, Type } from 'theme/base'
import { ChainStatsEnum, ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { CHAIN_STATS_TRANS } from 'utils/config/translations'
import { overflowEllipsis } from 'utils/helpers/css'
import { parseProtocolImage } from 'utils/helpers/transform'

export default function Overview() {
  const { data } = useQuery([QUERY_KEYS.GET_LISTENER_STATS], () => getListenerStatsApi(), {
    retry: 0,
    refetchInterval: 5000,
  })

  return (
    <Box>
      <Type.H5 color="neutral8" maxWidth="fit-content" sx={{ px: 2, py: 1, bg: 'neutral1' }}>
        {CHAIN_STATS_TRANS[ChainStatsEnum.ARB]}
      </Type.H5>
      <ProtocolItem
        protocol={ProtocolEnum.GMX}
        rawBlock={data?.[ChainStatsEnum.ARB]?.gmxV1ArbLatestOrderBlock}
        latestOrderBlock={data?.[ChainStatsEnum.ARB]?.gmxV1ArbLatestOrderBlock}
        latestPositionBlock={data?.[ChainStatsEnum.ARB]?.gmxV1ArbLatestPositionBlock}
      />
      <ProtocolItem
        protocol={ProtocolEnum.GMX_V2}
        rawBlock={data?.[ChainStatsEnum.ARB]?.gmxV2ArbLatestOrderBlock}
        latestOrderBlock={data?.[ChainStatsEnum.ARB]?.gmxV2ArbLatestOrderBlock}
        latestPositionBlock={data?.[ChainStatsEnum.ARB]?.gmxV2ArbLatestPositionBlock}
      />
      <Type.H5 mt={24} color="neutral8" maxWidth="fit-content" sx={{ px: 2, py: 1, bg: 'neutral1' }}>
        {CHAIN_STATS_TRANS[ChainStatsEnum.OP]}
      </Type.H5>
      <ProtocolItem
        protocol={ProtocolEnum.KWENTA}
        rawBlock={data?.[ChainStatsEnum.OP]?.synthetixOpLatestRawDataBlock}
        latestOrderBlock={data?.[ChainStatsEnum.OP]?.synthetixOpLatestOrderBlock}
      />
    </Box>
  )
}

function ProtocolItem({
  protocol,
  rawBlock,
  latestOrderBlock,
  latestPositionBlock,
}: {
  protocol: ProtocolEnum
  rawBlock?: number
  latestOrderBlock?: number
  latestPositionBlock?: number
}) {
  const protocolOptionsMapping = useGetProtocolOptionsMapping()
  const delayOrderBlock = latestOrderBlock ? (rawBlock ?? 0) - (latestOrderBlock ?? 0) : undefined
  const delayPositionBlock = latestPositionBlock ? (rawBlock ?? 0) - (latestPositionBlock ?? 0) : undefined
  return (
    <Box>
      <Flex mt={3} sx={{ alignItems: 'center', gap: 2 }}>
        <Image src={parseProtocolImage(protocol)} width={32} height={32} />
        <Type.H4>{protocolOptionsMapping[protocol]?.text}</Type.H4>
      </Flex>
      <Box
        mt={2}
        sx={{
          display: 'grid',
          gap: 24,
          gridTemplateColumns: ['1fr', '1fr', '1fr 1fr', '1fr 1fr', 'repeat(3, 1fr)'],
        }}
      >
        <GridItemWrapper>
          <StatsItemWrapper>
            <StatsItem label={'Raw Data Block'} value={rawBlock} />
          </StatsItemWrapper>
        </GridItemWrapper>
        <GridItemWrapper>
          <StatsItemWrapper>
            <StatsItem
              label={'Latest Order Block'}
              value={latestOrderBlock}
              subValue={delayOrderBlock}
              subColor={getBlockRiskColor(delayOrderBlock)}
            />
          </StatsItemWrapper>
        </GridItemWrapper>
        <GridItemWrapper>
          <StatsItemWrapper>
            <StatsItem
              label={'Latest Position Block'}
              value={latestPositionBlock}
              subValue={delayPositionBlock}
              subColor={getBlockRiskColor(delayPositionBlock)}
            />
          </StatsItemWrapper>
        </GridItemWrapper>
      </Box>
    </Box>
  )
}

function GridItemWrapper({ children, sx }: { children: ReactNode; sx?: any }) {
  return <Box sx={{ bg: 'neutral5', ...(sx ?? {}) }}>{children}</Box>
}
function StatsItemWrapper({ children, sx }: { children: ReactNode; sx?: any }) {
  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
        ...(sx ?? {}),
      }}
    >
      {children}
    </Box>
  )
}

function StatsItem({
  label,
  value,
  subValue,
  sx,
  valueSx,
  labelSx,
  subColor,
}: {
  label: ReactNode
  value?: number
  subValue?: number
  sx?: any
  valueSx?: any
  labelSx?: any
  subColor?: string
}) {
  return (
    <>
      <Flex flexDirection="column" sx={{ gap: 2, ...(sx ?? {}) }}>
        <Flex sx={{ alignItems: 'center', gap: '4px' }}>
          <Type.Body textAlign="center" color="neutral2" sx={labelSx}>
            {label}
          </Type.Body>
        </Flex>
        <Type.LargeBold
          textAlign="center"
          sx={{ width: '100%', color: 'neutral1', ...overflowEllipsis(), ...(valueSx ?? {}) }}
        >
          {value ?? '--'}
        </Type.LargeBold>
      </Flex>
      <Type.Caption color={subColor ?? 'neutral3'}>{subValue ? subValue : '--'}</Type.Caption>
    </>
  )
}

export function getBlockRiskColor(delayedBlock?: number) {
  if (!delayedBlock) {
    return 'neutral3'
  }
  if (delayedBlock > 100) {
    return 'red2'
  }
  if (delayedBlock > 50) {
    return 'orange1'
  }
  if (delayedBlock > 0) {
    return 'green2'
  }
  return 'neutral3'
}
