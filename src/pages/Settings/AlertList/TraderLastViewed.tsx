import { Trans } from '@lingui/macro'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { createTraderAlertApi } from 'apis/alertApis'
import { AccountWithProtocol } from 'components/@ui/AccountWithProtocol'
import ToastBody from 'components/@ui/ToastBody'
import { useClickLoginButton } from 'components/LoginAction'
import useBotAlertContext from 'hooks/features/useBotAlertProvider'
import useTraderLastViewed from 'hooks/store/useTraderLastViewed'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { getErrorMessage } from 'utils/helpers/handleError'

import NoAlertList from './NoAlertList'

export default function TraderLastViewed({ reload }: { reload: () => void }) {
  const { traderLastViewed = [] } = useTraderLastViewed()
  const { botAlert, handleGenerateLinkBot, isLoading, isGeneratingLink } = useBotAlertContext()

  const { isAuthenticated } = useAuthContext()
  const handleClickLogin = useClickLoginButton()

  const { mutate: createTraderAlert, isLoading: submittingCreate } = useMutation(createTraderAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This trader alert has been subscribed successfully</Trans>}
        />
      )
      reload()
    },
    onError: (error: any) => {
      if (error?.message?.includes(`Can't find data`)) {
        handleGenerateLinkBot()
      } else {
        toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
      }
    },
  })

  const onSubmit = (protocol: ProtocolEnum, address: string) => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (!botAlert?.chatId) {
      handleGenerateLinkBot()
      return
    }
    createTraderAlert({ address, protocol })
  }

  return (
    <Flex sx={{ width: '100%', height: '100%', flexDirection: 'column', overflow: 'hidden' }}>
      <NoAlertList />
      {traderLastViewed && traderLastViewed.length > 0 && (
        <Box
          sx={{
            flex: '1 0 0',
            overflow: 'auto',
            bg: 'neutral6',
            borderTop: 'small',
            borderTopColor: 'neutral4',
            px: 3,
            py: 1,
          }}
        >
          <Type.Caption mb={2} color="neutral3">
            <Trans>Recommend</Trans>
          </Type.Caption>
          <Flex
            flex="1"
            flexDirection="column"
            sx={{
              overflow: 'auto',
              '& > *': { borderBottom: 'small', borderBottomColor: 'neutral4' },
              '& > *:last-child': { borderBottom: 'none' },
            }}
          >
            {traderLastViewed.map((data, index) => (
              <Flex
                key={`${index}-${data.protocol}-${data.address}`}
                justifyContent={'space-between'}
                alignItems={'center'}
                py={2}
                sx={{ gap: [3, 4] }}
              >
                <AccountWithProtocol protocol={data.protocol} address={data.address} />
                <Button
                  type="button"
                  variant="ghostPrimary"
                  sx={{ p: 0 }}
                  disabled={isLoading || submittingCreate || isGeneratingLink}
                  onClick={() => onSubmit(data.protocol, data.address)}
                >
                  <Trans>Add Alert</Trans>
                </Button>
              </Flex>
            ))}
          </Flex>
        </Box>
      )}
    </Flex>
  )
}
