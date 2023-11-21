import { Trans } from '@lingui/macro'
import { Crown } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { deleteTraderAlertApi, getTraderAlertListApi } from 'apis/alertApis'
import ToastBody from 'components/@ui/ToastBody'
import UnsubscribeAlertModal from 'components/Modal/UnsubscribeAlertModal'
import { TraderAlertData } from 'entities/alert'
import useSubscriptionRestrict from 'hooks/features/useSubscriptionRestrict'
import usePageChange from 'hooks/helpers/usePageChange'
import useMyProfile from 'hooks/store/useMyProfile'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { PaginationWithSelect } from 'theme/Pagination'
import { Box, Flex, Type } from 'theme/base'
import { MAX_TRADER_ALERT_BASIC, MAX_TRADER_ALERT_PREMIUM } from 'utils/config/constants'
import { QUERY_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { formatNumber } from 'utils/helpers/format'
import { generateTelegramBotAlertUrl } from 'utils/helpers/generateRoute'
import { getErrorMessage } from 'utils/helpers/handleError'
import { pageToOffset } from 'utils/helpers/transform'

import AlertListDesktop from './AlertListDesktop'
import AlertListMobile from './AlertListMobile'

const LIMIT = 10
const AlertList = () => {
  const { myProfile } = useMyProfile()
  const { isPremiumUser } = useSubscriptionRestrict()
  const { md } = useResponsive()

  const { currentPage, changeCurrentPage } = usePageChange({ pageName: 'alert-list' })
  const [currentAlert, setCurrentAlert] = useState<TraderAlertData | undefined>()
  const [openModal, setOpenModal] = useState(false)

  const { data, isLoading, refetch } = useQuery(
    [QUERY_KEYS.GET_TRADER_ALERTS, currentPage, myProfile?.id],
    () => getTraderAlertListApi({ limit: LIMIT, offset: pageToOffset(currentPage, LIMIT) }),
    {
      enabled: !!myProfile?.id,
      retry: 0,
    }
  )

  const reload = () => {
    refetch()
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

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent={['flex-start', 'center']}
      sx={{ height: '100%', overflow: 'auto', position: md ? 'relative' : undefined }}
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        minHeight="max-content"
        sx={{ border: 'small', borderColor: 'neutral4', position: md ? 'relative' : undefined }}
        width={['100%', 465]}
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
        {md ? (
          <AlertListDesktop data={data?.data} isLoading={isLoading} submitting={submitting} onSelect={onSelect} />
        ) : (
          <AlertListMobile data={data?.data} isLoading={isLoading} submitting={submitting} onSelect={onSelect} />
        )}

        <Box width="100%" sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'neutral7' }}>
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
          <Box bg="neutral5" px={3} py={2} sx={{ borderTop: 'small', borderColor: 'neutral4' }}>
            <Type.Caption color={'neutral3'}>
              Using{' '}
              <a href={generateTelegramBotAlertUrl()} target="_blank" rel="noreferrer">
                Copin Telegram Bot
              </a>{' '}
              to get notifications from traders.
            </Type.Caption>
          </Box>
        </Box>
      </Flex>

      {openModal && currentAlert && (
        <UnsubscribeAlertModal
          data={currentAlert}
          onDismiss={() => setOpenModal(false)}
          onConfirm={handleUnsubscribeAlert}
          isConfirming={false}
        />
      )}
    </Flex>
  )
}

export default AlertList
