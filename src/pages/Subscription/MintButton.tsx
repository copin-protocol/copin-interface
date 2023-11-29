import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { Trans } from '@lingui/macro'
import { ArrowSquareOut, CheckCircle, FacebookLogo, TelegramLogo, Warning, XCircle } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { ReactNode, useRef, useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getMyProfileApi } from 'apis/userApis'
import confetti from 'assets/icons/confetti.png'
import defaultNft from 'assets/images/default-nft.webp'
import Divider from 'components/@ui/Divider'
import ETHPriceInUSD from 'components/ETHPriceInUSD'
import { useClickLoginButton } from 'components/LoginAction'
import useSubscriptionContract from 'hooks/features/useSubscriptionContract'
import useUserSubscription from 'hooks/features/useUserSubscription'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useAuthContext } from 'hooks/web3/useAuth'
import useChain from 'hooks/web3/useChain'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import TwitterIcon from 'theme/Icons/TwitterIcon'
import Loading from 'theme/Loading'
import Modal from 'theme/Modal'
import { FACEBOOK_SHARE_URL, TELEGRAM_SHARE_URL, TWITTER_SHARE_URL } from 'theme/Modal/SocialMediaSharingModal'
import { Box, Flex, IconBox, Image, Type } from 'theme/base'
import { APP_URL } from 'utils/config/constants'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getContractErrorMessage } from 'utils/helpers/handleError'
import { GOERLI } from 'utils/web3/chains'

import CopinIcon from './CopinIcon'

export default function MintButton({
  planPrice,
  buttonType = 'gradient',
  buttonSx,
  buttonText = <Trans>Mint NFT</Trans>,
}: {
  planPrice: BigNumber | undefined
  buttonType?: 'primary' | 'gradient'
  buttonSx?: any
  buttonText?: ReactNode
}) {
  const { isAuthenticated } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    setOpenModal(true)
  }
  const handleDismiss = () => setOpenModal(false)

  return (
    <>
      <StyledButton
        variant={buttonType === 'primary' ? 'primary' : undefined}
        sx={{
          width: ['100%', 246],
          height: 48,
          position: 'relative',
          ...(buttonType === 'gradient'
            ? {
                borderRadius: '4px',
                '&:hover': {
                  '.light': {
                    width: 240,
                  },
                },
              }
            : {}),
          ...(buttonSx ?? {}),
        }}
        disabled={!planPrice}
        onClick={handleOpenModal}
      >
        {buttonType === 'gradient' && <Decorators />}
        <Type.BodyBold color={buttonType === 'gradient' ? 'neutral1' : 'neutral8'} sx={{ position: 'relative' }}>
          {buttonText}
        </Type.BodyBold>
      </StyledButton>
      {openModal && <MintModal isOpen={openModal} onDismiss={handleDismiss} planPrice={planPrice} />}
    </>
  )
}

const MINT_DURATION = 1 // month
const MINT_TIER = 1 // premium

type MintState = 'preparing' | 'minting' | 'syncing' | 'success'

