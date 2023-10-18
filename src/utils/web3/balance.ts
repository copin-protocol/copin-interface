import { JsonRpcProvider } from '@ethersproject/providers'

import { Account } from './types'

export const getNativeBalance = async (provider: JsonRpcProvider, address: string) => {
  return await provider.getBalance(address)
}

export const getTokenBalanceFromAccount = (account: Account, tokenSymbol: string): number => {
  const token = account.secondaryTokens?.find((t) => t.name === tokenSymbol)
  return token ? Number(token.balance) : 0
}
