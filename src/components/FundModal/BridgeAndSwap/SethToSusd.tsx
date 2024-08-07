import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner } from '@ethersproject/providers'
import { formatEther, parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import EthIcon from 'assets/icons/ic_eth.svg'
import useContractMutation from 'hooks/web3/useContractMutation'
import { Button } from 'theme/Buttons'
import Input from 'theme/Input'
import { Box, Flex, Image, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

const ABI = [
  {
    constant: false,
    inputs: [
      {
        internalType: 'bytes32',
        name: 'sourceCurrencyKey',
        type: 'bytes32',
      },
      { internalType: 'uint256', name: 'sourceAmount', type: 'uint256' },
      {
        internalType: 'bytes32',
        name: 'destinationCurrencyKey',
        type: 'bytes32',
      },
    ],
    name: 'exchange',
    outputs: [{ internalType: 'uint256', name: 'amountReceived', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const SethToSusd = ({
  signer,
  sethBalance,
  susdBalance,
  refetch,
}: {
  signer?: JsonRpcSigner
  sethBalance?: number
  susdBalance?: number
  refetch: () => void
}) => {
  const [amount, setAmount] = useState<string>()
  const mintContract = useMemo(() => new Contract('0xC6F85E8Cc2F13521f909810d03Ca66397a813eDb', ABI, signer), [signer])

  const mintMutation = useContractMutation(mintContract)

  const { data: swapAmount } = useQuery(
    ['swap_amount', amount],
    () =>
      amount
        ? mintContract.callStatic.exchange(
            '0x7345544800000000000000000000000000000000000000000000000000000000',
            parseEther(amount),
            '0x7355534400000000000000000000000000000000000000000000000000000000'
          )
        : undefined,
    {
      enabled: Number(amount) > 0,
      select(data) {
        return Number(formatEther(data))
      },
    }
  )

  const hasError =
    (!!amount && !!sethBalance && Number(amount) > sethBalance) || (!!amount && Number(amount) <= 0) || !swapAmount

  return (
    <Box variant="card" mb={3}>
      <Flex sx={{ gap: 2 }} alignItems="center" mb={3}>
        <Image src={EthIcon} size={24} />
        <Type.BodyBold>
          <Trans>Swap sETH to sUSD</Trans>
        </Type.BodyBold>
      </Flex>

      {/* label={`Bal: ${formatNumber(ethBalance, 4, 4)} ETH`}
      label={`Bal: ${formatNumber(sUSDBalance, 2, 2)} sUSD`} */}

      <Flex justifyContent="space-between" mb={2}>
        <Box>
          <Type.Caption mr="1ch" color="neutral3">
            Bal:
          </Type.Caption>
          <Type.CaptionBold>{formatNumber(sethBalance, 4, 4)} sETH</Type.CaptionBold>
        </Box>
        <Box>
          <Type.Caption mr="1ch" color="neutral3">
            Bal:
          </Type.Caption>
          <Type.CaptionBold>{formatNumber(susdBalance, 2, 2)} sUSD</Type.CaptionBold>
        </Box>
      </Flex>

      <Flex sx={{ gap: 2 }} alignItems="center">
        <Input
          value={amount}
          error={hasError}
          type="number"
          min="1"
          onChange={(e) => {
            const value = e.target.value || ''
            setAmount(Number(value) > 1_000_000_000 ? '1000000000' : value)
          }}
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
          value={swapAmount || ''}
          disabled
          type="number"
          block
          sx={{
            pr: 2,
            '&[disabled]': {
              color: 'neutral1',
            },
          }}
          suffix="wETH"
        />
      </Flex>
      <Button
        mt={3}
        block
        variant="primary"
        disabled={hasError || mintMutation.isLoading}
        isLoading={mintMutation.isLoading}
        onClick={async () => {
          if (!amount) return
          mintMutation.mutate(
            {
              method: 'exchange',
              params: [
                '0x7345544800000000000000000000000000000000000000000000000000000000',
                parseEther(amount.toString()),
                '0x7355534400000000000000000000000000000000000000000000000000000000',
              ],
            },
            {
              onSuccess: () => {
                refetch()
                setAmount('')
              },
            }
          )
        }}
      >
        Swap
      </Button>
    </Box>
  )
}

export default SethToSusd
