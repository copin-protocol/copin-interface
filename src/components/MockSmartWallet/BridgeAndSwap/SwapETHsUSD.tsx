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
    inputs: [],
    name: 'exchangeEtherForSynths',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
]

const SwapETHsUSD = ({
  signer,
  ethBalance,
  sUSDBalance,
  refetch,
}: {
  signer?: JsonRpcSigner
  ethBalance?: number
  sUSDBalance?: number
  refetch: () => void
}) => {
  const [amount, setAmount] = useState<number>()
  const swapContract = useMemo(() => new Contract('0x9b79d6dfe4650d70f35dbb80f7d1ec0cf7f823fd', ABI, signer), [signer])
  const swapMutation = useContractMutation(swapContract)
  const hasError = !!amount && !!ethBalance && amount > ethBalance
  return (
    <Box variant="card" mb={3}>
      <Type.BodyBold mb={2}>Swap Goerli ETH to Goerli sUSD</Type.BodyBold>
      <InputField
        value={amount}
        error={hasError}
        type="number"
        onChange={(e) => setAmount(Number(e.target.value))}
        block
        inputSx={{
          pr: 2,
        }}
        label={`Balance: ${formatNumber(ethBalance, 4, 4)} ETH`}
        placeholder="Swap amount (ETH)"
        suffix={
          <Button
            variant="primary"
            disabled={hasError || !amount}
            onClick={async () =>
              swapMutation.mutate(
                {
                  method: 'exchangeEtherForSynths',
                  params: [],
                  value: amount ? parseEther(amount.toString()) : undefined,
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
            Swap
          </Button>
        }
      />
      <Type.Caption mt={3}>Goerli sUSD balance: {formatNumber(sUSDBalance, 2, 2)}</Type.Caption>
    </Box>
  )
}

export default SwapETHsUSD
