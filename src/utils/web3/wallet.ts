import { Web3Provider } from '@ethersproject/providers'

import { SignTypeData } from './types'

function isUnwrappedRpcResult(response: unknown): response is {
  error?: string
  result?: unknown
} {
  return typeof response === 'object' && response !== null && 'jsonrpc' in response
}

export function rpcResult(response: unknown): unknown | null {
  // Some providers don’t wrap the response
  if (isUnwrappedRpcResult(response)) {
    if (response.error) {
      throw new Error(response.error)
    }
    return response.result || null
  }

  return response || null
}

export const signVerifyCode = async (
  from: string,
  verifyCode: string,
  time: string,
  web3Provider: Web3Provider
): Promise<string | undefined> => {
  const message = `I want to login on Copin.io at ${time}. Login code: ${verifyCode}`
  // if (web3Provider) {
  const signer = web3Provider.getSigner(from)
  return await signer.signMessage(message)
  // }
  // const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`

  // const provider = window.ethereum
  // if (provider && provider.request) {
  //   const sign = await provider
  //     .request({
  //       method: 'personal_sign',
  //       params: [msg, from],
  //     })
  //     .then(rpcResult)
  //   return sign as string
  // }
  // return
}

export const signTypedData = async (
  from: string,
  data: SignTypeData,
  web3Provider: Web3Provider
): Promise<string | undefined> => {
  const signer = web3Provider.getSigner(from)
  return await signer._signTypedData(data.domain, data.types, data.value)
}
