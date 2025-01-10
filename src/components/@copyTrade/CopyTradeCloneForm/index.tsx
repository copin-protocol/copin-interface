import { Trans } from '@lingui/macro'
import { useMemo } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { duplicateCopyTradeApi } from 'apis/copyTradeApis'
import ToastBody from 'components/@ui/ToastBody'
import { CopyTradeData, UpdateCopyTradeData } from 'entities/copyTrade'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { CopyTradeStatusEnum, CopyTradeTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getErrorMessage } from 'utils/helpers/handleError'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import CopyTraderForm from '../CopyTradeForm'
import { getFormValuesFromResponseData, getRequestDataFromForm } from '../helpers'
import { CopyTradeFormValues } from '../types'

type CloneTraderProps = {
  isVault?: boolean
  copyTradeData: CopyTradeData | undefined
  onDismiss: () => void
  onSuccess: (trader: string) => void
}
type DedicatedTraderProps = {
  duplicateToAddress: string
  protocol: ProtocolEnum
}
type CopyTradeCloneFormComponent = {
  (props: CloneTraderProps): JSX.Element
  (props: DedicatedTraderProps & CloneTraderProps): JSX.Element
}

const CopyTradeCloneForm: CopyTradeCloneFormComponent = ({
  duplicateToAddress,
  protocol,
  copyTradeData,
  isVault,
  onDismiss,
  onSuccess,
}: CloneTraderProps & Partial<DedicatedTraderProps>) => {
  const { myProfile } = useMyProfileStore()
  const refetchQueries = useRefetchQueries()
  const { mutate: duplicateCopyTrade, isLoading } = useMutation(duplicateCopyTradeApi, {
    onSuccess: (data) => {
      refetchQueries([QUERY_KEYS.GET_TRADER_VOLUME_COPY])
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
    if (protocol) result.protocol = protocol
    result.title = ''
    result.tokenAddresses = []
    return result
  }, [copyTradeData, duplicateToAddress, protocol])

  const onSubmit = (formData: CopyTradeFormValues) => {
    const data: UpdateCopyTradeData = {
      ...getRequestDataFromForm(formData),
      status: CopyTradeStatusEnum.RUNNING,
      type: isVault ? CopyTradeTypeEnum.COPIN_VAULT : CopyTradeTypeEnum.COPY_TRADER,
    }
    if (formData.duplicateToAddress) data.account = formData.duplicateToAddress
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
      onSubmit={onSubmit}
      isSubmitting={isLoading}
      submitButtonText={'Clone Copy Trade'}
      defaultFormValues={defaultFormValues}
      formTypes={['clone', 'vault']}
    />
  )
}

export default CopyTradeCloneForm
