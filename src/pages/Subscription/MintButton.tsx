import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import { ArrowSquareOut, CheckCircle, FacebookLogo, TelegramLogo, XCircle } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { ReactNode, useRef, useState } from 'react'
import ConfettiExplosion from 'react-confetti-explosion'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'

import { getMyProfileApi } from 'apis/userApis'
import confetti from 'assets/icons/confetti.png'
import defaultNft from 'assets/images/default-nft.webp'
import vipNft from 'assets/images/vip-nft.webp'
import Divider from 'components/@ui/Divider'
import ETHPriceInUSD from 'components/ETHPriceInUSD'
import { useClickLoginButton } from 'components/LoginAction'
import Num from 'entities/Num'
import useSubscriptionContract from 'hooks/features/useSubscriptionContract'
import useUserSubscription from 'hooks/features/useUserSubscription'
import useRefetchQueries from 'hooks/helpers/ueRefetchQueries'
import useMyProfileStore from 'hooks/store/useMyProfile'
import { useAuthContext } from 'hooks/web3/useAuth'
import useChain from 'hooks/web3/useChain'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
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
import { SUBSCRIPTION_CHAIN_ID } from 'utils/web3/chains'

import CopinIcon from './CopinIcon'

export default function MintButton({
  planPrice,
  plan,
  buttonType = 'gradient',
  buttonSx,
  buttonText = <Trans>Mint NFT</Trans>,
  bgType = '1',
  disabled = false,
}: {
  planPrice: BigNumber | undefined
  plan: SubscriptionPlanEnum
  buttonType?: 'primary' | 'gradient'
  buttonSx?: any
  buttonText?: ReactNode
  bgType?: '1' | '2'
  disabled?: boolean
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
        disabled={!planPrice || disabled}
        onClick={handleOpenModal}
      >
        {buttonType === 'gradient' && <Decorators bgType={bgType} />}
        <Type.BodyBold color={buttonType === 'gradient' ? 'neutral1' : 'neutral8'} sx={{ position: 'relative' }}>
          {buttonText}
        </Type.BodyBold>
      </StyledButton>
      {openModal && <MintModal isOpen={openModal} onDismiss={handleDismiss} planPrice={planPrice} plan={plan} />}
    </>
  )
}

const MINT_DURATION = 1 // month

type MintState = 'preparing' | 'minting' | 'syncing' | 'success'

function MintModal({
  isOpen,
  onDismiss,
  planPrice,
  plan,
}: {
  isOpen: boolean
  onDismiss: () => void
  planPrice: BigNumber | undefined
  plan: SubscriptionPlanEnum
}) {
  const { data: userSubscription } = useUserSubscription()
  const { isValid, alert } = useRequiredChain({ chainId: SUBSCRIPTION_CHAIN_ID })
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
    subscriptionMutation.mutate({ method: 'mint', params: [plan, MINT_DURATION], value: planPrice })
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
                <PrepairingState planPrice={planPrice} plan={plan} />
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
                upgradePlan={plan}
                prevExpiredTime={dayjs.utc(userSubscription?.expiredTime).valueOf()}
              />
            )}
            {isSuccess && <SuccessState handleClose={onDismiss} plan={plan} />}
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

function PrepairingState({ planPrice, plan }: { planPrice: BigNumber | undefined; plan: SubscriptionPlanEnum }) {
  const price = planPrice ? new Num(planPrice) : undefined
  if (!price) return <></>

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
            {plan === SubscriptionPlanEnum.PREMIUM ? 'Premium ' : 'VIP '} NFT Plan
          </Trans>
        </Type.Caption>
        <ModalPriceFormat price={price} />
      </Flex>
      <Divider my={20} />
      {/* <Alert
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
      /> */}
    </Box>
  )
}
export function ModalPriceFormat({ price }: { price: Num }) {
  return (
    <Type.H5>
      <Box as="span" color="orange1">
        {price.str}
      </Box>
      <Box as="span" sx={{ fontSize: '20px', ml: '0.3ch' }} color="orange1">
        ETH
      </Box>
      <Box as="span" color="neutral1" sx={{ fontSize: '13px', fontWeight: 400 }}>
        {' '}
        (~
        <ETHPriceInUSD value={price.bn} />
        $)
      </Box>
    </Type.H5>
  )
}

