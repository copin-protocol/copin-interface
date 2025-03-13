import { ReactNode, useState } from 'react'

import { useSelectCopyTrade } from 'hooks/features/copyTrade/useSelectCopyTrade'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import Modal from 'theme/Modal'
import { DrawerTitle } from 'theme/RcDrawer'
import { Box, Flex, Type } from 'theme/base'
import { Z_INDEX } from 'utils/config/zIndex'

import { postUpdateRefreshQueries } from '../configs'
import CloneContent from './CloneContent'
import DeleteContent from './DeleteContent'
import EditContent from './EditContent'

export type BulkCopyModifyModalType = null | 'edit' | 'clone' | 'delete'

export default function BulkCopyModifyModal({
  type,
  isOpen,
  onDismiss,
  isDcp,
}: {
  isDcp?: boolean
  type: BulkCopyModifyModalType
  isOpen: boolean
  onDismiss: () => void
}) {
  const [hasClose, setHasClose] = useState(true)
  const { setPrevListCopyTrade, toggleSelectAll } = useSelectCopyTrade()
  const refetchQueries = useRefetchQueries()
  const onSuccess = () => {
    refetchQueries(postUpdateRefreshQueries)
    setHasClose(false)
  }
  const handleDismiss = () => {
    setHasClose(true)
    onDismiss()
    setPrevListCopyTrade([])
    toggleSelectAll(false)
  }
  return (
    <Modal isOpen={isOpen} zIndex={Z_INDEX.TOASTIFY} onDismiss={onDismiss}>
      {!!type && (
        <>
          <Box p={3}>
            <DrawerTitle
              title={
                <Flex sx={{ alignItems: 'center', gap: 3 }}>
                  <Type.Head display="flex" sx={{ alignItems: 'center', gap: '1ch' }}>
                    {TITLE_MAPPING[type]}
                  </Type.Head>
                </Flex>
              }
              onClose={hasClose ? onDismiss : undefined}
            />
          </Box>
          {type === 'edit' && <EditContent onDismiss={handleDismiss} onSuccess={onSuccess} isDcp={isDcp} />}
          {type === 'delete' && <DeleteContent onSuccess={onSuccess} onDismiss={handleDismiss} />}
          {type === 'clone' && <CloneContent onSuccess={onSuccess} onDismiss={handleDismiss} />}
        </>
      )}
    </Modal>
  )
}

const TITLE_MAPPING: Record<NonNullable<BulkCopyModifyModalType>, ReactNode> = {
  edit: 'Edit Multiple Copies',
  clone: 'Clone Multiple Copies',
  delete: 'Delete Multiple Copies',
}
