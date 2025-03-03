import { Trans } from '@lingui/macro'
import { Warning } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'

import { CopyPositionData } from 'entities/copyTrade'
import { Button } from 'theme/Buttons'
import Tooltip from 'theme/Tooltip'
import { Type } from 'theme/base'

import { ExternalSourceCopyPositions } from '../types'

export default function MismatchPosition({
  data,
  externalSource,
}: {
  data: CopyPositionData
  externalSource: ExternalSourceCopyPositions | undefined
}) {
  const tooltipId = `tt_mismatch_${data.id}`

  const { sm } = useResponsive()

  return (
    <>
      <Type.Caption color="orange1" data-tooltip-id={tooltipId} onClick={(e) => e.stopPropagation()}>
        <Warning size={16} style={{ verticalAlign: 'middle' }} /> <Trans>Mismatch</Trans>
      </Type.Caption>
      <Tooltip id={tooltipId} clickable openEvents={sm ? undefined : { mouseover: true, click: true }}>
        <Type.Caption onClick={(e) => e.stopPropagation()} textAlign="left">
          <Trans>
            For some reason, this position has been closed on Hyperliquid, causing a mismatch with the data.{' '}
            <Button variant="textPrimary" onClick={() => externalSource?.handleUnlinkCopyPosition?.(data)}>
              Unlink
            </Button>
          </Trans>
        </Type.Caption>
      </Tooltip>
    </>
  )
}
