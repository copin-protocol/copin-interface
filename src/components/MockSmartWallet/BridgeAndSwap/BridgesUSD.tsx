import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { useMemo, useState } from 'react'

import useContractMutation from 'hooks/web3/useContractMutation'
import { Button } from 'theme/Buttons'
import InputField from 'theme/InputField'
import { Box, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

const ABI = [
  {
    constant: false,
    inputs: [
      { internalType: 'bytes32', name: 'currencyKey', type: 'bytes32' },
      { internalType: 'address', name: 'destination', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'initiateSynthTransfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const BridgesUSD = ({
  signer,
  sUSDBalance,
  sUSDBalanceGoerli,
  refetch,
}: {
  signer?: JsonRpcSigner
  sUSDBalance?: number
  sUSDBalanceGoerli?: number
  refetch: () => void
}) => {
  const [amount, setAmount] = useState<number>()
  const bridgeContract = useMemo(
    () => new Contract('0x1427bc44755d9aa317535b1fee38922760aa4e65', ABI, signer),
    [signer]
  )
  const bridgeMutation = useContractMutation(bridgeContract)
  const hasError = !!amount && !!sUSDBalanceGoerli && amount > sUSDBalanceGoerli
  return (
    <Box variant="card" mb={3}>
      <Type.BodyBold mb={2}>
        <Type.BodyBold>Bridge Goerli sUSD to OP Goerli sUSD</Type.BodyBold>
      </Type.BodyBold>
      <InputField
        value={amount}
        error={hasError}
        type="number"
        onChange={(e) => setAmount(Number(e.target.value))}
        block
        inputSx={{
          pr: 2,
        }}
        label={`Balance: ${formatNumber(sUSDBalanceGoerli, 2, 2)} sUSD`}
        placeholder="Bridge amount (sUSD)"
        suffix={
          <Button
            variant="primary"
            disabled={hasError || !amount}
            onClick={async () =>
              bridgeMutation.mutate(
                {
                  method: 'initiateSynthTransfer',
                  params: [
                    '0x7355534400000000000000000000000000000000000000000000000000000000',
                    signer?._address,
                    parseEther(amount ? amount.toString() : ''),
                  ],
                },
                {
                  onSuccess: () => {
                    refetch()
                    setAmount(undefined)
                  },
                }
              )
            }
          >
            Bridge
          </Button>
        }
      />
      <Box mt={1}>
        <Type.Caption color="neutral3">Estimate Receive: 5 minutes</Type.Caption>
      </Box>
      <Type.Caption mt={3}>OP Goerli balance: {formatNumber(sUSDBalance, 2, 2)} sUSD</Type.Caption>
    </Box>
  )
}

export default BridgesUSD
