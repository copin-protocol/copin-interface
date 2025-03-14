import { useSelectCopyTrade } from 'hooks/features/copyTrade/useSelectCopyTrade'
import { useBulkUpdateCopyTrade } from 'hooks/features/copyTrade/useUpdateCopyTrade'
import { BulkUpdateActionEnum } from 'utils/config/enums'

import CopyTraderForm from '../CopyTradeForm'
import { defaultBulkUpdateFormValues } from '../configs'
import { getRequestDataBulkUpdate } from '../helpers'
import { CopyTradeFormValues } from '../types'
import ResponseContent from './ResponseContent'

export default function EditContent({
  onDismiss,
  onSuccess,
  isDcp,
}: {
  onDismiss: () => void
  onSuccess: () => void
  isDcp?: boolean
}) {
  const { listCopyTrade } = useSelectCopyTrade()
  const { mutate, data, isSuccess, isLoading } = useBulkUpdateCopyTrade()

  const onSubmit = (formData: CopyTradeFormValues) => {
    const data = getRequestDataBulkUpdate(formData)
    mutate(
      { copyTradeIds: listCopyTrade.map((v) => v.id), action: BulkUpdateActionEnum.UPDATE, update: data },
      { onSuccess }
    )
    // updateCopyTrade({ data, copyTradeId: '' })
  }
  if (isSuccess) {
    return <ResponseContent onComplete={onDismiss} responseData={data} />
  }
  return (
    <CopyTraderForm
      onSubmit={onSubmit}
      isSubmitting={isLoading}
      submitButtonText={'Update Copy Trade'}
      defaultFormValues={defaultBulkUpdateFormValues}
      formTypes={isDcp ? ['bulkEdit', 'dcp'] : ['bulkEdit']}
    />
  )
}
