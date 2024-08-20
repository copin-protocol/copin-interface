import { Trans } from '@lingui/macro'
import { ClockCounterClockwise, Trash, UserCircle } from '@phosphor-icons/react'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { deleteCopyWalletApi } from 'apis/copyWalletApis'
import ToastBody from 'components/@ui/ToastBody'
import { CopyWalletData } from 'entities/copyWallet'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import { Flex, IconBox } from 'theme/base'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

import ConfirmDeleteModal from './ConfirmDeleteModal'
import CopyWalletHistoryDrawer from './WalletHistoryDrawer'

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
      <Flex sx={{ alignItems: 'center', gap: 16 }}>
        <IconBox
          as={Link}
          to={`${ROUTES.MY_MANAGEMENT.path}?${URL_PARAM_KEYS.MY_MANAGEMENT_WALLET_ID}=${data.id}`}
          target="_blank"
          icon={<UserCircle size={18} />}
          sx={{ color: 'neutral3', '&:hover': { color: 'neutral2' } }}
        />
        <IconBox
          role="button"
          icon={<ClockCounterClockwise size={18} />}
          onClick={() => setOpenHistoryDrawer(true)}
          sx={{ color: 'neutral3', '&:hover': { color: 'neutral2' } }}
        />
        <IconBox
          role="button"
          icon={<Trash size={18} />}
          onClick={() => setOpenDeleteModal(true)}
          sx={{ color: 'red2', '&:hover': { color: 'red1' } }}
        />
      </Flex>
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
