import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { useQuery } from 'react-query'

import { getGainsRebateRewardsApi } from 'apis/gains'
import ArbitrumLogo from 'components/@ui/ArbitrumLogo'
import NoDataFound from 'components/@ui/NoDataFound'
import { useSmartWalletContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import { useCustomMulticallQuery } from 'hooks/web3/useMulticallQuery'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import useWeb3 from 'hooks/web3/useWeb3'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'
import { rpcProvider } from 'utils/web3/providers'

const WEEK = 34

const ClaimGainsRewardModal = ({
  isOpen,
  onDismiss,
  smartWallet,
}: {
  isOpen: boolean
  onDismiss: (success?: boolean) => void
  smartWallet: string
}) => {
  const { isValid, alert } = useRequiredChain({
    chainId: ARBITRUM_CHAIN,
  })

  const { publicProvider } = useWeb3()

  const smartWalletContract = useSmartWalletContract(smartWallet, true)

  const mutation = useContractMutation(smartWalletContract)

  const { data, isLoading } = useQuery('GAINS_REWARD', () => getGainsRebateRewardsApi(smartWallet, WEEK))

  const { data: claims, isLoading: isClaimsLoading } = useCustomMulticallQuery<boolean[]>(
    [
      {
        inputs: [
          { internalType: 'uint256', name: '', type: 'uint256' },
          { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'epochTraderClaimed',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    (data || []).map((i) => ({
      address: '0x7401374ce116B71ABD1E2AE6351D21c2296D8787',
      name: 'epochTraderClaimed',
      params: [i.epoch, smartWallet],
    })),
    ARBITRUM_CHAIN,
    rpcProvider(ARBITRUM_CHAIN),
    undefined,
    {
      enabled: !!data && data.length > 0,
      select: (data: any[]) => {
        return data.map((e) => e[0])
      },
    }
  )

  const claimRewards = () => {
    if (!data || !claims) return
    const claimableData = data.filter((e, i) => !claims[i])
    const epochs = claimableData.map((e) => e.epoch)
    const rewards = claimableData.map((e) => e.amount)
    const proofs = claimableData.map((e) => e.proof)

    mutation.mutate(
      {
        method: 'claimRewards',
        params: [
          '0x7401374ce116B71ABD1E2AE6351D21c2296D8787',
          '0x912CE59144191C1204E64559FE8253a0e49E6548',
          epochs,
          rewards,
          proofs,
        ],
      },
      {
        onSuccess: async () => {
          onDismiss(true)
        },
      }
    )
  }

  const total = data
    ? data.reduce(
        (prev, cur, index) =>
          (prev += !!claims && claims[index] === false ? Number(formatEther(BigNumber.from(cur.amount))) : 0),
        0
      )
    : undefined

  return (
    <Modal isOpen={isOpen} onDismiss={() => onDismiss()} hasClose title={<Trans>Claim Gains Rewards</Trans>}>
      <Box px={3} pb={3}>
        <Box sx={{ border: '1px solid #ff98fa', borderRadius: '2px', p: 2, mb: 3, mx: 2 }}>
          <Type.CaptionBold
            mb={2}
            style={{
              display: 'block',
              background: 'linear-gradient(150deg, #8a9cff, #ff98fa, #ffab91 95%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: '#0000',
              filter: 'saturate(1.2) brightness(1.1) contrast(1.1)',
            }}
          >
            gTrade Rebate Program on Arbitrum
          </Type.CaptionBold>
          <Type.Caption>
            Arbitrum has launched an 11-week promotional program where users can earn $ARB weekly by trading on gTrade.
            Notably, the rewards in the trading fees category are capped at 75% of the total protocol fees. Rewards are
            calculated weekly and can be claimed every Friday.{' '}
            <a
              href="https://gains-network.gitbook.io/docs-home/gtrade-leveraged-trading/arbitrum-stip-bridge-incentives/trading-incentives"
              target="_blank"
              rel="noreferrer"
            >
              More Info
            </a>
          </Type.Caption>
        </Box>
        {isValid ? (
          !isLoading && !isClaimsLoading ? (
            <Box>
              {!!data && data.length && !!claims ? (
                <Box mx={2}>
                  {data.map((item, i) => (
                    <Flex key={item._id} justifyContent="space-between" alignItems="center" mb={2}>
                      <Type.Caption mr={2} textAlign="left">
                        Epoch {item.epoch}
                      </Type.Caption>
                      <Box>
                        <Type.Caption textAlign="right">
                          {formatNumber(formatEther(BigNumber.from(item.amount)), 2, 2)} ARB
                        </Type.Caption>
                        <Type.Caption color={claims[i] ? 'neutral3' : 'green1'} ml={2} textAlign="right" width={70}>
                          {claims[i] ? 'Claimed' : 'Claimable'}
                        </Type.Caption>
                      </Box>
                    </Flex>
                  ))}
                  <Button
                    variant="primary"
                    block
                    mt={3}
                    onClick={() => claimRewards()}
                    isLoading={mutation.isLoading}
                    disabled={mutation.isLoading || total === 0}
                  >
                    <Type.CaptionBold>Claim All - {formatNumber(total, 2, 2)}</Type.CaptionBold>
                    <Box
                      display="inline-block"
                      sx={{
                        position: 'relative',
                        top: '-2px',
                      }}
                    >
                      <ArbitrumLogo size={20} />
                    </Box>
                  </Button>
                </Box>
              ) : (
                <NoDataFound message={<Trans>No Rewards Found</Trans>} />
              )}
            </Box>
          ) : (
            <Loading />
          )
        ) : (
          alert
        )}
      </Box>
    </Modal>
  )
}

export default ClaimGainsRewardModal
