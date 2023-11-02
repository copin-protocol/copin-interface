import { yupResolver } from '@hookform/resolvers/yup'
import { Trans } from '@lingui/macro'
import { ReactNode, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import {
  getConfigDetailsByKeyApi,
  requestCopyTradeConfigsApi,
  updateCopyTradeConfigApi,
} from 'apis/copyTradeConfigApis'
import ToastBody from 'components/@ui/ToastBody'
import { CopyWalletData } from 'entities/copyWallet'
import { Button } from 'theme/Buttons'
import InputField from 'theme/InputField'
import NumberInputField from 'theme/InputField/NumberInputField'
import Modal from 'theme/Modal'
import SwitchInputField from 'theme/SwitchInput/SwitchInputField'
import { Box, Flex, Type } from 'theme/base'
import { CopyTradeConfigTypeEnum } from 'utils/config/enums'
import { QUERY_KEYS } from 'utils/config/keys'
import { getErrorMessage } from 'utils/helpers/handleError'
import { parseWalletName } from 'utils/helpers/transform'

import { CopyTradeConfigFormValues, configSchema, defaultFormValues, fieldName } from './schema'

export default function SettingConfigsModal({
  selectedWallet,
  onDismiss,
  onSuccess,
}: {
  selectedWallet: CopyWalletData
  onDismiss: () => void
  onSuccess?: () => void
}) {
  const {
    control,
    watch,
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CopyTradeConfigFormValues>({
    mode: 'onChange',
    resolver: yupResolver(configSchema),
  })
  const enableMaxPositions = watch('enableMaxPositions')
  const maxPositions = watch('maxPositions')
  const initRef = useRef<boolean>(false)

  const { data, isLoading } = useQuery(
    [QUERY_KEYS.GET_COPY_TRADE_CONFIGS_BY_KEY, selectedWallet.id],
    // eslint-disable-next-line prettier/prettier
    () => getConfigDetailsByKeyApi({ exchange: selectedWallet.exchange, copyWalletId: selectedWallet.id }),
    {
      retry: 0,
    }
  )

  const handleSuccess = () => {
    onDismiss()
    onSuccess && onSuccess()
  }

  const { mutate: requestConfigs, isLoading: submittingRequest } = useMutation(requestCopyTradeConfigsApi, {
    onSuccess: async () => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Setting configs has been succeeded</Trans>} />
      )
      handleSuccess()
    },
    onError: (err) => {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })

  const { mutate: updateConfigs, isLoading: submittingUpdate } = useMutation(updateCopyTradeConfigApi, {
    onSuccess: async () => {
      toast.success(
        <ToastBody title={<Trans>Success</Trans>} message={<Trans>Update configs has been succeeded</Trans>} />
      )
      handleSuccess()
    },
    onError: (err) => {
      toast.error(<ToastBody title={<Trans>Error</Trans>} message={getErrorMessage(err)} />)
    },
  })

  useEffect(() => {
    if (!isLoading && data && !initRef.current) {
      setValue(fieldName.enableMaxPositions, data.maxPositions > 0)
      setValue(fieldName.maxPositions, data.maxPositions)
      initRef.current = true
    }
  }, [data, isLoading, setValue])

  const onSubmit = () => {
    const currentMaxPositions = enableMaxPositions ? maxPositions : 0
    if (data) {
      updateConfigs({
        configId: data.id,
        data: { maxPositions: currentMaxPositions },
      })
    } else {
      requestConfigs({
        data: {
          maxPositions: currentMaxPositions,
          identifyKey: selectedWallet.id,
          exchange: selectedWallet.exchange,
          type: CopyTradeConfigTypeEnum.COPY_WALLET,
        },
      })
    }
  }

  return (
    <Modal title={'Maximum Opening Positions'} isOpen onDismiss={onDismiss} hasClose={false}>
      <form>
        <Box px={24} pb={24}>
          <Type.Caption color="neutral2" mb={3}>
            <Trans>The maximum number of positions that can be opened at the same time per wallet</Trans>
          </Type.Caption>
          <InputField
            sx={{ mb: 3 }}
            label="Wallet Name"
            defaultValue={parseWalletName(selectedWallet)}
            block
            disabled
          />
          <SwitchInputField
            wrapperSx={{ mb: 12 }}
            switchLabel={enableMaxPositions ? <Trans>Limited</Trans> : <Trans>Unlimited</Trans>}
            {...register(fieldName.enableMaxPositions, {
              onChange: (e) => {
                const checked = e.target.checked
                if (checked) {
                  setValue(fieldName.maxPositions, maxPositions > 0 ? maxPositions : defaultFormValues?.maxPositions)
                } else {
                  trigger(fieldName.maxPositions)
                }
              },
            })}
            error={errors.enableMaxPositions?.message}
          />
          {enableMaxPositions && (
            <NumberInputField
              block
              name={fieldName.maxPositions}
              control={control}
              error={errors.maxPositions?.message}
              disabled={!enableMaxPositions}
              inputHidden={!enableMaxPositions}
              suffix={<InputSuffix>Positions</InputSuffix>}
            />
          )}
          <Flex mt={24} sx={{ gap: 3 }}>
            <Button variant="outline" onClick={onDismiss} sx={{ flex: 1 }}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              sx={{ flex: 1 }}
              onClick={onSubmit}
              isLoading={submittingRequest || submittingUpdate}
              disabled={Object.keys(errors).length > 0 || submittingRequest || submittingUpdate}
            >
              Confirm
            </Button>
          </Flex>
        </Box>
      </form>
    </Modal>
  )
}

function InputSuffix({ children }: { children: ReactNode }) {
  return <Type.Caption color="neutral2">{children}</Type.Caption>
}
