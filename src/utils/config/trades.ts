import { JsonRpcProvider } from '@ethersproject/providers'

import { ProtocolEnum } from 'utils/config/enums'
import { ARBITRUM_MAINNET, CHAINS, OPTIMISM_MAINNET } from 'utils/web3/chains'
import { rpcProvider } from 'utils/web3/providers'

type ProtocolProvider = { [key: string]: { chainId: number; provider: JsonRpcProvider; explorerUrl: string } }
export const PROTOCOL_PROVIDER: ProtocolProvider = {
  [ProtocolEnum.GMX]: {
    chainId: ARBITRUM_MAINNET,
    provider: rpcProvider(ARBITRUM_MAINNET),
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrls[0],
  },
  [ProtocolEnum.KWENTA]: {
    chainId: OPTIMISM_MAINNET,
    provider: rpcProvider(OPTIMISM_MAINNET),
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrls[0],
  },
}

export interface TokenTrade {
  address: string
  name: string
  symbol: string
  decimals: number
  // icon: string
}

export type TokenOptionProps = {
  id: string
  text: string
  filter_by: string
}

export const ALL_TOKENS_ID = 'ALL'
export const ALL_OPTION: TokenOptionProps = {
  id: ALL_TOKENS_ID,
  text: 'ALL',
  filter_by: ALL_TOKENS_ID,
}

type TokenSupport = { [key: string]: { [key: string]: TokenTrade } }

