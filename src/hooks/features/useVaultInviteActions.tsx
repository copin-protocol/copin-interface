import React from 'react'
import { toast } from 'react-toastify'

import ToastBody from 'components/@ui/ToastBody'
import useMyProfile from 'hooks/store/useMyProfile'
import useVaultInviteCode from 'hooks/store/useVaultInviteCode'

export default function useVaultInviteActions({ onSuccess }: { onSuccess?: () => void }) {
  const { myProfile } = useMyProfile()
  const { currentInviteCode, vaultInviteCode, saveVaultInviteCode } = useVaultInviteCode()

  const addInvite = (code?: string) => {
    if (!code || code !== currentInviteCode) {
      toast.error(<ToastBody title="Error" message="Invalid Invite Code" />)
      return
    }
    if (!!myProfile?.username && vaultInviteCode[myProfile.username] !== currentInviteCode) {
      saveVaultInviteCode(myProfile.username)

      onSuccess?.()
    }
  }

  return { addInvite }
}
