import { useResponsive } from 'ahooks'
import React, { useCallback, useMemo } from 'react'

import ChainLogo from 'components/@ui/ChainLogo'
import useActiveWeb3React from 'hooks/web3/useActiveWeb3React'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex } from 'theme/base'
import { SUPPORTED_CHAIN_IDS, getChainMetadata } from 'utils/web3/chains'
import { Chain } from 'utils/web3/types'

const mainnetChains = SUPPORTED_CHAIN_IDS.map((chainId) => getChainMetadata(chainId))

const NetworkPicker = () => {
  const { account, chainId, switchChain } = useActiveWeb3React()
  const currentChain = useMemo(() => getChainMetadata(chainId), [chainId])

  const handleSwitchChain = useCallback(
    async (chain: Chain) => {
      if (SUPPORTED_CHAIN_IDS.includes(Number(chain.chainId))) {
        if (account) {
          const success = await switchChain(Number(chain.chainId))
          if (!success) return
        }
      }
    },
    [account, switchChain]
  )

  const renderChains = useCallback(() => {
    return (
      <Box>
        {mainnetChains.map((chain) => (
          <DropdownItem key={chain.chainId} size="sm" onClick={() => handleSwitchChain(chain)}>
            <Flex
              alignItems="center"
              sx={{ gap: 2, color: Number(chain.chainId) === chainId ? 'primary1' : 'inherit' }}
            >
              <ChainLogo flex="0 0 34px" height="34px" chain={chain} active={Number(chain.chainId) === chainId} />
              <Box flex="1 1 auto">{chain.chainName}</Box>
            </Flex>
          </DropdownItem>
        ))}
      </Box>
    )
  }, [chainId, handleSwitchChain])
  const { sm } = useResponsive()
  return (
    <Dropdown menu={renderChains()} buttonVariant="ghost" buttonSx={{ p: 0 }} menuSx={{ width: 200 }} hasArrow={false}>
      <ChainLogo chain={currentChain} width={32} height={32} />
    </Dropdown>
  )
}

export default NetworkPicker