export const TOKEN_TRADE_SUPPORT: TokenSupport = {
  [ProtocolEnum.GMX]: {
    '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': {
      address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      name: 'BTC',
      symbol: 'BTC',
      decimals: 8,
      // icon: IconBTC,
    },
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': {
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      // icon: IconETH,
    },

    '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4': {
      address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
      name: 'LINK',
      symbol: 'LINK',
      decimals: 18,
      // icon: IconLINK,
    },
    '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0': {
      address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
      name: 'UNI',
      symbol: 'UNI',
      decimals: 18,
      // icon: IconUNI,
    },
  },
  [ProtocolEnum.KWENTA]: {
    '0x59b007E9ea8F89b069c43F8f45834d30853e3699': {
      address: '0x59b007E9ea8F89b069c43F8f45834d30853e3699',
      name: 'BTC',
      symbol: 'BTC',
      decimals: 8,
    },
    '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93': {
      address: '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93',
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },

    '0xD5fBf7136B86021eF9d0BE5d798f948DcE9C0deA': {
      address: '0xD5fBf7136B86021eF9d0BE5d798f948DcE9C0deA',
      name: 'CRV',
      symbol: 'CRV',
      decimals: 18,
    },
    '0x31A1659Ca00F617E86Dc765B6494Afe70a5A9c1A': {
      address: '0x31A1659Ca00F617E86Dc765B6494Afe70a5A9c1A',
      name: 'LINK',
      symbol: 'LINK',
      decimals: 18,
    },
    '0x442b69937a0daf9D46439a71567fABE6Cb69FBaf': {
      address: '0x442b69937a0daf9D46439a71567fABE6Cb69FBaf',
      name: 'OP',
      symbol: 'OP',
      decimals: 18,
    },
    '0x0EA09D97b4084d859328ec4bF8eBCF9ecCA26F1D': {
      address: '0x0EA09D97b4084d859328ec4bF8eBCF9ecCA26F1D',
      name: 'SOL',
      symbol: 'SOL',
      decimals: 18,
    },
    '0x074B8F19fc91d6B2eb51143E1f186Ca0DDB88042': {
      address: '0x074B8F19fc91d6B2eb51143E1f186Ca0DDB88042',
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    '0x509072A5aE4a87AC89Fc8D64D94aDCb44Bd4b88e': {
      address: '0x509072A5aE4a87AC89Fc8D64D94aDCb44Bd4b88e',
      name: 'ARB',
      symbol: 'ARB',
      decimals: 18,
    },
    '0x5374761526175B59f1E583246E20639909E189cE': {
      address: '0x5374761526175B59f1E583246E20639909E189cE',
      name: 'AAVE',
      symbol: 'AAVE',
      decimals: 18,
    },
    '0x6110DF298B411a46d6edce72f5CAca9Ad826C1De': {
      address: '0x6110DF298B411a46d6edce72f5CAca9Ad826C1De',
      name: 'XRP',
      symbol: 'XRP',
      decimals: 18,
    },
    '0xC18f85A6DD3Bcd0516a1CA08d3B1f0A4E191A2C4': {
      address: '0xC18f85A6DD3Bcd0516a1CA08d3B1f0A4E191A2C4',
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    '0x0940B0A96C5e1ba33AEE331a9f950Bb2a6F2Fb25': {
      address: '0x0940B0A96C5e1ba33AEE331a9f950Bb2a6F2Fb25',
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    '0xc203A12F298CE73E44F7d45A4f59a43DBfFe204D': {
      address: '0xc203A12F298CE73E44F7d45A4f59a43DBfFe204D',
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    '0x98cCbC721cc05E28a125943D69039B39BE6A21e9': {
      address: '0x98cCbC721cc05E28a125943D69039B39BE6A21e9',
      name: 'DOGE',
      symbol: 'DOGE',
      decimals: 18,
    },
    '0xF9DD29D2Fd9B38Cd90E390C797F1B7E0523f43A9': {
      address: '0xF9DD29D2Fd9B38Cd90E390C797F1B7E0523f43A9',
      name: 'ADA',
      symbol: 'ADA',
      decimals: 18,
    },
    '0x5B6BeB79E959Aac2659bEE60fE0D0885468BF886': {
      address: '0x5B6BeB79E959Aac2659bEE60fE0D0885468BF886',
      name: 'APE',
      symbol: 'APE',
      decimals: 18,
    },
    '0x9615B6BfFf240c44D3E33d0cd9A11f563a2e8D8B': {
      address: '0x9615B6BfFf240c44D3E33d0cd9A11f563a2e8D8B',
      name: 'APT',
      symbol: 'APT',
      decimals: 18,
    },
    '0xbB16C7B3244DFA1a6BF83Fcce3EE4560837763CD': {
      address: '0xbB16C7B3244DFA1a6BF83Fcce3EE4560837763CD',
      name: 'ATOM',
      symbol: 'ATOM',
      decimals: 18,
    },
    '0x3a52b21816168dfe35bE99b7C5fc209f17a0aDb1': {
      address: '0x3a52b21816168dfe35bE99b7C5fc209f17a0aDb1',
      name: 'AXS',
      symbol: 'AXS',
      decimals: 18,
    },
    '0x96690aAe7CB7c4A9b5Be5695E94d72827DeCC33f': {
      address: '0x96690aAe7CB7c4A9b5Be5695E94d72827DeCC33f',
      name: 'BCH',
      symbol: 'BCH',
      decimals: 18,
    },
    '0xa1Ace9ce6862e865937939005b1a6c5aC938A11F': {
      address: '0xa1Ace9ce6862e865937939005b1a6c5aC938A11F',
      name: 'BLUR',
      symbol: 'BLUR',
      decimals: 18,
    },
    '0x8B9B5f94aac2316f048025B3cBe442386E85984b': {
      address: '0x8B9B5f94aac2316f048025B3cBe442386E85984b',
      name: 'DOT',
      symbol: 'DOT',
      decimals: 18,
    },
    '0x139F94E4f0e1101c1464a321CBA815c34d58B5D9': {
      address: '0x139F94E4f0e1101c1464a321CBA815c34d58B5D9',
      name: 'DYDX',
      symbol: 'DYDX',
      decimals: 18,
    },
    '0x4bF3C1Af0FaA689e3A808e6Ad7a8d89d07BB9EC7': {
      address: '0x4bF3C1Af0FaA689e3A808e6Ad7a8d89d07BB9EC7',
      name: 'ETC',
      symbol: 'ETC',
      decimals: 18,
    },
    '0x2C5E2148bF3409659967FE3684fd999A76171235': {
      address: '0x2C5E2148bF3409659967FE3684fd999A76171235',
      name: 'FIL',
      symbol: 'FIL',
      decimals: 18,
    },
    '0x5ed8D0946b59d015f5A60039922b870537d43689': {
      address: '0x5ed8D0946b59d015f5A60039922b870537d43689',
      name: 'FLOKI',
      symbol: 'FLOKI',
      decimals: 18,
    },
    '0x27665271210aCff4Fab08AD9Bb657E91866471F0': {
      address: '0x27665271210aCff4Fab08AD9Bb657E91866471F0',
      name: 'FLOW',
      symbol: 'FLOW',
      decimals: 18,
    },
    '0x33d4613639603c845e61A02cd3D2A78BE7d513dc': {
      address: '0x33d4613639603c845e61A02cd3D2A78BE7d513dc',
      name: 'GMX',
      symbol: 'GMX',
      decimals: 18,
    },
    '0xaa94C874b91ef16C8B56A1c5B2F34E39366bD484': {
      address: '0xaa94C874b91ef16C8B56A1c5B2F34E39366bD484',
      name: 'LDO',
      symbol: 'LDO',
      decimals: 18,
    },
    '0xB25529266D9677E9171BEaf333a0deA506c5F99A': {
      address: '0xB25529266D9677E9171BEaf333a0deA506c5F99A',
      name: 'LTC',
      symbol: 'LTC',
      decimals: 18,
    },
    '0x572F816F21F56D47e4c4fA577837bd3f58088676': {
      address: '0x572F816F21F56D47e4c4fA577837bd3f58088676',
      name: 'MAV',
      symbol: 'MAV',
      decimals: 18,
    },
    '0xf7d9Bd13F877171f6C7f93F71bdf8e380335dc12': {
      address: '0xf7d9Bd13F877171f6C7f93F71bdf8e380335dc12',
      name: 'MKR',
      symbol: 'MKR',
      decimals: 18,
    },
    '0xC8fCd6fB4D15dD7C455373297dEF375a08942eCe': {
      address: '0xC8fCd6fB4D15dD7C455373297dEF375a08942eCe',
      name: 'NEAR',
      symbol: 'NEAR',
      decimals: 18,
    },
    '0x3D3f34416f60f77A0a6cC8e32abe45D32A7497cb': {
      address: '0x3D3f34416f60f77A0a6cC8e32abe45D32A7497cb',
      name: 'PEPE',
      symbol: 'PEPE',
      decimals: 18,
    },
    '0x69F5F465a46f324Fb7bf3fD7c0D5c00f7165C7Ea': {
      address: '0x69F5F465a46f324Fb7bf3fD7c0D5c00f7165C7Ea',
      name: 'SHIB',
      symbol: 'SHIB',
      decimals: 18,
    },
    '0x09F9d7aaa6Bef9598c3b676c0E19C9786Aa566a8': {
      address: '0x09F9d7aaa6Bef9598c3b676c0E19C9786Aa566a8',
      name: 'SUI',
      symbol: 'SUI',
      decimals: 18,
    },
    '0x031A448F59111000b96F016c37e9c71e57845096': {
      address: '0x031A448F59111000b96F016c37e9c71e57845096',
      name: 'TRX',
      symbol: 'TRX',
      decimals: 18,
    },
    '0x4308427C463CAEAaB50FFf98a9deC569C31E4E87': {
      address: '0x4308427C463CAEAaB50FFf98a9deC569C31E4E87',
      name: 'UNI',
      symbol: 'UNI',
      decimals: 18,
    },
    '0x2ea06E73083f1b3314Fa090eaE4a5F70eb058F2e': {
      address: '0x2ea06E73083f1b3314Fa090eaE4a5F70eb058F2e',
      name: 'XMR',
      symbol: 'XMR',
      decimals: 18,
    },
    '0x6940e7C6125a177b052C662189bb27692E88E9Cb': {
      address: '0x6940e7C6125a177b052C662189bb27692E88E9Cb',
      name: 'YFI',
      symbol: 'YFI',
      decimals: 18,
    },
  },
}

export const TOKEN_COLLATERAL_SUPPORT: TokenSupport = {
  [ProtocolEnum.GMX]: {
    ...TOKEN_TRADE_SUPPORT[ProtocolEnum.GMX],
  },
  [ProtocolEnum.KWENTA]: {
    '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9',
      name: 'SUSD',
      symbol: 'SUSD',
      decimals: 18,
      // icon: IconDAI,
    },
  },
}

export const TOKEN_ADDRESSES = {
  [ProtocolEnum.GMX]: {
    BTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  [ProtocolEnum.KWENTA]: {
    BTC: '0x59b007E9ea8F89b069c43F8f45834d30853e3699',
    ETH: '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93',
  },
}

export const getDefaultTokenTrade = (protocol: ProtocolEnum) =>
  TOKEN_TRADE_SUPPORT[protocol][Object.keys(TOKEN_TRADE_SUPPORT[protocol])[0]]

export const getTokenTradeList = (protocol: ProtocolEnum) =>
  Object.keys(TOKEN_TRADE_SUPPORT[protocol]).map((key) => TOKEN_TRADE_SUPPORT[protocol][key])

const getDefaultTokenOptions = (protocol: ProtocolEnum) =>
  Object.keys(TOKEN_TRADE_SUPPORT[protocol]).map((key) => ({
    id: key,
    text: TOKEN_TRADE_SUPPORT[protocol][key].symbol,
    filter_by: key,
  }))
export const getTokenOptions = ({
  protocol,
  ignoredAll,
}: {
  protocol: ProtocolEnum
  ignoredAll?: boolean
}): TokenOptionProps[] =>
  ignoredAll ? getDefaultTokenOptions(protocol) : [ALL_OPTION, ...getDefaultTokenOptions(protocol)]

export const TIMEFRAME_NAMES = {
  // Minutes
  5: 'M5',
  15: 'M15',
  30: 'M30',
  60: 'H1',
  240: 'H4',
  1440: 'D1',
}

export const GMX_CLOSE_POSITION_TOPIC = '0x73af1d417d82c240fdb6d319b34ad884487c6bf2845d98980cc52ad9171cb455'
export const GMX_LIQUIDATE_POSITION_TOPIC = '0x2e1f85a64a2f22cf2f0c42584e7c919ed4abe8d53675cff0f62bf1e95a1c676f'
