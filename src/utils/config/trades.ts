// TODO: Check when add new protocol
import { JsonRpcProvider } from '@ethersproject/providers'

import { CopyTradePlatformEnum, ProtocolEnum } from 'utils/config/enums'
import { ARBITRUM_MAINNET, CHAINS, OPTIMISM_GOERLI, OPTIMISM_MAINNET } from 'utils/web3/chains'
import { rpcProvider } from 'utils/web3/providers'

type ProtocolProvider = { [key: string]: { chainId: number; provider: JsonRpcProvider; explorerUrl: string } }
export const PROTOCOL_PROVIDER: ProtocolProvider = {
  [ProtocolEnum.GMX_V2]: {
    chainId: ARBITRUM_MAINNET,
    provider: rpcProvider(ARBITRUM_MAINNET),
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.GMX]: {
    chainId: ARBITRUM_MAINNET,
    provider: rpcProvider(ARBITRUM_MAINNET),
    explorerUrl: CHAINS[ARBITRUM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.KWENTA]: {
    chainId: OPTIMISM_MAINNET,
    provider: rpcProvider(OPTIMISM_MAINNET),
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
  [ProtocolEnum.POLYNOMIAL]: {
    chainId: OPTIMISM_MAINNET,
    provider: rpcProvider(OPTIMISM_MAINNET),
    explorerUrl: CHAINS[OPTIMISM_MAINNET].blockExplorerUrl,
  },
}

export interface TokenTrade {
  address: string
  name: string
  symbol: string
  decimals: number
  priceFeedId: string
  // icon: string
}

export type TokenOptionProps = {
  id: string
  label: string
  value: string
}

export const ALL_TOKENS_ID = 'ALL'
export const ALL_OPTION: TokenOptionProps = {
  id: ALL_TOKENS_ID,
  label: 'ALL',
  value: ALL_TOKENS_ID,
}

type TokenSupport = { [key: string]: { [key: string]: TokenTrade } }
type TokenIgnore = { [key in CopyTradePlatformEnum]: string[] }

const TOKEN_TRADE_SYNTHETIX = {
  '0xd5fAaa459e5B3c118fD85Fc0fD67f56310b1618D': {
    address: '0xd5fAaa459e5B3c118fD85Fc0fD67f56310b1618D',
    name: '1INCH',
    symbol: '1INCH',
    decimals: 18,
    priceFeedId: '0x63f341689d98a12ef60a5cff1d7f85c70a9e17bf1575f0e7c0b2512d48b1c8b3',
  },
  '0x5374761526175B59f1E583246E20639909E189cE': {
    address: '0x5374761526175B59f1E583246E20639909E189cE',
    name: 'AAVE',
    symbol: 'AAVE',
    decimals: 18,
    priceFeedId: '0x2b9ab1e972a281585084148ba1389800799bd4be63b957507db1349314e47445',
  },
  '0xF9DD29D2Fd9B38Cd90E390C797F1B7E0523f43A9': {
    address: '0xF9DD29D2Fd9B38Cd90E390C797F1B7E0523f43A9',
    name: 'ADA',
    symbol: 'ADA',
    decimals: 18,
    priceFeedId: '0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d',
  },
  '0x96f2842007021a4C5f06Bcc72961701D66Ff8465': {
    address: '0x96f2842007021a4C5f06Bcc72961701D66Ff8465',
    name: 'ALGO',
    symbol: 'ALGO',
    decimals: 18,
    priceFeedId: '0xfa17ceaf30d19ba51112fdcc750cc83454776f47fb0112e4af07f15f4bb1ebc0',
  },
  '0x5B6BeB79E959Aac2659bEE60fE0D0885468BF886': {
    address: '0x5B6BeB79E959Aac2659bEE60fE0D0885468BF886',
    name: 'APE',
    symbol: 'APE',
    decimals: 18,
    priceFeedId: '0x15add95022ae13563a11992e727c91bdb6b55bc183d9d747436c80a483d8c864',
  },
  '0x9615B6BfFf240c44D3E33d0cd9A11f563a2e8D8B': {
    address: '0x9615B6BfFf240c44D3E33d0cd9A11f563a2e8D8B',
    name: 'APT',
    symbol: 'APT',
    decimals: 18,
    priceFeedId: '0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5',
  },
  '0x509072A5aE4a87AC89Fc8D64D94aDCb44Bd4b88e': {
    address: '0x509072A5aE4a87AC89Fc8D64D94aDCb44Bd4b88e',
    name: 'ARB',
    symbol: 'ARB',
    decimals: 18,
    priceFeedId: '0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5',
  },
  '0xbB16C7B3244DFA1a6BF83Fcce3EE4560837763CD': {
    address: '0xbB16C7B3244DFA1a6BF83Fcce3EE4560837763CD',
    name: 'ATOM',
    symbol: 'ATOM',
    decimals: 18,
    priceFeedId: '0xb00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819',
  },
  '0xc203A12F298CE73E44F7d45A4f59a43DBfFe204D': {
    address: '0xc203A12F298CE73E44F7d45A4f59a43DBfFe204D',
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18,
    priceFeedId: '0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7',
  },
  '0x3a52b21816168dfe35bE99b7C5fc209f17a0aDb1': {
    address: '0x3a52b21816168dfe35bE99b7C5fc209f17a0aDb1',
    name: 'AXS',
    symbol: 'AXS',
    decimals: 18,
    priceFeedId: '0xb7e3904c08ddd9c0c10c6d207d390fd19e87eb6aab96304f571ed94caebdefa0',
  },
  '0x71f42cA320b3e9A8e4816e26De70c9b69eAf9d24': {
    address: '0x71f42cA320b3e9A8e4816e26De70c9b69eAf9d24',
    name: 'BAL',
    symbol: 'BAL',
    decimals: 18,
    priceFeedId: '0x07ad7b4a7662d19a6bc675f6b467172d2f3947fa653ca97555a9b20236406628',
  },
  '0x96690aAe7CB7c4A9b5Be5695E94d72827DeCC33f': {
    address: '0x96690aAe7CB7c4A9b5Be5695E94d72827DeCC33f',
    name: 'BCH',
    symbol: 'BCH',
    decimals: 18,
    priceFeedId: '0x3dd2b63686a450ec7290df3a1e0b583c0481f651351edfa7636f39aed55cf8a3',
  },
  '0xa1Ace9ce6862e865937939005b1a6c5aC938A11F': {
    address: '0xa1Ace9ce6862e865937939005b1a6c5aC938A11F',
    name: 'BLUR',
    symbol: 'BLUR',
    decimals: 18,
    priceFeedId: '0x856aac602516addee497edf6f50d39e8c95ae5fb0da1ed434a8c2ab9c3e877e9',
  },
  '0x0940B0A96C5e1ba33AEE331a9f950Bb2a6F2Fb25': {
    address: '0x0940B0A96C5e1ba33AEE331a9f950Bb2a6F2Fb25',
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
    priceFeedId: '0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
  },
  '0x59b007E9ea8F89b069c43F8f45834d30853e3699': {
    address: '0x59b007E9ea8F89b069c43F8f45834d30853e3699',
    name: 'BTC',
    symbol: 'BTC',
    decimals: 8,
    priceFeedId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  },
  '0x2292865b2b6C837B7406E819200CE61c1c4F8d43': {
    address: '0x2292865b2b6C837B7406E819200CE61c1c4F8d43',
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
    priceFeedId: '0x7d669ddcdd23d9ef1fa9a9cc022ba055ec900e91c4cb960f3c20429d4447a411',
  },
  '0xb7059Ed9950f2D9fDc0155fC0D79e63d4441e806': {
    address: '0xb7059Ed9950f2D9fDc0155fC0D79e63d4441e806',
    name: 'COMP',
    symbol: 'COMP',
    decimals: 18,
    priceFeedId: '0x4a8e42861cabc5ecb50996f92e7cfa2bce3fd0a2423b0c44c9b423fb2bd25478',
  },
  '0xD5fBf7136B86021eF9d0BE5d798f948DcE9C0deA': {
    address: '0xD5fBf7136B86021eF9d0BE5d798f948DcE9C0deA',
    name: 'CRV',
    symbol: 'CRV',
    decimals: 18,
    priceFeedId: '0xa19d04ac696c7a6616d291c7e5d1377cc8be437c327b75adb5dc1bad745fcae8',
  },
  '0x98cCbC721cc05E28a125943D69039B39BE6A21e9': {
    address: '0x98cCbC721cc05E28a125943D69039B39BE6A21e9',
    name: 'DOGE',
    symbol: 'DOGE',
    decimals: 18,
    priceFeedId: '0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c',
  },
  '0x8B9B5f94aac2316f048025B3cBe442386E85984b': {
    address: '0x8B9B5f94aac2316f048025B3cBe442386E85984b',
    name: 'DOT',
    symbol: 'DOT',
    decimals: 18,
    priceFeedId: '0xca3eed9b267293f6595901c734c7525ce8ef49adafe8284606ceb307afa2ca5b',
  },
  '0x139F94E4f0e1101c1464a321CBA815c34d58B5D9': {
    address: '0x139F94E4f0e1101c1464a321CBA815c34d58B5D9',
    name: 'DYDX',
    symbol: 'DYDX',
    decimals: 18,
    priceFeedId: '0x6489800bb8974169adfe35937bf6736507097d13c190d760c557108c7e93a81b',
  },
  '0x88C8316E5CCCCE2E27e5BFcDAC99f1251246196a': {
    address: '0x88C8316E5CCCCE2E27e5BFcDAC99f1251246196a',
    name: 'ENJ',
    symbol: 'ENJ',
    decimals: 18,
    priceFeedId: '0x5cc254b7cb9532df39952aee2a6d5497b42ec2d2330c7b76147f695138dbd9f3',
  },
  '0x50a40d947726ac1373DC438e7aaDEde9b237564d': {
    address: '0x50a40d947726ac1373DC438e7aaDEde9b237564d',
    name: 'EOS',
    symbol: 'EOS',
    decimals: 18,
    priceFeedId: '0x06ade621dbc31ed0fc9255caaab984a468abe84164fb2ccc76f02a4636d97e31',
  },
  '0x4bF3C1Af0FaA689e3A808e6Ad7a8d89d07BB9EC7': {
    address: '0x4bF3C1Af0FaA689e3A808e6Ad7a8d89d07BB9EC7',
    name: 'ETC',
    symbol: 'ETC',
    decimals: 18,
    priceFeedId: '0x7f5cc8d963fc5b3d2ae41fe5685ada89fd4f14b435f8050f28c7fd409f40c2d8',
  },
  '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93': {
    address: '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93',
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    priceFeedId: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  },
  '0x2C5E2148bF3409659967FE3684fd999A76171235': {
    address: '0x2C5E2148bF3409659967FE3684fd999A76171235',
    name: 'FIL',
    symbol: 'FIL',
    decimals: 18,
    priceFeedId: '0x150ac9b959aee0051e4091f0ef5216d941f590e1c5e7f91cf7635b5c11628c0e',
  },
  '0x5ed8D0946b59d015f5A60039922b870537d43689': {
    address: '0x5ed8D0946b59d015f5A60039922b870537d43689',
    name: 'FLOKI',
    symbol: 'FLOKI',
    decimals: 18,
    priceFeedId: '0x6b1381ce7e874dc5410b197ac8348162c0dd6c0d4c9cd6322672d6c2b1d58293',
  },
  '0x27665271210aCff4Fab08AD9Bb657E91866471F0': {
    address: '0x27665271210aCff4Fab08AD9Bb657E91866471F0',
    name: 'FLOW',
    symbol: 'FLOW',
    decimals: 18,
    priceFeedId: '0x2fb245b9a84554a0f15aa123cbb5f64cd263b59e9a87d80148cbffab50c69f30',
  },
  '0xC18f85A6DD3Bcd0516a1CA08d3B1f0A4E191A2C4': {
    address: '0xC18f85A6DD3Bcd0516a1CA08d3B1f0A4E191A2C4',
    name: 'FTM',
    symbol: 'FTM',
    decimals: 18,
    priceFeedId: '0x5c6c0d2386e3352356c3ab84434fafb5ea067ac2678a38a338c4a69ddc4bdb0c',
  },
  '0x2fD9a39ACF071Aa61f92F3D7A98332c68d6B6602': {
    address: '0x2fD9a39ACF071Aa61f92F3D7A98332c68d6B6602',
    name: 'FXS',
    symbol: 'FXS',
    decimals: 18,
    priceFeedId: '0x735f591e4fed988cd38df74d8fcedecf2fe8d9111664e0fd500db9aa78b316b1',
  },
  '0x33d4613639603c845e61A02cd3D2A78BE7d513dc': {
    address: '0x33d4613639603c845e61A02cd3D2A78BE7d513dc',
    name: 'GMX',
    symbol: 'GMX',
    decimals: 18,
    priceFeedId: '0xb962539d0fcb272a494d65ea56f94851c2bcf8823935da05bd628916e2e9edbf',
  },
  '0x105f7F2986A2414B4007958b836904100a53d1AD': {
    address: '0x105f7F2986A2414B4007958b836904100a53d1AD',
    name: 'ICP',
    symbol: 'ICP',
    decimals: 18,
    priceFeedId: '0xc9907d786c5821547777780a1e4f89484f3417cb14dd244f2b0a34ea7a554d67',
  },
  '0x852210F0616aC226A486ad3387DBF990e690116A': {
    address: '0x852210F0616aC226A486ad3387DBF990e690116A',
    name: 'INJ',
    symbol: 'INJ',
    decimals: 18,
    priceFeedId: '0x7a5bc1d2b56ad029048cd63964b3ad2776eadf812edc1a43a31406cb54bff592',
  },
  '0x152Da6a8F32F25B56A32ef5559d4A2A96D09148b': {
    address: '0x152Da6a8F32F25B56A32ef5559d4A2A96D09148b',
    name: 'KNC',
    symbol: 'KNC',
    decimals: 18,
    priceFeedId: '0xb9ccc817bfeded3926af791f09f76c5ffbc9b789cac6e9699ec333a79cacbe2a',
  },
  '0xaa94C874b91ef16C8B56A1c5B2F34E39366bD484': {
    address: '0xaa94C874b91ef16C8B56A1c5B2F34E39366bD484',
    name: 'LDO',
    symbol: 'LDO',
    decimals: 18,
    priceFeedId: '0xc63e2a7f37a04e5e614c07238bedb25dcc38927fba8fe890597a593c0b2fa4ad',
  },
  '0x31A1659Ca00F617E86Dc765B6494Afe70a5A9c1A': {
    address: '0x31A1659Ca00F617E86Dc765B6494Afe70a5A9c1A',
    name: 'LINK',
    symbol: 'LINK',
    decimals: 18,
    priceFeedId: '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221',
  },
  '0xB25529266D9677E9171BEaf333a0deA506c5F99A': {
    address: '0xB25529266D9677E9171BEaf333a0deA506c5F99A',
    name: 'LTC',
    symbol: 'LTC',
    decimals: 18,
    priceFeedId: '0x6e3f3fa8253588df9326580180233eb791e03b443a3ba7a1d892e73874e19a54',
  },
  '0x074B8F19fc91d6B2eb51143E1f186Ca0DDB88042': {
    address: '0x074B8F19fc91d6B2eb51143E1f186Ca0DDB88042',
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
    priceFeedId: '0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52',
  },
  '0x572F816F21F56D47e4c4fA577837bd3f58088676': {
    address: '0x572F816F21F56D47e4c4fA577837bd3f58088676',
    name: 'MAV',
    symbol: 'MAV',
    decimals: 18,
    priceFeedId: '0x5b131ede5d017511cf5280b9ebf20708af299266a033752b64180c4201363b11',
  },
  '0xf7d9Bd13F877171f6C7f93F71bdf8e380335dc12': {
    address: '0xf7d9Bd13F877171f6C7f93F71bdf8e380335dc12',
    name: 'MKR',
    symbol: 'MKR',
    decimals: 18,
    priceFeedId: '0x9375299e31c0deb9c6bc378e6329aab44cb48ec655552a70d4b9050346a30378',
  },
  '0xC8fCd6fB4D15dD7C455373297dEF375a08942eCe': {
    address: '0xC8fCd6fB4D15dD7C455373297dEF375a08942eCe',
    name: 'NEAR',
    symbol: 'NEAR',
    decimals: 18,
    priceFeedId: '0xc415de8d2eba7db216527dff4b60e8f3a5311c740dadb233e13e12547e226750',
  },
  '0x86BbB4E38Ffa64F263E84A0820138c5d938BA86E': {
    address: '0x86BbB4E38Ffa64F263E84A0820138c5d938BA86E',
    name: 'ONE',
    symbol: 'ONE',
    decimals: 18,
    priceFeedId: '0xc572690504b42b57a3f7aed6bd4aae08cbeeebdadcf130646a692fe73ec1e009',
  },
  '0x442b69937a0daf9D46439a71567fABE6Cb69FBaf': {
    address: '0x442b69937a0daf9D46439a71567fABE6Cb69FBaf',
    name: 'OP',
    symbol: 'OP',
    decimals: 18,
    priceFeedId: '0x385f64d993f7b77d8182ed5003d97c60aa3361f3cecfe711544d2d59165e9bdf',
  },
  '0x3D3f34416f60f77A0a6cC8e32abe45D32A7497cb': {
    address: '0x3D3f34416f60f77A0a6cC8e32abe45D32A7497cb',
    name: 'PEPE',
    symbol: 'PEPE',
    decimals: 18,
    priceFeedId: '0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4',
  },
  '0xaF2E4c337B038eaFA1dE23b44C163D0008e49EaD': {
    address: '0xaF2E4c337B038eaFA1dE23b44C163D0008e49EaD',
    name: 'PERP',
    symbol: 'PERP',
    decimals: 18,
    priceFeedId: '0x944f2f908c5166e0732ea5b610599116cd8e1c41f47452697c1e84138b7184d6',
  },
  '0x91cc4a83d026e5171525aFCAEd020123A653c2C9': {
    address: '0x91cc4a83d026e5171525aFCAEd020123A653c2C9',
    name: 'RNDR',
    symbol: 'RNDR',
    decimals: 18,
    priceFeedId: '0xab7347771135fc733f8f38db462ba085ed3309955f42554a14fa13e855ac0e2f',
  },
  '0xfAD0835dAD2985b25ddab17eace356237589E5C7': {
    address: '0xfAD0835dAD2985b25ddab17eace356237589E5C7',
    name: 'RPL',
    symbol: 'RPL',
    decimals: 18,
    priceFeedId: '0x24f94ac0fd8638e3fc41aab2e4df933e63f763351b640bf336a6ec70651c4503',
  },
  '0xEAf0191bCa9DD417202cEf2B18B7515ABff1E196': {
    address: '0xEAf0191bCa9DD417202cEf2B18B7515ABff1E196',
    name: 'RUNE',
    symbol: 'RUNE',
    decimals: 18,
    priceFeedId: '0x5fcf71143bb70d41af4fa9aa1287e2efd3c5911cee59f909f915c9f61baacb1e',
  },
  '0x66fc48720f09Ac386608FB65ede53Bb220D0D5Bc': {
    address: '0x66fc48720f09Ac386608FB65ede53Bb220D0D5Bc',
    name: 'SEI',
    symbol: 'SEI',
    decimals: 18,
    priceFeedId: '0x53614f1cb0c031d4af66c04cb9c756234adad0e1cee85303795091499a4084eb',
  },
  '0x69F5F465a46f324Fb7bf3fD7c0D5c00f7165C7Ea': {
    address: '0x69F5F465a46f324Fb7bf3fD7c0D5c00f7165C7Ea',
    name: 'SHIB',
    symbol: 'SHIB',
    decimals: 18,
    priceFeedId: '0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a',
  },
  '0x0EA09D97b4084d859328ec4bF8eBCF9ecCA26F1D': {
    address: '0x0EA09D97b4084d859328ec4bF8eBCF9ecCA26F1D',
    name: 'SOL',
    symbol: 'SOL',
    decimals: 18,
    priceFeedId: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  },
  '0x09F9d7aaa6Bef9598c3b676c0E19C9786Aa566a8': {
    address: '0x09F9d7aaa6Bef9598c3b676c0E19C9786Aa566a8',
    name: 'SUI',
    symbol: 'SUI',
    decimals: 18,
    priceFeedId: '0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744',
  },
  '0xdcCDa0cFBEE25B33Ff4Ccca64467E89512511bf6': {
    address: '0xdcCDa0cFBEE25B33Ff4Ccca64467E89512511bf6',
    name: 'SUSHI',
    symbol: 'SUSHI',
    decimals: 18,
    priceFeedId: '0x26e4f737fde0263a9eea10ae63ac36dcedab2aaf629261a994e1eeb6ee0afe53',
  },
  '0x031A448F59111000b96F016c37e9c71e57845096': {
    address: '0x031A448F59111000b96F016c37e9c71e57845096',
    name: 'TRX',
    symbol: 'TRX',
    decimals: 18,
    priceFeedId: '0x67aed5a24fdad045475e7195c98a98aea119c763f272d4523f5bac93a4f33c2b',
  },
  '0xb815Eb8D3a9dA3EdDD926225c0FBD3A566e8C749': {
    address: '0xb815Eb8D3a9dA3EdDD926225c0FBD3A566e8C749',
    name: 'UMA',
    symbol: 'UMA',
    decimals: 18,
    priceFeedId: '0x4b78d251770732f6304b1f41e9bebaabc3b256985ef18988f6de8d6562dd254c',
  },
  '0x4308427C463CAEAaB50FFf98a9deC569C31E4E87': {
    address: '0x4308427C463CAEAaB50FFf98a9deC569C31E4E87',
    name: 'UNI',
    symbol: 'UNI',
    decimals: 18,
    priceFeedId: '0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501',
  },
  '0x77DA808032dCdd48077FA7c57afbF088713E09aD': {
    address: '0x77DA808032dCdd48077FA7c57afbF088713E09aD',
    name: 'WLD',
    symbol: 'WLD',
    decimals: 18,
    priceFeedId: '0xd6835ad1f773de4a378115eb6824bd0c0e42d84d1c84d9750e853fb6b6c7794a',
  },
  '0xfbbBFA96Af2980aE4014d5D5A2eF14bD79B2a299': {
    address: '0xfbbBFA96Af2980aE4014d5D5A2eF14bD79B2a299',
    name: 'XLM',
    symbol: 'XLM',
    decimals: 18,
    priceFeedId: '0xb7a8eba68a997cd0210c2e1e4ee811ad2d174b3611c22d9ebf16f4cb7e9ba850',
  },
  '0x2ea06E73083f1b3314Fa090eaE4a5F70eb058F2e': {
    address: '0x2ea06E73083f1b3314Fa090eaE4a5F70eb058F2e',
    name: 'XMR',
    symbol: 'XMR',
    decimals: 18,
    priceFeedId: '0x46b8cc9347f04391764a0361e0b17c3ba394b001e7c304f7650f6376e37c321d',
  },
  '0x6110DF298B411a46d6edce72f5CAca9Ad826C1De': {
    address: '0x6110DF298B411a46d6edce72f5CAca9Ad826C1De',
    name: 'XRP',
    symbol: 'XRP',
    decimals: 18,
    priceFeedId: '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8',
  },
  '0xC645A757DD81C69641e010aDD2Da894b4b7Bc921': {
    address: '0xC645A757DD81C69641e010aDD2Da894b4b7Bc921',
    name: 'XTZ',
    symbol: 'XTZ',
    decimals: 18,
    priceFeedId: '0x0affd4b8ad136a21d79bc82450a325ee12ff55a235abc242666e423b8bcffd03',
  },
  '0x6940e7C6125a177b052C662189bb27692E88E9Cb': {
    address: '0x6940e7C6125a177b052C662189bb27692E88E9Cb',
    name: 'YFI',
    symbol: 'YFI',
    decimals: 18,
    priceFeedId: '0x425f4b198ab2504936886c1e93511bb6720fbcf2045a4f3c0723bb213846022f',
  },
  '0xf8aB6B9008f2290965426d3076bC9d2EA835575e': {
    address: '0xf8aB6B9008f2290965426d3076bC9d2EA835575e',
    name: 'ZEC',
    symbol: 'ZEC',
    decimals: 18,
    priceFeedId: '0xbe9b59d178f0d6a97ab4c343bff2aa69caa1eaae3e9048a65788c529b125bb24',
  },
  '0x01a43786C2279dC417e7901d45B917afa51ceb9a': {
    address: '0x01a43786C2279dC417e7901d45B917afa51ceb9a',
    name: 'ZIL',
    symbol: 'ZIL',
    decimals: 18,
    priceFeedId: '0x609722f3b6dc10fee07907fe86781d55eb9121cd0705b480954c00695d78f0cb',
  },
  '0x76BB1Edf0C55eC68f4C8C7fb3C076b811b1a9b9f': {
    address: '0x76BB1Edf0C55eC68f4C8C7fb3C076b811b1a9b9f',
    name: 'ZRX',
    symbol: 'ZRX',
    decimals: 18,
    priceFeedId: '0x7d17b9fe4ea7103be16b6836984fabbc889386d700ca5e5b3d34b7f92e449268',
  },
  '0x296286ae0b5c066CBcFe46cc4Ffb375bCCAFE640': {
    address: '0x296286ae0b5c066CBcFe46cc4Ffb375bCCAFE640',
    name: 'PYTH',
    symbol: 'PYTH',
    decimals: 18,
    priceFeedId: '0x0bbf28e9a841a1cc788f6a361b17ca072d0ea3098a1e5df1c3922d06719579ff',
  },
  '0x4272b356e7E406Eeef15E47692f7f4dE86370634': {
    address: '0x4272b356e7E406Eeef15E47692f7f4dE86370634',
    name: 'FET',
    symbol: 'FET',
    decimals: 18,
    priceFeedId: '0xb98e7ae8af2d298d2651eb21ab5b8b5738212e13efb43bd0dfbce7a74ba4b5d0',
  },
  '0xB3422e49dB926f7C5F5d7DaF5F1069Abf1b7E894': {
    address: '0xB3422e49dB926f7C5F5d7DaF5F1069Abf1b7E894',
    name: 'BONK',
    symbol: 'BONK',
    decimals: 18,
    priceFeedId: '0x72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419',
  },
  '0xbdb26bfb6A229d7f254FAf1B2c744887ec5F1f31': {
    address: '0xbdb26bfb6A229d7f254FAf1B2c744887ec5F1f31',
    name: 'TRB',
    symbol: 'TRB',
    decimals: 18,
    priceFeedId: '0xddcd037c2de8dbf2a0f6eebf1c039924baf7ebf0e7eb3b44bf421af69cc1b06d',
  },
  '0x35B0ed8473e7943d31Ee1eeeAd06C8767034Ce39': {
    address: '0x35B0ed8473e7943d31Ee1eeeAd06C8767034Ce39',
    name: 'TIA',
    symbol: 'TIA',
    decimals: 18,
    priceFeedId: '0x09f7c1d7dfbb7df2b8fe3d3d87ee94a2259d212da4f30c1f0540d066dfa44723',
  },
  '0xBBd74c2c8c89D45B822e08fCe400F4DDE99e600b': {
    address: '0xBBd74c2c8c89D45B822e08fCe400F4DDE99e600b',
    name: 'IMX',
    symbol: 'IMX',
    decimals: 18,
    priceFeedId: '0x941320a8989414874de5aa2fc340a75d5ed91fdff1613dd55f83844d52ea63a2',
  },
  '0x48BeadAB5781aF9C4Fec27AC6c8E0F402F2Cc3D6': {
    address: '0x48BeadAB5781aF9C4Fec27AC6c8E0F402F2Cc3D6',
    name: 'MEME',
    symbol: 'MEME',
    decimals: 18,
    priceFeedId: '0xcd2cee36951a571e035db0dfad138e6ecdb06b517cc3373cd7db5d3609b7927c',
  },
  '0x3f957DF3AB99ff502eE09071dd353bf4352BBEfE': {
    address: '0x3f957DF3AB99ff502eE09071dd353bf4352BBEfE',
    name: 'GRT',
    symbol: 'GRT',
    decimals: 18,
    priceFeedId: '0x4d1f8dae0d96236fb98e8f47471a366ec3b1732b47041781934ca3a9bb2f35e7',
  },
  '0x90c9B9D7399323FfFe63819788EeD7Cde1e6A78C': {
    address: '0x90c9B9D7399323FfFe63819788EeD7Cde1e6A78C',
    name: 'ANKR',
    symbol: 'ANKR',
    decimals: 18,
    priceFeedId: '0x89a58e1cab821118133d6831f5018fba5b354afb78b2d18f575b3cbf69a4f652',
  },
}

const TOKEN_TRADE_GMX = {
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': {
    address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    name: 'BTC',
    symbol: 'BTC',
    decimals: 8,
    priceFeedId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  },
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': {
    address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    priceFeedId: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  },

  '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4': {
    address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    name: 'LINK',
    symbol: 'LINK',
    decimals: 18,
    priceFeedId: '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221',
  },
  '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0': {
    address: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
    name: 'UNI',
    symbol: 'UNI',
    decimals: 18,
    priceFeedId: '0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501',
  },
}
const TOKEN_TRADE_GMX_V2 = {
  '0x47c031236e19d024b42f8AE6780E44A573170703': {
    address: '0x47c031236e19d024b42f8AE6780E44A573170703',
    name: 'BTC',
    symbol: 'BTC',
    decimals: 22,
    priceFeedId: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  },
  '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336': {
    address: '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336',
    name: 'ETH',
    symbol: 'ETH',
    decimals: 12,
    priceFeedId: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
  },
  '0x09400D9DB990D5ed3f35D7be61DfAEB900Af03C9': {
    address: '0x09400D9DB990D5ed3f35D7be61DfAEB900Af03C9',
    name: 'SOL',
    symbol: 'SOL',
    decimals: 21,
    priceFeedId: '0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d',
  },
  '0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407': {
    address: '0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407',
    name: 'ARB',
    symbol: 'ARB',
    decimals: 12,
    priceFeedId: '0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5',
  },
  '0x7f1fa204bb700853D36994DA19F830b6Ad18455C': {
    address: '0x7f1fa204bb700853D36994DA19F830b6Ad18455C',
    name: 'LINK',
    symbol: 'LINK',
    decimals: 12,
    priceFeedId: '0x8ac0c70fff57e9aefdf5edf44b51d62c2d433653cbb2cf5cc06bb115af04d221',
  },
  '0x6853EA96FF216fAb11D2d930CE3C508556A4bdc4': {
    address: '0x6853EA96FF216fAb11D2d930CE3C508556A4bdc4',
    name: 'DOGE',
    symbol: 'DOGE',
    decimals: 22,
    priceFeedId: '0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c',
  },
  '0x0CCB4fAa6f1F1B30911619f1184082aB4E25813c': {
    address: '0x0CCB4fAa6f1F1B30911619f1184082aB4E25813c',
    name: 'XRP',
    symbol: 'XRP',
    decimals: 24,
    priceFeedId: '0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8',
  },
  '0xc7Abb2C5f3BF3CEB389dF0Eecd6120D451170B50': {
    address: '0xc7Abb2C5f3BF3CEB389dF0Eecd6120D451170B50',
    name: 'UNI',
    symbol: 'UNI',
    decimals: 12,
    priceFeedId: '0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501',
  },
  '0xD9535bB5f58A1a75032416F2dFe7880C30575a41': {
    address: '0xD9535bB5f58A1a75032416F2dFe7880C30575a41',
    name: 'LTC',
    symbol: 'LTC',
    decimals: 22,
    priceFeedId: '0x6e3f3fa8253588df9326580180233eb791e03b443a3ba7a1d892e73874e19a54',
  },
  '0x2d340912Aa47e33c90Efb078e69E70EFe2B34b9B': {
    address: '0x2d340912Aa47e33c90Efb078e69E70EFe2B34b9B',
    name: 'BNB',
    symbol: 'BNB',
    decimals: 12,
    priceFeedId: '0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f',
  },
}

