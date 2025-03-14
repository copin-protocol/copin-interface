import { Trans } from '@lingui/macro'

import { useSelectCopyTrade } from 'hooks/features/copyTrade/useSelectCopyTrade'
import { useBulkUpdateCopyTrade } from 'hooks/features/copyTrade/useUpdateCopyTrade'
import { Button } from 'theme/Buttons'
import { Box } from 'theme/base'
import { BulkUpdateActionEnum } from 'utils/config/enums'

import ListSelectedCopyTrade from './ListSelectedCopyTrade'
import ResponseContent from './ResponseContent'

export default function DeleteContent({ onDismiss, onSuccess }: { onSuccess: () => void; onDismiss: () => void }) {
  const { mutate, isLoading, data, isSuccess } = useBulkUpdateCopyTrade()
  const { listCopyTrade } = useSelectCopyTrade()
  const handleConfirmDelete = () => {
    mutate({ copyTradeIds: listCopyTrade.map((v) => v.id), action: BulkUpdateActionEnum.DELETE }, { onSuccess })
  }
  if (isSuccess) {
    return <ResponseContent onComplete={onDismiss} responseData={data} />
  }
  return (
    <Box px={1} pb={3}>
      <ListSelectedCopyTrade onDismiss={onDismiss} />
      <Box px={3} mt={24}>
        <Button variant="primary" block onClick={handleConfirmDelete} disabled={isLoading} isLoading={isLoading}>
          <Trans>Confirm</Trans>
        </Button>
      </Box>
    </Box>
  )
}
