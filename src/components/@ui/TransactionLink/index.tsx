import { Check, WarningOctagon } from '@phosphor-icons/react'
import React from 'react'
import { LayoutProps, SpaceProps } from 'styled-system'

import useChain from 'hooks/web3/useChain'
import { Box, Flex, LinkUnderline } from 'theme/base'
import { SxProps } from 'theme/types'
import { addressShorten } from 'utils/helpers/format'

const TransactionLink = ({
  hash,
  hasLabel = true,
  isSuccess = true,
  ...props
}: { hash: string; hasLabel?: boolean; isSuccess?: boolean } & LayoutProps & SxProps & SpaceProps) => {
  const { chain } = useChain()

  return (
    <Flex alignItems="center" {...props}>
      {hasLabel && <Box mr={2}>TxHash:</Box>}
      <LinkUnderline
        color={isSuccess ? 'primary2' : 'red2'}
        hoverHasLine
        href={`${chain.blockExplorerUrl}/tx/${hash}`}
        target="_blank"
      >
        <Flex alignItems="center">
          <Box mr={1}>{addressShorten(hash, 6)}</Box>
          {isSuccess ? <Check size={12} weight="bold" /> : <WarningOctagon size={12} weight="bold" />}
        </Flex>
      </LinkUnderline>
    </Flex>
  )
}

export default TransactionLink
