import { Trans } from '@lingui/macro'
import { User } from '@phosphor-icons/react'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getProtocolsStatistic } from 'apis/positionApis'
import allProtocolsIcon from 'assets/icons/ic_protocols.svg'
import CrossTag from 'assets/images/cross_tag.svg'
import NewTag from 'assets/images/new_tag.svg'
import ActiveDot from 'components/@ui/ActiveDot'
import ProtocolLogo from 'components/@ui/ProtocolLogo'
import { getProtocolConfigs } from 'components/@widgets/SwitchProtocols/helpers'
import useGetProtocolOptions, { useGetProtocolOptionsMapping } from 'hooks/helpers/useGetProtocolOptions'
import Checkbox from 'theme/Checkbox'
import { SwitchInput } from 'theme/SwitchInput/SwitchInputField'
import Tooltip from 'theme/Tooltip'
import { Box, Flex, Grid, IconBox, Image, Type } from 'theme/base'
import { ALLOWED_COPYTRADE_PROTOCOLS } from 'utils/config/constants'
import { ProtocolEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { ProtocolOptionProps } from 'utils/config/protocols'
import { compactNumber, formatNumber } from 'utils/helpers/format'

import ChainOptionBox from './ChainOption'
import SearchProtocols from './SearchProtocols'

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
  setSelectedProtocols,
  selectedProtocols,
  checkIsProtocolChecked,
  handleToggleProtocol,
  allowList,
  hasSearch = true,
}: ProtocolSelectionProps) {
  const { data: protocolsStatistic } = useQuery([QUERY_KEYS.GET_PROTOCOLS_STATISTIC], getProtocolsStatistic)

  const [selectedChainId, setSelectedChainId] = useState(DEFAULT_ALL_CHAINS)
  const [isUseAllowList, setIsUseAllowList] = useState(
    selectedProtocols.every((protocol) => ALLOWED_COPYTRADE_PROTOCOLS.includes(protocol))
  )

  useEffect(() => {
    if (selectedProtocols.some((protocol) => !ALLOWED_COPYTRADE_PROTOCOLS.includes(protocol))) {
      setIsUseAllowList(false)
    }
  }, [selectedProtocols])

  // ==========================> Protocol options <==============================
  const protocolOptions = useGetProtocolOptions()
  const protocolsMapping = useGetProtocolOptionsMapping()
  const protocolConfigs = getProtocolConfigs(protocolOptions)

  // ==========================> Protocol options <==============================

  const getSelectedChainName = (): string => {
    if (selectedChainId == DEFAULT_ALL_CHAINS) return 'All'

    return protocolOptions.find((item) => item.chainId == selectedChainId)?.label ?? 'N/A'
  }

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

    const isSelectAll = event.target.checked
    const options = generatedProtocolOpts.map((p) => p.id)

    if (isSelectAll) {
      let fullOptions = Array.from(new Set([...selectedProtocols, ...options]))
      if (isUseAllowList) {
        fullOptions = fullOptions.filter((protocol) => allowList.includes(protocol))
      }
      setSelectedProtocols(fullOptions)
    } else {
      const uniqueItems = selectedProtocols.filter((element) => !options.includes(element))
      setSelectedProtocols(uniqueItems, true)
    }
  }

  const generatedProtocolOpts = useMemo((): ProtocolOptionProps[] => {
    if (selectedChainId == DEFAULT_ALL_CHAINS) {
      return protocolOptions.sort((a: ProtocolOptionProps, b: ProtocolOptionProps) => a.text.localeCompare(b.text))
    }

    return protocolConfigs.protocolsByChains[selectedChainId]
  }, [selectedChainId])

  const renderTooltipBody = useMemo(() => {
    const protocolCounter: { [key: string]: string[] } = {}

    for (let i = 0; i < selectedProtocols.length; i++) {
      const selectedProtocol = selectedProtocols[i]
      const { label, text } = protocolsMapping[selectedProtocol]

      if (!protocolCounter[label]) {
        protocolCounter[label] = [text]
        continue
      }

      protocolCounter[label] = [...protocolCounter[label], text]
    }

    return Object.keys(protocolCounter).map((chain) => (
      <Box p={2} key={chain}>
        <Type.BodyBold>{chain}</Type.BodyBold>
        <Type.Body color={'neutral2'}>{`: ${protocolCounter[chain].join(', ')}`}</Type.Body>
      </Box>
    ))
  }, [selectedProtocols])

  const options = generatedProtocolOpts

  return (
    <Box sx={{ px: 3, pb: 3, pt: 3, '.checkbox': { marginRight: '0px !important' } }}>
      {/* RENDER SEARCH BAR */}
      {hasSearch && (
        <Box>
          <SearchProtocols
            protocols={protocolOptions.map((p) => p.id)}
            checkIsProtocolChecked={checkIsProtocolChecked}
            onSelect={(data) => {
              handleToggleProtocol(data)
            }}
            checkIsAllowedProtocol={checkIsAllowedProtocol}
          />
        </Box>
      )}

      {/* RENDER CHAINS */}
      <Grid
        sx={{
          gridTemplateColumns: ['repeat(auto-fill, minmax(180px, 1fr))', 'repeat(auto-fill, minmax(200px, 1fr))'],
          gap: 1,
        }}
        my={3}
      >
        <Box
          px={2}
          py={10}
          sx={{
            backgroundColor: selectedChainId == DEFAULT_ALL_CHAINS ? 'neutral5' : 'neutral6',
            borderRadius: 'sm',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'neutral4',
            },
          }}
          onClick={() => setSelectedChainId(DEFAULT_ALL_CHAINS)}
        >
          <Flex alignItems="center" sx={{ gap: 2 }}>
            <Image src={allProtocolsIcon} size={24} />

            <Type.CaptionBold>{`All chains (${formatNumber(protocolOptions.length, 0)})`}</Type.CaptionBold>
          </Flex>
        </Box>

        {protocolConfigs.chainOptions.map((chainOption, index) => {
          const protocolsByChain = protocolConfigs.protocolsByChains[chainOption.chainIdNumber]
          const protocolCount = protocolsByChain?.length ?? 0

          return (
            <ChainOptionBox
              key={index}
              index={index}
              chainOption={chainOption}
              selectedChainId={selectedChainId}
              setSelectedChainId={setSelectedChainId}
              protocolCount={protocolCount}
            />
          )
        })}
      </Grid>

      {/* RENDER TOGGLE BUTTON */}
      <Box my={3}>
        <Flex sx={{ gap: 2, alignItems: ['start', 'center'], justifyContent: 'space-between' }} flexWrap={'wrap'}>
          <Flex alignItems={'center'} sx={{ gap: 2, width: ['29svw', '20svw', '15svw', '10svw'] }}>
            <Checkbox
              checked={checkIsCheckedAll()}
              onChange={(event) => handleSelectAll(event)}
              wrapperSx={{ height: 'auto' }}
            >
              <Type.CaptionBold ml={2} color="neutral1">
                <Trans>{`${getSelectedChainName} Perp DEXs`}</Trans>
              </Type.CaptionBold>
            </Checkbox>
          </Flex>

          <Type.CaptionBold color="neutral1">
            <Trans>Selected: {`${selectedProtocols.length}`} Perp DEXs</Trans>
          </Type.CaptionBold>

          <Flex sx={{ gap: 2, alignItems: 'center' }}>
            {/* {xl && <Box sx={{ backgroundColor: 'neutral5', height: 12, width: 2 }} />} */}

            <SwitchInput
              checked={isUseAllowList}
              onChange={(event) => {
                const value = event.target.checked
                setIsUseAllowList(value)

                if (value) {
                  setSelectedProtocolsByAllowList(selectedProtocols)
                }
              }}
            />
            <Type.CaptionBold color="neutral1">
              <Trans>Only Allowed CopyTrade Perp DEXs</Trans>
            </Type.CaptionBold>
          </Flex>
        </Flex>
      </Box>

      {selectedProtocols.length > 0 && (
        <Tooltip id={TOOLTIP_ID} place="bottom" type="dark" effect="solid" clickable={true}>
          <Type.CaptionBold maxHeight={300} maxWidth={['45svw']} overflow={'auto'} color="neutral1">
            {renderTooltipBody}
          </Type.CaptionBold>
        </Tooltip>
      )}

      {/* RENDER PROTOCOLS */}
      <Grid
        sx={{
          gridTemplateColumns: ['repeat(auto-fill, minmax(180px, 1fr))', 'repeat(auto-fill, minmax(200px, 1fr))'],
          gap: 1,
        }}
        my={3}
      >
        {options.map((option) => {
          const protocol = option.id
          const isActive = checkIsProtocolChecked(protocol)
          const isAllowedProtocol = checkIsAllowedProtocol(protocol)
          const protocolStatistic = protocolsStatistic?.[protocol]

          return (
            <Box
              key={protocol}
              sx={{
                backgroundColor: 'neutral6',
                borderRadius: 'sm',
                '&:hover': {
                  backgroundColor: 'neutral5',
                  cursor: isAllowedProtocol ? 'pointer' : 'not-allowed',
                },
              }}
              onClick={() => isAllowedProtocol && handleToggleProtocol(protocol)}
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
                <Checkbox
                  key={protocol}
                  checked={isActive}
                  wrapperSx={{ height: 'auto' }}
                  disabled={!isAllowedProtocol}
                />

                <ProtocolLogo
                  className="active"
                  protocol={protocol}
                  isActive={isActive}
                  hasText={false}
                  size={40}
                  disabled={!isAllowedProtocol}
                />

                <Flex sx={{ gap: '5px', alignItems: 'flex-start' }}>
                  <Flex flexDirection={'column'} sx={{ justifyContent: 'space-between' }} mx={1}>
                    <Type.Caption lineHeight="16px" color={isAllowedProtocol ? 'neutral1' : 'neutral3'}>
                      {option.text}
                    </Type.Caption>
                    <Flex alignItems={'center'}>
                      <Type.Caption lineHeight="16px" color={'neutral3'} mr={1}>
                        {compactNumber(protocolStatistic?.traders ?? 0, 2, true)}
                      </Type.Caption>
                      <IconBox color="neutral3" icon={<User size={12} />} />
                    </Flex>
                  </Flex>

                  {ALLOWED_COPYTRADE_PROTOCOLS.includes(protocol) && (
                    <Box py={1} mx={1}>
                      <ActiveDot tooltipId={`tt_allow_copy_${protocol}`} tooltipContent={<Trans>Allow Copy</Trans>} />
                    </Box>
                  )}

                  {option.isCross ? (
                    <img src={CrossTag} alt="cross" />
                  ) : option.isNew ? (
                    <img src={NewTag} alt="new" />
                  ) : (
                    <></>
                  )}
                </Flex>
              </Flex>
            </Box>
          )
        })}
      </Grid>
    </Box>
  )
}
