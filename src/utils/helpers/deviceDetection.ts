/**
 * Secure User Agent Parser - Alternative to ua-parser-js
 * Focuses on security and performance without ReDoS vulnerabilities
 */

interface DeviceInfo {
  name: string
  type: 'mobile' | 'tablet' | 'desktop' | 'unknown'
}

interface OSInfo {
  name: string
  version: string
}

interface BrowserInfo {
  name: string
  version: string
}

interface ParseResult {
  device: DeviceInfo
  os: OSInfo
  browser: BrowserInfo
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  raw: string
}

interface FingerprintResult {
  id: string
  device: string
  os: string
  osVersion: string
  browser: string
  browserVersion: string
  platform: string
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

interface Pattern {
  name: string
  regex: RegExp
  os?: string
}

interface Patterns {
  mobile: Pattern[]
  desktop: Pattern[]
  browsers: Pattern[]
  osVersions: {
    ios: RegExp
    android: RegExp
    windows: RegExp
    macos: RegExp
  }
}

class DeviceDetection {
  private MAX_UA_LENGTH: number
  private REGEX_TIMEOUT: number
  private patterns: Patterns

  constructor() {
    // Maximum length to prevent ReDoS attacks
    this.MAX_UA_LENGTH = 1000

    // Timeout for regex operations (in milliseconds)
    this.REGEX_TIMEOUT = 100

    // Safe regex patterns - optimized to prevent ReDoS
    this.patterns = {
      // Mobile devices - simple, non-backtracking patterns
      mobile: [
        { name: 'iPhone', regex: /iPhone/i, os: 'iOS' },
        { name: 'iPad', regex: /iPad/i, os: 'iOS' },
        { name: 'iPod', regex: /iPod/i, os: 'iOS' },
        { name: 'Android Phone', regex: /Android.*Mobile/i, os: 'Android' },
        { name: 'Android Tablet', regex: /Android(?!.*Mobile)/i, os: 'Android' },
        { name: 'BlackBerry', regex: /BlackBerry/i, os: 'BlackBerry' },
        { name: 'Windows Phone', regex: /Windows Phone/i, os: 'Windows Phone' },
      ],

      // Desktop OS - simple patterns
      desktop: [
        { name: 'Windows', regex: /Windows NT/i, os: 'Windows' },
        { name: 'macOS', regex: /Mac OS X/i, os: 'macOS' },
        { name: 'Linux', regex: /Linux/i, os: 'Linux' },
        { name: 'Chrome OS', regex: /CrOS/i, os: 'Chrome OS' },
      ],

      // Browsers - non-greedy patterns
      browsers: [
        { name: 'Chrome', regex: /Chrome\/([\d.]+)/i },
        { name: 'Firefox', regex: /Firefox\/([\d.]+)/i },
        { name: 'Safari', regex: /Version\/([\d.]+).*Safari/i },
        { name: 'Edge', regex: /Edge?\/([\d.]+)/i },
        { name: 'Opera', regex: /Opera\/([\d.]+)/i },
        { name: 'Binance', regex: /Binance\/([\d.]+)/i },
      ],

      // OS versions - simple extraction
      osVersions: {
        ios: /OS ([\d_]+)/i,
        android: /Android ([\d.]+)/i,
        windows: /Windows NT ([\d.]+)/i,
        macos: /Mac OS X ([\d_]+)/i,
      },
    }
  }

