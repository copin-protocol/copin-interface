import React, { useState } from 'react'

import useMyProfile from 'hooks/store/useMyProfile'
import { Button } from 'theme/Buttons'
import Tooltip from 'theme/Tooltip'
import { Flex, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'

import CopyTraderDrawer from './CopyTraderDrawer'
import ModalContactUs from './ModalContactUs'

const CopyTraderAction = ({
  protocol,
  account,
  onForceReload,
  hasCopyPermission = false,
}: {
  protocol: ProtocolEnum
  account: string
  onForceReload: () => void
  hasCopyPermission?: boolean
}) => {
  const { myProfile } = useMyProfile()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenContactModal, setIsOpenContactModal] = useState(false)
  const handleCloseModal = () => {
    setIsOpenModal(false)
    onForceReload()
  }
  return (
    <>
      <Button
        width={['100%', '100%', '100%', 150]}
        sx={{
          borderRadius: 0,
          height: '100%',
        }}
        variant="primary"
        onClick={() => {
          hasCopyPermission ? setIsOpenModal(true) : setIsOpenContactModal(true)

          logEvent({
            label: getUserForTracking(myProfile?.username),
            category: EventCategory.COPY_TRADE,
            action: EVENT_ACTIONS[EventCategory.COPY_TRADE].OPEN_COPY_TRADE,
          })
        }}
        data-tooltip-id={`tt-kwenta_copytrade`}
        disabled={!hasCopyPermission}
      >
        Copy Trader
      </Button>
      {isOpenModal && (
        <CopyTraderDrawer protocol={protocol} account={account} isOpen={isOpenModal} onClose={handleCloseModal} />
      )}
      {isOpenContactModal && <ModalContactUs onDismiss={() => setIsOpenContactModal(false)} />}
      {!hasCopyPermission && (
        <Tooltip id="tt-kwenta_copytrade" place="top" type="dark" effect="solid" clickable>
          <Flex flexDirection="column" maxWidth={350}>
            <Type.CaptionBold>Kwenta copy-trading is coming soon</Type.CaptionBold>
            <Type.Caption color="neutral2">
              Any ideas or support, reach us{' '}
              <a href={LINKS.telegram} target="_blank" rel="noreferrer">
                here
              </a>
            </Type.Caption>
          </Flex>
        </Tooltip>
      )}
    </>
  )
}

export default CopyTraderAction
