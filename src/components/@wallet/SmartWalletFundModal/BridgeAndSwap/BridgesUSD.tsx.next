import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'

import EthIcon from 'assets/icons/ic_eth.svg'
import OpIcon from 'assets/icons/ic_op.svg'
import useContractMutation from 'hooks/web3/useContractMutation'
import { Button } from 'theme/Buttons'
import Input from 'theme/Input'
import { Box, Flex, Image, Type } from 'theme/base'
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
  sUSDBalanceSepolia,
  refetch,
}: {
  signer?: JsonRpcSigner
  sUSDBalance?: number
  sUSDBalanceSepolia?: number
  refetch: () => void
}) => {
  const [amount, setAmount] = useState<string>()
  const bridgeContract = useMemo(
    () => new Contract('0x1427bc44755d9aa317535b1fee38922760aa4e65', ABI, signer),
    [signer]
  )
  const bridgeMutation = useContractMutation(bridgeContract)
  const hasError =
    (!!amount && !!sUSDBalanceSepolia && Number(amount) > sUSDBalanceSepolia) || (!!amount && Number(amount) <= 0)

  return (
    <Box variant="card" mb={3}>
      <Flex sx={{ gap: 2 }} alignItems="center" mb={3}>
        <Image src={EthIcon} size={24} />
        <Image src={OpIcon} size={24} sx={{ position: 'relative', left: -3 }} />
        <Type.BodyBold sx={{ position: 'relative', left: -3 }}>
          <Trans>Bridge sUSD to OP (Sepolia)</Trans>
        </Type.BodyBold>
      </Flex>

      <Flex justifyContent="space-between" mb={2}>
        <Box>
          <Type.Caption mr="1ch" color="neutral3">
            Bal:
          </Type.Caption>
          <Type.CaptionBold>{formatNumber(sUSDBalanceSepolia, 2, 2)} sUSD</Type.CaptionBold>
        </Box>
        <Box>
          <Type.Caption mr="1ch" color="neutral3">
            Bal:
          </Type.Caption>
          <Type.CaptionBold>{formatNumber(sUSDBalance, 2, 2)} sUSD</Type.CaptionBold>
        </Box>
      </Flex>

      <Flex sx={{ gap: 2 }} alignItems="center">
        <Input
          value={amount}
          error={hasError}
          type="number"
          onChange={(e) => {
            const value = e.target.value || ''
            setAmount(Number(value) > 1_000_000_000 ? '1000000000' : value)
          }}
          block
          sx={{
            pr: 2,
          }}
          suffix="sUSD"
        />
        <Box flex="0 0 16px" color="neutral3">
          <ArrowRight size={16} />
        </Box>
        <Input
          value={amount}
          disabled
          type="number"
          block
          sx={{
            pr: 2,
            '&[disabled]': {
              color: 'neutral1',
            },
          }}
          suffix="sUSD"
        />
      </Flex>
      <Button
        mt={3}
        block
        variant="primary"
        disabled={hasError || !amount || bridgeMutation.isLoading}
        isLoading={bridgeMutation.isLoading}
        onClick={async () =>
          bridgeMutation.mutate(
            {
              method: 'initiateSynthTransfer',
              params: [
                '0x7355534400000000000000000000000000000000000000000000000000000000',
                signer?._address,
                parseEther(amount || ''),
              ],
            },
            {
              onSuccess: () => {
                refetch()
                setAmount('')
              },
            }
          )
        }
      >
        Bridge
      </Button>

      <Box mt={1}>
        <Type.Caption color="neutral3" mr="1">
          Estimate Receive:
        </Type.Caption>
        <Type.CaptionBold>5 minutes</Type.CaptionBold>
      </Box>
    </Box>
  )
}

export default BridgesUSD
