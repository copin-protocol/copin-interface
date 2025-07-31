import { Trans } from '@lingui/macro'
import { ArrowLeft } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { getCopyTradeSettingsApi, requestCopyTradeApi } from 'apis/copyTradeApis'
import CopyTradeCloneForm from 'components/@copyTrade/CopyTradeCloneForm'
import CopyTraderForm from 'components/@copyTrade/CopyTradeForm'
import { defaultCopyTradeFormValues } from 'components/@copyTrade/configs'
import { getRequestDataFromForm } from 'components/@copyTrade/helpers'
import { CopyTradeFormValues } from 'components/@copyTrade/types'
import ToastBody from 'components/@ui/ToastBody'
import { CopyTradeData, RequestCopyTradeData } from 'entities/copyTrade.d'
import { TradingEventStatusEnum } from 'entities/event'
import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import useCopyTradePermission from 'hooks/features/subscription/useCopyTradePermission'
import useCopyWalletContext from 'hooks/features/useCopyWalletContext'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { DCP_SUPPORTED_PROTOCOLS } from 'utils/config/constants'
import {
  AlertTypeEnum,
  CopyTradePlatformEnum,
  CopyTradeStatusEnum,
  CopyTradeTypeEnum,
  EventTypeEnum,
  ProtocolEnum,
} from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { Z_INDEX } from 'utils/config/zIndex'
import { getErrorMessage } from 'utils/helpers/handleError'
import { logEventCopyTrade } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory, EventSource } from 'utils/tracking/types'

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
  const { userPermission } = useCopyTradePermission()
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
      refetchQueries([QUERY_KEYS.USE_GET_ALL_COPY_TRADES, QUERY_KEYS.GET_TRADER_VOLUME_COPY])
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Make copy trade has been succeeded</Trans>} />
      )
      onClose()
      onSuccess && onSuccess()
      if (!hasCopiedChannel) {
        handleGenerateLinkBot?.(AlertTypeEnum.COPY_TRADE)
      }

      switch (source) {
        case EventSource.HOME:
          logEventCopyTrade({ event: EVENT_ACTIONS[EventCategory.COPY_TRADE].HOME_SUCCESS_COPY_TRADE })
          break
        case EventSource.HOME_BACKTEST:
          logEventCopyTrade({ event: EVENT_ACTIONS[EventCategory.COPY_TRADE].HOME_BACKTEST_SUCCESS_COPY_TRADE })
          break
        default:
          logEventCopyTrade({ event: EVENT_ACTIONS[EventCategory.COPY_TRADE].SUCCESS_COPY_TRADE })
      }
    },
    onError: (err) => {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)

      switch (source) {
        case EventSource.HOME:
          logEventCopyTrade({ event: EVENT_ACTIONS[EventCategory.COPY_TRADE].HOME_FAILED_COPY_TRADE })
          break
        case EventSource.HOME_BACKTEST:
          logEventCopyTrade({ event: EVENT_ACTIONS[EventCategory.COPY_TRADE].HOME_BACKTEST_FAILED_COPY_TRADE })
          break
        default:
          logEventCopyTrade({ event: EVENT_ACTIONS[EventCategory.COPY_TRADE].FAILED_COPY_TRADE })
      }
    },
  })

  const onSubmit = (formData: CopyTradeFormValues) => {
    const data: RequestCopyTradeData = {
      ...getRequestDataFromForm(formData),
      account,
      protocol,
      type: CopyTradeTypeEnum.COPY_TRADER,
    }
    requestCopyTrade({ data })

    switch (source) {
      case EventSource.HOME:
        logEventCopyTrade({ event: EVENT_ACTIONS[EventCategory.COPY_TRADE].HOME_REQUEST_COPY_TRADE })
        break
      case EventSource.HOME_BACKTEST:
        logEventCopyTrade({ event: EVENT_ACTIONS[EventCategory.COPY_TRADE].HOME_BACKTEST_REQUEST_COPY_TRADE })
        break
      default:
        logEventCopyTrade({ event: EVENT_ACTIONS[EventCategory.COPY_TRADE].REQUEST_COPY_TRADE })
    }
  }
  const isNewTab = tab === TabKeyEnum.New
  const isCloneTab = tab === TabKeyEnum.Clone
  const isSelectedCloneCopyTrade = !!copyTradeData

  const { events } = useSystemConfigStore()

  const { embeddedWallet, smartWallets } = useCopyWalletContext()
  const _defaultFormValues = useMemo(() => {
    let exchange = defaultCopyTradeFormValues.exchange
    let copyWalletId = defaultCopyTradeFormValues.copyWalletId
    if (embeddedWallet?.id) {
      copyWalletId = embeddedWallet.id
      exchange = CopyTradePlatformEnum.HYPERLIQUID
    }

    const gnsEvent = events?.find((e) => e.type === EventTypeEnum.GNS && e.status !== TradingEventStatusEnum.ENDED)
    if (!!gnsEvent && DCP_SUPPORTED_PROTOCOLS.includes(protocol)) {
      exchange = CopyTradePlatformEnum.GNS_V8
      copyWalletId = smartWallets?.find((w) => w.exchange === exchange)?.id ?? ''
    }
    return { ...defaultCopyTradeFormValues, protocol, account, exchange, copyWalletId }
  }, [defaultCopyTradeFormValues, embeddedWallet, events, protocol, account])

  return (
    <Modal
      dismissable
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
              <Trans>Copy Trader</Trans>
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
              {isCloneTab ? (
                <Type.H5>
                  <Trans>Clone Settings</Trans>
                </Type.H5>
              ) : (
                <Button
                  sx={{ px: 0 }}
                  variant="ghostPrimary"
                  type="button"
                  onClick={isCloneTab ? undefined : () => handleTab(TabKeyEnum.Clone)}
                >
                  <Trans>Clone Settings</Trans>
                </Button>
              )}
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
            defaultOpenUpgradeModal={
              userPermission?.copyTradeQuota != null &&
              (copies?.data?.filter((copy) => copy.status === CopyTradeStatusEnum.RUNNING)?.length ?? 0) >=
                userPermission.copyTradeQuota
            }
            onDismissUpgradeModal={() => {
              setCopyTradeData(null)
              onClose()
            }}
            onSubmit={onSubmit}
            isSubmitting={isLoading}
            defaultFormValues={_defaultFormValues}
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

                    logEventCopyTrade({
                      event: EVENT_ACTIONS[EventCategory.COPY_TRADE].CLONE_COPY_TRADE,
                      username: myProfile?.username,
                    })
                  }}
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