function MintModal({
  isOpen,
  onDismiss,
  planPrice,
}: {
  isOpen: boolean
  onDismiss: () => void
  planPrice: BigNumber | undefined
}) {
  const { isValid, alert } = useRequiredChain({ chainId: GOERLI })
  const subscriptionContract = useSubscriptionContract()
  const [state, setState] = useState<MintState>('preparing')
  const subscriptionMutation = useContractMutation(subscriptionContract, {
    onMutate: () => {
      setState('minting')
    },
    onSuccess: () => {
      setState('syncing')
    },
    onError: () => setState('preparing'),
  } as any)

  const handleMint = () => {
    subscriptionMutation.mutate({ method: 'mint', params: [MINT_TIER, MINT_DURATION], value: planPrice })
  }
  const handleSyncSuccess = () => {
    setState('success')
  }
  const isSuccess = state === 'success'
  return (
    <Modal
      isOpen={isOpen}
      title={isSuccess ? '' : <Trans>Mint New Subscription</Trans>}
      background={isSuccess ? 'transparent' : 'neutral5'}
      modalContentStyle={isSuccess ? { border: 'none', boxShadow: 'none' } : undefined}
      hasClose={state === 'preparing'}
      onDismiss={onDismiss}
      dismissable={false}
    >
      {!isValid && <Box p={3}>{alert}</Box>}
      {isValid && (
        <>
          <Box>
            {state === 'preparing' && (
              <Box p={3}>
                <PrepairingState planPrice={planPrice} />
                <Box mb={3} />
                {subscriptionMutation.error && (
                  <Type.Caption my={2} color="red1">
                    {getContractErrorMessage(subscriptionMutation.error)}
                  </Type.Caption>
                )}
                <Button variant="primary" block onClick={handleMint} disabled={!planPrice}>
                  {subscriptionMutation.error ? <Trans>Mint Again</Trans> : <Trans>Mint Now</Trans>}
                </Button>
              </Box>
            )}
            {state !== 'preparing' && !isSuccess && (
              <ProcessingState
                isProcessing={state === 'minting'}
                isSyncing={state === 'syncing'}
                onSyncSuccess={handleSyncSuccess}
                txHash={subscriptionMutation.data?.transactionHash}
              />
            )}
            {isSuccess && <SuccessState handleClose={onDismiss} />}
          </Box>
          {!planPrice && (
            <Type.Body sx={{ display: 'block', p: 3, textAlign: 'center' }}>
              <Trans>Cannot interact with contract at this moment</Trans>
            </Type.Body>
          )}
        </>
      )}
    </Modal>
  )
}

function PrepairingState({ planPrice }: { planPrice: BigNumber | undefined }) {
  if (!planPrice) return <></>

  return (
    <Box>
      <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <CopinIcon />
        <Type.Caption my={2} color="neutral1">
          <Trans>
            You will receive{' '}
            <Box as="span" color="primary1">
              30 days
            </Box>{' '}
            Premium NFT Plan
          </Trans>
        </Type.Caption>
        <Type.H5>
          <Box as="span" color="orange1">
            <ETHPriceInUSD value={planPrice} />$
          </Box>
          <Box as="span" color="neutral1" sx={{ fontSize: '13px', fontWeight: 400 }}>
            {' '}
            (~{formatEther(planPrice)}ETH)
          </Box>
        </Type.H5>
      </Flex>
      <Divider my={20} />
      <Alert
        variant="cardWarning"
        message={
          <Flex sx={{ gap: 2, alignItems: 'center' }}>
            <IconBox icon={<Warning size={16} />} />
            <Box as="span">
              <Trans>Caution !!!</Trans>
            </Box>
          </Flex>
        }
        description={
          <Trans>
            After minting, please wait about 3 minutes for system updates to access all features. We appreciate your
            patience!
          </Trans>
        }
      />
    </Box>
  )
}