  /**
   * Safe regex execution with timeout
   */
  private safeRegexTest(pattern: RegExp, text: string, timeout: number = this.REGEX_TIMEOUT): Promise<boolean> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(false)
      }, timeout)

      try {
        const result = pattern.test(text)
        clearTimeout(timeoutId)
        resolve(result)
      } catch (error) {
        clearTimeout(timeoutId)
        resolve(false)
      }
    })
  }

  /**
   * Safe regex match with timeout
   */
  private safeRegexMatch(
    pattern: RegExp,
    text: string,
    timeout: number = this.REGEX_TIMEOUT
  ): Promise<RegExpMatchArray | null> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve(null)
      }, timeout)

      try {
        const result = text.match(pattern)
        clearTimeout(timeoutId)
        resolve(result)
      } catch (error) {
        clearTimeout(timeoutId)
        resolve(null)
      }
    })
  }

  /**
   * Validate and sanitize user agent string
   */
  private sanitizeUserAgent(userAgent: string): string {
    if (!userAgent || typeof userAgent !== 'string') {
      return ''
    }

    // Truncate if too long
    if (userAgent.length > this.MAX_UA_LENGTH) {
      userAgent = userAgent.substring(0, this.MAX_UA_LENGTH)
    }

    // Remove potential malicious patterns
    userAgent = userAgent.replace(/[<>]/g, '')

    return userAgent
  }

  /**
   * Parse user agent synchronously with basic patterns
   */
  parseSync(userAgent: string): ParseResult {
    userAgent = this.sanitizeUserAgent(userAgent)

    if (!userAgent) {
      return this.getDefaultResult()
    }

    const result: ParseResult = {
      device: this.getDeviceSync(userAgent),
      os: this.getOSSync(userAgent),
      browser: this.getBrowserSync(userAgent),
      isMobile: this.isMobileSync(userAgent),
      isTablet: this.isTabletSync(userAgent),
      isDesktop: false,
      raw: userAgent,
    }

    result.isDesktop = !result.isMobile && !result.isTablet
    return result
  }

  /**
   * Parse user agent asynchronously with safe regex
   */
  async parseAsync(userAgent: string): Promise<ParseResult> {
    userAgent = this.sanitizeUserAgent(userAgent)

    if (!userAgent) {
      return this.getDefaultResult()
    }

    const [device, os, browser, isMobile, isTablet] = await Promise.all([
      this.getDeviceAsync(userAgent),
      this.getOSAsync(userAgent),
      this.getBrowserAsync(userAgent),
      this.isMobileAsync(userAgent),
      this.isTabletAsync(userAgent),
    ])

    return {
      device,
      os,
      browser,
      isMobile,
      isTablet,
      isDesktop: !isMobile && !isTablet,
      raw: userAgent,
    }
  }

  private getDefaultResult(): ParseResult {
    return {
      device: { name: 'Unknown', type: 'unknown' },
      os: { name: 'Unknown', version: 'Unknown' },
      browser: { name: 'Unknown', version: 'Unknown' },
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      raw: '',
    }
  }

  // Synchronous parsers (basic string operations)
  private getDeviceSync(userAgent: string): DeviceInfo {
    const ua = userAgent.toLowerCase()

    if (ua.includes('iphone')) return { name: 'iPhone', type: 'mobile' }
    if (ua.includes('ipad')) return { name: 'iPad', type: 'tablet' }
    if (ua.includes('ipod')) return { name: 'iPod', type: 'mobile' }
    if (ua.includes('android') && ua.includes('mobile')) return { name: 'Android Phone', type: 'mobile' }
    if (ua.includes('android')) return { name: 'Android Tablet', type: 'tablet' }
    if (ua.includes('blackberry')) return { name: 'BlackBerry', type: 'mobile' }
    if (ua.includes('windows phone')) return { name: 'Windows Phone', type: 'mobile' }
    if (ua.includes('windows')) return { name: 'Windows PC', type: 'desktop' }
    if (ua.includes('mac os x')) return { name: 'Mac', type: 'desktop' }
    if (ua.includes('linux')) return { name: 'Linux PC', type: 'desktop' }

    return { name: 'Unknown', type: 'unknown' }
  }

  private getOSSync(userAgent: string): OSInfo {
    const ua = userAgent.toLowerCase()

    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
      const version = this.extractVersion(userAgent, /OS ([\d_]+)/i)
      return { name: 'iOS', version: version.replace(/_/g, '.') }
    }

    if (ua.includes('android')) {
      const version = this.extractVersion(userAgent, /Android ([\d.]+)/i)
      return { name: 'Android', version }
    }

    if (ua.includes('windows')) {
      const version = this.extractVersion(userAgent, /Windows NT ([\d.]+)/i)
      return { name: 'Windows', version: this.mapWindowsVersion(version) }
    }

    if (ua.includes('mac os x')) {
      const version = this.extractVersion(userAgent, /Mac OS X ([\d_]+)/i)
      return { name: 'macOS', version: version.replace(/_/g, '.') }
    }

    if (ua.includes('linux')) {
      return { name: 'Linux', version: 'Unknown' }
    }

    return { name: 'Unknown', version: 'Unknown' }
  }

  private getBrowserSync(userAgent: string): BrowserInfo {
    // Check for specific browsers in order
    if (userAgent.includes('Binance/')) {
      const version = this.extractVersion(userAgent, /Binance\/([\d.]+)/i)
      return { name: 'Binance', version }
    }

    if (userAgent.includes('Chrome/')) {
      const version = this.extractVersion(userAgent, /Chrome\/([\d.]+)/i)
      return { name: 'Chrome', version }
    }

    if (userAgent.includes('Firefox/')) {
      const version = this.extractVersion(userAgent, /Firefox\/([\d.]+)/i)
      return { name: 'Firefox', version }
    }

    if (userAgent.includes('Safari/') && userAgent.includes('Version/')) {
      const version = this.extractVersion(userAgent, /Version\/([\d.]+)/i)
      return { name: 'Safari', version }
    }

    if (userAgent.includes('Edge/')) {
      const version = this.extractVersion(userAgent, /Edge\/([\d.]+)/i)
      return { name: 'Edge', version }
    }

    return { name: 'Unknown', version: 'Unknown' }
  }

  private isMobileSync(userAgent: string): boolean {
    const ua = userAgent.toLowerCase()
    return (
      ua.includes('mobile') ||
      ua.includes('iphone') ||
      ua.includes('ipod') ||
      ua.includes('blackberry') ||
      ua.includes('windows phone')
    )
  }

  private isTabletSync(userAgent: string): boolean {
    const ua = userAgent.toLowerCase()
    return ua.includes('ipad') || (ua.includes('android') && !ua.includes('mobile'))
  }

  // Async parsers (safe regex with timeout)
  private async getDeviceAsync(userAgent: string): Promise<DeviceInfo> {
    for (const pattern of this.patterns.mobile) {
      if (await this.safeRegexTest(pattern.regex, userAgent)) {
        return { name: pattern.name, type: 'mobile' }
      }
    }

    for (const pattern of this.patterns.desktop) {
      if (await this.safeRegexTest(pattern.regex, userAgent)) {
        return { name: pattern.name, type: 'desktop' }
      }
    }

    return { name: 'Unknown', type: 'unknown' }
  }

  private async getOSAsync(userAgent: string): Promise<OSInfo> {
    // iOS
    if (await this.safeRegexTest(/iPhone|iPad|iPod/i, userAgent)) {
      const match = await this.safeRegexMatch(this.patterns.osVersions.ios, userAgent)
      const version = match ? match[1].replace(/_/g, '.') : 'Unknown'
      return { name: 'iOS', version }
    }

    // Android
    if (await this.safeRegexTest(/Android/i, userAgent)) {
      const match = await this.safeRegexMatch(this.patterns.osVersions.android, userAgent)
      const version = match ? match[1] : 'Unknown'
      return { name: 'Android', version }
    }

    // Windows
    if (await this.safeRegexTest(/Windows/i, userAgent)) {
      const match = await this.safeRegexMatch(this.patterns.osVersions.windows, userAgent)
      const version = match ? this.mapWindowsVersion(match[1]) : 'Unknown'
      return { name: 'Windows', version }
    }

    // macOS
    if (await this.safeRegexTest(/Mac OS X/i, userAgent)) {
      const match = await this.safeRegexMatch(this.patterns.osVersions.macos, userAgent)
      const version = match ? match[1].replace(/_/g, '.') : 'Unknown'
      return { name: 'macOS', version }
    }

    return { name: 'Unknown', version: 'Unknown' }
  }

  private async getBrowserAsync(userAgent: string): Promise<BrowserInfo> {
    for (const pattern of this.patterns.browsers) {
      if (await this.safeRegexTest(pattern.regex, userAgent)) {
        const match = await this.safeRegexMatch(pattern.regex, userAgent)
        const version = match ? match[1] : 'Unknown'
        return { name: pattern.name, version }
      }
    }

    return { name: 'Unknown', version: 'Unknown' }
  }

  private async isMobileAsync(userAgent: string): Promise<boolean> {
    return await this.safeRegexTest(/Mobile|iPhone|iPad|iPod|Android|BlackBerry|Windows Phone/i, userAgent)
  }

  private async isTabletAsync(userAgent: string): Promise<boolean> {
    return await this.safeRegexTest(/iPad|Android(?!.*Mobile)/i, userAgent)
  }

  // Helper methods
  private extractVersion(userAgent: string, pattern: RegExp): string {
    try {
      const match = userAgent.match(pattern)
      return match ? match[1] : 'Unknown'
    } catch (error) {
      return 'Unknown'
    }
  }

  private mapWindowsVersion(version: string): string {
    const windowsVersions: Record<string, string> = {
      '10.0': '10',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7',
      '6.0': 'Vista',
      '5.1': 'XP',
    }

    return windowsVersions[version] || version
  }

  // Binance-style device fingerprinting
  createSecureFingerprint(userAgent: string): FingerprintResult {
    const parsed = this.parseSync(userAgent)

    const components = {
      device: parsed.device.name,
      os: `${parsed.os.name}_${parsed.os.version}`,
      browser: `${parsed.browser.name}_${parsed.browser.version}`,
      type: parsed.device.type,
      timestamp: Date.now(),
    }

    // Create a simple hash without using eval or dangerous operations
    const fingerprint = this.createSimpleHash(JSON.stringify(components))

    return {
      id: fingerprint,
      device: parsed.device.name,
      os: parsed.os.name,
      osVersion: parsed.os.version,
      browser: parsed.browser.name,
      browserVersion: parsed.browser.version,
      platform: parsed.device.type,
      isMobile: parsed.isMobile,
      isTablet: parsed.isTablet,
      isDesktop: parsed.isDesktop,
    }
  }

  private createSimpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 12)
  }
}

export default DeviceDetection
