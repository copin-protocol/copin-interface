import { Trans } from '@lingui/macro'
import { ArrowLeft, XCircle } from '@phosphor-icons/react'
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
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import IconButton from 'theme/Buttons/IconButton'
import Loading from 'theme/Loading'
import Drawer from 'theme/Modal/Drawer'
import Tabs, { TabPane } from 'theme/Tab'
import { Box, Type } from 'theme/base'
import { CopyTradePlatformEnum, CopyTradeTypeEnum, ProtocolEnum } from 'utils/config/enums'
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
        userId: myProfile ? myProfile.id : '',
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
      serviceKey: formData.serviceKey,
    }
    if (formData.exchange === CopyTradePlatformEnum.GMX) {
      data.exchange = CopyTradePlatformEnum.GMX
      data.privateKey = formData.privateKey
    }
    if (formData.exchange === CopyTradePlatformEnum.BINGX) {
      data.exchange = CopyTradePlatformEnum.BINGX
      data.bingXApiKey = formData.bingXApiKey
      data.bingXSecretKey = formData.bingXSecretKey
    }
    if (protocol === ProtocolEnum.KWENTA) {
      data.serviceKey = 'TEST_KWENTA'
    }
    requestCopyTrade({ data })

    logEvent({
      label: getUserForTracking(myProfile?.username),
      category: EventCategory.COPY_TRADE,
      action: EVENT_ACTIONS[EventCategory.COPY_TRADE].REQUEST_COPY_TRADE,
    })
  }

  return (
    <Drawer
      title={
        copies?.data.length ? (
          <Box sx={{ position: 'relative' }} width="100%">
            <Tabs
              inactiveHasLine={false}
              defaultActiveKey={tab}
              onChange={handleTab}
              fullWidth
              headerSx={{ borderBottom: 'small', borderColor: 'neutral4', width: '100%', mb: 0 }}
              tabItemSx={{ flex: '0 0 auto', pb: 10, fontSize: 16 }}
            >
              <TabPane tab="NEW SETTINGS" key={TabKeyEnum.New}>
                <div></div>
              </TabPane>
              <TabPane tab="CLONE SETTINGS" key={TabKeyEnum.Clone}>
                <div></div>
              </TabPane>
            </Tabs>
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 0 }}
              variant="ghost"
              onClick={() => onClose()}
              icon={<XCircle size={24} />}
              size={24}
            />
          </Box>
        ) : loadingCopies ? (
          ''
        ) : (
          'Copy Trader Settings'
        )
      }
      hasClose={!loadingCopies && !copies?.data.length}
      isOpen={isOpen}
      onDismiss={onClose}
      mode="bottom"
      background="neutral5"
      size="min(850px,90vh)"
      headSx={{
        maxWidth: '100%',
        width: 1000,
        mx: 'auto',
        px: 12,
        pt: copies?.data.length ? 2 : 3,
        pb: copies?.data.length ? 0 : 3,
      }}
    >
      {loadingCopies ? (
        <Loading />
      ) : (
        <Box sx={{ position: 'relative', maxWidth: 1000, mx: 'auto' }}>
          {!copies?.data.length || tab === TabKeyEnum.New ? (
            <CopyTraderForm
              onSubmit={onSubmit}
              isSubmitting={isLoading}
              defaultFormValues={{ ...defaultCopyTradeFormValues, protocol, account }}
            />
          ) : (
            <>
              {copyTradeData ? (
                <Box py={2}>
                  <ButtonWithIcon variant="ghost" icon={<ArrowLeft size={24} />} onClick={() => setCopyTradeData(null)}>
                    <Type.BodyBold>Back</Type.BodyBold>
                  </ButtonWithIcon>
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
                  <Type.BodyBold pb={12}>
                    <Trans>Select the copy you want to clone:</Trans>
                  </Type.BodyBold>
                  <CopyTradeDataTable data={copies?.data} isLoading={loadingCopies} onPick={setCopyTradeData} />
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </Drawer>
  )
}
