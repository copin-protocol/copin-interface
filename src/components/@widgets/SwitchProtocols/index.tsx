import { SystemStyleObject } from '@styled-system/css'
import { useResponsive } from 'ahooks'
import { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useLocation } from 'react-router-dom'
import { GridProps } from 'styled-system'

import { getProtocolsStatistic } from 'apis/positionApis'
import InputSearchProtocols from 'components/@ui/ProtocolFilter/InputSearchProtocols'
import ListProtocolSelection from 'components/@ui/ProtocolFilter/ListProtocolSelection'
import ProtocolSortOptions from 'components/@ui/ProtocolFilter/ProtocolSortOptions'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import useDebounce from 'hooks/helpers/useDebounce'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import useSearchParams from 'hooks/router/useSearchParams'
import useMyProfile from 'hooks/store/useMyProfile'
import useProtocolRecentSearch from 'hooks/store/useProtocolRecentSearch'
import { useProtocolSortByStore } from 'hooks/store/useProtocolSortBy'
import { useProtocolStore } from 'hooks/store/useProtocols'
import Dropdown from 'theme/Dropdown'
import { Box, Flex, Type } from 'theme/base'
import { SEARCH_DEBOUNCE_TIME } from 'utils/config/constants'
import { ProtocolEnum, ProtocolSortByEnum } from 'utils/config/enums'
import { QUERY_KEYS, URL_PARAM_KEYS } from 'utils/config/keys'
import { ProtocolOptionProps } from 'utils/config/protocols'
import { logEventSwitchProtocol } from 'utils/tracking/event'

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
  const { md, xl } = useResponsive()
  const { myProfile } = useMyProfile()
  const { protocolRecentSearch, addProtocolRecentSearch } = useProtocolRecentSearch()
  const { protocol } = useProtocolStore()
  const protocolOptions = useGetProtocolOptions()

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
    setVisible(false)
    handleSwitchProtocol(option)
    if (searchText) {
      addProtocolRecentSearch(option.id)
    }
  }

  const { data: protocolsStatistic } = useQuery([QUERY_KEYS.GET_PROTOCOLS_STATISTIC], getProtocolsStatistic)

  const { protocolSortBy, setProtocolSortBy } = useProtocolSortByStore()
  const [searchText, setSearchText] = useState<string>('')
  const trimmedSearchText = searchText.trim()
  const debounceSearchText = useDebounce<string>(trimmedSearchText, SEARCH_DEBOUNCE_TIME)

  const generatedProtocolOpts = useMemo((): ProtocolOptionProps[] => {
    // if (selectedChainId == DEFAULT_ALL_CHAINS) {
    return protocolOptions.sort((a: ProtocolOptionProps, b: ProtocolOptionProps) => a.text.localeCompare(b.text))
    // }

    // return protocolConfigs.protocolsByChains[selectedChainId]
  }, [protocolOptions])

  const options = useMemo(() => {
    const filteredOptions = generatedProtocolOpts.filter(
      (option) =>
        option.text.toLowerCase().includes(debounceSearchText.toLowerCase()) ||
        option.id.toLowerCase().includes(debounceSearchText.toLowerCase()) ||
        option.label.toLowerCase().includes(debounceSearchText.toLowerCase()) ||
        option.key.toLowerCase().includes(debounceSearchText.toLowerCase())
    )

    const sortedOptions = [...filteredOptions]

    if (protocolSortBy === ProtocolSortByEnum.ALPHABET) {
      sortedOptions.sort((a, b) => a.text.localeCompare(b.text))
    } else if (protocolSortBy === ProtocolSortByEnum.TRADERS) {
      sortedOptions.sort(
        (a, b) => (protocolsStatistic?.[b.id]?.traders ?? 0) - (protocolsStatistic?.[a.id]?.traders ?? 0)
      )
    }

    return sortedOptions
  }, [generatedProtocolOpts, protocolSortBy, protocolsStatistic, debounceSearchText])

  const checkIsSelected = (protocol: ProtocolEnum) => {
    return protocol === currentProtocolOption.id
  }

  const renderProtocols = () => {
    return (
      <Box>
        <Box sx={{ px: 3, pt: 3, position: 'sticky', top: 0, left: 0, bg: 'neutral7', zIndex: 2 }}>
          <Box mt={3}>
            <InputSearchProtocols searchText={searchText} setSearchText={setSearchText} />
          </Box>
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
                    <ProtocolLogo protocol={data.protocol} isActive={false} hasText={false} size={md ? 32 : 24} />
                  </Box>
                )
              })}
            </Flex>
          )}
        </Box>

        <Flex sx={{ justifyContent: 'end', py: 12, px: 3 }}>
          <ProtocolSortOptions currentSort={protocolSortBy} changeCurrentSort={setProtocolSortBy} />
        </Flex>

        <Box px={3} pb={3}>
          <ListProtocolSelection
            options={options}
            checkIsSelected={checkIsSelected}
            protocolsStatistic={protocolsStatistic}
            handleToggle={handleSelectProtocol}
            hasCheckBox={false}
            itemActiveSx={{ bg: 'neutral5' }}
          />
        </Box>
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
      menuSx={{ width: '100vw', maxWidth: '900px', maxHeight: '80svh', py: 2, overflowY: 'auto' }}
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
