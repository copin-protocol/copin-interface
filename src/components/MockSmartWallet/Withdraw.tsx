import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { parseEther } from '@ethersproject/units'

import useWalletMargin from 'hooks/features/useWalletMargin'
import { useContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import { Button } from 'theme/Buttons'
import { Box, Type } from 'theme/base'
import { SmartAccountCommand } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ABIS } from 'utils/web3/contracts'

const TEST_AMOUNT = 1

const Withdraw = ({ smartAccount }: { smartAccount: string }) => {
  const { isValid, alert } = useRequiredChain({
    chainId: DEFAULT_CHAIN_ID,
  })
  const smartAccountContract = useContract({
    contract: {
      address: smartAccount,
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_ACCOUNT],
    },
    withSignerIfPossible: true,
  })
  const { inWallet, available, accessibleMargins } = useWalletMargin({
    address: smartAccountContract.address,
  })
  const smartAccountMutation = useContractMutation(smartAccountContract)
  const withdraw = (amount: BigNumber) => {
    const commands = [SmartAccountCommand.ACCOUNT_MODIFY_MARGIN]
    const inputs: any[] = [defaultAbiCoder.encode(['int256'], [amount.mul(-1)])]

    if (inWallet && amount.gt(inWallet.bn)) {
      const margins = (accessibleMargins ?? []).filter((e) => e.value.gt(0))
      margins.forEach((margin) => {
        commands.unshift(SmartAccountCommand.PERP_WITHDRAW_ALL_MARGIN)
        inputs.unshift(defaultAbiCoder.encode(['address'], [margin.market]))
      })
    }

    smartAccountMutation.mutate({
      method: 'execute',
      params: [commands, inputs],
    })
  }
  return (
    <div>
      {isValid ? (
        <>
          <Box mb={3}>Available Fund: {available ? available.str : '--'} sUSD</Box>
          <Type.Caption>Withdraw {TEST_AMOUNT} sUSD</Type.Caption>
          <Button
            variant="primary"
            onClick={() => withdraw(parseEther(TEST_AMOUNT.toString()))}
            disabled={smartAccountMutation.isLoading || (!!available && available.num < TEST_AMOUNT)}
            isLoading={smartAccountMutation.isLoading}
          >
            Withdraw
          </Button>
          <Button
            variant="primary"
            onClick={() => !!available && !!inWallet && withdraw(available.bn)}
            disabled={smartAccountMutation.isLoading || !available}
            isLoading={smartAccountMutation.isLoading}
          >
            Withdraw Max
          </Button>
        </>
      ) : (
        alert
      )}
    </div>
  )
}

export default Withdraw
