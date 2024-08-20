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
    icon: <IconBox icon={<ArrowFatUp weight={'fill'} />} />,
  },
  [OrderTypeEnum.CLOSE]: {
    text: <Trans>Close</Trans>,
    icon: <IconBox icon={<Square weight={'fill'} />} />,
  },
  [OrderTypeEnum.INCREASE]: {
    text: <Trans>Increase</Trans>,
    icon: <IconBox icon={<ArrowFatUp weight={'fill'} />} />,
  },
  [OrderTypeEnum.DECREASE]: {
    text: <Trans>Decrease</Trans>,
    icon: <IconBox icon={<ArrowFatDown weight={'fill'} />} />,
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
