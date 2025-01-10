import { Trans } from '@lingui/macro'
import { BellSimpleSlash } from '@phosphor-icons/react'

import { AccountWithProtocol } from 'components/@ui/AccountWithProtocol'
import { TraderAlertData } from 'entities/alert'
import IconButton from 'theme/Buttons/IconButton'
import { Flex, Type } from 'theme/base'
import { formatLocalRelativeDate } from 'utils/helpers/format'

export default function DesktopItem({
  submitting,
  data,
  onSelect,
}: {
  submitting?: boolean
  data: TraderAlertData
  onSelect: (data?: TraderAlertData) => void
}) {
  return (
    <Flex justifyContent={'space-between'} alignItems={'center'} sx={{ gap: [3, 4] }}>
      <AccountWithProtocol protocol={data.protocol} address={data.address} />
      <Flex flex={1}>
        <Type.Caption color="neutral3">
          <Trans>Added</Trans> {formatLocalRelativeDate(data.createdAt ?? '')}
        </Type.Caption>
      </Flex>
      <IconButton
        variant="ghostDanger"
        icon={<BellSimpleSlash size={20} />}
        sx={{ p: 0 }}
        size={32}
        isLoading={submitting}
        disabled={submitting}
        onClick={() => onSelect(data)}
      />
    </Flex>
  )
}
