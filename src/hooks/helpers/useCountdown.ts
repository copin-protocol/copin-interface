import { useEffect, useMemo, useState } from 'react'

export const getCountdownSeconds = (time: number, now: number) => Math.floor((time - now ?? Date.now()) / 1000)

const getTimerString = (num: number) => num.toString().padStart(2, '0')

export const getDurationFromSeconds = (duration: number) => {
  const days: number = Math.floor(duration / (3600 * 24))
  const hours: number = Math.floor((duration - days * (3600 * 24)) / 3600)
  const minutes: number = Math.floor((duration - days * (3600 * 24) - hours * 3600) / 60)
  const seconds: number = duration - days * (3600 * 24) - hours * 3600 - minutes * 60

  return {
    days: getTimerString(days),
    hours: getTimerString(hours),
    minutes: getTimerString(minutes),
    seconds: getTimerString(seconds),
  }
}

type Timer = { days: string; hours: string; minutes: string; seconds: string; hasEnded?: true }

const useCountdown = (endTime?: number) => {
  const [startTime, setStartTime] = useState(Date.now())
  const seconds = useMemo(() => {
    if (endTime) {
      const seconds = getCountdownSeconds(endTime, startTime)
      if (seconds <= 0) {
        return false
      }
      return seconds
    }
    return
  }, [endTime, startTime])

  const timer = useMemo<Timer | undefined>(() => {
    if (seconds == null) return
    if (seconds === false) return { days: '00', hours: '00', minutes: '00', seconds: '00', hasEnded: true }
    return getDurationFromSeconds(seconds)
  }, [seconds])

  useEffect(() => {
    if (!endTime) return
    const interval = setInterval(() => {
      const now = Date.now()
      if (now >= endTime) {
        clearInterval(interval)
        return
      }
      setStartTime(now)
    }, 1000)
    return () => clearInterval(interval)
  }, [endTime])
  return timer
}

export default useCountdown
