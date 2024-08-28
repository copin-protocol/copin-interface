import { XCircle } from '@phosphor-icons/react'
import { Suspense, lazy } from 'react'

import Container from 'components/@ui/Container'
import useIsMobile from 'hooks/helpers/useIsMobile'
import IconButton from 'theme/Buttons/IconButton'
import RcDrawer from 'theme/RcDrawer'
import { ProtocolEnum } from 'utils/config/enums'

const TraderPositionDetails = lazy(() => import('components/@position/TraderPositionDetails'))

export default function TraderPositionDetailsDrawer({
  isOpen,
  onDismiss,
  protocol,
  id,
  chartProfitId,
}: {
  isOpen: boolean
  onDismiss: () => void
  protocol: ProtocolEnum | undefined
  id: string | undefined
  chartProfitId: string
}) {
  const isMobile = useIsMobile()
  return (
    <RcDrawer open={isOpen} onClose={onDismiss} width={isMobile ? '100%' : '60%'}>
      <Container sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto', bg: 'neutral6' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: 3, zIndex: 1 }}
          onClick={onDismiss}
        />
        <Suspense fallback={null}>
          {isOpen && <TraderPositionDetails protocol={protocol} id={id} chartProfitId={chartProfitId} />}
        </Suspense>
      </Container>
    </RcDrawer>
  )
}
