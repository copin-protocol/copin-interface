import { Trans } from '@lingui/macro'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { memo, useCallback, useEffect, useState } from 'react'
import Slider, { Settings } from 'react-slick'

import tokenNotFound from 'assets/images/token-not-found.png'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import LineChartTraderPnl from 'components/@charts/LineChartPnL'
import { parsePnLStatsData } from 'components/@charts/LineChartPnL/helpers'
import { AccountInfo } from 'components/@ui/AccountInfo'
import { SignedText } from 'components/@ui/DecoratedText/SignedText'
import { TIME_FILTER_OPTIONS } from 'components/@ui/TimeFilter'
import { PnlStatisticsResponse, ResponseTraderData } from 'entities/trader'
import useQuickViewTraderStore from 'hooks/store/useQuickViewTraderStore'
import { useAuthContext } from 'hooks/web3/useAuth'
import { Button } from 'theme/Buttons'
import IconButton from 'theme/Buttons/IconButton'
import { HorizontalCarouselWrapper } from 'theme/Carousel/Wrapper'
import Loading from 'theme/Loading'
import { Box, Flex, Image, Type } from 'theme/base'
import { TimeFilterByEnum } from 'utils/config/enums'
import { TIME_TRANSLATION_FULL } from 'utils/config/translations'
import { formatNumber } from 'utils/helpers/format'
import { logEventLite } from 'utils/tracking/event'
import { EventCategory } from 'utils/tracking/types'
import { EVENT_ACTIONS } from 'utils/tracking/types'

import UpgradeCTA from './UpgradeCTA'

const DAY_COUNT = 30

export const TraderListDesktop = memo(function TraderListDesktopMemo({
  listTraderData,
  onClickCopyTrade,
  pnlData,
  isLoading,
}: {
  listTraderData: ResponseTraderData[] | undefined
  onClickCopyTrade: (traderData: ResponseTraderData) => void
  pnlData: PnlStatisticsResponse | undefined
  isLoading: boolean
}) {
  // set width height for virtual list
  const [width, setWidth] = useState(window.innerWidth)
  const handleResize = useCallback(() => {
    setWidth(window.innerWidth)
  }, [])
  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const itemPerPage = width >= 1600 ? 6 : width >= 1200 ? 4 : 2
  return (
    <>
      <Box sx={{ width: ['100%', '1px'], height: ['1px', '100%'], bg: 'neutral4' }} />

      <Box
        sx={{
          flex: '1 0 0',
          height: '100%',
          overflow: 'auto',
          py: 3,
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: '100%',
            maxWidth: '1000px',
            mx: 'auto',
            pr: [24, 24, 24, 60, 60],
          }}
        >
          <TraderListHead />
          <Box mb={40} />
          {!!listTraderData && listTraderData.length === 0 && <NotFoundData />}
          {!!listTraderData && !!listTraderData.length && (
            <Box sx={{ width: '100%', position: 'relative' }}>
              {isLoading && (
                <Flex
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    bg: 'modalBG',
                  }}
                >
                  <Loading />
                </Flex>
              )}
              <CustomSlider deps={listTraderData}>
                {Array.from({ length: Math.ceil(listTraderData.length / itemPerPage) }, (_, v) => v).map((v) => {
                  return (
                    <Box
                      key={v}
                      // px={PADDING_X}
                      sx={{
                        width: '100%',
                        flexShrink: 0,
                        height: '100%',
                        display: 'grid',
                        gridTemplateColumns: `repeat(${itemPerPage / 2}, 1fr)`,
                        gap: 2,
                      }}
                    >
                      {listTraderData.slice(v * itemPerPage, v * itemPerPage + itemPerPage)?.map((traderData) => {
                        return (
                          <TraderItem
                            key={traderData.id}
                            traderData={traderData}
                            pnlData={pnlData}
                            onClickCopyTrade={onClickCopyTrade}
                          />
                        )
                      })}
                    </Box>
                  )
                })}
              </CustomSlider>
              <UpgradeCTA />
            </Box>
          )}
        </Flex>
      </Box>
    </>
  )
})

function TraderListHead() {
  return (
    <>
      <Type.H5 mb={10}>
        <Trans>Pick the trader you want to copy</Trans>
      </Type.H5>
      <Type.Caption>
        <Trans>TIP: Click to trader avatar to quick view the details</Trans>
      </Type.Caption>
    </>
  )
}

