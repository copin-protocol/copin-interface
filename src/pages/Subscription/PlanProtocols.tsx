import Tooltip from 'theme/Tooltip'
import { Box, Flex, Grid, Image, Type } from 'theme/base'
import { ProtocolEnum, SubscriptionPlanEnum } from 'utils/config/enums'
import { SUBSCRIPTION_PLAN_TRANSLATION } from 'utils/config/translations'
import { parsePerpdexImage } from 'utils/helpers/transform'

const PERPDEX_NAMES: Record<string, string> = {
  GMX_V1: 'GMX v1',
  HMX: 'HMX',
  POLYNOMIAL: 'Polynomial',
  APOLLOX: 'ApolloX',
  SYNFUTURES: 'Synfutures',
  BMX_CLASSIC: 'BMX Classic',
  ELFI: 'Elfi',
  FOXIFY: 'Foxify',
  HORIZON: 'Horizon',
  DEPERP: 'Deperp',
  GNS: 'gTrade',
  KILOEX: 'Kiloex',
  SYNTHETIX_V3: 'Synthetix V3',
  AVANTIS: 'Avantis',
  SYNTHETIX: 'Synthetix V2',
  VERTEX: 'Vertex',
  MUX: 'MUX',
  LEVEL: 'Level',
  LINEHUB: 'Linehub',
  UNIDEX: 'UniDEX',
  YFX: 'YFX',
  PINGU: 'Pingu',
  BSX: 'BSX',
  KTX: 'KTX',
  ZENO: 'Zeno',
  ROLLIE: 'Rollie',
  MYX: 'MYX',
  GMX_V2: 'GMX v2',
  HYPERLIQUID: 'Hyperliquid',
  JUPITER: 'Jupiter',
  DYDX: 'dYdX',
  LOGX: 'LogX',
  MUMMY: 'Mummy',
  VELA: 'Vela',
  MORPHEX: 'Morphex',
  EQUATION: 'Equation',
  PERENNIAL: 'Perennial',
} as const

type PerpDex = keyof typeof PERPDEX_NAMES

