import { Trans } from '@lingui/macro'
import { memo } from 'react'
import Slider, { Settings } from 'react-slick'

import Divider from 'components/@ui/Divider'
import useGetCopyExchangeStatus from 'hooks/features/systemConfig/useGetCopyExchangeStatus'
import useGetProtocolStatus from 'hooks/features/systemConfig/useGetProtocolStatus'
import { useGlobalProtocolFilterStore } from 'hooks/store/useProtocolFilter'
import AlertBanner from 'theme/Alert/AlertBanner'
import { VerticalCarouselWrapper } from 'theme/Carousel/Wrapper'
import { Box, Type } from 'theme/base'
import { LINKS } from 'utils/config/constants'
import { ProtocolEnum, SystemAlertTypeEnum } from 'utils/config/enums'
import ROUTES from 'utils/config/routes'
import { overflowEllipsis } from 'utils/helpers/css'

export function CopyExchangeAlertBanner() {
  const { listExchangeDisabled, getExchangeMaintenanceMessage } = useGetCopyExchangeStatus()
  if (!listExchangeDisabled?.length) return null
  return (
    <>
      <NormalBannerItem msg={getExchangeMaintenanceMessage()} />
      <Divider />
    </>
  )
}

export function TraderExplorerAlertBanner() {
  const { listProtocolMaintenance } = useGetProtocolStatus()
  const { selectedProtocols } = useGlobalProtocolFilterStore()
  const showAlert = !!listProtocolMaintenance?.some((p) => !!selectedProtocols?.includes(p))
  if (!showAlert || !selectedProtocols?.length || selectedProtocols.length > 1) return null
  return (
    <>
      <TraderExplorerBannerItem protocols={selectedProtocols} />
      <Divider />
    </>
  )
}

export const TraderDetailsAlertBanner = memo(function TraderDetailsAlertBanner({
  protocol,
}: {
  protocol: ProtocolEnum
}) {
  const { listProtocolMaintenance } = useGetProtocolStatus()
  const showAlert = !!listProtocolMaintenance?.some((p) => protocol === p)
  if (!showAlert) return null
  return <TraderExplorerBannerItem protocols={[protocol]} />
})

function TraderExplorerBannerItem({ protocols }: { protocols: ProtocolEnum[] | undefined }) {
  const { getProtocolMaintenanceMessage } = useGetProtocolStatus()
  if (!protocols?.length) return null
  const listMsg = getProtocolMaintenanceMessage(protocols)
  if (!listMsg.length) return null
  return (
    <BannerWrapper
      listAlert={listMsg.map((msg, index) => ({ id: `system_alert_trader_explorer_${index}`, message: msg }))}
    />
  )
}
type ItemProps = {
  type?: SystemAlertTypeEnum
  message: string
  id: string
  support?: boolean
}
function NormalBannerItem({ msg, support }: { msg: string; support?: boolean }) {
  return <Item id={`system_alert`} type={SystemAlertTypeEnum.WARNING} message={msg} support={!!support} />
}

function Item({ type = SystemAlertTypeEnum.WARNING, message, id, support }: ItemProps) {
  return (
    <AlertBanner
      id={id}
      type={type}
      message={message}
      link={ROUTES.SYSTEM_STATUS.path}
      sx={{
        height: 40,
        '& > *': { maxWidth: '100%', ...overflowEllipsis(), textAlign: 'center' },
        '& *': { fontSize: [] },
      }}
      action={
        !!support ? (
          <Type.Caption>
            <Trans>
              If you experience any problems, please contact us on Telegram{' '}
              <Box as="a" href={LINKS.support} target="_blank">
                @leecopin
              </Box>
              .
            </Trans>
          </Type.Caption>
        ) : undefined
      }
    />
  )
}

export function BannerWrapper({ listAlert }: { listAlert: ItemProps[] }) {
  if (!listAlert?.length) return null
  if (listAlert.length === 1) return <Item {...listAlert[0]} />

  return (
    <Box>
      <VerticalCarouselWrapper
        height={40}
        sx={{
          borderRadius: '0 !important',
          '.slick-vertical .slick-slide': { border: 'none !important' },
        }}
      >
        <Slider {...settings}>
          {listAlert
            .map((v, index) => {
              return <Item key={index} {...v} />
            })
            .filter((v) => !!v)}
        </Slider>
      </VerticalCarouselWrapper>
      <Divider />
    </Box>
  )
}

const settings: Settings = {
  speed: 500,
  autoplay: true,
  autoplaySpeed: 8000,
  pauseOnHover: true,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  dots: false,
  vertical: true,
  verticalSwiping: false,
  swipe: false,
}
