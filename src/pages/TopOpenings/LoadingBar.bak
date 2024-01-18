import { useEffect, useRef, useState } from 'react'

import { Box } from 'theme/base'

const LoadingBar = ({ isRefetching }: { isRefetching: boolean }) => {
  const valueRef = useRef(0)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (valueRef.current > 0) {
        valueRef.current--
        setValue(valueRef.current)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isRefetching) {
      setValue(100)
      valueRef.current = 100
    } else {
      setValue(0)
      valueRef.current = 0
    }
  }, [isRefetching])

  return (
    <>
      <Box sx={{ position: 'absolute', top: 0, right: 0, width: `${value}%`, height: '2px' }} bg="primary1"></Box>
    </>
  )
}

export default LoadingBar
