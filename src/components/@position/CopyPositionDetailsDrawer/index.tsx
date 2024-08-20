import { XCircle } from '@phosphor-icons/react'

import Container from 'components/@ui/Container'
import useIsMobile from 'hooks/helpers/useIsMobile'
import IconButton from 'theme/Buttons/IconButton'
import RcDrawer from 'theme/RcDrawer'

import CopyPositionDetails from '../CopyPositionDetails'

export default function CopyPositionDetailsDrawer({
  isOpen,
  onDismiss,
  id,
}: {
  isOpen: boolean
  onDismiss: () => void
  id: string | undefined
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
        <CopyPositionDetails id={id} />
      </Container>
    </RcDrawer>
  )
}
