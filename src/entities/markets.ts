import { ProtocolEnum } from 'utils/config/enums'

export type MarketsData = Record<ProtocolEnum, { symbol: string; indexTokens: string[]; isForex?: boolean }[]>
