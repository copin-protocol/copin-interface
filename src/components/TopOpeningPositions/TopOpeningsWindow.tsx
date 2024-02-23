import { Trans } from '@lingui/macro'
import { CaretRight, XCircle } from '@phosphor-icons/react'
import { cloneElement, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Container from 'components/@ui/Container'
import { RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import NoDataFound from 'components/@ui/NoDataFound'
import Table from 'components/@ui/Table'
import {
  renderEntry,
  renderOpeningPnL,
  renderOpeningPnLWithPrices,
  renderSizeOpening,
  renderTrader,
} from 'components/@ui/Table/renderProps'
import { ColumnData } from 'components/@ui/Table/types'
import PositionDetails from 'components/PositionDetails'
import { PositionData } from 'entities/trader'
import useGetUsdPrices from 'hooks/helpers/useGetUsdPrices'
import useIsMobile from 'hooks/helpers/useIsMobile'
import { UsdPrices } from 'hooks/store/useUsdPrices'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import Drawer from 'theme/Modal/Drawer'
import { Box, Flex, IconBox, Type } from 'theme/base'
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
  page: number
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
function OpeningPositionsTable({ isLoading, data, page, onClickItem }: OpeningPositionComponentProps) {
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
      scrollToTopDependencies={[page]}
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
      <ListForm {...props} />
    </OpeningPositionsWrapper>
  )
}

function ListForm({ data, isLoading, page, onClickItem }: OpeningPositionComponentProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    wrapperRef.current?.scrollTo(0, 0)
  }, [page])
  return (
    <Flex
      ref={wrapperRef}
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        position: 'relative',
        '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4', '& > *:last-child': { borderBottom: 'none' } },
      }}
    >
      {!isLoading && !data?.length && <NoDataFound message={<Trans>No opening positions</Trans>} />}
      {isLoading && (
        <Flex
          sx={{
            alignItems: 'start',
            justifyContent: 'center',
            bg: 'modalBG1',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        >
          <Box pt={100}>
            <Loading />
          </Box>
        </Flex>
      )}
      {data?.map((position) => {
        return (
          <Box role="button" sx={{ p: 3 }} key={position.id} onClick={() => onClickItem?.(position)}>
            <Flex sx={{ alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Type.Caption color="neutral3" minWidth={30} sx={{ flexShrink: 0 }}>
                <RelativeShortTimeText date={position.openBlockTime} />
              </Type.Caption>
              <Type.Caption color="neutral3">-</Type.Caption>
              <Box>{renderTrader(position.account, position.protocol)}</Box>
              <Type.Caption color="neutral3">-</Type.Caption>
              <Box>{renderEntry(position)}</Box>
            </Flex>
            <Flex mt={3} sx={{ alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
              <Flex sx={{ alignItems: 'center', gap: 3 }}>
                <Box sx={{ width: 200, flexShrink: 0 }}>{renderSizeOpening(position)}</Box>
                <Type.Caption color="neutral3">-</Type.Caption>
                <Box>{renderOpeningPnL(position)}</Box>
              </Flex>
              <IconBox icon={<CaretRight size={16} />} color="neutral3" />
            </Flex>
          </Box>
        )
      })}
    </Flex>
  )
}
