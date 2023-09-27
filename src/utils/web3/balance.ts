import { JsonRpcProvider } from '@ethersproject/providers'

export const getNativeBalance = async (provider: JsonRpcProvider, address: string) => {
  return await provider.getBalance(address)
}
