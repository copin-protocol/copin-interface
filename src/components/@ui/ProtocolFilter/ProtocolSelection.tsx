import { Trans } from '@lingui/macro'
import { User } from '@phosphor-icons/react'
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getProtocolsStatistic } from 'apis/positionApis'
import ActiveDot from 'components/@ui/ActiveDot'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { getProtocolConfigs } from 'components/@widgets/SwitchProtocols/helpers'
import useDebounce from 'hooks/helpers/useDebounce'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import { useProtocolFilter } from 'hooks/store/useProtocolFilter'
import ProtocolBetaWarning from 'pages/TraderDetails/ProtocolBetaWarning'
import { Button } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import { Box, Flex, Grid, IconBox, Type } from 'theme/base'
import { ALLOWED_COPYTRADE_PROTOCOLS, RELEASED_PROTOCOLS, SEARCH_DEBOUNCE_TIME } from 'utils/config/constants'
import { ProtocolEnum, ProtocolSortByEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { ProtocolOptionProps } from 'utils/config/protocols'
import { compactNumber, formatNumber } from 'utils/helpers/format'

import NoDataFound from '../NoDataFound'
import InputSearchProtocols from './InputSearchProtocols'
import ProtocolSortOptions from './ProtocolSortOptions'

interface ProtocolSelectionProps {
  selectedProtocols: ProtocolEnum[]
  checkIsProtocolChecked: (status: ProtocolEnum) => boolean
  handleToggleProtocol: (option: ProtocolEnum) => void
  allowList: ProtocolEnum[]
  setSelectedProtocols: (options: ProtocolEnum[], isClearAll?: boolean) => void
  hasSearch?: boolean
}
const DEFAULT_ALL_CHAINS = 0
const TOOLTIP_ID = `tt_1`

export default function ProtocolSelection({
  setSelectedProtocols: setSavedProtocols,
  selectedProtocols: savedProtocols,
  checkIsProtocolChecked,
  handleToggleProtocol,
  allowList,
  hasSearch = true,
}: ProtocolSelectionProps) {
  const { protocolSortBy, setProtocolSortBy } = useProtocolFilter()
  const { data: protocolsStatistic } = useQuery([QUERY_KEYS.GET_PROTOCOLS_STATISTIC], getProtocolsStatistic)

  const [searchText, setSearchText] = useState<string>('')
  const trimmedSearchText = searchText.trim()
  const debounceSearchText = useDebounce<string>(trimmedSearchText, SEARCH_DEBOUNCE_TIME)
  const [selectedProtocols, setSelectedProtocols] = useState(savedProtocols)
  const [selectedChainId, setSelectedChainId] = useState(DEFAULT_ALL_CHAINS)
  const [isUseAllowList, setIsUseAllowList] = useState(
    selectedProtocols.every((protocol) => ALLOWED_COPYTRADE_PROTOCOLS.includes(protocol))
  )

  useEffect(() => {
    if (selectedProtocols.some((protocol) => !ALLOWED_COPYTRADE_PROTOCOLS.includes(protocol))) {
      setIsUseAllowList(false)
    }
  }, [selectedProtocols])

  const checkIsSelected = (protocol: ProtocolEnum): boolean => {
    return selectedProtocols.includes(protocol)
  }

  const handleToggle = (protocol: ProtocolEnum): void => {
    if (selectedProtocols.includes(protocol)) {
      const filtered = selectedProtocols.filter((selected) => selected !== protocol)
      setSelectedProtocols(filtered)
      return
    }

    setSelectedProtocols([...selectedProtocols, protocol])
  }

  // ==========================> Protocol options <==============================
  const protocolOptions = useGetProtocolOptions()
  const protocolConfigs = getProtocolConfigs(protocolOptions)

  const checkIsCheckedAll = (): boolean => {
    if (isUseAllowList) {
      return allowList.every((item) => selectedProtocols.includes(item))
    }
    return generatedProtocolOpts.every((item) => selectedProtocols.includes(item.id))
  }

  const checkIsAllowedProtocol = (protocol: ProtocolEnum) => {
    return isUseAllowList ? allowList.includes(protocol) : true
  }

  const setSelectedProtocolsByAllowList = (protocols: ProtocolEnum[]) => {
    const filteredProtocols = protocols.filter((protocol) => allowList.includes(protocol))
    setSelectedProtocols(filteredProtocols)
  }

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()

    if (selectedProtocols.length > 0) {
      setSelectedProtocols([])
    } else {
      setSelectedProtocols(RELEASED_PROTOCOLS)
    }
  }

  const generatedProtocolOpts = useMemo((): ProtocolOptionProps[] => {
    if (selectedChainId == DEFAULT_ALL_CHAINS) {
      return protocolOptions.sort((a: ProtocolOptionProps, b: ProtocolOptionProps) => a.text.localeCompare(b.text))
    }

    return protocolConfigs.protocolsByChains[selectedChainId]
  }, [selectedChainId])

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

  const isEqual = useMemo(() => {
    const compareProtocols = (arr1: ProtocolEnum[], arr2: ProtocolEnum[]): boolean => {
      if (arr1.length !== arr2.length) return false
      const sortedArr1 = [...arr1].sort()
      const sortedArr2 = [...arr2].sort()
      return sortedArr1.every((value, index) => value === sortedArr2[index])
    }
    return compareProtocols(savedProtocols, selectedProtocols)
  }, [savedProtocols, selectedProtocols])

  return (
    <Box sx={{ px: 3, position: 'relative', '.checkbox': { marginRight: '0px !important' } }}>
      {/* RENDER SEARCH BAR */}
      {hasSearch && (
        <Box mt={3}>
          <InputSearchProtocols searchText={searchText} setSearchText={setSearchText} />
          {/*<SearchProtocols*/}
          {/*  protocols={protocolOptions.map((p) => p.id)}*/}
          {/*  checkIsProtocolChecked={checkIsSelected}*/}
          {/*  onSelect={(data) => {*/}
          {/*    handleToggle(data)*/}
          {/*  }}*/}
          {/*  checkIsAllowedProtocol={checkIsAllowedProtocol}*/}
          {/*/>*/}
        </Box>
      )}

      {/* RENDER CHAINS */}
      {/*<Grid*/}
      {/*  sx={{*/}
      {/*    gridTemplateColumns: ['repeat(auto-fill, minmax(180px, 1fr))', 'repeat(auto-fill, minmax(200px, 1fr))'],*/}
      {/*    gap: 1,*/}
      {/*  }}*/}
      {/*  my={3}*/}
      {/*>*/}
      {/*  <Box*/}
      {/*    px={2}*/}
      {/*    py={10}*/}
      {/*    sx={{*/}
      {/*      backgroundColor: selectedChainId == DEFAULT_ALL_CHAINS ? 'neutral5' : 'neutral6',*/}
      {/*      borderRadius: 'sm',*/}
      {/*      cursor: 'pointer',*/}
      {/*      '&:hover': {*/}
      {/*        backgroundColor: 'neutral4',*/}
      {/*      },*/}
      {/*    }}*/}
      {/*    onClick={() => setSelectedChainId(DEFAULT_ALL_CHAINS)}*/}
      {/*  >*/}
      {/*    <Flex alignItems="center" sx={{ gap: 2 }}>*/}
      {/*      <Image src={allProtocolsIcon} size={24} />*/}

      {/*      <Type.CaptionBold>{`All chains (${formatNumber(protocolOptions.length, 0)})`}</Type.CaptionBold>*/}
      {/*    </Flex>*/}
      {/*  </Box>*/}

      {/*  {protocolConfigs.chainOptions.map((chainOption, index) => {*/}
      {/*    const protocolsByChain = protocolConfigs.protocolsByChains[chainOption.chainIdNumber]*/}
      {/*    const protocolCount = protocolsByChain?.length ?? 0*/}

      {/*    return (*/}
      {/*      <ChainOptionBox*/}
      {/*        key={index}*/}
      {/*        index={index}*/}
      {/*        chainOption={chainOption}*/}
      {/*        selectedChainId={selectedChainId}*/}
      {/*        setSelectedChainId={setSelectedChainId}*/}
      {/*        protocolCount={protocolCount}*/}
      {/*      />*/}
      {/*    )*/}
      {/*  })}*/}
      {/*</Grid>*/}

      <Flex mt={3} alignItems="center" flexWrap="wrap" sx={{ gap: ['6px', 2] }}>
        <Type.CaptionBold color="neutral3">
          <Trans>Quick Search</Trans>:
        </Type.CaptionBold>
        <Button
          variant="info"
          onClick={() => {
            setSelectedProtocols(RELEASED_PROTOCOLS)
          }}
          px={[2, 3]}
          sx={{ color: 'neutral1', border: 'none' }}
        >
          All Perps
        </Button>
        <Button
          variant="info"
          onClick={() => {
            setSelectedProtocolsByAllowList(RELEASED_PROTOCOLS)
          }}
          px={[2, 3]}
          sx={{ color: 'neutral1', border: 'none' }}
        >
          All Copyable Perps
        </Button>
      </Flex>

      {/* RENDER TOGGLE BUTTON */}
      <Box my={2}>
        <Flex sx={{ gap: 2, alignItems: ['start', 'center'], justifyContent: 'space-between' }} flexWrap={'wrap'}>
          <Flex alignItems={'center'} sx={{ gap: 2 }}>
            <Checkbox
              hasClear={selectedProtocols.length > 0}
              checked={checkIsCheckedAll()}
              onChange={(event) => handleSelectAll(event)}
              wrapperSx={{ height: 'auto' }}
            >
              <Type.CaptionBold mx={2} color="neutral1">
                <Trans>Selected</Trans>:
              </Type.CaptionBold>
              <Type.CaptionBold color="neutral3">
                {`${formatNumber(selectedProtocols.length)}`}/{formatNumber(RELEASED_PROTOCOLS.length)}
              </Type.CaptionBold>
            </Checkbox>
          </Flex>
          <Box>
            <ProtocolSortOptions currentSort={protocolSortBy} changeCurrentSort={setProtocolSortBy} />
          </Box>
        </Flex>
      </Box>

      {/* RENDER PROTOCOLS */}
      {!options?.length && (
        <Box mt={3}>
          <NoDataFound />
        </Box>
      )}
      <Grid
        sx={{
          gridTemplateColumns: ['repeat(auto-fill, minmax(150px, 1fr))', 'repeat(auto-fill, minmax(150px, 1fr))'],
          gap: 1,
        }}
        mt={3}
      >
        {options.map((option) => {
          const protocol = option.id
          const isActive = checkIsSelected(protocol)
          const protocolStatistic = protocolsStatistic?.[protocol]

          return (
            <Box
              key={protocol}
              sx={{
                backgroundColor: 'neutral6',
                borderRadius: 'sm',
                '&:hover': {
                  backgroundColor: 'neutral5',
                  cursor: 'pointer',
                },
              }}
              onClick={() => handleToggle(protocol)}
            >
              <Flex
                alignItems="center"
                sx={{
                  py: 10,
                  px: 2,
                  gap: '6px',
                  backgroundColor: 'transparent',
                  color: 'neutral5',
                }}
              >
                <Checkbox key={protocol} checked={isActive} wrapperSx={{ height: 'auto' }} />

                <ProtocolLogo className="active" protocol={protocol} isActive={false} hasText={false} size={32} />

                <Flex width="100%" sx={{ gap: '5px', alignItems: 'center', position: 'relative' }}>
                  <Flex flexDirection={'column'} sx={{ justifyContent: 'space-between' }} mx={1}>
                    <Type.Caption color={'neutral1'}>{option.text}</Type.Caption>
                    <Flex alignItems={'center'}>
                      <Type.Small color={'neutral3'} mr={1}>
                        {compactNumber(protocolStatistic?.traders ?? 0, 2, true)}
                      </Type.Small>
                      <IconBox color="neutral3" icon={<User size={12} />} />
                    </Flex>
                  </Flex>

                  {/*{ALLOWED_COPYTRADE_PROTOCOLS.includes(protocol) && (*/}
                  {/*  <Box sx={{ position: 'absolute', top: 0, right: 0 }}>*/}
                  {/*    <ActiveDot tooltipId={`tt_allow_copy_${protocol}`} tooltipContent={<Trans>Allow Copy</Trans>} />*/}
                  {/*  </Box>*/}
                  {/*)}*/}
                  {protocol === ProtocolEnum.HYPERLIQUID && (
                    <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                      <ActiveDot
                        color="orange1"
                        tooltipId={`tt_warning_${protocol}`}
                        tooltipContent={<ProtocolBetaWarning protocol={protocol} />}
                      />
                    </Box>
                  )}

                  {/*{option.isCross ? (*/}
                  {/*  <img src={CrossTag} alt="cross" />*/}
                  {/*) : option.isNew ? (*/}
                  {/*  <img src={NewTag} alt="new" />*/}
                  {/*) : (*/}
                  {/*  <></>*/}
                  {/*)}*/}
                </Flex>
              </Flex>
            </Box>
          )
        })}
      </Grid>

      <Flex
        sx={{
          bottom: 0,
          width: '100%',
          position: 'sticky',
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: 'neutral7',
          gap: [3, 24],
          py: 3,
          px: 2,
          zIndex: 1000,
        }}
      >
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedProtocols(savedProtocols)
          }}
          sx={{ fontWeight: 400, p: 0 }}
          disabled={isEqual}
        >
          Reset
        </Button>
        <Button
          variant="ghostPrimary"
          onClick={() => {
            setSavedProtocols(selectedProtocols)
          }}
          sx={{ fontWeight: 400, p: 0 }}
        >
          Apply & Save
        </Button>
      </Flex>
    </Box>
  )
}
