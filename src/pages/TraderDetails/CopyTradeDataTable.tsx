import { useMemo } from 'react'

import Table from 'components/@ui/Table'
import { ColumnData } from 'components/@ui/Table/types'
import { CopyTradeData } from 'entities/copyTrade.d'
import { renderTrader } from 'pages/MyProfile/renderProps'
import { Box, Type } from 'theme/base'
import colors from 'theme/colors'
import { CopyTradeStatusEnum } from 'utils/config/enums'
import { overflowEllipsis } from 'utils/helpers/css'
import { formatNumber } from 'utils/helpers/format'

export default function CopyTradeDataTable({
  isLoading,
  data,
  onPick,
}: {
  isLoading: boolean
  data: CopyTradeData[]
  onPick: (data: CopyTradeData) => void
}) {
  const columns = useMemo(() => {
    const result: ColumnData<CopyTradeData>[] = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        style: { minWidth: '140px' },
        render: (item) => (
          <Type.Caption color="neutral1" maxWidth={140} sx={{ ...overflowEllipsis() }}>
            {item.title}
          </Type.Caption>
        ),
      },
      {
        title: 'Trader',
        dataIndex: 'account',
        key: 'account',
        style: { minWidth: '100px' },
        render: (item) =>
          renderTrader(item.account, item.protocol, {
            isLink: false,
            textSx: {
              color: item.status === CopyTradeStatusEnum.RUNNING ? 'neutral1' : 'neutral3',
            },
            sx: {
              filter: item.status === CopyTradeStatusEnum.RUNNING ? 'none' : 'grayscale(1)',
            },
          }),
      },

      {
        title: 'Volume',
        dataIndex: 'volume',
        key: 'volume',
        style: { minWidth: '100px' },
        render: (item) => <Type.Caption color="neutral1">${formatNumber(item.volume)}</Type.Caption>,
      },
      {
        title: 'Leverage',
        dataIndex: 'leverage',
        key: 'leverage',
        style: { minWidth: '100px' },
        render: (item) => <Type.Caption color="neutral1">x{formatNumber(item.leverage)}</Type.Caption>,
      },
      {
        title: 'Vol Protection',
        dataIndex: 'volumeProtection',
        key: 'volumeProtection',
        style: { minWidth: '100px' },
        render: (item) =>
          item.volumeProtection ? (
            <Type.Caption color="green1">ON</Type.Caption>
          ) : (
            <Type.Caption color="red2">OFF</Type.Caption>
          ),
      },

      {
        title: 'Stoploss',
        dataIndex: 'stopLossAmount',
        key: 'stopLossAmount',
        style: { minWidth: '100px' },
        render: (item) => (
          <Type.Caption color={item.enableStopLoss && item.stopLossAmount ? 'neutral1' : undefined}>
            {item.enableStopLoss && item.stopLossAmount ? `$${formatNumber(item.stopLossAmount)}` : '--'}
          </Type.Caption>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        style: { minWidth: '100px' },
        render: (item) => (
          <Type.Caption color={item.status === CopyTradeStatusEnum.STOPPED ? 'red2' : 'green1'}>
            {item.status}
          </Type.Caption>
        ),
      },
    ]
    return result
  }, [])

  return data && data.length > 0 ? (
    <Box mt={2} height="min(680px,calc(90vh - 160px))">
      <Table
        restrictHeight
        rowSx={{
          borderBottom: '4px solid',
          borderColor: 'neutral5',
        }}
        data={data}
        columns={columns}
        isLoading={isLoading}
        renderRowBackground={() => colors(true).neutral6}
        onClickRow={(data) => onPick(data)}
      />
    </Box>
  ) : (
    <></>
  )
}
