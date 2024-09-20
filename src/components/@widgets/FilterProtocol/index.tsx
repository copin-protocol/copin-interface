import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { useMemo } from 'react'
import { GridProps } from 'styled-system'

import HorizontalScroll from 'components/@ui/HorizontalScroll'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { Box, Flex, Type } from 'theme/base'
import { ALLOWED_COPYTRADE_PROTOCOLS, RELEASED_PROTOCOLS } from 'utils/config/constants'
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
  const protocols = useMemo(
    () => [
      ...ALLOWED_COPYTRADE_PROTOCOLS,
      ...RELEASED_PROTOCOLS.filter((e) => !ALLOWED_COPYTRADE_PROTOCOLS.includes(e)),
    ],
    []
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