const getPerpDexFromProtocol = (protocol: ProtocolEnum): PerpDex | undefined => {
  switch (protocol) {
    case ProtocolEnum.GMX:
    case ProtocolEnum.GMX_AVAX:
      return 'GMX_V1'
    case ProtocolEnum.HMX_ARB:
      return 'HMX'
    case ProtocolEnum.POLYNOMIAL:
    case ProtocolEnum.POLYNOMIAL_L2:
      return 'POLYNOMIAL'
    case ProtocolEnum.APOLLOX_BNB:
    case ProtocolEnum.APOLLOX_BASE:
      return 'APOLLOX'
    case ProtocolEnum.SYNFUTURE_BASE:
      return 'SYNFUTURES'
    case ProtocolEnum.BMX_BASE:
      return 'BMX_CLASSIC'
    case ProtocolEnum.ELFI_ARB:
      return 'ELFI'
    case ProtocolEnum.FOXIFY_ARB:
      return 'FOXIFY'
    case ProtocolEnum.HORIZON_BNB:
      return 'HORIZON'
    case ProtocolEnum.DEPERP_BASE:
      return 'DEPERP'
    case ProtocolEnum.GNS:
    case ProtocolEnum.GNS_APE:
    case ProtocolEnum.GNS_BASE:
    case ProtocolEnum.GNS_POLY:
      return 'GNS'
    case ProtocolEnum.KILOEX_OPBNB:
    case ProtocolEnum.KILOEX_BASE:
    case ProtocolEnum.KILOEX_MANTA:
    case ProtocolEnum.KILOEX_BNB:
      return 'KILOEX'
    case ProtocolEnum.SYNTHETIX_V3_ARB:
    case ProtocolEnum.SYNTHETIX_V3:
      return 'SYNTHETIX_V3'
    case ProtocolEnum.AVANTIS_BASE:
      return 'AVANTIS'
    case ProtocolEnum.KWENTA:
    case ProtocolEnum.CYBERDEX:
    case ProtocolEnum.DEXTORO:
    case ProtocolEnum.SYNTHETIX:
      return 'SYNTHETIX'
    case ProtocolEnum.VERTEX_ARB:
      return 'VERTEX'
    case ProtocolEnum.MUX_ARB:
      return 'MUX'
    case ProtocolEnum.LEVEL_ARB:
      return 'LEVEL'
    case ProtocolEnum.LINEHUB_LINEA:
      return 'LINEHUB'
    case ProtocolEnum.UNIDEX_ARB:
      return 'UNIDEX'
    case ProtocolEnum.YFX_ARB:
      return 'YFX'
    case ProtocolEnum.PINGU_ARB:
      return 'PINGU'
    case ProtocolEnum.BSX_BASE:
      return 'BSX'
    case ProtocolEnum.KTX_MANTLE:
      return 'KTX'
    case ProtocolEnum.ZENO_METIS:
      return 'ZENO'
    case ProtocolEnum.ROLLIE_SCROLL:
      return 'ROLLIE'
    case ProtocolEnum.MYX_ARB:
    case ProtocolEnum.MYX_LINEA:
    case ProtocolEnum.MYX_OPBNB:
      return 'MYX'
    case ProtocolEnum.GMX_V2:
      return 'GMX_V2'
    case ProtocolEnum.HYPERLIQUID:
      return 'HYPERLIQUID'
    case ProtocolEnum.JUPITER:
      return 'JUPITER'
    case ProtocolEnum.DYDX:
      return 'DYDX'
    case ProtocolEnum.LOGX_BLAST:
    case ProtocolEnum.LOGX_MODE:
      return 'LOGX'
    case ProtocolEnum.MUMMY_FANTOM:
      return 'MUMMY'
    case ProtocolEnum.VELA_ARB:
      return 'VELA'
    case ProtocolEnum.MORPHEX_FANTOM:
      return 'MORPHEX'
    case ProtocolEnum.EQUATION_ARB:
      return 'EQUATION'
    case ProtocolEnum.PERENNIAL_ARB:
      return 'PERENNIAL'
  }
  return
}

const findUniquePerpDexes = (protocols: ProtocolEnum[]): PerpDex[] => {
  const uniquePerpDexes = new Set<PerpDex>()
  protocols.forEach((protocol) => {
    const perpdex = getPerpDexFromProtocol(protocol)

    if (perpdex) {
      uniquePerpDexes.add(perpdex)
    }
  })
  return Array.from(uniquePerpDexes)
}

const FREE_PERPDEXES = ['GMX_V1', 'HMX', 'DYDX']
const STARTER_PERPDEXES = ['APOLLOX', 'SYNFUTURES', 'BMX_CLASSIC', 'ELFI', 'FOXIFY', 'HORIZON', 'DEPERP']
const PRO_PERPDEXES = [
  'GMX_V2',
  'GNS',
  'KILOEX',
  'SYNTHETIX_V3',
  'AVANTIS',
  'VERTEX',
  'MUX',
  'LEVEL',
  'LINEHUB',
  'UNIDEX',
  'YFX',
  'PINGU',
  'BSX',
  'KTX',
  'ZENO',
  'ROLLIE',
  'MYX',
]

const ELITE_PERPDEXES = [
  'HYPERLIQUID',
  'JUPITER',
  'SYNTHETIX',
  'LOGX',
  'MUMMY',
  'VELA',
  'MORPHEX',
  'EQUATION',
  'PERENNIAL',
]

