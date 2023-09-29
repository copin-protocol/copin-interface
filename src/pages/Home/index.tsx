import { useResponsive } from 'ahooks'
import { lazy, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'

import CustomPageTitle from 'components/@ui/CustomPageTitle'
import MultipleBackTestModal from 'components/BacktestModal/MultipleBacktestModal'
import ROUTES from 'utils/config/routes'

const HomeDesktop = lazy(() => import('./Layouts/HomeDesktop'))
const HomeMobile = lazy(() => import('./Layouts/HomeMobile'))

export default function Home() {
  const { lg } = useResponsive()
  const { replace } = useHistory()
  const prevLg = useRef(lg)
  useEffect(() => {
    if (prevLg.current === lg) return
    prevLg.current = lg
    replace(ROUTES.HOME_EXPLORER.path)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lg])
  return (
    <>
      <CustomPageTitle />
      {lg ? <HomeDesktop key={lg.toString()} /> : <HomeMobile key={lg.toString()} />}
      <MultipleBackTestModal />
    </>
  )
}
