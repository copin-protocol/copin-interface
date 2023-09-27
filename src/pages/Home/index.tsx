import { useResponsive } from 'ahooks'
import { lazy, useEffect, useRef } from 'react'

import MultipleBackTestModal from 'components/BacktestModal/MultipleBacktestModal'
import useSearchParams from 'hooks/router/useSearchParams'
import CustomPageTitle from 'components/@ui/CustomPageTitle'

const HomeDesktop = lazy(() => import('./Layouts/HomeDesktop'))
const HomeMobile = lazy(() => import('./Layouts/HomeMobile'))

export default function Home() {
  const { lg } = useResponsive()
  const prevLg = useRef(lg)
  const { setSearchParams } = useSearchParams()
  useEffect(() => {
    if (prevLg.current === lg) return
    prevLg.current = lg
    setSearchParams({ tab: null, page: null })
  }, [lg])
  return (
    <>
      <CustomPageTitle />
      {lg ? <HomeDesktop key={lg.toString()} /> : <HomeMobile key={lg.toString()} />}
      <MultipleBackTestModal />
    </>
  )
}
