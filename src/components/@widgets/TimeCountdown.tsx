import styled from 'styled-components/macro'

import { Box } from 'theme/base'

const Wrapper = styled(Box)<{ iconsize?: number }>`
  @keyframes countdown {
    from {
      stroke-dashoffset: ${({ iconsize }) => `${((iconsize ?? 16) - 2) * Math.PI}px`};
    }
    to {
      stroke-dashoffset: 0px;
    }
  }
`

export default function TimeCountdown({ countdownTime = 3, size = 16 }: { countdownTime?: number; size?: number }) {
  // const countdownNumberRef = useRef<HTMLDivElement>(null)
  // useEffect(() => {
  //   if (!countdownNumberRef.current) return
  //   let timeout: any
  //   const changeCountdown = (_time: number) => {
  //     let nextTime = _time - 1
  //     if (nextTime <= 0) nextTime = countdownTime
  //     if (!countdownNumberRef.current) return
  //     countdownNumberRef.current.textContent = `${_time}`
  //     timeout = setTimeout(() => {
  //       changeCountdown(nextTime)
  //     }, 1000)
  //   }
  //   changeCountdown(countdownTime)
  //   return () => clearTimeout(timeout)
  // }, [countdownTime])
  return (
    <Wrapper
      iconsize={size}
      id="countdown"
      sx={{
        position: 'relative',
        margin: 'auto',
        height: `${size}px`,
        width: `${size}px`,
        textAlign: 'center',
      }}
    >
      {/* <Box
        ref={countdownNumberRef}
        sx={{
          color: 'white',
          display: 'inline-block',
          lineHeight: '40px',
        }}
      ></Box> */}
      <Box
        as="svg"
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: size,
          width: size,
          transform: 'rotateY(-180deg) rotateZ(-90deg)',
          '& circle': {
            strokeDasharray: `${(size - 2) * Math.PI}px`,
            strokeDashoffset: '0px',
            strokeLinecap: 'round',
            strokeWidth: '2px',
            stroke: 'white',
            fill: 'none',
            animation: `countdown ${countdownTime}s linear infinite forwards`,
          },
        }}
      >
        <Box as="circle" r={size / 2 - 2} cx={size / 2} cy={size / 2}></Box>
      </Box>
    </Wrapper>
  )
}
