import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import dayjs from 'dayjs'
import { ReactNode, useState } from 'react'

// import { useForm } from 'react-hook-form'
import Divider from 'components/@ui/Divider'
import ETHPriceInUSD from 'components/ETHPriceInUSD'
import { useClickLoginButton } from 'components/LoginAction'
import Num from 'entities/Num'
import useSubscriptionContract from 'hooks/features/useSubscriptionContract'
import useUserSubscription from 'hooks/features/useUserSubscription'
import { useAuthContext } from 'hooks/web3/useAuth'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import CopinIcon from 'pages/Subscription/CopinIcon'
import { ModalPriceFormat, ProcessingState, SuccessState } from 'pages/Subscription/MintButton'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
// import Radio from 'theme/Radio'
import Select from 'theme/Select'
import { Box, Flex, Type } from 'theme/base'
import { SubscriptionPlanEnum } from 'utils/config/enums'
import { formatNumber } from 'utils/helpers/format'
import { getContractErrorMessage } from 'utils/helpers/handleError'
import { SUBSCRIPTION_CHAIN_ID } from 'utils/web3/chains'

type Config = {
  monthCount: number
  price: Num
  discountRatio: number
}

type ComponentConfigs = {
  buttonLabel: ReactNode
  modalLabels: {
    modalTitle: ReactNode
    idle: ReactNode
    retry: ReactNode
    preparing: ReactNode
    processing: ReactNode
    success: ReactNode
    congrats: ReactNode
  }
  buttonSx?: any
  dropdownSx?: any
  textSx?: any
  plan: SubscriptionPlanEnum
  planPrice: BigNumber | undefined
  wrapperSx?: any
}
type PricingOptionsOverload = {
  (props: ComponentConfigs & { method: 'extend'; tokenId: number }): JSX.Element
  (props: ComponentConfigs & { method: 'mint' }): JSX.Element
}
type PricingOptionsProps = ComponentConfigs & {
  method: 'extend' | 'mint'
  plan: SubscriptionPlanEnum
  planPrice: BigNumber | undefined
  tokenId?: number
}
export const PricingDropdown: PricingOptionsOverload = ({
  tokenId,
  plan,
  method,
  modalLabels,
  buttonLabel,
  buttonSx,
  dropdownSx,
  textSx,
  planPrice,
  wrapperSx = {},
}: PricingOptionsProps) => {
  const { isAuthenticated, account, connect } = useAuthContext()
  const handleClickLogin = useClickLoginButton()
  const configs = getPlanPriceConfigs(planPrice)
  const [monthCount, setMonthCount] = useState(MONTHS[0])

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => {
    if (!isAuthenticated) {
      handleClickLogin()
      return
    }
    if (!account) {
      connect?.({})
      return
    }
    setOpenModal(true)
  }
  const handleDismiss = () => setOpenModal(false)

  if (!configs.length) return <></>
  const currentSelection = configs.find((config) => config.monthCount === monthCount)
  const selectOptions = configs.map((config) => ({
    value: config.monthCount,
    label:
      config.monthCount === 12 ? (
        <Trans>1 year</Trans>
      ) : config.monthCount > 1 ? (
        <Trans>{config.monthCount} months</Trans>
      ) : (
        <Trans>{config.monthCount} month</Trans>
      ),
  }))
  const currentSelect = selectOptions.find((option) => option.value === monthCount)

  let color = ''
  switch (plan) {
    case SubscriptionPlanEnum.PREMIUM:
      color = 'orange1'
      break
    case SubscriptionPlanEnum.VIP:
      color = 'violet'
      break
  }

  return (
    <>
      <Flex
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['start', 'center'],
          justifyContent: 'space-between',
          gap: 3,
          width: '100%',
          ...wrapperSx,
        }}
      >
        <Flex
          sx={{
            flexShrink: 0,
            '.price_dropdown': {
              height: '48px',
              width: '100px',
              flexShrink: 0,
              '.select__control': {
                height: '100%',
                borderColor: 'neutral4',
                bg: 'transparent',
              },
              '.select__value-container': {
                px: '8px !important',
                pr: '2px !important',
              },
              '.select__indicators': {
                pr: 2,
              },
            },
          }}
        >
          <Select
            isSearchable={false}
            className="price_dropdown"
            options={selectOptions}
            value={currentSelect}
            onChange={(newValue) => setMonthCount((newValue as any).value)}
            menuPlacement="top"
            sx={{ ...(dropdownSx || {}) }}
          />
          <PriceText
            data={currentSelection!}
            color={color}
            sx={{
              columnGap: 1,
              rowGap: 2,
              alignItems: 'start',
              justifyContent: 'start',
              '& *': { lineHeight: '1em !important' },
              flexDirection: 'column',
              ...(textSx || {}),
            }}
          />
        </Flex>
        <Button
          variant="primary"
          sx={{ width: 160, flexShrink: 0, height: 48, ...(buttonSx || {}) }}
          onClick={handleOpenModal}
          key={(!currentSelection).toString()}
          disabled={!currentSelection}
        >
          {buttonLabel}
        </Button>
      </Flex>
      {currentSelection && openModal && (
        <ActionModal
          isOpen={openModal}
          data={currentSelection}
          onDismiss={handleDismiss}
          tokenId={tokenId}
          method={method}
          labels={modalLabels}
          plan={plan}
        />
      )}
    </>
  )
}