const MOBILE_ITEM_COUNT = 10
export const TraderListMobile = memo(function TraderListMobileMemo({
  listTraderData,
  onClickCopyTrade,
  pnlData,
}: {
  listTraderData: ResponseTraderData[] | undefined
  onClickCopyTrade: (traderData: ResponseTraderData) => void
  pnlData: PnlStatisticsResponse | undefined
}) {
  if (!!listTraderData && listTraderData.length === 0) {
    return <NotFoundData />
  }

  return (
    <>
      <Box mt={24} mb={3}>
        <TraderListHead />
      </Box>

      <HorizontalCarouselWrapper>
        <Slider {...settings}>
          {listTraderData &&
            listTraderData.slice(0, MOBILE_ITEM_COUNT)?.map((traderData) => {
              return (
                <Box
                  key={traderData.account + traderData.protocol}
                  // px={PADDING_X}
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    gridTemplateColumns: ['1fr', '1fr', '1fr', '1fr 1fr'],
                    gap: 2,
                    '@media all and (min-width: 1400px)': {
                      gridTemplateColumns: 'repeat(3, 1fr)',
                    },
                    '@media all and (min-width: 1800px)': {
                      gridTemplateColumns: 'repeat(4, 1fr)',
                    },
                  }}
                  pb={4}
                >
                  <TraderItem
                    key={traderData.id}
                    traderData={traderData}
                    pnlData={pnlData}
                    onClickCopyTrade={onClickCopyTrade}
                  />
                </Box>
              )
            })}
        </Slider>
        <UpgradeCTA />
      </HorizontalCarouselWrapper>
    </>
  )
})

const settings: Settings = {
  speed: 500,
  autoplay: true,
  autoplaySpeed: 8000,
  pauseOnHover: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  dots: true,
}

