import { Trans } from '@lingui/macro'
import { Info } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import React, { memo, useEffect } from 'react'

import Divider from 'components/@ui/Divider'
import useBotAlertContext from 'hooks/features/useBotAlertProvider'
import useCountdown from 'hooks/helpers/useCountdown'
import { Button } from 'theme/Buttons'
import TelegramIcon from 'theme/Icons/TelegramIcon'
import Modal from 'theme/Modal'
import Tooltip from 'theme/Tooltip'
import { Flex, IconBox, Type } from 'theme/base'
import { Z_INDEX } from 'utils/config/zIndex'
import { generateTelegramBotAlertUrl } from 'utils/helpers/generateRoute'

const LinkBotAlertModal = memo(function LinkBotAlertModalComponent() {
  const { botAlertState, openingModal, stateExpiredTime, handleResetState, handleDismissModal } = useBotAlertContext()

  useEffect(() => {
    const interval = setInterval(() => {
      if (botAlertState && stateExpiredTime && dayjs().utc().isAfter(dayjs.utc(stateExpiredTime))) {
        handleResetState?.()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [botAlertState, handleResetState, stateExpiredTime])

  return (
    <Modal
      isOpen={!!openingModal && !!botAlertState}
      title={'Connect Telegram'}
      onDismiss={handleDismissModal}
      hasClose
      maxWidth="500px"
      zIndex={Z_INDEX.TOASTIFY}
    >
      <Flex width="100%" px={24} py={1} flexDirection="column" alignItems="center">
        <TelegramIcon size={56} variant="Bold" />
        <Flex my={24} flexDirection="column" sx={{ gap: 3 }}>
          <Flex flex={1} flexDirection="column" alignItems="center" sx={{ gap: 1 }}>
            <Type.BodyBold>Direct Message</Type.BodyBold>
            <Type.Caption textAlign="center" color="neutral2">
              To receive alerts as direct messages, click the button below to open Telegram. This session will be
              expired after {stateExpiredTime ? <Countdown endTime={stateExpiredTime} /> : '--'}.
            </Type.Caption>
            <Button
              mt={3}
              type="button"
              variant="primary"
              as="a"
              href={generateTelegramBotAlertUrl(botAlertState)}
              target="_blank"
              width="240px"
              py="6px"
            >
              <Type.CaptionBold>
                <Trans>CONNECT</Trans>
              </Type.CaptionBold>
            </Button>
          </Flex>
          <Flex width=" 100%" alignItems="center" justifyContent="center" sx={{ gap: 1 }}>
            <Divider flex={1} color="neutral4" height={1} />
            <Type.Caption color="neutral3">OR</Type.Caption>
            <Divider flex={1} color="neutral4" width="25px" height={1} />
          </Flex>
          <Flex flex={1} flexDirection="column" alignItems="center" sx={{ gap: 1 }}>
            <Flex alignItems="center" sx={{ gap: 1 }}>
              <Type.BodyBold>Group Message</Type.BodyBold>
              <IconBox
                icon={<Info size={20} />}
                size={20}
                color="neutral3"
                data-tip="React-tooltip"
                data-tooltip-id={'tt-coming-soon'}
                data-tooltip-delay-show={360}
              />
              <Tooltip id={'tt-coming-soon'}>
                <Type.Caption color="neutral2" sx={{ maxWidth: 350 }}>
                  Coming Soon
                </Type.Caption>
              </Tooltip>
            </Flex>
            <Type.Caption textAlign="center" color="neutral2">
              Add @Copin_Alert_bot to your group and past the chat ID below. The bot will automatically send the chat ID
              to the group.
            </Type.Caption>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  )
})
export default LinkBotAlertModal

function Countdown({ endTime }: { endTime: number }) {
  const timer = useCountdown(endTime)

  return (
    <Type.Caption color="orange1">
      {!timer?.hasEnded && (
        <>
          {timer?.minutes}m {timer?.seconds}s
        </>
      )}
    </Type.Caption>
  )
}
