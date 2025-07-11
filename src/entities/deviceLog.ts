export interface DeviceLog {
  id?: string
  ip: string | null
  location: string | null
  deviceType: string
  browser: string
  os: string
  userAgent: string
  screenResolution: string
  timezone: string
  language: string
  timestamp: number
  name: string
  lastLogin?: string
}
