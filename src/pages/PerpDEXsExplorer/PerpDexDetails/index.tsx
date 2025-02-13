import { Trans } from '@lingui/macro'
import { Calculator, Compass, IntersectThree } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import { useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { getPerpDexEventApi, getPerpDexStatisticApi } from 'apis/perpDex'
import CustomPageTitle from 'components/@ui/CustomPageTitle'
import DirectionButton from 'components/@ui/DirectionButton'
import Divider from 'components/@ui/Divider'
import NoDataFound from 'components/@ui/NoDataFound'
import { PerpDEXEventResponse, PerpDEXSourceResponse } from 'entities/perpDexsExplorer'
import useSearchParams from 'hooks/router/useSearchParams'
import { BodyWrapperMobile, BottomWrapperMobile } from 'pages/@layouts/Components'
import { TabHeader } from 'theme/Tab'
import { Box, Flex, Type } from 'theme/base'
import { themeColors } from 'theme/colors'
import { QUERY_KEYS } from 'utils/config/keys'

import { Accordion } from '../components/Accordion'
import ReportPerpDEXsModal from '../components/ReportPerpDEXModal'
import { RENDER_COLUMN_DATA_MAPPING } from '../configs'
import { checkNotEndedEvent, sortEvents } from '../helpers/eventsHelper'
import { renderTableTitleWithTooltip } from '../helpers/renderHelper'
import Charts from './Charts'
import Events from './Events'
import Info, { GeneralInfo, InfoTitle } from './Info'
import PerpDEXInfo from './PerpDEXInfo'
import PerpDEXSelect from './PerpDEXSelect'
import RemarkableMetricFields from './RemarkableMetricFields'
import { DESKTOP_EVENT_AREA_HEIGHT, DESKTOP_LEFT_AREA_WIDTH } from './configs/constants'
import { METRIC_FIELD } from './configs/field'

export default function PerpDEXDetailsPage() {
  const { perpdex } = useParams<{ perpdex: string | undefined }>()
  const { searchParams } = useSearchParams()
  const protocol = (searchParams.protocol as string)?.toLowerCase()

  const [loaded, setLoaded] = useState(false)
  const { data: perpDEXsStatistic, isLoading } = useQuery(
    [QUERY_KEYS.GET_PERP_DEX_STATISTIC_DATA],
    getPerpDexStatisticApi,
    { onSuccess: () => setLoaded(true) }
  )
  const perpdexData = perpDEXsStatistic?.find((d) => d.perpdex.toLowerCase() === perpdex?.toLowerCase())
  const protocolData = perpdexData?.protocolInfos?.find((data) => data.protocol?.toLowerCase() === protocol)

  const { data: perpDEXEvent, isLoading: isLoadingEvents } = useQuery(
    [QUERY_KEYS.GET_PERP_DEX_EVENT],
    getPerpDexEventApi
  )
  const events: PerpDEXEventResponse[] = useMemo(() => {
    if (!perpDEXEvent) return []
    const filteredEvents = perpDEXEvent.filter((event) => {
      if (!checkNotEndedEvent(event.startTime, event.endTime)) return false
      return (
        event.perpdex?.perpdex?.toLowerCase() === perpdexData?.perpdex?.toLowerCase() &&
        (!!protocolData?.protocol ? event.protocol === protocolData?.protocol : true)
      )
    })
    return sortEvents(filteredEvents)
  }, [perpDEXEvent, perpdexData?.perpdex, protocolData?.protocol])

  const { lg } = useResponsive()

  return (
    <>
      <CustomPageTitle
        title={`${protocolData ? protocolData.name : perpdexData?.name ? perpdexData.name : 'Perp DEX'} Statistic`}
      />
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        {!perpdexData && !isLoading && <NoDataFound />}
        {!isLoading && loaded && (
          <>
            {lg ? (
              <DesktopView
                perpdexData={perpdexData}
                protocolData={protocolData}
                isLoadingEvents={isLoadingEvents}
                events={events}
              />
            ) : (
              <MobileView
                perpdexData={perpdexData}
                protocolData={protocolData}
                isLoadingEvents={isLoadingEvents}
                events={events}
              />
            )}
          </>
        )}
      </Box>
      <ReportPerpDEXsModal />
    </>
  )
}

type ViewProps = {
  perpdexData: PerpDEXSourceResponse | undefined
  protocolData: any
  events: PerpDEXEventResponse[] | undefined
  isLoadingEvents: boolean
}

function DesktopView({ perpdexData, protocolData, events, isLoadingEvents }: ViewProps) {
  const [expandedChart, setExpandedChart] = useState(false)
  const [expandedInfo, setExpandedInfo] = useState(false)
  const handleExpandChart = () => setExpandedChart((prev) => !prev)
  const handleExpandInfo = () => setExpandedInfo((prev) => !prev)
  if (!perpdexData) return null
  const data: any = protocolData || perpdexData

  return (
    <>
      <DirectionButton
        onClick={handleExpandChart}
        buttonSx={{
          display: expandedInfo ? 'none' : 'flex',
          left: expandedChart ? 0 : `calc(${DESKTOP_LEFT_AREA_WIDTH}px - 16px)`,
          top: 60 + 4,
          border: 'small',
          height: 42,
          zIndex: expandedChart ? 9 : 1,
        }}
        direction={expandedChart ? 'right' : 'left'}
      />
      <Box sx={{ width: '100%', height: 60, borderBottom: 'small', borderBottomColor: 'neutral4' }}>
        <Flex sx={{ width: '100%', height: '100%' }}>
          <Box
            sx={{
              width: DESKTOP_LEFT_AREA_WIDTH,
              height: '100%',
              flexShrink: 0,
              borderRight: 'small',
              borderColor: 'neutral4',
            }}
          >
            <Flex sx={{ width: '100%', height: '100%', alignItems: 'center', px: 3, gap: 2 }}>
              {/* <IconBox
                as={Link}
                icon={<ArrowLeft size={23} />}
                to={ROUTES.PERP_DEXS_EXPLORER.path}
                sx={{ mr: 2, color: 'neutral3', '&:hover': { color: 'neutral2' } }}
              /> */}
              <PerpDEXInfo perpdexData={perpdexData} protocolData={protocolData} />
              <PerpDEXSelect />
            </Flex>
          </Box>
          <Box sx={{ flex: '1 0 0', height: '100%', flexShrink: 0 }}>
            <Flex sx={{ width: '100%', height: '100%', px: 3, alignItems: 'center', gap: 4 }}>
              <Flex
                flex="1"
                sx={{
                  alignItems: 'center',
                  gap: 4,
                  flexWrap: 'nowrap',
                  overflow: 'auto',
                  '& > *': { flexShrink: 0 },
                }}
              >
                <RemarkableMetricFields data={data} />
              </Flex>
              <Flex
                sx={{
                  height: '100%',
                  alignItems: 'center',
                  // pl: 3,
                  gap: 24,
                  // borderLeft: 'small',
                  // borderLeftColor: 'neutral4',
                }}
              >
                {/* <TradersExplorerLink perpdexData={perpdexData} protocolData={protocolData} /> */}
                <Box>{RENDER_COLUMN_DATA_MAPPING['tradeUrl']?.({ data })}</Box>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box sx={{ height: 'calc(100% - 60px)', position: 'relative' }}>
        <Flex sx={{ width: '100%', height: '100%' }}>
          <Box
            sx={{
              width: expandedChart ? 0 : expandedInfo ? '100%' : DESKTOP_LEFT_AREA_WIDTH,
              height: '100%',
              flexShrink: 0,
              borderRight: 'small',
              borderColor: 'neutral4',
              overflow: 'hidden',
            }}
          >
            {!!events?.length && (
              <Box
                sx={{
                  flexShrink: 0,
                  width: expandedInfo ? 0 : DESKTOP_LEFT_AREA_WIDTH,
                  height: expandedInfo ? 0 : DESKTOP_EVENT_AREA_HEIGHT,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: DESKTOP_LEFT_AREA_WIDTH,
                    height: DESKTOP_EVENT_AREA_HEIGHT,
                  }}
                >
                  <Events events={events} isLoading={isLoadingEvents} />
                </Box>
              </Box>
            )}
            {/* <Box sx={{ width: '100%', height: `calc(100% - ${DESKTOP_EVENT_AREA_HEIGHT}px)`, bg: 'neutral5' }}></Box> */}
            <Info
              isExpanded={expandedInfo}
              data={data}
              eventCount={events?.length || 0}
              handleExpand={handleExpandInfo}
            />
          </Box>

          <Box flex={expandedInfo ? 0 : '1 0 0'} sx={{ overflow: 'auto', bg: 'neutral7' }}>
            <Charts perpdex={perpdexData.perpdex} protocol={protocolData?.protocol} />
          </Box>
        </Flex>
      </Box>
    </>
  )
}

// TODO: IMPROVE
function MobileView({ perpdexData, protocolData, events, isLoadingEvents }: ViewProps) {
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
  if (!perpdexData) return null
  const remainMetriFields = METRIC_FIELD.reduce<(keyof PerpDEXSourceResponse)[]>((result, config) => {
    return [...result, ...config.fields]
  }, [])
  const data: any = protocolData || perpdexData
  return (
    <BodyWrapperMobile>
      <Flex sx={{ width: '100%', height: 'calc(100% - 1px)', overflow: 'hidden', flexDirection: 'column' }}>
        <Box sx={{ width: '100%', height: 66 }}>
          <Flex sx={{ width: '100%', height: '100%', alignItems: 'center', px: 3, justifyContent: 'space-between' }}>
            <Flex sx={{ height: '100%', alignItems: 'center', gap: 2 }}>
              {/* <IconBox
                as={Link}
                icon={<ArrowLeft size={23} />}
                to={ROUTES.PERP_DEXS_EXPLORER.path}
                sx={{ mr: 2, color: 'neutral3', '&:hover': { color: 'neutral2' } }}
              /> */}
              <PerpDEXInfo perpdexData={perpdexData} protocolData={protocolData} />
              <PerpDEXSelect />
            </Flex>
            <Box>{RENDER_COLUMN_DATA_MAPPING['tradeUrl']?.({ data })}</Box>
            {/* <MobileViewMoreButton perpdexData={perpdexData} protocolData={protocolData} /> */}
          </Flex>
        </Box>
        <Divider />
        <Box flex="1 0 0" sx={{ overflow: 'hidden' }}>
          <Box display={!TabKeys[currentTab as string] ? 'block' : 'none'} sx={{ width: '100%', height: '100%' }} />
          <Box
            display={currentTab === TabKeys.statistic ? 'block' : 'none'}
            sx={{ width: '100%', height: '100%', overflow: 'hidden auto' }}
          >
            <Accordion
              wrapperSx={{ px: 3 }}
              header={
                <Flex alignItems="center" sx={{ gap: 2 }}>
                  <Calculator weight="bold" size={20} color={themeColors.neutral3} />
                  <Type.BodyBold>
                    <Trans>METRIC</Trans>
                  </Type.BodyBold>
                </Flex>
              }
              subHeader={
                <Box sx={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <RemarkableMetricFields data={data} />
                </Box>
              }
              body={
                <Box>
                  <Box pt={2} sx={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr 1fr' }}>
                    {remainMetriFields.map((valueKey) => {
                      return (
                        <Box key={valueKey}>
                          <Type.Caption color="neutral3" display="block">
                            {renderTableTitleWithTooltip({ valueKey, upperCase: false })}
                          </Type.Caption>
                          {RENDER_COLUMN_DATA_MAPPING[valueKey as keyof PerpDEXSourceResponse]?.({
                            data,
                          })}
                        </Box>
                      )
                    })}
                  </Box>
                </Box>
              }
            />
            <Box>
              <Charts perpdex={perpdexData.perpdex} protocol={protocolData?.protocol} />
            </Box>
          </Box>

          <Box
            display={currentTab === TabKeys.info ? 'block' : 'none'}
            sx={{ width: '100%', height: '100%', overflow: 'hidden auto' }}
          >
            {!!events?.length && (
              <Box sx={{ height: DESKTOP_EVENT_AREA_HEIGHT }}>
                <Events events={events} isLoading={isLoadingEvents} />
              </Box>
            )}
            <Flex
              sx={{
                width: '100%',
                height: 48,
                alignItems: 'center',
                px: 3,
              }}
            >
              <InfoTitle />
            </Flex>
            <Box
              sx={{
                px: 3,
                borderRightColor: 'neutral4',
                '& > *': { borderBottom: '1px dashed', borderBottomColor: 'neutral4' },
                '& > *:last-child': { borderBottom: 'none' },
              }}
            >
              <GeneralInfo data={data} />
            </Box>
          </Box>
        </Box>
      </Flex>
      <BottomWrapperMobile>
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

const TabKeys: { [key: string]: string } = {
  statistic: 'statistic',
  info: 'info',
}

const tabConfigs = [
  {
    name: <Trans>STATISTIC</Trans>,
    activeIcon: <Compass size={20} weight="fill" />,
    icon: <Compass size={20} />,
    key: TabKeys.statistic,
    paramKey: TabKeys.statistic,
  },
  {
    name: <Trans>INFO & EVENTS</Trans>,
    icon: <IntersectThree size={20} />,
    activeIcon: <IntersectThree size={20} weight="fill" />,
    key: TabKeys.info,
    paramKey: TabKeys.info,
  },
]
