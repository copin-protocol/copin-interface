import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const useActiveLink = () => {
  const [activeLink, setActiveLink] = useState('')
  const location = useLocation()

  useEffect(() => {
    setActiveLink(location.pathname)
  }, [location])

  return { activeLink, setActiveLink }
}

export default useActiveLink
