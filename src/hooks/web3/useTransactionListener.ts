import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { useCallback, useRef } from 'react'

import { TransactionError } from 'utils/helpers/handleError'
import { pollEvery } from 'utils/helpers/pollEvery'
import { ConfirmationInfo } from 'utils/web3/types'

import useChain from './useChain'
import useWeb3 from './useWeb3'

const useTransactionListener = () => {
  const { walletProvider } = useWeb3()
  const { chain } = useChain()
  const _stopPollingConfirmations = useRef<() => void>()

  const subscribe = useCallback(
    (txHash: string, confirmationsNeeded = 1, notifyFn?: (info: ConfirmationInfo) => void) => {
      if (!walletProvider || !chain) return
      return new Promise((resolve: (receipt: TransactionReceipt) => void, reject: (error: Error) => void) => {
        let _confirmationInfo: ConfirmationInfo
        const pollChecking = pollEvery(
          (txHash: string) => ({
            request: async () => {
              const result = await walletProvider.getTransactionReceipt(txHash)
              return result
            },
            onResult: (result?: TransactionReceipt) => {
              if (!result) return
              if (result.status === 0) {
                reject(new TransactionError('Transaction failed', txHash))
                if (_stopPollingConfirmations.current) _stopPollingConfirmations.current()
                return
              }
              if (notifyFn) {
                if (!_confirmationInfo || _confirmationInfo.confirmations !== result?.confirmations) {
                  _confirmationInfo = {
                    txHash,
                    txLink: `${chain.blockExplorerUrl}/tx/${txHash}`,
                    status: result.status,
                    confirmations: result.confirmations,
                  }
                  notifyFn(_confirmationInfo)
                }
              }

              if (result.confirmations >= confirmationsNeeded) {
                if (_stopPollingConfirmations.current) _stopPollingConfirmations.current()
                resolve(result)
              }
            },
          }),
          1000
        )
        _stopPollingConfirmations.current = pollChecking(txHash)
      })
    },
    [chain, walletProvider]
  )
  const unsubscribe = useCallback(() => {
    if (_stopPollingConfirmations.current) _stopPollingConfirmations.current()
  }, [])
  return { subscribe, unsubscribe }
}

export default useTransactionListener
