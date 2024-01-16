import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { GridProps } from 'styled-system'

import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import { useProtocolStore } from 'hooks/store/useProtocols'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex, Image, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { PROTOCOL_OPTIONS, ProtocolOptionProps } from 'utils/config/protocols'
import { parseProtocolImage } from 'utils/helpers/transform'
import { logEventSwitchProtocol } from 'utils/tracking/event'
import { getChainMetadata } from 'utils/web3/chains'

type SwitchProtocolComponentProps = {
  buttonSx?: SystemStyleObject & GridProps
  textSx?: SystemStyleObject & GridProps
  sx?: SystemStyleObject & GridProps
  onSwitch?: (protocol: ProtocolEnum) => void
}

export function HomeSwitchProtocols(props: SwitchProtocolComponentProps) {
  const { setSearchParams } = useSearchParams()
  const onSwitch =
    props.onSwitch ??
    ((protocol: ProtocolEnum) => {
      setSearchParams({ [URL_PARAM_KEYS.PROTOCOL]: protocol, [URL_PARAM_KEYS.EXPLORER_PAGE]: '1' })
    })
  return <SwitchProtocolsComponent {...props} onSwitch={onSwitch} />
}

export function RouteSwitchProtocol({
  componentProps,
  keepSearch = true,
}: {
  componentProps: SwitchProtocolComponentProps
  keepSearch?: boolean
}) {
  const history = useHistory()
  const { pathname, search } = useLocation()
  const onSwitch = (protocol: ProtocolEnum) => {
    const newRouteArray = pathname.split('/').filter((str) => !!str)
    const prevProtocol = newRouteArray[0]
    newRouteArray[0] = protocol
    const newRoute = '/' + newRouteArray.join('/') + (keepSearch ? search : '')
    history.push(newRoute, { prevProtocol })
  }
  return <SwitchProtocolsComponent {...componentProps} onSwitch={onSwitch} />
}

function SwitchProtocolsComponent({
  buttonSx,
  textSx,
  sx,
  onSwitch,
}: SwitchProtocolComponentProps & { onSwitch: (() => void) | ((protocol: ProtocolEnum) => void) }) {
  const { md } = useResponsive()
  const { myProfile } = useMyProfile()
  const { protocol } = useProtocolStore()

  const currentProtocolOption = PROTOCOL_OPTIONS.find((option) => option.id === protocol) ?? PROTOCOL_OPTIONS[0]
  const handleSwitchProtocol = useCallback(
    (protocol: ProtocolOptionProps) => {
      // setProtocol(protocol.id)
      onSwitch(protocol.id)

      logEventSwitchProtocol({ protocol: protocol?.id, username: myProfile?.username })
    },
    [myProfile?.username, onSwitch]
  )

  const renderProtocols = () => {
    return (
      <Box>
        {PROTOCOL_OPTIONS.map((option) => (
          <DropdownItem key={option.id} size="sm" onClick={() => handleSwitchProtocol(option)}>
            <Flex py={1} alignItems="center" sx={{ gap: 2 }}>
              <Image src={parseProtocolImage(option.id)} width={28} height={28} />
              <Flex flexDirection="column">
                <Type.Caption
                  lineHeight="16px"
                  color={currentProtocolOption.id === option.id ? 'primary1' : 'neutral1'}
                >
                  {option.text}
                </Type.Caption>
                <Type.Caption
                  lineHeight="16px"
                  color={currentProtocolOption.id === option.id ? 'primary1' : 'neutral3'}
                >
                  {getChainMetadata(option.chainId).label}
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
      buttonSx={
        md
          ? {
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
            }
          : { border: 'none', p: 0 }
      }
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
        {md && <Image src={parseProtocolImage(protocol)} width={28} height={28} />}
        <Box width={md ? 85 : 'auto'}>
          <Type.Caption display="block" lineHeight="16px" color="neutral1" sx={{ ...textSx }}>
            {currentProtocolOption.text}
          </Type.Caption>
          {md && (
            <Type.Caption display="block" lineHeight="16px" color="neutral3">
              {getChainMetadata(currentProtocolOption.chainId).label}
            </Type.Caption>
          )}
        </Box>
      </Flex>
    </Dropdown>
  )
}
