// eslint-disable-next-line no-restricted-imports
import React, { useMemo } from 'react'

import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { VerticalDivider } from 'components/@ui/VerticalDivider'
import useLatestBlockNumber from 'hooks/features/useLastestBlockNumber'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_LISTENER_MAPPING } from 'utils/config/protocols'
import { MIRROR_TRANS } from 'utils/config/translations'
import { overflowEllipsis } from 'utils/helpers/css'
import { capitalizeFirstLetter, parseChainFromNetwork } from 'utils/helpers/transform'

type ExternalSource = {
  latestBlockNumber: number
}
export default function StatusByNetwork({ network, data }: { network: string; data?: any[] }) {
  const chainInfo = parseChainFromNetwork(network)
  const { latestBlockNumber } = useLatestBlockNumber({ chainId: chainInfo.chainId, dep: data })

  const externalSource: ExternalSource = {
    latestBlockNumber,
  }
  const _data = data?.filter((v) => !!v.protocol)

  const columns = useMemo(() => {
    const result: ColumnData<any, ExternalSource>[] = [
      {
        title: 'Protocol',
        dataIndex: 'protocol',
        key: 'protocol',
        style: { minWidth: '150px' },
        render: (item: any) => {
          const isMirror = item.protocol?.includes('mirror')
          const protocolByMapping = PROTOCOL_LISTENER_MAPPING[item.protocol + capitalizeFirstLetter(network)]
          const protocol = protocolByMapping
            ? protocolByMapping
            : ((item.protocol + '_' + capitalizeFirstLetter(network)).toUpperCase() as ProtocolEnum)
          return (
            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <ProtocolLogo protocol={protocol} hasText={!isMirror} size={24} textSx={{ color: 'neutral1' }} />
              {isMirror && <Type.Caption color="neutral1">{MIRROR_TRANS[item.protocol]}</Type.Caption>}
            </Flex>
          )
        },
      },
      {
        title: 'Raw Data Block',
        dataIndex: 'latestRawDataBlock',
        key: 'latestRawDataBlock',
        style: { minWidth: '150px' },
        render: (item: any, _, externalSource) => {
          const delayRawDataBlock = (externalSource?.latestBlockNumber ?? 0) - item.latestRawDataBlock
          return (
            <StatsItem
              value={item.latestRawDataBlock}
              subValue={delayRawDataBlock}
              subColor={getBlockRiskColor(delayRawDataBlock)}
            />
          )
        },
      },
      {
        title: 'Latest Order Block',
        dataIndex: 'latestOrderBlock',
        key: 'latestOrderBlock',
        style: { minWidth: '150px' },
        render: (item: any) => {
          return (
            <StatsItem
              value={item.latestOrderBlock}
              subValue={item.delayOrderBlock}
              subColor={getBlockRiskColor(item.delayOrderBlock)}
            />
          )
        },
      },
      {
        title: 'Latest Position Block',
        dataIndex: 'latestPositionBlock',
        key: 'latestPositionBlock',
        style: { minWidth: '150px' },
        render: (item: any) => {
          return (
            <StatsItem
              value={item.latestPositionBlock}
              subValue={item.delayPositionBlock}
              subColor={getBlockRiskColor(item.delayPositionBlock)}
            />
          )
        },
      },
    ]
    return result
  }, [network])

  return (
    <Box>
      <Flex alignItems="center" sx={{ gap: 24 }}>
        <Flex width={140} alignItems="center" sx={{ gap: 2, px: 2, py: 1, bg: 'neutral1' }}>
          <img width={24} height={24} src={`/images/chains/${chainInfo.icon}.png`} alt={network} />
          <Type.LargeBold color="neutral8">{chainInfo.label}</Type.LargeBold>
        </Flex>
        <Flex alignItems="center" sx={{ gap: 2 }}>
          <Type.Caption color="neutral3">Block Number:</Type.Caption>
          <Type.CaptionBold color="neutral1">{latestBlockNumber}</Type.CaptionBold>
        </Flex>
      </Flex>

      <Box
        mt={3}
        sx={{
          flex: '1 0 0',
          overflowX: 'auto',
          border: 'small',
          borderColor: 'neutral4',
        }}
      >
        <Table
          restrictHeight={false}
          isLoading={false}
          columns={columns}
          data={_data}
          externalSource={externalSource}
          tableBodySx={{ 'tr:hover': { '.table_icon': { color: 'neutral1' } } }}
          tableHeadSx={{
            th: {
              pt: 1,
            },
          }}
        />
      </Box>
    </Box>
  )
}

function StatsItem({
  value,
  subValue,
  sx,
  valueSx,
  subColor,
}: {
  value?: number
  subValue?: number
  sx?: any
  valueSx?: any
  subColor?: string
}) {
  return (
    <>
      <Flex alignItems="center" sx={{ gap: 2, color: 'neutral1', ...(sx ?? {}) }}>
        <Type.CaptionBold sx={{ color: 'neutral1', ...overflowEllipsis(), ...(valueSx ?? {}) }}>
          {value ?? '--'}
        </Type.CaptionBold>
        <VerticalDivider />
        <Type.Caption color={subColor ?? 'neutral3'}>{subValue ? subValue : '--'}</Type.Caption>
      </Flex>
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
