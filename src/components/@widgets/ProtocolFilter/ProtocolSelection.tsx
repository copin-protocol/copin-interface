import { Trans } from '@lingui/macro'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getProtocolsStatistic } from 'apis/positionApis'
import SubscriptionIcon from 'components/@subscription/SubscriptionIcon'
import UpgradeButton from 'components/@subscription/UpgradeButton'
import useProtocolPermission from 'hooks/features/subscription/useProtocolPermission'
// import { getProtocolConfigs } from 'components/@widgets/SwitchProtocols/helpers'
import useDebounce from 'hooks/helpers/useDebounce'
import useGetProtocolOptions from 'hooks/helpers/useGetProtocolOptions'
import { useProtocolSortByStore } from 'hooks/store/useProtocolSortBy'
import { Button } from 'theme/Buttons'
import Checkbox from 'theme/Checkbox'
import { Box, Flex, Type } from 'theme/base'
import { ALLOWED_COPYTRADE_PROTOCOLS, RELEASED_PROTOCOLS, SEARCH_DEBOUNCE_TIME } from 'utils/config/constants'
import { ProtocolEnum, ProtocolSortByEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'
// import { ProtocolOptionProps } from 'utils/config/protocols'
import { Z_INDEX } from 'utils/config/zIndex'
import { formatNumber } from 'utils/helpers/format'
import { getItemsAndRequiredPlan } from 'utils/helpers/transform'

import InputSearchProtocols from './InputSearchProtocols'
import ListProtocolSelection from './ListProtocolSelection'
import ProtocolSortOptions from './ProtocolSortOptions'

interface ProtocolSelectionProps {
  selectedProtocols: ProtocolEnum[]
  checkIsProtocolChecked: (status: ProtocolEnum) => boolean
  handleToggleProtocol: (option: ProtocolEnum) => void
  allowList?: ProtocolEnum[]
  list?: ProtocolEnum[]
  setSelectedProtocols: (options: ProtocolEnum[], isClearAll?: boolean) => void
  hasSearch?: boolean
  handleToggleDropdown?: () => void
  shouldCheckPermission?: boolean
  restrictHeight?: number | string
}
// const DEFAULT_ALL_CHAINS = 0

export default function ProtocolSelection({
  setSelectedProtocols: setSavedProtocols,
  selectedProtocols: savedProtocols,
  checkIsProtocolChecked,
  handleToggleProtocol,
  allowList = ALLOWED_COPYTRADE_PROTOCOLS,
  list = RELEASED_PROTOCOLS,
  hasSearch = true,
  shouldCheckPermission = true,
  restrictHeight,
  handleToggleDropdown,
}: ProtocolSelectionProps) {
  const {
    allowedCopyTradeProtocols: _allowedCopyTradeProtocols,
    allowedSelectProtocols: _allowedSelectProtocols,
    pagePermission,
  } = useProtocolPermission()
  const protocolOptions = useGetProtocolOptions()
  const allowedSelectProtocols = shouldCheckPermission ? _allowedSelectProtocols : list
  const allowedCopyTradeProtocols = shouldCheckPermission ? _allowedCopyTradeProtocols : allowList
  const { protocolSortBy, setProtocolSortBy } = useProtocolSortByStore()
  const { data: protocolsStatistic } = useQuery([QUERY_KEYS.GET_PROTOCOLS_STATISTIC], getProtocolsStatistic)

  const [searchText, setSearchText] = useState<string>('')
  const trimmedSearchText = searchText.trim()
  const debounceSearchText = useDebounce<string>(trimmedSearchText, SEARCH_DEBOUNCE_TIME)
  const [selectedProtocols, setSelectedProtocols] = useState<ProtocolEnum[] | null>(savedProtocols)
  // const [selectedChainId, setSelectedChainId] = useState(DEFAULT_ALL_CHAINS)
  const [isUseAllowList, setIsUseAllowList] = useState(
    selectedProtocols?.every((protocol) => allowedCopyTradeProtocols.includes(protocol))
  )

  const protocolsByPlan = useMemo(() => {
    return getItemsAndRequiredPlan('protocolAllowed', pagePermission)
  }, [pagePermission])

  useEffect(() => {
    if (selectedProtocols?.some((protocol) => !allowedCopyTradeProtocols.includes(protocol))) {
      setIsUseAllowList(false)
    }
  }, [allowedCopyTradeProtocols, selectedProtocols])

  const checkIsSelected = (protocol: ProtocolEnum): boolean => {
    return !!selectedProtocols?.includes(protocol)
  }

  const handleToggle = (protocol: ProtocolEnum): void => {
    if (selectedProtocols?.includes(protocol)) {
      const filtered = selectedProtocols.filter((selected) => selected !== protocol)
      setSelectedProtocols(filtered)
      return
    }

    setSelectedProtocols([...(selectedProtocols ?? []), protocol])
  }

  const checkIsCheckedAll = (): boolean => {
    if (isUseAllowList) {
      return allowList.every((item) => !!selectedProtocols?.includes(item))
    }
    return protocolOptions.every((item) => !!selectedProtocols?.includes(item.id))
  }

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()

    if ((selectedProtocols?.length ?? 0) > 0) {
      setSelectedProtocols([])
    } else {
      setSelectedProtocols(allowedSelectProtocols)
    }
  }

  // const generatedProtocolOpts = useMemo((): ProtocolOptionProps[] => {
  //   if (selectedChainId == DEFAULT_ALL_CHAINS) {
  //     return protocolOptions.sort((a: ProtocolOptionProps, b: ProtocolOptionProps) => a.text.localeCompare(b.text))
  //   }

  //   return protocolConfigs.protocolsByChains[selectedChainId]
  // }, [selectedChainId])

  const options = useMemo(() => {
    const filteredOptions = protocolOptions.filter(
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
    } else if (protocolSortBy === ProtocolSortByEnum.OI) {
      sortedOptions.sort((a, b) => (protocolsStatistic?.[b.id]?.oi ?? 0) - (protocolsStatistic?.[a.id]?.oi ?? 0))
    }

    return sortedOptions
  }, [protocolOptions, protocolSortBy, protocolsStatistic, debounceSearchText])

  const isEqual = compareProtocols(savedProtocols, selectedProtocols ?? [])

  const allowedOptions = options.filter((option) => allowedSelectProtocols.includes(option.id))

  return (
    <Box sx={{ pl: 2, pr: [0, 2], pt: 2, position: 'relative', '.checkbox': { marginRight: '0px !important' } }}>
      {/* RENDER SEARCH BAR */}
      {hasSearch && (
        <Flex
          sx={{
            border: 'small',
            borderColor: 'neutral4',
            borderRadius: 'xs',
            mr: [2, 0],
          }}
        >
          <Box
            flex="1 0 0"
            sx={{ bg: 'neutral5', borderRight: ['none', 'small'], borderColor: ['neutral4', 'neutral4'] }}
          >
            <InputSearchProtocols searchText={searchText} setSearchText={setSearchText} />
          </Box>
          <ProtocolSortOptions currentSort={protocolSortBy} changeCurrentSort={setProtocolSortBy} />
        </Flex>
      )}

      {/* RENDER TOGGLE BUTTON */}
      <Box my="12px" pr={[2, restrictHeight ? 2 : 0]} pl={[2, restrictHeight ? 2 : 0]}>
        <Box
          display={['block', 'flex']}
          sx={{ gap: [1, 2], alignItems: 'center', justifyContent: 'space-between' }}
          flexWrap={'wrap'}
        >
          <Flex
            order="1"
            alignItems="center"
            justifyContent={['space-between', 'flex-start']}
            flexWrap="wrap"
            width="fit-content"
            sx={{ gap: [1, 2], mb: [12, 0] }}
          >
            <Type.Caption color="neutral3">
              <Trans>QUICK SELECT</Trans>:
            </Type.Caption>
            <Flex alignItems="center" flexWrap="wrap" sx={{ gap: ['6px', 2] }}>
              <Button
                size="xs"
                variant="info"
                onClick={() => {
                  setSelectedProtocols(allowedSelectProtocols)
                }}
                px={2}
                sx={{ color: 'neutral1', border: 'none' }}
              >
                <Type.Caption>All Perps</Type.Caption>
              </Button>
              <Button
                size="xs"
                variant="info"
                onClick={() => {
                  setSelectedProtocols(allowedCopyTradeProtocols)
                }}
                px={2}
                sx={{ color: 'neutral1', border: 'none' }}
              >
                <Type.Caption>Copyable Perps</Type.Caption>
              </Button>
            </Flex>
          </Flex>
          <Flex order="0" alignItems={'center'} sx={{ gap: [1, 2] }}>
            <Checkbox
              hasClear={(selectedProtocols?.length ?? 0) > 0}
              checked={checkIsCheckedAll()}
              onChange={(event) => handleSelectAll(event)}
              wrapperSx={{ height: 'auto' }}
            >
              <Type.Caption mx={2} color="neutral3">
                <Trans>SELECTED</Trans>:
              </Type.Caption>
              <Type.Caption color="neutral2">
                {`${formatNumber(selectedProtocols?.length)}`}/{formatNumber(allowedSelectProtocols.length)}
              </Type.Caption>
            </Checkbox>
          </Flex>
        </Box>
      </Box>

      <Box sx={{ maxHeight: restrictHeight, overflowY: restrictHeight ? 'auto' : undefined }}>
        <Box pb={2} pr={[2, 0]}>
          {shouldCheckPermission ? (
            <>
              <UpgradeButton sx={{ my: 2 }} showCurrentPlan showIcon={false} />
              {(allowedOptions.length > 0 || options.length === 0) && (
                <ListProtocolSelection
                  options={allowedOptions}
                  checkIsSelected={checkIsSelected}
                  protocolsStatistic={protocolsStatistic}
                  handleToggle={handleToggle}
                />
              )}
            </>
          ) : (
            <ListProtocolSelection
              options={protocolOptions}
              checkIsSelected={checkIsSelected}
              protocolsStatistic={protocolsStatistic}
              handleToggle={handleToggle}
            />
          )}

          {!!pagePermission &&
            shouldCheckPermission &&
            Object.keys(pagePermission).map((key) => {
              const availableProtocols = Object.keys(protocolsByPlan || {}).filter(
                (k) => protocolsByPlan[k] === key && !allowedSelectProtocols.includes(k as ProtocolEnum)
              )

              const availableOptions = options.filter((option) => availableProtocols.includes(option.id))

              if (!availableProtocols.length) return <></>

              if (!availableOptions.length) return <></>

              return (
                <Box key={key}>
                  <Flex sx={{ gap: 1, mt: 3, mb: 2, alignItems: 'center' }}>
                    <Type.CaptionBold>
                      <Trans>From</Trans>
                    </Type.CaptionBold>
                    <SubscriptionIcon plan={key as SubscriptionPlanEnum} />
                    <Type.CaptionBold>{SUBSCRIPTION_PLAN_TRANSLATION[key]}</Type.CaptionBold>
                  </Flex>
                  <ListProtocolSelection
                    options={availableOptions}
                    checkIsSelected={checkIsSelected}
                    protocolsStatistic={protocolsStatistic}
                    handleToggle={handleToggle}
                    isAvailable={false}
                  />
                </Box>
              )
            })}
        </Box>
      </Box>

      <Flex
        sx={{
          bottom: 0,
          width: '100%',
          borderTop: 'small',
          borderColor: 'neutral5',
          position: 'sticky',
          alignItems: 'center',
          justifyContent: 'flex-end',
          backgroundColor: 'neutral7',
          gap: [3, 24],
          height: 40,
          px: 3,
          zIndex: Z_INDEX.THEME_DROPDOWN,
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
            setSavedProtocols(selectedProtocols ?? [])
            handleToggleDropdown?.()
          }}
          sx={{
            fontWeight: 400,
            p: 0,
            '&:not(:disabled)': {
              fontWeight: 'bold',
              transform: 'scale(1.05)',
            },
          }}
          disabled={isEqual}
        >
          Apply & Save
        </Button>
      </Flex>
    </Box>
  )
}

const compareProtocols = (arr1: ProtocolEnum[], arr2: ProtocolEnum[]): boolean => {
  if (!arr1 || !arr2) return false
  if (arr1.length !== arr2.length) return false
  const sortedArr1 = [...arr1].sort()
  const sortedArr2 = [...arr2].sort()
  return sortedArr1.every((value, index) => value === sortedArr2[index])
}
