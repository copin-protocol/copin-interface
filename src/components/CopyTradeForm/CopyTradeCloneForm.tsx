import { Trans } from '@lingui/macro'
import { useMemo } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { duplicateCopyTradeApi } from 'apis/copyTradeApis'
import ToastBody from 'components/@ui/ToastBody'
import { CopyTradeData, UpdateCopyTradeData } from 'entities/copyTrade'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { CopyTradeStatusEnum, ProtocolEnum } from 'utils/config/enums'
import { getErrorMessage } from 'utils/helpers/handleError'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import CopyTraderForm from '.'
import { CopyTradeFormValues } from './configs'
import { getFormValuesFromResponseData, getRequestDataFromForm } from './helpers'

const CopyTradeCloneForm = ({
  duplicateToAddress,
  copyTradeData,
  onDismiss,
  onSuccess,
}: {
  duplicateToAddress?: string
  copyTradeData: CopyTradeData | undefined
  onDismiss: () => void
  onSuccess: (trader: string) => void
}) => {
  const { myProfile } = useMyProfileStore()
  const { mutate: duplicateCopyTrade, isLoading } = useMutation(duplicateCopyTradeApi, {
    onSuccess: (data) => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Clone copy trade has been succeeded</Trans>} />
      )
      onDismiss()
      onSuccess(data.account)
    },
    onError: (err) => {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })

  const defaultFormValues = useMemo(() => {
    const result = getFormValuesFromResponseData(copyTradeData)
    if (duplicateToAddress) result.duplicateToAddress = duplicateToAddress
    return result
  }, [copyTradeData, duplicateToAddress])

  const onSubmit = (formData: CopyTradeFormValues) => {
    const data: UpdateCopyTradeData = {
      ...getRequestDataFromForm(formData),
      status: CopyTradeStatusEnum.RUNNING,
    }
    if (formData.duplicateToAddress) data.account = formData.duplicateToAddress
    if (copyTradeData?.protocol) data.protocol = copyTradeData.protocol
    duplicateCopyTrade({ data, copyTradeId: copyTradeData?.id ?? '' })

    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.COPY_TRADE,
      action: EVENT_ACTIONS[EventCategory.COPY_TRADE].CLONE_COPY_TRADE,
    })
  }
  return (
    <CopyTraderForm
      key={copyTradeData?.account}
      protocol={copyTradeData?.protocol ?? ProtocolEnum.GMX}
      onSubmit={onSubmit}
      isSubmitting={isLoading}
      defaultFormValues={defaultFormValues}
      isEdit={true}
      isClone={true}
      submitButtonText={'Clone Copy Trade'}
    />
  )
}

export default CopyTradeCloneForm
