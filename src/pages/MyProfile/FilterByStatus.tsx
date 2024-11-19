import { Trans } from '@lingui/macro'

import Checkbox from 'theme/Checkbox'
import { Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { CopyTradeStatusEnum } from 'utils/config/enums'
import { COPY_TRADE_STATUS_TRANS } from 'utils/config/translations'

export default function FilterByStatus({
  checkIsStatusChecked,
  handleToggleStatus,
}: {
  checkIsStatusChecked: (status: CopyTradeStatusEnum) => boolean
  handleToggleStatus: (status: CopyTradeStatusEnum) => void
}) {
  return (
    <Flex sx={{ gap: 3, flexDirection: ['column', 'row'], alignItems: ['start', 'center'] }}>
      <Type.Caption
        sx={{ flexShrink: 0, color: [`${themeColors.neutral1} !important`, `${themeColors.neutral3} !important`] }}
      >
        <Trans>Status</Trans>
      </Type.Caption>
      {statusFilters.map((status) => {
        return (
          <Checkbox key={status} checked={checkIsStatusChecked(status)} onChange={() => handleToggleStatus(status)}>
            <Type.Caption lineHeight="16px">{COPY_TRADE_STATUS_TRANS[status]}</Type.Caption>
          </Checkbox>
        )
      })}
    </Flex>
  )
}

const statusFilters = [CopyTradeStatusEnum.RUNNING, CopyTradeStatusEnum.STOPPED]
