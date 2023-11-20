import { Trans } from '@lingui/macro'
import { Warning } from '@phosphor-icons/react'
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
import Alert from 'theme/Alert'
import { Button } from 'theme/Buttons'
import Modal from 'theme/Modal'
import Radio from 'theme/Radio'
import { Box, Flex, IconBox, Type } from 'theme/base'
import { formatNumber } from 'utils/helpers/format'
import { GOERLI } from 'utils/web3/chains'

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
              <Flex key={data.monthCount} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Radio
                  size={20}
                  value={data.monthCount}
                  defaultChecked={index === 0}
                  {...register('monthCount')}
                  label={
                    <Flex ml={3} sx={{ alignItems: 'center' }}>
                      <Type.Caption
                        sx={{
                          px: 2,
                          py: '2px',
                          backgroundImage:
                            'linear-gradient(92deg, rgba(151, 207, 253, 0.20) 57.35%, rgba(78, 174, 253, 0.20) 96.57%)',
                          borderRadius: '2px',
                        }}
                      >
                        {data.monthCount} {data.monthCount > 1 ? <Trans>months</Trans> : <Trans>month</Trans>}
                      </Type.Caption>
                      <Type.H5 ml={2} color="orange1">
                        <ETHPriceInUSD value={data.price.bn} />$
                        <Box as="span" ml={2} sx={{ fontSize: '13px', fontWeight: 'normal', color: 'neutral1' }}>
                          ({data.price.str}ETH
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
              </Flex>
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
  const { isValid, alert } = useRequiredChain({ chainId: GOERLI })
  const subscriptionContract = useSubscriptionContract()
  const subscriptionMutation = useContractMutation(subscriptionContract)
  const [submitting, setSubmitting] = useState(false)

  const handleExtend = () => {
    setSubmitting(true)
    subscriptionMutation.mutate(
      { method: 'extend', params: [tokenId, data?.monthCount], value: data?.price.bn },
      {
        onSuccess: async () => {
          onDismiss()
          setSubmitting(false)
        },
        onError: () => setSubmitting(false),
      }
    )
  }
  if (!data) return <></>
  return (
    <Modal
      isOpen={isOpen}
      title={<Trans>Extend Your Subscription</Trans>}
      hasClose
      onDismiss={onDismiss}
      background="neutral5"
    >
      {!isValid && <Box p={3}>{alert}</Box>}
      {isValid && (
        <Box p={3}>
          <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <CopinIcon />
            <Type.Caption my={2} color="neutral1">
              <Trans>You will extend your plan for an additional</Trans>{' '}
              <Box as="span" color="primary1">
                {data.monthCount * 30} days
              </Box>
            </Type.Caption>
            <Type.H5>
              <Box as="span" color="orange1">
                <ETHPriceInUSD value={data.price.bn} />$
              </Box>
              <Box as="span" color="neutral1" sx={{ fontSize: '13px', fontWeight: 400 }}>
                {' '}
                (~{data.price.str}ETH)
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
                After extending, please wait 5 minutes for system updates your subscription plan. We appreciate your
                patience!
              </Trans>
            }
          />
          <Button mt={3} variant="primary" block onClick={handleExtend} isLoading={submitting} disabled={submitting}>
            <Trans>Extend Now</Trans>
          </Button>
        </Box>
      )}
    </Modal>
  )
}
