import React, { useCallback } from 'react'

import ChainLogo from 'components/@ui/ChainLogo'
import useChain from 'hooks/web3/useChain'
import Dropdown, { DropdownItem } from 'theme/Dropdown'
import { Box, Flex } from 'theme/base'
import { chains } from 'utils/web3/chains'

const NetworkPicker = () => {
  const { chain: currentChain, setChain } = useChain()
  const renderChains = useCallback(() => {
    return (
      <Box>
        {chains.map((chain) => (
          <DropdownItem key={chain.id} size="sm" onClick={() => setChain(chain.id)}>
            <Flex alignItems="center" sx={{ gap: 2, color: chain.id === currentChain.id ? 'primary1' : 'inherit' }}>
              <ChainLogo flex="0 0 34px" height="34px" chain={chain} active={chain.id === currentChain.id} />
              <Box flex="1 1 auto">{chain.label}</Box>
            </Flex>
          </DropdownItem>
        ))}
      </Box>
    )
  }, [setChain, currentChain.id])
  return (
    <Dropdown menu={renderChains()} buttonVariant="ghost" inline menuSx={{ width: 200 }} hasArrow={false}>
      <ChainLogo chain={currentChain} width={32} height={32} />
    </Dropdown>
  )
}

export default NetworkPicker