const MAXIMUM_CHECK_TIME = 24 // 2minute
export function ProcessingState({
  isProcessing,
  isSyncing,
  onSyncSuccess,
  txHash,
  processingText = <Trans>Minting NFT</Trans>,
}: {
  isProcessing: boolean
  isSyncing: boolean
  onSyncSuccess: () => void
  txHash: string | undefined
  processingText?: ReactNode
}) {
  const { chain } = useChain()
  const refetchTime = useRef(0)
  const { myProfile, setMyProfile } = useMyProfileStore()
  const refetchQueries = useRefetchQueries()
  const prevExpiredTime = useRef<number>(0)
  useUserSubscription({
    enabled: isSyncing && !!myProfile?.plan,
    onSuccess: (data) => {
      if (refetchTime.current > MAXIMUM_CHECK_TIME) {
        onSyncSuccess()
        return
      }
      refetchTime.current += 1
      if (!prevExpiredTime.current) {
        prevExpiredTime.current = dayjs.utc(data?.expiredTime).valueOf()
        return
      }
      if (
        !!prevExpiredTime.current &&
        data?.expiredTime &&
        dayjs.utc(data?.expiredTime).valueOf() > prevExpiredTime.current
      ) {
        refetchQueries([QUERY_KEYS.GET_USER_SUBSCRIPTION], () => {
          onSyncSuccess()
        })
      }
    },
    refetchInterval: 5_000,
  })
  useQuery([QUERY_KEYS.GET_USER_PROFILE], getMyProfileApi, {
    enabled: isSyncing && !myProfile?.plan,
    onSuccess: (data) => {
      if (refetchTime.current > MAXIMUM_CHECK_TIME) {
        onSyncSuccess()
        return
      }
      refetchTime.current += 1
      if (data.plan === SubscriptionPlanEnum.PREMIUM) {
        setMyProfile(data)
        onSyncSuccess()
      }
    },
    refetchInterval: 5_000,
  })
  return (
    <Box p={24}>
      <Flex mb={3} sx={{ alignItems: 'center', gap: 18 }}>
        {isProcessing ? (
          <Loading size={20} background="neutral3" indicatorColor="orange1" sx={{ margin: '2px !important' }} />
        ) : isSyncing ? (
          <IconBox icon={<CheckCircle size={24} />} color="green1" />
        ) : (
          <Box
            sx={{ m: '2px', width: 20, height: 20, borderRadius: '50%', border: '2px solid', borderColor: 'neutral3' }}
          />
        )}
        <Type.Body
          color={isProcessing ? 'orange1' : isSyncing ? 'green1' : 'neutral3'}
          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
        >
          <span>{processingText}</span>
          {txHash && isSyncing && (
            <a
              href={`${chain.blockExplorerUrl}/tx/${txHash}`}
              rel="noreferrer"
              target="_blank"
              style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}
            >
              <ArrowSquareOut size={20} />
            </a>
          )}
        </Type.Body>
      </Flex>
      <Flex mb={4} sx={{ alignItems: 'center', gap: 18 }}>
        {isSyncing ? (
          <Loading size={20} background="neutral3" indicatorColor="orange1" sx={{ margin: '2px !important' }} />
        ) : (
          <Box
            sx={{ m: '2px', width: 20, height: 20, borderRadius: '50%', border: '2px solid', borderColor: 'neutral3' }}
          />
        )}
        <Type.Body color={isSyncing ? 'orange1' : 'neutral3'}>
          <Trans>Upgrade Account</Trans>
        </Type.Body>
      </Flex>
      <Type.Body sx={{ display: 'flex', gap: '0.5ch', alignItems: 'center', flexWrap: 'wrap' }}>
        <span>
          <Trans>While you wait,</Trans>
        </span>
        <Link to="/" target="_blank" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>
            <Trans>continue exploring Copin</Trans>
          </span>
          <IconBox icon={<ArrowSquareOut size={20} />} color="inherit" />
        </Link>
      </Type.Body>
    </Box>
  )
}

