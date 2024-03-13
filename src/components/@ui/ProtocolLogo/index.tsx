import { Flex, Image, TextProps, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import { parseProtocolImage } from 'utils/helpers/transform'

// TODO: Check when add new protocol
const ProtocolLogo = ({
  protocol,
  size = 18,
  textSx,
  sx,
  ...props
}: { protocol: ProtocolEnum; size?: number; textSx?: TextProps } & BoxProps) => {
  return (
    <Flex height={size} alignItems="center" sx={{ gap: 2, ...(sx || {}) }} {...props}>
      <Image src={parseProtocolImage(protocol)} width={size} height={size} />
      <Type.Caption
        // sx={{
        //   textTransform: protocol === ProtocolEnum.GMX || protocol === ProtocolEnum.GMX_V2 ? 'uppercase' : 'capitalize',
        // }}
        lineHeight={`${size}px`}
        color="neutral2"
        {...textSx}
      >
        {/* {PROTOCOL_OPTIONS_MAPPING[protocol].text?.toLowerCase()} */}
        {PROTOCOL_OPTIONS_MAPPING[protocol].text}
      </Type.Caption>
    </Flex>
  )
}

export default ProtocolLogo
