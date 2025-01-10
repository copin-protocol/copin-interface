import { XCircle } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import Container from 'components/@ui/Container'
import IconButton from 'theme/Buttons/IconButton'
import RcDrawer from 'theme/RcDrawer'

import CopyPositionDetails from '../CopyPositionDetails'

export default function CopyPositionDetailsDrawer({
  isOpen,
  onDismiss,
  id,
  copyTradeId,
}: {
  isOpen: boolean
  onDismiss: () => void
  id: string | undefined
  copyTradeId: string | undefined
}) {
  const { lg } = useResponsive()
  return (
    <RcDrawer open={isOpen} onClose={onDismiss} width={lg ? '60%' : '100%'}>
      <Container sx={{ position: 'relative', width: '100%', height: '100%', overflow: 'auto' }}>
        <IconButton
          icon={<XCircle size={24} />}
          variant="ghost"
          sx={{ position: 'absolute', right: 1, top: '12px', zIndex: 1 }}
          onClick={onDismiss}
        />
        <CopyPositionDetails key={isOpen.toString()} id={id} copyTradeId={copyTradeId} />
      </Container>
    </RcDrawer>
  )
}
