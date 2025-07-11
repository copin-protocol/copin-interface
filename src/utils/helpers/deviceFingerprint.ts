import { createCipheriv, randomBytes } from 'crypto'

import { DeviceLog } from 'entities/deviceLog'
import { useLocalDetection } from 'hooks/helpers/useLocalDetection'

import DeviceDetection from './deviceDetection'

export const getDeviceInfo = (): DeviceLog => {
  const userAgent = navigator.userAgent
  const screenResolution = `${screen.width}x${screen.height}`
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const language = navigator.language

  const deviceDetection = new DeviceDetection()
  const deviceInfo = deviceDetection.parseSync(userAgent)

  // Detect device type
  let deviceType = 'DESKTOP'
  if (deviceInfo.device.type === 'mobile' || deviceInfo.device.type === 'tablet') deviceType = 'MOBILE'

  return {
    ip: null, // Will be filled by useLocalDetection
    location: null, // Will be filled by useLocalDetection
    deviceType,
    browser: deviceInfo.browser.name,
    os: deviceInfo.os.name,
    name: deviceInfo.device.name,
    userAgent,
    screenResolution,
    timezone,
    language,
    timestamp: Date.now(),
    // platform: navigator.platform,
    // cookieEnabled: navigator.cookieEnabled,
    // doNotTrack: navigator.doNotTrack,
    // hardwareConcurrency: navigator.hardwareConcurrency || null,
    // maxTouchPoints: navigator.maxTouchPoints || null,
    // vendor: navigator.vendor,
    // colorDepth: screen.colorDepth,
    // pixelDepth: screen.pixelDepth,
  }
}

export const encryptDeviceInfo = (deviceInfo: DeviceLog) => {
  try {
    const iv = randomBytes(16)
    const cipher = createCipheriv(
      'aes-256-cbc' as any,
      Buffer.from('qVItRtbGS0Q2l9fpMYKJdVk36nScyXbT') as any,
      iv as any
    )
    return Buffer.concat([cipher.update(JSON.stringify(deviceInfo)), cipher.final(), iv] as any).toString('hex')
  } catch (error) {}
  return ''
}

export const useDeviceFingerprint = () => {
  const { region, countryName, isLoading, ip } = useLocalDetection()

  const getFingerprint = async (): Promise<{ deviceInfo: DeviceLog; encryptedFingerprint: string }> => {
    const deviceInfo = getDeviceInfo()

    // Add location info if available
    if (countryName) {
      deviceInfo.location = `${region ? `${region}, ` : ''}${countryName}`
    }
    if (ip) {
      deviceInfo.ip = ip
    }

    const encryptedFingerprint = encryptDeviceInfo(deviceInfo)

    return { deviceInfo, encryptedFingerprint }
  }

  return { getFingerprint, isLoading }
}
