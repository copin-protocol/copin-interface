import { CopyTradeData } from 'entities/copyTrade'
import { CopyTradeModalConfigs } from 'hooks/features/useCopyTradeModalConfigs'

import ConfirmStopModal from '../ConfirmStopModal'
import CopyTradeCloneDrawer from '../CopyTradeCloneDrawer'
import DeleteCopyTradeModal from '../CopyTradeDeleteModal'
import CopyTradeEditDrawer from '../CopyTradeEditDrawer'
import CopyTradeHistoryDrawer from '../CopyTradeHistoryDrawer'

export default function CopyTradeModals({
  handleConfirmStop,
  currentCopyTrade,
  onCloneCopyTradeSuccess,
  isUpdatingCopyTrade,
  openingModal,
  handleCloseModal,
}: CopyTradeModalConfigs & {
  onCloneCopyTradeSuccess: (data?: CopyTradeData) => void
  isUpdatingCopyTrade: boolean
}) {
  return (
    <>
      <CopyTradeEditDrawer
        isOpen={openingModal === 'edit'}
        onDismiss={handleCloseModal}
        copyTradeData={currentCopyTrade}
        onSuccess={handleCloseModal}
      />
      {openingModal === 'history' && (
        <CopyTradeHistoryDrawer isOpen onDismiss={handleCloseModal} copyTradeData={currentCopyTrade} />
      )}
      {openingModal === 'clone' && (
        <CopyTradeCloneDrawer
          isOpen
          onDismiss={handleCloseModal}
          copyTradeData={currentCopyTrade}
          onSuccess={onCloneCopyTradeSuccess}
        />
      )}
      {openingModal === 'delete' && (
        <DeleteCopyTradeModal
          copyTradeId={currentCopyTrade?.id}
          account={currentCopyTrade?.account}
          protocol={currentCopyTrade?.protocol}
          onDismiss={handleCloseModal}
        />
      )}
      {openingModal === 'stop' && (
        <ConfirmStopModal
          isOpen
          onConfirm={handleConfirmStop}
          onDismiss={handleCloseModal}
          isConfirming={isUpdatingCopyTrade}
        />
      )}
    </>
  )
}
