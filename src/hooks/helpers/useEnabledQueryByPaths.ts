import { useLocation } from 'react-router-dom'

import ROUTES from 'utils/config/routes'

export default function useEnabledQueryByPaths(excludingPaths: string[], includingHome = false) {
  const { pathname } = useLocation()
  const enabled =
    (pathname === ROUTES.HOME.path && includingHome) ||
    (pathname !== ROUTES.HOME.path && !excludingPaths.some((path) => !!pathname.match(path)?.length))
  return enabled
}
