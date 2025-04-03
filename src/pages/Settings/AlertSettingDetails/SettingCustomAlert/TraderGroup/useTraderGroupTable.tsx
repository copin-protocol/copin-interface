import { Trash } from '@phosphor-icons/react'
import React, { useCallback, useMemo } from 'react'

import { TraderAlertData } from 'entities/alert'
import { Trader24hTrades, TraderAddress, TraderCreatedAt } from 'pages/Settings/AlertSettingDetails/config'
import IconButton from 'theme/Buttons/IconButton'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import { ColumnData } from 'theme/Table/types'
import { Flex } from 'theme/base'

/**
 * Hook for traders table configuration and cell renderers
 */
export const useTraderGroupTable = (
  onUpdateWatchlist: (data: TraderAlertData) => void,
  onRemoveWatchlist: (data: TraderAlertData) => void
) => {
  // Table cell renderers
  const TraderStatus = useCallback(
    ({ data }: { data: TraderAlertData }) => (
      <SwitchInput checked={data.enableAlert} onClick={() => onUpdateWatchlist(data)} />
    ),
    [onUpdateWatchlist]
  )

  const TraderActions = useCallback(
    ({ data }: { data: TraderAlertData }) => (
      <Flex alignItems="center" justifyContent="flex-end">
        <IconButton
          variant="ghost"
          icon={<Trash size={16} />}
          size={16}
          sx={{
            color: 'neutral3',
            '&:hover:not(:disabled),&:active:not(:disabled)': {
              color: 'red1',
            },
          }}
          onClick={() => onRemoveWatchlist(data)}
        />
      </Flex>
    ),
    [onRemoveWatchlist]
  )

  // Table columns definition
  const columns = useMemo(
    () =>
      [
        {
          title: 'RUN',
          dataIndex: 'enableAlert',
          key: 'enableAlert',
          style: { width: '50px' },
          render: (item) => <TraderStatus data={item} />,
        },
        {
          title: 'TRADERS',
          dataIndex: 'address',
          key: 'address',
          sortBy: 'address',
          style: { width: '120px' },
          render: (item) => <TraderAddress data={item} />,
        },
        {
          title: 'LATEST ADDED',
          dataIndex: 'createdAt',
          key: 'createdAt',
          sortBy: 'createdAt',
          style: { width: '110px', textAlign: 'right' },
          render: (item) => <TraderCreatedAt data={item} />,
        },
        {
          title: '24H TRADES',
          dataIndex: 'trade24h',
          key: 'trade24h',
          style: { width: '80px', textAlign: 'right' },
          render: (item) => <Trader24hTrades data={item} />,
        },
        {
          title: 'ACTION',
          dataIndex: 'id',
          key: 'id',
          style: { width: '50px', textAlign: 'right' },
          render: (item) => <TraderActions data={item} />,
        },
      ] as ColumnData<TraderAlertData>[],
    [TraderActions, TraderStatus]
  )

  return {
    columns,
    TraderStatus,
    TraderActions,
  }
}
