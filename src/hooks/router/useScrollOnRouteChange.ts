import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const useScrollOnRouteChange = () => {
  const location = useLocation()
  useEffect(() => {
    if (location.hash === '') {
      setTimeout(() => {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        })
      }, 50)
    }
  }, [location])
}

export default useScrollOnRouteChange
