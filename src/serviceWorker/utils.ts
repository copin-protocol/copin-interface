import { HlAccountData } from 'entities/hyperliquid'
import { MarketsData } from 'entities/markets'
import { API_URL, NETWORK } from 'utils/config/constants'

const CONFIG = {
  PYTH_PRICE_FEED_URL: NETWORK === 'devnet' ? 'https://hermes.pyth.network' : 'https://hermes.copin.io',
  CHUNK_SIZE: 100,
  UPDATE_INTERVAL: 3000,
  REQUEST_TIMEOUT: 300000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000,
  API_BASE_URL: API_URL,
}
const HEADER_CONFIG = {
  'Access-Control-Max-Age': '600',
}

export async function fetchHLAccountBalance({ address }: { address: string }) {
  const body = {
    type: 'clearinghouseState',
    user: address,
  }
  try {
    const res = await fetch(`https://api.hyperliquid.xyz/info`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { ...HEADER_CONFIG, 'Content-Type': 'application/json' },
    })
    const parsedRes = await res.json()
    const data = parsedRes as HlAccountData
    const hlBalance = Number(data.marginSummary?.accountValue ?? 0)
    return hlBalance
  } catch {
    return 0
  }
}

export async function fetchMarketsData() {
  const response = await retryAsync(
    async () => {
      const res = await fetch(`${CONFIG.API_BASE_URL}/pairs/tokens`, { headers: HEADER_CONFIG })
      const parsedRes = await res.json()
      const data = parsedRes.data as MarketsData
      return data
    },
    {
      maxRetries: CONFIG.MAX_RETRIES,
      initialDelay: CONFIG.RETRY_DELAY,
    }
  )
  return response
}

/**
 * Options for the retryAsync function
 */
interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Initial delay in milliseconds (default: 1000) */
  initialDelay?: number
  /** Maximum delay in milliseconds (default: 30000) */
  maxDelay?: number
  /** Called before each retry with (error, attempt, delay) */
  onRetry?: (error: Error, attempt: number, delay: number) => void
  /** Predicate to determine if an error should trigger a retry (default: retry all errors) */
  retryIf?: (error: Error) => boolean
}

/**
 * Retries an async function with exponential backoff when it fails
 * @param asyncFn - The async function to retry
 * @param options - Configuration options
 * @param args - Arguments to pass to the async function
 * @returns Result of the async function
 */
export async function retryAsync<T, Args extends any[]>(
  asyncFn: (...args: Args) => Promise<T>,
  options: RetryOptions = {},
  ...args: Args
): Promise<T> {
  const { maxRetries = 3, initialDelay = 1000, maxDelay = 30000, onRetry = null, retryIf = () => true } = options

  let attempt = 0
  let lastError: Error

  while (attempt <= maxRetries) {
    try {
      return await asyncFn(...args)
    } catch (error) {
      // Ensure error is an Error object
      lastError = error instanceof Error ? error : new Error(String(error))

      // Check if we've reached the max retries or if we shouldn't retry this error
      if (attempt >= maxRetries || !retryIf(lastError)) {
        break
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay)

      // Add some jitter to prevent thundering herd
      const jitter = Math.random() * 100
      const backoffDelay = delay + jitter

      // Call onRetry if provided
      if (typeof onRetry === 'function') {
        onRetry(lastError, attempt + 1, backoffDelay)
      }

      // Wait before next retry
      await new Promise((resolve) => setTimeout(resolve, backoffDelay))

      attempt++
    }
  }

  // If we reach here, all retries failed
  //@ts-ignore
  throw lastError
}
