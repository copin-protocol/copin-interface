import { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import { Flex, Image, TextProps, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { ProtocolEnum } from 'utils/config/enums'
import { getProtocolDropdownImage } from 'utils/helpers/transform'

const ProtocolLogo = ({
  protocol,
  size = 18,
  textSx,
  sx,
  hasText = true,
  isActive = false,
  className,
  ...props
}: {
  protocol: ProtocolEnum
  size?: number
  textSx?: TextProps
  hasText?: boolean
  isActive?: boolean
  className?: string
} & BoxProps) => {
  const protocolOptionsMapping = useGetProtocolOptionsMapping()
  return (
    <Flex
      className={className}
      height={size}
      alignItems="center"
      sx={{ gap: 2, flexShrink: 0, ...(sx || {}) }}
      {...props}
    >
      <Image src={getProtocolDropdownImage({ protocol, isActive })} width={size} height={size} />
      {hasText && (
        <Type.Caption
          // sx={{
          //   textTransform: protocol === ProtocolEnum.GMX || protocol === ProtocolEnum.GMX_V2 ? 'uppercase' : 'capitalize',
          // }}
          lineHeight={`${size}px`}
          color="neutral2"
          {...textSx}
        >
          {/* {PROTOCOL_OPTIONS_MAPPING[protocol].text?.toLowerCase()} */}
          {protocolOptionsMapping[protocol]?.text}
        </Type.Caption>
      )}
    </Flex>
  )
}

export default ProtocolLogo
