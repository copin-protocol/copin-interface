import { X } from '@phosphor-icons/react'
import { useResponsive } from 'ahooks'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce'
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import OutsideClickHandler from 'react-outside-click-handler'
import { Link } from 'react-router-dom'

import { GradientText } from 'components/@ui/GradientText'
import { TradingEventStatusEnum } from 'entities/event'
import { useSystemConfigContext } from 'hooks/features/useSystemConfigContext'
import { Box, Flex, Type } from 'theme/base'
import { linearGradient1 } from 'theme/colors'
import { DCP_SUPPORTED_PROTOCOLS } from 'utils/config/constants'
import { EventTypeEnum, ProtocolEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'
import { PROTOCOL_OPTIONS_MAPPING } from 'utils/config/protocols'
import ROUTES from 'utils/config/routes'
import { Z_INDEX } from 'utils/config/zIndex'
import { generateEventDetailsRoute, generateExplorerRoute } from 'utils/helpers/generateRoute'

type State = {
  visible: boolean
  isShowMenu: boolean
  x: number
  y: number
}

const ICON_SIZE = 36

const MAX_Y = window.innerHeight - 500

type EventNotificationStore = State & {
  lastCheck: string
}

export default function EventsNotification() {
  const [state, setState] = useState<State | null>(null)

  const onDrag: DraggableEventHandler = useCallback((e, data) => {
    const { y } = data
    setState((prev) => {
      if (prev == null) {
        return getDefaultValues(false)
      }
      const defaultPosition = getDefaultPositionValues(prev.isShowMenu)
      const realY = y >= defaultPosition.y ? defaultPosition.y : y <= MAX_Y ? MAX_Y : y

      return { ...prev, x: defaultPosition.x, y: realY }
    })
  }, [])

  const onToggleMenu = useCallback(
    () =>
      setState((prev) => {
        return prev == null
          ? getDefaultValues(false)
          : { ...prev, x: getDefaultPositionValues(!prev.isShowMenu).x, isShowMenu: !prev.isShowMenu }
      }),
    []
  )
  const hideMenu = useCallback(() => {
    setState((prev) => {
      if (prev == null) {
        return getDefaultValues(false)
      }
      return { ...prev, x: getDefaultPositionValues(false).x, isShowMenu: false }
    })
  }, [])

  const { events } = useSystemConfigContext()
  const gnsEvent = useMemo(
    () => events?.find((e) => e.type === EventTypeEnum.GNS && e.status !== TradingEventStatusEnum.ENDED),
    [events]
  )

  useEffect(() => {
    const storedData = getStoredData()
    if (!storedData) {
      setState({ ...getDefaultPositionValues(true), visible: true, isShowMenu: true })
      return
    }
    const getRealDefaultPosition = (isShowMenu: boolean) => {
      const _defaultPosition = getDefaultPositionValues(isShowMenu)
      const _realY =
        storedData.y >= _defaultPosition.y ? _defaultPosition.y : storedData.y <= MAX_Y ? MAX_Y : storedData.y
      return { x: _defaultPosition.x, y: _realY }
    }

    if (storedData.isShowMenu) {
      const { x, y } = getRealDefaultPosition(true)
      setState({ visible: true, x, y, isShowMenu: true })
      return
    }

    // diff from last check to 0h utc
    const dayDiff = dayjs()
      .utc()
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .diff(dayjs(storedData.lastCheck).utc(), 'd')
    if (dayDiff > 1 && !storedData.isShowMenu) {
      const { x, y } = getRealDefaultPosition(true)
      setState({ visible: true, x, y, isShowMenu: true })
    } else {
      const { x, y } = getRealDefaultPosition(storedData.isShowMenu)
      setState({ isShowMenu: storedData.isShowMenu, x, y, visible: true })
    }
  }, [])

  const handleResize = useCallback(
    debounce(() => {
      setState((prev) => {
        const newState: State = {
          isShowMenu: !!prev?.isShowMenu,
          visible: true,
          ...getDefaultPositionValues(!!prev?.isShowMenu),
        }
        setStoredData(newState)
        return newState
      })
    }, 100),
    []
  )
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  const handleSetStore = useCallback(
    debounce((state: State) => {
      setState(state)
      setStoredData(state)
    }, 100),
    []
  )
  useEffect(() => {
    if (state == null) return
    handleSetStore(state)
  }, [state])

  const timeRef = useRef(0)
  const onClickStart = () => {
    timeRef.current = dayjs().utc().valueOf()
  }
  const onClickEnd = () => {
    const clickEndTime = dayjs().utc().valueOf()
    if (clickEndTime - timeRef.current > 200) return
    onToggleMenu()
  }

  const menu = useMemo(() => {
    return (
      <Flex
        sx={{
          flexDirection: 'column',
          gap: 2,
          width: 312,
          position: 'absolute',
          bottom: '100%',
          right: 0,
          pb: 2,
        }}
      >
        {!!gnsEvent && (
          <EventNotificationWrapper
            title={'Join the $10,000 ARB Decentralized Copy-Trading Competition'}
            titleIcon={'✨'}
            description={
              <Box as="span">
                Start copying from on-chain traders on perpetual DEXs: <DCPSupportProtocol />. Rank among the top 20
                volumes through gTrade, and maximize your rewards!
              </Box>
            }
            actionButton={
              <Link
                className="strong"
                onClick={hideMenu}
                to={generateEventDetailsRoute(gnsEvent)}
                style={{ display: 'block', padding: '0 32px', height: '100%' }}
              >
                Join Event
              </Link>
            }
          />
        )}
        <EventNotificationWrapper
          title={'Earn $10,000 ARB in Fee Rebates'}
          titleIcon={'🎉'}
          description={
            <Box as="span">
              Save on trading fees with Copin&apos;s Decentralized Copy-Trading (DCP) Fee Rebate Program. Earn a share
              of 10,000 ARB in rebates by using the DCP feature through gTrade!
            </Box>
          }
          actionButton={
            <Link
              onClick={hideMenu}
              to={ROUTES.FEE_REBATE.path}
              style={{ display: 'block', padding: '0 32px', height: '100%' }}
              className="strong"
            >
              Join DCP & Claim Fee Rebates
            </Link>
          }
        />
      </Flex>
    )
  }, [gnsEvent])
  const iconStyle: any = useMemo(() => {
    return {
      position: 'relative',
      height: ICON_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      cursor: 'pointer',
      backgroundImage: linearGradient1,
      borderRadius: '25px',
      px: !!state?.isShowMenu ? `${(ICON_SIZE - 24) / 2}px` : 3,
      backgroundSize: '130%',
      transition: '0.3s',
      '&:hover': { backgroundSize: '130%', transform: 'scale(1.05)' },
    }
  }, [state?.isShowMenu])
  const { sm } = useResponsive()

  if (!state?.visible) return null

  return (
    <OutsideClickHandler onOutsideClick={hideMenu}>
      <Draggable cancel={sm ? undefined : '.strong'} axis="y" position={{ x: state?.x, y: state?.y }} onDrag={onDrag}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            // top: state.y,
            // left: state.x,
            zIndex: Z_INDEX.THEME_MODAL,
          }}
        >
          <Flex
            onMouseDown={onClickStart}
            onMouseUp={onClickEnd}
            onTouchStart={onClickStart}
            onTouchEnd={onClickEnd}
            color="black"
            sx={iconStyle}
          >
            {state.isShowMenu ? (
              <X size={24} />
            ) : (
              <>
                <EventIcon />
                <Type.CaptionBold>Events</Type.CaptionBold>
              </>
            )}
          </Flex>
          {state.isShowMenu && menu}
        </Box>
      </Draggable>
    </OutsideClickHandler>
  )
}
function getStoredData() {
  const storedStr = localStorage.getItem(STORAGE_KEYS.EVENT_NOTIFICATION_LAST_CHECK)
  if (!storedStr) return undefined
  try {
    const storedData = JSON.parse(storedStr) as EventNotificationStore
    return storedData
  } catch {
    return undefined
  }
}
function setStoredData(state: State) {
  const data: EventNotificationStore = {
    ...state,
    lastCheck: dayjs.utc().toISOString(),
  }
  try {
    localStorage.setItem(STORAGE_KEYS.EVENT_NOTIFICATION_LAST_CHECK, JSON.stringify(data))
  } catch {}
}
function getDefaultPositionValues(isShowMenu: boolean) {
  return {
    x: window.innerWidth - (isShowMenu ? ICON_SIZE : 120) - 16,
    y: window.innerHeight - ICON_SIZE - 16,
  }
}
function getDefaultValues(isShowMenu: boolean): State {
  return {
    visible: true,
    isShowMenu: false,
    ...getDefaultPositionValues(isShowMenu),
  }
}

