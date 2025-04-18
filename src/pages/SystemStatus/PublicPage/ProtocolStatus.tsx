import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { SystemStatusData } from 'entities/system'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Flex, Type } from 'theme/base'
import {
  ProtocolCopyTradeStatusEnum,
  ProtocolEnum,
  SystemStatusSectionEnum,
  SystemStatusTypeEnum,
} from 'utils/config/enums'
import { PROTOCOL_COPY_TRADE_STATUS_TRANSLATION, SYSTEM_STATUS_TYPE_TRANSLATION } from 'utils/config/translations'
import { getSystemStatusTypeColor } from 'utils/helpers/format'

export default function PublicProtocolStatus() {
  const systemAlert = useSystemConfigStore((s) => s.systemAlert)
  const protocolStatusData = systemAlert?.find((alert) => alert.section === SystemStatusSectionEnum.PROTOCOL_STATUS)
    ?.sectionData?.data as SystemStatusData[] | undefined
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: 992,
        mx: 'auto',
        borderRight: 'small',
        borderLeft: 'small',
        borderColor: 'neutral4',
        overflow: 'hidden',
      }}
    >
      <Box flex="1 0 0">
        <Table restrictHeight isLoading={false} data={protocolStatusData} columns={columns} tableHeadSx={{ pr: 2 }} />
      </Box>
    </Flex>
  )
}

const columns: ColumnData<SystemStatusData>[] = [
  {
    key: 'feature',
    title: 'Protocol',
    render: (data) => {
      return <ProtocolLogo protocol={data.feature as ProtocolEnum} hasChainText />
    },
    style: { textAlign: 'left', minWidth: 200 },
  },
  {
    key: 'dataStatus',
    title: 'Data',
    render: (data) => {
      return <SystemStatusType type={data.dataStatus} />
    },
    style: { textAlign: 'left', minWidth: 100 },
  },
  {
    key: 'copyTradeStatus',
    title: 'Copy Trade',
    render: (data) => {
      return <ProtocolCopyTradeStatusType type={data.copyTradeStatus} />
    },
    style: { textAlign: 'left', minWidth: 100 },
  },
  {
    key: 'alertStatus',
    title: (
      <Box as="span" pr={36}>
        Alert
      </Box>
    ),
    render: (data) => {
      return (
        <Box pr={4}>
          <SystemStatusType type={data.alertStatus} />
        </Box>
      )
    },
    style: { textAlign: 'right', minWidth: 100 },
  },
]

function SystemStatusType({ type }: { type: SystemStatusTypeEnum }) {
  return <Type.Caption color={getSystemStatusTypeColor(type)}>{SYSTEM_STATUS_TYPE_TRANSLATION[type]}</Type.Caption>
}
function ProtocolCopyTradeStatusType({ type }: { type: ProtocolCopyTradeStatusEnum }) {
  return (
    <Type.Caption color={getProtocolCopyTradeStatusColor(type)}>
      {PROTOCOL_COPY_TRADE_STATUS_TRANSLATION[type]}
    </Type.Caption>
  )
}

function getProtocolCopyTradeStatusColor(type: ProtocolCopyTradeStatusEnum) {
  let color = 'green1'
  switch (type) {
    case ProtocolCopyTradeStatusEnum.UNCOPYABLE:
      color = 'red1'
      break
  }
  return color
}
