import { CaretRight, XCircle } from '@phosphor-icons/react'
import { cloneElement, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Container from 'components/@ui/Container'
import { RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import Table from 'components/@ui/Table'
import {
  renderEntry,
  renderOpeningPnLWithPrices,
  renderSizeOpening,
  renderTrader,
} from 'components/@ui/Table/renderProps'
import { ColumnData } from 'components/@ui/Table/types'
import PositionDetails from 'components/PositionDetails'
import PositionListCard from 'components/PositionListCard'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useIsMobile from 'hooks/helpers/useIsMobile'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import IconButton from 'theme/Buttons/IconButton'
import Drawer from 'theme/Modal/Drawer'
import { Box, Type } from 'theme/base'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

export type ExternalSource = {
  prices: UsdPrices
}
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
    style: { width: '120px' },
    render: (item) => renderTrader(item.account, item.protocol),
  },
  {
    title: 'Entry',
    dataIndex: 'indexToken',
    key: 'indexToken',
    style: { width: '170px' },
    render: (item) => renderEntry(item, undefined, true),
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    style: { width: '205px' },
    render: (item, index, externalSource) =>
      externalSource?.prices ? renderSizeOpening(item, externalSource?.prices) : '--',
  },
  {
    title: 'PnL',
    dataIndex: 'pnl',
    key: 'pnl',
    style: { width: '75px', textAlign: 'right' },
    render: (item, index, externalSource) =>
      externalSource?.prices ? renderOpeningPnLWithPrices(item, externalSource?.prices, true) : '--',
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
  const { prices } = useGetUsdPrices()

  const externalSource: ExternalSource = {
    prices,
  }

  return (
    <Table
      restrictHeight
      wrapperSx={{
        minWidth: 650,
      }}
      data={data}
      scrollToTopDependencies={[scrollDep]}
      columns={columns}
      externalSource={externalSource}
      isLoading={isLoading}
      onClickRow={onClickItem}
      renderRowBackground={() => 'rgb(31, 34, 50)'}
    />
  )
}

export function OpeningPositionsWrapper({ children }: { children: any }) {
  const isMobile = useIsMobile()
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()

  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    window.history.replaceState(null, '', generatePositionDetailsRoute({ ...data, txHash: data.txHashes[0] }))
  }

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  return (
    <div style={{ height: '100%' }}>
      {cloneElement<OpeningPositionComponentProps>(children, { onClickItem: handleSelectItem })}
      <Drawer
        isOpen={openDrawer}
        onDismiss={handleDismiss}
        mode="right"
        size={isMobile ? '100%' : '60%'}
        background="neutral6"
      >
        <Container pb={3} sx={{ position: 'relative' }}>
          <IconButton
            icon={<XCircle size={24} />}
            variant="ghost"
            sx={{ position: 'absolute', right: 1, top: 3 }}
            onClick={handleDismiss}
          />
          {!!currentPosition && (
            <PositionDetails protocol={currentPosition.protocol} id={currentPosition.id} isShow={openDrawer} />
          )}
        </Container>
      </Drawer>
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
