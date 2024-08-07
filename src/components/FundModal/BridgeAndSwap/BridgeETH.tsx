import { Trans } from '@lingui/macro'
import { ArrowSquareOut } from '@phosphor-icons/react'

import EthIcon from 'assets/icons/ic_eth.svg'
import OpIcon from 'assets/icons/ic_op.svg'
import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Box, Flex, Image, Type } from 'theme/base'

const ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: 'chainId', type: 'uint256' },
      { internalType: 'address', name: 'recipient', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'amountOutMin', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'address', name: 'relayer', type: 'address' },
      { internalType: 'uint256', name: 'relayerFee', type: 'uint256' },
    ],
    name: 'sendToL2',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

const BridgeETH = () => {
  return (
    <Box variant="card" mt={3}>
      <Flex sx={{ gap: 2 }} alignItems="center" mb={3}>
        <Image src={EthIcon} size={24} />
        <Image src={OpIcon} size={24} sx={{ position: 'relative', left: -3 }} />
        <Type.BodyBold sx={{ position: 'relative', left: -3 }}>
          <Trans>Bridge ETH to OP (Sepolia)</Trans>
        </Type.BodyBold>
      </Flex>
      <a
        href="https://sepolia.hop.exchange/#/send?sourceNetwork=ethereum&destNetwork=optimism&token=ETH"
        target="_blank"
        rel="noreferrer"
      >
        <ButtonWithIcon mt={2} icon={<ArrowSquareOut size={16} />} direction="right" variant="primary" block>
          Bridge on Hop Sepolia
        </ButtonWithIcon>
      </a>
    </Box>
  )
}

export default BridgeETH
