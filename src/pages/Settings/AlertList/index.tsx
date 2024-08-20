import { Trans } from '@lingui/macro'
import { Crown } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { deleteTraderAlertApi, getTraderAlertListApi } from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import UnsubscribeAlertModal from 'components/@widgets/UnsubscribeAlertModal'
import { TraderAlertData } from 'entities/alert'
import useBotAlertContext, { BotAlertProvider } from 'hooks/features/useBotAlertProvider'
import { useIsPremium } from 'hooks/features/useSubscriptionRestrict'
import usePageChange from 'hooks/helpers/usePageChange'
import useMyProfile from 'hooks/store/useMyProfile'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import { PaginationWithSelect } from 'theme/Pagination'
import { Box, Flex, Type } from 'theme/base'
import { MAX_TRADER_ALERT_BASIC, MAX_TRADER_ALERT_PREMIUM } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { formatNumber } from 'utils/helpers/format'
import { generateTelegramBotAlertUrl } from 'utils/helpers/generateRoute'
import { getErrorMessage } from 'utils/helpers/handleError'
import { pageToOffset } from 'utils/helpers/transform'

import DesktopItem from './DesktopItem'
import MobileItem from './MobileItem'
import TraderLastViewed from './TraderLastViewed'
import UnlinkAlertModal from './UnlinkAlertModal'

const LIMIT = 10
export default function AlertList() {
  return (
    <BotAlertProvider>
      <AlertListComponent />
    </BotAlertProvider>
  )
}
function AlertListComponent() {
  const { myProfile } = useMyProfile()
  const isPremiumUser = useIsPremium()
  const { md } = useResponsive()

  const { currentPage, changeCurrentPage } = usePageChange({ pageName: 'alert-list' })
  const [currentAlert, setCurrentAlert] = useState<TraderAlertData | undefined>()
  const [openModal, setOpenModal] = useState(false)

  const {
    data,
    isLoading,
    refetch: refetchList,
  } = useQuery(
    [QUERY_KEYS.GET_TRADER_ALERTS, currentPage, myProfile?.id],
    () => getTraderAlertListApi({ limit: LIMIT, offset: pageToOffset(currentPage, LIMIT) }),
    {
      enabled: !!myProfile?.id,
      retry: 0,
    }
  )

  const reload = () => {
    refetchList()
  }

  const { mutate: deleteTraderAlert, isLoading: submitting } = useMutation(deleteTraderAlertApi, {
    onSuccess: () => {
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={<Trans>This trader alert has been removed successfully</Trans>}
        />
      )
      setOpenModal(false)
      reload()
    },
    onError: (error) => {
      toast.error(<ToastBody title="Error" message={getErrorMessage(error)} />)
    },
  })

  const onSelect = (data?: TraderAlertData) => {
    setCurrentAlert(data)
    setOpenModal(true)
  }

  const handleUnsubscribeAlert = () => {
    if (currentAlert) {
      deleteTraderAlert(currentAlert?.id)
    }
  }

  const { botAlert, handleGenerateLinkBot, refetch } = useBotAlertContext()
  const showUnlinkButton = !!botAlert?.chatId
  const [showUnlinkModal, setShowUnlinkModal] = useState(false)
  const onClickUnlinkButton = () => {
    setShowUnlinkModal(true)
  }
  const onDismissUnlinkModal = () => {
    setShowUnlinkModal(false)
    refetch()
  }
  const showLinkButton = !botAlert?.chatId
  const onClickLinkButton = () => {
    handleGenerateLinkBot()
  }

  return (
    <>
      <Flex
        sx={{
          py: [0, 0, 3],
          alignItems: 'center',
          height: '100%',
          width: '100%',
          maxWidth: ['auto', 'auto', 470],
          mx: 'auto',
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            height: '100%',
            maxHeight: 720,
            width: '100%',
            overflow: ['hidden', 'hidden', 'auto'],
            border: ['none', 'none', 'small'],
            borderColor: ['none', 'none', 'neutral4'],
          }}
        >
          <Box width="100%" sx={{ borderBottom: 'small', borderColor: 'neutral4' }}>
            <Flex p={3} alignItems="center" justifyContent="space-between" sx={{ gap: 2 }}>
              <Type.BodyBold>
                <Trans>Alert List</Trans> ({formatNumber(data?.meta?.total)}/
                {isPremiumUser ? MAX_TRADER_ALERT_PREMIUM : MAX_TRADER_ALERT_BASIC})
              </Type.BodyBold>
              {!isPremiumUser && (
                <Link to={ROUTES.USER_SUBSCRIPTION.path}>
                  <ButtonWithIcon icon={<Crown size={20} />} variant="ghostPrimary" sx={{ p: 0 }}>
                    <Trans>Upgrade Account</Trans>
                  </ButtonWithIcon>
                </Link>
              )}
            </Flex>
          </Box>
          <Flex
            sx={{
              flex: '1 0 0',
              width: '100%',
              flexDirection: 'column',
              gap: [2, 2, 3],
              overflow: 'auto',
            }}
          >
            {isLoading && <Loading />}
            {!isLoading && !data?.data?.length && <TraderLastViewed reload={reload} />}
            {!isLoading && !!data?.data.length && (
              <>
                <Flex flexDirection="column" sx={{ p: [0, 0, 3], gap: [2, 2, 12] }}>
                  {data?.data?.map((item) =>
                    md ? (
                      <DesktopItem key={item.id} data={item} onSelect={onSelect} submitting={isLoading || submitting} />
                    ) : (
                      <MobileItem key={item.id} data={item} onSelect={onSelect} submitting={isLoading || submitting} />
                    )
                  )}
                </Flex>
              </>
            )}
          </Flex>
          <Box sx={{ backgroundColor: 'neutral7' }}>
            <PaginationWithSelect
              currentPage={currentPage}
              onPageChange={changeCurrentPage}
              apiMeta={data?.meta}
              sx={{
                width: '100%',
                justifyContent: 'end',
                py: 1,
                px: 2,
                borderTop: 'small',
                borderColor: 'neutral4',
              }}
            />
            <Flex
              bg="neutral5"
              px={3}
              py={2}
              sx={{
                borderTop: 'small',
                borderColor: 'neutral4',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                rowGap: 2,
              }}
            >
              <Type.Caption color={'neutral3'}>
                Use{' '}
                {showLinkButton ? (
                  'Copin Telegram Bot'
                ) : (
                  <a href={generateTelegramBotAlertUrl()} target="_blank" rel="noreferrer">
                    Copin Telegram Bot
                  </a>
                )}{' '}
                to get notifications from traders
              </Type.Caption>
              {showUnlinkButton && (
                <Type.Caption color="red2" sx={{ cursor: 'pointer' }} onClick={onClickUnlinkButton}>
                  <Trans>Unlink Account</Trans>
                </Type.Caption>
              )}
              {showLinkButton && (
                <Type.Caption color="primary1" sx={{ cursor: 'pointer' }} onClick={onClickLinkButton}>
                  <Trans>Link Account</Trans>
                </Type.Caption>
              )}
            </Flex>
          </Box>
        </Flex>
      </Flex>
      {openModal && currentAlert && (
        <UnsubscribeAlertModal
          data={currentAlert}
          onDismiss={() => setOpenModal(false)}
          onConfirm={handleUnsubscribeAlert}
          isConfirming={false}
        />
      )}
      {showUnlinkModal && <UnlinkAlertModal onDismiss={onDismissUnlinkModal} />}
    </>
  )
}
