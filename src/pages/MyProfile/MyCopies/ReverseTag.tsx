import { ArrowUUpLeft } from '@phosphor-icons/react'

import NotchIconWrapper from 'components/@ui/NotchWrapper'
import { TOOLTIP_KEYS } from 'utils/config/keys'

const ReverseTag = () => {
  return (
    <NotchIconWrapper
      data-tooltip-id={TOOLTIP_KEYS.MY_COPY_ICON_REVERSE}
      bg="orange1"
      icon={<ArrowUUpLeft size={16} weight="bold" />}
      iconColor="neutral8"
    />
  )
}

export default ReverseTag
