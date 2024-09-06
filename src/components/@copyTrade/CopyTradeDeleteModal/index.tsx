import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { deleteCopyTradeApi, preDeleteCopyTradeApi } from 'apis/copyTradeApis'
import ToastBody from 'components/@ui/ToastBody'
import useTraderCopying from 'hooks/store/useTraderCopying'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import Modal from 'theme/Modal'
import { Box, Flex, Li, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'

export default function DeleteCopyTradeModal({
  copyTradeId = '',
  account,
  protocol,
  onSuccess,
  onDismiss,
}: {
  copyTradeId: string | undefined
  account: string | undefined
  protocol: ProtocolEnum | undefined
  onSuccess: () => void
  onDismiss: () => void
}) {
  const { removeTraderCopying } = useTraderCopying(account, protocol)
  const { data: preDeleteData, isLoading: preDeleting } = useQuery(
    [QUERY_KEYS.GET_PRE_DELETE_DATA, copyTradeId],
    () => preDeleteCopyTradeApi({ copyTradeId }),
    {
      enabled: !!copyTradeId,
    }
  )
  const { mutate: deleteCopyTrade } = useMutation(() => deleteCopyTradeApi({ copyTradeId }), {
    onSuccess() {
      if (account && protocol) {
        removeTraderCopying(account, protocol, copyTradeId)
      }
      onSuccess()
      onDismiss()
    },
    onError() {
      onDismiss()
      toast.error(<ToastBody title="Error" message="Something went wrong. Please try later." />)
    },
  })

  if (!copyTradeId) return <></>
  const { totalOpeningPositions = 0 } = preDeleteData ?? {}
  return (
    <>
      <Modal isOpen onDismiss={onDismiss} maxWidth="430px">
        <Box p={24}>
          {preDeleting ? (
            <Loading />
          ) : (
            <>
              <Type.BodyBold mb={12} textAlign="center" display="block">
                Are you sure you want to delete this copy setting?
              </Type.BodyBold>
              {totalOpeningPositions > 0 ? (
                <>
                  <Type.Caption mb={2}>
                    <Li>
                      You have{' '}
                      <Box as="span" color="primary1">
                        {totalOpeningPositions} opening positions.
                      </Box>
                    </Li>
                  </Type.Caption>
                  <Type.Caption>
                    <Li>
                      This copy setting will be removed from your copy list, and you need to handle these positions
                      yourself.
                    </Li>
                  </Type.Caption>
                </>
              ) : (
                <>
                  <Type.Body textAlign="center" display="block">
                    This copy setting will be removed from your copy list.
                  </Type.Body>
                </>
              )}

              <Flex mt={24} sx={{ gap: 3 }}>
                <Button variant="outlineDanger" onClick={() => deleteCopyTrade()} sx={{ flex: 1 }}>
                  Confirm
                </Button>
                <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }}>
                  Cancel
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </Modal>
    </>
  )
}
