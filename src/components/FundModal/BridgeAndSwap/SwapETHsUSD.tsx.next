import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner } from '@ethersproject/providers'
import { formatEther, parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'

import EthIcon from 'assets/icons/ic_eth.svg'
import useContractMutation from 'hooks/web3/useContractMutation'
import useContractQuery from 'hooks/web3/useContractQuery'
import { Button } from 'theme/Buttons'
import Input from 'theme/Input'
import { Box, Flex, Image, Type } from 'theme/base'
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
  {
    constant: true,
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'synthsReceivedForEther',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
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
  const { data: swapAmount } = useContractQuery<number>(
    swapContract,
    'synthsReceivedForEther',
    [amount ? parseEther(amount.toString()) : 0],
    {
      enabled: !!amount,
      select(data) {
        return Number(formatEther(data))
      },
    }
  )
  const swapMutation = useContractMutation(swapContract)
  const hasError = !!amount && !!ethBalance && amount > ethBalance
  return (
    <Box variant="card" mb={3}>
      <Flex sx={{ gap: 2 }} alignItems="center" mb={3}>
        <Image src={EthIcon} size={24} />
        <Type.BodyBold>
          <Trans>Swap ETH to sUSD (Goerli)</Trans>
        </Type.BodyBold>
      </Flex>

      {/* label={`Bal: ${formatNumber(ethBalance, 4, 4)} ETH`}
      label={`Bal: ${formatNumber(sUSDBalance, 2, 2)} sUSD`} */}

      <Flex justifyContent="space-between" mb={2}>
        <Box>
          <Type.Caption mr="1ch" color="neutral3">
            Bal:
          </Type.Caption>
          <Type.CaptionBold>{formatNumber(ethBalance, 4, 4)} ETH</Type.CaptionBold>
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
          onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : undefined)}
          block
          sx={{
            pr: 2,
          }}
          suffix="ETH"
        />
        <Box flex="0 0 16px" color="neutral3">
          <ArrowRight size={16} />
        </Box>
        <Input
          value={swapAmount}
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
    </Box>
  )
}

export default SwapETHsUSD
