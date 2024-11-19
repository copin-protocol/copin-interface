import { XCircle } from '@phosphor-icons/react'
import { Suspense, lazy } from 'react'

import Container from 'components/@ui/Container'
import useIsMobile from 'hooks/helpers/useIsMobile'
import useSearchParams from 'hooks/router/useSearchParams'
import IconButton from 'theme/Buttons/IconButton'
import RcDrawer from 'theme/RcDrawer'
import { ProtocolEnum, TimeFrameEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'

const TraderQuickView = lazy(() => import('components/@trader/TraderDetailsDrawer/TraderQuickView'))

export default function TraderDetailsDrawer({
  onDismiss,
  protocol,
  address,
  type,
}: {
  onDismiss: () => void
  protocol: ProtocolEnum
  address: string
  type?: TimeFrameEnum
}) {
  const isMobile = useIsMobile()
  const { setSearchParams } = useSearchParams()
  const handleDismiss = () => {
    setSearchParams({ [URL_PARAM_KEYS.TRADER_HISTORY_PAGE]: null })
    onDismiss()
  }

  return (
    <RcDrawer open onClose={handleDismiss} width={isMobile ? '100%' : '1024px'}>
      <Container sx={{ position: 'relative', width: '100%', height: '100%', bg: 'neutral7' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: protocol === ProtocolEnum.HYPERLIQUID ? 4 : '12px', zIndex: 11 }}
          onClick={handleDismiss}
        />
        <Suspense fallback={null}>
          <TraderQuickView address={address} protocol={protocol} type={type} />
        </Suspense>
      </Container>
    </RcDrawer>
  )
}
