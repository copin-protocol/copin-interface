import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { useCallback } from 'react'

import { pollEvery } from 'utils/helpers/pollEvery'

import useWeb3 from './useWeb3'

type ConfirmationInfo = {
  txHash: string
  txLink: string
  confirmations: number
}

class TransactionError extends Error {
  hash: string
  constructor(message: string, hash: string) {
    super(message) // (1)
    this.name = 'Transaction Failed' // (2)
    this.hash = hash
  }
}

const usePollCheckingConfirmations = () => {
  const { walletProvider } = useWeb3()
  const pollCheckingConfirmations = useCallback(
    (txHash: string, confirmationsNeeded = 1, notifyFn?: (info: ConfirmationInfo) => void) => {
      if (!walletProvider) return
      return new Promise((resolve: (receipt: TransactionReceipt) => void, reject) => {
        let _confirmationInfo: ConfirmationInfo
        const pollChecking = pollEvery(
          (txHash: string) => ({
            request: async () => {
              const result = await walletProvider.getTransactionReceipt(txHash)
              return result
            },
            onResult: (result: any) => {
              if (result?.status === 0) {
                reject(new TransactionError('Failed to execute. Please check the transaction for more details', txHash))
                if (_stopPollingConfirmations) _stopPollingConfirmations()
                return
              }
              if (notifyFn) {
                if (!_confirmationInfo || _confirmationInfo.confirmations !== result?.confirmations) {
                  _confirmationInfo = {
                    txHash,
                    txLink: `${import.meta.env.VITE_SCAN_URL}/tx/${txHash}`,
                    confirmations: result?.confirmations,
                  }
                  notifyFn(_confirmationInfo)
                }
              }

              if (result?.confirmations >= confirmationsNeeded) {
                if (_stopPollingConfirmations) _stopPollingConfirmations()
                resolve(result)
              }
            },
          }),
          1000
        )
        const _stopPollingConfirmations = pollChecking(txHash)
      })
    },
    [walletProvider]
  )

  return pollCheckingConfirmations
}

export default usePollCheckingConfirmations
