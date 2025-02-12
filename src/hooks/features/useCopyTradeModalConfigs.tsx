import { useCallback, useRef, useState } from 'react'

import { CopyTradeModalType, CopyTradeWithCheckingData } from 'components/@copyTrade/types'
import { CopyTradeData } from 'entities/copyTrade'

export default function useCopyTradeModalConfigs({
  toggleStatus,
}: {
  toggleStatus: (data: CopyTradeData, onSuccess?: (data: CopyTradeData) => void) => void
}) {
  const [openingModal, setModal] = useState<CopyTradeModalType | null>(null)
  const copyTradeData = useRef<CopyTradeWithCheckingData>()

  const handleOpenModal = useCallback(
    ({ data, modalType }: { data: CopyTradeWithCheckingData; modalType: CopyTradeModalType }) => {
      copyTradeData.current = data
      setModal(modalType)
    },
    []
  )
  const handleCloseModal = useCallback(() => {
    copyTradeData.current = undefined
    setModal(null)
  }, [])

  const handleConfirmStop = useCallback(() => {
    if (!copyTradeData.current) {
      console.debug('cannot select copy trade')
      return
    }
    toggleStatus(copyTradeData.current, () => handleCloseModal())
  }, [handleCloseModal, toggleStatus])

  return {
    currentCopyTrade: copyTradeData.current,
    handleConfirmStop,
    openingModal,
    handleOpenModal,
    handleCloseModal,
  }
}

export type CopyTradeModalConfigs = ReturnType<typeof useCopyTradeModalConfigs>
