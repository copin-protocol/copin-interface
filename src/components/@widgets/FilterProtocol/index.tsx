import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { useMemo } from 'react'
import { GridProps } from 'styled-system'

import HorizontalScroll from 'components/@ui/HorizontalScroll'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'

export default function FilterProtocol({
  currentProtocol,
  changeProtocol,
  sx,
}: {
  currentProtocol?: ProtocolEnum
  changeProtocol: (option?: ProtocolEnum) => void
  sx?: SystemStyleObject & GridProps
}) {
  const { allowedCopyTradeProtocols, releasedProtocols } = useProtocolPermission()
  const protocols = useMemo(
    () => [...allowedCopyTradeProtocols, ...releasedProtocols.filter((e) => !allowedCopyTradeProtocols.includes(e))],
    [allowedCopyTradeProtocols]
  )

  return (
    <Flex width="100%" px={3} alignItems="center" sx={{ gap: 2, ...sx }}>
      <Type.CaptionBold minWidth={65} color="neutral3">
        <Trans>Protocols</Trans>
      </Type.CaptionBold>
      <Box
        flex={1}
        sx={{
          '.react-horizontal-scrolling-menu--scroll-container ': {
            scrollbarWidth: 'none',
          },
        }}
      >
        <HorizontalScroll>
          {protocols.map((data, index) => {
            return (
              <Box
                ml={index === 0 ? 0 : 2}
                width={24}
                flexShrink={0}
                key={data}
                onClick={() => changeProtocol(data === currentProtocol ? undefined : data)}
              >
                <ProtocolLogo
                  key={data}
                  protocol={data}
                  isActive={data === currentProtocol}
                  hasText={false}
                  size={24}
                  sx={{ height: '100%', cursor: 'pointer', '& > *': { flexShrink: 0 } }}
                />
              </Box>
            )
          })}
        </HorizontalScroll>
      </Box>
    </Flex>
  )
}
