import { ProtocolOptionProps } from 'utils/config/protocols'
import { CHAINS } from 'utils/web3/chains'

export function getProtocolConfigs(protocols: ProtocolOptionProps[]) {
  const protocolsByChains = protocols.reduce((result, protocol) => {
    if (protocol.chainId == 0) return result
    return { ...result, [protocol.chainId]: [...(result[protocol.chainId] ?? []), protocol] }
  }, {} as Record<number, ProtocolOptionProps[]>)
  Object.values(protocolsByChains).forEach((protocols) => {
    protocols.sort((a, b) => {
      return a.text.toLowerCase() < b.text.toLowerCase() ? -1 : a.text.toLowerCase() > b.text.toLowerCase() ? 1 : 0
    })
  })
  const chainOptions = Object.keys(protocolsByChains).map((chainId) => {
    return { ...CHAINS[Number(chainId)], chainIdNumber: Number(chainId) }
  })
  chainOptions.sort((a, b) => {
    return a.label.toLowerCase() < b.label.toLowerCase() ? -1 : a.label.toLowerCase() > b.label.toLowerCase() ? 1 : 0
  })
  return { protocolsByChains, chainOptions }
}
