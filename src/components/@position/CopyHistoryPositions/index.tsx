import { Trans } from '@lingui/macro'
import { useResponsive } from 'ahooks'

import { CopyPositionData } from 'entities/copyTrade.d'
import { TableSortProps } from 'theme/Table/types'
import { DATA_ATTRIBUTES } from 'utils/config/keys'

import CopyPositionsListView from '../CopyPositionsListView'
import CopyPositionsTableView from '../CopyPositionsTableView'
import { historyColumns } from './configs'

export default function CopyHistoryPositions({
  data,
  isLoading,
  deletedTraders,
  currentSort,
  changeCurrentSort,
  onClosePositionSuccess,
}: {
  data: CopyPositionData[] | undefined
  isLoading: boolean
  deletedTraders: string[]
  currentSort: TableSortProps<CopyPositionData> | undefined
  changeCurrentSort: (sort: TableSortProps<CopyPositionData> | undefined) => void
  onClosePositionSuccess: () => void
}) {
  const { sm } = useResponsive()

  return sm ? (
    <CopyPositionsTableView
      data={data}
      columns={historyColumns}
      isLoading={isLoading}
      currentSort={currentSort}
      changeCurrentSort={changeCurrentSort}
      onClosePositionSuccess={onClosePositionSuccess}
      tableHeadSx={{
        '& th:first-child': {
          pl: 3,
        },
        '& th': {
          py: 2,
          pr: '16px !important',
          border: 'none',
        },
      }}
      tableBodySx={{
        borderSpacing: ' 0px 4px',
        'td:first-child': {
          pl: 3,
        },
        '& td': {
          pr: 3,
          bg: 'neutral6',
        },
        '& tbody tr:hover td': {
          bg: 'neutral5',
        },
        ...generateDeletedTraderStyle(deletedTraders),
      }}
      noDataMessage={<Trans>No History Found</Trans>}
    />
  ) : (
    <CopyPositionsListView
      data={data}
      isLoading={isLoading}
      onClosePositionSuccess={onClosePositionSuccess}
      noDataMessage={<Trans>No History Found</Trans>}
    />
  )
}

function generateDeletedTraderStyle(addresses: string[]) {
  const key = addresses
    .map((address) => {
      return `[${DATA_ATTRIBUTES.TRADER_COPY_DELETED}="${address}"]`
    })
    .join(',')
  return {
    '&': {
      [key]: { color: 'neutral3' },
    },
  }
}
