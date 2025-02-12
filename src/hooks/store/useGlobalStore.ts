import dayjs from 'dayjs'
import { memo, useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import create from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { ProtocolEnum } from 'utils/config/enums'
import { STORAGE_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'
import { PositionTimeType } from 'utils/types'

interface GlobalStore {
  currentTime: string
  setCurrentTime: (time: string) => void
  protocol: ProtocolEnum | undefined
  setProtocol: (protocol: ProtocolEnum | undefined) => void
  positionTimeType: PositionTimeType
  setPositionTimeType: (type: PositionTimeType) => void
}

const useGlobalStore = create<GlobalStore>()(
  immer((set) => ({
    currentTime: dayjs().toISOString(),
    setCurrentTime: (time) =>
      set((state) => {
        state.currentTime = time
      }),
    protocol: undefined,
    setProtocol: (protocol) =>
      set((state) => {
        state.protocol = protocol
      }),
    positionTimeType: 'absolute',
    setPositionTimeType: (type) =>
      set((state) => {
        state.positionTimeType = type
      }),
  }))
)
export default useGlobalStore

const PATH_TO_UPDATE_RELATIVE_TIME = [ROUTES.LIVE_TRADES_ORDERS.path, ROUTES.TRADER_DETAILS.path_prefix]
export const GlobalStoreInitializer = memo(function GlobalStoreInitializerMemo() {
  const { positionTimeType, setPositionTimeType, setCurrentTime } = useGlobalStore()
  useLayoutEffect(() => {
    const storedTimeType = localStorage.getItem(STORAGE_KEYS.POSITION_TIME_TYPE) as PositionTimeType
    if (storedTimeType) setPositionTimeType(storedTimeType)
  }, [])

  const { pathname } = useLocation()
  useEffect(() => {
    let interval: NodeJS.Timer
    if (PATH_TO_UPDATE_RELATIVE_TIME.some((path) => !!pathname.includes(path)) && positionTimeType === 'relative') {
      interval = setInterval(() => {
        setCurrentTime(dayjs().toISOString())
      }, 3_000)
    } else {
    }
    return () => {
      interval != null && clearInterval(interval)
    }
  }, [pathname, positionTimeType])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSITION_TIME_TYPE, positionTimeType)
  }, [positionTimeType])
  return null
})