const MAXIMUM_CHECK_TIME = 24 // 2minute
export function ProcessingState({
  isProcessing,
  isSyncing,
  onSyncSuccess,
  txHash,
  processingText = [<Trans key={1}>Minted NFT</Trans>, <Trans key={2}>Minting NFT</Trans>],
  upgradePlan,
  prevExpiredTime,
}: {
  isProcessing: boolean
  isSyncing: boolean
  onSyncSuccess: () => void
  txHash: string | undefined
  processingText?: ReactNode[]
  upgradePlan: SubscriptionPlanEnum
  prevExpiredTime: number
}) {
  const { chain } = useChain()
  const refetchTime = useRef(0)
  const { myProfile, setMyProfile } = useMyProfileStore()
  const refetchQueries = useRefetchQueries()
  const _prevExpiredTime = useRef<number>(prevExpiredTime)
  // check for extend
  useUserSubscription({
    enabled: isSyncing && myProfile?.plan != null && myProfile?.plan === upgradePlan,
    onSuccess: (data) => {
      if (refetchTime.current > MAXIMUM_CHECK_TIME) {
        onSyncSuccess()
        return
      }
      refetchTime.current += 1
      if (!_prevExpiredTime.current) {
        _prevExpiredTime.current = dayjs.utc(data?.expiredTime).valueOf()
        return
      }
      if (
        !!_prevExpiredTime.current &&
        data?.expiredTime &&
        dayjs.utc(data?.expiredTime).valueOf() > _prevExpiredTime.current
      ) {
        refetchQueries([QUERY_KEYS.GET_USER_SUBSCRIPTION], () => {
          onSyncSuccess()
        })
      }
    },
    refetchInterval: 5_000,
  })
  // Check for mint
  useQuery([QUERY_KEYS.GET_USER_PROFILE], getMyProfileApi, {
    enabled: isSyncing && myProfile?.plan != null,
    onSuccess: (data) => {
      try {
        if (refetchTime.current > MAXIMUM_CHECK_TIME) {
          onSyncSuccess()
          return
        }
        refetchTime.current += 1
        if (Number(upgradePlan) < Number(data.plan) || data.plan === upgradePlan) {
          setMyProfile(data)
          onSyncSuccess()
        }
      } catch (error) {
        onSyncSuccess()
      }
    },
    refetchInterval: 5_000,
  })
  return (
    <Box p={24}>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            width: '1px',
            height: '12px',
            bg: 'neutral3',
            position: 'absolute',
            left: 12,
            top: 26,
          }}
        />
        <Flex mb={3} sx={{ alignItems: 'center', gap: 12 }}>
          {isProcessing ? (
            <Loading size={20} background="neutral3" indicatorColor="orange1" sx={{ margin: '2px !important' }} />
          ) : isSyncing ? (
            <IconBox icon={<CheckCircle size={24} />} color="green1" />
          ) : (
            <Box
              sx={{
                m: '2px',
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: 'neutral3',
              }}
            />
          )}
          <Type.Body
            color={isProcessing ? 'orange1' : isSyncing ? 'green1' : 'neutral3'}
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <span>{isProcessing ? processingText[1] : processingText[0]}</span>
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
        <Flex mb={4} sx={{ alignItems: 'center', gap: 12 }}>
          {isSyncing ? (
            <Loading size={20} background="neutral3" indicatorColor="orange1" sx={{ margin: '2px !important' }} />
          ) : (
            <Box
              sx={{
                m: '2px',
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: 'neutral3',
              }}
            />
          )}
          <Type.Body color={isSyncing ? 'orange1' : 'neutral3'}>
            {isSyncing ? <Trans>Syncing Onchain Data</Trans> : <Trans>Sync Onchain Data</Trans>}
          </Type.Body>
        </Flex>
      </Box>
      {isSyncing && (
        <>
          <Divider mb={3} />
          <Type.Caption sx={{ display: 'flex', gap: '0.5ch', alignItems: 'center', flexWrap: 'wrap' }}>
            <span>
              <Trans>Sync progress may take approximately 5 minutes. Continue using Copin while syncing?</Trans>{' '}
              <Link to="/" target="_blank" style={{ display: 'inline-flex', gap: 1, alignItems: 'center' }}>
                <span>
                  <Trans>Open Homepage</Trans>
                </span>
                <IconBox icon={<ArrowSquareOut size={16} />} color="inherit" />
              </Link>
            </span>
          </Type.Caption>
        </>
      )}
    </Box>
  )
}

export function SuccessState({
  handleClose,
  successText = <Trans>Your NFT has been successfully minted</Trans>,
  plan,
}: {
  handleClose: () => void
  successText?: ReactNode
  plan: SubscriptionPlanEnum
}) {
  const [showConfetti, setShowConfetti] = useState(true)

  let nftImageSrc = ''
  let description = ''
  switch (plan) {
    case SubscriptionPlanEnum.PREMIUM:
      nftImageSrc = defaultNft
      description = `Hey there! Just minted my @Copin_io Premium NFT 📌 It's like an insights party with traders from the perpetual DEX world!\nCome and check it out`
      break
    case SubscriptionPlanEnum.VIP:
      nftImageSrc = vipNft
      description = `Just minted my Subscription NFT on @Copin_io! 🚀 I'm proud to contribute to the mission of driving mass adoption of perp DEX narrative. Get yours and join the Copin.io community today! #Copin #NFT`
      break
  }

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
          <Image src={nftImageSrc} sx={{ width: 327, height: 'auto', mx: 'auto', display: 'block' }} />
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
                as="a"
                href={`${TWITTER_SHARE_URL}?text=${encodeURIComponent(description)}&url=${encodeURIComponent(link)}`}
                target="_blank"
                icon={<TwitterIcon size={32} />}
                color="neutral1"
                sx={{ '&:hover': { color: 'primary1' } }}
              />
              <IconBox
                role="button"
                as="a"
                href={`${FACEBOOK_SHARE_URL}?quote=${encodeURIComponent(description)}&u=${encodeURIComponent(link)}`}
                target="_blank"
                icon={<FacebookLogo size={32} weight="fill" />}
                color="neutral1"
                sx={{ '&:hover': { color: 'primary1' } }}
              />
              <IconBox
                role="button"
                as="a"
                href={`${TELEGRAM_SHARE_URL}?text=${encodeURIComponent(description)}&url=${encodeURIComponent(link)}`}
                target="_blank"
                icon={<TelegramLogo size={32} weight="fill" />}
                color="neutral1"
                sx={{ '&:hover': { color: 'primary1' } }}
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

function Decorators({ bgType = '1' }: { bgType: '1' | '2' }) {
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
          background:
            bgType === '1'
              ? 'radial-gradient(75.94% 115.68% at 73.2% 6.65%, #FFF 0%, #3EA2F4 27.6%, #423EF4 100%)'
              : 'radial-gradient(84.44% 102.83% at 80.14% -10.29%, #FFFFFF 0%, #32424F 27.6%, #393869 100%)',
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
          // background:
          //   bgType === '1' ? 'linear-gradient(180deg, rgba(62, 162, 244, 0.05) 0%, rgba(66, 62, 244, 0.05) 100%)' : '',
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
