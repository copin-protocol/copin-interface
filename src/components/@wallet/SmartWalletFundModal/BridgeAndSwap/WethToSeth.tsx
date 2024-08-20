import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { ArrowRight } from '@phosphor-icons/react'
import { useMemo, useState } from 'react'

import EthIcon from 'assets/icons/ic_eth.svg'
import useContractMutation from 'hooks/web3/useContractMutation'
import useERC20Approval from 'hooks/web3/useTokenApproval'
import { Button } from 'theme/Buttons'
import Input from 'theme/Input'
import { Box, Flex, Image, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'

const ABI = [
  {
    constant: false,
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

const WethToSeth = ({
  account,
  signer,
  wethBalance,
  sethBalance,
  refetch,
}: {
  account: string
  signer?: JsonRpcSigner
  wethBalance?: number
  sethBalance?: number
  refetch: () => void
}) => {
  const [amount, setAmount] = useState<string>()
  const wrapperContract = useMemo(
    () => new Contract('0x1ea449185ee156a508a4aea2affcb88ec400a95d', ABI, signer),
    [signer]
  )

  const { isTokenAllowanceEnough, approving, approveToken } = useERC20Approval({
    token: '0x4200000000000000000000000000000000000006',
    account,
    spender: wrapperContract.address,
  })

  const wrapperMutation = useContractMutation(wrapperContract)
  const approvedEnough = isTokenAllowanceEnough(Number(amount))
  const hasError = (!!amount && !!wethBalance && Number(amount) > wethBalance) || (!!amount && Number(amount) <= 0)

  return (
    <Box variant="card" mb={3}>
      <Flex sx={{ gap: 2 }} alignItems="center" mb={3}>
        <Image src={EthIcon} size={24} />
        <Type.BodyBold>
          <Trans>Swap wETH to sETH</Trans>
        </Type.BodyBold>
      </Flex>

      {/* label={`Bal: ${formatNumber(ethBalance, 4, 4)} ETH`}
      label={`Bal: ${formatNumber(sUSDBalance, 2, 2)} sUSD`} */}

      <Flex justifyContent="space-between" mb={2}>
        <Box>
          <Type.Caption mr="1ch" color="neutral3">
            Bal:
          </Type.Caption>
          <Type.CaptionBold>{formatNumber(wethBalance, 4, 4)} wETH</Type.CaptionBold>
        </Box>
        <Box>
          <Type.Caption mr="1ch" color="neutral3">
            Bal:
          </Type.Caption>
          <Type.CaptionBold>{formatNumber(sethBalance, 4, 4)} sETH</Type.CaptionBold>
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
      <Flex mt={3} sx={{ gap: 2 }}>
        <Button
          block
          variant="outlinePrimary"
          disabled={hasError || !amount || wrapperMutation.isLoading || approving || approvedEnough}
          isLoading={approving}
          onClick={async () => approveToken(Number(amount))}
        >
          Aprrove
        </Button>
        <Button
          block
          variant="primary"
          disabled={hasError || !amount || wrapperMutation.isLoading || approving || !approvedEnough}
          isLoading={wrapperMutation.isLoading}
          onClick={async () => {
            if (!amount) return
            wrapperMutation.mutate(
              {
                method: 'mint',
                params: [parseEther(amount.toString())],
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
      </Flex>
    </Box>
  )
}

export default WethToSeth
