import CopyTradeEditForm from 'components/@copyTrade/CopyTradeEditForm'
import { CopyTradeData } from 'entities/copyTrade.d'
import Modal from 'theme/Modal'
import { Box } from 'theme/base'

export default function CopyTradeEditDrawer({
  isOpen,
  onDismiss,
  onSuccess,
  copyTradeData,
}: {
  isOpen: boolean
  onDismiss: () => void
  onSuccess: () => void
  copyTradeData: CopyTradeData | undefined
}) {
  return (
    <Modal
      title="Edit Copytrade Settings"
      minHeight="min(900px,90vh)"
      maxWidth="520px"
      mode="bottom"
      background="neutral5"
      hasClose
      // zIndex={105}
      // direction="bottom"
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <Box sx={{ position: 'relative', width: '100%', mx: 'auto' }}>
        <CopyTradeEditForm copyTradeData={copyTradeData} onDismiss={onDismiss} onSuccess={onSuccess} />
      </Box>
    </Modal>
  )
}
