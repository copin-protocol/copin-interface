import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { Suspense, lazy } from 'react'

import Container from 'components/@ui/Container'
import useSearchParams from 'hooks/router/useSearchParams'
import useQuickViewTraderStore from 'hooks/store/useQuickViewTraderStore'
import IconButton from 'theme/Buttons/IconButton'
import RcDrawer from 'theme/RcDrawer'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { Z_INDEX } from 'utils/config/zIndex'

const TraderQuickView = lazy(() => import('components/@trader/TraderDetailsDrawer/TraderQuickView'))

export default function TraderDetailsDrawer({
  zIndex = Z_INDEX.TOASTIFY, // above all
}: {
  zIndex?: number
}) {
  const { trader, resetTrader, disabledActions } = useQuickViewTraderStore()

  const { lg } = useResponsive()
  const { setSearchParams } = useSearchParams()
  const handleDismiss = () => {
    setSearchParams({ [URL_PARAM_KEYS.TRADER_HISTORY_PAGE]: null })
    resetTrader()
  }

  return (
    <RcDrawer
      open={!!trader}
      onClose={(e) => {
        e.stopPropagation()
        handleDismiss()
      }}
      width={lg ? '968px' : '100%'}
      zIndex={zIndex}
    >
      <Container sx={{ position: 'relative', width: '100%', height: '100%' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: '12px', zIndex: 11 }}
          onClick={handleDismiss}
        />
        <Suspense fallback={null}>
          {!!trader && (
            <TraderQuickView
              address={trader.address}
              protocol={trader.protocol}
              type={trader.type}
              eventCategory={trader.eventCategory}
              disabledActions={disabledActions}
            />
          )}
        </Suspense>
      </Container>
    </RcDrawer>
  )
}
