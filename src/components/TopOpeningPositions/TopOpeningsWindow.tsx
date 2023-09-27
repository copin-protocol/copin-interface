import { XCircle } from '@phosphor-icons/react'
import { useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { useHistory } from 'react-router-dom'

import { ApiListResponse } from 'apis/api'
import Container from 'components/@ui/Container'
import Table from 'components/@ui/Table'
import PositionDetails from 'components/PositionDetails'
import { columns } from 'components/Tables/OpeningPositionTable'
import { PositionData } from 'entities/trader'
import useIsMobile from 'hooks/helpers/useIsMobile'
import useUsdPricesStore from 'hooks/store/useUsdPrices'
import IconButton from 'theme/Buttons/IconButton'
import Drawer from 'theme/Modal/Drawer'
import { generateOpeningPositionRoute } from 'utils/helpers/generateRoute'

import { ExternalSource } from './ColumnsData'

export default function TopOpeningsWindow({
  isLoading,
  topOpeningData,
}: {
  isLoading: boolean
  topOpeningData?: ApiListResponse<PositionData>
}) {
  const { prices } = useUsdPricesStore()
  const isMobile = useIsMobile()
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [currentPosition, setCurrentPosition] = useState<PositionData | undefined>()

  const handleSelectItem = (data: PositionData) => {
    setCurrentPosition(data)
    setOpenDrawer(true)
    window.history.replaceState(null, '', generateOpeningPositionRoute(data))
  }

  const handleDismiss = () => {
    window.history.replaceState({}, '', `${history.location.pathname}${history.location.search}`)
    setOpenDrawer(false)
  }

  const externalSource: ExternalSource = {
    prices,
  }

  return (
    <>
      <Table
        restrictHeight
        wrapperSx={{
          minWidth: 500,
        }}
        data={topOpeningData?.data}
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
            <PositionDetails
              protocol={currentPosition.protocol}
              account={currentPosition.account}
              indexToken={currentPosition.indexToken}
              dataKey={currentPosition.key}
              isShow={openDrawer}
            />
          )}
        </Container>
      </Drawer>
    </>
  )
}
