import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'

import EthIcon from 'assets/icons/ic_eth.svg'
import useContractMutation from 'hooks/web3/useContractMutation'
import { Button } from 'theme/Buttons'
import Input from 'theme/Input'
import { Box, Flex, Image, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

const ABI = [
  {
    constant: false,
    inputs: [],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'guy', type: 'address' },
      { internalType: 'uint256', name: 'wad', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const EthToWeth = ({
  signer,
  ethBalance,
  wethBalance,
  refetch,
}: {
  signer?: JsonRpcSigner
  ethBalance?: number
  wethBalance?: number
  refetch: () => void
}) => {
  const [amount, setAmount] = useState<string>()
  const wethContract = useMemo(() => new Contract('0x4200000000000000000000000000000000000006', ABI, signer), [signer])

  const wethMutation = useContractMutation(wethContract)
  const hasError = (!!amount && !!ethBalance && Number(amount) > ethBalance) || (!!amount && Number(amount) <= 0)
  return (
    <Box variant="card" mb={3}>
      <Flex sx={{ gap: 2 }} alignItems="center" mb={3}>
        <Image src={EthIcon} size={24} />
        <Type.BodyBold>
          <Trans>Swap ETH to wETH</Trans>
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
          <Type.CaptionBold>{formatNumber(wethBalance, 4, 4)} wETH</Type.CaptionBold>
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
          value={amount || ''}
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
        disabled={hasError || !amount || wethMutation.isLoading}
        isLoading={wethMutation.isLoading}
        onClick={async () =>
          wethMutation.mutate(
            {
              method: 'deposit',
              params: [],
              value: amount ? parseEther(amount.toString()) : undefined,
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
        Swap
      </Button>
    </Box>
  )
}

export default EthToWeth
