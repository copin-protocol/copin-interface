import { Trans } from '@lingui/macro'

import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolOptionProps } from 'utils/config/protocols'
import { getChainMetadata } from 'utils/web3/chains'

const SwitchProtocolsDesktop = ({
  currentProtocol,
  changeCurrentProtocol,
}: {
  currentProtocol: ProtocolOptionProps
  changeCurrentProtocol: (data: ProtocolOptionProps) => void
}) => {
  const protocolOptions = useGetProtocolOptions()
  return (
    <Box width={130} height="fit-content" sx={{ border: 'small', borderRight: 'none', borderColor: 'neutral4' }}>
      <Type.CaptionBold px={3} py={2}>
        <Trans>Protocols:</Trans>
      </Type.CaptionBold>
      {protocolOptions.map((protocol) => {
        const isActive = currentProtocol.id === protocol.id
        return (
          <DropdownItem
            key={protocol.id}
            size="sm"
            onClick={() => changeCurrentProtocol(protocol)}
            sx={{ maxWidth: 130 }}
          >
            <Flex py={1} alignItems="center" sx={{ gap: 2 }}>
              <ProtocolLogo protocol={protocol.id} size={32} hasText={false} isActive={isActive} />
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
        )
      })}
    </Box>
  )
}

export default SwitchProtocolsDesktop
