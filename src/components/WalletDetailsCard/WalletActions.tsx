import { Trans } from '@lingui/macro'
import { ClockCounterClockwise, DotsThreeOutlineVertical, Trash } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { deleteCopyWalletApi } from 'apis/copyWalletApis'
import Divider from 'components/@ui/Divider'
import ToastBody from 'components/@ui/ToastBody'
import CopyWalletHistoryDrawer from 'components/CopyWalletHistoryDrawer'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import ActionItem from 'pages/MyProfile/MyCopies/ActionItem'
import IconButton from 'theme/Buttons/IconButton'
import Dropdown from 'theme/Dropdown'
import { Type } from 'theme/base'
import { themeColors } from 'theme/colors'

import ConfirmDeleteModal from './ConfirmDeleteModal'

const WalletActions = ({ data }: { data: CopyWalletData }) => {
  const { reloadCopyWallets } = useCopyWalletContext()
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false)

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
          width: 150,
        }}
        menu={
          <>
            <ActionItem
              title={<Trans>History</Trans>}
              icon={<ClockCounterClockwise size={18} />}
              onSelect={() => setOpenHistoryDrawer(true)}
            />
            <Divider />
            {!data.smartWalletAddress && (
              <ActionItem
                title={
                  <Type.Caption color="red2">
                    <Trans>Delete Wallet</Trans>
                  </Type.Caption>
                }
                icon={<Trash size={18} color={themeColors.red2} />}
                onSelect={() => setOpenDeleteModal(true)}
              />
            )}
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
      {openHistoryDrawer && (
        <CopyWalletHistoryDrawer
          copyWallet={data}
          onDismiss={() => setOpenHistoryDrawer(false)}
          isOpen={openHistoryDrawer}
        />
      )}
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

export default WalletActions
