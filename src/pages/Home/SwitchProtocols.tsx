import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import { useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { GridProps } from 'styled-system'

import { useOptionChange } from 'hooks/helpers/useOptionChange'
import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
import { useSelectBacktestTraders } from 'hooks/store/useSelectBacktestTraders'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, Image, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { PROTOCOL_OPTIONS, ProtocolOptionProps } from 'utils/config/protocols'
import ROUTES from 'utils/config/routes'
import { generateTopOpeningOrdersRoute } from 'utils/helpers/generateRoute'
import { parseProtocolImage } from 'utils/helpers/transform'
import { logEventSwitchProtocol } from 'utils/tracking/event'
import { getChainMetadata } from 'utils/web3/chains'

import useTradersContext from './useTradersContext'

const SwitchProtocols = ({
  buttonSx,
  textSx,
  sx,
}: {
  buttonSx?: SystemStyleObject & GridProps
  textSx?: SystemStyleObject & GridProps
  sx?: SystemStyleObject & GridProps
}) => {
  const { md } = useResponsive()
  const history = useHistory()
  const { myProfile } = useMyProfile()
  const { resetStore } = useSelectBacktestTraders()
  const { protocol: protocolParam } = useParams<{ protocol: ProtocolEnum }>()
  const { protocol: protocolStore, setProtocol } = useProtocolStore()
  const protocol = protocolParam ?? protocolStore
  const { setCurrentSuggestion, changeCurrentPage } = useTradersContext()
  const { currentOption, changeCurrentOption } = useOptionChange({
    optionName: 'protocol',
    options: PROTOCOL_OPTIONS,
    defaultOption: protocol,
    optionNameToBeDelete: ['protocol'],
  })

  const handleSwitchProtocol = useCallback(
    (protocol: ProtocolOptionProps) => {
      changeCurrentOption(protocol)
      setProtocol(protocol.id)
      resetStore()
      if (changeCurrentPage) {
        changeCurrentPage(1)
      }
      if (setCurrentSuggestion) {
        setCurrentSuggestion(undefined)
      }

      if (history.location.pathname.includes(ROUTES.TOP_OPENINGS.path_prefix)) {
        history.push(`/${generateTopOpeningOrdersRoute(protocol.id)}`, { replace: true })
      }

      //log
      logEventSwitchProtocol({ protocol: protocol?.id, username: myProfile?.username })
    },
    [
      changeCurrentOption,
      changeCurrentPage,
      history,
      myProfile?.username,
      resetStore,
      setCurrentSuggestion,
      setProtocol,
    ]
  )

  const renderProtocols = () => {
    return (
      <Box>
        {PROTOCOL_OPTIONS.map((protocol) => (
          <DropdownItem key={protocol.id} size="sm" onClick={() => handleSwitchProtocol(protocol)}>
            <Flex py={1} alignItems="center" sx={{ gap: 2 }}>
              <Image src={parseProtocolImage(protocol.id)} width={28} height={28} />
              <Flex flexDirection="column">
                <Type.Caption lineHeight="16px" color={currentOption.id === protocol.id ? 'primary1' : 'neutral1'}>
                  {protocol.text}
                </Type.Caption>
                <Type.Caption lineHeight="16px" color={currentOption.id === protocol.id ? 'primary1' : 'neutral3'}>
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
    <Dropdown
      menu={renderProtocols()}
      buttonVariant="ghost"
      buttonSx={{
        px: 2,
        mx: 0,
        pt: '8px',
        pb: '8px',
        borderTop: 'none',
        borderRadius: 0,
        borderColor: 'neutral4',
        '&:hover:not([disabled])': {
          borderColor: 'neutral4',
        },
        '&[disabled]': {
          borderColor: 'neutral4',
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
        <Image src={parseProtocolImage(currentOption.id)} width={28} height={28} />
        <Box width={85}>
          <Type.Caption display="block" lineHeight="16px" color="neutral1" sx={{ ...textSx }}>
            {currentOption.text}
          </Type.Caption>
          {md && (
            <Type.Caption display="block" lineHeight="16px" color="neutral3">
              {getChainMetadata(currentOption.chainId).label}
            </Type.Caption>
          )}
        </Box>
      </Flex>
    </Dropdown>
  )
}

export default SwitchProtocols
