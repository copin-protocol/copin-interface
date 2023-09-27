import CopyTradeCloneForm from 'components/CopyTradeForm/CopyTradeCloneForm'
import { CopyTradeData } from 'entities/copyTrade.d'
import Drawer from 'theme/Modal/Drawer'
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
    <Drawer
      title="Clone Copytrade Settings"
      size="min(800px,80vh)"
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
        <CopyTradeCloneForm copyTradeData={copyTradeData} onDismiss={onDismiss} onSuccess={onSuccess} />
      </Box>
    </Drawer>
  )
}
