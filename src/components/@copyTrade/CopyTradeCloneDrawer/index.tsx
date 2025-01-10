import CopyTradeCloneForm from 'components/@copyTrade/CopyTradeCloneForm'
import { CopyTradeData } from 'entities/copyTrade.d'
import Modal from 'theme/Modal'
import { Box } from 'theme/base'

export default function CopyTradeCloneDrawer({
  isOpen,
  onDismiss,
  onSuccess,
  copyTradeData,
}: {
  isOpen: boolean
  onDismiss: () => void
  onSuccess: (trader?: string) => void
  copyTradeData: CopyTradeData | undefined
}) {
  return (
    <Modal
      title="Clone Copytrade Settings"
      minHeight="min(800px,80vh)"
      mode="bottom"
      hasClose
      isOpen={isOpen}
      onDismiss={onDismiss}
      maxWidth="520px"
    >
      <Box sx={{ position: 'relative', maxWidth: '100%', mx: 'auto' }}>
        <CopyTradeCloneForm copyTradeData={copyTradeData} onDismiss={onDismiss} onSuccess={onSuccess} />
      </Box>
    </Modal>
  )
}