function EventNotificationWrapper({
  title,
  titleIcon,
  description,
  actionButton,
}: {
  title: ReactNode
  titleIcon: ReactNode
  description: ReactNode
  actionButton: ReactNode
}) {
  return (
    <Box
      sx={{
        borderRadius: '4px',
        p: 12,
        bg: 'neutral5',
        border: 'small',
        borderColor: 'neutral4',
        boxShadow: '0px 0px 5.5px 2px #3138568A',
      }}
    >
      <Type.CaptionBold mb={10}>
        {titleIcon} <GradientText bg={linearGradient1}>{title}</GradientText>
      </Type.CaptionBold>
      <Type.Caption display="block" mb={10} color="neutral2">
        {description}
      </Type.Caption>
      <Box
        sx={{
          width: 'max-content',
          borderRadius: '4px',
          backgroundImage: linearGradient1,
          color: 'neutral7',
          transition: '0.3s',
          backgroundSize: '100%',
          '& a': { fontWeight: 600, height: 40, lineHeight: '40px', color: 'inherit' },
          '&:hover': { backgroundSize: '130%', transform: 'scale(1.03)' },
        }}
      >
        <Type.Caption>{actionButton}</Type.Caption>
      </Box>
    </Box>
  )
}

const DCP_SUPPORT_PROTOCOL_OPTIONS = DCP_SUPPORTED_PROTOCOLS.map((protocol) => PROTOCOL_OPTIONS_MAPPING[protocol])
function DCPSupportProtocol() {
  return (
    <>
      {DCP_SUPPORT_PROTOCOL_OPTIONS.map((option, index) => {
        return (
          <>
            <Box key={option.id} as={Link} to={generateExplorerRoute({ protocol: option.id })}>
              {option.text}{' '}
              {option.id === ProtocolEnum.GNS_POLY || option.id === ProtocolEnum.GNS ? `(${option.label})` : ''}
            </Box>
            {index === DCP_SUPPORT_PROTOCOL_OPTIONS.length - 1 ? '' : ', '}
          </>
        )
      })}
    </>
  )
}

function EventIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_11460_20789)">
        <path
          d="M11.25 6.03469V1.5C11.25 1.30109 11.171 1.11032 11.0303 0.96967C10.8897 0.829018 10.6989 0.75 10.5 0.75C10.3011 0.75 10.1103 0.829018 9.96968 0.96967C9.82903 1.11032 9.75001 1.30109 9.75001 1.5V6.03469C7.63575 6.22769 5.67729 7.22833 4.28198 8.82847C2.88668 10.4286 2.16195 12.5051 2.25855 14.6259C2.35515 16.7468 3.26565 18.7487 4.80064 20.2154C6.33564 21.6821 8.37696 22.5005 10.5 22.5005C12.6231 22.5005 14.6644 21.6821 16.1994 20.2154C17.7344 18.7487 18.6449 16.7468 18.7415 14.6259C18.8381 12.5051 18.1133 10.4286 16.718 8.82847C15.3227 7.22833 13.3643 6.22769 11.25 6.03469ZM17.2069 13.5H14.2284C14.0869 10.8412 13.2169 8.96625 12.4059 7.77563C13.6799 8.1529 14.8145 8.89696 15.6683 9.91496C16.5221 10.933 17.0572 12.1798 17.2069 13.5ZM8.27251 15H12.7275C12.54 18.1425 11.2153 19.9641 10.5 20.7262C9.78376 19.9622 8.45907 18.1416 8.27251 15ZM8.27251 13.5C8.46001 10.3575 9.7847 8.53594 10.5 7.77375C11.2163 8.53781 12.5409 10.3584 12.7275 13.5H8.27251ZM8.59407 7.77563C7.78126 8.96625 6.91313 10.8412 6.77157 13.5H3.79313C3.94282 12.1798 4.47793 10.933 5.33171 9.91496C6.18549 8.89696 7.32013 8.1529 8.59407 7.77563ZM3.79313 15H6.77157C6.91313 17.6588 7.78313 19.5338 8.59407 20.7244C7.32013 20.3471 6.18549 19.603 5.33171 18.585C4.47793 17.567 3.94282 16.3202 3.79313 15ZM12.4059 20.7244C13.2169 19.5338 14.0869 17.6588 14.2284 15H17.2069C17.0572 16.3202 16.5221 17.567 15.6683 18.585C14.8145 19.603 13.6799 20.3471 12.4059 20.7244ZM24 8.25C24 8.44891 23.921 8.63968 23.7803 8.78033C23.6397 8.92098 23.4489 9 23.25 9H22.5V9.75C22.5 9.94891 22.421 10.1397 22.2803 10.2803C22.1397 10.421 21.9489 10.5 21.75 10.5C21.5511 10.5 21.3603 10.421 21.2197 10.2803C21.079 10.1397 21 9.94891 21 9.75V9H20.25C20.0511 9 19.8603 8.92098 19.7197 8.78033C19.579 8.63968 19.5 8.44891 19.5 8.25C19.5 8.05109 19.579 7.86032 19.7197 7.71967C19.8603 7.57902 20.0511 7.5 20.25 7.5H21V6.75C21 6.55109 21.079 6.36032 21.2197 6.21967C21.3603 6.07902 21.5511 6 21.75 6C21.9489 6 22.1397 6.07902 22.2803 6.21967C22.421 6.36032 22.5 6.55109 22.5 6.75V7.5H23.25C23.4489 7.5 23.6397 7.57902 23.7803 7.71967C23.921 7.86032 24 8.05109 24 8.25ZM14.25 3.75C14.25 3.55109 14.329 3.36032 14.4697 3.21967C14.6103 3.07902 14.8011 3 15 3H16.5V1.5C16.5 1.30109 16.579 1.11032 16.7197 0.96967C16.8603 0.829018 17.0511 0.75 17.25 0.75C17.4489 0.75 17.6397 0.829018 17.7803 0.96967C17.921 1.11032 18 1.30109 18 1.5V3H19.5C19.6989 3 19.8897 3.07902 20.0303 3.21967C20.171 3.36032 20.25 3.55109 20.25 3.75C20.25 3.94891 20.171 4.13968 20.0303 4.28033C19.8897 4.42098 19.6989 4.5 19.5 4.5H18V6C18 6.19891 17.921 6.38968 17.7803 6.53033C17.6397 6.67098 17.4489 6.75 17.25 6.75C17.0511 6.75 16.8603 6.67098 16.7197 6.53033C16.579 6.38968 16.5 6.19891 16.5 6V4.5H15C14.8011 4.5 14.6103 4.42098 14.4697 4.28033C14.329 4.13968 14.25 3.94891 14.25 3.75Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_11460_20789">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
