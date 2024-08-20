import { Trans } from '@lingui/macro'

import openseaIcon from 'assets/icons/ic-opensea.png'
import optimismIcon from 'assets/icons/ic_op.svg'
import { Box, Flex, Image, Type } from 'theme/base'
import { SUBSCRIPTION_COLLECTION_URL } from 'utils/config/constants'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { CHAINS, OPTIMISM_MAINNET } from 'utils/web3/chains'
import { CONTRACT_ADDRESSES } from 'utils/web3/contracts'

export default function NFTCollectionLinks({ hasText = false, sx }: { hasText?: boolean; sx?: any }) {
  return (
    <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', gap: 3, ...(sx || {}) }}>
      {hasText && (
        <Type.Body color="neutral2" mr={1}>
          <Trans>NFT Collection</Trans>
        </Type.Body>
      )}
      <Box as="a" href={SUBSCRIPTION_COLLECTION_URL} target="_blank">
        <Image width={24} height={24} src={openseaIcon} alt="os" />
      </Box>
      <Box
        as="a"
        href={`${CHAINS[OPTIMISM_MAINNET].blockExplorerUrl}/token/${
          CONTRACT_ADDRESSES[OPTIMISM_MAINNET][CONTRACT_QUERY_KEYS.NFT_SUBSCRIPTION]
        }`}
        target="_blank"
      >
        <Image width={24} height={24} src={optimismIcon} alt="os" />
      </Box>
    </Flex>
  )
}
