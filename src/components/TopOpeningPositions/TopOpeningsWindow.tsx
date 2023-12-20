import { CaretRight, XCircle } from '@phosphor-icons/react'
import { useState } from 'react'
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
import { PositionData } from 'entities/trader'
import useIsMobile from 'hooks/helpers/useIsMobile'
import { UsdPrices, useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import IconButton from 'theme/Buttons/IconButton'
import Drawer from 'theme/Modal/Drawer'
import { Box, Type } from 'theme/base'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

export type ExternalSource = {
  prices: UsdPrices
}
export const columns: ColumnData<PositionData, ExternalSource>[] = [
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
    style: { width: '140px' },
    render: (item) => renderEntry(item),
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

export default function TopOpeningsWindow({
  isLoading,
  data,
  page,
}: {
  isLoading: boolean
  data?: PositionData[]
  page: number
}) {
  const { prices } = useRealtimeUsdPricesStore()
  const isMobile = useIsMobile()
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()

  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    window.history.replaceState(null, '', generatePositionDetailsRoute(data))
  }

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  const externalSource: ExternalSource = {
    prices,
  }

  return (
    <div style={{ height: '100%' }}>
      <Table
        restrictHeight
        wrapperSx={{
          minWidth: 650,
        }}
        data={data}
        scrollToTopDependencies={[page]}
        columns={columns}
        externalSource={externalSource}
        isLoading={isLoading}
        onClickRow={handleSelectItem}
        renderRowBackground={() => 'rgb(31, 34, 50)'}
      />

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