function CustomSlider({ children, deps }: { children: any; deps: any }) {
  const [currentPage, setCurrentPage] = useState(1)
  const handleClickPagination = (page: number) => setCurrentPage(page)
  const length = children?.length ?? 0
  useEffect(() => {
    setCurrentPage(1)
  }, [deps])
  const handleClickNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, length))
  }
  const handleClickPrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }
  return (
    <Flex sx={{ width: '100%', position: 'relative', '& > *': { flexShrink: 0 }, gap: 2, alignItems: 'center' }}>
      <IconButton
        icon={<CaretLeft size={24} />}
        variant="ghost"
        onClick={handleClickPrevious}
        disabled={currentPage === 1}
      />
      <Box sx={{ overflow: 'hidden', flex: '1 0 0' }}>
        <Flex
          sx={{
            width: '100%',
            gap: 3,
            transition: '0.6s',
            transform:
              currentPage === 1
                ? 'none'
                : `translateX(calc(-${(currentPage - 1) * 100}% - ${(currentPage - 1) * 16}px))`,
          }}
        >
          {children}
        </Flex>
        {length > 1 && (
          <Flex mt={24} sx={{ gap: 3, width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
            {Array.from({ length: length ?? 0 }, (_, v) => v + 1).map((v) => {
              const isActive = currentPage === v
              return (
                <Box
                  key={v}
                  sx={{
                    width: '70px',
                    height: '8px',
                    flexShrink: 0,
                    bg: isActive ? 'primary1' : 'neutral5',
                    '&:hover': { bg: isActive ? 'primary1' : 'primary2' },
                  }}
                  onClick={() => handleClickPagination(v)}
                  role="button"
                />
              )
            })}
          </Flex>
        )}
      </Box>
      <IconButton
        icon={<CaretRight size={24} />}
        variant="ghost"
        onClick={handleClickNext}
        disabled={currentPage === length}
      />
    </Flex>
  )
}

function TraderItem({
  traderData,
  pnlData,
  onClickCopyTrade,
}: {
  traderData: ResponseTraderData
  pnlData: PnlStatisticsResponse | undefined
  onClickCopyTrade: (traderData: ResponseTraderData) => void
}) {
  const { isAuthenticated } = useAuthContext()
  const { protocol, account, type, realisedPnl, realisedAvgRoi, winRate, avgVolume } = traderData
  const traderPnlData = pnlData?.[account]
  const { setTrader } = useQuickViewTraderStore()
  const handleClickLogin = useClickLoginButton()
  const handleClickCopy = (traderData: ResponseTraderData) => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    onClickCopyTrade(traderData)
  }

  return (
    <Box
      sx={{
        display: 'block',
        color: 'inherit',
        width: '100%',
        height: '100%',
        // bg: 'rgba(49, 56, 86, 0.2)',
        bg: '#131624',
        p: 3,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(49, 56, 86, 0.3)',
        transition: '0.3s',
        '&:hover': {
          bg: 'rgba(49, 56, 86, 0.3)',
        },
      }}
    >
      <Flex
        mb={24}
        sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between', '& *': { fontWeight: 600 } }}
      >
        <AccountInfo
          address={account}
          protocol={protocol}
          avatarSize={32}
          textSx={{ width: 'fit-content' }}
          linkTarget="_blank"
          type={type}
          onPreview={() => {
            logEventLite({ event: EVENT_ACTIONS[EventCategory.LITE].LITE_PREVIEW_TRADER })
          }}
          quickViewDisabledActions={['copy-trade']}
          quickViewDisabledLinkAccount
        />
      </Flex>
      <Box
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          setTrader(
            { address: account, protocol, type, eventCategory: EventCategory.LITE },
            { disabledActions: ['copy-trade'], disabledLinkAccount: true }
          )
        }}
      >
        <Flex mb={3} sx={{ alignItems: 'center', gap: 24 }}>
          <Box>
            <Flex mb={1} sx={{ alignItems: 'center', gap: 1 }}>
              <Type.Small color="neutral2">
                <Trans>PNL</Trans>
              </Type.Small>
              <Type.Small
                color="neutral3"
                sx={{
                  fontSize: '10px',
                  lineHeight: '17px',
                  height: '17px',
                  border: 'small',
                  borderColor: 'neutral4',
                  px: 1,
                  borderRadius: '4px',
                }}
              >
                <Trans>{TIME_TRANSLATION_FULL[type]}</Trans>
              </Type.Small>
            </Flex>

            <Type.H5 mb={1}>
              <SignedText value={realisedPnl} minDigit={0} maxDigit={0} fontInherit prefix="$" />
            </Type.H5>

            <Flex sx={{ alignItems: 'center', gap: 2 }}>
              <Type.Small display="block" color="neutral2">
                <Trans>Avg ROI</Trans>
              </Type.Small>
              <Type.Small sx={{ fontWeight: 600 }}>
                <SignedText value={realisedAvgRoi} minDigit={2} maxDigit={2} fontInherit suffix="%" />
              </Type.Small>
            </Flex>
          </Box>
          <Box flex="1 0 0" sx={{ height: 64 }}>
            <LineChartTraderPnl
              data={parsePnLStatsData(traderPnlData)}
              isCumulativeData={false}
              dayCount={
                TIME_FILTER_OPTIONS.find((option) => option.id === (type as unknown as TimeFilterByEnum))?.value ??
                DAY_COUNT
              }
              isSimple
              hasBalanceText={false}
              height={64}
              address={account}
              protocol={protocol}
            />
          </Box>
        </Flex>
        <Box mb={22} sx={{ display: 'grid', gap: 3, gridTemplateColumns: '1fr 1fr' }}>
          <Box>
            <Type.Caption display="block" color="neutral2">
              <Trans>Win Rate</Trans>
            </Type.Caption>
            <Type.Caption sx={{ fontWeight: 600 }}>{formatNumber(winRate, 0, 0)}%</Type.Caption>
          </Box>
          <Box>
            <Type.Caption display="block" color="neutral2">
              <Trans>Avg Volume</Trans>
            </Type.Caption>
            <Type.Caption sx={{ fontWeight: 600 }}>${formatNumber(avgVolume, 2, 2)}</Type.Caption>
          </Box>
        </Box>
      </Box>
      <Button block variant="primary" onClick={() => handleClickCopy(traderData)}>
        <Trans>Copy Trade</Trans>
      </Button>
    </Box>
  )
}

function NotFoundData() {
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Image mt={[3, 64]} mb={2} src={tokenNotFound} sx={{ width: [150, 190], height: [150, 190] }} alt="token" />
      <Type.Body color="neutral3">
        <Trans>Not found any trending traders at this moment</Trans>
      </Type.Body>
    </Flex>
  )
}
