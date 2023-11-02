import React from 'react'

import { Flex, Image } from 'theme/base'
import { BoxProps } from 'theme/types'
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
      <Image src={`/images/chains/${chain.icon}.svg`} width={24} height={24} />
    </Flex>
  )
}

export default ChainLogo
