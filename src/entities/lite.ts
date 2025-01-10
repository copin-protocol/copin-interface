export enum LITE_TRANSACTION_TYPE {
  WITHDRAW = 'WITHDRAW',
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
}
export enum LITE_ACTION_STATUS {
  PENDING = 'PENDING',
  IN_PROCESSING = 'IN_PROCESSING',
  ON_HOLD = 'ON_HOLD',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILURE = 'FAILURE',
  WITHDRAWN = 'WITHDRAWN',
}

export interface LiteTransactionData {
  embeddedWallet: string
  data: {
    // deposit
    requestTxHash: string
    requestLogIndex: number
    requestTime: string
    relayerAddress: string
    amountStr: string
    permit: {
      signature: string
      deadline: number
    }
    // withdraw
    destinationAddress: string
    amount: number
    feeAmount: number
    hyperliquidWithdrawFeeAmount: number
    hyperliquidTransferFeeAmount: number
    withdrawAmount: number
    receiveAmount: number
    withdrawTime: string
    txHash: string
    chargeFeeTime: string
    chargeFeeTxHash: string
  }
  estimatedFinishTime: string
  type: LITE_TRANSACTION_TYPE
  status: LITE_ACTION_STATUS
  createdAt: string
}

export interface LiteConfig {
  minWithdraw: number
  withdrawFee: number
  hyperliquidTransferFee: number
  hyperliquidWithdrawFee: number
  withdrawTimeInSeconds: number
  depositTimeInSeconds: number
  feeReceipient: string
}
