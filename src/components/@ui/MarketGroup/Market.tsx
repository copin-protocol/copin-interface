import { SystemStyleObject } from '@styled-system/css'
import { GridProps } from 'styled-system'

import { Flex, Image } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { TOKEN_TRADE_SUPPORT } from 'utils/config/trades'
import { parseMarketImage } from 'utils/helpers/transform'

export default function Market({
  protocol,
  indexToken,
  size = 20,
  sx,
}: {
  protocol: ProtocolEnum
  indexToken: string
  size?: number
  sx?: SystemStyleObject & GridProps
}) {
  const symbol = TOKEN_TRADE_SUPPORT[protocol][indexToken]?.symbol
  if (!symbol) return <></>
  return (
    <Flex
      width={size}
      height={size}
      sx={{
        borderRadius: size / 2,
        overflow: 'hidden',
        flexShrink: 0,
        border: 'small',
        borderColor: 'neutral4',
        ...sx,
      }}
      alignItems="center"
      justifyContent="center"
    >
      <Image src={parseMarketImage(symbol)} sx={{ width: size, height: size }} />
    </Flex>
  )
}