function PriceText({ data, sx, color }: { data: Config; sx?: any; color?: string }) {
  return (
    <Type.H5
      ml={3}
      color={color}
      sx={{
        display: 'flex',
        flexDirection: ['column', 'row'],
        alignItems: ['start', 'end'],
        flexWrap: 'wrap',
        columnGap: 2,
        rowGap: 0,
        ...(sx || {}),
      }}
    >
      <Box as="span" sx={{ flexShrink: 0 }}>
        {data.price.str}
        <Box as="span" sx={{ flexShrink: 0, fontSize: '20px', lineHeight: '28px', ml: '0.3ch' }}>
          ETH
        </Box>
      </Box>
      <Box as="span" sx={{ fontSize: '13px', lineHeight: '24px', fontWeight: 'normal', color: 'neutral1' }}>
        (<ETHPriceInUSD value={data.price.bn} />$
        {data.discountRatio !== 1 && (
          <>
            {' - '}
            <Trans>Save {formatNumber((1 - data.discountRatio) * 100, 0, 0)}%</Trans>
          </>
        )}
        )
      </Box>
    </Type.H5>
  )
}

const MONTHS = [1, 3, 6, 12]
function getPlanPriceConfigs(planPrice: BigNumber | undefined) {
  if (!planPrice) return [] as Config[]
  return MONTHS.map((monthCount) => {
    const price = new Num(planPrice.mul((100 - monthCount + 1) * monthCount).div(100))
    const discountRatio = (100 - monthCount + 1) / 100
    return { monthCount, price, discountRatio }
  })
}

type ActionState = 'preparing' | 'processing' | 'syncing' | 'success'
function ActionModal({
  isOpen,
  onDismiss,
  data,
  tokenId,
  method,
  labels,
  plan,
}: {
  isOpen: boolean
  onDismiss: () => void
  data: Config | undefined
  tokenId: number | undefined
  method: PricingOptionsProps['method']
  labels: PricingOptionsProps['modalLabels']
  plan: SubscriptionPlanEnum
}) {
  const { data: userSubscription } = useUserSubscription()
  const { isValid, alert } = useRequiredChain({ chainId: SUBSCRIPTION_CHAIN_ID })
  const subscriptionContract = useSubscriptionContract()
  const [state, setState] = useState<ActionState>('preparing')
  const subscriptionMutation = useContractMutation(subscriptionContract, {
    onMutate: () => {
      setState('processing')
    },
    onSuccess: () => {
      setState('syncing')
    },
    onError: () => setState('preparing'),
  } as any)

  const handleAction = () => {
    let params: any = []
    if (method === 'mint') params = [plan, data?.monthCount]
    if (method === 'extend') params = [tokenId, data?.monthCount]
    subscriptionMutation.mutate({ method, params, value: data?.price.bn })
  }
  const handleSyncSuccess = () => {
    setState('success')
  }
  const isSuccess = state === 'success'
  if (!data) return <></>
  return (
    <Modal
      isOpen={isOpen}
      title={isSuccess ? '' : labels.modalTitle}
      hasClose={state === 'preparing'}
      onDismiss={onDismiss}
      modalContentStyle={isSuccess ? { border: 'none', boxShadow: 'none' } : undefined}
      background={isSuccess ? 'transparent' : 'neutral5'}
      dismissable={false}
    >
      {!isValid && <Box p={3}>{alert}</Box>}
      {isValid && (
        <Box>
          {state === 'preparing' && (
            <Box p={3}>
              <PrepairingState config={data} label={labels.preparing} />
              <Box mb={3} />
              {subscriptionMutation.error && (
                <Type.Caption my={2} color="red1">
                  {getContractErrorMessage(subscriptionMutation.error)}
                </Type.Caption>
              )}
              <Button variant="primary" block onClick={handleAction}>
                {subscriptionMutation.error ? labels.retry : labels.idle}
              </Button>
            </Box>
          )}

          {state !== 'preparing' && !isSuccess && (
            <ProcessingState
              isProcessing={state === 'processing'}
              isSyncing={state === 'syncing'}
              onSyncSuccess={handleSyncSuccess}
              txHash={subscriptionMutation.data?.transactionHash}
              processingText={[labels.success, labels.processing]}
              upgradePlan={plan}
              prevExpiredTime={dayjs.utc(userSubscription?.expiredTime).valueOf()}
            />
          )}
          {isSuccess && <SuccessState handleClose={onDismiss} successText={labels.congrats} plan={plan} />}
        </Box>
      )}
    </Modal>
  )
}

