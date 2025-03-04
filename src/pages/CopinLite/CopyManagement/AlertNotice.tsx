import { Trans } from '@lingui/macro'
import { Warning } from '@phosphor-icons/react'

import useBotAlertContext from 'hooks/features/alert/useBotAlertProvider'
import { Button } from 'theme/Buttons'
import Tooltip from 'theme/Tooltip'
import { Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { AlertTypeEnum } from 'utils/config/enums'

export default function AlertNotice() {
  const { hasCopiedChannel, handleGenerateLinkBot, loadingAlerts } = useBotAlertContext()
  if (loadingAlerts || hasCopiedChannel) return null
  const tooltipId = 'tt_copin_lite_warning_alert'
  return (
    <>
      <Flex sx={{ alignItems: 'center', gap: 2 }} data-tooltip-id={tooltipId}>
        <Warning style={{ color: themeColors.orange1 }} />
        <Type.Caption color="orange1">
          <Trans>Telegram Alert</Trans>
        </Type.Caption>
      </Flex>
      <Tooltip id={tooltipId} clickable>
        <Type.Caption>
          <Trans>
            You are not yet linked to telegram to receive Alerts.{' '}
            <Button variant="textPrimary" onClick={() => handleGenerateLinkBot?.(AlertTypeEnum.COPY_TRADE)}>
              Click To Connect
            </Button>
          </Trans>
        </Type.Caption>
      </Tooltip>
    </>
  )
}
