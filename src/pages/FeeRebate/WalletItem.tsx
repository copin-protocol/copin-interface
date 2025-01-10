import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import React, { ReactNode, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { RewardsData, getGainsRebateRewardsApi } from 'apis/gains'
import { useClickLoginButton } from 'components/@auth/LoginAction'
import ArbitrumLogo from 'components/@ui/ArbitrumLogo'
import NoDataFound from 'components/@ui/NoDataFound'
import TitleWithIcon from 'components/@ui/TilleWithIcon'
import { SmartWalletInfo } from 'components/@wallet/WalletDetailsCard'
import { CopyWalletData } from 'entities/copyWallet'
import { useAuthContext } from 'hooks/web3/useAuth'
import { useSmartWalletContract } from 'hooks/web3/useContract'
import useContractMutation from 'hooks/web3/useContractMutation'
import { useCustomMulticallQuery } from 'hooks/web3/useMulticallQuery'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import { ButtonWrapper, GradientText } from 'pages/@layouts/Navbar/EventButton'
import { Button } from 'theme/Buttons'
import Loading from 'theme/Loading'
import Modal from 'theme/Modal'
import { Box, Flex, Type } from 'theme/base'
import { DAYJS_FULL_DATE_FORMAT } from 'utils/config/constants'
import { getColorFromText } from 'utils/helpers/css'
import { formatLocalDate, formatNumber } from 'utils/helpers/format'
import { parseWalletName } from 'utils/helpers/transform'
import { ARBITRUM_CHAIN } from 'utils/web3/chains'
import { rpcProvider } from 'utils/web3/providers'

const WEEK = 34

const WalletItem = ({ wallet }: { wallet: CopyWalletData }) => {
  const smartWallet = wallet?.smartWalletAddress ?? ''
  const { data, isLoading } = useQuery(
    ['GAINS_REWARD', smartWallet],
    () => getGainsRebateRewardsApi(smartWallet, WEEK),
    {
      enabled: !!smartWallet,
    }
  )
  const {
    data: claims,
    isLoading: isClaimsLoading,
    refetch,
  } = useCustomMulticallQuery<boolean[]>(
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
      enabled: !!smartWallet && !!data && data.length > 0,
      select: (data: any[]) => {
        return data.map((e) => e[0])
      },
    }
  )

  const availableClaimAmount = useMemo(
    () =>
      data
        ? data.reduce(
            (prev, cur, index) =>
              (prev += !!claims && claims[index] === false ? Number(formatEther(BigNumber.from(cur.amount))) : 0),
            0
          )
        : undefined,
    [claims, data]
  )

  const { isAuthenticated, account, connect } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const [openModal, setOpenModal] = useState(false)

  const { isValid, alert } = useRequiredChain({ chainId: ARBITRUM_CHAIN })
  const smartWalletContract = useSmartWalletContract(smartWallet, true)
  const mutation = useContractMutation(smartWalletContract)

  const claimRewards = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (!account) {
      connect?.({})
      return
    }
    if (!isValid) {
      setOpenModal(true)
      return
    }
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
          // await delay(DELAY_SYNC * 2)
          refetch()
        },
      }
    )
  }

  return (
    <Box>
      <Flex
        sx={{
          bg: 'neutral5',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <WalletDetailsCard
          hiddenBalance={true}
          key={wallet.id}
          data={wallet}
          hasBorderTop={false}
          handleUpdate={() => {
            //
          }}
          reload={() => {
            //
          }}
        />
        {!!availableClaimAmount && (
          <ButtonWrapper mr={3}>
            <Box className="background" />
            <Box className="overlay" />
            <Button
              variant="ghostPrimary"
              block
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                height: 40,
                zIndex: 2,
                gap: 1,
                lineHeight: '40px',
                transition: '0.3s',
                '&:hover': {
                  transform: 'scale(1.03)',
                },
              }}
              py="6px"
              disabled={!availableClaimAmount || mutation.isLoading}
              isLoading={mutation.isLoading}
              onClick={claimRewards}
            >
              <GradientText>
                {mutation.isLoading ? 'Claiming' : `Claim All - ${formatNumber(availableClaimAmount, 2)}`}
              </GradientText>
              <ArbitrumLogo size={16} />
            </Button>
          </ButtonWrapper>
        )}
        {!isValid && openModal && <SwitchChainModal alert={alert} onDismiss={() => setOpenModal(false)} />}
      </Flex>
      {!isLoading && !isClaimsLoading ? (
        <Box>
          {!!data && !!claims ? (
            <GainsRewards data={data} claims={claims} />
          ) : (
            <NoDataFound message={<Trans>No Rewards Found</Trans>} />
          )}
        </Box>
      ) : (
        <Loading />
      )}
    </Box>
  )
}

