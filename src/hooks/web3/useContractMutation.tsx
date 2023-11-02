import { TransactionReceipt, TransactionResponse } from '@ethersproject/abstract-provider'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Trans } from '@lingui/macro'
import React, { ReactText, useRef } from 'react'
import { UseMutationOptions, useMutation } from 'react-query'
import { toast } from 'react-toastify'

import ToastBody from 'components/@ui/ToastBody'
import TransactionLink from 'components/@ui/TransactionLink'
import { Box, Type } from 'theme/base'
import { getContractErrorMessage } from 'utils/helpers/handleError'

class TransactionError extends Error {
  hash: string
  constructor(message: string, hash: string, ...params: any[]) {
    super(...params)
    this.name = 'TransactionError'
    this.message = message
    this.hash = hash
  }
}

const useContractMutation = (contract: Contract, options?: { successMsg?: string & UseMutationOptions }) => {
  const { successMsg, ...opts } = options ?? {}
  const loadingRef = useRef<ReactText>()
  return useMutation({
    mutationFn: async ({
      method,
      params,
      gasLimit,
      value,
    }: {
      method: string
      params: any[]
      gasLimit?: number
      value?: BigNumber
    }) => {
      const tx: TransactionResponse = await contract[method](...params, {
        gasLimit,
        value,
      })
      const result = await tx.wait()
      if (result.status === 0)
        throw new TransactionError('Error encountered during contract execution', result.transactionHash)
      return result
    },
    onMutate: () => {
      loadingRef.current = toast.loading(
        <ToastBody title="Executing..." message="You're trying to execute a contract function" />
      )
    },
    onSuccess: (result: TransactionReceipt) => {
      toast.dismiss(loadingRef.current)
      toast.success(
        <ToastBody
          title={<Trans>Success</Trans>}
          message={
            <Box>
              <Box>
                <Type.Caption color="neutral3" sx={{ wordBreak: 'break-word' }}>
                  {successMsg ?? <Trans>Transaction has been executed successfully</Trans>}
                </Type.Caption>
              </Box>
              <TransactionLink hash={result.transactionHash} />
            </Box>
          }
        />
      )
    },
    onError: (err: any) => {
      toast.dismiss(loadingRef.current)
      const message = getContractErrorMessage(err)
      const hash = err.hash
      toast.error(
        <ToastBody
          title={<Trans>Error</Trans>}
          message={
            hash ? (
              <Box>
                <Box>
                  <Type.Caption color="neutral3" sx={{ wordBreak: 'break-word' }}>
                    {message}
                  </Type.Caption>
                </Box>
                <TransactionLink hash={hash} isSuccess={false} />
              </Box>
            ) : (
              getContractErrorMessage(err)
            )
          }
        />
      )
    },
    ...opts,
  })
}

export default useContractMutation
