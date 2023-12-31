import { Trans } from '@lingui/macro'
import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import { GridProps } from 'styled-system'

import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, Image, Type } from 'theme/base'
import { PROTOCOL_OPTIONS, ProtocolOptionProps } from 'utils/config/protocols'
import { parseProtocolImage } from 'utils/helpers/transform'
import { getChainMetadata } from 'utils/web3/chains'

const SwitchProtocolsMobile = ({
  currentProtocol,
  changeCurrentProtocol,
  buttonSx,
  textSx,
  sx,
}: {
  buttonSx?: SystemStyleObject & GridProps
  textSx?: SystemStyleObject & GridProps
  sx?: SystemStyleObject & GridProps
  currentProtocol: ProtocolOptionProps
  changeCurrentProtocol: (data: ProtocolOptionProps) => void
}) => {
  const { md } = useResponsive()

  const renderProtocols = () => {
    return (
      <Box>
        {PROTOCOL_OPTIONS.map((protocol) => (
          <DropdownItem key={protocol.id} size="sm" onClick={() => changeCurrentProtocol(protocol)}>
            <Flex py={1} alignItems="center" sx={{ gap: 2 }}>
              <Image src={parseProtocolImage(protocol.id)} width={28} height={28} />
              <Flex flexDirection="column">
                <Type.Caption lineHeight="16px" color={currentProtocol.id === protocol.id ? 'primary1' : 'neutral1'}>
                  {protocol.text}
                </Type.Caption>
                <Type.Caption lineHeight="16px" color={currentProtocol.id === protocol.id ? 'primary1' : 'neutral3'}>
                  {getChainMetadata(protocol.chainId).label}
                </Type.Caption>
              </Flex>
            </Flex>
          </DropdownItem>
        ))}
      </Box>
    )
  }

  return (
    <Flex
      alignItems="center"
      px={3}
      sx={{
        gap: 2,
      }}
    >
      <Type.CaptionBold>
        <Trans>Protocols:</Trans>
      </Type.CaptionBold>
      <Dropdown
        menu={renderProtocols()}
        buttonVariant="ghost"
        buttonSx={{
          px: 2,
          mx: 0,
          pt: '8px',
          pb: '8px',
          border: 'none',
          borderRadius: 0,
          '&[disabled]': {
            cursor: 'not-allowed',
          },
          ...buttonSx,
        }}
        menuSx={{ width: 160 }}
        hasArrow={true}
        sx={{ minWidth: 'fit-content', ...sx }}
      >
        <Flex
          width="fit-content"
          alignItems="center"
          justifyContent="center"
          sx={{
            gap: 2,
          }}
        >
          <Image src={parseProtocolImage(currentProtocol.id)} width={24} height={24} />
          <Box width={65}>
            <Type.Caption display="block" lineHeight="16px" color="neutral1" sx={{ ...textSx }}>
              {currentProtocol.text}
            </Type.Caption>
            {md && (
              <Type.Caption display="block" lineHeight="16px" color="neutral3">
                {getChainMetadata(currentProtocol.chainId).label}
              </Type.Caption>
            )}
          </Box>
        </Flex>
      </Dropdown>
    </Flex>
  )
}

export default SwitchProtocolsMobile