export function SuccessState({
  handleClose,
  successText = <Trans>Your NFT has been successfully minted</Trans>,
}: {
  handleClose: () => void
  successText?: ReactNode
}) {
  const [showConfetti, setShowConfetti] = useState(true)
  const text =
    "Hey there! Just minted my @Copin_io Premium NFT\n📌 It's like an insights party with traders from the perpetual DEX world!\nCome and check it out: "
  const link = `${APP_URL}/subscription`

  return (
    <Box>
      {showConfetti && (
        <Box sx={{ width: 0, height: 0, mx: 'auto', overflow: 'hidden' }}>
          <ConfettiExplosion
            zIndex={99999}
            width={2000}
            height={1000}
            duration={4000}
            onComplete={() => setShowConfetti(false)}
          />
        </Box>
      )}
      <Box
        sx={{
          width: 'max-content',
          mx: 'auto',
          p: 3,
          position: 'relative',
          border: 'small',
          borderImageSlice: 1,
          borderImageSource: 'linear-gradient(90deg, #ABECA2 -1.42%, #2FB3FE 30.38%, #6A8EEA 65.09%, #A185F4 99.55%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 1,
            background: 'linear-gradient(180deg, #235884 0%, #252A83 100%)',
          }}
        />
        <Box sx={{ position: 'relative', zIndex: 10 }}>
          <Image src={defaultNft} sx={{ width: 327, height: 'auto', mx: 'auto', display: 'block' }} />
          <Flex mt={4} mb={2} sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Image src={confetti} sx={{ width: 24, height: 24 }} />
            <Type.H5>
              <Trans>Congratulations!</Trans>
            </Type.H5>
            <Image src={confetti} sx={{ width: 24, height: 24 }} />
          </Flex>
          <Type.Body mb={4} sx={{ display: 'block', textAlign: 'center' }}>
            {successText}
          </Type.Body>
          <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <Type.Caption mb={2} color="neutral2">
              <Trans>Share On:</Trans>
            </Type.Caption>
            <Flex sx={{ alignItems: 'center', gap: 3 }}>
              <IconBox
                role="button"
                icon={<TwitterIcon size={32} />}
                color="neutral1"
                sx={{ '&:hover': { color: 'primary1' } }}
                onClick={() =>
                  window.open(
                    `${TWITTER_SHARE_URL}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
                    '_blank'
                  )
                }
              />
              <IconBox
                role="button"
                icon={<FacebookLogo size={32} weight="fill" />}
                color="neutral1"
                sx={{ '&:hover': { color: 'primary1' } }}
                onClick={() =>
                  window.open(
                    `${FACEBOOK_SHARE_URL}?quote=${encodeURIComponent(text)}&u=${encodeURIComponent(link)}`,
                    '_blank'
                  )
                }
              />
              <IconBox
                role="button"
                icon={<TelegramLogo size={32} weight="fill" />}
                color="neutral1"
                sx={{ '&:hover': { color: 'primary1' } }}
                onClick={() =>
                  window.open(
                    `${TELEGRAM_SHARE_URL}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
                    '_blank'
                  )
                }
              />
            </Flex>
          </Flex>
        </Box>
      </Box>
      <IconBox
        role="button"
        icon={<XCircle size={24} />}
        color="neutral3"
        sx={{ '&:hover': { color: 'neutral2' }, width: 'max-content', mx: 'auto', mt: 12, display: 'block' }}
        onClick={handleClose}
      />
    </Box>
  )
}

function Decorators() {
  return (
    <>
      <Box
        className="light"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 210,
          height: 40,
          transform: 'translateX(-50%) translateY(-50%)',
          borderRadius: '40px',
          background: 'radial-gradient(75.94% 115.68% at 73.2% 6.65%, #FFF 0%, #3EA2F4 27.6%, #423EF4 100%)',
          backdropFilter: 'blur(16px)',
          transition: '0.3s',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '2px',
          border: '0.5px solid #DCBFF280',
          background: 'linear-gradient(180deg, rgba(62, 162, 244, 0.05) 0%, rgba(66, 62, 244, 0.05) 100%)',
          boxShadow: '1px 1px 0px 0px #3D7AF0',
          backdropFilter: 'blur(20px)',
        }}
      />
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(180deg)' }}>
        <Box as="svg" className="dash_1">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2 dash_3">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2 dash_4">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
      </Box>
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <Box as="svg" className="dash_1">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2 dash_3">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
        <Box as="svg" className="dash_1 dash_2 dash_4">
          <rect x="0" y="0" width="100%" height="100%" rx="4px" ry="4px" pathLength="10"></rect>
        </Box>
      </Box>
    </>
  )
}

const StyledButton = styled(Button)`
  &:hover {
    .dash_1 {
      animation: light_ani 1s ease-in-out;
    }
  }
  .dash_1 {
    display: block;
    position: absolute;
    inset: 0px;
    overflow: visible;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    fill: none;
    stroke: rgb(248, 252, 255);
    stroke-width: 2px;
    stroke-dasharray: 2, 10;
    stroke-dashoffset: 14;
    opacity: 0;
  }
  .dash_2 {
    stroke-width: 6px;
    filter: blur(20px);
    stroke: rgb(201, 233, 255);
  }
  .dash_3 {
    filter: blur(6px);
  }
  .dash_4 {
    filter: blur(56px);
  }
  @keyframes light_ani {
    30%,
    55% {
      opacity: 1;
    }
    100% {
      stroke-dashoffset: 4;
      opacity: 0;
    }
  }
`
