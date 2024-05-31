export interface DepthCEXData {
  [key: string]: DepthPairData
}

export interface DepthPairData {
  pair: string
  latestUpdatedAt: string
  totalCopyVolume: number
  data: {
    [key: string]: DepthVolumeData
  }
}

export interface DepthVolumeData {
  longVolume: number
  shortVolume: number
}

export interface FormattedDepthPairData {
  pair: string
  symbol: string
  latestUpdatedAt: string
  totalCopyVolume: number
  [key: string]: DepthVolumeData
}

export interface DepthHistoriesData {
  timestamps: string[]
  longVolumes: number[]
  shortVolumes: number[]
}

export interface DepthHistoryData {
  date: string
  timestamp: string
  longVolume: number
  shortVolume: number
}
