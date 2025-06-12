import { Trans } from '@lingui/macro'
import { CaretRight } from '@phosphor-icons/react'
import { cloneElement, useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import PositionListCard from 'components/@position/TraderPositionsListView'
import { RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import { PnlTitle } from 'components/@widgets/SwitchPnlButton'
import TableRangeFilterIcon from 'components/@widgets/TableFilter/TableRangeFilterIcon'
import { renderEntry, renderOpeningPnL, renderSizeOpening, renderTrader } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useOIPermission from 'hooks/features/subscription/useOIPermission'
import useQuickViewTraderStore from 'hooks/store/useQuickViewTraderStore'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Type } from 'theme/base'
import { ProtocolEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

const columns: ColumnData<PositionData, ExternalSource>[] = [
  {
    title: 'Time',
    dataIndex: 'openBlockTime',
    key: 'openBlockTime',
    style: { width: '45px' },
    render: (item) => (
      <Type.Caption color="neutral3">
        <RelativeShortTimeText date={item.openBlockTime} />
      </Type.Caption>
    ),
  },
  {
    title: 'Trader',
    dataIndex: 'account',
    key: 'account',
    style: { width: '154px' },
    render: (item, _, externalSource) =>
      renderTrader(item.account, item.protocol, true, true, externalSource?.onQuickView),
  },
  {
    title: 'Entry',
    dataIndex: 'indexToken',
    key: 'indexToken',
    style: { width: '200px' },
    render: (item) => renderEntry(item, undefined, true),
  },
  {
    title: 'Value',
    dataIndex: 'size',
    key: 'size',
    style: { width: '218px' },
    render: (item) => renderSizeOpening(item),
    filterComponent: ({ externalSource }) => (
      <TableRangeFilterIcon
        config={{ type: 'number', urlParamKey: 'size', label: <Trans>Value</Trans> }}
        requiredPlan={
          externalSource?.allowedFilter != null && !externalSource.allowedFilter
            ? externalSource?.planToFilter
            : undefined
        }
      />
    ),
    // filterComponent: <TableRangeFilterIcon  />,
  },
  {
    title: 'PnL',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { width: '70px', textAlign: 'right' },
    render: (item) => renderOpeningPnL(item),
  },
  {
    title: '',
    dataIndex: 'id',
    key: 'id',
    style: { width: '20px', textAlign: 'right' },
    render: () => (
      <Box sx={{ position: 'relative', top: '2px' }}>
        <CaretRight />
      </Box>
    ),
  },
]

export type OpeningPositionProps = {
  isLoading: boolean
  data?: PositionData[]
  scrollDep: number
}
export type OpeningPositionComponentProps = {
  onClickItem?: (data: PositionData) => void
  onQuickView?: ({ address, protocol }: { address: string; protocol: ProtocolEnum }) => void
  allowedFilter?: boolean
  planToFilter?: SubscriptionPlanEnum
} & OpeningPositionProps

export default function TopOpeningsWindow(props: OpeningPositionProps) {
  return (
    <div style={{ height: '100%' }}>
      <OpeningPositionsWrapper>
        <OpeningPositionsTable {...props} />
      </OpeningPositionsWrapper>
    </div>
  )
}

type ExternalSource = {
  onQuickView?: ({ address, protocol }: { address: string; protocol: ProtocolEnum }) => void
  allowedFilter?: boolean
  planToFilter?: SubscriptionPlanEnum
}
function OpeningPositionsTable({
  isLoading,
  data,
  scrollDep,
  onClickItem,
  onQuickView,
  allowedFilter,
  planToFilter,
}: OpeningPositionComponentProps) {
  const externalSource: ExternalSource = {
    onQuickView,
    allowedFilter,
    planToFilter,
  }
  return (
    <Table
      restrictHeight
      wrapperSx={{
        minWidth: 650,
        '& tbody': {
          '.hiding-btn': { opacity: 0, transition: 'all 240ms ease' },
        },
        '& tbody td': {
          '.hiding-btn': { opacity: 0 },
        },
        '& tbody tr:hover': {
          '.hiding-btn': { opacity: 1 },
        },
      }}
      data={data}
      scrollToTopDependencies={scrollDep}
      columns={columns}
      isLoading={isLoading}
      onClickRow={onClickItem}
      renderRowBackground={() => 'rgb(31, 34, 50)'}
      externalSource={externalSource}
    />
  )
}

function OpeningPositionsWrapper({ children }: { children: any }) {
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  const { setTrader } = useQuickViewTraderStore()

  const handleSelectItem = useCallback((data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    window.history.replaceState(null, '', generatePositionDetailsRoute({ ...data, txHash: data.txHashes?.[0] }))
  }, [])

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  const handleQuickView = useCallback(
    ({ address, protocol }: { address: string; protocol: ProtocolEnum }) => {
      setTrader({ address, protocol })
    },
    [setTrader]
  )
  const { allowedFilter, planToFilter } = useOIPermission()

  const renderedChildren = useMemo(() => {
    return cloneElement<OpeningPositionComponentProps>(children, {
      onClickItem: handleSelectItem,
      onQuickView: handleQuickView,
      allowedFilter,
      planToFilter,
    })
  }, [children, handleSelectItem, handleQuickView, allowedFilter, planToFilter])

  return (
    <div style={{ height: '100%' }}>
      {renderedChildren}
      <TraderPositionDetailsDrawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        protocol={currentPosition?.protocol}
        id={currentPosition?.id}
        chartProfitId="top-opening-position-page"
      />
    </div>
  )
}

export function ListOpeningPositions(props: OpeningPositionProps) {
  return (
    <OpeningPositionsWrapper>
      <PositionListCard {...props} />
    </OpeningPositionsWrapper>
  )
}
