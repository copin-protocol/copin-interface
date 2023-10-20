import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, parseEther } from '@ethersproject/units'

import { useContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import useContractQuery from 'hooks/web3/useContractQuery'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useERC20Approval from 'hooks/web3/useTokenApproval'
import { Button } from 'theme/Buttons'
import { Box, Type } from 'theme/base'
import { SmartAccountCommand } from 'utils/config/enums'
import { CONTRACT_QUERY_KEYS } from 'utils/config/keys'
import { getTokenBalanceFromAccount } from 'utils/web3/balance'
import { DEFAULT_CHAIN_ID } from 'utils/web3/chains'
import { CONTRACT_ABIS, CONTRACT_ADDRESSES } from 'utils/web3/contracts'
import { Account } from 'utils/web3/types'

const TEST_AMOUNT = 100

const Deposit = ({ account, smartAccount, chainId }: { account: Account; smartAccount: string; chainId: number }) => {
  const { isValid, alert } = useRequiredChain({
    chainId: DEFAULT_CHAIN_ID,
  })
  const { isTokenAllowanceEnough, approving, approveToken } = useERC20Approval({
    token: CONTRACT_ADDRESSES[DEFAULT_CHAIN_ID][CONTRACT_QUERY_KEYS.SUSD],
    account: account.address,
    spender: smartAccount,
  })
  const smartAccountContract = useContract({
    contract: {
      address: smartAccount,
      abi: CONTRACT_ABIS[CONTRACT_QUERY_KEYS.SMART_ACCOUNT],
    },
    withSignerIfPossible: true,
  })
  const { data: availableMargin } = useContractQuery<BigNumber>(smartAccountContract, 'availableMargin', [])
  const smartAccountMutation = useContractMutation(smartAccountContract)
  const enoughAllowance = isTokenAllowanceEnough(TEST_AMOUNT)
  const sUSDBalance = getTokenBalanceFromAccount(account, 'sUSD')
  const deposit = () => {
    const input = defaultAbiCoder.encode(['int256'], [parseEther(TEST_AMOUNT.toString())])
    smartAccountMutation.mutate({
      method: 'execute',
      params: [[SmartAccountCommand.ACCOUNT_MODIFY_MARGIN], [input]],
    })
  }
  return (
    <div>
      {isValid ? (
        <>
          <Box mb={3}>Available Fund: {availableMargin ? formatEther(availableMargin) : '--'} sUSD</Box>
          <Type.Caption>Deposit {TEST_AMOUNT} sUSD</Type.Caption>
          {!enoughAllowance && (
            <Button
              variant="primary"
              isLoading={approving}
              disabled={approving}
              onClick={() => approveToken(TEST_AMOUNT)}
            >
              Approve
            </Button>
          )}
          {enoughAllowance && (
            <Button
              variant="primary"
              onClick={deposit}
              disabled={smartAccountMutation.isLoading || sUSDBalance < TEST_AMOUNT}
              isLoading={smartAccountMutation.isLoading}
            >
              Deposit
            </Button>
          )}
        </>
      ) : (
        alert
      )}
    </div>
  )
}

export default Deposit
