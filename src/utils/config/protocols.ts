import { ARBITRUM_MAINNET, OPTIMISM_MAINNET } from 'utils/web3/chains'

import { ProtocolEnum } from './enums'

export type ProtocolOptionProps = {
  id: ProtocolEnum
  text: string
  chainId: number
}

export const PROTOCOLS = [ProtocolEnum.GMX, ProtocolEnum.KWENTA]
export const PROTOCOL_OPTIONS: ProtocolOptionProps[] = [
  {
    id: ProtocolEnum.GMX,
    text: 'GMX',
    chainId: ARBITRUM_MAINNET,
  },
  {
    id: ProtocolEnum.KWENTA,
    text: 'Kwenta',
    chainId: OPTIMISM_MAINNET,
  },
]
