import { SystemStyleObject } from '@styled-system/css'
import React, { useCallback } from 'react'
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
import { getUserForTracking, logEvent } from 'utils/tracking/event'
import { EVENT_ACTIONS, EventCategory } from 'utils/tracking/types'
import { getChainMetadata } from 'utils/web3/chains'

import useTradersContext from './useTradersContext'

const SwitchProtocols = ({
  isMobile = false,
  buttonSx,
  textSx,
  sx,
}: {
  isMobile?: boolean
  buttonSx?: SystemStyleObject & GridProps
  textSx?: SystemStyleObject & GridProps
  sx?: SystemStyleObject & GridProps
}) => {
  const history = useHistory()
  const { myProfile } = useMyProfile()
  const { resetStore } = useSelectBacktestTraders()
  const { protocol: protocolParam } = useParams<{ protocol: ProtocolEnum }>()
  const { protocol: protocolStore, setProtocol } = useProtocolStore()
  const protocol = protocolParam ?? protocolStore
  const { setCurrentSuggestion } = useTradersContext()
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
      if (setCurrentSuggestion) {
        setCurrentSuggestion(undefined)
      }

      if (history.location.pathname.includes(ROUTES.TOP_OPENINGS.path_prefix)) {
        history.push(`/${generateTopOpeningOrdersRoute(protocol.id)}`, { replace: true })
      }

      //log
      logEvent({
        category: EventCategory.MULTI_CHAIN,
        action:
          protocol.id === ProtocolEnum.GMX
            ? EVENT_ACTIONS[EventCategory.MULTI_CHAIN].SWITCH_GMX
            : EVENT_ACTIONS[EventCategory.MULTI_CHAIN].SWITCH_KWENTA,
        label: getUserForTracking(myProfile?.username),
      })
    },
    [changeCurrentOption, history, myProfile?.username, resetStore, setCurrentSuggestion, setProtocol]
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
        px: isMobile ? 2 : 3,
        mx: 0,
        pt: isMobile ? '5px' : '8px',
        pb: isMobile ? '10px' : '8px',
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
      menuSx={{ width: isMobile ? 125 : 150 }}
      hasArrow={true}
      sx={{ height: isMobile ? '48px' : undefined, minWidth: 'fit-content', ...sx }}
    >
      <Flex
        width="fit-content"
        alignItems="center"
        justifyContent="center"
        sx={{
          gap: 2,
        }}
      >
        <Image src={parseProtocolImage(currentOption.id)} width={isMobile ? 18 : 28} height={isMobile ? 18 : 28} />
        <Box width={'60px'}>
          <Type.Caption display="block" lineHeight="16px" color="neutral1" sx={{ ...textSx }}>
            {currentOption.text}
          </Type.Caption>
          <Type.Caption display="block" lineHeight="16px" color="neutral3">
            {getChainMetadata(currentOption.chainId).label}
          </Type.Caption>
        </Box>
      </Flex>
    </Dropdown>
  )
}

export default SwitchProtocols
