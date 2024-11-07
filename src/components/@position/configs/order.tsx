import { Trans } from '@lingui/macro'
import { ArrowFatDown, ArrowFatUp, Circle, Square } from '@phosphor-icons/react'
import { ReactNode } from 'react'

import { IconBox } from 'theme/base'
import { OrderTypeEnum } from 'utils/config/enums'

type ObjectTypes = {
  [key: string]: {
    text: ReactNode
    icon: ReactNode
  }
}
export const ORDER_TYPES: ObjectTypes = {
  [OrderTypeEnum.OPEN]: {
    text: <Trans>Open</Trans>,
    icon: <IconBox color="#CECDFF" icon={<ArrowFatUp weight={'fill'} />} />,
  },
  [OrderTypeEnum.CLOSE]: {
    text: <Trans>Close</Trans>,
    icon: <IconBox color="#FEBBEC" icon={<Square weight={'fill'} />} />,
  },
  [OrderTypeEnum.INCREASE]: {
    text: <Trans>Increase</Trans>,
    icon: <IconBox color="#7691D1" icon={<ArrowFatUp weight={'fill'} />} />,
  },
  [OrderTypeEnum.DECREASE]: {
    text: <Trans>Decrease</Trans>,
    icon: <IconBox color="#E4E0B4" icon={<ArrowFatDown weight={'fill'} />} />,
  },
  [OrderTypeEnum.LIQUIDATE]: {
    text: <Trans>Liquidation</Trans>,
    icon: <IconBox color={'red2'} icon={<Square weight={'fill'} />} />,
  },
  [OrderTypeEnum.MARGIN_TRANSFERRED]: {
    text: <Trans>Modified Margin</Trans>,
    icon: <IconBox color={'orange1'} icon={<Circle weight={'fill'} />} />,
  },
}
