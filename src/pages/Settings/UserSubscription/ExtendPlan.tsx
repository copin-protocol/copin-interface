import { Trans } from '@lingui/macro'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import Divider from 'components/@ui/Divider'
import ETHPriceInUSD from 'components/ETHPriceInUSD'
import Num from 'entities/Num'
import useSubscriptionContract from 'hooks/features/useSubscriptionContract'
import useSubscriptionPlanPrice from 'hooks/features/useSubscriptionPlanPrice'
import useContractMutation from 'hooks/web3/useContractMutation'
import useRequiredChain from 'hooks/web3/useRequiredChain'
import CopinIcon from 'pages/Subscription/CopinIcon'
import { ModalPriceFormat, ProcessingState, SuccessState } from 'pages/Subscription/MintButton'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import Radio from 'theme/Radio'
import { Box, Flex, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'
import { getContractErrorMessage } from 'utils/helpers/handleError'
import { SUBSCRIPTION_CHAIN_ID } from 'utils/web3/chains'

type Config = {
  monthCount: number
  price: Num
  discountRatio: number
}

const extendMonths = [1, 3, 6, 12]

export default function ExtendPlan({ tokenId }: { tokenId: number }) {
  const pricePlanData = useSubscriptionPlanPrice()
  const extendConfigs: Config[] = useMemo(() => {
    if (!pricePlanData?.price) return [] as Config[]
    return extendMonths.map((monthCount) => {
      const price = new Num(pricePlanData.price.mul((100 - monthCount + 1) * monthCount).div(100))
      const discountRatio = (100 - monthCount + 1) / 100
      return { monthCount, price, discountRatio }
    })
  }, [pricePlanData?.price])
  const { register, watch } = useForm<{ monthCount: string }>({
    mode: 'onChange',
    defaultValues: { monthCount: extendMonths[0].toString() },
  })
  const monthCount = watch('monthCount')
  const currentSelection = monthCount && extendConfigs.find((config) => config.monthCount === Number(monthCount))

  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = () => setOpenModal(true)
  const handleDismiss = () => setOpenModal(false)

  if (!extendConfigs.length) return <></>

  return (
    <>
      <Type.LargeBold mb={2}>
        <Trans>Extend plan</Trans>
      </Type.LargeBold>
      <Type.Caption mb={24}>
        <Trans>You can extend your usage, with a discounted fee compared to the original price</Trans>
      </Type.Caption>
      <Flex sx={{ flexDirection: 'column', gap: 24 }}>
        {!!extendConfigs.length &&
          extendConfigs.map((data, index) => {
            return (
              <Radio
                key={data.monthCount}
                size={20}
                value={data.monthCount}
                defaultChecked={index === 0}
                {...register('monthCount')}
                wrapperSx={{ alignItems: ['start', 'center'], '& > *:first-child': { mt: [2, 0] } }}
                label={
                  <Flex ml={3} sx={{ alignItems: ['start', 'center'] }}>
                    <Type.Caption
                      sx={{
                        px: 2,
                        py: '2px',
                        width: 80,
                        mt: [1, 0],
                        backgroundImage:
                          'linear-gradient(92deg, rgba(151, 207, 253, 0.20) 57.35%, rgba(78, 174, 253, 0.20) 96.57%)',
                        borderRadius: '2px',
                        flexShrink: 0,
                        textAlign: 'center',
                      }}
                    >
                      {data.monthCount} {data.monthCount > 1 ? <Trans>months</Trans> : <Trans>month</Trans>}
                    </Type.Caption>
                    <Type.H5
                      ml={3}
                      color="orange1"
                      sx={{
                        display: 'flex',
                        flexDirection: ['column', 'row'],
                        alignItems: ['start', 'end'],
                        flexWrap: 'wrap',
                        columnGap: 2,
                        rowGap: 0,
                      }}
                    >
                      <Box as="span" sx={{ flexShrink: 0 }}>
                        {data.price.str}
                        <Box as="span" sx={{ flexShrink: 0, fontSize: '20px', lineHeight: '28px', ml: '0.3ch' }}>
                          ETH
                        </Box>
                      </Box>
                      <Box
                        as="span"
                        sx={{ fontSize: '13px', lineHeight: '24px', fontWeight: 'normal', color: 'neutral1' }}
                      >
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
                  </Flex>
                }
              />
            )
          })}
      </Flex>
      <Button
        mt={24}
        variant="outlinePrimary"
        sx={{ width: 234, height: 48 }}
        onClick={handleOpenModal}
        key={(!currentSelection).toString()}
        disabled={!currentSelection}
      >
        <Trans>Extend</Trans>
      </Button>
      {currentSelection && (
        <ExtendModal isOpen={openModal} data={currentSelection} onDismiss={handleDismiss} tokenId={tokenId} />
      )}
    </>
  )
}

type ExtendState = 'preparing' | 'extending' | 'syncing' | 'success'
function ExtendModal({
  isOpen,
  onDismiss,
  data,
  tokenId,
}: {
  isOpen: boolean
  onDismiss: () => void
  data: Config | undefined
  tokenId: number | undefined
}) {
  const { isValid, alert } = useRequiredChain({ chainId: SUBSCRIPTION_CHAIN_ID })
  const subscriptionContract = useSubscriptionContract()
  const [state, setState] = useState<ExtendState>('preparing')
  const subscriptionMutation = useContractMutation(subscriptionContract, {
    onMutate: () => {
      setState('extending')
    },
    onSuccess: () => {
      setState('syncing')
    },
    onError: () => setState('preparing'),
  } as any)

  const handleExtend = () => {
    subscriptionMutation.mutate({ method: 'extend', params: [tokenId, data?.monthCount], value: data?.price.bn })
  }
  const handleSyncSuccess = () => {
    setState('success')
  }
  const isSuccess = state === 'success'
  if (!data) return <></>
  return (
    <Modal
      isOpen={isOpen}
      title={isSuccess ? '' : <Trans>Extend Your Subscription</Trans>}
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
              <PrepairingState config={data} />
              <Box mb={3} />
              {subscriptionMutation.error && (
                <Type.Caption my={2} color="red1">
                  {getContractErrorMessage(subscriptionMutation.error)}
                </Type.Caption>
              )}
              <Button variant="primary" block onClick={handleExtend}>
                {subscriptionMutation.error ? <Trans>Extend Again</Trans> : <Trans>Extend Now</Trans>}
              </Button>
            </Box>
          )}

          {state !== 'preparing' && !isSuccess && (
            <ProcessingState
              isProcessing={state === 'extending'}
              isSyncing={state === 'syncing'}
              onSyncSuccess={handleSyncSuccess}
              txHash={subscriptionMutation.data?.transactionHash}
              processingText={[<Trans key="extended">Extended</Trans>, <Trans key="extending">Extending</Trans>]}
            />
          )}
          {isSuccess && (
            <SuccessState
              handleClose={onDismiss}
              successText={<Trans>Your NFT has been extended successfully</Trans>}
            />
          )}
        </Box>
      )}
    </Modal>
  )
}

function PrepairingState({ config }: { config: Config }) {
  return (
    <Box>
      <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <CopinIcon />
        <Type.Caption my={2} color="neutral1">
          <Trans>You will extend your plan for an additional</Trans>{' '}
          <Box as="span" color="primary1">
            {config.monthCount * 30} days
          </Box>
        </Type.Caption>
        <ModalPriceFormat price={config.price} />
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
            After extending, please wait 5 minutes for system updates your subscription plan. We appreciate your
            patience!
          </Trans>
        }
      /> */}
    </Box>
  )
}
