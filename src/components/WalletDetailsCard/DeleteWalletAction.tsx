import { Trans } from '@lingui/macro'
import { DotsThreeOutlineVertical } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { deleteCopyWalletApi } from 'apis/copyWalletApis'
import ToastBody from 'components/@ui/ToastBody'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Type } from 'theme/base'

import ConfirmDeleteModal from './ConfirmDeleteModal'

const DeleteWalletAction = ({ data }: { data: CopyWalletData }) => {
  const { reloadCopyWallets } = useCopyWalletContext()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const deleteWallet = useMutation(deleteCopyWalletApi, {
    onSuccess: () => {
      toast.success(<ToastBody title={<Trans>Success</Trans>} message={<Trans>Delete wallet successful!</Trans>} />)
      reloadCopyWallets()
      setOpenDeleteModal(false)
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const handleDelete = () => {
    deleteWallet.mutate({ copyWalletId: data.id })
  }

  return (
    <>
      <Dropdown
        hasArrow={false}
        menuSx={{
          bg: 'neutral7',
          minWidth: 'fit-content',
        }}
        menu={
          <>
            <DropdownItem onClick={() => setOpenDeleteModal(true)}>
              <Type.Caption color="red2">
                <Trans>Delete Wallet</Trans>
              </Type.Caption>
            </DropdownItem>
          </>
        }
        sx={{}}
        buttonSx={{
          border: 'none',
          height: '100%',
          p: 0,
        }}
        placement="topRight"
      >
        <IconButton
          size={24}
          type="button"
          icon={<DotsThreeOutlineVertical size={16} weight="fill" />}
          variant="ghost"
          sx={{
            color: 'neutral3',
          }}
        />
      </Dropdown>
      {openDeleteModal && (
        <ConfirmDeleteModal
          data={data}
          onDismiss={() => setOpenDeleteModal(false)}
          onConfirm={handleDelete}
          isConfirming={deleteWallet.isLoading}
        />
      )}
    </>
  )
}

export default DeleteWalletAction
