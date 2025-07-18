import { Trans } from '@lingui/macro'
import React, { useMemo } from 'react'

import Divider from 'components/@ui/Divider'
import { HlDailyVolumeData } from 'entities/hyperliquid'
import Modal from 'theme/Modal'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

export default function ModalDailyVolume({
  data,
  makerVolumeShare,
  onDismiss,
}: {
  data?: HlDailyVolumeData[]
  makerVolumeShare?: number
  onDismiss: () => void
}) {
  const columns = useMemo(() => {
    const result: ColumnData<HlDailyVolumeData>[] = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        style: { minWidth: '100px' },
        render: (item: HlDailyVolumeData) => {
          return <Type.Caption>{item.date}</Type.Caption>
        },
      },
      {
        title: 'Exchange Volume',
        dataIndex: 'exchange',
        key: 'exchange',
        style: { minWidth: '120px', textAlign: 'right' },
        render: (item: HlDailyVolumeData) => {
          return <Type.Caption>${formatNumber(Number(item.exchange), 0)}</Type.Caption>
        },
      },
      {
        title: 'Weight Maker Volume',
        dataIndex: 'userAdd',
        key: 'userAdd',
        style: { minWidth: '150px', textAlign: 'right' },
        render: (item: HlDailyVolumeData) => {
          return <Type.Caption>${formatNumber(Number(item.userAdd), 0)}</Type.Caption>
        },
      },
      {
        title: 'Weight Taker Volume',
        dataIndex: 'userCross',
        key: 'userCross',
        style: { minWidth: '150px', textAlign: 'right' },
        render: (item: HlDailyVolumeData) => {
          return <Type.Caption>${formatNumber(Number(item.userCross), 0)}</Type.Caption>
        },
      },
    ]
    return result
  }, [])

  return (
    <Modal isOpen maxWidth="550px" title={<Trans>Volume History</Trans>} onDismiss={() => onDismiss()} hasClose>
      <Box height={[380, 500]}>
        <Table
          restrictHeight={true}
          data={data}
          columns={columns}
          isLoading={false}
          tableBodySx={{ color: 'neutral1' }}
          wrapperSx={{
            table: {
              '& th:first-child, td:first-child': {
                pl: 3,
              },
              '& th:last-child': {
                pr: 3,
              },
              '& td:last-child': {
                pr: 3,
              },
            },
          }}
        />
      </Box>
      <Box px={3} py={3}>
        <Divider />
        <Type.Caption py={2} color="neutral3">
          Dates are based on UTC time zone and do not include the current day. Trader 14D maker volume share is{' '}
          {formatNumber((makerVolumeShare ?? 0) * 100, 2, 2)}%. Perps and spot volume are counted together to determine
          trader fee tier, and spot volume counts double toward trader fee tier.
        </Type.Caption>
      </Box>
    </Modal>
  )
}
