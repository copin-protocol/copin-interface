import { memo } from 'react'

import useGlobalDialog, { DialogContent } from 'hooks/store/useGlobalDialog'

const GlobalDialog = memo(function GlobalDialogMemo() {
  const dialog = useGlobalDialog((state) => state.dialog)
  return dialog ? <DialogContent data={dialog} /> : <></>
})

export default GlobalDialog
