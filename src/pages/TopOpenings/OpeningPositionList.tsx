import { CaretRight } from '@phosphor-icons/react'
import { cloneElement, useCallback, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import TraderPositionDetailsDrawer from 'components/@position/TraderPositionDetailsDrawer'
import PositionListCard from 'components/@position/TraderPositionsListView'
import { RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import { renderEntry, renderOpeningPnL, renderSizeOpening, renderTrader } from 'components/@widgets/renderProps'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import Table from 'theme/Table'
import { ColumnData } from 'theme/Table/types'
import { Box, Type } from 'theme/base'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

const columns: ColumnData<PositionData>[] = [
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
    style: { width: '115px' },
    render: (item) => renderTrader(item.account, item.protocol),
  },
  {
    title: 'Entry',
    dataIndex: 'indexToken',
    key: 'indexToken',
    style: { width: '175px' },
    render: (item) => renderEntry(item, undefined, true),
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    style: { width: '205px' },
    render: (item) => renderSizeOpening(item),
  },
  {
    title: 'PnL',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { width: '75px', textAlign: 'right' },
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
function OpeningPositionsTable({ isLoading, data, scrollDep, onClickItem }: OpeningPositionComponentProps) {
  return (
    <Table
      restrictHeight
      wrapperSx={{
        minWidth: 650,
      }}
      data={data}
      scrollToTopDependencies={[scrollDep]}
      columns={columns}
      isLoading={isLoading}
      onClickRow={onClickItem}
      renderRowBackground={() => 'rgb(31, 34, 50)'}
    />
  )
}

export function OpeningPositionsWrapper({ children }: { children: any }) {
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()

  const handleSelectItem = useCallback((data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    window.history.replaceState(null, '', generatePositionDetailsRoute({ ...data, txHash: data.txHashes[0] }))
  }, [])

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }
  const renderedChildren = useMemo(() => {
    return cloneElement<OpeningPositionComponentProps>(children, { onClickItem: handleSelectItem })
  }, [children, handleSelectItem])

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
