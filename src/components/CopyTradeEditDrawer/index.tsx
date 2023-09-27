import CopyTradeEditForm from 'components/CopyTradeForm/CopyTradeEditForm'
import { CopyTradeData } from 'entities/copyTrade.d'
import Drawer from 'theme/Modal/Drawer'
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
    <Drawer
      title="Edit Copytrade Settings"
      size="min(900px,90vh)"
      mode="bottom"
      background="neutral5"
      hasClose
      // zIndex={105}
      // direction="bottom"
      isOpen={isOpen}
      onDismiss={onDismiss}
      headSx={{
        maxWidth: '100%',
        width: 1000,
        mx: 'auto',
        px: 3,
      }}
    >
      <Box sx={{ position: 'relative', maxWidth: 1000, mx: 'auto' }}>
        <CopyTradeEditForm copyTradeData={copyTradeData} onDismiss={onDismiss} onSuccess={onSuccess} />
      </Box>
    </Drawer>
  )
}