function PrepairingState({ config, label }: { config: Config; label: ReactNode }) {
  return (
    <Box>
      <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <CopinIcon />
        <Type.Caption my={2} color="neutral1">
          <Trans>You will {label} your plan for an additional</Trans>{' '}
          <Box as="span" color="primary1">
            {config.monthCount * 30} days
          </Box>
        </Type.Caption>
        <ModalPriceFormat price={config.price} />
      </Flex>
      <Divider my={20} />
    </Box>
  )
}

export const MINT_MODAL_LABELS: ComponentConfigs['modalLabels'] = {
  modalTitle: <Trans>Mint New Subscription</Trans>,
  idle: <Trans>Mint Now</Trans>,
  retry: <Trans>Mint Again</Trans>,
  preparing: <Trans>mint</Trans>,
  processing: <Trans>Minting</Trans>,
  success: <Trans>Minted</Trans>,
  congrats: <Trans>Your NFT has been Minted successfully</Trans>,
}

export const EXTEND_MODAL_LABELS: ComponentConfigs['modalLabels'] = {
  modalTitle: <Trans>Extend Your Subscription</Trans>,
  idle: <Trans>Extend Now</Trans>,
  retry: <Trans>Extend Again</Trans>,
  preparing: <Trans>extend</Trans>,
  processing: <Trans>Extending</Trans>,
  success: <Trans>Extended</Trans>,
  congrats: <Trans>Your NFT has been extended successfully</Trans>,
}

// export default function PricingOptions({ tokenId, method, modalLabels, buttonLabel }: PricingOptionsProps) {
//   const pricePlanData = useSubscriptionPlanPrice()
//   const configs = getPlanPriceConfigs(pricePlanData?.price)
//   const { register, watch } = useForm<{ monthCount: string }>({
//     mode: 'onChange',
//     defaultValues: { monthCount: MONTHS[0].toString() },
//   })
//   const monthCount = watch('monthCount')
//   const currentSelection = monthCount && configs.find((config) => config.monthCount === Number(monthCount))

//   const [openModal, setOpenModal] = useState(false)
//   const handleOpenModal = () => setOpenModal(true)
//   const handleDismiss = () => setOpenModal(false)

//   if (!configs.length) return <></>

//   return (
//     <>
//       <Flex sx={{ flexDirection: 'column', gap: 24 }}>
//         {!!configs.length &&
//           configs.map((data, index) => {
//             return (
//               <Radio
//                 key={data.monthCount}
//                 size={20}
//                 value={data.monthCount}
//                 defaultChecked={index === 0}
//                 {...register('monthCount')}
//                 wrapperSx={{ alignItems: ['start', 'center'], '& > *:first-child': { mt: [2, 0] } }}
//                 label={
//                   <Flex ml={3} sx={{ alignItems: ['start', 'center'] }}>
//                     <Type.Caption
//                       sx={{
//                         px: 2,
//                         py: '2px',
//                         width: 80,
//                         mt: [1, 0],
//                         backgroundImage:
//                           'linear-gradient(92deg, rgba(151, 207, 253, 0.20) 57.35%, rgba(78, 174, 253, 0.20) 96.57%)',
//                         borderRadius: '2px',
//                         flexShrink: 0,
//                         textAlign: 'center',
//                       }}
//                     >
//                       {data.monthCount} {data.monthCount > 1 ? <Trans>months</Trans> : <Trans>month</Trans>}
//                     </Type.Caption>
//                     <PriceText data={data} />
//                   </Flex>
//                 }
//               />
//             )
//           })}
//       </Flex>
//       <Button
//         mt={24}
//         variant="outlinePrimary"
//         sx={{ width: 234, height: 48 }}
//         onClick={handleOpenModal}
//         key={(!currentSelection).toString()}
//         disabled={!currentSelection}
//       >
//         {buttonLabel}
//       </Button>
//       {currentSelection && (
//         <ActionModal
//           isOpen={openModal}
//           data={currentSelection}
//           onDismiss={handleDismiss}
//           tokenId={tokenId}
//           method={method}
//           labels={modalLabels}
//         />
//       )}
//     </>
//   )
// }