export const PerpDexTooltip = ({ id, perpDexes }: { id: string; perpDexes: PerpDex[] }) => {
  return (
    <Tooltip id={id} style={{ width: '350px' }} clickable>
      <Grid sx={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        {perpDexes.map((perpDex) => (
          <Flex sx={{ alignItems: 'center', justifyContent: 'left', gap: 1 }} key={perpDex}>
            <Image height={20} src={parsePerpdexImage(perpDex)} />
            <Type.Caption>{PERPDEX_NAMES[perpDex]}</Type.Caption>
          </Flex>
        ))}
      </Grid>
    </Tooltip>
  )
}

export const PlanProtocol = ({
  protocols,
  prevPlan,
  currentPlan,
}: {
  protocols: { [key: string]: SubscriptionPlanEnum }
  currentPlan?: SubscriptionPlanEnum
  prevPlan?: SubscriptionPlanEnum
}) => {
  const currentPlanProtocols = Object.keys(protocols).filter(
    (protocol) =>
      protocols[protocol as ProtocolEnum] === currentPlan ||
      (currentPlan === SubscriptionPlanEnum.FREE &&
        protocols[protocol as ProtocolEnum] === SubscriptionPlanEnum.NON_LOGIN)
  )
  const prevPlanProtocols = []
  if (prevPlan) {
    for (const protocolKey in protocols) {
      prevPlanProtocols.push(protocolKey as ProtocolEnum)
      if (protocols[protocolKey as ProtocolEnum] === currentPlan) {
        break
      }
    }
  }
  const currentPerpDexes = findUniquePerpDexes(currentPlanProtocols as ProtocolEnum[])
  const prevPerpDexes = findUniquePerpDexes(prevPlanProtocols as ProtocolEnum[])
  return (
    <span>
      {!!prevPlan && (
        <>
          All in <b>{SUBSCRIPTION_PLAN_TRANSLATION[prevPlan]}</b> plus:{' '}
        </>
      )}
      <Box
        as="span"
        sx={{
          textDecoration: currentPerpDexes.length > 3 ? 'underline' : 'none',
          textDecorationStyle: 'dashed',
          textDecorationColor: '#767c8f',
        }}
        data-tooltip-id={`${currentPlan}-perpdex`}
      >
        {currentPerpDexes
          .slice(0, 3)
          .map((perpDex) => PERPDEX_NAMES[perpDex])
          .join(', ')}
        {currentPerpDexes.length > 3 && `...`}
      </Box>{' '}
      {currentPerpDexes.length > 3 && (
        <PerpDexTooltip id={`${currentPlan}-perpdex`} perpDexes={[...prevPerpDexes, ...currentPerpDexes]} />
      )}
    </span>
  )
}

export const StaterProtocol = () => (
  <span>
    All in <b>Free</b> plus:{' '}
    <Box
      as="span"
      sx={{ textDecoration: 'underline', textDecorationStyle: 'dashed', textDecorationColor: '#767c8f' }}
      data-tooltip-id="starter-protocols"
    >
      ApolloX, Synfutures...
    </Box>{' '}
    <PerpDexTooltip id="starter-protocols" perpDexes={[...STARTER_PERPDEXES, ...FREE_PERPDEXES]} />
  </span>
)

export const ProProtocol = () => (
  <span>
    All in <b>Starter</b> plus:{' '}
    <Box
      as="span"
      sx={{ textDecoration: 'underline', textDecorationStyle: 'dashed', textDecorationColor: '#767c8f' }}
      data-tooltip-id="pro-protocols"
    >
      gTrade, Kiloex, Synthetix...
    </Box>{' '}
    <PerpDexTooltip id="pro-protocols" perpDexes={[...PRO_PERPDEXES, ...STARTER_PERPDEXES, ...FREE_PERPDEXES]} />
  </span>
)

export const EliteProtocol = () => (
  <span>
    All protocols, specially:{' '}
    <Box
      as="span"
      sx={{ textDecoration: 'underline', textDecorationStyle: 'dashed', textDecorationColor: '#767c8f' }}
      data-tooltip-id="elite-protocols"
    >
      GMX v2, Hyperliquid, Jupiter
    </Box>{' '}
    <PerpDexTooltip
      id="elite-protocols"
      perpDexes={[...ELITE_PERPDEXES, ...PRO_PERPDEXES, ...STARTER_PERPDEXES, ...FREE_PERPDEXES]}
    />
  </span>
)
