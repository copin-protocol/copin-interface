import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { useCallback, useRef } from 'react'

import useActiveWeb3React from 'hooks/web3/useActiveWeb3React'
import { TransactionError } from 'utils/helpers/handleError'
import { pollEvery } from 'utils/helpers/pollEvery'
import { ConfirmationInfo } from 'utils/web3/types'

const useTransactionListener = () => {
  const { library, chainInfo } = useActiveWeb3React()
  const _stopPollingConfirmations = useRef<() => void>()

  const subscribe = useCallback(
    (txHash: string, confirmationsNeeded = 1, notifyFn?: (info: ConfirmationInfo) => void) => {
      if (!library) return
      return new Promise((resolve: (receipt: TransactionReceipt) => void, reject: (error: Error) => void) => {
        let _confirmationInfo: ConfirmationInfo
        const pollChecking = pollEvery(
          (txHash: string) => ({
            request: async () => {
              const result = await library.getTransactionReceipt(txHash)
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
                    txLink: `${chainInfo.blockExplorerUrls[0]}/tx/${txHash}`,
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
    [chainInfo.blockExplorerUrls, library]
  )
  const unsubscribe = useCallback(() => {
    if (_stopPollingConfirmations.current) _stopPollingConfirmations.current()
  }, [])
  return { subscribe, unsubscribe }
}

export default useTransactionListener
