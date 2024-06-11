import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import React, { useCallback, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { GridProps } from 'styled-system'

import CrossTag from 'assets/images/cross_tag.svg'
import NewTag from 'assets/images/new_tag.svg'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import useProtocolRecentSearch from 'hooks/store/useProtocolRecentSearch'
import { useProtocolStore } from 'hooks/store/useProtocols'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { ProtocolEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import { ProtocolOptionProps } from 'utils/config/protocols'
import { formatNumber } from 'utils/helpers/format'
import { logEventSwitchProtocol } from 'utils/tracking/event'
import { CHAINS } from 'utils/web3/chains'

import SearchProtocols from './SearchProtocols'

type SwitchProtocolComponentProps = {
  buttonSx?: SystemStyleObject & GridProps
  textSx?: SystemStyleObject & GridProps
  sx?: SystemStyleObject & GridProps
  onSwitch?: (protocol: ProtocolEnum) => void
  showIcon?: boolean
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
  componentProps = {},
  keepSearch = true,
}: {
  componentProps?: SwitchProtocolComponentProps
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
  showIcon = false,
}: SwitchProtocolComponentProps & { onSwitch: (() => void) | ((protocol: ProtocolEnum) => void) }) {
  const { md, lg } = useResponsive()
  const { myProfile } = useMyProfile()
  const { protocolRecentSearch, addProtocolRecentSearch } = useProtocolRecentSearch()
  const { protocol } = useProtocolStore()
  const protocolOptions = useGetProtocolOptions()
  const protocols = protocolOptions.map((option) => option.id)

  const uniqueChains = useMemo(() => {
    const protocolCountMap = protocolOptions.reduce((acc: any, option) => {
      if (!acc[option.chainId]) {
        acc[option.chainId] = { name: option.label, count: 0 }
      }
      acc[option.chainId].count += 1
      return acc
    }, {})

    return Object.keys(protocolCountMap)
      .map((chainId) => ({
        chainId: Number(chainId),
        name: protocolCountMap[chainId].name,
        count: protocolCountMap[chainId].count,
      }))
      .sort((x, y) =>
        x.name.toLowerCase() < y.name.toLowerCase() ? -1 : x.name.toLowerCase() > y.name.toLowerCase() ? 1 : 0
      )
  }, [protocolOptions])

  const currentProtocolOption = protocolOptions.find((option) => option.id === protocol) ?? protocolOptions[0]
  const handleSwitchProtocol = useCallback(
    (protocol: ProtocolOptionProps) => {
      // setProtocol(protocol.id)
      onSwitch(protocol.id)

      logEventSwitchProtocol({ protocol: protocol?.id, username: myProfile?.username })
    },
    [myProfile?.username, onSwitch]
  )

  const [visible, setVisible] = useState(false)

  const handleSelectProtocol = (data: ProtocolEnum) => {
    const option = protocolOptions.find((option) => option.id === data)
    if (!option) return
    handleSwitchProtocol(option)
  }

  const renderProtocols = () => {
    return (
      <Box>
        <Box sx={{ px: 3, pb: 3, pt: 3 }}>
          <SearchProtocols
            protocols={protocols}
            onSelect={(data) => {
              handleSelectProtocol(data)
              addProtocolRecentSearch(data)
            }}
          />
          {protocolRecentSearch.length > 0 && (
            <Flex mt={3} alignItems="center" sx={{ gap: [2, 3] }}>
              <Type.Caption>Recent searches:</Type.Caption>
              {protocolRecentSearch.map((data) => {
                return (
                  <Box
                    key={data.protocol}
                    onClick={() => handleSelectProtocol(data.protocol)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <ProtocolLogo protocol={data.protocol} isActive={false} hasText={false} size={lg ? 32 : 24} />
                  </Box>
                )
              })}
            </Flex>
          )}
        </Box>
        <Flex flexDirection={lg ? 'row' : 'column'}>
          {uniqueChains.map((e, index) => {
            const protocolsByChain = protocolOptions
              .filter((option) => option.chainId === e.chainId)
              .sort((x, y) =>
                x.text.toLowerCase() < y.text.toLowerCase() ? -1 : x.text.toLowerCase() > y.text.toLowerCase() ? 1 : 0
              )
            return (
              <Flex
                key={e.chainId}
                flexDirection="column"
                sx={{
                  pt: 3,
                  borderTop: 'small',
                  borderRight: lg && index < uniqueChains.length - 1 ? 'small' : 'none',
                  borderColor: 'neutral4',
                  width: lg ? 168 : '100%',
                }}
              >
                <Flex px={10} pb={2} alignItems="center" sx={{ gap: 2 }}>
                  <img width={24} height={24} src={`/images/chains/${CHAINS[e.chainId].icon}.png`} alt={e.name} />
                  <Type.CaptionBold>
                    {e.name} ({formatNumber(e.count, 0)})
                  </Type.CaptionBold>
                </Flex>
                <Flex flexDirection="column">
                  {protocolsByChain.map((option) => {
                    const isActive = currentProtocolOption.id === option.id
                    return (
                      <Box key={option.id}>
                        <Flex
                          alignItems="center"
                          sx={{
                            py: 2,
                            pl: 20,
                            gap: '6px',
                            cursor: 'pointer',
                            backgroundColor: isActive ? 'neutral5' : 'transparent',
                            color: 'neutral3',
                            '.active': {
                              display: isActive ? 'flex' : 'none !important',
                            },
                            '.inactive': {
                              display: isActive ? 'none !important' : 'flex',
                            },
                            '&:hover': {
                              color: 'neutral1',
                              '.active': {
                                display: 'flex !important',
                              },
                              '.inactive': {
                                display: 'none !important',
                              },
                            },
                          }}
                          onClick={() => handleSwitchProtocol(option)}
                        >
                          <ProtocolLogo
                            className="active"
                            protocol={option.id}
                            isActive={true}
                            hasText={false}
                            size={24}
                          />
                          <ProtocolLogo
                            className="inactive"
                            protocol={option.id}
                            isActive={false}
                            hasText={false}
                            size={24}
                          />
                          <Type.Caption lineHeight="16px" color={isActive ? 'primary1' : undefined}>
                            {option.text}
                          </Type.Caption>
                          {option.isCross ? (
                            <img src={CrossTag} alt="cross" />
                          ) : option.isNew ? (
                            <img src={NewTag} alt="new" />
                          ) : (
                            <></>
                          )}
                        </Flex>
                      </Box>
                    )
                  })}
                </Flex>
              </Flex>
            )
          })}
        </Flex>
        {/*{protocolOptions.map((option) => {*/}
        {/*  if (!option) {*/}
        {/*    return null*/}
        {/*  }*/}
        {/*  const isActive = currentProtocolOption.id === option.id*/}
        {/*  return (*/}
        {/*    <DropdownItem key={option.id} size="sm" onClick={() => handleSwitchProtocol(option)}>*/}
        {/*      <Flex py={1} alignItems="center" sx={{ gap: 2 }}>*/}
        {/*        <ProtocolLogo protocol={option.id} isActive={isActive} hasText={false} size={32} />*/}
        {/*        <Flex flexDirection="column">*/}
        {/*          <Type.Caption lineHeight="16px" color={isActive ? 'primary1' : 'neutral1'}>*/}
        {/*            {option.text}*/}
        {/*          </Type.Caption>*/}
        {/*          <Type.Caption lineHeight="16px" color={isActive ? 'primary1' : 'neutral3'}>*/}
        {/*            {getChainMetadata(option.chainId).label}*/}
        {/*          </Type.Caption>*/}
        {/*        </Flex>*/}
        {/*      </Flex>*/}
        {/*    </DropdownItem>*/}
        {/*  )*/}
        {/*})}*/}
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
              ...(buttonSx ?? {}),
            }
          : { borderRadius: 0, border: 'none', p: 0, ...(buttonSx ?? {}) }
      }
      menuSx={{ width: 'max-content', maxWidth: '95svw', maxHeight: '80svh', py: 2, overflowY: 'auto' }}
      sx={{ minWidth: 'fit-content', ...(sx ?? {}) }}
      hasArrow={true}
      dismissible={false}
      menuDismissible
      visible={visible}
      setVisible={setVisible}
    >
      <ProtocolLogo protocol={protocol} isActive={true} hasText={true} size={32} />
    </Dropdown>
  )
}