export const TOKEN_TRADE_SUPPORT: TokenSupport = {
  [ProtocolEnum.GMX]: TOKEN_TRADE_GMX,
  [ProtocolEnum.GMX_V2]: TOKEN_TRADE_GMX_V2,
  [ProtocolEnum.KWENTA]: TOKEN_TRADE_SYNTHETIX,
  [ProtocolEnum.POLYNOMIAL]: TOKEN_TRADE_SYNTHETIX,
}
export const TOKEN_TRADE_IGNORE: TokenIgnore = {
  [CopyTradePlatformEnum.GMX]: [],
  [CopyTradePlatformEnum.BINGX]: ['YFI', 'PERP', 'RPL', 'ZEC', 'RPL', 'UMA', 'BAL', 'XTZ'],
  [CopyTradePlatformEnum.SYNTHETIX]: [],
}

export const TOKEN_COLLATERAL_SUPPORT: TokenSupport = {
  [ProtocolEnum.GMX]: {
    ...TOKEN_TRADE_SUPPORT[ProtocolEnum.GMX],
  },
  [ProtocolEnum.GMX_V2]: {
    ...TOKEN_TRADE_SUPPORT[ProtocolEnum.GMX_V2],
  },
  [ProtocolEnum.KWENTA]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      name: 'SUSD',
      symbol: 'SUSD',
      decimals: 18,
      priceFeedId: '',
      // icon: IconDAI,
    },
  },
  [ProtocolEnum.POLYNOMIAL]: {
    '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9': {
      address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
      name: 'SUSD',
      symbol: 'SUSD',
      decimals: 18,
      priceFeedId: '',
      // icon: IconDAI,
    },
  },
}

