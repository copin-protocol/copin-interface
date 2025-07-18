import { BellSimple, BellSimpleSlash } from '@phosphor-icons/react'
import { ReactNode, useMemo } from 'react'
import { v4 as uuid } from 'uuid'

import TraderCopyAddress from 'components/@copyTrade/TraderCopyAddress'
import AvatarGroup from 'components/@ui/Avatar/AvatarGroup'
import { TraderAlertData } from 'entities/alert'
import TagWrapper from 'theme/Tag/TagWrapper'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, IconBox, Type } from 'theme/base'

export default function TradersTag({
  title,
  traders,
  onClear,
  tagSx,
}: {
  title: ReactNode
  traders: TraderAlertData[] | undefined
  onClear?: () => void
  tagSx?: any
}) {
  const tooltipId = useMemo(() => uuid(), [])
  return (
    <TagWrapper onClear={traders?.length && !!onClear ? onClear : undefined} sx={tagSx}>
      <Type.Caption>{title}</Type.Caption>
      {!!traders?.length && (
        <Box data-tooltip-id={tooltipId} data-tooltip-delay-show={360}>
          <AvatarGroup size={18} addresses={traders.map((e) => e.address)} />
        </Box>
      )}
      <Tooltip id={tooltipId} clickable>
        <Flex sx={{ flexDirection: 'column', gap: 1, textTransform: 'initial' }}>
          {traders?.map((trader) => {
            return (
              <Flex key={trader.address + trader.protocol} alignItems="center" sx={{ gap: 2 }}>
                <TraderCopyAddress
                  address={trader.address}
                  protocol={trader.protocol}
                  options={{
                    size: 18,
                    hasCopyAddress: true,
                    hasAddressTooltip: true,
                  }}
                />
                <IconBox
                  icon={trader.enableAlert ? <BellSimple size={16} /> : <BellSimpleSlash size={16} />}
                  size={16}
                />
              </Flex>
            )
          })}
        </Flex>
      </Tooltip>
    </TagWrapper>
  )
}
