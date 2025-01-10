import { ReactNode } from 'react'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import Loading from 'theme/Loading'
import { Box, Flex, Type } from 'theme/base'
import { Z_INDEX } from 'utils/config/zIndex'

interface DialogContentData {
  id?: string
  hasLoading?: boolean
  title?: ReactNode
  description?: ReactNode
  body?: ReactNode
}
interface GlobalDialogState {
  dialog: DialogContentData | undefined
  showDialog: (data: DialogContentData) => void
  hideDialog: () => void
  updateDialog: (data: DialogContentData) => void
}

const useGlobalDialog = create<GlobalDialogState>()(
  immer((set) => ({
    dialog: undefined,
    showDialog: (data: DialogContentData) =>
      set({
        dialog: data,
      }),
    hideDialog: () => set({ dialog: undefined }),
    updateDialog: (data: DialogContentData) =>
      set((state) => {
        state.dialog = { ...state.dialog, ...data }
        return state
      }),
  }))
)

export default useGlobalDialog

export function DialogContent({ data }: { data: DialogContentData }) {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      variant="shadow"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: Z_INDEX.THEME_DROPDOWN,
      }}
    >
      <Box
        variant="card"
        width="fit-content"
        maxWidth="800px"
        height="fit-content"
        textAlign="center"
        sx={{ border: 'normal', borderColor: 'neutral6' }}
      >
        {data.hasLoading && <Loading />}
        <Type.BodyBold display="block" mb={2}>
          {data.title}
        </Type.BodyBold>
        {!!data.description && <Type.Caption color="neutral3">{data.description}</Type.Caption>}
        <Box>{data.body}</Box>
      </Box>
    </Flex>
  )
}