export default WalletItem

interface WalletDetailsProps {
  data: CopyWalletData
  reload: () => void
  hasBorderTop?: boolean
  hiddenBalance?: boolean
  handleUpdate: (params: {
    copyWalletId: string
    name: string
    previousValue: string
    callback: (value: string) => void
  }) => void
}

function WalletDetailsCard({ data, hiddenBalance }: WalletDetailsProps) {
  const [walletName] = useState(parseWalletName(data))

  return (
    <Flex p={3} sx={{ flexDirection: 'column', gap: 2 }}>
      <Flex alignItems="center" sx={{ flex: 1, flexWrap: 'wrap', gap: 2 }}>
        <Flex width={200} alignItems="center" sx={{ gap: 2 }}>
          <TitleWithIcon color={getColorFromText(data.id)} title={walletName} textSx={{ fontSize: '12px' }} />
        </Flex>
        {/* <WalletKey walletKey={walletKey} isSmartWallet={isSmartWallet} /> */}
        <SmartWalletInfo sx={{ display: 'flex' }} data={data} hiddenBalance={hiddenBalance} showFund={false} />
      </Flex>
    </Flex>
  )
}

const GainsRewards = ({ data, claims }: { data: RewardsData[]; claims: boolean[] }) => {
  return (
    <Box p={2}>
      <Flex justifyContent="space-between" alignItems="center" mb={2} color="neutral3">
        <Flex flex={1} alignItems="center">
          <Type.Caption textAlign="left">Epoch</Type.Caption>
        </Flex>
        <Flex flex={1} alignItems="center">
          <Type.Caption textAlign="left">Date</Type.Caption>
        </Flex>
        <Flex flex={1} alignItems="center" justifyContent="flex-end">
          <Type.Caption textAlign="right">Rewards</Type.Caption>
        </Flex>
        <Flex flex={1} alignItems="center" justifyContent="flex-end">
          <Type.Caption textAlign="right">Status</Type.Caption>
        </Flex>
      </Flex>
      {!!data &&
        !!claims &&
        data.map((item, index) => (
          <Flex key={item._id} justifyContent="space-between" alignItems="center" mb={2}>
            <Flex flex={1} alignItems="center">
              <Type.Caption textAlign="left">Epoch {item.epoch}</Type.Caption>
            </Flex>
            <Flex flex={1} alignItems="center">
              <Type.Caption textAlign="left">
                {formatLocalDate(item.timestamp * 1000, DAYJS_FULL_DATE_FORMAT)}
              </Type.Caption>
            </Flex>
            <Flex flex={1} alignItems="center" justifyContent="flex-end">
              <Type.Caption textAlign="right">
                {formatNumber(formatEther(BigNumber.from(item.amount)), 2, 2)} ARB
              </Type.Caption>
            </Flex>
            <Flex flex={1} alignItems="center" justifyContent="flex-end">
              <Type.Caption color={claims[index] ? 'neutral3' : 'green1'} ml={2} textAlign="right">
                {claims[index] ? 'Claimed' : 'Claimable'}
              </Type.Caption>
            </Flex>
          </Flex>
        ))}
    </Box>
  )
}

function SwitchChainModal({ alert, onDismiss }: { alert: ReactNode; onDismiss: () => void }) {
  return (
    <Modal isOpen hasClose onDismiss={onDismiss}>
      <Box p={3}>{alert}</Box>
    </Modal>
  )
}
