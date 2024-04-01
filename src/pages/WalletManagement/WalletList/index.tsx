import { Trans } from '@lingui/macro'
import { Wallet } from '@phosphor-icons/react'
import React from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { updateCopyWalletApi } from 'apis/copyWalletApis'
import NoDataFound from 'components/@ui/NoDataFound'
import SectionTitle from 'components/@ui/SectionTitle'
import ToastBody from 'components/@ui/ToastBody'
import WalletDetailsCard from 'components/WalletDetailsCard'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import Loading from 'theme/Loading'
import { Box, Flex } from 'theme/base'

export default function WalletList() {
  const { copyWallets, loadingCopyWallets, reloadCopyWallets } = useCopyWalletContext()

  const updateCopyWallet = useMutation(updateCopyWalletApi, {
    onSuccess: () => {
      reloadCopyWallets()
    },
    onError: (error: any) => {
      toast.error(<ToastBody title={<Trans>{error.name}</Trans>} message={<Trans>{error.message}</Trans>} />)
    },
  })

  const handleUpdate = ({
    copyWalletId,
    name,
    previousValue,
    callback,
  }: {
    copyWalletId: string
    name: string
    previousValue: string
    callback: (value: string) => void
  }) => {
    if (!copyWalletId || !name) return
    updateCopyWallet.mutate(
      { copyWalletId, data: { name } },
      {
        onSuccess: () => {
          callback(name)
        },
        onError: () => {
          callback(previousValue)
        },
      }
    )
  }

  return (
    <Flex flexDirection="column" height="100%">
      <Box sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
        <SectionTitle
          icon={<Wallet size={24} />}
          title={<Trans>Your Wallet List</Trans>}
          sx={{ px: 3, pt: 3, pb: 1 }}
        />
      </Box>
      {loadingCopyWallets && <Loading />}
      {!loadingCopyWallets && (!copyWallets || copyWallets.length === 0) && (
        <NoDataFound message={<Trans>You don’t have any wallet. Please create a wallet</Trans>} />
      )}
      <Flex flexDirection="column" sx={{ overflowY: 'auto' }}>
        {copyWallets &&
          copyWallets.length > 0 &&
          copyWallets.map((wallet) => {
            return (
              <WalletDetailsCard
                key={wallet.id}
                data={wallet}
                hasBorderTop={false}
                handleUpdate={handleUpdate}
                reload={reloadCopyWallets}
              />
            )
          })}
      </Flex>
    </Flex>
  )
}
