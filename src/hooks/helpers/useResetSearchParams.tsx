import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

import useSearchParams from 'hooks/router/useSearchParams'
import { TimeFilterByEnum } from 'utils/config/enums'
import { URL_PARAM_KEYS } from 'utils/config/keys'
import ROUTES from 'utils/config/routes'

const EXCLUDING_PATH = [ROUTES.COPIER_RANKING.path]

export default function useResetSearchParams() {
  const { searchParams, setSearchParams } = useSearchParams()
  const { pathname } = useLocation()
  const homeTimeFilter = searchParams[URL_PARAM_KEYS.HOME_TIME] as unknown as TimeFilterByEnum
  const explorerTimeFilter = searchParams[URL_PARAM_KEYS.EXPLORER_TIME_FILTER] as unknown as TimeFilterByEnum
  useLayoutEffect(() => {
    if (!!EXCLUDING_PATH.includes(pathname)) return
  }, [explorerTimeFilter, searchParams, homeTimeFilter, setSearchParams, pathname])
}
