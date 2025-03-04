import { Trans } from '@lingui/macro'
import { ArrowLeft } from '@phosphor-icons/react'
import { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { getVaultCopyTradeSettingsApi, requestVaultCopyTradeApi } from 'apis/vaultApis'
import CopyTradeCloneForm from 'components/@copyTrade/CopyTradeCloneForm'
import CopyTraderForm from 'components/@copyTrade/CopyTradeForm'
import { defaultCopyTradeFormValues } from 'components/@copyTrade/configs'
import { getRequestDataFromForm } from 'components/@copyTrade/helpers'
import { CopyTradeFormValues } from 'components/@copyTrade/types'
import ToastBody from 'components/@ui/ToastBody'
import { CopyTradeData, RequestCopyTradeData } from 'entities/copyTrade.d'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { AlertTypeEnum, CopyTradePlatformEnum, CopyTradeTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { Z_INDEX } from 'utils/config/zIndex'
import { getErrorMessage } from 'utils/helpers/handleError'
import { EventSource } from 'utils/tracking/types'

import CopyTradeDataTable from '../CopyTraderButton/CopyTradeDataTable'

enum TabKeyEnum {
  Clone = 'Clone',
  New = 'New',
}

export default function CopyVaultDrawer({
  protocol,
  account,
  isOpen,
  onClose,
  onSuccess,
  modalStyles,
  source,
}: {
  protocol: ProtocolEnum
  account: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  modalStyles?: { backdropFilter?: string; overlayBackground?: string }
  source?: EventSource
}) {
  const refetchQueries = useRefetchQueries()
  const { myProfile } = useMyProfileStore()
  const { hasCopiedChannel, handleGenerateLinkBot } = useBotAlertContext()
  const [tab, handleTab] = useState<string>(TabKeyEnum.New)
  const [copyTradeData, setCopyTradeData] = useState<CopyTradeData | null>()
  const { data: copies, isLoading: loadingCopies } = useQuery(
    [QUERY_KEYS.GET_VAULT_COPY_TRADE_SETTINGS],
    () =>
      getVaultCopyTradeSettingsApi({
        limit: 100,
        offset: 0,
      }),
    { enabled: !!myProfile, retry: 0, keepPreviousData: true }
  )
  const { mutate: requestCopyTrade, isLoading } = useMutation(requestVaultCopyTradeApi, {
    onSuccess: async () => {
      refetchQueries([QUERY_KEYS.GET_VAULT_COPY_TRADE_SETTINGS, QUERY_KEYS.GET_TRADER_VOLUME_COPY])
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Make copy trade has been succeeded</Trans>} />
      )
      onClose()
      onSuccess && onSuccess()
      if (!hasCopiedChannel) {
        handleGenerateLinkBot?.(AlertTypeEnum.COPY_TRADE)
      }
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
      type: CopyTradeTypeEnum.COPIN_VAULT,
    }
    requestCopyTrade({ data })
  }
  const isNewTab = tab === TabKeyEnum.New
  const isCloneTab = tab === TabKeyEnum.Clone
  const isSelectedCloneCopyTrade = !!copyTradeData

  const { events } = useSystemConfigStore()

  return (
    <Modal
      dismissable={false}
      zIndex={Z_INDEX.TOASTIFY}
      maxWidth="520px"
      {...(modalStyles || {})}
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
              <Trans>Copy Vault</Trans>
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
    >
      <Box sx={{ position: 'relative', width: '100%', mx: 'auto' }}>
        {isNewTab && (
          <CopyTraderForm
            submitButtonText={'Copy Vault'}
            onSubmit={onSubmit}
            isSubmitting={isLoading}
            defaultFormValues={{
              ...defaultCopyTradeFormValues,
              exchange: CopyTradePlatformEnum.GNS_V8,
              protocol,
              account,
            }}
            formTypes={['vault']}
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
                  onSuccess={() => {
                    setCopyTradeData(null)
                  }}
                  isVault
                />
              </Box>
            ) : (
              <Box p={16}>
                <Type.Caption pb={12} color="neutral2">
                  <Trans>Select the vault you want to clone:</Trans>
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
