import { Trans } from '@lingui/macro'
import { ArrowLeft } from '@phosphor-icons/react'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { getCopyTradeSettingsApi, requestCopyTradeApi } from 'apis/copyTradeApis'
import ToastBody from 'components/@ui/ToastBody'
import CopyTraderForm from 'components/CopyTradeForm'
import CopyTradeCloneForm from 'components/CopyTradeForm/CopyTradeCloneForm'
import { defaultCopyTradeFormValues } from 'components/CopyTradeForm/configs'
import { CopyTradeFormValues } from 'components/CopyTradeForm/configs'
import { getRequestDataFromForm } from 'components/CopyTradeForm/helpers'
import { CopyTradeData, RequestCopyTradeData } from 'entities/copyTrade.d'
import useMyProfileStore from 'hooks/store/useMyProfile'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { CopyTradeTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getErrorMessage } from 'utils/helpers/handleError'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import CopyTradeDataTable from './CopyTradeDataTable'

enum TabKeyEnum {
  Clone = 'Clone',
  New = 'New',
}

export default function CopyTraderDrawer({
  protocol,
  account,
  isOpen,
  onClose,
}: {
  protocol: ProtocolEnum
  account: string
  isOpen: boolean
  onClose: () => void
}) {
  const { myProfile } = useMyProfileStore()
  const [tab, handleTab] = useState<string>(TabKeyEnum.New)
  const [copyTradeData, setCopyTradeData] = useState<CopyTradeData | null>()
  const { data: copies, isLoading: loadingCopies } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_SETTINGS],
    () =>
      getCopyTradeSettingsApi({
        limit: 100,
        offset: 0,
      }),
    { enabled: !!myProfile, retry: 0, keepPreviousData: true }
  )
  const { mutate: requestCopyTrade, isLoading } = useMutation(requestCopyTradeApi, {
    onSuccess: async () => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Make copy trade has been succeeded</Trans>} />
      )
      onClose()
    },
    onError: (err) => {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })

  const onSubmit = (formData: CopyTradeFormValues) => {
    const data: RequestCopyTradeData = {
      ...getRequestDataFromForm(formData),
      account,
      protocol,
      type: CopyTradeTypeEnum.FULL_ORDER,
    }
    requestCopyTrade({ data })

    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.COPY_TRADE,
      action: EVENT_ACTIONS[EventCategory.COPY_TRADE].REQUEST_COPY_TRADE,
    })
  }
  const isNewTab = tab === TabKeyEnum.New
  const isCloneTab = tab === TabKeyEnum.Clone
  const isSelectedCloneCopyTrade = !!copyTradeData

  return (
    <Modal
      width="100vh"
      maxWidth="1000px"
      title={
        <Flex
          sx={{
            width: '100%',
            alignItems: 'center',
            justifyContent: isNewTab ? 'space-between' : 'start',
            flexWrap: 'wrap',
            position: 'relative',
            gap: 3,
          }}
        >
          {isNewTab && (
            <Box as="span">
              <Trans>Copy Trader Setting</Trans>
            </Box>
          )}

          {!!copies?.data?.length && (
            <Flex sx={{ display: 'flex', alignItems: 'center', gap: 3, pr: 3 }}>
              {isCloneTab && (
                <IconBox
                  icon={<ArrowLeft size={24} />}
                  sx={{
                    ...(isCloneTab ? { width: '24px', height: '24px' } : { width: '0px', height: '0px' }),
                    overflow: 'hidden',
                  }}
                  onClick={
                    isCloneTab
                      ? () => (isSelectedCloneCopyTrade ? setCopyTradeData(null) : handleTab(TabKeyEnum.New))
                      : undefined
                  }
                  role="button"
                />
              )}
              <Box
                sx={{
                  ...(isCloneTab
                    ? { fontSize: '24px', lineHeight: '24px', fontWeight: 700 }
                    : {
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '14px',
                        cursor: 'pointer',
                        color: 'primary1',
                        '&:hover': { color: 'primary2' },
                      }),
                }}
                onClick={isCloneTab ? undefined : () => handleTab(TabKeyEnum.Clone)}
              >
                <Trans>Clone Settings</Trans>
              </Box>
            </Flex>
          )}
        </Flex>
      }
      hasClose
      isOpen={isOpen}
      onDismiss={onClose}
      mode="bottom"
      background="neutral5"
    >
      <Box sx={{ position: 'relative', maxWidth: 1000, mx: 'auto' }}>
        {isNewTab && (
          <CopyTraderForm
            onSubmit={onSubmit}
            isSubmitting={isLoading}
            defaultFormValues={{ ...defaultCopyTradeFormValues, protocol, account }}
          />
        )}
        {isCloneTab && !!copies && (
          <>
            {isSelectedCloneCopyTrade ? (
              <Box py={2}>
                <CopyTradeCloneForm
                  key={copyTradeData.id}
                  duplicateToAddress={account}
                  protocol={protocol}
                  copyTradeData={copyTradeData}
                  onDismiss={onClose}
                  onSuccess={() => setCopyTradeData(null)}
                />
              </Box>
            ) : (
              <Box p={16}>
                <Type.Caption pb={12} color="neutral2">
                  <Trans>Select the copy you want to clone:</Trans>
                </Type.Caption>
                <CopyTradeDataTable data={copies?.data} isLoading={loadingCopies} onPick={setCopyTradeData} />
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  )
}
