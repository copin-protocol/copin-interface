import { ReactNode } from 'react'

import { Flex, Image, Type } from 'theme/base'
import { BoxProps } from 'theme/types'
import { parseChainImage } from 'utils/helpers/transform'
import { SUPPORTED_CHAIN_IDS } from 'utils/web3/chains'
import { Chain } from 'utils/web3/types'

const ChainLogo = ({ chain, active = false, ...props }: { chain: Chain; active?: boolean } & BoxProps) => {
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      sx={{
        border: SUPPORTED_CHAIN_IDS.find((e) => e === Number(chain.id)) ? '1px dashed' : '1px solid',
        borderColor: active ? 'primary1' : 'neutral5',
        borderRadius: 32,
      }}
      {...props}
    >
      <Image src={parseChainImage(chain.icon)} width={24} height={24} />
    </Flex>
  )
}

export default ChainLogo

export function ChainWithLabel({ label, icon }: { label: ReactNode; icon: string }) {
  return (
    <Flex alignItems="center" sx={{ gap: 2 }}>
      <img width={24} height={24} src={parseChainImage(icon)} alt={icon} />
      <Type.CaptionBold>{label}</Type.CaptionBold>
    </Flex>
  )
}
