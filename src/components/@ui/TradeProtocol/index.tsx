import { Trans } from '@lingui/macro'
import React from 'react'

import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { Button } from 'theme/Buttons'
import { Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { getProtocolTradeUrl } from 'utils/helpers/transform'

export default function TradeProtocolAction({ protocol = ProtocolEnum.GMX }: { protocol?: ProtocolEnum }) {
  return (
    <Button
      variant="ghost"
      onClick={() => window.open(getProtocolTradeUrl(protocol), '_blank')}
      width={['100%', '100%', '100%', 'fit-content']}
      sx={{
        borderRadius: 0,
        height: '100%',
        borderLeft: ['none', 'none', 'none', 'small'],
        borderTop: ['small', 'small', 'small', 'none'],
        borderColor: ['neutral4', 'neutral4', 'neutral4', 'neutral4'],
      }}
    >
      <Flex sx={{ alignItems: 'center', justifyContent: 'center', gap: 2 }} flexWrap="wrap">
        <Type.Caption color="neutral2">
          <Trans>Trade On</Trans>
        </Type.Caption>
        <ProtocolLogo
          protocol={protocol}
          textSx={{ color: 'neutral1', fontWeight: '600', display: ['none', 'block'] }}
        />
      </Flex>
    </Button>
  )
}