export const TOKEN_ADDRESSES = {
  [ProtocolEnum.GMX_V2]: {
    BTC: '0x47c031236e19d024b42f8AE6780E44A573170703',
    ETH: '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336',
  },
  [ProtocolEnum.GMX]: {
    BTC: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    ETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  [ProtocolEnum.KWENTA]: {
    BTC: '0x59b007E9ea8F89b069c43F8f45834d30853e3699',
    ETH: '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93',
  },
  [ProtocolEnum.POLYNOMIAL]: {
    BTC: '0x59b007E9ea8F89b069c43F8f45834d30853e3699',
    ETH: '0x2B3bb4c683BFc5239B029131EEf3B1d214478d93',
  },
}

export const SYNTHETIX_MARKETS = {
  [OPTIMISM_MAINNET]: Object.keys(TOKEN_TRADE_SUPPORT[ProtocolEnum.KWENTA]),
  [OPTIMISM_GOERLI]: ['0x111babcdd66b1b60a20152a2d3d06d36f8b5703c'],
}

export const getDefaultTokenTrade = (protocol: ProtocolEnum) =>
  TOKEN_TRADE_SUPPORT[protocol][Object.keys(TOKEN_TRADE_SUPPORT[protocol])[0]]

export const getTokenTradeList = (protocol: ProtocolEnum) => Object.values(TOKEN_TRADE_SUPPORT[protocol])

export const getDefaultTokenOptions = (protocol: ProtocolEnum) =>
  Object.keys(TOKEN_TRADE_SUPPORT[protocol]).map((key) => ({
    id: key,
    label: TOKEN_TRADE_SUPPORT[protocol][key].symbol,
    value: key,
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
