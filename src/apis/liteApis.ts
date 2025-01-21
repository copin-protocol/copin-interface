import { LiteConfig, LiteTransactionData } from 'entities/lite'

import { ApiListResponse } from './api'
import requester from './index'
import { PaginationParams } from './types'

const SERVICE = 'embedded-wallets/hyperliquid'
const POSITION_SERVICE = 'hyperliquid/copy-position'

export async function withdrawLiteWalletApi(payload: {
  sourceAddress: string
  destinationAddress: string
  amount: number
}) {
  return requester.post(`${SERVICE}/withdraw`, payload).then((res: any) => res.data)
}

export async function closeLitePositionApi(copyPositionId: string) {
  return requester.post(`${POSITION_SERVICE}/close/${copyPositionId}`, {})
}

export async function getLiteTransactionsApi(
  pagination: PaginationParams
): Promise<ApiListResponse<LiteTransactionData>> {
  return requester.get(`${SERVICE}/transactions/page`, { params: pagination }).then((res: any) => res.data)
}

export async function getLiteConfigApi(): Promise<LiteConfig> {
  return requester.get(`public/embedded-wallets/config`).then((res: any) => res.data)
}

export async function closeHlPosition(payload: {
  walletAddress: string
  size: number
  isLong: boolean
  symbol: string
}) {
  return requester.post('hyperliquid/exchange/close-position', payload)
}

// POST hyperliquid/exchange/place-trigger-order

// {
//     "symbol": "BTC-USDT",
//     "isStopLoss": true,
//     "isLong": true,
//     "triggerPrice": 90000,
//     "size": 0.0001,
//     "walletAddress": "0xB5e0a8114b0245af87F9251Ac7824B88332AcD7E"
// }

// POST hyperliquid/exchange/cancel-order

// {
//     "symbol": "BTC-USDT",
//     "orderId": 61133094555,
//     "walletAddress": "0xB5e0a8114b0245af87F9251Ac7824B88332AcD7E"
// }
