import { CaretRight, Pulse, XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import emptyBg from 'assets/images/opening_empty_bg.png'
import Container from 'components/@ui/Container'
import { RelativeShortTimeText } from 'components/@ui/DecoratedText/TimeText'
import SectionTitle from 'components/@ui/SectionTitle'
import Table from 'components/@ui/Table'
import { renderEntry, renderOpeningPnLWithPrices, renderSizeOpening } from 'components/@ui/Table/renderProps'
import { ColumnData } from 'components/@ui/Table/types'
import PositionDetails from 'components/PositionDetails'
import { PositionData } from 'entities/trader'
import useIsMobile from 'hooks/helpers/useIsMobile'
import { UsdPrices, useRealtimeUsdPricesStore } from 'hooks/store/useUsdPrices'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import Drawer from 'theme/Modal/Drawer'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { generatePositionDetailsRoute } from 'utils/helpers/generateRoute'

const emptyCss = {
  backgroundImage: `url(${emptyBg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
}

export default function OpeningPositionTable({
  data,
  isLoading,
  protocol,
}: {
  data: PositionData[] | undefined
  isLoading: boolean
  protocol: ProtocolEnum
}) {
  const { prices } = useRealtimeUsdPricesStore()
  const isMobile = useIsMobile()
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()
  const tableData = useMemo(() => {
    if (!data) return undefined
    let openingPositions = data
    openingPositions = openingPositions.sort((x, y) =>
      x.openBlockTime < y.openBlockTime ? 1 : x.openBlockTime > y.openBlockTime ? -1 : 0
    )

    return {
      data: openingPositions,
      meta: { limit: openingPositions.length, offset: 0, total: openingPositions.length, totalPages: 1 },
    }
  }, [data])

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

  const { lg } = useResponsive()

  return (
    <Box
      display={['block', 'block', 'block', 'flex']}
      flexDirection="column"
      height="100%"
      sx={{
        backgroundColor: data?.length ? 'neutral5' : 'neutral7',
        ...(data?.length || isLoading ? {} : emptyCss),
        pb: 12,
      }}
    >
      <Box px={12} pt={12}>
        <SectionTitle icon={<Pulse size={24} />} title="Opening Positions" />
      </Box>
      {isLoading && <Loading />}
      {!data?.length && !isLoading && (
        <Flex p={3} flexDirection="column" width="100%" height={180} justifyContent="center" alignItems="center">
          <Type.CaptionBold display="block">This trader’s opening position is empty</Type.CaptionBold>
          <Type.Caption mt={1} color="neutral3" display="block">
            Once the trader starts a new position, you’ll see it listed here
          </Type.Caption>
        </Flex>
      )}
      {data && data.length > 0 && (
        <Box flex="1" overflowX="auto" overflowY="hidden">
          <Table
            restrictHeight={lg}
            wrapperSx={{
              minWidth: 500,
            }}
            data={tableData?.data}
            columns={columns}
            externalSource={externalSource}
            isLoading={isLoading}
            onClickRow={handleSelectItem}
            renderRowBackground={() => 'rgb(31, 34, 50)'}
          />
        </Box>
      )}

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
          {!!currentPosition && <PositionDetails protocol={protocol} id={currentPosition.id} isShow={openDrawer} />}
        </Container>
      </Drawer>
    </Box>
  )
}

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
