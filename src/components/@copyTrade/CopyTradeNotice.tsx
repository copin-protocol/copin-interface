import { Trans } from '@lingui/macro'

import Divider from 'components/@ui/Divider'
import { useSystemConfigStore } from 'hooks/store/useSystemConfigStore'
import AlertBanner from 'theme/Alert/AlertBanner'
import { Box, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'

export default function CopyTradeNotice() {
  const systemAlert = useSystemConfigStore((s) => s.systemAlert)
  const alert = systemAlert.find((v) => v.type === 'copy_exchange')
  if (!alert) return null
  return (
    <>
      <AlertBanner
        id={alert.type}
        type={alert.data.type}
        message={alert.data.message.en}
        action={
          <Type.Caption>
            <Trans>
              If you experience any problems, please contact us on Telegram{' '}
              <Box as="a" href={LINKS.support} target="_blank">
                @leecopin
              </Box>
              .
            </Trans>
          </Type.Caption>
        }
      />
      <Divider />
    </>
  )
}
