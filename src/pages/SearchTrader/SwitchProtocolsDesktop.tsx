import { Trans } from '@lingui/macro'

import { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, Image, Type } from 'theme/base'
import { PROTOCOL_OPTIONS, ProtocolOptionProps } from 'utils/config/protocols'
import { parseProtocolImage } from 'utils/helpers/transform'
import { getChainMetadata } from 'utils/web3/chains'

const SwitchProtocolsDesktop = ({
  currentProtocol,
  changeCurrentProtocol,
}: {
  currentProtocol: ProtocolOptionProps
  changeCurrentProtocol: (data: ProtocolOptionProps) => void
}) => {
  return (
    <Box width={130} height="fit-content" sx={{ border: 'small', borderRight: 'none', borderColor: 'neutral4' }}>
      <Type.CaptionBold px={3} py={2}>
        <Trans>Protocols:</Trans>
      </Type.CaptionBold>
      {PROTOCOL_OPTIONS.map((protocol) => (
        <DropdownItem
          key={protocol.id}
          size="sm"
          onClick={() => changeCurrentProtocol(protocol)}
          sx={{ maxWidth: 130 }}
        >
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

export default SwitchProtocolsDesktop
