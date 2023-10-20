import { ArrowSquareOut } from '@phosphor-icons/react'

import ButtonWithIcon from 'theme/Buttons/ButtonWithIcon'
import { Box, Type } from 'theme/base'

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
      <Type.BodyBold mb={2}>
        <Type.BodyBold>Bridge Goerli ETH to OP Goerli ETH</Type.BodyBold>
      </Type.BodyBold>
      <a
        href="https://goerli.hop.exchange/#/send?sourceNetwork=ethereum&destNetwork=optimism&token=ETH"
        target="_blank"
        rel="noreferrer"
      >
        <ButtonWithIcon mt={2} icon={<ArrowSquareOut size={16} />} direction="right" variant="primary" block>
          Bridge on Hop Goerli
        </ButtonWithIcon>
      </a>
    </Box>
  )
}

export default BridgeETH
