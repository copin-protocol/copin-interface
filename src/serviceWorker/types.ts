import { WorkerMessage } from 'utils/types'

export interface PriceConfig {
  PYTH_PRICE_FEED_URL: string
  CHUNK_SIZE: number
  UPDATE_INTERVAL: number
  REQUEST_TIMEOUT: number
  MAX_RETRIES: number
  RETRY_DELAY_MULTIPLIER: number
  API_BASE_URL: string
}

export interface PythPriceData {
  symbol: string
  value: number
  publishTime: number
}

export interface PythPriceFeed {
  id: string
  price: {
    price: number
    expo: number
    publish_time: number
  }
}

export type MessageUpdateHandler = (data: WorkerMessage) => void
