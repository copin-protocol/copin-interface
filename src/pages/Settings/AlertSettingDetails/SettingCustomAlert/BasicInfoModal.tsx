import { yupResolver } from '@hookform/resolvers/yup'
import { Trans } from '@lingui/macro'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from 'theme/Buttons'
import InputField, { TextareaField } from 'theme/InputField'
import Modal from 'theme/Modal'
import { Flex, Type } from 'theme/base'
import { ALERT_CUSTOM_TYPE_TRANS } from 'utils/config/translations'

import DisplayFilter from './DisplayFilters'
import TradersTag from './TradersTag'
import { CustomAlertFormValues } from './types'
import { customSchema } from './yupSchemas'

export default function BasicInfoModal({
  defaultValues,
  submitting,
  isNew,
  isOpen,
  onSubmit,
  onDismiss,
}: {
  defaultValues: CustomAlertFormValues
  submitting?: boolean
  isNew?: boolean
  isOpen: boolean
  onSubmit: (form: CustomAlertFormValues) => void
  onDismiss?: () => void
}) {
  const { register, formState, handleSubmit } = useForm<CustomAlertFormValues>({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(customSchema),
  })

  const [showAnnotation, setShowAnnotation] = useState(false)

  const _onSubmit = (form: CustomAlertFormValues) => {
    onSubmit(form)
  }

  return (
    <Modal
      isOpen={isOpen}
      title={defaultValues.customType ? ALERT_CUSTOM_TYPE_TRANS[defaultValues.customType] : '--'}
      onDismiss={onDismiss}
      hasClose
    >
      <form onSubmit={handleSubmit(_onSubmit)}>
        <Flex flexDirection="column" flex={1} sx={{ p: 3, gap: 3, overflow: 'auto' }}>
          <InputField
            required
            block
            label={<Trans>Alert Name (Required)</Trans>}
            placeholder="Input alert name"
            defaultValue={defaultValues.name}
            {...register('name', {
              required: { value: true, message: 'This field is required' },
              onChange: (e) => {
                if (!showAnnotation) {
                  setShowAnnotation(true)
                }
              },
            })}
            maxLength={20}
            error={formState.errors?.name?.message}
          />

          <TextareaField
            block
            rows={3}
            label={<Trans>Description</Trans>}
            placeholder="Input alert description"
            defaultValue={defaultValues.description}
            {...register('description')}
            error={formState.errors?.description?.message}
            sx={{ textarea: { fontSize: 12 } }}
          />
          {defaultValues.customType === 'TRADER_FILTER' && (
            <Flex flexDirection="column">
              <Type.Caption mb={1}>
                <Trans>Trader</Trans>
              </Type.Caption>
              <DisplayFilter {...defaultValues} />
            </Flex>
          )}
          {defaultValues.customType === 'TRADER_GROUP' && (
            <Flex flexDirection="column">
              <Type.Caption mb={1}>
                <Trans>Trader</Trans>
              </Type.Caption>
              <Flex alignItems="center" sx={{ gap: 2 }}>
                {!!defaultValues?.traderGroupAdd?.length && (
                  <TradersTag title={'ADD NEW'} traders={defaultValues?.traderGroupAdd} />
                )}
                {!!defaultValues?.traderGroupUpdate?.length && (
                  <TradersTag title={'MODIFY'} traders={defaultValues?.traderGroupUpdate} />
                )}
                {!!defaultValues?.traderGroupRemove?.length && (
                  <TradersTag title={'REMOVE'} traders={defaultValues?.traderGroupRemove} />
                )}
              </Flex>
            </Flex>
          )}
        </Flex>
        <Flex
          sx={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
            px: 3,
          }}
        >
          <Button
            type="submit"
            px={0}
            variant="ghostPrimary"
            isLoading={submitting}
            disabled={submitting || Object.keys(formState.errors).length > 0}
          >
            Confirm
          </Button>
        </Flex>
      </form>
    </Modal>
  )
}
