import { XCircle } from '@phosphor-icons/react'
import { Suspense, lazy } from 'react'

import Container from 'components/@ui/Container'
import { HlOrderData } from 'entities/hyperliquid'
import { PositionData } from 'entities/trader'
import useIsMobile from 'hooks/helpers/useIsMobile'
import IconButton from 'theme/Buttons/IconButton'
import RcDrawer from 'theme/RcDrawer'
import { Z_INDEX } from 'utils/config/zIndex'

const HLTraderPositionDetails = lazy(() => import('components/@position/HLTraderPositionDetails'))

export default function HLPositionDetailsDrawer({
  isOpen,
  onDismiss,
  data,
  orders,
}: {
  isOpen: boolean
  onDismiss: () => void
  data: PositionData
  orders: HlOrderData[]
}) {
  const isMobile = useIsMobile()
  return (
    <RcDrawer open={isOpen} onClose={onDismiss} width={isMobile ? '100%' : '60%'} zIndex={Z_INDEX.TOASTIFY + 1}>
      <Container sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: 3, zIndex: 1 }}
          onClick={onDismiss}
        />
        <Suspense fallback={null}>{isOpen && <HLTraderPositionDetails data={data} orders={orders} />}</Suspense>
      </Container>
    </RcDrawer>
  )
}
