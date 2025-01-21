import { Trans } from '@lingui/macro'
import { Crown } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getTraderAlertListApi } from 'apis/alertApis'
import UnsubscribeAlertModal from 'components/@widgets/UnsubscribeAlertModal'
import { TraderAlertData } from 'entities/alert'
import useBotAlertContext from 'hooks/features/useBotAlertProvider'
import useSettingWatchlistTraders from 'hooks/features/useSettingWatchlistTraders'
import { useIsPremium, useIsVIP } from 'hooks/features/useSubscriptionRestrict'
import usePageChange from 'hooks/helpers/usePageChange'
import useMyProfile from 'hooks/store/useMyProfile'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import Loading from 'theme/Loading'
import { PaginationWithSelect } from 'theme/Pagination'
import { Box, Flex, Type } from 'theme/base'
import { MAX_TRADER_ALERT_BASIC, MAX_TRADER_ALERT_PREMIUM, MAX_TRADER_ALERT_VIP } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { formatNumber } from 'utils/helpers/format'
import { generateTelegramBotAlertUrl } from 'utils/helpers/generateRoute'
import { pageToOffset } from 'utils/helpers/transform'

import DesktopItem from './DesktopItem'
import MobileItem from './MobileItem'
import TraderLastViewed from './TraderLastViewed'
import UnlinkAlertModal from './UnlinkAlertModal'

const LIMIT = 10
export default function AlertList() {
  return <AlertListComponent />
}
function AlertListComponent() {
  const { myProfile } = useMyProfile()
  const isPremiumUser = useIsPremium()
  const isVIPUser = useIsVIP()
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

  const { deleteTraderAlert, submittingDelete } = useSettingWatchlistTraders({
    onSuccess: () => {
      setOpenModal(false)
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

  const { botAlert, handleGenerateLinkBot, refetchAlerts } = useBotAlertContext()
  const showUnlinkButton = !!botAlert?.chatId
  const [showUnlinkModal, setShowUnlinkModal] = useState(false)
  const onClickUnlinkButton = () => {
    setShowUnlinkModal(true)
  }
  const onDismissUnlinkModal = () => {
    setShowUnlinkModal(false)
    refetchAlerts()
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
                <Trans>ALERT LIST</Trans> ({formatNumber(data?.meta?.total)}/
                {isVIPUser ? MAX_TRADER_ALERT_VIP : isPremiumUser ? MAX_TRADER_ALERT_PREMIUM : MAX_TRADER_ALERT_BASIC})
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
            {!isLoading && !data?.data?.length && <TraderLastViewed />}
            {!isLoading && !!data?.data.length && (
              <>
                <Flex flexDirection="column" sx={{ p: [0, 0, 3], gap: [2, 2, 12] }}>
                  {data?.data?.map((item) =>
                    md ? (
                      <DesktopItem
                        key={item.id}
                        data={item}
                        onSelect={onSelect}
                        submitting={isLoading || submittingDelete}
                      />
                    ) : (
                      <MobileItem
                        key={item.id}
                        data={item}
                        onSelect={onSelect}
                        submitting={isLoading || submittingDelete}
                      />
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
              bg="neutral6"
              px={3}
              py={3}
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
                  'Telegram Bot'
                ) : (
                  <a href={generateTelegramBotAlertUrl()} target="_blank" rel="noreferrer">
                    Telegram Bot
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
