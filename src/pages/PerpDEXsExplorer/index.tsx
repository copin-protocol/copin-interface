import { Trans } from '@lingui/macro'
import { Compass, PresentationChart } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getPerpDexStatisticApi } from 'apis/perpDex'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import DirectionButton from 'components/@ui/DirectionButton'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import PerpDexLogo from 'components/@ui/PerpDexLogo'
import IconGroup from 'components/@widgets/IconGroup'
import Icon from 'components/@widgets/IconGroup/Icon'
import { PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import useSearchParams from 'hooks/router/useSearchParams'
import {
  DEFAULT_COLUMN_KEYS,
  DEFAULT_COLUMN_KEYS_MOBILE,
  usePerpsExplorerListColumns,
  usePerpsExplorerTableColumns,
} from 'hooks/store/usePerpsCustomizeColumns'
import { BodyWrapperMobile, BottomWrapperMobile } from 'pages/@layouts/Components'
import { OVERVIEW_WIDTH } from 'pages/Home/configs'
import FilterButtonMobile from 'pages/PerpDEXsExplorer/components/FilterButtonMobile'
import FilterTags from 'pages/PerpDEXsExplorer/components/FilterTags'
import PerpDEXsEventOverview from 'pages/PerpDEXsExplorer/components/PerpDEXsEventOverview'
import ReportPerpDEXsModal from 'pages/PerpDEXsExplorer/components/ReportPerpDEXModal'
import SortButtonMobile from 'pages/PerpDEXsExplorer/components/SortButtonMobile'
import { RENDER_COLUMN_DATA_MAPPING, columns } from 'pages/PerpDEXsExplorer/configs'
import { MOBILE_COLUMN_KEYS } from 'pages/PerpDEXsExplorer/constants/column'
import { FIELDS_WITH_IDEAL_VALUE } from 'pages/PerpDEXsExplorer/constants/field'
import { PERP_DEX_TYPE_MAPPING } from 'pages/PerpDEXsExplorer/constants/perpdex'
import { TITLE_MAPPING } from 'pages/PerpDEXsExplorer/constants/title'
import { useChains } from 'pages/PerpDEXsExplorer/hooks/useChains'
import { tableBodyStyles, tableStyles } from 'pages/PerpDEXsExplorer/styles'
import { ExternalResource } from 'pages/PerpDEXsExplorer/types'
import { getFilters } from 'pages/PerpDEXsExplorer/utils'
import Loading from 'theme/Loading'
import { TabHeader } from 'theme/Tab'
import Table, { getVisibleColumnStyle } from 'theme/Table'
import CustomizeColumn from 'theme/Table/CustomizeColumn'
import { Box, Flex, Grid, IconBox, Type } from 'theme/base'
import { PAGE_TITLE_HEIGHT } from 'utils/config/constants'
import { SortTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { hideScrollbar } from 'utils/helpers/css'
import { formatDate } from 'utils/helpers/format'
import { generatePerpDEXDetailsRoute } from 'utils/helpers/generateRoute'
import { parseChainImage, parseMarketImage, parsePlainProtocolImage } from 'utils/helpers/transform'

import { Accordion } from './components/Accordion'
import ChainFilter from './components/ChainFilter'
import { ReportPerpDEXFlag } from './components/ReportPerpDEX'
import Wrapper from './components/Wrapper'
import useSortData from './hooks/useSortData'

export default function PerpDEXsExplorerPage() {
  //@ts-ignore
  const { lg } = useResponsive()

  return (
    <>
      <CustomPageTitle title="Perp Explorer | Copin Analyzer" />
      {lg ? <DesktopView /> : <MobileView />}
      <ReportPerpDEXsModal />
    </>
  )
}

function DesktopView() {
  const [mainExpanded, setMainExpanded] = useState(() => {
    const isExpanded = localStorage.getItem('perp-dexs-explorer-expanded-main') === '1'
    return isExpanded
  })
  useEffect(() => {
    mainExpanded
      ? localStorage.setItem('perp-dexs-explorer-expanded-main', '1')
      : localStorage.removeItem('perp-dexs-explorer-expanded-main')
  }, [mainExpanded])
  return (
    <Flex
      sx={{
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <Flex
        sx={{
          width: '100%',
          justifyContent: 'space-between',
          height: 48,
          alignItems: 'center',
          pl: 3,
          borderBottom: 'small',
          borderBottomColor: 'neutral4',
        }}
      >
        <Box flex="1 0 0">
          <Flex
            sx={{
              width: '100%',
              gap: 2,
              alignItems: 'center',
              color: 'neutral1',
              flex: 1,
              height: PAGE_TITLE_HEIGHT,
            }}
          >
            <IconBox icon={<Compass size={24} weight="fill" />} />
            <Type.Body sx={{ flex: 1, flexShrink: 0, fontWeight: 500 }}>
              <Trans>PERP EXPLORER</Trans>
            </Type.Body>
          </Flex>
        </Box>
        <ChainFilter />
      </Flex>
      <Grid
        sx={{
          overflow: 'hidden',
          height: '100%',
          gridTemplate: `"MAIN RIGHT" 100% / 1fr minmax(${mainExpanded ? '0' : '340px'}, ${
            mainExpanded ? '0' : '340px'
          })`,
        }}
      >
        <Flex
          sx={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            gridArea: 'MAIN',
          }}
        >
          <Box
            px={3}
            sx={{
              borderBottom: 'small',
              borderBottomColor: 'neutral4',
              position: 'relative',
            }}
          >
            <DirectionButton
              onClick={() => setMainExpanded((prev) => !prev)}
              buttonSx={{ right: mainExpanded ? 0 : '-16px', top: '-1px', border: 'small', height: 42 }}
              direction={mainExpanded ? 'left' : 'right'}
            />
            <Flex
              sx={{
                width: '100%',
                height: '40px',
                overflow: 'auto',
                ...hideScrollbar(),
              }}
            >
              <FilterTags />
            </Flex>
          </Box>
          <CustomizeColumnsSelector />
          <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
            <DesktopDataView />
          </Box>
          <Flex
            sx={{
              px: 3,
              width: '100%',
              height: '40px',
              borderTop: 'small',
              borderTopColor: 'neutral4',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Type.Caption color="neutral3" id="perp_last_trade"></Type.Caption>
            <CustomizeColumnWithState />
          </Flex>
        </Flex>
        <Box width={OVERVIEW_WIDTH} sx={{ flexShrink: 0, gridArea: 'RIGHT' }}>
          <PerpDEXsEventOverview />
        </Box>
      </Grid>
    </Flex>
  )
}

// TODO: IMPROVE
function MobileView() {
  const { searchParams, setSearchParamsOnly } = useSearchParams()
  const currentTab = searchParams.tab ?? TabKeys.statistic
  const searchParamsRef = useRef<any>({})
  const handleClickItem = (key: string) => {
    const prevParams = { ...searchParamsRef.current }
    const prevKey = prevParams.tab
    if (!prevKey) {
      searchParamsRef.current = searchParams
      setSearchParamsOnly({ tab: key })
      return
    }
    if (key === prevKey) {
      searchParamsRef.current = searchParams
      setSearchParamsOnly(prevParams)
    }
  }
  return (
    <BodyWrapperMobile>
      <Box
        display={currentTab !== TabKeys.statistic && currentTab !== TabKeys.events ? 'block' : 'none'}
        sx={{ width: '100%', height: '100%' }}
      />
      <Box
        display={currentTab === TabKeys.statistic ? 'block' : 'none'}
        sx={{ width: '100%', height: 'calc(100% - 1px)' }}
      >
        <Flex
          sx={{
            width: '100%',
            height: 40,
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 'small',
            borderBottomColor: 'neutral4',
            pl: 3,
          }}
        >
          <Type.BodyBold sx={{ flex: 1, flexShrink: 0 }}>
            <Trans>PERP EXPLORER</Trans>
          </Type.BodyBold>
          <Flex sx={{ alignItems: 'center', height: '100%' }}>
            <FilterButtonMobile />
            <Box sx={{ width: '1px', height: '100%', bg: 'neutral4', flexShrink: 0, ml: 12, mr: '2px' }} />
            <SortButtonMobile />
            <Box sx={{ width: '1px', height: '100%', bg: 'neutral4', flexShrink: 0, mr: 12, ml: '2px' }} />
            <ChainFilter />
          </Flex>
        </Flex>
        <Box height={'calc(100% - 40px - 40px)'}>
          <DesktopDataView />
        </Box>
        <Flex
          sx={{
            px: 3,
            width: '100%',
            height: 40,
            borderTop: 'small',
            borderTopColor: 'neutral4',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Type.Caption color="neutral3" id="perp_last_trade" flex="1"></Type.Caption>
          <Box sx={{ width: '1px', height: '100%', bg: 'neutral4' }} />
          <CustomizeColumnWithState />
        </Flex>
      </Box>
      <Box display={currentTab === TabKeys.events ? 'block' : 'none'} sx={{ width: '100%', height: '100%' }}>
        <PerpDEXsEventOverview />
      </Box>
      <BottomWrapperMobile sx={{ display: 'flex !important' }}>
        <TabHeader
          configs={tabConfigs}
          isActiveFn={(config) => config.key === currentTab}
          fullWidth={false}
          onClickItem={handleClickItem}
        />
      </BottomWrapperMobile>
    </BodyWrapperMobile>
  )
}

const TabKeys = {
  statistic: 'statistic',
  events: 'events',
}

const tabConfigs = [
  {
    name: <Trans>STATISTIC</Trans>,
    activeIcon: <Compass size={24} weight="fill" />,
    icon: <Compass size={24} />,
    key: TabKeys.statistic,
    paramKey: TabKeys.statistic,
  },
  {
    name: <Trans>EVENTS</Trans>,
    icon: <PresentationChart size={24} />,
    activeIcon: <PresentationChart size={24} weight="fill" />,
    key: TabKeys.events,
    paramKey: TabKeys.events,
  },
]

const DesktopDataView = memo(function DataViewMemo() {
  const { data, isLoading } = useQuery([QUERY_KEYS.GET_PERP_DEX_STATISTIC_DATA], getPerpDexStatisticApi)

  const { chains, searchParams } = useChains()
  const { currentSort, changeCurrentSort } = useSortData()
  const { sortBy: currentSortBy, sortType: currentSortType } = currentSort
  const getRowChildrenData = useCallback(({ rowData }: { rowData: PerpDEXSourceResponse }) => rowData.protocolInfos, [])
  const getChildRowKey = useCallback(({ data }: { data: PerpDEXSourceResponse }) => {
    //@ts-ignore
    return data?.protocol
  }, [])

  const filters = getFilters({ searchParams: searchParams as Record<string, string> })

  const _data = useMemo(() => {
    if (!data) return []
    let newData: PerpDEXSourceResponse[] = []
    if (chains?.length) {
      newData = data.filter((_d) => _d.chains?.some((_c) => chains.includes(_c)))
    } else {
      newData = [...data]
    }
    if (filters?.length) {
      newData = newData.filter((_d) => {
        return filters.every((filter) => {
          if (filter.type === 'number' && filter.fieldName === 'minLeverage') {
            const min = _d.minLeverage as unknown as number
            const max = _d.maxLeverage as unknown as number
            return (filter.gte == null || max >= filter.gte) && (filter.lte == null || min <= filter.lte)
          }
          const value = _d[filter.fieldName]
          if (value == null) return false
          if (filter.type === 'number' || filter.type === 'duration') {
            const _value = value as unknown as number
            return (filter.gte == null || _value >= filter.gte) && (filter.lte == null || _value <= filter.lte)
          }
          if (filter.type === 'select') {
            const listArrayField: (keyof PerpDEXSourceResponse)[] = ['type', 'marginModes', 'positionModes']
            if (listArrayField.includes(filter.fieldName)) {
              const _value = value as unknown as string[]
              if (_value.length === 0) return false
              return filter.selectedValue == null || _value.includes(filter.selectedValue)
            }
            const listBooleanField: (keyof PerpDEXSourceResponse)[] = ['oneClickTrading', 'hasFundingFee']
            if (listBooleanField.includes(filter.fieldName)) {
              const _value = value as unknown as boolean
              return filter.selectedValue === 'yes' ? _value === true : _value === false
            }
            return false
          }
          if (filter.type === 'multiSelect') {
            if (filter.fieldName === 'collateralAssets') {
              const _value = value as string[]
              return filter.listSelectedValue == null || filter.listSelectedValue.some((_v) => _value.includes(_v))
            }
          }
          if (filter.type === 'pairs') {
            const _value = value as string[]
            return (
              filter.pairs == null ||
              (filter.isExcluded
                ? !filter.pairs.some((_v) => _value.includes(_v))
                : filter.pairs.some((_v) => _value.includes(_v)))
            )
          }
          return true
        })
      })
    }
    if (currentSortBy === 'minTradingFee') {
      newData?.sort((a, b) => {
        let aValue = 0
        let bValue = 0
        if (currentSortType === SortTypeEnum.DESC) {
          aValue = a?.['minTradingFee'] ?? 0
          bValue = b?.['minTradingFee'] ?? 0
        } else {
          aValue = a?.['maxTradingFee'] ?? 0
          bValue = b?.['maxTradingFee'] ?? 0
        }
        return aValue > bValue ? -1 : 1
      })
    } else if (currentSortBy === 'minReferralCommission') {
      newData?.sort((a, b) => {
        let aValue = 0
        let bValue = 0
        if (currentSortType === SortTypeEnum.DESC) {
          aValue = a?.['minReferralCommission'] ?? 0
          bValue = b?.['minReferralCommission'] ?? 0
        } else {
          aValue = a?.['maxReferralCommission'] ?? 0
          bValue = b?.['maxReferralCommission'] ?? 0
        }
        return aValue > bValue ? -1 : 1
      })
    } else {
      newData?.sort((a, b) => {
        const direction = currentSortType === SortTypeEnum.DESC ? -1 : 1
        const aValue = a?.[currentSortBy] ?? 0
        const bValue = b?.[currentSortBy] ?? 0
        // if (aValue == null && bValue != null) return 1
        // if (aValue != null && bValue == null) return -1
        // if (aValue != null && bValue != null) {
        return aValue > bValue ? 1 * direction : -1 * direction
        // }
        // return 0
      })
    }
    return newData ?? data
  }, [data, chains, currentSortBy, currentSortType, filters])

  const externalResource = useMemo(() => {
    const _externalResource = {} as ExternalResource
    if (!_data) return _externalResource
    // FIELDS_WITH_IDEAL_VALUE.forEach((field) => {
    //   const idealValues = [0, 0, 0]
    //   _data.forEach((_data) => {
    //     let value = _data[field]
    //     if (typeof value !== 'number') return
    //     for (let i = 0; i < idealValues.length; i++) {
    //       const idealValue = idealValues[i]
    //       if (value > idealValue) {
    //         idealValues[i] = value
    //         value = idealValue
    //       }
    //     }
    //     const idealValue = Math.max(...idealValues.filter((v) => !!v)) // get top 3
    //     //@ts-ignore
    //     if (!!idealValue) _externalResource[field] = idealValue
    //   })
    // })
    const defaultResource: ExternalResource = { maxValueField: {}, lastSnapshot: '' }
    const resource = _data.reduce<ExternalResource>((result, _d) => {
      const newResult = { ...result }
      // mobile keys equal desktop keys
      FIELDS_WITH_IDEAL_VALUE.forEach((fieldName) => {
        const value = _d[fieldName]
        if (typeof value !== 'number') return
        const currentMaxValue = newResult.maxValueField[fieldName]?.value ?? 0
        if (value > currentMaxValue) newResult.maxValueField[fieldName] = { perpdex: _d.perpdex, value }
      })
      const lastSnapshot = _d.statisticAt1d
      if (
        !!lastSnapshot &&
        (!result.lastSnapshot || new Date(lastSnapshot).valueOf() > new Date(result.lastSnapshot).valueOf())
      )
        newResult.lastSnapshot = lastSnapshot
      return newResult
    }, defaultResource)
    //   const volume1d = _data?.volume1d ?? 0
    //   return volume1d > result ? volume1d : result
    // }, 0)
    return resource
  }, [_data])

  const loadedRef = useRef(false) // TODO: Check bug table make component rerender a lot
  useEffect(() => {
    loadedRef.current = true
    const element = document.getElementById('perp_last_trade')
    if (!element) return
    element.innerHTML = `Last updated: ${formatDate(externalResource.lastSnapshot)} UTC`
  }, [externalResource])

  const { md } = useResponsive()

  return md ? (
    <Wrapper data={_data}>
      {isLoading && <Loading />}
      {!isLoading && (
        <Table
          data={_data}
          columns={columns}
          isLoading={isLoading}
          restrictHeight
          scrollToTopDependencies={BLOCK_SCROLL_DEPS}
          currentSort={currentSort}
          changeCurrentSort={changeCurrentSort}
          externalSource={externalResource}
          //@ts-ignore
          getRowChildrenData={getRowChildrenData}
          getChildRowKey={getChildRowKey}
          containerSx={tableStyles}
          tableBodySx={tableBodyStyles}
          hasHoverBg={false}
        />
      )}
    </Wrapper>
  ) : (
    <MobileDataView data={_data} isLoading={isLoading} externalResource={externalResource} />
  )
})

const BLOCK_SCROLL_DEPS: any[] = []

function MobileDataView({
  data,
  isLoading,
  externalResource,
}: {
  data: PerpDEXSourceResponse[] | undefined
  isLoading: boolean
  externalResource: ExternalResource
}) {
  const { columnKeys: visibleColumns } = usePerpsExplorerListColumns()
  // Keep order
  const _visibleColumns = useMemo(() => {
    return MOBILE_COLUMN_KEYS.filter((key) => visibleColumns.includes(key))
  }, [visibleColumns])
  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      {isLoading && (
        <Flex
          sx={{
            alignItems: 'start',
            justifyContent: 'center',
            bg: 'modalBG1',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        >
          <Box pt={100}>
            <Loading />
          </Box>
        </Flex>
      )}
      <Box sx={{ position: 'relative' }}>
        {!isLoading && !data?.length && <NoDataFound />}

        {data?.map((_data) => {
          if (!_data) return null

          const url = generatePerpDEXDetailsRoute({ perpdex: _data.perpdex?.toLowerCase() })

          return (
            <>
              <Accordion
                key={_data.perpdex}
                pairs={
                  <Flex sx={{ height: '20px', gap: 1 }}>
                    <Type.Caption color="neutral3" sx={{ lineHeight: '20px' }}>
                      PAIRS
                    </Type.Caption>
                    <IconGroup iconNames={_data.pairs} iconUriFactory={parseMarketImage} />
                  </Flex>
                }
                header={
                  <Flex sx={{ alignItems: 'center', gap: 2 }}>
                    <Box as={Link} to={url} sx={{ '&:hover': { '& + *': { textDecoration: 'underline' } } }}>
                      <PerpDexLogo perpDex={_data.perpdex} size={40} />
                    </Box>
                    <Box>
                      <Flex mb={'2px'} sx={{ alignItems: 'center', gap: 1 }}>
                        <Box sx={{ '&:hover': { textDecoration: 'underline' } }}>
                          <Type.Caption color="neutral1" flexShrink={0} as={Link} to={url}>
                            {_data.name}
                          </Type.Caption>
                        </Box>
                        <IconGroup iconNames={_data.chains ?? []} iconUriFactory={parseChainImage} size={16} />
                        <ReportPerpDEXFlag data={_data} />
                      </Flex>
                      <Flex sx={{ alignItems: 'center', gap: 1, height: '20px' }}>
                        {_data.type?.map((type) => {
                          const perpDexTypeConfig = PERP_DEX_TYPE_MAPPING[type]
                          return (
                            <Type.Caption key={type} color={perpDexTypeConfig.color} sx={{ lineHeight: '20px' }}>
                              {perpDexTypeConfig.label}
                            </Type.Caption>
                          )
                        })}
                      </Flex>
                    </Box>
                  </Flex>
                }
                subHeader={
                  <Box sx={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                    {_visibleColumns.slice(0, 6).map((valueKey) => {
                      return (
                        <Box key={valueKey}>
                          <Type.Caption color="neutral3" display="block">
                            {TITLE_MAPPING[valueKey as keyof PerpDEXSourceResponse]}
                          </Type.Caption>
                          {RENDER_COLUMN_DATA_MAPPING[valueKey as keyof PerpDEXSourceResponse]?.({
                            data: _data,
                            externalResource,
                          })}
                        </Box>
                      )
                    })}
                  </Box>
                }
                body={
                  <Box>
                    <Box py={2} sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr 1fr' }}>
                      {_visibleColumns.slice(6).map((valueKey) => {
                        return (
                          <Box key={valueKey}>
                            <Type.Caption color="neutral3" display="block">
                              {TITLE_MAPPING[valueKey as keyof PerpDEXSourceResponse]}
                            </Type.Caption>
                            {RENDER_COLUMN_DATA_MAPPING[valueKey as keyof PerpDEXSourceResponse]?.({
                              data: _data,
                              externalResource,
                            })}
                          </Box>
                        )
                      })}
                    </Box>
                    <Flex sx={{ width: '100%', gap: 2, flexDirection: 'column' }}>
                      {_data?.protocolInfos?.map((protocolData) => {
                        const protocolUrl = generatePerpDEXDetailsRoute({
                          perpdex: _data.perpdex?.toLowerCase(),
                          params: { protocol: protocolData.protocol?.toLowerCase() },
                        })

                        return (
                          <Box key={protocolData.protocol} sx={{ bg: 'neutral6' }}>
                            <Accordion
                              pairs={
                                <Flex sx={{ height: '20px', gap: 1 }}>
                                  <Type.Caption color="neutral3" sx={{ lineHeight: '20px' }}>
                                    PAIRS
                                  </Type.Caption>
                                  <IconGroup iconNames={protocolData.pairs} iconUriFactory={parseMarketImage} />
                                </Flex>
                              }
                              header={
                                <Flex sx={{ alignItems: 'center', gap: 2 }}>
                                  <Box
                                    as={Link}
                                    to={protocolUrl}
                                    sx={{ '&:hover': { '& + *': { textDecoration: 'underline' } } }}
                                  >
                                    <Icon
                                      // @ts-ignore
                                      iconName={protocolData.protocol}
                                      iconUriFactory={parsePlainProtocolImage}
                                      size={40}
                                      hasBorder={false}
                                    />
                                  </Box>
                                  <Box>
                                    <Flex mb={'2px'} sx={{ alignItems: 'center', gap: 1 }}>
                                      <Box sx={{ '&:hover': { textDecoration: 'underline' } }}>
                                        <Type.Caption color="neutral1" flexShrink={0} as={Link} to={protocolUrl}>
                                          {protocolData.name}
                                        </Type.Caption>
                                      </Box>
                                      <Icon iconName={protocolData.chain} iconUriFactory={parseChainImage} size={16} />
                                    </Flex>
                                    {/* <Flex sx={{ alignItems: 'center', gap: 1, height: '20px' }}>
                                  {protocolData.type?.map((type) => {
                                    const perpDexTypeConfig = PERP_DEX_TYPE_MAPPING[type]
                                    return (
                                      <Type.Caption
                                        key={type}
                                        color={perpDexTypeConfig.color}
                                        sx={{ lineHeight: '20px' }}
                                      >
                                        {perpDexTypeConfig.label}
                                      </Type.Caption>
                                    )
                                  })}
                                </Flex> */}
                                  </Box>
                                </Flex>
                              }
                              subHeader={
                                <Box sx={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                                  {_visibleColumns.slice(0, 6).map((valueKey) => {
                                    return (
                                      <Box key={valueKey}>
                                        <Type.Caption color="neutral3" display="block">
                                          {TITLE_MAPPING[valueKey as keyof PerpDEXSourceResponse]}
                                        </Type.Caption>
                                        {RENDER_COLUMN_DATA_MAPPING[valueKey as keyof PerpDEXSourceResponse]?.({
                                          data: protocolData as any,
                                          externalResource,
                                        })}
                                      </Box>
                                    )
                                  })}
                                </Box>
                              }
                              body={
                                <Box>
                                  <Box pt={2} sx={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                                    {_visibleColumns.slice(6).map((valueKey) => {
                                      return (
                                        <Box key={valueKey}>
                                          <Type.Caption color="neutral3" display="block">
                                            {TITLE_MAPPING[valueKey as keyof PerpDEXSourceResponse]}
                                          </Type.Caption>
                                          {RENDER_COLUMN_DATA_MAPPING[valueKey as keyof PerpDEXSourceResponse]?.({
                                            data: protocolData as any,
                                            externalResource,
                                          })}
                                        </Box>
                                      )
                                    })}
                                  </Box>
                                </Box>
                              }
                            />
                          </Box>
                        )
                      })}
                    </Flex>
                  </Box>
                }
              />
              <Divider />
            </>
          )
        })}
      </Box>
    </Box>
  )
}

function CustomizeColumnWithState() {
  const { columnKeys: visibleColumnsTable, setColumnKeys: setVisibleColumnsTable } = usePerpsExplorerTableColumns()
  const { columnKeys: visibleColumnsList, setColumnKeys: setVisibleColumnsList } = usePerpsExplorerListColumns()
  const { md } = useResponsive()
  return (
    <CustomizeColumn
      defaultColumns={md ? columns : columns.filter((c) => !!c.key && MOBILE_COLUMN_KEYS.includes(c.key))}
      defaultKeys={md ? DEFAULT_COLUMN_KEYS : DEFAULT_COLUMN_KEYS_MOBILE}
      placement="topRight"
      //@ts-ignore
      currentColumnKeys={md ? visibleColumnsTable : visibleColumnsList}
      titleFactory={(item) => item.text}
      onApply={(keys) => (md ? setVisibleColumnsTable(keys) : setVisibleColumnsList(keys))}
      disabledItemFn={(key) => !key || ['volume1d', 'tradeUrl'].includes(key)}
      label={md ? <Type.Caption color="inherit">Customize Columns</Type.Caption> : ''}
    />
  )
}

function CustomizeColumnsSelector() {
  const { columnKeys: visibleColumns } = usePerpsExplorerTableColumns()
  return <Box sx={getVisibleColumnStyle({ visibleColumns })} />
}
